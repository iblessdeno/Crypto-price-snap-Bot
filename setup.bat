@echo off
echo Setting up Crypto Price Bot...

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please install Node.js v16 or higher from https://nodejs.org/
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm is not installed! Please install npm.
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies!
    exit /b 1
)

:: Build the frontend
echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Failed to build frontend!
    exit /b 1
)

:: Check for .env file
if not exist .env (
    echo Creating .env file...
    echo TELEGRAM_BOT_TOKEN=your_telegram_bot_token>.env
    echo COINMARKETCAP_API_KEY=your_coinmarketcap_api_key>>.env
    echo Please edit the .env file with your actual tokens
)

:: Create necessary directories
if not exist logs mkdir logs
if not exist screenshots mkdir screenshots

:: Start the services
echo Starting services...
start "Frontend Server" cmd /k "npm run server"
timeout /t 5
start "Telegram Bot" cmd /k "npm run telegram-bot"
start "WhatsApp Bot" cmd /k "npm run whatsapp-bot"

echo Setup complete! Please check the console windows for any errors.
echo Don't forget to:
echo 1. Edit the .env file with your actual tokens
echo 2. Scan the WhatsApp QR code when prompted
pause
