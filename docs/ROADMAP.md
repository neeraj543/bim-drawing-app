# Roadmap

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

### 2. Offerte Tracker *(highest priority — due next week)*
See [`docs/OFFERTE_SPEC.md`](OFFERTE_SPEC.md) for full technical spec.
- Track offerte status: draft / sent / pending / accepted / rejected
- Form based on Emiel's Excel template with auto-calculations (engineering 5%, accessories 12%, montage 22%, CNC fixed rates, transport per truck)
- Generate + download PDF (iText or PDFBox backend)
- Parse incoming emails via regex to pre-fill client/project/deadline
- Optional XLS quantity sheet upload (Apache POI)
- Link offertes to clients (CRM) and projects

### 3. Communication / Todo Automation *(second priority)*
- Upload or record audio in-app
- Whisper transcribes → AI extracts structured todos
- Todos saved directly to the task manager
- Replaces current manual process: someone listens to recordings → transcribes → makes todo list by hand

### 4. CRM Improvements
- Email logging per client
- Communication history (calls, meetings)
- Follow-up reminders
- Mobile-friendly UI

### 5. Finance Module *(if time allows)*
- Invoices
- Budget per project
- Payment status