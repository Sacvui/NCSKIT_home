#!/bin/bash
# NCSKIT Authentication Setup Script
# This script helps set up the authentication system with Vercel Postgres

echo ""
echo "🚀 NCSKIT Authentication Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
        echo "Skipping .env.local creation"
        exit 0
    fi
fi

# Create .env.local from .env.example
if [ -f ".env.example" ]; then
    echo ""
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your:"
    echo "   - POSTGRES_URL (from Vercel Dashboard)"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
else
    echo "❌ .env.example not found"
fi

# Generate NEXTAUTH_SECRET
echo ""
echo "🔐 Generating NEXTAUTH_SECRET..."
if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 32)
    echo "✅ Generated secret: $SECRET"
    echo ""
    echo "Copy this to your .env.local as NEXTAUTH_SECRET"
else
    echo "⚠️  openssl not found. Please generate secret manually:"
    echo "   openssl rand -base64 32"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo ""
    echo "✅ Dependencies already installed"
fi

# Check for POSTGRES_URL in .env.local
if [ -f ".env.local" ]; then
    if grep -q "POSTGRES_URL=postgresql://" .env.local; then
        echo ""
        echo "✅ POSTGRES_URL found in .env.local"
        echo ""
        read -p "Do you want to run database migration now? (y/N): " runMigration
        if [ "$runMigration" = "y" ] || [ "$runMigration" = "Y" ]; then
            echo ""
            echo "🔄 Running database migration..."
            npm run migrate
            echo "✅ Migration completed!"
        fi
    else
        echo ""
        echo "⚠️  POSTGRES_URL not configured in .env.local"
        echo "   Please add your Vercel Postgres connection string"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Vercel Postgres URL"
echo "2. Run: npm run migrate (to create users table)"
echo "3. Run: npm run dev (to start development server)"
echo "4. Visit: http://localhost:9090/login"
echo ""

