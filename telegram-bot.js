import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Replace 'YOUR_BOT_TOKEN' with your actual bot token from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    console.error('Error: TELEGRAM_BOT_TOKEN is not set in .env file');
    process.exit(1);
}

console.log('Initializing bot with token:', token.substring(0, 5) + '...');

const bot = new TelegramBot(token, { 
    polling: true,
    onlyFirstMatch: true,
    request: {
        timeout: 30000
    }
});

// Log when bot is ready
bot.on('message', (msg) => {
    console.log('Received message:', msg.text);
});

// Handle polling errors
bot.on('polling_error', (error) => {
    console.error('Polling error details:', {
        code: error.code,
        message: error.message,
        response: error.response?.body,
        statusCode: error.response?.statusCode
    });
    
    if (error.message.includes('404')) {
        console.error('Bot token appears to be invalid. Please check your token with BotFather.');
        process.exit(1);
    }
});

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

// Store the browser instance
let browser = null;
let browserInitialized = false;

// Initialize browser on startup
async function initBrowser() {
    if (browserInitialized) return;
    
    console.log('Initializing browser...');
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        browserInitialized = true;
        console.log('Browser initialized successfully');
    } catch (error) {
        console.error('Failed to initialize browser:', error);
        throw error;
    }
}

async function takeScreenshot(symbol) {
    if (!browserInitialized) {
        await initBrowser();
    }
    
    console.log(`Taking screenshot for symbol: ${symbol}`);
    let page = null;
    
    try {
        page = await browser.newPage();
        
        console.log('Setting viewport...');
        await page.setViewport({ 
            width: 1200,  
            height: 800,  
            deviceScaleFactor: 2  
        });
        
        const url = `http://localhost:3000?symbol=${encodeURIComponent(symbol)}`;
        console.log('Navigating to:', url);

        // Enable console log from the page
        page.on('console', msg => console.log('Browser console:', msg.text()));

        // Navigate to the page and wait for network to be idle
        const response = await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // 304 Not Modified is a valid response
        if (!response.ok() && response.status() !== 304) {
            throw new Error(`Failed to load page: ${response.status()} ${response.statusText()}`);
        }
        
        console.log('Page loaded');

        // Add a small delay to ensure React has fully rendered
        await page.waitForTimeout(1000);

        // Wait for React to render and get the card element
        await page.waitForSelector('.card-wrapper', { 
            visible: true,
            timeout: 10000 // 10 second timeout
        });
        
        const element = await page.$('.card-wrapper');
        
        if (!element) {
            throw new Error('Could not find card element');
        }

        const screenshotPath = path.join(screenshotsDir, `${symbol}_${Date.now()}.png`);
        
        console.log('Taking screenshot...');
        await element.screenshot({
            path: screenshotPath,
            omitBackground: true,
            type: 'png'    
        });

        console.log('Screenshot saved to:', screenshotPath);
        return screenshotPath;
    } catch (error) {
        console.error('Screenshot error:', error);
        if (page) {
            console.log('Current page URL:', await page.url());
            console.log('Page content:', await page.content());
        }
        throw error;
    } finally {
        if (page) {
            await page.close().catch(console.error);
        }
    }
}

// Handle /price command without symbol
bot.onText(/^\/price$/, (msg) => {
    console.log('Received /price command without symbol');
    const chatId = msg.chat.id;
    const message = `Please use the command in this format:

/price BTC

Common symbols:
BTC - Bitcoin
ETH - Ethereum
SOL - Solana
DOGE - Dogecoin
XRP - Ripple`;

    bot.sendMessage(chatId, message);
});

