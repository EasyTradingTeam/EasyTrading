
"use strict";

var logger = require('log4js').getLogger('Connector');
var WebSocket = require('ws');
var connCount = 0;

function Connector(addr, name) {
	if(!addr) {
		throw new Error('参数不正确！');
	}
	if (!(this instanceof Connector)) {
		return new Connector(addr);
	}
	this.addr = addr;
	
	this.name = name || 'conn'+(++connCount)+'# ';
	this.req = {};
	this.spi = {};
	this._socket = {};
}

Connector.prototype.registSPI = function(spi){ 
	this.spi = spi;
}

Connector.prototype._wrap = function(){ 
	var self = this;
	this._socket.on('open', function(){ 
		self.req.isConnected = true; 
		logger.info('%s onSocketOpen ：%s   ', self.name, self._socket.url);  
		if(self.spi.onSocketOpen) self.spi.onSocketOpen();
	});
	this._socket.on('error', function () {//连接发生错误的回调方法
		logger.info("%s WebSocket在 : %s 连接失败。",self.name ,self._socket.url);
	}); 
	
	this._socket.on('message', function (datas) { //接收到消息的回调方法
		var obj = JSON.parse(datas);
		logger.info('%s recived(%s) ：%s',self.name ,(obj.reqId||obj.handle), JSON.stringify(datas));  
		if(self.spi[obj.handle]) {
			self.spi[obj.handle](obj.datas);
		}else if(self.req._callbacks[obj.reqId]) {
			self.req._callbacks[obj.reqId](obj.datas, obj.err, obj.isLast);
		}
	});
	
	this._socket.on('close', function () { //连接关闭的回调方法
		logger.info("%s WebSocket连接关闭", self.name);
		self.req.isConnected = false;
		if(self.spi.onSocketClose) self.spi.onSocketClose();
	});
	
	self.req._reqId = 0; 
	self.req.isConnected = false;  
	self.req._callbacks = {}; 
	self.req.send = function(method, params, callback){
		var reqId = ++self.req._reqId ;
		var reqObj = {
			"handle":method,
			"params":params,
			"reqId": reqId
		};
		var json = JSON.stringify(reqObj);
		logger.info('%s send(%s) : %s',self.name,reqId, json);
		if(!self.req.isConnected) {
			logger.info('%s websocket 未连接', self.name);
			return ;
		}
		self._socket.send(json);
		self.req._callbacks[reqId] = callback;
	};
	self.req._sendHeartBeat = function(){
		setInterval(function(){
			if(self.req.isConnected) {  
				self._socket.send('');  
			}
		} , 1000*60*1);
	};
	self.req._sendHeartBeat();
}

Connector.prototype.connect = function(){ 
	logger.info('%s connecting to : %s',this.name, this.addr);
	var webSocket = WebSocket.connect(this.addr);  
	this._socket = webSocket;
	this._wrap(); 
}
module.exports = Connector;