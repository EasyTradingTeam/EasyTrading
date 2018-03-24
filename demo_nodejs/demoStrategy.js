

/**
 * 一个简单的策略样例
 * 
 * 开仓：
 * 申买价连续n次上涨则:对手价买开
 * 申卖价连续n次下跌则:对手价卖开 
 * 
 * 平仓：
 * 空头头寸：申买价连续n次上涨则:对手价买平
 * 多头头寸：申卖价连续n次下跌则:对手价卖平 
 **/

"use strict";

var logger = require('log4js').getLogger('strategy');
var Connector = require('./lib/Connector.js');
var CtpDict = require('./lib/CtpDict.js');
var Md = require('./lib/Md.js');
var Trade = require('./lib/Trade.js');

var MdWebSocketAddr = 'ws://127.0.0.1:9999/websocket';
var TradeWebSocketAddr = 'ws://127.0.0.1:8888/websocket';
var code = 'cu1809'; // 策略合约
var volume = 1; // 每次下单手数
var tickCache = []; // tick缓存
var trendN = 2; // tick持续n次连续上涨或下跌则下单


/**
 * 是否连续n次上涨或者下跌
 */
var getTrend = function(){ 
	if(tickCache.length <= trendN) {
		return { isUp : false , isDown : false };
	}else{
		var trend = { isUp : true , isDown : true }
		tickCache.forEach(function(each, i){
			if(i !== tickCache.length-1) trend.isUp = each.bidPrice1 < tickCache[i+1].bidPrice1  && trend.isUp; 
			if(i !== 0) trend.isDown = each.askPrice1 > tickCache[i-1].askPrice1 && trend.isDown; 
		});
		tickCache.shift(); // 删除第一个元素
		return trend;
	}
}

var mdConn = new Connector(MdWebSocketAddr,'md#');
var md = new Md(mdConn);
var tradeConn = new Connector(TradeWebSocketAddr,'trade#');
var trade = new Trade(tradeConn); 

/**
 * socket连接成功回调
 */
md.onSocketOpen = function(){
	md.regExchangeFront({"mdFrontAddr":"tcp://180.168.146.187:10010"});
};


/**
 * 期货公司前置机连接成功回调
 */
md.onFrontConnected = function(){
	logger.info('行情前置机连接成功。');
}; 

/**
 * tick回调
 */
md.onTick = function(tickData){
	logger.info("onTick 回调 : "+tickData.instrumentID+" 最新价："+tickData.lastPrice);
	if(!md.isValidTick(tickData)) {
		logger.info('噪音数据');
	}
	tickCache.push(tickData);	
	if(!trade.isLogined || trade.isBusy) {
		logger.info('用户未登陆或者正在更新用户数据');
		return ;
	}
	var pst = null;
	trade.positions.forEach(function(each){
		if(each.instrumentID === code) {
			pst = each;
			return ;
		}
	});

	var trend = getTrend(), drct=null, flag=null;
	if(pst) { // 有仓位，检查平仓  
		flag = CtpDict.CLOSE;
		if(pst.posiDirection === CtpDict.Short && trend.isUp) { // 空头头寸：申买价连续n次上涨则:对手价买平
			drct = CtpDict.BUY; 
		} else if(pst.posiDirection === CtpDict.Long && trend.isDown) { // 多头头寸：申卖价连续n次下跌则:对手价卖平
			drct = CtpDict.SELL; 
		}
	} else {// 空仓，检查开仓  
		flag = CtpDict.OPEN;
		if(trend.isUp) { // 申买价n次连续上涨:对手价买开
			flag = CtpDict.BUY;
		} else if(trend.isDown) {  // 申卖价n次连续下跌,卖开 
			flag = CtpDict.SELL;
		}
	}
	if(drct!==null && flag!==null) { // 表示满足条件
		trade.orderInsert({ 
			direction : drct,  // 买卖
			offsetFlag : flag, // 开平
			code : code, // 合约
			orderRef : trade.getOrderRef(),  // 获取报单引用
			price : (flag === CtpDict.BUY ? tickData.askPrice1 : tickData.bidPrice1), // 对手价下单
			volume : volume, //  手数
			timeCondition : CtpDict.ORDER_TimeCondition.IOC, // 立即成交，否则撤销 
		});
	}
};

/**
 * socket连接成功回调
 */
trade.onSocketOpen = function(){
	trade.regExchangeFront({
		tradeFrontAddr : 'tcp://180.168.146.187:10001',
		brokerId:  '9999',
		userId:  '111340',
		password:  '111111?'
	} );
};

/**
 * 期货公司前置机连接成功回调
 */
trade.onFrontConnected = function(){
	trade.login(function(datas, err, isLast){
		if(isLast && !err) { // 用户登陆成功后订阅行情
			md.regTick(code);
		}
	});
}; 

/**
 * 订单状态回报
 **/
trade.onOrder = function(datas, err, isLast){ 
	logger.info("onOrder: %s(%s), %s(%s)", datas.instrumentID, datas.orderRef, datas.statusMsg, datas.orderStatus);
};


/**
 * 订单成交回报
 **/
trade.onTrade = function(datas, err, isLast){ 
	logger.info("onTrade : %s %s%s %s手 成交价格: %s", datas.instrumentID, datas.direction === '0' ? '买' : '卖', 
			datas.offsetFlag === '0' ? '开' : '平', datas.volume, datas.price);
};

/**
 * 订单失败回报
 **/
trade.onRtnTradeFaild = function(){ 
	logger.warn('失败订单：%s ', JSON.stringify(arguments));
};

// 连接socket
mdConn.connect();
tradeConn.connect();