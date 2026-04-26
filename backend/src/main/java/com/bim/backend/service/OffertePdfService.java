package com.bim.backend.service;

import com.bim.backend.dto.OfferteResponse;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class OffertePdfService {

    private static final float MARGIN = 45;
    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
    private static final float CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
    private static final float FOOTER_H = 22;
    private static final float MIN_Y = MARGIN + FOOTER_H + 20;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static final Color SECTION_BG  = new Color(45, 55, 72);
    private static final Color SUB_BG      = new Color(70, 85, 105);
    private static final Color LIGHT_ROW   = new Color(248, 249, 250);

    // ── context per call ──────────────────────────────────────────────────────

    private static class Ctx {
        final PDDocument doc;
        final PDType1Font font;
        final PDType1Font bold;
        PDPageContentStream cs;
        float y;
        int pageNum = 0;

        Ctx(PDDocument doc, PDType1Font font, PDType1Font bold) {
            this.doc = doc; this.font = font; this.bold = bold;
        }
    }

    // ── public entry point ────────────────────────────────────────────────────

    public byte[] generate(OfferteResponse o) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            Ctx ctx = new Ctx(doc,
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA),
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD));

            newPage(ctx);

            drawPage1Header(ctx, doc, o);
            drawClientBlock(ctx, o);
            ctx.y -= 8;
            drawPriceSections(ctx, o);
            drawTotals(ctx, o);

            drawFooter(ctx);
            ctx.cs.close();

            drawLegalPage(ctx);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    // ── page management ───────────────────────────────────────────────────────

    private void newPage(Ctx ctx) throws IOException {
        PDPage page = new PDPage(PDRectangle.A4);
        ctx.doc.addPage(page);
        ctx.cs = new PDPageContentStream(ctx.doc, page);
        ctx.y = PAGE_HEIGHT - MARGIN;
        ctx.pageNum++;
    }

    private void ensureSpace(Ctx ctx, float needed) throws IOException {
        if (ctx.y - needed < MIN_Y) {
            drawFooter(ctx);
            ctx.cs.close();
            newPage(ctx);
        }
    }

    // ── page 1 header ─────────────────────────────────────────────────────────

    private void drawPage1Header(Ctx ctx, PDDocument doc, OfferteResponse o) throws IOException {
        float top = ctx.y;

        // Left: Betreft / Project labels
        text(ctx, ctx.font, 8, "Betreft:", MARGIN, top);
        text(ctx, ctx.bold, 9, "Offerte", MARGIN + 55, top);
        text(ctx, ctx.font, 8, "Project:", MARGIN, top - 14);
        text(ctx, ctx.bold, 9, nvl(o.getProjectDescription()), MARGIN + 55, top - 14);

        // Right: logo
        try {
            ClassPathResource res = new ClassPathResource("logo.png");
            byte[] bytes = res.getInputStream().readAllBytes();
            PDImageXObject logo = PDImageXObject.createFromByteArray(doc, bytes, "logo");
            float lh = 55, lw = logo.getWidth() * (lh / logo.getHeight());
            ctx.cs.drawImage(logo, PAGE_WIDTH - MARGIN - lw, top - lh + 10, lw, lh);
        } catch (Exception ignored) {}

        ctx.y = top - 35;
        hline(ctx, MARGIN, PAGE_WIDTH - MARGIN);
        ctx.y -= 12;
    }

    // ── client / company info block ───────────────────────────────────────────

    private void drawClientBlock(Ctx ctx, OfferteResponse o) throws IOException {
        float left = MARGIN;
        float right = MARGIN + CONTENT_WIDTH / 2 + 10;
        float startY = ctx.y;

        // Left column — client
        grayLabel(ctx, "Client:", left, ctx.y);      ctx.y -= 13;
        text(ctx, ctx.bold, 9, nvl(o.getClientName()), left, ctx.y);  ctx.y -= 12;

        String street = nvl(o.getClientStreet()) + (o.getClientStreetNumber() != null ? " " + o.getClientStreetNumber() : "");
        if (!street.isBlank()) { text(ctx, ctx.font, 9, street, left, ctx.y); ctx.y -= 11; }

        String city = (nvl(o.getClientPostcode()) + " " + nvl(o.getClientCity())).trim();
        if (!city.isBlank()) { text(ctx, ctx.font, 9, city, left, ctx.y); ctx.y -= 11; }

        if (o.getClientVatNumber() != null) {
            text(ctx, ctx.font, 9, "BTW: " + o.getClientVatNumber(), left, ctx.y); ctx.y -= 11;
        }

        ctx.y -= 4;
        text(ctx, ctx.bold, 9, "Offerte nr:", left, ctx.y);
        text(ctx, ctx.font, 9, nvl(o.getOfferteNumber()), left + 65, ctx.y); ctx.y -= 12;

        text(ctx, ctx.bold, 9, "Offerte datum:", left, ctx.y);
        text(ctx, ctx.font, 9, o.getDate() != null ? o.getDate().format(DATE_FMT) : "", left + 85, ctx.y); ctx.y -= 12;

        if (o.getValidUntil() != null) {
            text(ctx, ctx.bold, 9, "Offerte geldig tot:", left, ctx.y);
            text(ctx, ctx.font, 9, o.getValidUntil().format(DATE_FMT), left + 110, ctx.y); ctx.y -= 12;
        }

        if (o.getDeliveryQuarter() != null) {
            text(ctx, ctx.bold, 9, "Levering:", left, ctx.y);
            text(ctx, ctx.font, 9, o.getDeliveryQuarter(), left + 60, ctx.y); ctx.y -= 12;
        }

        // Right column — company contact
        float ry = startY + 13;
        text(ctx, ctx.font, 9, "info@cltxprt.be", right, ry);   ry -= 12;
        text(ctx, ctx.font, 9, "www.cltxprt.be", right, ry);    ry -= 12;
        text(ctx, ctx.font, 9, "BTW BE 0802.871.869", right, ry);

        ctx.y -= 10;
        hline(ctx, MARGIN, PAGE_WIDTH - MARGIN);
        ctx.y -= 10;
    }

    // ── price sections ────────────────────────────────────────────────────────

    private void drawPriceSections(Ctx ctx, OfferteResponse o) throws IOException {
        // 1. Engineering
        ensureSpace(ctx, 80);
        sectionHeader(ctx, "Engineering", o.getEngineeringCost());
        bulletItem(ctx, "Voorstudie");
        bulletItem(ctx, "Stabiliteitsstudie - aanleveren studies bevestigingsmaterialen");
        bulletItem(ctx, "3D-model");
        bulletItem(ctx, "Productieplannen");
        bulletItem(ctx, "Montageplannen");
        bulletItem(ctx, "Opvolging project - oplevering");
        ctx.y -= 4;

        // 2. Structuur
        BigDecimal structTotal = nvlB(o.getStructuurTotal());
        ensureSpace(ctx, 80);
        sectionHeader(ctx, "Structuur", structTotal);

        if (o.getCltM2() != null && o.getCltM2().compareTo(BigDecimal.ZERO) > 0) {
            subHeader(ctx, "CLT-elementen:", multiply(o.getCltM2(), o.getCltPricePerM2()));
            lineItem(ctx, "CLT elementen", fmt(o.getCltM2()) + " m2",
                    o.getCltPricePerM2() != null ? fmt(o.getCltPricePerM2()) + " euro/m2" : null,
                    multiply(o.getCltM2(), o.getCltPricePerM2()));
        }

        boolean hasGl = (o.getGlColumnsM3() != null && o.getGlColumnsM3().compareTo(BigDecimal.ZERO) > 0)
                || (o.getGlBeamsM3() != null && o.getGlBeamsM3().compareTo(BigDecimal.ZERO) > 0);
        if (hasGl) {
            BigDecimal glTotal = nvlB(multiply(o.getGlColumnsM3(), o.getGlColumnsPricePerM3()))
                    .add(nvlB(multiply(o.getGlBeamsM3(), o.getGlBeamsPricePerM3())));
            subHeader(ctx, "GL-elementen:", glTotal);
            if (o.getGlColumnsM3() != null && o.getGlColumnsM3().compareTo(BigDecimal.ZERO) > 0) {
                lineItem(ctx, "Kolommen", fmt(o.getGlColumnsM3()) + " m3",
                        o.getGlColumnsPricePerM3() != null ? fmt(o.getGlColumnsPricePerM3()) + " euro/m3" : null,
                        multiply(o.getGlColumnsM3(), o.getGlColumnsPricePerM3()));
            }
            if (o.getGlBeamsM3() != null && o.getGlBeamsM3().compareTo(BigDecimal.ZERO) > 0) {
                lineItem(ctx, "Balken", fmt(o.getGlBeamsM3()) + " m3",
                        o.getGlBeamsPricePerM3() != null ? fmt(o.getGlBeamsPricePerM3()) + " euro/m3" : null,
                        multiply(o.getGlBeamsM3(), o.getGlBeamsPricePerM3()));
            }
        }
        ctx.y -= 4;

        // 3. CNC bewerking
        BigDecimal cncTotal = nvlB(o.getCncCltCost()).add(nvlB(o.getCncGlCost()));
        ensureSpace(ctx, 60);
        sectionHeader(ctx, "CNC bewerking", cncTotal);
        if (o.getCltM2() != null && o.getCltM2().compareTo(BigDecimal.ZERO) > 0) {
            lineItem(ctx, "CLT: Dimensioneren en zagen van elementen",
                    fmt(o.getCltM2()) + " m2", "11,00 euro/m2", o.getCncCltCost());
            bulletItem(ctx, "  Inclusief uitsparingen voor technieken");
        }
        BigDecimal glM3 = nvlB(o.getGlColumnsM3()).add(nvlB(o.getGlBeamsM3()));
        if (glM3.compareTo(BigDecimal.ZERO) > 0) {
            lineItem(ctx, "GL: Dimensioneren en zagen van elementen",
                    fmt(glM3) + " m3", "260,00 euro/m3", o.getCncGlCost());
            bulletItem(ctx, "  Inclusief uitsparingen voor verbindingsmaterialen");
        }
        ctx.y -= 4;

        // 4. Accessoires
        ensureSpace(ctx, 60);
        sectionHeader(ctx, "Accessoires", o.getAccessoiresCost());
        bulletItem(ctx, "Verbindingsmaterialen");
        bulletItem(ctx, "Schroeven");
        bulletItem(ctx, "Verbindingsmaterialen Rothoblaas");
        bulletItem(ctx, "Luchtdichtheidstape");
        ctx.y -= 4;

        // 5. Roostering (optional)
        if (Boolean.TRUE.equals(o.getIncludeRoostring()) && o.getRoosteringM2() != null) {
            ensureSpace(ctx, 50);
            sectionHeader(ctx, "Roostering met beplating", o.getRoosteringTotal());
            lineItem(ctx, "OSB 22mm - tand en groef", fmt(o.getRoosteringM2()) + " m2",
                    o.getRoosteringPricePerM2() != null ? fmt(o.getRoosteringPricePerM2()) + " euro/m2" : null,
                    o.getRoosteringTotal());
            ctx.y -= 4;
        }

        // 6. Transport
        ensureSpace(ctx, 40);
        sectionHeader(ctx, "Transport", o.getTransportCost());
        if (o.getNumberOfTrucks() != null && o.getNumberOfTrucks() > 0) {
            lineItem(ctx, "Transport per 40m3 - lengte 14m - breedte 2,45m",
                    o.getNumberOfTrucks() + " st", null, o.getTransportCost());
        }
        ctx.y -= 4;

        // 7. Montage
        ensureSpace(ctx, 80);
        sectionHeader(ctx, "Montage", o.getMontageCost());
        bulletItem(ctx, "Monteren van CLT");
        bulletItem(ctx, "Monteren van glulam");
        bulletItem(ctx, "Kraan geleverd door CLTxPRT");
        bulletItem(ctx, "Transporteur op rupsen geleverd door CLTxPRT");
        bulletItem(ctx, "Gereedschap geleverd door CLTxPRT");
        ctx.y -= 4;
    }

    // ── totals block ──────────────────────────────────────────────────────────

    private void drawTotals(Ctx ctx, OfferteResponse o) throws IOException {
        ensureSpace(ctx, 60);
        ctx.y -= 6;
        hline(ctx, MARGIN, PAGE_WIDTH - MARGIN);
        ctx.y -= 14;

        totalRow(ctx, "Totaal excl. BTW", o.getSubtotalExclVat(), false);
        totalRow(ctx, "BTW: 21%", o.getVat(), false);
        hline(ctx, PAGE_WIDTH - MARGIN - 180, PAGE_WIDTH - MARGIN);
        ctx.y -= 3;
        totalRow(ctx, "Totaal incl. BTW", o.getTotalInclVat(), true);

        if (o.getNotes() != null && !o.getNotes().isBlank()) {
            ctx.y -= 14;
            text(ctx, ctx.bold, 9, "Opmerkingen:", MARGIN, ctx.y); ctx.y -= 12;
            text(ctx, ctx.font, 8, sanitize(o.getNotes()), MARGIN, ctx.y); ctx.y -= 12;
        }
    }

    // ── drawing primitives ────────────────────────────────────────────────────

    private void sectionHeader(Ctx ctx, String label, BigDecimal total) throws IOException {
        float rowH = 16;
        ctx.cs.setNonStrokingColor(SECTION_BG);
        ctx.cs.addRect(MARGIN, ctx.y - rowH + 4, CONTENT_WIDTH, rowH);
        ctx.cs.fill();
        ctx.cs.setNonStrokingColor(Color.WHITE);
        text(ctx, ctx.bold, 10, label, MARGIN + 5, ctx.y);
        if (total != null) textRight(ctx, ctx.bold, 10, "EUR " + fmt(total), PAGE_WIDTH - MARGIN - 5, ctx.y);
        ctx.cs.setNonStrokingColor(Color.BLACK);
        ctx.y -= rowH + 4;
    }

    private void subHeader(Ctx ctx, String label, BigDecimal total) throws IOException {
        float rowH = 14;
        ctx.cs.setNonStrokingColor(SUB_BG);
        ctx.cs.addRect(MARGIN, ctx.y - rowH + 4, CONTENT_WIDTH, rowH);
        ctx.cs.fill();
        ctx.cs.setNonStrokingColor(Color.WHITE);
        text(ctx, ctx.bold, 9, label, MARGIN + 12, ctx.y);
        if (total != null) textRight(ctx, ctx.bold, 9, "EUR " + fmt(total), PAGE_WIDTH - MARGIN - 5, ctx.y);
        ctx.cs.setNonStrokingColor(Color.BLACK);
        ctx.y -= rowH + 3;
    }

    private void lineItem(Ctx ctx, String desc, String qty, String rate, BigDecimal total) throws IOException {
        ensureSpace(ctx, 14);
        text(ctx, ctx.font, 8, desc, MARGIN + 12, ctx.y);
        if (qty != null)  text(ctx, ctx.font, 8, qty,  MARGIN + 250, ctx.y);
        if (rate != null) text(ctx, ctx.font, 8, rate, MARGIN + 320, ctx.y);
        if (total != null) textRight(ctx, ctx.font, 8, "EUR " + fmt(total), PAGE_WIDTH - MARGIN - 5, ctx.y);
        ctx.y -= 12;
    }

    private void bulletItem(Ctx ctx, String text) throws IOException {
        ensureSpace(ctx, 12);
        text(ctx, ctx.font, 8, "- " + text, MARGIN + 12, ctx.y);
        ctx.y -= 11;
    }

    private void totalRow(Ctx ctx, String label, BigDecimal amount, boolean bold) throws IOException {
        PDType1Font f = bold ? ctx.bold : ctx.font;
        float size = bold ? 10 : 9;
        text(ctx, f, size, label, PAGE_WIDTH - MARGIN - 180, ctx.y);
        if (amount != null) textRight(ctx, f, size, "EUR " + fmt(amount), PAGE_WIDTH - MARGIN - 5, ctx.y);
        ctx.y -= 14;
    }

    private void grayLabel(Ctx ctx, String t, float x, float y) throws IOException {
        ctx.cs.setNonStrokingColor(new Color(120, 120, 120));
        text(ctx, ctx.font, 8, t, x, y);
        ctx.cs.setNonStrokingColor(Color.BLACK);
    }

    private void hline(Ctx ctx, float x1, float x2) throws IOException {
        ctx.cs.setStrokingColor(new Color(200, 200, 200));
        ctx.cs.moveTo(x1, ctx.y);
        ctx.cs.lineTo(x2, ctx.y);
        ctx.cs.stroke();
        ctx.cs.setStrokingColor(Color.BLACK);
        ctx.y -= 6;
    }

    private void drawFooter(Ctx ctx) throws IOException {
        float fy = MARGIN + FOOTER_H - 5;
        ctx.cs.setNonStrokingColor(new Color(45, 55, 72));
        ctx.cs.addRect(0, fy - 8, PAGE_WIDTH, 18);
        ctx.cs.fill();
        ctx.cs.setNonStrokingColor(Color.WHITE);
        text(ctx, ctx.bold, 8, "CLTXPRT", MARGIN, fy);
        textRight(ctx, ctx.font, 8, "Pag. " + ctx.pageNum + " /", PAGE_WIDTH - MARGIN, fy);
        ctx.cs.setNonStrokingColor(Color.BLACK);
    }

    // ── legal pages ───────────────────────────────────────────────────────────

    private void drawLegalPage(Ctx ctx) throws IOException {
        newPage(ctx);
        ctx.y -= 5;
        text(ctx, ctx.bold, 10, "Algemene Voorwaarden", MARGIN, ctx.y);
        ctx.y -= 16;

        String[] clauses = {
            "1. Bindende kracht — Behalve bijzondere voorwaarden, ondertekend voor akkoord door beide partijen, zijn enkel de voorwaarden van toepassing dewelke hieronder zijn vermeld.",
            "2. Geldigheidsduur — Tenzij anders bepaald zijn onze offertes slechts geldig tijdens een periode van 30 kalenderdagen vanaf de datum van verzending.",
            "3. Prijzen — De prijzen zijn bepaald in een van CLTxPRT uitgaande offerte. Enig ander aanbod mag enkel als informatie worden beschouwd.",
            "4. Betaling — Bij goedkeuring van de productieplannen dient 50% van het bedrag betaalt te worden. De overige 50% dient betaalt te worden voor het laden van het transport.\n   1ste schijf: 100% voorstudie\n   2de schijf: 50% materialen (bij goedkeuring voorstudie)\n   3de schijf: 50% materialen 2 weken voor levering\n   4de schijf: montage + eventuele overschot",
            "5. Prijsherziening — Elke wijziging van lonen, sociale lasten of materiaalprijzen leidt tot een prijsherziening toegepast op de betrokken facturering.",
            "6. Uitvoeringsmodaliteiten — De klant dient ervoor te zorgen dat de werken onmiddellijk kunnen worden aangevat. De werf dient gratis voorzien te worden van elektriciteit en water.",
            "7. Levering en termijnen — Elke termijn van levering wordt slechts op indicatieve wijze aangeduid. Laattijdigheid laat de klant niet toe de bestelling af te zeggen.",
            "8. Onvoorziene omstandigheden — Ongevallen, stakingen, tekort aan materiaal en soortgelijke omstandigheden worden als overmacht beschouwd en geven recht op herziening of ontbinding.",
            "9. Wijzigingen — Elke door de klant bestelde wijziging vereist een voorafgaand schriftelijk akkoord van beide partijen.",
            "10. Verbreking — Indien de klant afziet van de overeengekomen werken is deze gehouden ons schadeloos te stellen, forfaitair begroot op 20% van de niet uitgevoerde werken.",
            "11. Oplevering — Zodra de werken beëindigd zijn, dient de klant over te gaan tot de oplevering. Kleine onvolkomenheden (< 10% aannemingssom) kunnen niet worden ingeroepen om de oplevering te weigeren.",
            "12. Eigendomsvoorbehoud — De materialen blijven eigendom van CLTxPRT tot volledige betaling van alle schulden.",
            "13. Geschillen — Bij geschil zijn enkel de rechtbanken van de woonplaats van de maatschappelijke zetel van CLTxPRT bevoegd.",
        };

        for (String clause : clauses) {
            ensureSpace(ctx, 28);
            for (String line : clause.split("\n")) {
                ensureSpace(ctx, 13);
                text(ctx, ctx.font, 8, sanitize(line), MARGIN, ctx.y);
                ctx.y -= 12;
            }
            ctx.y -= 4;
        }

        drawFooter(ctx);
        ctx.cs.close();
    }

    // ── text helpers ──────────────────────────────────────────────────────────

    private void text(Ctx ctx, PDType1Font f, float size, String t, float x, float y) throws IOException {
        if (t == null || t.isBlank()) return;
        ctx.cs.beginText();
        ctx.cs.setFont(f, size);
        ctx.cs.newLineAtOffset(x, y);
        ctx.cs.showText(sanitize(t));
        ctx.cs.endText();
    }

    private void textRight(Ctx ctx, PDType1Font f, float size, String t, float rightX, float y) throws IOException {
        if (t == null || t.isBlank()) return;
        float w = f.getStringWidth(sanitize(t)) / 1000 * size;
        text(ctx, f, size, t, rightX - w, y);
    }

    // ── math helpers ──────────────────────────────────────────────────────────

    private BigDecimal multiply(BigDecimal a, BigDecimal b) {
        if (a == null || b == null) return null;
        return a.multiply(b);
    }

    private BigDecimal nvlB(BigDecimal v) { return v != null ? v : BigDecimal.ZERO; }

    private String fmt(BigDecimal val) {
        if (val == null) return "";
        return String.format("%,.2f", val).replace(",", "X").replace(".", ",").replace("X", ".");
    }

    private String nvl(String s) { return s != null ? s : ""; }

    private String sanitize(String s) {
        if (s == null) return "";
        return s
            .replace("é","e").replace("è","e").replace("ê","e").replace("ë","e")
            .replace("à","a").replace("â","a").replace("ä","a")
            .replace("ù","u").replace("û","u").replace("ü","u")
            .replace("î","i").replace("ï","i")
            .replace("ô","o").replace("ö","o")
            .replace("ç","c").replace("ñ","n")
            .replace("É","E").replace("È","E").replace("Ê","E")
            .replace("À","A").replace("Ç","C")
            .replace("’","'").replace("‘","'")
            .replace("“","\"").replace("”","\"")
            .replace("–","-").replace("—","-")
            .replaceAll("[^\\x20-\\x7E]","?");
    }
}