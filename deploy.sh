#!/bin/bash

# Pull latest changes
git pull

# Install dependencies
npm install

# Restart all services
pm2 restart ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Show status
pm2 status
