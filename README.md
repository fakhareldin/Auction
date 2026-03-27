# Haraj Marketplace

A modern classifieds marketplace platform built with React, Node.js, and PostgreSQL.

## Features

- 🔐 User authentication & authorization (JWT)
- 📝 Create and manage listings
- 🔍 Advanced search & filtering
- 💬 Real-time messaging (Socket.io)
- ❤️ Favorites system
- 🌍 Arabic/English localization (RTL support)
- 📱 Responsive design
- 🖼️ Image upload & optimization

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Material-UI (MUI)
- Redux Toolkit + React Query
- React Router v6
- Socket.io-client
- i18next

### Backend
- Node.js 18+ + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Socket.io
- Cloudinary (image storage)
- JWT authentication

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (for local development)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd haraj-marketplace
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start PostgreSQL and Redis

```bash
pnpm docker:up
```

### 4. Set up environment variables

Create `.env` files in both backend and frontend packages (see `.env.example` files).

### 5. Run database migrations

```bash
pnpm db:migrate
pnpm db:seed
```

### 6. Start development servers

```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:backend
pnpm dev:frontend
```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:5000

## Project Structure

```
haraj-marketplace/
├── packages/
│   ├── shared/       # Shared types and constants
│   ├── backend/      # Node.js + Express API
│   └── frontend/     # React application
├── docker-compose.yml
└── package.json
```

## Available Scripts

- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm build` - Build all packages for production
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm docker:up` - Start Docker containers
- `pnpm docker:down` - Stop Docker containers
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with initial data

## License

MIT
# Auction
