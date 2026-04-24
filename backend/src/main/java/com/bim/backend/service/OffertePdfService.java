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

    public byte[] generate(OfferteResponse o) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                float y = PAGE_HEIGHT - MARGIN;

                y = drawHeader(doc, cs, o, y, font, fontBold);
                y -= 20;
                y = drawClientAndProjectInfo(cs, o, y, font, fontBold);
                y -= 20;
                y = drawPriceTable(cs, o, y, font, fontBold);
                if (o.getNotes() != null && !o.getNotes().isBlank()) {
                    y -= 15;
                    drawNotes(cs, o.getNotes(), y, font, fontBold);
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    private float drawHeader(PDDocument doc, PDPageContentStream cs, OfferteResponse o, float y,
                             PDType1Font font, PDType1Font fontBold) throws IOException {
        try {
            ClassPathResource logoResource = new ClassPathResource("logo.png");
            PDImageXObject logo = PDImageXObject.createFromByteArray(doc, logoResource.getInputStream().readAllBytes(), "logo");
            float logoHeight = 50;
            float logoWidth = logo.getWidth() * (logoHeight / logo.getHeight());
            cs.drawImage(logo, MARGIN, y - logoHeight, logoWidth, logoHeight);
        } catch (Exception ignored) {
            // logo missing — skip silently
        }

        float rightCol = PAGE_WIDTH - MARGIN - 200;
        drawText(cs, fontBold, 9, "CLT XPRT", rightCol, y, font, fontBold);
        drawText(cs, font, 8, "info@clt-xprt.be", rightCol, y - 12, font, fontBold);
        drawText(cs, font, 8, "www.clt-xprt.be", rightCol, y - 24, font, fontBold);

        y -= 60;

        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 15;

        drawText(cs, fontBold, 16, "OFFERTE", MARGIN, y, font, fontBold);
        String offerteNum = o.getOfferteNumber() != null ? o.getOfferteNumber() : "";
        drawTextRight(cs, fontBold, 14, offerteNum, PAGE_WIDTH - MARGIN, y);

        y -= 18;

        String date = o.getDate() != null ? o.getDate().format(DATE_FMT) : "";
        drawText(cs, font, 9, "Datum: " + date, MARGIN, y, font, fontBold);
        if (o.getPreparedBy() != null && !o.getPreparedBy().isBlank()) {
            drawText(cs, font, 9, "Opgesteld door: " + o.getPreparedBy(), MARGIN + 200, y, font, fontBold);
        }
        if (o.getSubmissionDeadline() != null) {
            drawTextRight(cs, font, 9, "Deadline: " + o.getSubmissionDeadline().format(DATE_FMT), PAGE_WIDTH - MARGIN, y);
        }

        y -= 5;
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);

        return y;
    }

    private float drawClientAndProjectInfo(PDPageContentStream cs, OfferteResponse o, float y,
                                           PDType1Font font, PDType1Font fontBold) throws IOException {
        float col1 = MARGIN;
        float col2 = MARGIN + CONTENT_WIDTH / 2 + 10;
        float startY = y;

        drawText(cs, fontBold, 10, "KLANT", col1, y, font, fontBold);
        y -= 14;
        drawText(cs, font, 9, nvl(o.getClientName()), col1, y, font, fontBold);
        y -= 11;
        String street = nvl(o.getClientStreet()) + (o.getClientStreetNumber() != null ? " " + o.getClientStreetNumber() : "");
        if (!street.isBlank()) { drawText(cs, font, 9, street, col1, y, font, fontBold); y -= 11; }
        String city = (nvl(o.getClientPostcode()) + " " + nvl(o.getClientCity())).trim();
        if (!city.isBlank()) { drawText(cs, font, 9, city, col1, y, font, fontBold); y -= 11; }
        if (o.getClientVatNumber() != null) { drawText(cs, font, 9, "BTW: " + o.getClientVatNumber(), col1, y, font, fontBold); y -= 11; }
        if (o.getSiteAddress() != null) { drawText(cs, font, 9, "Werf: " + o.getSiteAddress(), col1, y, font, fontBold); y -= 11; }

        float rightY = startY;
        drawText(cs, fontBold, 10, "PROJECT", col2, rightY, font, fontBold);
        rightY -= 14;
        drawText(cs, font, 9, nvl(o.getProjectDescription()), col2, rightY, font, fontBold); rightY -= 11;
        if (o.getProjectType() != null) { drawText(cs, font, 9, "Type: " + o.getProjectType(), col2, rightY, font, fontBold); rightY -= 11; }
        if (o.getFinishGrade() != null) { drawText(cs, font, 9, "Afwerking: " + o.getFinishGrade(), col2, rightY, font, fontBold); rightY -= 11; }
        if (o.getNumberOfFloors() != null) { drawText(cs, font, 9, "Verdiepingen: " + o.getNumberOfFloors(), col2, rightY, font, fontBold); rightY -= 11; }
        if (o.getBuildingDimensions() != null) { drawText(cs, font, 9, "Afmetingen: " + o.getBuildingDimensions(), col2, rightY, font, fontBold); rightY -= 11; }
        if (o.getRoofType() != null) { drawText(cs, font, 9, "Daktype: " + o.getRoofType(), col2, rightY, font, fontBold); rightY -= 11; }

        return Math.min(y, rightY) - 10;
    }

    private float drawPriceTable(PDPageContentStream cs, OfferteResponse o, float y,
                                 PDType1Font font, PDType1Font fontBold) throws IOException {
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 14;

        float[] cols = { MARGIN, MARGIN + 30, MARGIN + 260, MARGIN + 340, MARGIN + 420 };
        drawText(cs, fontBold, 9, "#", cols[0], y, font, fontBold);
        drawText(cs, fontBold, 9, "Omschrijving", cols[1], y, font, fontBold);
        drawText(cs, fontBold, 9, "Hoeveelheid", cols[2], y, font, fontBold);
        drawText(cs, fontBold, 9, "Eenheidsprijs", cols[3], y, font, fontBold);
        drawText(cs, fontBold, 9, "Totaal", cols[4], y, font, fontBold);
        y -= 4;
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 12;

        y = drawRow(cs, cols, y, "1", "Engineering (5% structuur)", null, null, fmt(o.getEngineeringCost()), false, font, fontBold);
        y = drawRow(cs, cols, y, "2", "Structuur — CLT", fmt(o.getCltM2()) + " m²", fmt(o.getCltPricePerM2()) + " €/m²",
                fmt(multiply(o.getCltM2(), o.getCltPricePerM2())), false, font, fontBold);
        y = drawRow(cs, cols, y, "", "Structuur — GL Kolommen", fmt(o.getGlColumnsM3()) + " m³", fmt(o.getGlColumnsPricePerM3()) + " €/m³",
                fmt(multiply(o.getGlColumnsM3(), o.getGlColumnsPricePerM3())), false, font, fontBold);
        y = drawRow(cs, cols, y, "", "Structuur — GL Balken", fmt(o.getGlBeamsM3()) + " m³", fmt(o.getGlBeamsPricePerM3()) + " €/m³",
                fmt(multiply(o.getGlBeamsM3(), o.getGlBeamsPricePerM3())), false, font, fontBold);
        y = drawRow(cs, cols, y, "3", "CNC — CLT (€11/m²)", fmt(o.getCltM2()) + " m²", "€11,00", fmt(o.getCncCltCost()), false, font, fontBold);
        y = drawRow(cs, cols, y, "", "CNC — GL (€260/m³)", null, "€260,00", fmt(o.getCncGlCost()), false, font, fontBold);
        y = drawRow(cs, cols, y, "4", "Accessoires (12% structuur)", null, null, fmt(o.getAccessoiresCost()), false, font, fontBold);

        if (Boolean.TRUE.equals(o.getIncludeRoostring())) {
            y = drawRow(cs, cols, y, "5", "Roostering met Beplating", fmt(o.getRoosteringM2()) + " m²",
                    fmt(o.getRoosteringPricePerM2()) + " €/m²", fmt(o.getRoosteringTotal()), false, font, fontBold);
        }

        String trucks = o.getNumberOfTrucks() != null ? o.getNumberOfTrucks() + " vrachtwagen(s)" : null;
        y = drawRow(cs, cols, y, "6", "Transport (€2250/vrachtwagen)", trucks, null, fmt(o.getTransportCost()), false, font, fontBold);
        y = drawRow(cs, cols, y, "7", "Montage (22% structuur)", null, null, fmt(o.getMontageCost()), false, font, fontBold);

        y -= 5;
        drawLine(cs, MARGIN, y, PAGE_WIDTH - MARGIN, y);
        y -= 14;
        y = drawTotalRow(cs, cols, y, "Subtotaal excl. BTW", fmt(o.getSubtotalExclVat()), false, font, fontBold);
        y = drawTotalRow(cs, cols, y, "BTW 21%", fmt(o.getVat()), false, font, fontBold);
        y -= 3;
        drawLine(cs, cols[3], y, PAGE_WIDTH - MARGIN, y);
        y -= 14;
        y = drawTotalRow(cs, cols, y, "TOTAAL incl. BTW", fmt(o.getTotalInclVat()), true, font, fontBold);

        return y;
    }

    private float drawRow(PDPageContentStream cs, float[] cols, float y, String num, String desc,
                          String qty, String unit, String total, boolean bold,
                          PDType1Font font, PDType1Font fontBold) throws IOException {
        PDType1Font f = bold ? fontBold : font;
        drawText(cs, f, 9, nvl(num), cols[0], y, font, fontBold);
        drawText(cs, f, 9, nvl(desc), cols[1], y, font, fontBold);
        if (qty != null) drawText(cs, f, 9, qty, cols[2], y, font, fontBold);
        if (unit != null) drawText(cs, f, 9, unit, cols[3], y, font, fontBold);
        if (total != null) drawText(cs, f, 9, "€ " + total, cols[4], y, font, fontBold);
        return y - 13;
    }

    private float drawTotalRow(PDPageContentStream cs, float[] cols, float y, String label, String amount,
                               boolean bold, PDType1Font font, PDType1Font fontBold) throws IOException {
        PDType1Font f = bold ? fontBold : font;
        drawText(cs, f, 9, label, cols[3], y, font, fontBold);
        drawText(cs, f, 9, "€ " + nvl(amount), cols[4], y, font, fontBold);
        return y - 14;
    }

    private void drawNotes(PDPageContentStream cs, String notes, float y,
                           PDType1Font font, PDType1Font fontBold) throws IOException {
        drawText(cs, fontBold, 9, "Opmerkingen:", MARGIN, y, font, fontBold);
        y -= 12;
        drawText(cs, font, 8, notes, MARGIN, y, font, fontBold);
    }

    private void drawText(PDPageContentStream cs, PDType1Font font, float size, String text,
                          float x, float y, PDType1Font f, PDType1Font fb) throws IOException {
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
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(rightX - textWidth, y);
        cs.showText(text);
        cs.endText();
    }

    private void drawLine(PDPageContentStream cs, float x1, float y1, float x2, float y2) throws IOException {
        cs.moveTo(x1, y1);
        cs.lineTo(x2, y2);
        cs.stroke();
    }

    private BigDecimal multiply(BigDecimal a, BigDecimal b) {
        if (a == null || b == null) return null;
        return a.multiply(b);
    }

    private String fmt(BigDecimal val) {
        if (val == null) return null;
        return String.format("%,.2f", val).replace(",", "X").replace(".", ",").replace("X", ".");
    }

    private String nvl(String s) {
        return s != null ? s : "";
    }
}