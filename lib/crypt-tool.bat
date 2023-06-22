@echo off
set SCRIPT_DIR=%0\..

set ACTION=%1
set ALGORITHM=%2
set MODE=%3
set KEY=%4
set VALUE=%5
set OUTPUT=%6

java -cp %SCRIPT_DIR%/secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool ^
string ^
%ACTION% ^
%ALGORITHM% ^
%MODE% ^
%KEY% ^
"%VALUE%"
