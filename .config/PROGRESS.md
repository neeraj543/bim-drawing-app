# BIM Drawing Manager - Task Tracker

## 📊 Current Status
**Last Updated:** 2025-12-12
**Active Work:** Frontend Redesign & Refactoring

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
- [x] Frontend: DrawingSetCard component (inline in ProjectDetails.jsx)
- [x] Frontend: FileUploadModal with file picker and description inputs
- [x] Frontend: Display files with renamed filenames
- [x] Commits: `feat: Add DrawingSet DTOs and CRUD controller`, `feat: Add file upload with auto-rename functionality`

### Feature 3: Bulk Download (Part A)
- [x] Backend: ZIP download endpoint implemented
  - [x] `GET /api/drawing-sets/{id}/download` - Bundles all files as ZIP
  - [x] Uses Java's ZipOutputStream to create archive
  - [x] Includes renamed filenames in ZIP
- [x] Frontend: "Download All" button on DrawingSetCard
- [x] Commit ready: `feat: Add bulk download feature for drawing sets`

---

## 🚧 Current Tasks (In Progress)

### Frontend Redesign & Architecture
**Priority: HIGH**

#### Task 1: Application Structure Redesign
- [ ] Design proper application layout with:
  - [ ] Navigation bar/sidebar
  - [ ] Proper home page (not just dashboard redirect)
  - [ ] Better routing structure
  - [ ] Professional application feel (like a real SaaS app)
- [ ] Create layout components:
  - [ ] Header/Navbar component
  - [ ] Sidebar component (if needed)
  - [ ] Footer component
  - [ ] Main layout wrapper
- [ ] Update routing to include home page

#### Task 2: Frontend Code Refactoring & Component Extraction
**Problem:** ProjectDetails.jsx has 750+ lines with all components inline
- [ ] Extract components from ProjectDetails.jsx into separate files:
  - [ ] `EditModal.jsx` → `frontend/src/components/modals/EditProjectModal.jsx`
  - [ ] `CreateDrawingSetModal.jsx` → `frontend/src/components/modals/CreateDrawingSetModal.jsx`
  - [ ] `DrawingSetCard.jsx` → `frontend/src/components/DrawingSetCard.jsx`
  - [ ] `FileUploadModal.jsx` → `frontend/src/components/modals/FileUploadModal.jsx`
  - [ ] `DeleteDialog.jsx` → `frontend/src/components/modals/DeleteDialog.jsx`
- [ ] Improve code organization:
  - [ ] Create folder structure: `components/`, `components/modals/`, `components/cards/`
  - [ ] Ensure each component is self-contained and readable
  - [ ] Add proper prop types/documentation
- [ ] Test that all functionality still works after refactoring

---

## 📋 Backlog (Future Features)

### Feature 3: Custom Naming Structures (Part B) - ON HOLD
- [ ] Backend: Add naming pattern support
  - [ ] Add `namingPattern` field to DrawingSet entity
  - [ ] Create predefined template options
  - [ ] Support placeholders: `{sheet}`, `{description}`, `{revision}`, `{date}`, `{project}`
  - [ ] Update `generateRenamedFileName()` to use selected pattern
- [ ] Frontend: Naming pattern selector in CreateDrawingSetModal
  - [ ] Dropdown with template options
  - [ ] Preview of example filename

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

### Current File Structure
```
backend/src/main/java/com/bim/backend/
├── entity/          # DrawingSet, DrawingFile, Project, User
├── dto/             # Request/Response DTOs
├── controller/      # REST API endpoints
├── repository/      # JPA repositories
└── config/          # DataInitializer (system user setup)

frontend/src/
├── pages/           # Dashboard, ProjectDetails (750+ lines - NEEDS REFACTORING)
├── components/      # CreateProjectForm, ProjectCard (need to extract more)
└── App.jsx          # React Router configuration
```

### Target File Structure (After Refactoring)
```
frontend/src/
├── pages/
│   ├── Home.jsx                    # NEW: Proper home/landing page
│   ├── Dashboard.jsx               # Project listing
│   └── ProjectDetails.jsx          # Simplified, components extracted
├── components/
│   ├── layout/
│   │   ├── Header.jsx              # NEW: Navigation bar
│   │   ├── Sidebar.jsx             # NEW: Optional sidebar
│   │   └── Layout.jsx              # NEW: Main layout wrapper
│   ├── cards/
│   │   ├── ProjectCard.jsx         # Existing
│   │   └── DrawingSetCard.jsx     # EXTRACT from ProjectDetails
│   ├── modals/
│   │   ├── EditProjectModal.jsx   # EXTRACT from ProjectDetails
│   │   ├── CreateDrawingSetModal.jsx  # EXTRACT from ProjectDetails
│   │   ├── FileUploadModal.jsx    # EXTRACT from ProjectDetails
│   │   └── DeleteDialog.jsx       # EXTRACT from ProjectDetails
│   └── forms/
│       └── CreateProjectForm.jsx  # Existing
└── App.jsx                         # Updated routing
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
- GET `/api/drawing-sets/{id}/download` - Download all files as ZIP

**File Upload:**
- POST `/api/drawing-sets/{setId}/upload` - Upload multiple PDFs with auto-rename

---

## 🎯 Next Session Action Items

### Immediate Priority:
1. **Frontend Redesign:** Create proper home page and navigation structure
2. **Code Refactoring:** Extract inline components from ProjectDetails.jsx
3. **Commit:** Bulk download feature (already implemented, needs commit)

### After Frontend Work:
- Resume Feature 3 Part B (Custom Naming Structures)
- Begin Feature 4 (Task Board) or Feature 5 (Revision History)

---

## 💡 Development Workflow Reminder
1. ✅ **One feature at a time** - Complete before moving to next
2. ✅ **Method-by-method** - Show each method for review before creating next
3. ✅ **Test before commit** - Verify functionality works
4. ✅ **Realistic commits** - One commit per complete feature
5. ✅ **Keep code clean** - Extract components, avoid huge files