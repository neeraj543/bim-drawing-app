# BIM Drawing Manager - Project Memory

## Project Overview
Web app for BIM teams to organize Revit PDF drawings and track tasks. **Main benefit: Auto-rename 50+ PDFs in 5 minutes instead of 30+ minutes manually.**

## Tech Stack
- **Backend**: Spring Boot (Java)
- **Frontend**: React + Vite
- **Database**: PostgreSQL
- **Storage**: Local server files

## 5 Core Features

### 1. Login & Projects
- Username/password login
- Create projects (e.g., "Office Renovation")
- Add team members to projects

### 2. Dashboard
- See all projects
- View tasks due soon
- See recent drawing uploads

### 3. Task Board
- Track tasks: To-Do → In Progress → Done
- Assign to team members
- Set deadlines

### 4. Drawing Upload (MAIN FEATURE - THE KEY VALUE)
**Problem**: Revit exports "Sheet_A101.pdf" → must manually rename to "A101_Floor-Plan-Level-1_RevB_2024-11-17.pdf" (30-45 mins for 50 files)

**Solution**:
1. Create "Drawing Set" (e.g., "Rev B - Authority Submission")
2. Upload all PDFs at once
3. **App auto-renames them in seconds**

**Auto-rename format**: `A101_Floor-Plan-Level-1_RevB_2024-11-17.pdf`

### 5. Revision History
- See all past drawing sets
- Rev A, Rev B, Rev C with dates
- Download any revision
- Mark "LATEST" on newest

## Storage Strategy
- Keep last **3 revisions** per project on server
- Older revisions: Download as ZIP, delete from server
- Database remembers all history
- **Cost: ~$10/month**

## 8-Week Development Timeline
| Week | Task |
|------|------|
| 1 | Setup + Login |
| 2 | Projects + Dashboard |
| 3 | Task Board |
| 4 | File upload backend |
| 5 | File upload UI + auto-rename |
| 6 | History view + archive |
| 7 | Polish + extras |
| 8 | Testing + demo |

## NOT Included (Phase 1)
- Email sending
- Cloud storage (OneDrive)
- Client approvals
- Reading PDF contents

## Key Success Metrics
✅ Upload 50 PDFs and auto-rename in **under 5 minutes**
✅ Clear revision history (Rev A, B, C)
✅ Track tasks without forgetting
✅ Storage costs under **$10/month**

## Key API Endpoints

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/{id}` - Project details

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/projects/{id}/tasks` - List tasks
- `PUT /api/tasks/{id}` - Update task

### Drawing Sets
- `POST /api/projects/{id}/drawing-sets` - Create set
- `POST /api/drawing-sets/{id}/upload` - Upload PDFs
- `GET /api/projects/{id}/drawing-sets` - List all sets
- `GET /api/drawing-sets/{id}/files/{fileId}` - Download file

---

## Architecture Approach

### Similar to MVC (Model-View-Controller) but adapted for React + REST API

- **Model** = JPA Entities (User, Project, Task, DrawingSet, DrawingFile)
- **View** = React Frontend (no Thymeleaf - we have a separate frontend)
- **Controller** = Spring Boot REST Controllers (handles API requests/responses)
- **Repository** = Spring Data JPA Repositories (database access layer)

### Keep it Simple
- No complex service layers initially
- Controllers call repositories directly for now
- Add layers only when needed
- DTOs will separate API responses from database entities

## Database Entities Created
✅ User - username, password, email, fullName, timestamps
✅ Project - name, description, owner, members (many-to-many)
✅ Task - title, description, status (enum), project, assignedTo, dueDate
✅ DrawingSet - name, description, project, revisionNumber, isLatest
✅ DrawingFile - originalFileName, renamedFileName, filePath, fileSize

## Progress Tracker

### ✅ COMPLETED
**Backend:**
- User entity, repository, DataInitializer (auto-creates system user)
- Project entity, repository, controller, DTOs
- All Project CRUD endpoints tested in Postman

**Frontend:**
- Dashboard page with project list
- CreateProjectForm component
- ProjectCard component
- ProjectDetails page with edit/delete functionality
- React Router configured
- Modern UI with Tailwind CSS

### 🚧 IN PROGRESS
**Drawing Management (Feature 4):**
- DrawingSet & DrawingFile entities already exist
- DrawingSet & DrawingFile repositories already exist
- **NEXT:** Create DTOs and controller for drawing management

### 📋 TODO
1. DrawingSet DTOs and controller
2. File upload configuration
3. File upload endpoint with auto-rename logic
4. Frontend: Create DrawingSet UI
5. Frontend: File upload UI
6. Task Board (Feature 3)
7. Revision History (Feature 5)
8. User Authentication

## Important Implementation Notes

### Auto-Rename Logic
- Happens DURING file upload (not after)
- Extract sheet number from "Sheet_A101.pdf" → "A101"
- Combine with DrawingSet metadata (revision, date, description)
- Result: "A101_Floor-Plan-Level-1_RevB_2024-11-17.pdf"

### Architecture Decisions Made
- Backend serves JSON API only (no HTML)
- Frontend is pure React SPA
- H2 database for development (will switch to PostgreSQL)
- System user auto-created on app startup
