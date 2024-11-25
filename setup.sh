#!/bin/bash

echo "Setting up Crypto Price Bot..."

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Chrome dependencies
echo "Installing Chrome dependencies..."
sudo apt-get install -y chromium-browser

# Install PM2
echo "Installing PM2..."
sudo npm install -y pm2 -g

# Create project directory
PROJECT_DIR="/opt/crypto-price-bot"
echo "Creating project directory at $PROJECT_DIR..."
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Clone repository (if running script directly from repo, skip this step)
if [ ! -f "package.json" ]; then
    echo "Cloning repository..."
    git clone https://github.com/yourusername/crypto-price-bot.git $PROJECT_DIR
    cd $PROJECT_DIR
fi

# Install dependencies
echo "Installing project dependencies..."
npm install

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

# Start services with PM2
echo "Starting services with PM2..."
pm2 start ecosystem.config.cjs
pm2 save

# Setup PM2 startup
echo "Setting up PM2 startup..."
pm2 startup

echo "Setup complete!"
echo "Don't forget to:"
echo "1. Edit the .env file with your actual tokens"
echo "2. Scan the WhatsApp QR code when prompted"
echo "3. Monitor the services with 'pm2 status' and 'pm2 logs'"
