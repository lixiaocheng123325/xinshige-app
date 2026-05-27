@echo off
echo [心事盒] 启动后端服务...
cd /d "%~dp0backend"
if not exist node_modules (
  echo 正在安装依赖，请稍候...
  npm install
)
if not exist .env (
  copy .env.example .env
  echo 已创建 .env 文件，请先编辑配置后再启动
  pause
  exit
)
npm run start:dev
pause
