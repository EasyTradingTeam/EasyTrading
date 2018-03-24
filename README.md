#  期货程序化交易
 可以快速实现期货程序化交易的框架
 
 
## 适用人群：
 1、想快速实现程序化期货交易的。<br>
 2、有一定javascrit脚本语言基础的。<br>
 
## 程序介绍：
 1、本程序可以实盘交易，开过户即可实盘。<br>
 2、客户端用来执行策略，可以通过NodeJs编写或者在360浏览器中调试。<br>
 3、服务端和客户端通过WebSocket通信。<br>
 4、本程序使用CTP接口。<br>
 
## 通过本程序您可以：
 1、3分钟开始程序化交易，仅需要一点的javascript脚本语言基础。<br>
 2、模拟交易国内4大期货交易所所有合约品种。<br>
 3、如果您有实盘账户，可以立即实盘操作，需要填写正确的前置机地址以及期货公司编号。![期货公司前置机](https://raw.githubusercontent.com/EasyTradingTeam/EasyTrading/master/doc/前置机地址大全2.txt)。<br>
 
## 让我们开始吧：
 1、[下载程序](https://raw.githubusercontent.com/EasyTradingTeam/EasyTrading/master/EasyTradingTeam.rar) 并解压缩到当前目录<br>
 2、进入目录service 双击 "ctp.2018-02-11.exe" 运行服务端程序。程序会监听交易端口：8888，行情端口：9999（执行 ctp.2018-02-11.exe --help 查看使用方法）。<br>
 3、Nodejs Demo 执行方法： 打开dos窗口，进入/demo_nodejs目录。测试行情： node demoMd ，测试交易： node demoTrade ，测试策略：node demoStrategy 。<br>
 4、Html5 demo 执行方法：进入/demo_html5 目录，直接用浏览器打开demoMd.html 或  demoTrade.html 即可（推荐使用chrome 或者 360浏览器）。
 
## 效果如下：
 行情示例截图：<br>
 ![行情](https://raw.githubusercontent.com/EasyTradingTeam/EasyTrading/master/demo/行情示例截图.png)<br><br>
 交易示例截图：<br>
 ![行情](https://raw.githubusercontent.com/EasyTradingTeam/EasyTrading/master/demo/交易示例截图.png)<br><br>
 
 
## BUG反馈：
841021233@qq.com <br>
QQ官方群： 705091132
