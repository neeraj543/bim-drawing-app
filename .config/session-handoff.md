# BIM Drawing Manager - Progress Checklist

## 📊 Current Status
**Active Feature:** Feature 3 - Bulk Download & Custom Naming
**Last Updated:** 2025-12-12

---

## ✅ Completed Features

### Feature 1: Projects - List, Create, Edit, Delete
- [x] Backend: ProjectController with all CRUD endpoints
- [x] Backend: DTOs (CreateProjectDTO, UpdateProjectDTO, ProjectResponseDTO)
- [x] Frontend: Dashboard page with project grid
- [x] Frontend: CreateProjectForm component
- [x] Frontend: ProjectCard component
- [x] Frontend: ProjectDetails page with edit/delete functionality
- [x] Styling: Modern UI with Tailwind CSS
- [x] Testing: All endpoints verified in Postman
- [x] Commits: `feat: Add project CRUD`, `feat: Add edit and delete functionality for projects`

### Feature 2: Drawing Sets - CRUD & File Upload
- [x] Backend: DrawingSet entity and repository
- [x] Backend: DrawingFile entity and repository
- [x] Backend: DrawingSetController with CRUD endpoints
  - [x] POST `/api/projects/{projectId}/drawing-sets` - Create set
  - [x] GET `/api/projects/{projectId}/drawing-sets` - List sets
  - [x] GET `/api/drawing-sets/{id}` - Get specific set
  - [x] DELETE `/api/drawing-sets/{id}` - Delete set
- [x] Backend: DTOs (DrawingSetCreateRequest, DrawingSetResponse, DrawingFileResponse)
- [x] Backend: File upload configuration (50MB per file, 200MB per request)
- [x] Backend: Multi-file upload endpoint with auto-rename logic
  - [x] Extract sheet number from filename (e.g., "Sheet_A101.pdf" → "A101")
  - [x] Generate renamed filename: `{sheet}_{desc}_{rev}_{date}.pdf`
  - [x] Save to organized structure: `uploads/project-{id}/set-{id}/`
  - [x] Store both original and renamed filenames
- [x] Frontend: CreateDrawingSetModal
- [x] Frontend: DrawingSetCard component
- [x] Frontend: FileUploadModal with file picker and description inputs
- [x] Frontend: Display files with renamed filenames
- [x] Commits: `feat: Add DrawingSet DTOs and CRUD controller`, `feat: Add file upload with auto-rename functionality`

---

## 🚧 In Progress: Feature 3 - Bulk Download & Custom Naming

### Part A: Bulk Download
- [ ] Backend: Add ZIP download endpoint
  - [ ] `GET /api/drawing-sets/{id}/download` - Bundle all files as ZIP
  - [ ] Use Java's ZipOutputStream to create archive
  - [ ] Include renamed filenames in ZIP
- [ ] Frontend: Add "Download All" button on DrawingSetCard
- [ ] Test: Verify ZIP downloads with correct filenames

### Part B: Custom Naming Structures
- [ ] Backend: Add naming pattern support
  - [ ] Add `namingPattern` field to DrawingSet entity
  - [ ] Create predefined template options
  - [ ] Support placeholders: `{sheet}`, `{description}`, `{revision}`, `{date}`, `{project}`
  - [ ] Update `generateRenamedFileName()` to use selected pattern
- [ ] Backend: Pattern validation logic
- [ ] Frontend: Naming pattern selector in CreateDrawingSetModal
  - [ ] Dropdown with template options:
    - [ ] Template 1: `{sheet}_{description}_{revision}_{date}.pdf` (current default)
    - [ ] Template 2: `{project}-{sheet}-{revision}.pdf`
    - [ ] Template 3: `{sheet}_{date}_{revision}.pdf`
    - [ ] Custom: User-provided pattern
  - [ ] Preview of example filename
- [ ] Test: Create sets with different patterns and verify file naming

---

## 📋 Backlog (Future Features)

### Feature 4: Tasks/Task Board
- [ ] Backend: Task entity and repository
- [ ] Backend: TaskController with CRUD endpoints
- [ ] Frontend: Kanban board UI
- [ ] Frontend: Task creation and assignment

### Feature 5: Revision History & Comparison
- [ ] Track revision history (Rev A, B, C)
- [ ] Mark latest revision per set
- [ ] Compare revisions side-by-side

### Feature 6: User Authentication
- [ ] Replace "system" user with real authentication
- [ ] User registration and login
- [ ] Role-based permissions

---

## 🗂️ Architecture Reference

### Tech Stack
- **Backend:** Spring Boot (Java) - API server on localhost:8080
- **Frontend:** React + Vite - SPA on localhost:5173
- **Database:** H2 in-memory (development) → PostgreSQL (production)
- **Styling:** Tailwind CSS
- **File Storage:** Local filesystem (`uploads/` directory)

### Key File Locations
```
backend/src/main/java/com/bim/backend/
├── entity/          # DrawingSet, DrawingFile, Project, User
├── dto/             # Request/Response DTOs
├── controller/      # REST API endpoints
├── repository/      # JPA repositories
└── config/          # DataInitializer (system user setup)

frontend/src/
├── pages/           # Dashboard, ProjectDetails
├── components/      # CreateDrawingSetModal, FileUploadModal, DrawingSetCard
└── App.jsx          # React Router configuration
```

### Current Endpoints

**Projects:**
- GET `/api/projects` - List all
- GET `/api/projects/{id}` - Get by ID
- POST `/api/projects` - Create
- PUT `/api/projects/{id}` - Update
- DELETE `/api/projects/{id}` - Delete

**Drawing Sets:**
- POST `/api/projects/{projectId}/drawing-sets` - Create set
- GET `/api/projects/{projectId}/drawing-sets` - List sets for project
- GET `/api/drawing-sets/{id}` - Get set details
- DELETE `/api/drawing-sets/{id}` - Delete set

**File Upload:**
- POST `/api/drawing-sets/{setId}/upload` - Upload multiple PDFs with auto-rename

---

## 🎯 Next Session Action Items

### Immediate Next Steps (Feature 3):
1. Implement ZIP download endpoint in DrawingSetController
2. Add "Download All" button in DrawingSetCard
3. Add `namingPattern` field to DrawingSet entity and migration
4. Create naming pattern templates
5. Update auto-rename logic to use selected pattern
6. Add pattern selector UI to CreateDrawingSetModal

### Testing Checklist:
- [ ] ZIP download includes all files with correct names
- [ ] Different naming patterns generate correct filenames
- [ ] Pattern preview updates in real-time
- [ ] Files uploaded with custom patterns are stored correctly

---

## 📝 Git Status (Snapshot)
```
Current branch: master
Modified: PROJECT_PLAN.md
Modified: backend/src/main/java/com/bim/backend/controller/DrawingSetController.java
Untracked: backend/uploads/project-1/set-1/*.pdf (3 test PDFs)
```

---

## 💡 Development Workflow Reminder
1. ✅ **One feature at a time** - Complete before moving to next
2. ✅ **Method-by-method** - Show each method for review before creating next
3. ✅ **Test before commit** - Verify functionality works
4. ✅ **Realistic commits** - One commit per complete feature