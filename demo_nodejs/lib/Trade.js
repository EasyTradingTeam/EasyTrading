
"use strict";

var logger = require('log4js').getLogger('Trade')  
;

function Trade(conn) {
	if(!conn) {
		throw new Error('参数不正确！');
	}
	if (!(this instanceof Trade)) {
		return new Trade(conn);
	}
	this.exchangeParam = {};
	this.req = conn.req; 
	this.spi = conn.spi; 
	this.isBusy = false;
	this.frontConnectedCallback = new Function();
	
	this.isLogined = false;
	this.loginInfo = {};
	this.money = null; 
	this.positions = [];
	this.orders = [];	
	
	conn.registSPI(this);
	
	/**var self = this; 
	this.spi.onSocketOpen = function(){
		self.regExchangeFront(self.exchangeParam, self.frontConnectedCallback);
	};
	this.spi.frontConnected = function(){
		logger.info('交易前置机连接成功。');
		self.frontConnectedCallback();
	};
	this.spi.onSocketOpen = this.onSocketOpen;
	this.spi.onSocketClose = this.onSocketClose;
	this.spi.onFrontConnected = this.onFrontConnected;
	this.spi.onFrontDisConnect = this.onFrontDisConnect;
	this.spi.onOrder = this.onOrder;
	this.spi.onTrade = this.onTrade;
	this.spi.onRtnTradeFaild = this.onRtnTradeFaild; 
	**/
}  


/**
 * 注册前置机
 * 
 * @param params 前置机地址信息：包括资金账号密码
 * @param callback 前置机连接成功回调，断线后会自动连接
 **/
Trade.prototype.regExchangeFront = function(params, callback){
	logger.debug('正在注册交易前置机 : %s', params.tradeFrontAddr);
	if(!params.tradeFrontAddr) {
		throw new Error('行情前置机参数不正确');
	} 
	this.exchangeParam = params; 
	this.frontConnectedCallback = callback;
	if(this.req.isConnected) { 
		this.req.send('regExchangeFront', params);
	}else{
		logger.debug('socket未连接');
		var self = this;
		setTimeout(function(){
			self.regExchangeFront(params, callback);
		}, 1000 * 3);
	} 
};


/**
 * 用户登录
 * @param callback 登陆成功回调 
 */
Trade.prototype.login = function(callback){
	var self = this, isFirstRsp = true;
	this.req.send('reqUserLogin',{}, function(datas, err, isLast){
		if(err) {
			logger.info("用户登录错误："+err);
			if(err.indexOf('不合法的登录') !== -1) {
				logger.info("用户名或者密码错误！");
				if(callback) callback(datas, err, true);
			}else{
				setTimeout(function(){
					logger.info("正在重试登录...");
					self.login(callback);
				}, 1000*60*10);
			}
			return;
		}
		
		if(isFirstRsp && datas) { // 登陆成功响应消息
			isFirstRsp = false;
			if(!datas.maxOrderRef) {
				throw new Error('无法获取登陆响应信息：maxOrderRef');
			} 
			self.loginInfo = datas;
		}
		
		// 如果登录成功，会回调一次，isLast:false,确认账单结果回调一次，isLast:true
		// 如果登录失败，仅回调一次，isLast:true
		if(isLast) {
			logger.info("%s 正在更新用户信息！", self.loginInfo.userID); 
			self.refresh(function(){
				self.isLogined = true; 
				logger.info("%s 登陆成功！", self.loginInfo.userID); 
				if(callback){ callback(datas, err, isLast); } 
			});
		}
	});
};


/**
 * 获取报单引用：每次只能递增
 */
Trade.prototype.getOrderRef = function(){ 
	return ++this.loginInfo.maxOrderRef ;
}


/**
 * 下单函数
 * @param params 下单参数
 */
Trade.prototype.orderInsert = function(params){
	logger.info('正在下单：%s', JSON.stringify(params));
	this.req.send('reqOrderInsert', params);
}


/**
 * 更新用户资金账号信息
 * @param callback 成功后回调 
 */
Trade.prototype.refreshMoney = function(callback){
	logger.info('正在更新用户资金账号信息');
	this.isBusy = true; 
	var self = this;
	this.req.send('reqQryTradingAccount',{}, function(datas, err, isLast){ 
		if(isLast && !err) { 
			self.isBusy = false;
			logger.info("用户资金更新成功。");  
			self.money = datas;
			if(callback) callback(datas);
		}
	});
}


/**
 * 更新用户持仓
 * @param callback 成功后回调 
 */
Trade.prototype.refreshPositions = function(callback){
	logger.info('正在更新用户持仓'); 
	this.isBusy = true;
	this.positions = [];
	var self = this;
	this.req.send('reqQryInvestorPositionDetail',{}, function(datas, err, isLast){
		if(datas) {
			self.positions.push(datas);
		}
		if(isLast && !err) { 
			self.isBusy = false;
			logger.info("用户持仓更新成功。"); 
			if(callback) callback(datas);
		}
	});
}


/**
 * 更新用户挂单
 * @param callback 成功后回调 
 */
Trade.prototype.refreshOrders = function(callback){ 
	logger.info('正在更新用户挂单'); 
	this.isBusy = true;
	this.orders = [];
	var self = this;
	this.req.send('reqQryOrder',{}, function(datas, err, isLast){
		if(datas) {
			self.orders.push(datas);
		}
		if(isLast && !err) { 
			self.isBusy = false;
			logger.info("用户委托单更新成功。"); 
			if(callback) callback(datas);
		}
	});
}


/**
 * 更新用户信息
 * @param callback 成功后回调 
 */
Trade.prototype.refresh = function(callback){
	var self = this;
	this.refreshMoney(function(){
		self.refreshPositions(function(){
			self.refreshOrders(callback);
		});
	});
}

module.exports = Trade;
