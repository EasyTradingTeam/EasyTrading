/**
 * 字段参考：
 * 
 * http://blog.csdn.net/qq_23217707/article/details/49865105
 */

var CtpDict = {};

/**
 * 买卖反向
 */
CtpDict.ORDER_DirectionFlagType={
	Buy : '0', // 买
	Sell : '1' // 卖
};

/**
 * TFtdcOffsetFlagType是一个开平标志类型
 * 上交所专门区分了平今与平昨，使用错了会提示平仓数不足。
 * THOST_FTDC_OF_Open::0,THOST_FTDC_OF_Close::1,THOST_FTDC_OF_CloseToday::3
 * 
 * CTP层次（在发往相关交易所之前，CloseToday或CloseYesterday在CTP后台会进行相应的转化）：
 * （1）如果不是上期所，平今仓可用close或closeToday，平昨仓可用close或closeYesterday。
 * （2）如果是上期所，平今仓只可用closeToday，平昨仓可用close或closeYesterday。
 * 
 */
CtpDict.ORDER_OffsetFlagType={
	Open : '0', //开仓
	Close : '1',//平仓（上期所为平昨与‘4’相等）
	ForceClose : '2',//强平
	CloseToday : '3',//平今
	CloseYesterday : '4',//平昨(只有上期所支持此值)
	ForceOff : '5',//强减
	LocalForceClose : '6'//本地强平
};

/**
 * 持仓头寸反向
 */
CtpDict.PD={
	Long : '2', // 多头
	Short : '3', // 空头
	Net : '1' // ??
};

/**
 * 持仓头寸日期
 */
CtpDict.PSD={
	History : '2', //历史持仓
	Today : '1' //今日持仓
};


/**
 * 组合投机套保标记
 * 目前普通客户开通的账户只能下投机，所以第四个参数直接使用"11"最省事。
 * 组合开平标记和组合投机套保标记的写法有些特别，
 * CTP支持组合单，组合单至少由两腿组成，如何区分每腿的开平与投保呢？
 * 那就是用的组合开平与组合投保了，第一个字符就标记的第一腿，
 * 第二个字符标示的第二腿，以此类推。
 */
CtpDict.ORDER_HedgeFlagType={
	Speculation : '1',//投机
	Arbitrage : '2',//套利
	Hedge : '3'//套保
};

/**
 * 报单价格条件类型
 * 交易所只部分支持，目前仅使用两种价格类型即可，限价与市价，上海不支持市价单，中金股指两个远月不支持市价。
 */
CtpDict.ORDER_PriceType={
	AnyPrice : '1', // 市价单 --模拟交易:不支持的报单类型
	LimitPrice : '2', // 限价单
	BestPrice : '3', // 最优价 --模拟交易:不支持的报单类型
	LastPrice : '4', // 最新价 --模拟交易：报单字段错误
	LastPricePlusOneTicks : '5', // 最新价浮动上浮1个ticks --模拟交易：报单字段错误
	LastPricePlusTwoTicks : '6', // 最新价浮动上浮2个ticks
	LastPricePlusThreeTicks : '7', // 最新价浮动上浮3个ticks
	AskPrice1 : '8', // 申卖价一 --模拟交易：报单字段错误
	AskPrice1PlusOneTicks : '9', // 卖一价浮动上浮1个ticks
	AskPrice1PlusTwoTicks : 'A', // 卖一价浮动上浮2个ticks
	AskPrice1PlusThreeTicks : 'B', // 卖一价浮动上浮3个ticks
	BidPrice1 : 'C', // 买一价 --模拟交易：报单字段错误
	BidPrice1PlusOneTicks : 'D', // 买一价浮动上浮1个ticks
	BidPrice1PlusTwoTicks : 'E', // 买一价浮动上浮2个ticks
	BidPrice1PlusThreeTicks : 'F', // 买一价浮动上浮3个ticks
};
/**
 * 成交量类型
 */
