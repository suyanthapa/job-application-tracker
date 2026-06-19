# Job Application Tracker

A full-stack job application tracking app. Built with **Next.js** (frontend) and **Express.js** (backend).

---

## Project Structure

```
job-application-tracker/
├── frontend/        # Next.js app (UI, Zod validation, Axios API layer)
└── backend/         # Express.js REST API (TypeScript, Prisma, PostgreSQL)
```

---

## Quick Start

Both apps run independently. Open two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Runs on → `http://localhost:3000`

### Terminal 2 — Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

Runs on → `http://localhost:3001`

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker_dev"
PORT=3000
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

For production, point `NEXT_PUBLIC_API_URL` at your deployed backend:

```env
NEXT_PUBLIC_API_URL=https://job-application-tracker-backend-h1p4.onrender.com/api
```

---

## Frontend

### Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework |
| TypeScript | Type safety |
| Axios | HTTP client |
| Zod | Schema validation on forms |
| TailwindCSS | Styling |
| React Hot Toast | Notifications |

### Key Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── page.tsx              # Home page — applications dashboard
│   ├── components/
│   │   ├── applications/
│   │   │   ├── ApplicationsTable.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── ApplicationDetail.tsx
│   │   │   ├── DeleteConfirm.tsx
│   │   │   └── StatsCards.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       └── StatusBadge.tsx
│   ├── lib/
│   │   ├── api.ts                # Axios instance + all API calls
│   │   ├── schemas.ts            # Zod validation schemas
│   │   └── utils.ts              # Helpers, constants, formatters
│   └── types/
│       └── index.ts              # Shared TypeScript types
├── .env.example
└── package.json
```

### API Layer (`src/lib/api.ts`)

All backend calls are centralised in one file. No raw `axios` calls in components.

```typescript
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const api = {
  listApplications: (params) => axiosInstance.get("/applications", { params }),
  createApplication: (data) => axiosInstance.post("/applications", data),
  updateApplication: (id, data) => axiosInstance.patch(`/applications/${id}`, data),
  deleteApplication: (id) => axiosInstance.delete(`/applications/${id}`),
};
```

### Zod Validation (`src/lib/schemas.ts`)

Forms are validated client-side with Zod before any API call is made.

```typescript
import { z } from "zod";

export const createApplicationSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  job_title: z.string().min(1, "Job title is required"),
  job_type: z.enum(["Full_time", "Part_time", "Contract", "Internship"]),
  status: z.enum(["Applied", "Interviewing", "Offer", "Rejected"]),
  applied_date: z.string().min(1, "Applied date is required"),
  notes: z.string().optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
```

### Available Scripts

```bash
npm run dev      # Start dev server (http://localhost:3001)
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

---

## Backend

### Tech Stack

| Tool | Purpose |
|---|---|
| Express.js 5.x | HTTP framework |
| TypeScript 6.x | Type safety |
| Prisma | ORM |
| PostgreSQL (Neon) | Database |
| Zod | Request validation |
| CORS | Cross-origin access |

### Key Structure

```
backend/
├── src/
│   ├── index.ts                         # Entry point
│   ├── config/
│   │   └── prisma.ts                    # Prisma client singleton
│   ├── controllers/
│   │   └── application.controller.ts    # Route handlers
│   ├── middleware/
│   │   ├── errorHandler.ts              # Global error handler
│   │   └── validation.middleware.ts     # Zod request validation
│   ├── routes/
│   │   └── application.routes.ts        # Route definitions
│   ├── services/
│   │   └── application.service.ts       # Business logic + DB queries
│   ├── types/
│   │   └── index.ts                     # TypeScript types
│   └── utils/
│       └── errors.ts                    # Custom error classes
├── prisma/
│   ├── schema.prisma                    # DB schema
│   └── migrations/                      # Migration history
├── .env.example
└── package.json
```

### API Endpoints

**Base URL (local):** `http://localhost:3000/api`  
**Base URL (production):** `https://job-application-tracker-backend-h1p4.onrender.com/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/applications` | List all (supports `page`, `limit`, `search`, `status`) |
| `POST` | `/applications` | Create a new application |
| `GET` | `/applications/:id` | Get single application |
| `PATCH` | `/applications/:id` | Update application |
| `DELETE` | `/applications/:id` | Delete application |
| `GET` | `/health` | Health check |

### Query Parameters (`GET /applications`)

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `search` | string | Filter by company name or job title |
| `status` | string | Filter by status (`Applied` \| `Interviewing` \| `Offer` \| `Rejected`) |

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "VALIDATION_ERROR",
    "errors": [{ "field": "status", "message": "Invalid value" }]
  }
}
```

### Available Scripts

```bash
npm run dev               # Start dev server with hot-reload
npm run build             # Compile TypeScript
npm start                 # Run production build
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio UI
npm run prisma:reset      # Reset DB (dev only)
```

---

## Database Schema

```prisma
model Application {
  id           String   @id @default(uuid())
  company_name String
  job_title    String
  job_type     JobType
  status       Status   @default(Applied)
  applied_date DateTime
  notes        String?
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}

enum JobType {
  Full_time
  Part_time
  Contract
  Internship
}

enum Status {
  Applied
  Interviewing
  Offer
  Rejected
}
```

---

## Development Workflow

1. Edit schema → `prisma/schema.prisma`
2. Generate client → `npm run prisma:generate`
3. Migrate → `npm run prisma:migrate`
4. Implement feature → controllers / services / frontend components
5. Commit → `git add . && git commit -m "feat: description"`

---

## License

ISC
