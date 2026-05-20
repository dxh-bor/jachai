# BDFraud Shield — Bangladesh E-commerce Fraud Detection SaaS

BDFraud Shield is a comprehensive fraud detection platform designed for Bangladeshi e-commerce businesses. It aggregates delivery history from major couriers (Pathao, Steadfast, RedX) to provide a unified fraud score for any customer phone number.

## Tech Stack
- **Backend**: Laravel 11, Sanctum
- **Frontend**: React 18, Inertia.js, Tailwind CSS
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Tooling**: Laravel Sail (Docker)

## Requirements
- Docker Desktop installed and running
- Node.js & NPM (optional, can run via Sail)

## First Time Setup

Step 1 — Clone and install dependencies:
```bash
# If you have composer locally:
composer install
# OR via Docker:
docker run --rm -v $(pwd):/opt -w /opt laravelsail/php83-composer:latest composer install

cp .env.example .env
php artisan key:generate
```

Step 2 — Start Docker containers:
```bash
./vendor/bin/sail up -d
```

Step 3 — Run migrations and seeders:
```bash
./vendor/bin/sail artisan migrate:fresh --seed
```

Step 4 — Install and run frontend:
```bash
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

Step 5 — Visit the app:
- App: [http://localhost](http://localhost)
- phpMyAdmin: [http://localhost:8080](http://localhost:8080)

## Default Login Credentials

**Admin:**
- Email: `admin@bdfraudshield.com`
- Password: `password`

**Regular User:**
- Register at [http://localhost/register](http://localhost/register)
- Basic plan (50 checks/mo) is assigned automatically.

## Useful Sail Commands
Add this alias to your `~/.bashrc` or `~/.zshrc` for easier use:
`alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'`

- Start containers: `sail up -d`
- Stop containers: `sail down`
- Artisan commands: `sail artisan [command]`
- NPM commands: `sail npm [command]`
- View logs: `sail logs`

## Features
- ✅ Parallel Courier API calls for low latency
- ✅ Redis-backed fraud score caching (24h TTL)
- ✅ Monthly API limit enforcement
- ✅ Real-time dashboard for users and admins
- ✅ Mobile-responsive premium design
