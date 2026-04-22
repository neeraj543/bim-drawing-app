# Offerte Module — Technical Specification

## Business Context

Small architecture/CLT construction firm (1–3 people). They receive quote requests from construction companies, calculate the price for supplying and installing a CLT (Cross Laminated Timber) and glulam wood structure, and send back a formal offerte as a PDF. Currently done manually in Excel — this module digitizes and partially automates it.

---

## Workflow

1. **Incoming request** — email with project name, client, deadline, optional attachments (technical spec PDF, quantity XLS)
2. **Offerte creation** — team fills in quantities/prices; auto-calculations handle the rest
3. **Offerte sent** — PDF generated and sent to client
4. **Follow up** — status tracked (pending / accepted / rejected)

---

## Data Structure

### Part 1 — General Info (Algemene Info)
- Date, Offerte number (e.g. 001/2023), Prepared by
- Client name, address (street, postcode, city), VAT number
- Construction site address
- Project description, Finish grade, Project type
- Number of units, Building dimensions (L x B), Number of floors
- Roof type, Roof pitch, Cornice height, Ridge height
- Ceiling heights per floor (kelder, gelijkvloers, verdiep 1, zolderverdiep)

### Part 2 — Line Items

| # | Section | Input | Auto-calc rule |
|---|---|---|---|
| 1 | Engineering | — | 5% of Structuur total |
| 2 | Structuur — CLT | m² + price/m² | manual |
| 2 | Structuur — GL Columns | m³ + price/m³ | manual |
| 2 | Structuur — GL Beams | m³ + price/m³ | manual |
| 3 | CNC — CLT | — | €8/m² + 12% markup = ~€11/m² |
| 3 | CNC — GL | — | €260/m³ |
| 4 | Accessoires | — | 12% of Structuur total |
| 5 | Roostering met Beplating (optional) | m² + price/m² | manual |
| 6 | Transport | # trucks | €2250/truck |
| 7 | Montage | — | 22% of Structuur total |

**Totals:** Subtotal excl. VAT → VAT (21%) → Total incl. VAT

---

## Offerte Overview Page

List of all offertes with:
- Offerte number, project name, client name, date, deadline, status, total excl. VAT
- Actions: View, Edit, Download PDF, Duplicate
- Filter by status, sort by date/deadline, search by client/project
- Color-coded status badges (red = approaching deadline, green = accepted)
- Quick stats: total offertes, total value pending, accepted this month

---

## Email Import (MVP)

User pastes raw email text → app parses with regex to pre-fill:
- Client name, project name/location, submission deadline

Key labels in emails: `Maître d'ouvrage`, `Projet`, `Soumission`

User can also upload an XLS quantity sheet → app maps rows to offerte line items.

---

## PDF Generation

- Generated server-side with **iText or Apache PDFBox**
- Matches layout of Excel template
- Includes Algemene Info + itemized price table + totals + static legal terms
- Frontend triggers generation, downloads result

---

## Tech

- **PDF:** iText or Apache PDFBox (backend)
- **XLS parsing:** Apache POI (backend)
- **No AI for MVP** — all parsing/calculation is deterministic

---

## Automation Summary

| Task | Automated? |
|---|---|
| Engineering, CNC, Accessories, Montage, Transport costs | ✅ Auto |
| VAT calculation | ✅ Auto |
| Email field extraction | ✅ Partial (regex) |
| XLS quantity import | ✅ Partial (column mapping) |
| CLT/GL quantity input | ❌ Manual |
| Price per m² / m³ | ❌ Manual |

---

## Future

- AI extraction from technical PDF attachments
- Auto follow-up email reminders on deadline
- Link accepted offerte → project in project manager
- Finance module: accepted offerte → invoice
- Duplicate offerte for similar projects
