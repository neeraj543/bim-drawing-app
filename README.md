# BIM Drawing Manager

Internal tool built for Emiel's BIM firm. Manages construction projects, drawing sets, file uploads with auto-renaming, tasks, time tracking, and a CRM. Built with Spring Boot + React.

See [`docs/`](docs/) for full details.

---

## Quick Start

**Backend** (run from `backend/` directory):
```bash
cd backend
./mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run        # Mac/Linux
```

**Frontend** (separate terminal):
```bash
cd frontend
npm install
npm run dev
```

| | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| H2 Console | http://localhost:8080/h2-console |

**Default login:** `admin` / `admin123`

---

## Common Issues

**Port 8080 in use (Windows):**
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**CORS / fetch errors:** Make sure backend is running. Clear localStorage if token is stale (F12 → Application → Local Storage → Clear).

**Database not persisting:** Always run backend from the `backend/` directory — the DB path is relative.

**"Admin user already exists":** Normal on startup, not an error.

---

## Docs

- [Architecture & Codebase](docs/ARCHITECTURE.md) — tech stack, project structure, key files, auth flow
- [Roadmap](docs/ROADMAP.md) — what's built, what's broken, what's coming next