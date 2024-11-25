module.exports = {
  apps: [
    {
      name: 'crypto-frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'telegram-bot',
      script: 'telegram-bot.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '500M',
      error_file: 'logs/telegram-error.log',
      out_file: 'logs/telegram-out.log',
    },
    {
      name: 'whatsapp-bot',
      script: 'whatsapp-bot.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '500M',
      error_file: 'logs/whatsapp-error.log',
      out_file: 'logs/whatsapp-out.log',
    }
  ],
};
