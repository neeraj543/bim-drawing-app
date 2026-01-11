# BIM Drawing Management App - Mid-Term Project Summary

## 1. What the Project Is

This is a web-based document management system built specifically for handling architectural drawings and BIM (Building Information Modeling) PDFs. The main goal is to solve a real problem I noticed in architectural workflows - when architects export drawings from Revit, the files need to be manually renamed and organized, which wastes a lot of time.

My app automatically renames uploaded PDF files following a consistent pattern (Sheet Number + Description + Revision + Date), organizes them by project and drawing sets, and allows bulk downloads. It's basically a specialized file manager that saves architects 30+ minutes every time they upload a new set of drawings.

## 2. What I Built

I built a full-stack web application with three main parts:

**Frontend (React App):**
- A dashboard where users can see all their projects
- Project detail pages showing different drawing sets (revisions)
- Upload interface for PDF files with automatic renaming
- Search and filtering capabilities
- Download feature to get entire drawing sets as ZIP files

**Backend (Spring Boot API):**
- RESTful API that handles all the data operations
- File upload processing with the auto-rename logic
- Database management for projects, drawing sets, and file metadata
- ZIP generation for bulk downloads

**Database (H2):**
- Stores all project information, drawing sets, and file metadata
- Currently using H2 for development, but designed to switch to PostgreSQL for production

## 3. What I Did Technically

**Backend Development:**
- Used Spring Boot 3 with Java 17 as the main framework
- Implemented Spring Data JPA for database operations (ORM with Hibernate)
- Created a layered architecture: Controllers → Entities → Repositories → DTOs
- Built file upload handling with regex pattern matching to extract sheet numbers from filenames
- Implemented in-memory ZIP file generation using `ZipOutputStream` for efficient bulk downloads
- Set up CORS configuration to allow frontend-backend communication
- Configured file upload limits (100MB per file, 500MB total request size)

**Frontend Development:**
- Built the UI with React 19 and React Router v7 for navigation
- Used Vite as the build tool for fast development and bundling
- Styled everything with Tailwind CSS v4 for a modern, responsive design
- Implemented client-side search filtering using JavaScript array methods
- Created reusable modal components for forms (create, edit, delete, upload)
- Used the Fetch API for all HTTP requests to the backend
- Built a component-based architecture with separate pages and reusable components

**Key Technical Implementations:**
- **Auto-Rename Logic**: Created a regex-based system that extracts sheet numbers from filenames (pattern: `Sheet[_-]?([A-Za-z0-9]+)`), normalizes descriptions, and generates standardized names like `A101_Floor-Plan_RevA_2025-12-19.pdf`
- **File Organization**: Files are stored hierarchically in `uploads/project-{id}/set-{id}/` structure
- **Bulk Download**: Implemented streaming ZIP creation without creating temporary files on disk
- **Responsive UI**: Mobile-first design that works on different screen sizes

## 4. What the Functionalities Are

**Project Management:**
- Create new projects with name and description
- View all projects on a dashboard with search functionality
- Edit project details
- Delete projects
- See project metadata (owner, creation date)

**Drawing Set Management:**
- Create versioned drawing sets (e.g., "Rev A - Initial Submission")
- Track revision numbers for each set
- View all drawing sets within a project
- Delete drawing sets
- Search and filter drawing sets

**File Upload & Auto-Rename:**
- Upload multiple PDF files at once
- Automatically rename files following a standard pattern
- Add custom descriptions to each file during upload
- Extract sheet numbers from original filenames using pattern matching
- Track both original and renamed filenames in the database
- Store file size and metadata

**File Download:**
- Download entire drawing sets as ZIP files
- ZIP files contain the properly renamed files
- Automatic ZIP filename based on the drawing set name
- Memory-efficient streaming download

**User Interface:**
- Clean, modern design with smooth animations
- Real-time search across projects and drawing sets
- Modal dialogs for all create/edit/delete operations
- Visual feedback for loading states and empty data
- Responsive layout that works on mobile and desktop
- Color-coded action buttons (create, edit, delete, download)

**Current Status:**
- All core functionalities are complete and working
- The app successfully handles the full workflow: create project → create drawing set → upload files → download as ZIP
- Search and filtering work on both the dashboard and project details pages
- UI is polished and user-friendly

---

**Technologies Used:**
- Frontend: React 19, React Router v7, Tailwind CSS v4, Vite
- Backend: Spring Boot 3, Spring Data JPA, Hibernate, Maven
- Database: H2 (development), PostgreSQL ready for production
- Language: JavaScript (frontend), Java 17 (backend)