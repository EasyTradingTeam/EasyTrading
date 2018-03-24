
"use strict";

var logger = require('log4js').getLogger('Md')  
;
var unTradeHour = [4,5,6,7,8,12,15,16,17,18,19,20];

function Md(conn) {
	if(!conn) {
		throw new Error('参数不正确！');
	}
	if (!(this instanceof Md)) {
		return new Md(conn);
	}
	this.exchangeParam = {};
	this.req = conn.req; 
	this.spi = conn.spi; 
	this._subscribeCache = [];
	
	conn.registSPI(this);
	
	/**var self = this;  
	this.spi.onSocketOpen = function(){
		self.regExchangeFront(self.exchangeParam);
	};
	this.spi.frontConnected = function(){
		logger.info('行情前置机连接成功。');
		self._subscribeCache.forEach(function(code){
			self.regTick(code);
		});
	};**/
	//this.spi.onSocketOpen = this.onSocketOpen;
	//this.spi.onSocketClose = this.onSocketClose;
	//this.spi.onFrontConnected = this.onFrontConnected;
	//this.spi.onFrontDisConnect = this.onFrontDisConnect;
	//this.spi.onTick = this.onTick;
}  


/**
 * 注册前置机
 * 
 * @param params 前置机地址信息：包括资金账号密码
 * @param callback 前置机连接成功回调，断线后会自动连接
 **/
Md.prototype.regExchangeFront = function(params, callback){
	logger.debug('正在注册行情前置机 : %s', params.mdFrontAddr);
	if(!params.mdFrontAddr) {
		throw new Error('行情前置机参数不正确');
	}
	this.exchangeParam = params;
	if(this.req.isConnected) { 
		this.req.send('regExchangeFront', params);
	}else{
		logger.debug('websocket未连接');
		var self = this;
		setTimeout(function(){
			self.regExchangeFront(params, callback);
		}, 1000 * 3);
	}
};


/**
 * 订阅行情
 * 
 * @param codes 多个合约以','分割 
 **/
Md.prototype.regTick = function(codes){
	logger.debug('订阅行情 : %s', codes); 
	this.req.send('regTick',{'code':codes});
};

/**
 * 是否为有效的tick
 * 
 * 08:55～08:59 集合竞价，可以报单
 * 08:59～09:00 撮合成交，不能报单
 * 09:00～ 连续竞价，可以报单
 */
Md.prototype.isValidTick = function(tickData) {
	if(global.isTesting) {
		logger.warn('测试环境，不验证tick的合法性。');
		return true;
	}

	var tickTime = new Date(tickData.tickDateTime);
	
	// 服务器与交易所时间有差，0点的时候为有效tick
	// 避免此类数据误判：tickTime":"2018-01-26 00:01:00.0","serverTime":"2018-01-26 23:59:49.247" ,时间相差23+小时
	if(tickTime.getHours() === 0) {
		return true;
	}
	
	// 与服务器时间间隔10分钟以上，不是有效数据
	if(Math.abs(tickTime.getTime() - new Date().getTime()) > 1000 * 60 * 10) {
		return false;
	}
	if(tickData.volume <= 0) { // 成交量<=0，不是有效数据
		return false;
	}
	if(unTradeHour.indexOf(tickTime.getHours()) !== -1) { // 不在交易时间内
		var _time = tickTime.format('hh:mm:ss');
		
		if(_time.indexOf('08:59') !== -1) { // 早盘集合竞价后撮合成交 08:59～09:00 不能报单
			return true;
		}else if(_time.indexOf('20:59') !== -1) { // 20:59:00.500 晚盘集合竞价后撮合成交，不能报单
			return true;
		}else if(_time === '15:00:00') { // 当天最后一笔数据
			return true;
		}
		return false;
	}
	
	return true;
};

module.exports = Md;
