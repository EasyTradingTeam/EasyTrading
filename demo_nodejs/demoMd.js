var Connector = require('./lib/Connector.js');
var Md = require('./lib/Md.js');

var mdConn = new Connector('ws://127.0.0.1:9999/websocket','md#');
var md = new Md(mdConn);

md.onSocketOpen = function(){
	md.regExchangeFront({"mdFrontAddr":"tcp://180.168.146.187:10010"});
};

md.onFrontConnected = function(){
	console.info('行情前置机连接成功。');
	md.regTick('i1809'); 
};  

/**
/// tickData字段名称（首个字母小写）：
///交易日 TradingDay;
///合约代码 InstrumentID;
///交易所代码  ExchangeID;
///合约在交易所的代码  ExchangeInstID;
///最新价  LastPrice;
///上次结算价  PreSettlementPrice;
///昨收盘  PreClosePrice;
///昨持仓量  PreOpenInterest;
///今开盘  OpenPrice;
///最高价  HighestPrice;
///最低价  LowestPrice;
///数量  Volume;
///成交金额  Turnover;
///持仓量  OpenInterest;
///今收盘  ClosePrice;
///本次结算价  SettlementPrice;
///涨停板价  UpperLimitPrice;
///跌停板价  LowerLimitPrice;
///昨虚实度  PreDelta;
///今虚实度  CurrDelta;
///最后修改时间  UpdateTime;
///最后修改毫秒 UpdateMillisec;
///申买价一  BidPrice1;
///申买量一  BidVolume1;
///申卖价一  AskPrice1;
///申卖量一  AskVolume1;
**/
md.onTick = function(tickData){
	console.info("onTick 回调 : "+tickData.instrumentID+" 最新价："+tickData.lastPrice);
};

mdConn.connect();