# BIM Drawing App - Development Plan

## Development Approach
**Step-by-Step Implementation with Review at Each Stage**

### Core Principles:
1. **One feature at a time** - Complete and commit each feature before moving to the next
2. **Method-by-method creation** - For controllers and components:
   - Create ONE method/function at a time
   - Show it to the user for review
   - Get approval before creating the next method
   - This ensures understanding and keeps code realistic
3. **Test before commit** - Always test functionality before committing
4. **Realistic commits** - One commit per complete feature

---

## Feature Implementation Order

### ✅ Feature 1: Projects - List, Create, Edit, Delete (COMPLETED)
- ✅ ProjectController with DTOs
- ✅ Dashboard Component with project list
- ✅ Create Project Form
- ✅ ProjectDetails page with Edit/Delete functionality
- Commits: `feat: Add project CRUD`, `feat: Add edit and delete functionality for projects`

### ✅ Feature 2: Drawing Sets - CRUD & File Upload (COMPLETED)
- ✅ DrawingSet DTOs and Controller
  - Created: `DrawingSetCreateRequest.java`, `DrawingSetResponse.java`, `DrawingFileResponse.java`
  - Endpoints: Create, List, Get, Delete drawing sets
- ✅ File Upload with Auto-Rename
  - Multi-file upload endpoint
  - Auto-rename logic: extracts sheet number (e.g., "Sheet_A101") → generates `{sheet}_{desc}_{rev}_{date}.pdf`
  - Organizes files: `uploads/project-{id}/set-{id}/`
- ✅ Frontend UI in ProjectDetails.jsx
  - CreateDrawingSetModal
  - DrawingSetCard (displays files)
  - FileUploadModal (file picker + descriptions)
- Commits: `feat: Add DrawingSet DTOs and CRUD controller`, `feat: Add file upload with auto-rename functionality`

---

### 🚧 Feature 3: Bulk Download & Custom Naming (IN PROGRESS)

#### **Part A: Bulk Download**
- [ ] Backend: Add ZIP download endpoint
  - `GET /api/drawing-sets/{id}/download` - Downloads all files as ZIP
  - Use Java's ZipOutputStream to bundle renamed files
- [ ] Frontend: Add "Download All" button
  - On each DrawingSetCard
  - Triggers download of ZIP file

#### **Part B: Custom Naming Structures**
- [ ] Backend: Add naming pattern support
  - Add `namingPattern` field to DrawingSet entity
  - Create predefined templates (user can select from dropdown)
  - Pattern placeholders: `{sheet}`, `{description}`, `{revision}`, `{date}`, `{project}`
  - Update `generateRenamedFileName()` to use pattern
- [ ] Frontend: Pattern selector UI
  - Dropdown in CreateDrawingSetModal with template options
  - Examples:
    - Template 1: `{sheet}_{description}_{revision}_{date}.pdf` (current)
    - Template 2: `{project}-{sheet}-{revision}.pdf`
    - Template 3: `{sheet}_{date}_{revision}.pdf`
    - Custom: User can provide own pattern

---

## Future Features (Backlog)
- Feature 4: Tasks (if needed)
- Feature 5: Authentication (if time permits)

