@echo off
title node-debug
echo ���Բ��裺
echo ִ�д��ļ���
echo �½�cmd���ڲ�ִ�У�
echo ���� node debug test.js
echo ���� node --debug-brk test.js
echo ���߸ı�˿ڣ�$ node-inspector --web-port 8080 --debug-port 5858
echo Ȼ������������ http://127.0.0.1:8080/?port=5858
echo ��ʹ��chrome���������ֱ���޸Ĵ��룬ͬ�����棩
echo,
echo,
echo,
echo,

@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\node-inspector\bin\inspector.js" --save-live-edit %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\node_modules\node-inspector\bin\inspector.js" --save-live-edit %*
)