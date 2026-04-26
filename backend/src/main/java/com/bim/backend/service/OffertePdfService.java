package com.bim.backend.service;

import com.bim.backend.dto.OfferteResponse;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class OffertePdfService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generate(OfferteResponse o) throws Exception {
        String html = buildHtml(o);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(html, null);
        builder.toStream(out);
        builder.run();
        return out.toByteArray();
    }

    private String buildHtml(OfferteResponse o) throws Exception {
        ClassPathResource tpl = new ClassPathResource("templates/offerte.html");
        String html = new String(tpl.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        // Logo as base64 data URI so it works without a file URL
        String logoSrc = "";
        try {
            ClassPathResource logo = new ClassPathResource("images/logo.png");
            byte[] logoBytes = logo.getInputStream().readAllBytes();
            logoSrc = "data:image/png;base64," + Base64.getEncoder().encodeToString(logoBytes);
        } catch (Exception ignored) {}

        BigDecimal cltLineTotal = mul(o.getCltM2(), o.getCltPricePerM2());
        BigDecimal glColumnsTotal = mul(o.getGlColumnsM3(), o.getGlColumnsPricePerM3());
        BigDecimal glBeamsTotal   = mul(o.getGlBeamsM3(), o.getGlBeamsPricePerM3());
        BigDecimal glTotal = add(glColumnsTotal, glBeamsTotal);
        BigDecimal glTotalM3 = add(o.getGlColumnsM3(), o.getGlBeamsM3());
        BigDecimal cncTotal  = add(o.getCncCltCost(), o.getCncGlCost());

        boolean hasClt       = gt(o.getCltM2());
        boolean hasGlColumns = gt(o.getGlColumnsM3());
        boolean hasGlBeams   = gt(o.getGlBeamsM3());
        boolean hasGl        = hasGlColumns || hasGlBeams;
        boolean hasGlCnc     = gt(glTotalM3);
        boolean hasTransport = o.getNumberOfTrucks() != null && o.getNumberOfTrucks() > 0;

        html = html.replace("{{logoBase64}}", logoSrc);
        html = html.replace("{{offerteNumber}}", s(o.getOfferteNumber()));
        html = html.replace("{{date}}", o.getDate() != null ? o.getDate().format(FMT) : "");
        html = html.replace("{{preparedBy}}", s(o.getPreparedBy()));
        html = html.replace("{{projectDescription}}", s(o.getProjectDescription()));
        html = html.replace("{{clientName}}", s(o.getClientName()));
        html = html.replace("{{clientStreet}}", s(o.getClientStreet()));
        html = html.replace("{{clientStreetNumber}}", s(o.getClientStreetNumber()));
        html = html.replace("{{clientPostcode}}", s(o.getClientPostcode()));
        html = html.replace("{{clientCity}}", s(o.getClientCity()));
        html = html.replace("{{siteAddress}}", s(o.getSiteAddress()));
        html = html.replace("{{validUntil}}", o.getValidUntil() != null ? o.getValidUntil().format(FMT) : "");
        html = html.replace("{{deliveryQuarter}}", s(o.getDeliveryQuarter()));

        html = html.replace("{{engineeringCost}}", fmt(o.getEngineeringCost()));
        html = html.replace("{{structuurTotal}}", fmt(o.getStructuurTotal()));
        html = html.replace("{{cltM2}}", fmt(o.getCltM2()));
        html = html.replace("{{cltPricePerM2}}", fmt(o.getCltPricePerM2()));
        html = html.replace("{{cltLineTotal}}", fmt(cltLineTotal));
        html = html.replace("{{glColumnsM3}}", fmt(o.getGlColumnsM3()));
        html = html.replace("{{glColumnsPricePerM3}}", fmt(o.getGlColumnsPricePerM3()));
        html = html.replace("{{glColumnsTotal}}", fmt(glColumnsTotal));
        html = html.replace("{{glBeamsM3}}", fmt(o.getGlBeamsM3()));
        html = html.replace("{{glBeamsPricePerM3}}", fmt(o.getGlBeamsPricePerM3()));
        html = html.replace("{{glBeamsTotal}}", fmt(glBeamsTotal));
        html = html.replace("{{glTotal}}", fmt(glTotal));
        html = html.replace("{{glTotalM3}}", fmt(glTotalM3));
        html = html.replace("{{cncTotal}}", fmt(cncTotal));
        html = html.replace("{{cncCltCost}}", fmt(o.getCncCltCost()));
        html = html.replace("{{cncGlCost}}", fmt(o.getCncGlCost()));
        html = html.replace("{{accessoiresCost}}", fmt(o.getAccessoiresCost()));
        html = html.replace("{{roosteringM2}}", fmt(o.getRoosteringM2()));
        html = html.replace("{{roosteringPricePerM2}}", fmt(o.getRoosteringPricePerM2()));
        html = html.replace("{{roosteringTotal}}", fmt(o.getRoosteringTotal()));
        html = html.replace("{{numberOfTrucks}}", o.getNumberOfTrucks() != null ? String.valueOf(o.getNumberOfTrucks()) : "0");
        html = html.replace("{{transportCost}}", fmt(o.getTransportCost()));
        html = html.replace("{{montageCost}}", fmt(o.getMontageCost()));
        html = html.replace("{{subtotalExclVat}}", fmt(o.getSubtotalExclVat()));
        html = html.replace("{{vat}}", fmt(o.getVat()));
        html = html.replace("{{totalInclVat}}", fmt(o.getTotalInclVat()));
        html = html.replace("{{notes}}", s(o.getNotes()));
        html = html.replace("{{clientVatNumber}}", s(o.getClientVatNumber()));

        // Conditional blocks: {{#flag}}...{{/flag}} and {{#field}}...{{/field}}
        html = conditional(html, "hasClt",       hasClt);
        html = conditional(html, "hasGl",        hasGl);
        html = conditional(html, "hasGlColumns", hasGlColumns);
        html = conditional(html, "hasGlBeams",   hasGlBeams);
        html = conditional(html, "hasGlCnc",     hasGlCnc);
        html = conditional(html, "hasTransport", hasTransport);
        html = conditional(html, "includeRoostring", Boolean.TRUE.equals(o.getIncludeRoostring()) && gt(o.getRoosteringM2()));
        html = conditional(html, "clientVatNumber", o.getClientVatNumber() != null && !o.getClientVatNumber().isBlank());
        html = conditional(html, "siteAddress",    o.getSiteAddress() != null && !o.getSiteAddress().isBlank());
        html = conditional(html, "validUntil",     o.getValidUntil() != null);
        html = conditional(html, "deliveryQuarter", o.getDeliveryQuarter() != null && !o.getDeliveryQuarter().isBlank());
        html = conditional(html, "preparedBy",     o.getPreparedBy() != null && !o.getPreparedBy().isBlank());
        html = conditional(html, "notes",          o.getNotes() != null && !o.getNotes().isBlank());

        return html;
    }

    /** Remove {{#tag}}...{{/tag}} blocks when condition is false, strip the tags when true. */
    private String conditional(String html, String tag, boolean show) {
        String open  = "{{#" + tag + "}}";
        String close = "{{/" + tag + "}}";
        if (show) {
            return html.replace(open, "").replace(close, "");
        } else {
            while (html.contains(open)) {
                int start = html.indexOf(open);
                int end   = html.indexOf(close, start);
                if (end < 0) break;
                html = html.substring(0, start) + html.substring(end + close.length());
            }
            return html;
        }
    }

    private String fmt(BigDecimal v) {
        if (v == null) return "0,00";
        return String.format("%,.2f", v).replace(",", "X").replace(".", ",").replace("X", ".");
    }

    private String s(String v)          { return v != null ? v : ""; }
    private boolean gt(BigDecimal v)    { return v != null && v.compareTo(BigDecimal.ZERO) > 0; }
    private BigDecimal mul(BigDecimal a, BigDecimal b) { return (a == null || b == null) ? null : a.multiply(b); }
    private BigDecimal add(BigDecimal a, BigDecimal b) {
        if (a == null && b == null) return BigDecimal.ZERO;
        if (a == null) return b;
        if (b == null) return a;
        return a.add(b);
    }
}