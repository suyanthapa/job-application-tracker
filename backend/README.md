# Job Application Tracker - Backend

A RESTful API backend for tracking job applications built with Express.js, TypeScript, and Prisma.

## Live Deployment

**Production API**: https://job-application-tracker-backend-h1p4.onrender.com  
**Base URL for requests**: `https://job-application-tracker-backend-h1p4.onrender.com/`

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript 6.x
- **Database**: PostgreSQL (hosted on Neon) with Prisma ORM
- **Validation**: Zod
- **Development**: tsc-watch for hot-reload
- **Other**: Cors, dotenv

## Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **PostgreSQL**: Local or remote database
- **Git**: For version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-application-tracker/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and set your values (see [Required Environment Variables](#required-environment-variables) below).

### 4. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

## How to Run in Development Mode

### Start Development Server with Auto-Reload

```bash
npm run dev
```

The server will start on `http://localhost:3000` (default) and automatically restart on file changes.

### Verify Server is Running

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running."
}
```

## How to Run in Production

### Build TypeScript to JavaScript

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Available NPM Scripts

| Command                   | Purpose                              |
| ------------------------- | ------------------------------------ |
| `npm run dev`             | Start dev server with watch mode     |
| `npm run build`           | Compile TypeScript to JavaScript     |
| `npm start`               | Run production build                 |
| `npm run prisma:generate` | Generate Prisma Client               |
| `npm run prisma:migrate`  | Create and apply database migrations |
| `npm run prisma:studio`   | Open Prisma Studio UI                |
| `npm run prisma:reset`    | Reset database (dev only)            |

## Required Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker"

# Server
PORT=3000
NODE_ENV=development
```

### Environment Variable Descriptions

- **DATABASE_URL**: PostgreSQL connection string (format: `postgresql://user:password@host:port/database`)
- **PORT**: Server port (default: 3000)
- **NODE_ENV**: Environment mode (`development` or `production`)

## .env.example

A template file is provided as `.env.example`. Copy and modify it for your environment:

```bash
cp .env.example .env
```

**Contents of `.env.example`:**

```env
# Database Configuration
# Format: postgresql://user:password@host:port/database
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker_dev"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## API Documentation

### Base URL

**Development (Local)**:

```
http://localhost:3000/api/applications
```

**Production (Render)**:

```
https://job-application-tracker-backend-h1p4.onrender.com/api/applications
```

### Endpoints

#### 1. List All Applications

- **Method**: `GET`
- **Endpoint**: `/applications`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response**:
  ```json
  [
    {
      "id": "uuid",
      "company_name": "Company Name",
      "job_title": "Job Title",
      "job_type": "Full_time",
      "status": "Applied",
      "applied_date": "2026-06-18T16:00:00.000Z",
      "notes": "Application notes",
      "created_at": "2026-06-18T16:00:00.000Z",
      "updated_at": "2026-06-18T16:00:00.000Z"
    }
  ]
  ```

#### 2. Create Application

- **Method**: `POST`
- **Endpoint**: `/applications`
- **Request Body**:
  ```json
  {
    "company_name": "Company Name",
    "job_title": "Job Title",
    "job_type": "Full_time",
    "status": "Applied",
    "applied_date": "2026-06-18T16:00:00.000Z",
    "notes": "Optional notes"
  }
  ```
- **Response**: Created application object (201)

#### 3. Get Application by ID

- **Method**: `GET`
- **Endpoint**: `/applications/:id`
- **Response**: Single application object

#### 4. Update Application

- **Method**: `PATCH`
- **Endpoint**: `/applications/:id`
- **Request Body**:
  ```json
  {
    "status": "Interviewing"
  }
  ```
- **Response**: Updated application object

#### 5. Delete Application

- **Method**: `DELETE`
- **Endpoint**: `/applications/:id`
- **Response**: `{ success: true }`

### Postman Collection

A Postman collection is included for testing all endpoints:

- File: `Mini Job Application Tracker.postman_collection.json`
- Import into Postman and set the `{{Job Tracker - Base API}}` variable to:
  ```
  http://localhost:3000/api/applications
  ```
- Update this variable if running on a different host/port

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes**:

- `VALIDATION_ERROR`: Request validation failed (400)
- `NOT_FOUND`: Resource not found (404)
- `DATABASE_ERROR`: Database operation failed (500)
- `INTERNAL_SERVER_ERROR`: Server error (500)

## Database Schema

See `prisma/schema.prisma` for the full database schema.

## Troubleshooting

### Prisma Client Not Found

```bash
npm run prisma:generate
```

### Database Connection Failed

- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database credentials

### Port Already in Use

Set a different PORT in `.env`:

```env
PORT=3001
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Server entry point - Express app initialization
│   ├── config/
│   │   └── prisma.ts               # Prisma Client singleton instance
│   ├── controllers/
│   │   └── application.controller.ts    # Request handlers for application endpoints
│   ├── middleware/
│   │   ├── errorHandler.ts         # Global error handling middleware
│   │   ├── validation.middleware.ts    # Zod validation middleware
│   │   └── ...
│   ├── routes/
│   │   └── application.routes.ts   # API route definitions
│   ├── services/
│   │   ├── application.service.ts  # Business logic for applications
│   │   └── ...
│   ├── types/
│   │   ├── index.ts                # TypeScript type definitions
│   │   └── ...
│   └── utils/
│       ├── errors.ts               # Custom error classes (AppError, ValidationError, etc.)
│       └── ...
├── prisma/
│   ├── schema.prisma               # Database schema definitions
│   └── migrations/                 # Migration history
├── dist/                           # Compiled JavaScript (auto-generated by tsc)
├── node_modules/                   # Dependencies (auto-generated by npm)
├── .env.example                    # Environment variables template
├── .env                            # Environment variables (not committed)
├── .gitignore                      # Git ignore rules
├── package.json                    # Project metadata and scripts
├── package-lock.json               # Locked dependency versions
├── tsconfig.json                   # TypeScript compiler configuration
├── README.md                       # This file
└── Mini Job Application Tracker.postman_collection.json  # Postman API collection
```

### Key File Descriptions

| File                                        | Purpose                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| `src/index.ts`                              | Entry point; initializes Express, middleware, routes, and database connection |
| `src/config/prisma.ts`                      | Exports Prisma Client singleton for database queries                          |
| `src/controllers/application.controller.ts` | Handles HTTP requests; calls services and sends responses                     |
| `src/middleware/errorHandler.ts`            | Catches and formats errors; sends consistent error responses                  |
| `src/middleware/validation.middleware.ts`   | Validates request data using Zod schemas                                      |
| `src/routes/application.routes.ts`          | Defines API endpoints and maps them to controllers                            |
| `src/services/application.service.ts`       | Contains business logic; interacts with database via Prisma                   |
| `src/types/index.ts`                        | Centralized TypeScript interfaces and types                                   |
| `src/utils/errors.ts`                       | Custom error classes for different error scenarios                            |
| `prisma/schema.prisma`                      | Database schema; defines tables, relationships, and fields                    |
| `.env`                                      | Environment variables (local only; create from `.env.example`)                |
| `tsconfig.json`                             | TypeScript compilation settings                                               |

## Development Workflow

1. **Update schema** → Edit `prisma/schema.prisma`
2. **Generate Client** → `npm run prisma:generate`
3. **Create migration** → `npm run prisma:migrate`
4. **Implement features** → Update controllers/services
5. **Test endpoints** → Use Postman collection
6. **Commit changes** → `git add . && git commit -m "message"`

## License

ISC
