# Crypto Price Bot 

A powerful cryptocurrency price tracking bot that supports both Telegram and WhatsApp. Get real-time cryptocurrency prices, market overviews, and beautiful screenshots of price charts.

## Features 

- **Multi-Platform Support**: Works on both Telegram and WhatsApp
- **Real-time Price Tracking**: Get current prices for any cryptocurrency
- **Market Overview**: View top cryptocurrencies and market metrics
- **Visual Feedback**: Beautiful screenshots of price charts and market data
- **Error Handling**: Robust error handling and logging
- **Queue System**: Handles multiple requests efficiently

## Commands 

- `/price <symbol>`: Get current price for a cryptocurrency (e.g., `/price BTC`)
- `/market` or `/top`: View market overview
- `/help`: Show available commands

## Prerequisites 

- Node.js v16 or higher
- npm or yarn
- A Telegram Bot Token (get from [@BotFather](https://t.me/botfather))
- A CoinMarketCap API Key (get from [CoinMarketCap](https://coinmarketcap.com/api/))
- Chrome/Chromium (for screenshots)

## Local Setup (Windows) 

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-price-bot.git
   cd crypto-price-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory with:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
   ```

4. **Run the setup script**
   ```bash
   setup.bat
   ```

5. **Scan WhatsApp QR Code**
   When prompted, scan the QR code with WhatsApp to authenticate the bot.

## VPS Deployment (Ubuntu) 

1. **Connect to your VPS**
   ```bash
   ssh username@your_vps_ip
   ```

2. **Run the auto-setup script**
   ```bash
   wget -O - https://raw.githubusercontent.com/iblessdeno/Crypto-price-snap-Bot/main/setup.sh | bash

   ```

   Or manually:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install Chrome dependencies
   sudo apt-get install -y chromium-browser

   # Install PM2
   sudo npm install -y pm2 -g

   # Clone repository
   git clone https://github.com/yourusername/crypto-price-bot.git
   cd crypto-price-bot

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your tokens
   nano .env

   # Start the services
   pm2 start ecosystem.config.cjs
   pm2 save
   ```

3. **Monitor your bots**
   ```bash
   # View all processes
   pm2 status

   # View logs
   pm2 logs
   ```

## Project Structure 

```
crypto-price-bot/
├── js/                    # Frontend React components
├── logs/                  # Bot logs
├── screenshots/           # Temporary screenshots
├── ecosystem.config.cjs   # PM2 configuration
├── telegram-bot.js        # Telegram bot implementation
├── whatsapp-bot.js       # WhatsApp bot implementation
├── server.js             # Frontend server
└── setup.sh              # VPS setup script
```

## Environment Variables 

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `COINMARKETCAP_API_KEY`: Your CoinMarketCap API key

## Maintenance 

### Updating the Bots
```bash
# On your VPS
./deploy.sh
```

### Viewing Logs
```bash
# All logs
pm2 logs

# Specific bot logs
pm2 logs telegram-bot
pm2 logs whatsapp-bot
```

## Troubleshooting 

1. **WhatsApp Authentication Issues**
   - Delete `.wwebjs_auth` directory
   - Restart the bot and scan QR code again

2. **Screenshot Issues**
   - Check Chrome/Chromium installation
   - Verify frontend server is running
   - Check logs for specific errors

3. **API Issues**
   - Verify API keys in `.env`
   - Check API rate limits
   - Review error logs

## Contributing 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
