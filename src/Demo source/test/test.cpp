//������ָ������ģ���˻�TD  API
//������  2017.7.25   QQȺ��5172183

#include "stdafx.h"
#include "ThostFtdcUserApiDataType.h"
#include "ThostFtdcUserApiStruct.h"
#include "TraderSpi.h"
//#include "ThostTraderApi.h"

CThostFtdcTraderApi *pUserApi;
CTraderSpi  *pUserSpi;
char  FRONT_ADDR[] = "tcp://127.0.0.1:41206";		    // ǰ�õ�ַ

TThostFtdcBrokerIDType	BROKER_ID = "9999";				// ���͹�˾����
TThostFtdcInvestorIDType INVESTOR_ID = "00069";			// Ͷ���ߴ���
TThostFtdcPasswordType  PASSWORD = "888888";			// �û�����
TThostFtdcInstrumentIDType INSTRUMENT_ID = "cu1712";	// ��Լ����
TThostFtdcDirectionType	DIRECTION = THOST_FTDC_D_Sell;	// ��������
TThostFtdcPriceType	LIMIT_PRICE = 38850;				// �۸�

														// ������
int iRequestID = 0;
int main()
{
	cerr << "--->>> " << "Initialing kucps UserApi" << endl;
	pUserApi = CThostFtdcTraderApi::CreateFtdcTraderApi();			// ����UserApi
	pUserSpi = new CTraderSpi;
	pUserApi->RegisterSpi((CThostFtdcTraderSpi*)pUserSpi);			// ע���¼���
	//pUserApi->SubscribePublicTopic(TERT_RESTART);					// ע�ṫ����
	//pUserApi->SubscribePrivateTopic(TERT_RESTART);					// ע��˽����
	pUserApi->RegisterFront(FRONT_ADDR);							// connect
	pUserApi->Init();


	cerr << "--->>> " << "kucps ThostTraderApi Initialization complete." << endl;
	//cerr << "--->>> " << "��ʾ�汾���벻Ҫ��ʱ�����." << endl;
	system("pause");

}

