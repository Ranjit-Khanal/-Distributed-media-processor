#!/bin/bash

# Distributed Media Library Setup Script

set -e

echo "🚀 Setting up Distributed Media Library..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration before continuing!"
fi

# Build and start Docker containers
echo "🐳 Building and starting Docker containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
docker-compose exec -T app composer install --no-interaction

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Generating application key..."
    docker-compose exec -T app php artisan key:generate
fi

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T app php artisan migrate --force

# Create storage link
echo "🔗 Creating storage link..."
docker-compose exec -T app php artisan storage:link || true

# Set permissions
echo "🔐 Setting storage permissions..."
docker-compose exec -T app chmod -R 775 storage bootstrap/cache || true
docker-compose exec -T app chown -R www-data:www-data storage bootstrap/cache || true

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Access the API at: http://localhost:8080/api"
echo "3. Check health at: http://localhost:8080/up"
echo "4. View logs: docker-compose logs -f"
echo ""
echo "📚 See README.md for more information"

