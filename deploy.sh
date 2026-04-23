#!/bin/bash
set -e

echo "--- Starting deployment at $(date) ---"

# Pull the latest version of the app
echo "Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Installing NPM dependencies..."
npm install

echo "Building assets..."
npm run build

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Clear and rebuild cache
echo "Clearing and rebuilding cache..."
php artisan optimize

echo "--- Deployment finished successfully! ---"
