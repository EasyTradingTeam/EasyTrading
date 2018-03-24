
 
var Connector = require('./lib/Connector.js');
var CtpDict = require('./lib/CtpDict.js'); 
var Trade = require('./lib/Trade.js');


var tradeConn = new Connector('ws://127.0.0.1:8888/websocket','trade#');
var trade = new Trade(tradeConn); 

var testOrderInsert = function(){
	trade.orderInsert({ 
		direction : CtpDict.BUY,  
		offsetFlag : CtpDict.OPEN, 
		code : 'i1805',
		orderRef : trade.getOrderRef(), 
		price : '520',
		volume : 1,
		timeCondition : CtpDict.ORDER_TimeCondition.IOC, // 立即成交，否则撤销 
	});
}

trade.onSocketOpen = function(){
	trade.regExchangeFront({
		tradeFrontAddr : 'tcp://180.168.146.187:10001',
		brokerId:  '9999',
		userId:  '111340',
		password:  '111111?'
	} );
};

trade.onFrontConnected = function(){
	trade.login(function(datas, err, isLast){
		if(isLast && !err) {
			testOrderInsert();
		};
	});
}; 

/**
 * 订单状态回报
 **/
trade.onOrder = function(datas, err, isLast){ 
	console.info("onOrder: %s(%s), %s(%s)", datas.instrumentID, datas.orderRef, datas.statusMsg, datas.orderStatus);
};


/**
 * 订单成交回报
 **/
trade.onTrade = function(datas, err, isLast){ 
	console.info("onTrade : %s %s%s %s手 成交价格: %s", datas.instrumentID, datas.direction === '0' ? '买' : '卖', 
			datas.offsetFlag === '0' ? '开' : '平', datas.volume, datas.price);
};

/**
 * 订单失败回报
 **/
trade.onRtnTradeFaild = function(){ 
	console.warn('onRtnTradeFaild ：%s ', JSON.stringify(arguments));
};

tradeConn.connect();