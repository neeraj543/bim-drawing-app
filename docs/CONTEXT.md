# Business Context

## The Company

Small Belgian architecture firm acting as a **subcontractor** for larger construction/architecture companies. Core work:
- Receive requests for CLT (Cross Laminated Timber) and glulam wood structure quotes
- Calculate prices and send back formal offertes (price quotes) as PDFs
- Manage client relationships and project oversight
- Revit modelling is **outsourced to an external company in Serbia** — they no longer do it in-house

**Key people:**
- **Emiel** — mentor, main contact, runs the firm
- **Geert** — colleague, also uses the app

Only 2-3 people use this app total.

---

## Existing Infrastructure

- **Microsoft 365** — €150/month. They use Outlook, OneDrive, Teams. This is why Microsoft Graph API is used for email integration — no extra cost.
- **OneDrive** — large project files (architectural drawings, full project packages) live here. App stores the OneDrive link per project only — files are never downloaded into the app.
- **Railway** — paid hosting (~$5-10/month total including PostgreSQL). Emiel pays. Migrated from Render (free tier was broken due to spin-down).

---

## Key Decisions & Why

| Decision | Reason |
|---|---|
| Stay with Spring Boot + React | App already exists, switching stacks would waste weeks |
| Railway over Render | Render free tier kept spinning down — paid tier solves it |
| PostgreSQL on Railway | Replacing H2 for production reliability |
| Gemini Flash for AI | Cheaper than OpenAI/Claude API for email parsing |
| Microsoft Graph API for email | Company already pays for Microsoft 365 — no extra cost |
| No file storage in app | Large files stay on OneDrive, keeps Railway costs low |
| No Zoho CRM | Overkill for 3 people — improving existing CRM is enough |
| Revit automation deprioritised | Company outsourced Revit to Serbia; door left open for later |
| Werkblad rates in settings DB | Rates change — must be editable without a code deploy |
| Deploy after offerte module | No point deploying a broken/incomplete app |

---

## Offerte Workflow (Business Process)

1. External company emails a quote request with an XLS quantity sheet
2. Emiel opens XLS, reads quantities, transfers to Excel template, sets unit prices
3. Excel calculates totals, he exports PDF and sends it back before the deadline

**The app replaces steps 1-3** — pulls email, parses quantities, auto-calculates, generates PDF.

Full technical spec: [OFFERTE_SPEC.md](OFFERTE_SPEC.md)

---

## Voice/WhatsApp Todo Context

Emiel manually listens to WhatsApp group audio messages after weekends, transcribes them, and builds a todo list for Monday meetings. The planned automation replaces this — upload audio or WhatsApp export → Whisper transcribes → AI extracts structured todos → saved to task manager.

---

## Internship Info

- 2-month full-time solo developer internship (second internship at same company)
- Part of a programming course
- Previous intern built the base app (projects, tasks, time tracker, CRM, drawing sets)
- This internship: offerte module + communication automation + CRM improvements