CtpDict.ORDER_VolumeCondition={
	AV : '1' ,//任何数量
	MV : '2',//最小数量
	CV : '3'//全部数量
};
/**
 * 有效期类型
 */
CtpDict.ORDER_TimeCondition={
	IOC : '1',//市价.立即完成，否则撤销
	GFS : '2',//本节有效
	GFD : '3', //限价、条件单.当日有效     
	GTD : '4',//指定日期前有效
	GTC : '5',//撤销前有效
	GFA : '6'//集合竞价有效
};

/**
 * 触发条件类型
 */
CtpDict.ORDER_ContingentCondition={
	Immediately : '1',//立即
	Touch : '2',//止损
	TouchProfit : '3',//止赢
	ParkedOrder : '4',//预埋单
	LastPriceGreaterThanStopPrice : '5',//最新价大于条件价
	LastPriceGreaterEqualStopPrice : '6',//最新价大于等于条件价
	LastPriceLesserThanStopPrice : '7',//最新价小于条件价
	LastPriceLesserEqualStopPrice : '8',//最新价小于等于条件价
	AskPriceGreaterThanStopPrice : '9',//卖一价大于条件价
	AskPriceGreaterEqualStopPrice : 'A',//卖一价大于等于条件价
	AskPriceLesserThanStopPrice : 'B',//卖一价小于条件价
	AskPriceLesserEqualStopPrice : 'C',//卖一价小于等于条件价
	BidPriceGreaterThanStopPrice : 'D',//买一价大于条件价
	BidPriceGreaterEqualStopPrice : 'E',//买一价大于等于条件价
	BidPriceLesserThanStopPrice : 'F',//买一价小于条件价
	BidPriceLesserEqualStopPrice : 'H'//买一价小于等于条件价
};

/**
 * 报单状态类型
 * 订单状态：onRtnOrder回调时包含订单状态(orderStatus)
 */
CtpDict.ORDER_Status = {
	AllTraded : '0',//全部成交  --->最终状态
	PartTradedQueueing : '1',//部分成交还在队列中,部分成交，剩余部分在等待成交
	PartTradedNotQueueing : '2',//部分成交不在队列中，部分成交，剩余部分已撤单  --->最终状态。
	NoTradeQueueing : '3',//未成交还在队列中，报单发往交易所，正在等待成交
	NoTradeNotQueueing : '4',//未成交不在队列中，报单还未发往交易所   --->最终状态
	Canceled : '5',//撤单-->最终状态
	Unknown : 'a',//未知：报单已经被CTP接收，但还没发往交易所。
	NotTouched : 'b',//尚未触发，预埋单尚未达到触发下单条件，客户端还未执行下单动作
	Touched : 'c',//已触发
	Error : 'e',//错单//自定义添加
};

/**
 * 订单操作:
 * 报单的撤销、报单的挂起、报单的激活、报单的修改。
 * 目前仅支持Delete
 */
CtpDict.ORDER_Action = {
	'Delete' : 0,
	// 'Modify' : 3
};

/**
 * 订单类型字符串
 * 2个字符：第一个买卖方向，第二个开平标志
 */
CtpDict.Order_Type_Str = {
	'00':'买开',
	'10':'卖开',
	'01':'买平',
	'11':'卖平',
	'03':'买平今',
	'13':'卖平今'
};

CtpDict.BUY = CtpDict.ORDER_DirectionFlagType.Buy;
CtpDict.SELL = CtpDict.ORDER_DirectionFlagType.Sell;
CtpDict.OPEN = CtpDict.ORDER_OffsetFlagType.Open;
CtpDict.CLOSE = CtpDict.ORDER_OffsetFlagType.Close; // 平仓（上期所为平昨仓，其它交易所为平今或者平昨）
CtpDict.CLOSE_TODAY = CtpDict.ORDER_OffsetFlagType.CloseToday; // 平今（只针对上期所，其它交易所不使用此值）
CtpDict.Long = CtpDict.PD.Long;
CtpDict.Short = CtpDict.PD.Short;

module.exports = CtpDict;