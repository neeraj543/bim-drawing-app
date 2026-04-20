# Architecture & Codebase

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.4 (Java 21) |
| Security | Spring Security + JWT |
| Database | H2 file-based (local) → PostgreSQL (production) |
| File storage | Local filesystem (`backend/uploads/`) |
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |

---

## Backend Structure

```
backend/src/main/java/com/bim/backend/
├── config/
│   ├── SecurityConfig.java       # JWT, CORS, auth rules, protected routes
│   └── DataInitializer.java      # Creates default admin user on startup
├── controller/                   # REST endpoints (one per domain)
├── dto/                          # Request/Response shapes for the API
├── entity/                       # JPA entities (mapped to DB tables)
├── exception/                    # GlobalExceptionHandler + custom exceptions
├── filter/
│   └── JwtAuthenticationFilter.java  # Validates JWT on every request
├── repository/                   # Spring Data JPA repositories
├── service/
│   └── UserDetailsServiceImpl.java   # Required by Spring Security for login
└── util/
    └── JwtUtil.java              # JWT generation and validation
```

**Note:** There is no service layer — controllers call repositories directly. This will be refactored as new features are added.

---

## Data Model

```
User
 ├── owns → Projects (one-to-many)
 └── member of → Projects (many-to-many via project_members table)

Project
 ├── owner → User
 ├── members → Set<User>
 ├── drawingSets → Set<DrawingSet>  (cascade delete)
 └── tasks → via DrawingSet

DrawingSet
 ├── project → Project
 ├── drawingFiles → Set<DrawingFile>  (cascade delete)
 └── tasks → Set<Task>

DrawingFile
 └── drawingSet → DrawingSet

Task
 └── drawingSet → DrawingSet

Company
 └── contacts → Set<Contact>

TimeEntry (standalone, linked to user/task)
```

---

## Frontend Structure

```
frontend/src/
├── App.jsx                # Routing (React Router)
├── contexts/
│   └── AuthContext.jsx    # Global auth state — stores JWT, current user
├── utils/
│   └── api.js             # All API calls go through here (base URL + auth header)
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── ProjectDetails.jsx
│   ├── CRM.jsx
│   ├── Tasks.jsx
│   ├── Timesheet.jsx
│   └── UserManagement.jsx
└── components/
    ├── PrivateRoute.jsx   # Redirects to login if not authenticated
    ├── AdminRoute.jsx     # Redirects if not ADMIN role
    └── layout/            # Shared layout components
```

---

## Auth Flow

1. User POSTs credentials to `/api/auth/login`
2. Backend validates via `UserDetailsServiceImpl`, returns a JWT token
3. Frontend stores token in `localStorage` via `AuthContext`
4. Every subsequent API call includes `Authorization: Bearer <token>` header (set in `api.js`)
5. `JwtAuthenticationFilter` intercepts every request, validates the token, sets the security context
6. `SecurityConfig` defines which routes are public (`/api/auth/**`) and which require ADMIN role (`/api/users/**`)

---

## Key Config

All in `backend/src/main/resources/application.properties`:

| Key | Value |
|---|---|
| Database | `jdbc:h2:file:./data/bimdb` (relative path — always run from `backend/`) |
| JWT secret | Hardcoded (needs env var before production) |
| JWT expiry | 86400000ms (24 hours) |
| Max file size | 100MB per file, 500MB per request |
| Upload dir | `uploads/` |
| CORS origins | localhost:5173, 5174, 5175 |

---

## Known Issues (to fix before next deploy)

1. **CORS in 3 places** — `SecurityConfig`, `CorsConfig`, and `@CrossOrigin` on some controllers. Inconsistent, needs consolidating.
2. **No environment variables** — JWT secret, DB path, CORS origins are all hardcoded. Must move to env vars before Railway deployment.
3. **Deprecated `frameOptions()`** in SecurityConfig — will break in future Spring Boot versions.
4. **No service layer** — business logic sits directly in controllers. Will be refactored incrementally.
5. **Silent frontend errors** — some catch blocks only `console.log`, never show the user what went wrong.