# Quick Start Guide

## Fastest Way to Get Started (Docker)

```bash
# 1. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start everything with Docker
docker-compose up --build

# 3. Wait for services to start (about 1-2 minutes)

# 4. Open your browser
#    Frontend: http://localhost
#    Backend API: http://localhost:3000
#    Swagger Docs: http://localhost:3000/api

# 5. Login with demo credentials
#    Email: admin@library.com
#    Password: password123
```

## Local Development (Without Docker)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and update DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

### Frontend (in new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Demo Credentials

**Admin Account:**
- Email: admin@library.com
- Password: password123

**User Accounts:**
- john.doe@example.com / password123
- jane.smith@example.com / password123

## Common Tasks

### View Swagger API Docs
```
http://localhost:3000/api
```

### Reset Database
```bash
cd backend
npm run prisma:migrate reset
npm run prisma:seed
```

### View Database with Prisma Studio
```bash
cd backend
npm run prisma:studio
```

### Run Tests
```bash
cd backend
npm test
```

## Troubleshooting

**Port conflicts?**
- Backend uses port 3000
- Frontend uses port 5173 (dev) or 80 (docker)
- PostgreSQL uses port 5432

**Database issues?**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate reset
```

**Docker issues?**
```bash
docker-compose down -v
docker-compose up --build
```
