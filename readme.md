# CryptoSnap Bot 📈

A Telegram bot that provides real-time cryptocurrency prices and market trends with instant chart screenshots.


## Features

- Live cryptocurrency price tracking
- Top cryptocurrencies overview
- Global market statistics
- Beautiful card-based UI
- Screenshot generation

## Bot Commands

- `/price [symbol]` - Get price info (e.g., `/price BTC`)
- `/top` - View top cryptocurrencies
- `/market` - View market overview

## Prerequisites

Before starting, you'll need:

1. Telegram Bot Token:
   - Open Telegram and search for [@BotFather](https://t.me/BotFather)
   - Send `/newbot` and follow instructions
   - Save the bot token for later

2. CoinMarketCap API Key:
   - Create account at [CoinMarketCap](https://coinmarketcap.com/api/)
   - Go to API Keys section
   - Create new API key
   - Save the API key for later

## Local Development Setup

1. Install required software:
   ```bash
   # Install Node.js on Windows
   # Download and install from https://nodejs.org/

   # Install Node.js on macOS using Homebrew
   brew install node

   # Install Node.js on Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

2. Install Git:
   ```bash
   # Windows: Download and install from https://git-scm.com/

   # macOS
   brew install git

   # Ubuntu/Debian
   sudo apt install git
   ```

3. Clone the repository:
   ```bash
   git clone https://github.com/iblessdeno/Crypto-price-snap-Bot
   cd Crypto-price-snap-Bot
   ```

4. Install project dependencies:
   ```bash
   npm install
   ```

5. Create and configure .env file:
   ```bash
   # Create .env file
   touch .env

   # Open with text editor
   nano .env
   ```
   Add these lines:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
   ```
   Save and exit (in nano: Ctrl + X, then Y, then Enter)

6. Build the frontend:
   ```bash
   npm run build
   ```

7. Start development server:
   ```bash
   npm run dev
   ```

8. In a new terminal, start the bot:
   ```bash
   node telegram-bot.js
   ```

## Ubuntu VPS Deployment

1. Connect to your VPS:
   ```bash
   ssh username@your_vps_ip
   ```

2. Update system and install required packages:
   ```bash
   # Update package list and upgrade existing packages
   sudo apt update && sudo apt upgrade -y

   # Install curl for downloading Node.js setup
   sudo apt install -y curl

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install Git and Chromium
   sudo apt install -y git chromium-browser
   ```

3. Create project directory and clone repository:
   ```bash
   mkdir -p ~/projects
   cd ~/projects
   git clone https://github.com/iblessdeno/Crypto-price-snap-Bot
   cd Crypto-price-snap-Bot
   ```

4. Install project dependencies:
   ```bash
   npm install
   ```

5. Set up environment variables:
   ```bash
   # Create .env file
   nano .env
   ```
   Add these lines:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
   ```
   Save and exit (Ctrl + X, then Y, then Enter)

6. Build the frontend:
   ```bash
   npm run build
   ```

7. Install and configure PM2:
   ```bash
   # Install PM2 globally
   sudo npm install -g pm2

   # Create PM2 config file
   nano ecosystem.config.js
   ```
   Add this content:
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'crypto-server',
         script: 'server.js',
         env: {
           NODE_ENV: 'production'
         }
       },
       {
         name: 'crypto-bot',
         script: 'telegram-bot.js',
         env: {
           NODE_ENV: 'production'
         }
       }
     ]
   };
   ```
   Save and exit

8. Start services with PM2:
   ```bash
   # Start both services
   pm2 start ecosystem.config.js

   # Save PM2 config
   pm2 save

   # Set up PM2 to start on system boot
   pm2 startup
   # Run the command that PM2 outputs
   ```

9. Configure firewall:
   ```bash
   # Allow SSH and web server ports
   sudo ufw allow ssh
   sudo ufw allow 3000

   # Enable firewall
   sudo ufw enable
   ```

10. Monitor your services:
    ```bash
    # View all logs
    pm2 logs

    # View specific service logs
    pm2 logs crypto-bot
    pm2 logs crypto-server

    # Monitor processes
    pm2 monit
    ```

## Troubleshooting

### Common Issues

1. Screenshot errors:
   ```bash
   # Check if Chromium is installed
   which chromium-browser

   # If not installed, install it
   sudo apt install -y chromium-browser

   # Check Puppeteer logs
   pm2 logs crypto-bot
   ```

2. Bot not responding:
   ```bash
   # Check bot process
   pm2 list

   # View bot logs
   pm2 logs crypto-bot

   # Restart bot if needed
   pm2 restart crypto-bot
   ```

3. Server issues:
   ```bash
   # Check if server is running
   pm2 list

   # Check server logs
   pm2 logs crypto-server

   # Check if port 3000 is in use
   sudo lsof -i :3000
   ```

4. Permission issues:
   ```bash
   # Fix npm permissions
   sudo chown -R $USER:$USER ~/.npm
   sudo chown -R $USER:$USER ~/projects/Crypto-price-snap-Bot
   ```

### Maintenance

1. Update bot:
   ```bash
   # Pull latest changes
   git pull

   # Install dependencies
   npm install

   # Rebuild frontend
   npm run build

   # Restart services
   pm2 restart all
   ```

2. View resource usage:
   ```bash
   pm2 monit
   ```

3. Backup .env:
   ```bash
   # Create backup
   cp .env .env.backup
   ```

## License

MIT