// Handle /price command with symbol
bot.onText(/\/price (.+)/, async (msg, match) => {
    console.log('Received /price command:', match[1]);
    const chatId = msg.chat.id;
    const symbol = match[1].toUpperCase();

    try {
        console.log(`Processing price request for ${symbol}...`);
        await bot.sendMessage(chatId, `📸 Getting price info for ${symbol}...`);
        const screenshotPath = await takeScreenshot(symbol);
        console.log('Sending photo to chat...');
        await bot.sendPhoto(chatId, screenshotPath, {
            caption: `Price information for ${symbol}`
        });
        console.log('Photo sent successfully');
        fs.unlinkSync(screenshotPath);
    } catch (error) {
        console.error('Error processing /price command:', error);
        await bot.sendMessage(chatId, `Sorry, there was an error getting the price for ${symbol}. Please try again later.`);
    }
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
    console.log('Received /start command');
    const chatId = msg.chat.id;
    const message = `Welcome to CryptoPrice Bot 🚀

Available Commands:

/price - Get price info
Example: /price BTC

/top - View top cryptocurrencies
Example: /top

/market - View market overview
Example: /market

Common Coins:
BTC - Bitcoin
ETH - Ethereum
SOL - Solana
DOGE - Dogecoin
XRP - Ripple

Try /price BTC to start`;

    bot.sendMessage(chatId, message);
});

// Handle /top command
bot.onText(/\/top/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        bot.sendMessage(chatId, 'Fetching top cryptocurrencies...');
        const page = await browser.newPage();
        const url = 'http://localhost:3000/top';
        console.log('Navigating to:', url);

        // Enable console log from the page
        page.on('console', msg => console.log('Browser console:', msg.text()));

        // Set a larger viewport to ensure all content is visible
        await page.setViewport({ 
            width: 1200,  
            height: 1000,  
            deviceScaleFactor: 2  
        });

        // Navigate to the page and wait for network to be idle
        await page.goto(url, { waitUntil: 'networkidle0' });
        console.log('Page loaded');

        // Wait for React to render and get the crypto grid element
        await page.waitForSelector('.crypto-grid', { visible: true });
        const element = await page.$('.crypto-grid');
        
        if (!element) {
            throw new Error('Could not find crypto grid element');
        }

        const screenshotPath = path.join(screenshotsDir, `top_${Date.now()}.png`);
        
        console.log('Taking screenshot...');
        await element.screenshot({
            path: screenshotPath,
            omitBackground: true,
            type: 'png'    
        });

        console.log('Sending photo to chat...');
        await bot.sendPhoto(chatId, screenshotPath, {
            caption: 'Top Cryptocurrencies by Market Cap'
        });
        console.log('Photo sent successfully');
        fs.unlinkSync(screenshotPath);
        await page.close();
    } catch (error) {
        console.error('Error processing /top command:', error);
        await bot.sendMessage(chatId, 'Sorry, there was an error getting the top cryptocurrencies. Please try again later.');
        if (page) await page.close();
    }
});

// Handle /market command
bot.onText(/\/market/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        console.log('Processing market overview request...');
        await bot.sendMessage(chatId, '📊 Getting global market overview...');
        
        const page = await browser.newPage();
        await page.setViewport({ 
            width: 1200,
            height: 800,
            deviceScaleFactor: 2
        });

        const url = 'http://localhost:3000/top';
        console.log('Navigating to:', url);

        // Enable console log from the page
        page.on('console', msg => console.log('Browser console:', msg.text()));

        // Navigate to the page and wait for network to be idle
        await page.goto(url, { waitUntil: 'networkidle0' });
        console.log('Page loaded');

        // Wait for both components to render
        await Promise.all([
            page.waitForSelector('.grid', { visible: true }),
            page.waitForSelector('h1', { visible: true })
        ]);

        // Take screenshot of the entire page content
        const screenshotPath = path.join(screenshotsDir, `market_${Date.now()}.png`);
        
        console.log('Taking screenshot...');
        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

        console.log('Screenshot saved to:', screenshotPath);
        await page.close();
        
        console.log('Sending photo to chat...');
        await bot.sendPhoto(chatId, screenshotPath, {
            caption: '🌐 Global Market Overview'
        });
        
        console.log('Photo sent successfully');
        fs.unlinkSync(screenshotPath);
    } catch (error) {
        console.error('Error processing /market command:', error);
        await bot.sendMessage(chatId, 'Sorry, there was an error getting the market overview. Please try again later.');
    }
});

process.on('SIGINT', async () => {
    console.log('Shutting down...');
    if (browser) {
        await browser.close();
    }
    process.exit();
});

// Initialize the browser
initBrowser().catch(console.error);

console.log('Telegram bot is running...');
