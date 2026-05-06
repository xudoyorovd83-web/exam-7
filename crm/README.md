# EduCRM — Full-Stack Education Management System

A production-ready CRM system for educational centers built with NestJS, PostgreSQL, React, and TailwindCSS.

---

## 📁 Project Structure

```
crm/
├── backend/                        # NestJS API
│   ├── src/
│   │   ├── auth/                   # JWT authentication
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.dto.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── users/                  # User management (SUPERADMIN/ADMIN)
│   │   │   ├── user.dto.ts
│   │   │   ├── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   ├── teachers/               # Teachers module
│   │   │   ├── teacher.dto.ts
│   │   │   ├── teacher.entity.ts
│   │   │   ├── teachers.controller.ts
│   │   │   ├── teachers.module.ts
│   │   │   └── teachers.service.ts
│   │   ├── students/               # Students module
│   │   │   ├── student.dto.ts
│   │   │   ├── student.entity.ts
│   │   │   ├── students.controller.ts
│   │   │   ├── students.module.ts
│   │   │   └── students.service.ts
│   │   ├── groups/                 # Groups module
│   │   │   ├── group.dto.ts
│   │   │   ├── group.entity.ts
│   │   │   ├── groups.controller.ts
│   │   │   ├── groups.module.ts
│   │   │   └── groups.service.ts
│   │   ├── payments/               # Payments module
│   │   │   ├── payment.dto.ts
│   │   │   ├── payment.entity.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.module.ts
│   │   │   └── payments.service.ts
│   │   ├── attendance/             # Attendance module
│   │   │   ├── attendance.dto.ts
│   │   │   ├── attendance.entity.ts
│   │   │   ├── attendance.controller.ts
│   │   │   ├── attendance.module.ts
│   │   │   └── attendance.service.ts
│   │   ├── requests/               # Leads/Requests module
│   │   │   ├── request.dto.ts
│   │   │   ├── request.entity.ts
│   │   │   ├── requests.controller.ts
│   │   │   ├── requests.module.ts
│   │   │   └── requests.service.ts
│   │   ├── reports/                # Reports module
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.module.ts
│   │   │   └── reports.service.ts
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   └── guards/
│   │   │       ├── jwt-auth.guard.ts
│   │   │       └── roles.guard.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── .env.example
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                       # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ui/
│   │   │       ├── ConfirmDialog.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Spinner.tsx
│   │   │       └── StatCard.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminsPage.tsx
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── attendance/
│   │   │   │   └── AttendancePage.tsx
│   │   │   ├── groups/
│   │   │   │   └── GroupsPage.tsx
│   │   │   ├── payments/
│   │   │   │   └── PaymentsPage.tsx
│   │   │   ├── requests/
│   │   │   │   └── RequestsPage.tsx
│   │   │   ├── students/
│   │   │   │   └── StudentsPage.tsx
│   │   │   └── teachers/
│   │   │       └── TeachersPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ (v20 recommended)
- **npm** v9+
- **PostgreSQL** 14+ (or use Docker)

---

## 🚀 Quick Start

### Step 1 — Start PostgreSQL

**Option A: Docker (recommended)**
```bash
docker compose up -d postgres
```

**Option B: Local PostgreSQL**
```sql
CREATE DATABASE crm_db;
```
Make sure your PostgreSQL user/password matches the `.env` file.

---

### Step 2 — Set up Backend

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env with your DB credentials if needed

# Install dependencies
npm install --legacy-peer-deps

# Start in development mode (auto-restarts on changes)
npm run start:dev
```

The backend will:
- Start on **http://localhost:3000**
- Auto-create all database tables (TypeORM `synchronize: true`)
- Seed a default **SuperAdmin** account on first run
- Serve Swagger docs at **http://localhost:3000/api/docs**

---

### Step 3 — Set up Frontend

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## 🔐 Default Login Credentials

| Role       | Phone           | Password       |
|------------|-----------------|----------------|
| SUPERADMIN | +998900000000   | superadmin123  |

> The SuperAdmin is automatically seeded on first backend startup.
> Use the SuperAdmin to create ADMIN accounts from the **Admins** page.

---

## 🌐 API Endpoints

All endpoints prefixed with `/api`

### Auth
| Method | Endpoint        | Auth | Description         |
|--------|-----------------|------|---------------------|
| POST   | /auth/login     | ❌   | Login               |
| GET    | /auth/profile   | ✅   | Get current user    |

### Users (SUPERADMIN only)
| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| GET    | /users          | List all users      |
| GET    | /users/admins   | List admins         |
| POST   | /users          | Create admin        |
| DELETE | /users/:id      | Delete user         |

