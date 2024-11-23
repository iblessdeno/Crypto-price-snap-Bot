#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting CryptoSnap Bot Auto Installer...${NC}"

read -p "Enter your Telegram Bot Token: " TELEGRAM_BOT_TOKEN
read -p "Enter your CoinMarketCap API Key: " COINMARKETCAP_API_KEY

echo -e "${GREEN}Updating system and installing prerequisites...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nano wget build-essential

echo -e "${GREEN}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo -e "${GREEN}Installing Git...${NC}"
sudo apt install -y git

echo -e "${GREEN}Installing Puppeteer dependencies...${NC}"
sudo apt install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    libgbm1

echo -e "${GREEN}Installing Chromium...${NC}"
sudo apt install -y chromium-browser

echo -e "${GREEN}Cloning CryptoSnap Bot repository...${NC}"
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/iblessdeno/Crypto-price-snap-Bot.git
cd Crypto-price-snap-Bot

echo -e "${GREEN}Installing project dependencies...${NC}"
npm install

echo -e "${GREEN}Creating .env file...${NC}"
cat <<EOF > .env
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
COINMARKETCAP_API_KEY=$COINMARKETCAP_API_KEY
EOF

echo -e "${GREEN}Building frontend...${NC}"
npm run build

echo -e "${GREEN}Installing PM2...${NC}"
sudo npm install -g pm2

echo -e "${GREEN}Creating PM2 ecosystem config...${NC}"
cat <<EOF > ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'crypto-web',
      script: './server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      exec_mode: 'fork',
      instances: 1,
      node_args: '--experimental-specifier-resolution=node',
      interpreter: 'node',
      interpreter_args: '--es-module-specifier-resolution=node'
    },
    {
      name: 'crypto-bot',
      script: './telegram-bot.js',
      env: {
        NODE_ENV: 'production'
      },
      exec_mode: 'fork',
      instances: 1,
      exp_backoff_restart_delay: 100,
      node_args: '--experimental-specifier-resolution=node',
      interpreter: 'node',
      interpreter_args: '--es-module-specifier-resolution=node',
      wait_ready: true,
      kill_timeout: 3000
    }
  ]
};
EOF

echo -e "${GREEN}Building and starting services...${NC}"
npm run build
pm2 delete all || true
pm2 start ecosystem.config.cjs
pm2 save

echo -e "${GREEN}Setting PM2 to start on boot...${NC}"
pm2 startup
eval $(pm2 startup | grep sudo)

echo -e "${GREEN}CryptoSnap Bot setup is complete!${NC}"
echo -e "${GREEN}To check services, use:${NC} pm2 list"
echo -e "${GREEN}To view logs, use:${NC} pm2 logs"
