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
      kill_timeout: 3000,
      max_memory_restart: '300M'
    }
  ]
};
