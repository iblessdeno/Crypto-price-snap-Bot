#!/bin/bash

echo "Setting up Crypto Price Bot..."

# Update system and install required packages
echo "Updating system packages..."
sudo apt update
sudo apt install -y curl git build-essential

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version

# Install Chrome dependencies
echo "Installing Chrome dependencies..."
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
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
    lsb-release \
    wget \
    xdg-utils \
    chromium-browser

# Install PM2
echo "Installing PM2..."
sudo npm install -g pm2

# Create project directory
PROJECT_DIR="/opt/crypto-price-bot"
echo "Creating project directory at $PROJECT_DIR..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Copy files to project directory (if not already there)
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "Copying project files..."
    cp -r ./* $PROJECT_DIR/
fi

cd $PROJECT_DIR

# Install dependencies
echo "Installing project dependencies..."
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
EOL
    echo "Please edit .env file with your actual tokens"
fi

# Create necessary directories
mkdir -p logs screenshots

# Setup PM2 ecosystem file
cat > ecosystem.config.cjs << EOL
module.exports = {
  apps: [
    {
      name: 'server',
      script: 'server.js',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'telegram-bot',
      script: 'telegram-bot.js',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'whatsapp-bot',
      script: 'whatsapp-bot.js',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOL

# Make the project files executable
chmod +x server.js telegram-bot.js whatsapp-bot.js

# Start services with PM2
echo "Starting services with PM2..."
pm2 start ecosystem.config.cjs
pm2 save

# Setup PM2 startup script
echo "Setting up PM2 startup script..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
sudo systemctl enable pm2-$USER

echo "Setup complete!"
echo "Don't forget to:"
echo "1. Edit the .env file with your actual tokens: nano .env"
echo "2. Monitor the services with: pm2 status"
echo "3. View logs with: pm2 logs"
echo "4. Scan the WhatsApp QR code in the whatsapp-bot logs: pm2 logs whatsapp-bot"
