# BIM Drawing App

Full-stack BIM drawing management application for construction projects, drawing sets, and task assignments.

## Overview

Manages BIM construction projects with:
- Project organization and tracking
- Drawing set management with revisions
- File uploads (PDF, DWG) stored in `backend/uploads/`
- Task assignment to team members
- Role-based access: Admin, Manager, User

## Prerequisites

- **Java 21+** (check: `java -version`)
- **Node.js 18+** (check: `node -v`)
- **Maven wrapper included** - no need to install Maven separately

## Quick Start

```bash
# Backend (always run from backend/ directory)
cd backend
./mvnw.cmd spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080
- **Default Login:** admin / admin123

## Key Configuration

- **Database:** `backend/data/bimdb` (H2 file-based, relative path)
- **Uploads:** `backend/uploads/`
- **API URL:** Configured in `frontend/src/utils/api.js`
- **CORS Allowed Ports:** 5173, 5174, 5175 (configured in `SecurityConfig.java`)
- **H2 Console:** http://localhost:8080/h2-console (jdbc:h2:file:./data/bimdb)

## Common Issues

### "mvn: command not found"
Use Maven wrapper instead:
```bash
./mvnw.cmd spring-boot:run    # Windows
./mvnw spring-boot:run         # Mac/Linux
```

### "Port 8080 already in use"
**Windows:**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:8080 | xargs kill -9
```

### "Request failed" / CORS errors

1. **Backend not running?** Check terminal for "Started BackendApplication"
2. **Not logged in?** API requires authentication (except `/api/auth/**`)
3. **Wrong port?** Backend allows 5173/5174/5175. If Vite uses different port, update `SecurityConfig.java`
4. **Stale token?** Clear localStorage (F12 → Application → Local Storage)

### Database not persisting

**Always run backend from `backend/` directory** - database path is relative (`./data/bimdb`). Running from wrong directory creates separate database files.

### File upload fails

- Max file size: 100MB
- Max request size: 500MB
- Check `backend/uploads/` exists and is writable

### "Admin user already exists"

Normal info message, not an error.

## Tech Stack

**Backend:** Spring Boot 3.4.12 (Java 21) + Spring Security + JWT + H2
**Frontend:** React 19 + Vite + Tailwind CSS 4 + React Router 7

## Architecture (Key Files)

### Backend (`backend/src/main/java/com/bim/backend/`)
- **config/SecurityConfig.java** - CORS (ports 5173/74/75), JWT, authentication (line 57: CORS origins)
- **config/CorsConfig.java** - Duplicate CORS config (only allows 5173)
- **config/DataInitializer.java** - Creates default admin user on startup
- **filter/JwtAuthenticationFilter.java** - JWT token validation
- **controller/** - REST endpoints (ProjectController, DrawingSetController, TaskController, etc.)
- **model/** - JPA entities (Project, DrawingSet, DrawingFile, Task, User)
- **repository/** - Data access (5 JPA repositories)
- **service/** - Business logic
- **resources/application.properties** - Config (DB path, JWT secret, file size limits)

### Frontend (`frontend/src/`)
- **utils/api.js** - API client (base URL: http://localhost:8080)
- **components/** - React components (CreateProjectForm, ProjectDetails, FileUploadModal, etc.)
- **pages/** - Page components (Dashboard, Projects, Login)
- **App.jsx** - Main app with routing

## Known Quirks & Issues

⚠️ **Critical things to be aware of:**

1. **Relative Database Path** - Database at `./data/bimdb` is relative. Must run backend from `backend/` directory or data won't persist correctly.

2. **CORS Configured in 3 Places** - Inconsistent:
   - `SecurityConfig.java` line 57: allows ports 5173, 5174, 5175
   - `CorsConfig.java` line 18: only allows 5173
   - `@CrossOrigin` annotations on 3 controllers: only 5173

3. **No Global Exception Handler** - Backend throws generic `RuntimeException` everywhere (25+ instances). No `@ControllerAdvice`, so all errors return 500 with unhelpful messages.

4. **Minimal Logging** - Only 2 files use logging (DataInitializer, JwtAuthenticationFilter). No visibility when things fail.

5. **Generic Error Messages** - Frontend shows "Request failed" for all errors. No error details, codes, or field validation feedback.

6. **Platform-Specific** - Developed for Unix/Mac. On Windows:
   - Must use `./mvnw.cmd` instead of `mvn`
   - Git Bash doesn't have Maven in PATH

7. **No Environment Variables** - Everything hardcoded in `application.properties` and `api.js`. No `.env` files.

8. **Weak JWT Secret** - Default secret in application.properties says "change this in production" but no guidance provided.

9. **Deprecated API** - Uses deprecated `frameOptions()` in SecurityConfig (line 40) - will break in future Spring Boot versions.

10. **Silent Failures** - Frontend catches errors but doesn't always show them (e.g., DrawingSetCard.jsx line 19-21 logs to console only).
