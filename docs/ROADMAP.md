# Roadmap

## Bug Fixes (Do Soon)
- **Password / username change has a bug** — needs investigation and fix
- **App language** — UI needs to be in Dutch throughout

---

## What's Built

### Core App (Internship 1)
- **Auth** — JWT login/register, role-based access (ADMIN / USER)
- **Projects** — full CRUD, owner + team members, project number/name for BIM naming
- **Drawing Sets** — versioned sets per project, file upload with auto-rename logic
  - Auto-rename: extracts sheet number from filename → `A101_Description_RevA_2025-01-01.pdf`
  - Files stored at `uploads/project-{id}/set-{id}/`
  - Bulk download as ZIP
- **Tasks** — create, assign, update, delete per drawing set
- **Time Entries** — log time per task
- **CRM** — Companies + Contacts, basic CRUD
- **User Management** — admin can create/edit/delete users

---

## What's Broken

- **Render deployment is down** — backend not responding at `https://bim-frontend-f5e4.onrender.com`
- Moving to **Railway** (Emiel pays) — needs PostgreSQL setup + env vars

---

## What's Coming (Internship 2 — 2 months)

### 1. Fix & Redeploy
- Clean up codebase (service layer, env vars, CORS consolidation)
- Migrate from H2 to PostgreSQL
- Deploy backend + frontend + DB on Railway

### 2. Offerte Module *(highest priority)*
See [OFFERTE_SPEC.md](OFFERTE_SPEC.md) for full technical spec.

**Built:**
- Offerte entity, service, controller (full CRUD)
- Auto-calculations (engineering 5%, CNC fixed rates, accessories 12%, montage 22%, transport per truck, VAT 21%)
- Override support per line item
- Overview page with status filter, search, deadline highlighting, quick stats
- Detail page with price summary
- Create/edit form
- Sample data

**Remaining:**
- PDF generation (iText or PDFBox)
- XLS quantity sheet upload + parsing (Apache POI)
- Email integration via Microsoft Graph API (Outlook)
- AI parsing of email fields + XLS via Gemini Flash API
- Werkblad rates editable in settings page (currently hardcoded)
- Auto-increment offerte number per year (001/2026 format)

### 3. UI Overhaul
- General UI cleanup and modernisation across the app
- **Projects page** — redesign dashboard, move file renaming functionality to a separate tab
- **Tasks page** — upgrade to a proper task board suitable for voice message todo workflow (Kanban or similar)

### 4. Communication / Todo Automation
- Upload or record audio in-app
- Whisper transcribes → AI extracts structured todos
- Todos saved directly to task manager
- Replaces current manual process: Emiel listens to WhatsApp audio → transcribes → builds todo list for Monday meetings
- Tasks page needs to be upgraded (see above) to support this workflow properly

### 5. App-Wide Integration
- Link projects ↔ offertes ↔ tasks ↔ CRM contacts
- Higher level of integration — e.g. accepting an offerte creates a project, project links to client
- Unified view across modules

### 6. CRM Improvements
- Email logging per client
- Communication history (calls, meetings)
- Follow-up reminders
- Mobile-friendly UI

### 7. Finance Module *(if time allows)*
- Invoices
- Budget per project
- Payment status