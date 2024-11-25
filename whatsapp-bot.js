import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from 'qrcode-terminal';
import puppeteer from 'puppeteer';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Logger function
function logError(context, error) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${context}\nError: ${error.message}\nStack: ${error.stack}\n\n`;
    
    // Log to console
    console.error(`[${timestamp}] ${context}:`, error);
    
    // Log to file
    const logFile = path.join(logsDir, `whatsapp-bot-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logMessage);
}

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
    }
});

// QR Code generation
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// When client is ready
client.on('ready', () => {
    console.log('[WhatsApp Bot] Client is ready!');
});

// Error handler
client.on('auth_failure', (error) => {
    logError('Authentication Failed', error);
});

client.on('disconnected', (reason) => {
    logError('Client Disconnected', new Error(reason));
});

// Function to check if server is running
async function isServerRunning() {
    try {
        console.log('[Server Check] Checking if server is running...');
        await axios.get('http://localhost:3000');
        console.log('[Server Check] Server is running');
        return true;
    } catch (error) {
        console.log('[Server Check] Server is not running');
        return false;
    }
}

// Function to start the server
async function startServer() {
    try {
        console.log('[Server] Starting server...');
        const { exec } = await import('child_process');
        return new Promise((resolve, reject) => {
            const serverProcess = exec('npm start', { cwd: process.cwd() });
            
            // Wait for the server to be ready
            const checkServer = async () => {
                if (await isServerRunning()) {
                    console.log('[Server] Server is now running');
                    resolve(true);
                } else {
                    setTimeout(checkServer, 1000);
                }
            };

            // Start checking after a brief delay
            setTimeout(checkServer, 3000);

            serverProcess.stdout.on('data', (data) => {
                console.log('[Server]', data.toString());
            });

            serverProcess.stderr.on('data', (data) => {
                console.error('[Server Error]', data.toString());
            });

            serverProcess.on('error', (error) => {
                console.error('[Server Error]', error);
                reject(error);
            });
        });
    } catch (error) {
        logError('Server Start Error', error);
        throw error;
    }
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
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ],
            protocolTimeout: 60000,
            timeout: 60000
        });
        browserInitialized = true;
        console.log('Browser initialized successfully');
    } catch (error) {
        console.error('Failed to initialize browser:', error);
        throw error;
    }
}

// Initialize browser on startup
initBrowser();

// Function to take screenshot
async function takeScreenshot(type, symbol = '') {
    if (!browserInitialized) {
        await initBrowser();
    }

    let page = null;
    let retries = 3;

    while (retries > 0) {
        try {
            page = await browser.newPage();
            
            console.log('Setting viewport...');
            await page.setViewport({ 
                width: 1200,  
                height: 800,  
                deviceScaleFactor: 2  
            });

            // Navigate to the appropriate page based on type
            let url;
            if (type === 'market' || type === 'top') {
                url = 'http://localhost:3000/top';
            } else if (type === 'price') {
                url = `http://localhost:3000?symbol=${encodeURIComponent(symbol.toUpperCase())}`;
            }
            
            console.log('Navigating to:', url);

            // Enable console log from the page
            page.on('console', msg => console.log('Browser console:', msg.text()));

            // Set longer timeouts for navigation
            await page.setDefaultNavigationTimeout(30000);
            await page.setDefaultTimeout(30000);

            // Navigate to the page and wait for network to be idle
            const response = await page.goto(url, { 
                waitUntil: ['networkidle0', 'domcontentloaded'],
                timeout: 30000 
            });
            
            if (!response.ok() && response.status() !== 304) {
                throw new Error(`Failed to load page: ${response.status()} ${response.statusText()}`);
            }
            
            console.log('Page loaded');

            // Add a small delay to ensure React has fully rendered
            await page.waitForTimeout(2000);

            if (type === 'price') {
                // Wait for React to render and get the card element
                await page.waitForSelector('.card-wrapper', { 
                    visible: true,
                    timeout: 20000
                });
                
                const element = await page.$('.card-wrapper');
                if (!element) {
                    throw new Error('Could not find card element');
                }
                
                return await element.screenshot({
                    omitBackground: true,
                    type: 'png',
                    timeout: 30000
                });
            } else {
                // For market/top view, wait for both grid and metrics to load
                await Promise.all([
                    page.waitForSelector('.grid', { 
                        visible: true,
                        timeout: 20000
                    }),
                    page.waitForSelector('h1', { 
                        visible: true,
                        timeout: 20000
                    })
                ]);
                
                return await page.screenshot({
                    fullPage: true,
                    type: 'png',
                    timeout: 30000
                });
            }
        } catch (error) {
            console.error(`Screenshot attempt ${4 - retries} failed:`, error);
            retries--;
            
            if (retries === 0) {
                throw error;
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        } finally {
            if (page) {
                await page.close().catch(console.error);
            }
        }
    }
}

// Request queue implementation
class RequestQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    async add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                task,
                resolve,
                reject
            });
            this.process();
        });
    }

    async process() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        const { task, resolve, reject } = this.queue.shift();
        
        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.processing = false;
            this.process();
        }
    }
}

