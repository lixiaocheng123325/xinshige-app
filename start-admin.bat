@echo off
echo [心事盒] 启动管理后台...
cd /d "%~dp0admin"
if not exist node_modules (
  echo 正在安装依赖，请稍候...
  npm install
)
npm run dev
pause
