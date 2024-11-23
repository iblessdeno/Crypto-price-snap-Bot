# CryptoSnap Bot 

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

   # Install curl and Node.js
   sudo apt install -y curl
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install required dependencies for Puppeteer
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
       wget \
       libgbm1

   # Install Git and Chromium
   sudo apt install -y git chromium-browser
   ```

3. Clone and navigate to the repository:
   ```bash
   # Create projects directory if it doesn't exist
   mkdir -p ~/projects
   cd ~/projects

   # Clone the repository
   git clone https://github.com/iblessdeno/Crypto-price-snap-Bot.git

   # Navigate to the correct directory (note: use the exact repository name)
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
   nano ecosystem.config.cjs
   ```
   Add this content:
   ```javascript
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
   ```
   Save and exit

8. Build and start the services:
   ```bash
   # First build the frontend
   npm run build

   # Stop any running processes
   pm2 delete all

   # Start both services using the config
   pm2 start ecosystem.config.cjs

   # Save the process list
   pm2 save

   # Set up PM2 to start on system boot
   pm2 startup
   # Copy and run the command that PM2 outputs
   ```

9. Verify both services are running:
   ```bash
   # Check status
   pm2 list

   # Check web server is responding
   curl http://localhost:3000

   # Check logs
   pm2 logs
   ```

10. If you need to restart services:
    ```bash
    # Restart all services
    pm2 restart all

    # Or restart individual services
    pm2 restart crypto-web
    pm2 restart crypto-bot
    ```

## Troubleshooting

### Common Issues and Solutions

1. **Puppeteer/Screenshot Issues**:

   Error: `Failed to launch the browser process! ... libatk-1.0.so.0: cannot open shared object file`
   ```bash
   # Install ALL required dependencies (crucial for Puppeteer)
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
       wget \
       libgbm1

   # Verify Chromium installation
   which chromium-browser
   ```

2. **Telegram Bot Conflicts**:

   Error: `409 Conflict: terminated by other getUpdates request`
   ```bash
   # Stop all PM2 processes
   pm2 delete all

   # Ensure server.js doesn't start the bot
   # Remove any bot initialization from server.js

   # Start services in correct order
   pm2 start ecosystem.config.cjs
   ```

3. **Node.js ES Modules Issues**:

   Error: `Error [ERR_REQUIRE_ESM]: require() of ES Module ... not supported`
   ```bash
   # Use .cjs extension for PM2 config
   mv ecosystem.config.js ecosystem.config.cjs

   # Add proper Node.js flags in PM2 config
   node_args: '--experimental-specifier-resolution=node'
   interpreter_args: '--es-module-specifier-resolution=node'
   ```

4. **Server Connection Issues**:

   Error: `net::ERR_CONNECTION_REFUSED at http://localhost:3000`
   ```bash
   # Check if server is running
   pm2 list
   curl http://localhost:3000

   # Check server logs
   pm2 logs crypto-web

   # Verify port is available
   sudo lsof -i :3000

   # Restart web server if needed
   pm2 restart crypto-web
   ```

5. **Permission Issues**:

   Error: `EACCES: permission denied`
   ```bash
   # Fix npm permissions
   sudo chown -R $USER:$USER ~/.npm
   sudo chown -R $USER:$USER ~/projects/Crypto-price-snap-Bot

   # Fix PM2 permissions if needed
   sudo chown -R $USER:$USER ~/.pm2
   ```

### Best Practices

1. **Clean Start**:
   ```bash
   # Always start with a clean slate
   pm2 delete all
   killall node  # If needed
   ```

2. **Proper Process Order**:
   ```bash
   # Build first
   npm run build

   # Start services
   pm2 start ecosystem.config.cjs

   # Verify both are running
   pm2 list
   ```

3. **Log Monitoring**:
   ```bash
   # Monitor all logs
   pm2 logs

   # Monitor specific service
   pm2 logs crypto-web
   pm2 logs crypto-bot
   ```

4. **Process Management**:
   ```bash
   # Save process list after changes
   pm2 save

   # Set up startup script
   pm2 startup
   # Run the command PM2 outputs

   # Monitor resources
   pm2 monit
   ```

### Quick Recovery Steps

If the bot stops working:

1. Check logs for errors:
   ```bash
   pm2 logs
   ```

2. Restart services:
   ```bash
   pm2 restart all
   ```

3. If issues persist:
   ```bash
   # Full reset
   pm2 delete all
   npm run build
   pm2 start ecosystem.config.cjs
   pm2 save
   ```

4. Verify environment:
   ```bash
   # Check Node.js version
   node --version

   # Verify environment variables
   pm2 env crypto-bot
   ```

## License

MIT
