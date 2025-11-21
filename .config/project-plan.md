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

## Notes to Add Later
(Add any additional context, decisions, or reminders here as we progress)