### Teachers (ADMIN+)
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | /teachers          | List teachers      |
| POST   | /teachers          | Create teacher     |
| PUT    | /teachers/:id      | Update teacher     |
| DELETE | /teachers/:id      | Delete teacher     |

### Students (ADMIN+)
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | /students          | List students      |
| POST   | /students          | Create student     |
| PUT    | /students/:id      | Update student     |
| DELETE | /students/:id      | Delete student     |

### Groups (ADMIN+)
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | /groups            | List groups        |
| POST   | /groups            | Create group       |
| PUT    | /groups/:id        | Update group       |
| DELETE | /groups/:id        | Delete group       |

### Payments (ADMIN+)
| Method | Endpoint                       | Description            |
|--------|--------------------------------|------------------------|
| GET    | /payments                      | All payments           |
| POST   | /payments                      | Record payment         |
| GET    | /payments/student/:studentId   | Payments by student    |
| DELETE | /payments/:id                  | Delete payment         |

### Attendance (ADMIN+)
| Method | Endpoint                              | Description                 |
|--------|---------------------------------------|-----------------------------|
| GET    | /attendance                           | All records                 |
| POST   | /attendance                           | Single attendance           |
| POST   | /attendance/bulk                      | Bulk attendance             |
| GET    | /attendance/date/:date                | By date                     |
| GET    | /attendance/group/:groupId            | By group                    |
| GET    | /attendance/group/:groupId/date/:date | By group + date             |

### Requests / Leads
| Method | Endpoint           | Auth | Description           |
|--------|--------------------|------|-----------------------|
| POST   | /requests          | ❌   | Submit lead (public)  |
| GET    | /requests          | ✅   | All requests          |
| GET    | /requests/today    | ✅   | Today's requests      |
| GET    | /requests/yesterday| ✅   | Yesterday's requests  |
| PUT    | /requests/:id      | ✅   | Update status         |
| DELETE | /requests/:id      | ✅   | Delete request        |

### Reports (ADMIN+)
| Method | Endpoint                         | Description            |
|--------|----------------------------------|------------------------|
| GET    | /reports/summary                 | Full dashboard summary |
| GET    | /reports/students/total          | Student counts         |
| GET    | /reports/students/left-this-month| Students left          |
| GET    | /reports/groups/total            | Group count            |
| GET    | /reports/teachers/total          | Teacher count          |
| GET    | /reports/requests/today          | Today requests         |
| GET    | /reports/requests/yesterday      | Yesterday requests     |
| GET    | /reports/revenue/monthly         | Monthly revenue        |

---

## 📖 Swagger UI

Interactive API documentation available at:

```
http://localhost:3000/api/docs
```

Click **Authorize** → enter your JWT token to test protected endpoints.

---

## 🗄️ Database Schema

```
users         → id, fullName, phone (unique), password, role, createdAt
teachers      → id, fullName, phone, subject, createdAt
students      → id, fullName, phone, status, groupId (FK→groups), createdAt
groups        → id, name, teacherId (FK→teachers), schedule, createdAt
payments      → id, studentId (FK→students), amount, date, note, createdAt
attendance    → id, studentId (FK→students), groupId (FK→groups), status, date, createdAt
requests      → id, name, phone, message, status, createdAt
```

---

## 🔐 Roles & Permissions

| Action                    | SUPERADMIN | ADMIN |
|---------------------------|------------|-------|
| Create ADMIN accounts     | ✅         | ❌    |
| Manage teachers           | ✅         | ✅    |
| Manage students           | ✅         | ✅    |
| Manage groups             | ✅         | ✅    |
| Manage payments           | ✅         | ✅    |
| Manage attendance         | ✅         | ✅    |
| View/manage requests      | ✅         | ✅    |
| View reports              | ✅         | ✅    |

---

## 🏗️ Production Build

```bash
# Backend
cd backend
npm run build
# Output: ./dist/
npm run start:prod

# Frontend
cd frontend
npm run build
# Output: ./dist/ (serve with nginx or any static host)
```

---

## 🐛 Troubleshooting

**PostgreSQL connection refused**
- Make sure PostgreSQL is running: `docker compose up -d postgres`
- Check credentials in `backend/.env`

**Port already in use**
- Backend: change `PORT=3001` in `backend/.env`
- Frontend: `npm run dev -- --port 5174`

**Tables not created**
- TypeORM `synchronize: true` handles this automatically on startup
- Check backend console for TypeORM errors

**CORS errors in browser**
- Ensure `VITE_API_URL` in `frontend/.env` matches your backend URL
- Backend CORS is configured to allow all origins in development
