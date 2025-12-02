# Library Management System

A full-stack library management application built with NestJS, PostgreSQL, Prisma, and React with TypeScript. This system provides comprehensive features for managing books, authors, users, and borrowing operations with JWT-based authentication.

## 🚀 Features

### Backend (NestJS + Prisma + PostgreSQL)
- ✅ **CRUD Operations for Books**: Create, read, update, delete books with advanced filtering
- ✅ **CRUD Operations for Authors**: Manage author information
- ✅ **CRUD Operations for Users**: User management with role-based access
- ✅ **Borrowing System**: 
  - Borrow books with due dates
  - Return borrowed books
  - Track borrowing history
  - Automatic inventory management
- ✅ **JWT Authentication**: Secure authentication for protected operations
- ✅ **Swagger API Documentation**: Interactive API docs at `/api`
- ✅ **Advanced Filtering**: Search and filter books by multiple criteria
- ✅ **Database Migrations**: Prisma migrations for schema management
- ✅ **Seed Data**: Pre-populated sample data for testing

### Frontend (React + TypeScript)
- ✅ **Modern UI**: Clean, responsive interface with Tailwind CSS
- ✅ **Authentication**: Login and registration with JWT persistence
- ✅ **Dashboard**: Overview of library statistics
- ✅ **Book Management**: Browse, search, and manage books
- ✅ **Author Management**: View and manage authors
- ✅ **User Management**: Admin can manage users
- ✅ **Borrowing Interface**: Borrow and return books
- ✅ **State Management**: Zustand for efficient state management
- ✅ **API Integration**: React Query for data fetching and caching

### DevOps
- ✅ **Docker Support**: Full containerization with docker-compose
- ✅ **Environment Configuration**: Separate configs for dev/prod
- ✅ **Database Seeding**: Automated seed data generation

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or use Docker)
- Docker and Docker Compose (optional, for containerized setup)

## 🛠️ Installation & Setup

### Option 1: Running with Docker (Recommended)

This is the easiest way to run the entire application with a single command.

```bash
# Clone the repository
git clone <repository-url>
cd "ONI project"

# Create environment files from examples
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services with Docker Compose
docker-compose up --build

# The application will be available at:
# Frontend: http://localhost
# Backend API: http://localhost:3000
# Swagger Docs: http://localhost:3000/api
```

The Docker setup includes:
- PostgreSQL database
- Backend API server
- Frontend web application
- Automatic database migrations and seeding

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update the following:
DATABASE_URL="postgresql://username:password@localhost:5432/library_db?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

4. **Setup PostgreSQL Database**

Option A: Using local PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE library_db;
\q
```

Option B: Using Docker for PostgreSQL only
```bash
docker run --name library-postgres \
  -e POSTGRES_USER=library_user \
  -e POSTGRES_PASSWORD=library_password \
  -e POSTGRES_DB=library_db \
  -p 5432:5432 \
  -d postgres:16-alpine

# Update .env with:
# DATABASE_URL="postgresql://library_user:library_password@localhost:5432/library_db?schema=public"
```

5. **Run Prisma migrations**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database schema
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

6. **Start the backend server**
```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The backend will be running at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

#### Frontend Setup

1. **Navigate to frontend directory (in a new terminal)**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# The default configuration should work:
VITE_API_URL=http://localhost:3000
```

4. **Start the development server**
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🔐 Authentication & Testing

### Default Credentials

After seeding the database, you can use these credentials:

**Admin User:**
- Email: `admin@library.com`
- Password: `password123`
- Role: ADMIN

**Regular Users:**
- Email: `john.doe@example.com` / Password: `password123`
- Email: `jane.smith@example.com` / Password: `password123`

### Getting a JWT Token

**Method 1: Using the Frontend**
1. Go to `http://localhost:5173`
2. Click "Login"
3. Enter credentials
4. Token is automatically stored and used

**Method 2: Using cURL**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "password123"
  }'
```

**Method 3: Using Swagger UI**
1. Go to `http://localhost:3000/api`
2. Find the `/auth/login` endpoint
3. Click "Try it out"
4. Enter credentials and execute
5. Copy the `access_token` from the response
6. Click "Authorize" button at the top
7. Enter: `Bearer YOUR_TOKEN_HERE`

### Testing Protected Routes

All write operations (POST, PATCH, DELETE) require authentication.

**Example with cURL:**
```bash
# Get the token first
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"password123"}' \
  | jq -r '.access_token')

# Use the token for protected endpoints
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

## 📚 API Documentation

### Swagger Documentation
Interactive API documentation is available at: `http://localhost:3000/api`

### API Endpoints Overview

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

#### Books
- `GET /books` - Get all books (with filtering)
  - Query params: `search`, `authorId`, `available`, `publishedYearFrom`, `publishedYearTo`, `page`, `limit`
- `GET /books/:id` - Get a single book
- `POST /books` - Create a new book (🔒 Protected)
- `PATCH /books/:id` - Update a book (🔒 Protected)
- `DELETE /books/:id` - Delete a book (🔒 Protected)

#### Authors
- `GET /authors` - Get all authors
  - Query params: `search`
- `GET /authors/:id` - Get a single author
- `POST /authors` - Create a new author (🔒 Protected)
- `PATCH /authors/:id` - Update an author (🔒 Protected)
- `DELETE /authors/:id` - Delete an author (🔒 Protected)

