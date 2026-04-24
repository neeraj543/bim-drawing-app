# Offerte Module — Technical Specification

## Business Context

Small CLT (Cross Laminated Timber) and glulam wood structure supplier/installer. Construction/architecture companies send a request for a price quote → company calculates cost → sends back a formal offerte as PDF. Currently done entirely manually in Excel. This module digitizes and partially automates that process.

---

## Full Workflow

### Incoming Request
External company sends an email with:
- Project name, location, client/contractor name, deadline
- **XLS quantity sheet** — most important file. Contains all quantities (m², m³, pce) pre-calculated by client's engineer. Unit price and total columns are empty — company fills these in.
- **Technical spec PDFs (CSC/CDC)** — material quality, fire resistance, humidity requirements. Reference only, not parsed.
- **OneDrive/WeTransfer link** — architectural drawings and full project files. Stored as a clickable link per project, never downloaded or parsed.

### What the Company Does
1. Read email → note project details
2. Open XLS → read quantities
3. Transfer quantities to Excel offerte template
4. Check technical PDFs → decide quality grade → set unit prices
5. Excel auto-calculates everything else
6. Export PDF → send before deadline

### What the App Automates
- Pull email via **Microsoft Graph API** (Outlook — company pays €150/month for Microsoft 365)
- Parse email fields (client, project, location, deadline) via **Gemini Flash API**
- Upload and parse XLS quantity sheet via **Apache POI** → auto-fill quantities into form
- Auto-calculate all derived costs (Werkblad formulas)
- Generate PDF via **iText or Apache PDFBox**
- Track offerte status

### What Stays Manual
- Unit prices per line item (domain expertise, market dependent)
- Building dimensions, roof type, ceiling heights (from architectural drawings)
- Quality judgment from technical PDFs

---

## Offerte Data Structure

### Part 1 — Algemene Info (General Info)
```
- Date (auto: today)
- Offerte number (auto-increment, format: 001/2026)
- Prepared by
- Client name (from email/XLS header)
- Client address (from email/XLS header)
- Client VAT number (from email/XLS header)
- Construction site address
- Project name (from email)
- Project description (e.g. "Woningen")
- Finish grade (e.g. "Structuur")
- Project type (e.g. "Particulier")
- Number of units
- Building dimensions L x B (manual)
- Number of floors (manual)
- Roof type (manual)
- Roof pitch (manual)
- Cornice height (manual)
- Ridge height (manual)
- Ceiling heights per floor (manual)
```

### Part 2 — Line Items

| # | Section | Input | Auto-calc rule |
|---|---|---|---|
| 1 | Engineering | — | 5% of Structuur total |
| 2 | Structuur — CLT | m² + price/m² | manual |
| 2 | Structuur — GL Columns | m³ + price/m³ | manual |
| 2 | Structuur — GL Beams | m³ + price/m³ | manual |
| 3 | CNC — CLT | — | €11/m² |
| 3 | CNC — GL | — | €260/m³ |
| 4 | Accessoires | — | 12% of Structuur total |
| 5 | Roostering met Beplating (optional) | m² + price/m² | manual |
| 6 | Transport | # trucks | €2250/truck |
| 7 | Montage | — | 22% of Structuur total |

**Totals:** Subtotal excl. VAT → VAT (21%) → Total incl. VAT

### Werkblad (Calculation Rules — Editable in Settings)
Stored in a settings table in the database, not hardcoded. User can override per offerte or globally.
```
Engineering  = 5% of Structuur total
CNC CLT      = €11/m²
CNC GL       = €260/m³
Accessories  = 12% of Structuur total
Montage      = 22% of Structuur total
Transport    = €2250 per truck
VAT          = 21%
```

---

## XLS Quantity Sheet Structure

Header contains client name and project reference. Rows have:
- Line number, reference, post number, description
- Type: **QF** (Quantité Forfaitaire) = price these | **PM** (Pour Mémoire) = skip
- Unit (m²/m³/pce), quantity, unit price (empty), total (empty)

Example items from a real file:
```
Caissons préfabriqués 24cm     1,489.90 m²
Caissons préfabriqués 16cm     2.80 m²
Ancrages pré-scellés           42 pce
Poteaux GL24h (columns)        115.97 m³
Poutres principales (beams)    138.79 m³
Planchers CLT 240mm            44.88 m³
Planchers CLT 220mm            7.04 m³
Planchers CLT 160mm            460.96 m³
Garde-corps CLT 100mm          7.61 m³
```

App maps QF rows to corresponding offerte line items via Apache POI + Gemini Flash (for messy/inconsistent layouts).

---

## Offerte Overview Page

List of all offertes with:
- Offerte number, project name, client name, date, deadline, status, total excl. VAT
- Actions: View, Edit, Download PDF, Duplicate
- Filter by status, sort by date/deadline, search by client/project
- Color-coded status badges (red = approaching/passed deadline, green = accepted)
- Quick stats: total offertes, total value pending, accepted this month

---

## Tech Stack

| Layer | Tech |
|---|---|
| PDF generation | iText or Apache PDFBox (backend) |
| XLS parsing | Apache POI (backend) |
| Email integration | Microsoft Graph API (Outlook) |
| AI parsing | Gemini Flash API (email fields + XLS mapping) |
| File storage | OneDrive links per project (no heavy files in app) |

---

## Automation Coverage (~65-70%)

| Task | Automated? |
|---|---|
| Today's date, offerte number | ✅ Auto |
| Client name, address, VAT (from XLS/email) | ✅ Auto |
| Project name, location, deadline (from email via Gemini) | ✅ Auto |
| All quantities (from XLS via POI) | ✅ Auto |
| Engineering, CNC, Accessories, Montage, Transport, VAT | ✅ Auto |
| PDF generation | ✅ Auto |
| Unit prices per item | ❌ Manual |
| Building dimensions, floors, roof type | ❌ Manual |
| Quality grade decision | ❌ Manual |

---

## Future Enhancements
- AI extraction from technical PDFs
- Auto follow-up email reminders on deadline
- Link accepted offerte → project in project manager
- Finance module: accepted offerte → invoice
- Default unit price list (pre-filled rates)

---

## Important Notes
- Werkblad rates must be editable in a settings page — not hardcoded
- Offerte number is sequential per year: 001/2026, 002/2026 etc.
- Every offerte is unique — quantities and prices change per project
- OneDrive link stored per project, files never downloaded into app
- Technical PDFs are reference only — not parsed in MVP
