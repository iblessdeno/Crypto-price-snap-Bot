import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const API_KEY = process.env.COINMARKETCAP_API_KEY;
const API_URL = 'https://pro-api.coinmarketcap.com/v1';

// Enable CORS
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Crypto price endpoint
app.get('/api/crypto', async (req, res) => {
    const symbol = req.query.symbol?.toUpperCase() || 'BTC';
    console.log(`Fetching price for ${symbol}...`);
    
    try {
        const response = await axios.get(`${API_URL}/cryptocurrency/quotes/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                symbol: symbol,
                convert: 'USD'
            }
        });

        console.log('API Response:', JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.data || !response.data.data[symbol]) {
            console.error(`Cryptocurrency not found: ${symbol}`);
            return res.status(404).json({ error: 'Cryptocurrency not found' });
        }

        const data = response.data.data[symbol];
        const quote = data.quote.USD;
        const result = {
            price: quote.price,
            percent_change_24h: quote.percent_change_24h,
            percent_change_7d: quote.percent_change_7d
        };
        
        console.log(`Price data for ${symbol}:`, result);
        res.json(result);
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to fetch cryptocurrency data',
            details: error.response?.data?.status?.error_message || error.message
        });
    }
});

// Coin info endpoint
app.get('/api/coininfo', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'BTC';
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/info', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
      },
      params: {
        symbol: symbol
      }
    });

    const data = response.data.data[symbol.toUpperCase()];
    res.json({
      name: data.name,
      symbol: data.symbol,
      logo: data.logo
    });
  } catch (error) {
    console.error('Error fetching coin info:', error);
    res.status(500).json({ error: 'Failed to fetch coin info' });
  }
});

// Top cryptocurrencies endpoint
app.get('/api/top', async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 10); // Limit between 1 and 10
    const response = await axios.get(`${API_URL}/cryptocurrency/listings/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json'
      },
      params: {
        limit: limit,
        convert: 'USD'
      }
    });

    // Get the top cryptocurrencies
    const topCryptos = response.data.data;
    
    // Get symbols for fetching logos
    const symbols = topCryptos.map(crypto => crypto.symbol).join(',');
    
    // Fetch logos for all cryptocurrencies
    const logoResponse = await axios.get(`${API_URL}/cryptocurrency/info`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY
      },
      params: {
        symbol: symbols
      }
    });

    // Combine price data with logos
    const cryptosWithLogos = topCryptos.map(crypto => {
      const logoData = logoResponse.data.data[crypto.symbol];
      return {
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote.USD.price,
        percent_change_24h: crypto.quote.USD.percent_change_24h,
        logo: logoData?.logo
      };
    });

    res.json(cryptosWithLogos);
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch top cryptocurrencies',
      details: error.response?.data?.status?.error_message || error.message
    });
  }
});

// Global market metrics endpoint
app.get('/api/global', async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/global-metrics/quotes/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json'
      }
    });

    const data = response.data.data;
    res.json({
      total_market_cap: data.quote.USD.total_market_cap,
      total_volume_24h: data.quote.USD.total_volume_24h,
      btc_dominance: data.btc_dominance,
      eth_dominance: data.eth_dominance,
      active_cryptocurrencies: data.active_cryptocurrencies,
      total_cryptocurrencies: data.total_cryptocurrencies
    });
  } catch (error) {
    console.error('Error fetching global metrics:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch global market data',
      details: error.response?.data?.status?.error_message || error.message
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Starting Telegram bot...');
    
    // Import and start the Telegram bot
    import('./telegram-bot.js').catch(err => {
        console.error('Failed to start Telegram bot:', err);
    });
});