const requestQueue = new RequestQueue();

// Function to validate cryptocurrency
async function validateCrypto(symbol) {
    try {
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY
            },
            params: {
                symbol: symbol.toUpperCase()
            }
        });
        
        return {
            valid: true,
            data: response.data.data[symbol.toUpperCase()]
        };
    } catch (error) {
        return {
            valid: false,
            error: error.response?.status === 400 ? 'Invalid cryptocurrency symbol' : error.message
        };
    }
}

// Function to get crypto price
async function getCryptoPrice(symbol) {
    try {
        if (!COINMARKETCAP_API_KEY) {
            throw new Error('CoinMarketCap API key is not set');
        }

        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY
            },
            params: {
                symbol: symbol.toUpperCase()
            }
        });

        const data = response.data.data[symbol.toUpperCase()];
        return {
            name: data.name,
            symbol: data.symbol,
            price: data.quote.USD.price,
            change_24h: data.quote.USD.percent_change_24h
        };
    } catch (error) {
        logError('API Error', error);
        throw error;
    }
}

// Message handler
client.on('message', async msg => {
    const command = msg.body.toLowerCase();
    console.log('[Message Received]', command);

    try {
        if (command.startsWith('/price')) {
            const symbol = command.split(' ')[1];
            if (!symbol) {
                await msg.reply('Please provide a cryptocurrency symbol. Example: /price BTC');
                return;
            }

            await msg.reply('Fetching price information, please wait...');
            
            try {
                // Add to request queue
                const result = await requestQueue.add(async () => {
                    console.log(`[Price Command] Processing for symbol: ${symbol}`);
                    
                    // Validate cryptocurrency first
                    const validation = await validateCrypto(symbol);
                    if (!validation.valid) {
                        throw new Error(validation.error);
                    }
                    
                    const data = validation.data;
                    const screenshot = await takeScreenshot('price', symbol);
                    
                    return {
                        data,
                        screenshot
                    };
                });
                
                const media = new MessageMedia('image/png', result.screenshot.toString('base64'));
                await msg.reply(media, undefined, { 
                    caption: `💰 *${result.data.name} (${result.data.symbol})*\nPrice: $${result.data.quote.USD.price.toFixed(2)}\n24h Change: ${result.data.quote.USD.percent_change_24h.toFixed(2)}%` 
                });
                console.log('[Price Command] Message sent');
            } catch (error) {
                console.error('[Price Command] Error:', error.message);
                await msg.reply(`❌ Error: ${error.message}`);
            }
        }
        else if (command === '/market' || command === '/top') {
            await msg.reply('Fetching market overview, please wait...');
            
            try {
                // Add to request queue
                const screenshot = await requestQueue.add(async () => {
                    console.log('[Market Command] Processing');
                    return await takeScreenshot('top');
                });
                
                const media = new MessageMedia('image/png', screenshot.toString('base64'));
                await msg.reply(media, undefined, { caption: '📊 Current Market Overview' });
                console.log('[Market Command] Message sent');
            } catch (error) {
                console.error('[Market Command] Error:', error.message);
                await msg.reply(`❌ Error: ${error.message}`);
            }
        }
        else if (command === '/start' || command === '/help') {
            const helpMessage = `🤖 *Crypto Price Bot Commands*\n\n` +
                `*/price <symbol>* - Get current price (e.g., /price BTC)\n` +
                `*/market* or */top* - View market overview\n` +
                `*/help* - Show this help message`;
            await msg.reply(helpMessage);
        }
    } catch (error) {
        logError('Message Handler Error', error);
        await msg.reply('Sorry, an error occurred while processing your request. Please try again later.');
    }
});

// Initialize the client
console.log('[WhatsApp Bot] Initializing client');
client.initialize().catch(error => logError('Client Initialization Error', error));