#### Users
- `GET /users` - Get all users (🔒 Protected)
- `GET /users/:id` - Get a single user (🔒 Protected)
- `POST /users` - Create a new user (🔒 Protected)
- `DELETE /users/:id` - Delete a user (🔒 Protected)

#### Borrowed Books
- `POST /borrowed-books/borrow` - Borrow a book (🔒 Protected)
- `PATCH /borrowed-books/return/:id` - Return a book (🔒 Protected)
- `GET /borrowed-books/user/:userId` - Get borrowed books by user (🔒 Protected)
  - Query params: `status` (BORROWED, RETURNED, OVERDUE)
- `GET /borrowed-books` - Get all borrowed books (🔒 Protected)
- `GET /borrowed-books/:id` - Get a borrowed book record (🔒 Protected)

## 🗄️ Database Schema

### User
- `id` (UUID, PK)
- `email` (Unique)
- `name`
- `password` (Hashed)
- `role` (USER | ADMIN)
- Timestamps

### Author
- `id` (UUID, PK)
- `name`
- `bio`
- `country`
- Timestamps

### Book
- `id` (UUID, PK)
- `title`
- `isbn` (Unique)
- `publishedYear`
- `description`
- `totalCopies`
- `availableCopies`
- `authorId` (FK to Author)
- Timestamps

### BorrowedBook
- `id` (UUID, PK)
- `userId` (FK to User)
- `bookId` (FK to Book)
- `borrowedAt`
- `dueDate`
- `returnedAt`
- `status` (BORROWED | RETURNED | OVERDUE)
- Timestamps

## 🎨 Frontend Features

### Pages
1. **Login/Register** - Authentication pages
2. **Dashboard** - Overview with statistics
3. **Books** - Browse and manage books
4. **Authors** - Manage authors
5. **Users** - Admin user management
6. **Borrowed Books** - View all borrowed books
7. **My Borrowed Books** - User's personal borrowed books

### Technologies
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing
- **React Toastify** - Notifications

## 🚀 Deployment

### Environment Variables for Production

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="use-a-strong-random-secret-here"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-domain.com"
```

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-api.com
```

### Using Supabase (Free PostgreSQL)

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get the database connection string from Settings > Database
4. Update `DATABASE_URL` in backend `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Production Build

**Backend:**
```bash
cd backend
npm install
npm run build
npm run prisma:generate
npm run prisma:migrate:prod
npm run prisma:seed
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Deploy the 'dist' folder to a static hosting service
```

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## 📝 Design Decisions & Assumptions

### Backend Architecture
- **Modular Design**: Each resource (Books, Authors, Users, BorrowedBooks) is in its own module
- **Service Layer Pattern**: Business logic separated from controllers
- **DTO Validation**: Class-validator for request validation
- **Global Exception Handling**: Consistent error responses
- **Prisma ORM**: Type-safe database access with migrations

### Authentication & Security
- **JWT Strategy**: Stateless authentication with Bearer tokens
- **Password Hashing**: bcrypt with salt rounds for security
- **Protected Routes**: JWT guard for write operations
- **CORS Configuration**: Configurable for different environments

### Database Design
- **UUID Primary Keys**: Better for distributed systems
- **Cascading Deletes**: Automatic cleanup of related records
- **Timestamps**: Automatic createdAt/updatedAt tracking
- **Enums**: Type-safe status values
- **Relations**: Proper foreign key constraints

### Frontend Architecture
- **Component-Based**: Reusable React components
- **Type Safety**: Full TypeScript coverage
- **State Management**: Zustand for auth, React Query for server state
- **API Layer**: Centralized API service
- **Responsive Design**: Mobile-first approach with Tailwind

### Assumptions
1. Books are identified by ISBN (unique)
2. Users can borrow multiple books but not the same book twice simultaneously
3. Admin role has full access, USER role has limited access
4. Due dates are managed by the system but no automatic overdue marking
5. Borrowed books are returned one at a time
6. Available copies are automatically managed on borrow/return

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill the process using the port
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change the port in .env files
```

**Database connection errors:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

**Prisma errors:**
```bash
# Reset and regenerate
npx prisma generate
npx prisma migrate reset
npx prisma db seed
```

**CORS errors:**
- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches

**Docker issues:**
```bash
# Clean restart
docker-compose down -v
docker-compose up --build
```

## 📦 Project Structure

```
ONI project/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # Users module
│   │   ├── authors/        # Authors module
│   │   ├── books/          # Books module
│   │   ├── borrowed-books/ # Borrowed books module
│   │   ├── prisma/         # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   ├── lib/            # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🤝 Contributing

This project was created as a technical assessment. For production use, consider:
- Adding comprehensive tests
- Implementing rate limiting
- Adding logging and monitoring
- Implementing password reset functionality
- Adding email notifications
- Implementing overdue book tracking
- Adding book categories/genres
- Implementing book reservations

## 📄 License

MIT

## 👨‍💻 Author

Created as a full-stack intern assessment project demonstrating:
- Backend API development with NestJS
- Database design with Prisma & PostgreSQL
- Frontend development with React & TypeScript
- Authentication & Authorization
- Docker containerization
- API documentation
- Clean code practices

---

**Note:** This application includes pre-seeded data for testing. Use the credentials provided in the Authentication section to get started immediately.

For questions or issues, please refer to the Swagger documentation at `http://localhost:3000/api` when running the application.
