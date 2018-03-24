@echo off
title node-debug
echo 调试步骤：
echo 执行此文件后
echo 新建cmd窗口并执行：
echo 例如 node debug test.js
echo 或者 node --debug-brk test.js
echo 或者改变端口：$ node-inspector --web-port 8080 --debug-port 5858
echo 然后打开浏览器输入 http://127.0.0.1:8080/?port=5858
echo （使用chrome浏览器可以直接修改代码，同步保存）
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