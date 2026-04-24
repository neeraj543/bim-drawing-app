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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class OffertePdfService {

    private static final float MARGIN = 50;
    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
    private static final float CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static final PDType1Font FONT_BOLD = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
    private static final PDType1Font FONT = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

    public byte[] generate(OfferteResponse o) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                float y = PAGE_HEIGHT - MARGIN;

                y = drawHeader(doc, cs, o, y);
                y -= 20;
                y = drawClientAndProjectInfo(cs, o, y);
                y -= 20;
                y = drawPriceTable(cs, o, y);
                if (o.getNotes() != null && !o.getNotes().isBlank()) {
                    y -= 15;
                    drawNotes(cs, o.getNotes(), y);
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    private float drawHeader(PDDocument doc, PDPageContentStream cs, OfferteResponse o, float y) throws IOException {
        // Logo top left
        try {
            ClassPathResource logoResource = new ClassPathResource("logo.png");
            PDImageXObject logo = PDImageXObject.createFromByteArray(doc, logoResource.getInputStream().readAllBytes(), "logo");
            float logoHeight = 50;
            float logoWidth = logo.getWidth() * (logoHeight / logo.getHeight());
            cs.drawImage(logo, MARGIN, y - logoHeight, logoWidth, logoHeight);
        } catch (Exception ignored) {
            // logo missing — skip silently
        }

        // Company info top right
        float rightCol = PAGE_WIDTH - MARGIN - 200;
        drawText(cs, FONT_BOLD, 9, "CLT XPRT", rightCol, y);
        drawText(cs, FONT, 8, "info@clt-xprt.be", rightCol, y - 12);
        drawText(cs, FONT, 8, "www.clt-xprt.be", rightCol, y - 24);

        y -= 60;

        // Divider line
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 15;

        // Offerte title + number
        drawText(cs, FONT_BOLD, 16, "OFFERTE", MARGIN, y);
        String offerteNum = o.getOfferteNumber() != null ? o.getOfferteNumber() : "";
        drawTextRight(cs, FONT_BOLD, 14, offerteNum, PAGE_WIDTH - MARGIN, y);

        y -= 18;

        // Date and prepared by
        String date = o.getDate() != null ? o.getDate().format(DATE_FMT) : "";
        drawText(cs, FONT, 9, "Datum: " + date, MARGIN, y);
        if (o.getPreparedBy() != null && !o.getPreparedBy().isBlank()) {
            drawText(cs, FONT, 9, "Opgesteld door: " + o.getPreparedBy(), MARGIN + 200, y);
        }
        if (o.getSubmissionDeadline() != null) {
            String dl = o.getSubmissionDeadline().format(DATE_FMT);
            drawTextRight(cs, FONT, 9, "Deadline: " + dl, PAGE_WIDTH - MARGIN, y);
        }

        y -= 5;
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);

        return y;
    }

    private float drawClientAndProjectInfo(PDPageContentStream cs, OfferteResponse o, float y) throws IOException {
        float col1 = MARGIN;
        float col2 = MARGIN + CONTENT_WIDTH / 2 + 10;

        // Left — Client info
        drawText(cs, FONT_BOLD, 10, "KLANT", col1, y);
        y -= 14;
        drawText(cs, FONT, 9, nvl(o.getClientName()), col1, y);
        y -= 11;
        String street = nvl(o.getClientStreet()) + (o.getClientStreetNumber() != null ? " " + o.getClientStreetNumber() : "");
        if (!street.isBlank()) { drawText(cs, FONT, 9, street, col1, y); y -= 11; }
        String city = nvl(o.getClientPostcode()) + " " + nvl(o.getClientCity());
        if (!city.isBlank()) { drawText(cs, FONT, 9, city.trim(), col1, y); y -= 11; }
        if (o.getClientVatNumber() != null) { drawText(cs, FONT, 9, "BTW: " + o.getClientVatNumber(), col1, y); y -= 11; }
        if (o.getSiteAddress() != null) { drawText(cs, FONT, 9, "Werf: " + o.getSiteAddress(), col1, y); y -= 11; }

        // Right — Project info
        float rightY = y + 14 + 14; // align to top of client block
        drawText(cs, FONT_BOLD, 10, "PROJECT", col2, rightY);
        rightY -= 14;
        drawText(cs, FONT, 9, nvl(o.getProjectDescription()), col2, rightY); rightY -= 11;
        if (o.getProjectType() != null) { drawText(cs, FONT, 9, "Type: " + o.getProjectType(), col2, rightY); rightY -= 11; }
        if (o.getFinishGrade() != null) { drawText(cs, FONT, 9, "Afwerking: " + o.getFinishGrade(), col2, rightY); rightY -= 11; }
        if (o.getNumberOfFloors() != null) { drawText(cs, FONT, 9, "Verdiepingen: " + o.getNumberOfFloors(), col2, rightY); rightY -= 11; }
        if (o.getBuildingDimensions() != null) { drawText(cs, FONT, 9, "Afmetingen: " + o.getBuildingDimensions(), col2, rightY); rightY -= 11; }
        if (o.getRoofType() != null) { drawText(cs, FONT, 9, "Daktype: " + o.getRoofType(), col2, rightY); rightY -= 11; }

        return Math.min(y, rightY) - 10;
    }

    private float drawPriceTable(PDPageContentStream cs, OfferteResponse o, float y) throws IOException {
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 14;

        // Table header
        float[] cols = { MARGIN, MARGIN + 30, MARGIN + 260, MARGIN + 340, MARGIN + 420 };
        drawText(cs, FONT_BOLD, 9, "#", cols[0], y);
        drawText(cs, FONT_BOLD, 9, "Omschrijving", cols[1], y);
        drawText(cs, FONT_BOLD, 9, "Hoeveelheid", cols[2], y);
        drawText(cs, FONT_BOLD, 9, "Eenheidsprijs", cols[3], y);
        drawText(cs, FONT_BOLD, 9, "Totaal", cols[4], y);
        y -= 4;
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 12;

        // 1. Engineering
        y = drawRow(cs, cols, y, "1", "Engineering (5% structuur)", null, null, fmt(o.getEngineeringCost()), false);

        // 2. Structuur
        y = drawRow(cs, cols, y, "2", "Structuur — CLT", fmt(o.getCltM2()) + " m²", fmt(o.getCltPricePerM2()) + " €/m²",
                fmt(o.getCltM2() != null && o.getCltPricePerM2() != null ? o.getCltM2().multiply(o.getCltPricePerM2()) : null), false);
        y = drawRow(cs, cols, y, "", "Structuur — GL Kolommen", fmt(o.getGlColumnsM3()) + " m³", fmt(o.getGlColumnsPricePerM3()) + " €/m³",
                fmt(o.getGlColumnsM3() != null && o.getGlColumnsPricePerM3() != null ? o.getGlColumnsM3().multiply(o.getGlColumnsPricePerM3()) : null), false);
        y = drawRow(cs, cols, y, "", "Structuur — GL Balken", fmt(o.getGlBeamsM3()) + " m³", fmt(o.getGlBeamsPricePerM3()) + " €/m³",
                fmt(o.getGlBeamsM3() != null && o.getGlBeamsPricePerM3() != null ? o.getGlBeamsM3().multiply(o.getGlBeamsPricePerM3()) : null), false);

        // 3. CNC
        y = drawRow(cs, cols, y, "3", "CNC — CLT (€11/m²)", fmt(o.getCltM2()) + " m²", "€11,00", fmt(o.getCncCltCost()), false);
        y = drawRow(cs, cols, y, "", "CNC — GL (€260/m³)", null, "€260,00", fmt(o.getCncGlCost()), false);

        // 4. Accessoires
        y = drawRow(cs, cols, y, "4", "Accessoires (12% structuur)", null, null, fmt(o.getAccessoiresCost()), false);

        // 5. Roostering (optional)
        if (Boolean.TRUE.equals(o.getIncludeRoostring())) {
            y = drawRow(cs, cols, y, "5", "Roostering met Beplating", fmt(o.getRoosteringM2()) + " m²",
                    fmt(o.getRoosteringPricePerM2()) + " €/m²", fmt(o.getRoosteringTotal()), false);
        }

        // 6. Transport
        String trucks = o.getNumberOfTrucks() != null ? o.getNumberOfTrucks() + " vrachtwagen(s)" : null;
        y = drawRow(cs, cols, y, "6", "Transport (€2250/vrachtwagen)", trucks, null, fmt(o.getTransportCost()), false);

        // 7. Montage
        y = drawRow(cs, cols, y, "7", "Montage (22% structuur)", null, null, fmt(o.getMontageCost()), false);

        // Totals
        y -= 5;
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 14;
        y = drawTotalRow(cs, cols, y, "Subtotaal excl. BTW", fmt(o.getSubtotalExclVat()));
        y = drawTotalRow(cs, cols, y, "BTW 21%", fmt(o.getVat()));
        y -= 3;
        drawLine(cs, cols[3], y, PAGE_WIDTH - MARGIN, y);
        y -= 14;
        y = drawTotalRow(cs, cols, y, "TOTAAL incl. BTW", fmt(o.getTotalInclVat()), true);

        return y;
    }

    private float drawRow(PDPageContentStream cs, float[] cols, float y,
                          String num, String desc, String qty, String unit, String total, boolean bold) throws IOException {
        PDType1Font f = bold ? FONT_BOLD : FONT;
        drawText(cs, f, 9, nvl(num), cols[0], y);
        drawText(cs, f, 9, nvl(desc), cols[1], y);
        if (qty != null) drawText(cs, f, 9, qty, cols[2], y);
        if (unit != null) drawText(cs, f, 9, unit, cols[3], y);
        if (total != null) drawText(cs, f, 9, "€ " + total, cols[4], y);
        return y - 13;
    }

    private float drawTotalRow(PDPageContentStream cs, float[] cols, float y, String label, String amount) throws IOException {
        return drawTotalRow(cs, cols, y, label, amount, false);
    }

    private float drawTotalRow(PDPageContentStream cs, float[] cols, float y, String label, String amount, boolean bold) throws IOException {
        PDType1Font f = bold ? FONT_BOLD : FONT;
        drawText(cs, f, 9, label, cols[3], y);
        drawText(cs, f, 9, "€ " + nvl(amount), cols[4], y);
        return y - 14;
    }

    private void drawNotes(PDPageContentStream cs, String notes, float y) throws IOException {
        drawText(cs, FONT_BOLD, 9, "Opmerkingen:", MARGIN, y);
        y -= 12;
        drawText(cs, FONT, 8, notes, MARGIN, y);
    }

    private void drawText(PDPageContentStream cs, PDType1Font font, float size, String text, float x, float y) throws IOException {
        if (text == null || text.isBlank()) return;
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(x, y);
        cs.showText(text);
        cs.endText();
    }

    private void drawTextRight(PDPageContentStream cs, PDType1Font font, float size, String text, float rightX, float y) throws IOException {
        if (text == null || text.isBlank()) return;
        float textWidth = font.getStringWidth(text) / 1000 * size;
        drawText(cs, font, size, text, rightX - textWidth, y);
    }

    private void drawLine(PDPageContentStream cs, float x1, float y, float x2, float y2) throws IOException {
        cs.moveTo(x1, y);
        cs.lineTo(x2, y2);
        cs.stroke();
    }

    private String fmt(BigDecimal val) {
        if (val == null) return null;
        return String.format("%,.2f", val).replace(",", "X").replace(".", ",").replace("X", ".");
    }

    private String nvl(String s) {
        return s != null ? s : "";
    }
}