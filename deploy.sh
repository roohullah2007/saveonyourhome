#!/bin/bash
set -e

echo "Starting deployment of saveonyourhome..."

# Enter maintenance mode
# php artisan down || true

# Pull the latest version of the app
git pull origin main

# Install dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader
npm install
npm run build

# Run database migrations
php artisan migrate --force

# Clear and rebuild cache
php artisan optimize

# Exit maintenance mode
# php artisan up

echo "Deployment finished successfully!"
