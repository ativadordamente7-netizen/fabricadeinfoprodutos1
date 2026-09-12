import { jsPDF } from "jspdf";
import { EbookData } from "../types";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}

function hexToRgb(hex: string): [number, number, number] {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [255, 255, 255];
}

function mapFont(typography?: string): string {
  if (!typography) return "helvetica";
  const t = typography.toLowerCase();
  if (t.includes("playfair")) return "times";
  if (t.includes("mono") || t.includes("jetbrains")) return "courier";
  return "helvetica";
}

function drawDefaultMinimalist(
  doc: jsPDF,
  ebook: EbookData,
  selectedColor: any,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  contentWidth: number
) {
  // Elegant warm light-stone background for minimalist look
  doc.setFillColor(250, 250, 249);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Double elegant fine borders
  doc.setDrawColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
  doc.setLineWidth(0.4);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2, "D");
  doc.rect(margin + 2, margin + 2, contentWidth - 4, pageHeight - margin * 2 - 4, "D");

  // Small decorative accent diamond or line at top
  doc.setDrawColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 15, margin + 15, pageWidth / 2 + 15, margin + 15);

  // Ebook Tag
  doc.setTextColor(115, 115, 115);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("CONTEÚDO PREMIUM EXCLUSIVO", pageWidth / 2, margin + 25, { align: "center" });

  // Title (Elegantly spaced, colored in the main theme color)
  doc.setTextColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  const titleLines = doc.splitTextToSize(ebook.title.toUpperCase(), contentWidth - 24);
  doc.text(titleLines, pageWidth / 2, margin + 45, { align: "center" });

  const titleHeight = titleLines.length * 8.5;

  // Subtitle
  doc.setTextColor(64, 64, 64);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const subtitleLines = doc.splitTextToSize(ebook.subtitle, contentWidth - 30);
  doc.text(subtitleLines, pageWidth / 2, margin + 60 + titleHeight, { align: "center" });

  // Center divider dot
  doc.setFillColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
  doc.circle(pageWidth / 2, pageHeight - margin - 40, 2, "F");

  // Author
  doc.setTextColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Autor: ${ebook.author || "Especialista"}`, pageWidth / 2, pageHeight - margin - 25, { align: "center" });

  doc.setTextColor(163, 163, 163);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Todos os direitos reservados.`, pageWidth / 2, pageHeight - margin - 15, { align: "center" });
}

export async function generateEbookPDF(ebook: EbookData) {
  // Create jsPDF document (Standard A4: 210mm x 297mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Cover Color Mapper
  const coverColors: { [key: string]: { bg: [number, number, number]; text: [number, number, number]; accent: [number, number, number] } } = {
    emerald: { bg: [6, 78, 59], text: [255, 255, 255], accent: [52, 211, 153] },
    indigo: { bg: [49, 46, 129], text: [255, 255, 255], accent: [129, 140, 248] },
    rose: { bg: [136, 19, 55], text: [255, 255, 255], accent: [251, 113, 133] },
    slate: { bg: [15, 23, 42], text: [255, 255, 255], accent: [148, 163, 184] },
    amber: { bg: [120, 53, 4], text: [255, 255, 255], accent: [251, 191, 36] },
  };

  const selectedColor = coverColors[ebook.coverColor] || coverColors["slate"];
  const style = ebook.coverStyle || "minimalist";

  // --- PAGE 1: COVER ---
  const defaultCoverImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80";
  const coverImgUrl = ebook.cover?.imageUrl || defaultCoverImage;
  const useAiArt = true; // Always draw AI-styled cover page

  if (useAiArt) {
    try {
      const img = await loadImage(coverImgUrl);
      // Draw background cover image
      doc.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);

      // Draw dark/gradient overlay card is disabled to keep the cover 100% clean and pure as requested
      if (false) {
        let hasSavedState = false;
        try {
          // Check if GState exists in jsPDF to apply semi-transparent overlay
          // @ts-ignore
          if (typeof doc.GState === "function") {
            // @ts-ignore
            const gState = new doc.GState({ opacity: overlayOpacity });
            doc.saveGraphicsState();
            hasSavedState = true;
            // @ts-ignore
            doc.setGState(gState);
          }
        } catch (err) {
          console.warn("jsPDF GState is not available, falling back to solid overlay", err);
        }

        doc.setFillColor(15, 23, 42); // slate dark elegant container
        // Drawing semi-transparent rect for a clean container
        doc.roundedRect(margin - 4, margin - 4, contentWidth + 8, pageHeight - margin * 2 + 8, 4, 4, "F");

        if (hasSavedState) {
          try {
            doc.restoreGraphicsState();
          } catch (err) {
            console.error("Failed to restore graphics state", err);
          }
        }
      }

      // Draw border if requested
      if (ebook.cover?.showDecorativeBorder) {
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.4);
        doc.rect(margin, margin, contentWidth, pageHeight - margin * 2, "D");
      }

      // Configure Typography
      const fontName = mapFont(ebook.cover?.typography);
      const titleColor = hexToRgb(ebook.cover?.titleColor || "#FFFFFF");
      const subtitleColor = hexToRgb(ebook.cover?.subtitleColor || "#E5E7EB");
      const authorColor = hexToRgb(ebook.cover?.authorColor || "#10B981");

      const alignment = ebook.cover?.alignment || "top";
      const fontSizeTitle = ebook.cover?.fontSizeTitle || 28;

      // Calculate vertical Y based on alignment
      let titleY = margin + 35;
      if (alignment === "center") {
        titleY = pageHeight / 2 - 25;
      } else if (alignment === "bottom") {
        titleY = pageHeight - margin - 100;
      }

      // 1. Ebook tag / badge
      doc.setTextColor(authorColor[0], authorColor[1], authorColor[2]);
      doc.setFont(fontName, "bold");
      doc.setFontSize(8.5);
      doc.text("CONTEÚDO PREMIUM EXCLUSIVO", pageWidth / 2, titleY - 12, { align: "center" });

      // 2. Title
      doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
      doc.setFont(fontName, "bold");
      doc.setFontSize(fontSizeTitle);
      const titleLines = doc.splitTextToSize(ebook.title.toUpperCase(), contentWidth - 12);
      doc.text(titleLines, pageWidth / 2, titleY, { align: "center" });
      const titleHeight = titleLines.length * (fontSizeTitle * 0.35);

      // 3. Subtitle
      doc.setTextColor(subtitleColor[0], subtitleColor[1], subtitleColor[2]);
      doc.setFont(fontName, "normal");
      doc.setFontSize(11);
      const subtitleLines = doc.splitTextToSize(ebook.subtitle, contentWidth - 20);
      doc.text(subtitleLines, pageWidth / 2, titleY + titleHeight + 6, { align: "center" });

      // 4. Author in Footer
      const authorY = pageHeight - margin - 22;
      doc.setTextColor(authorColor[0], authorColor[1], authorColor[2]);
      doc.setFont(fontName, "bold");
      doc.setFontSize(11);
      doc.text(`Autor: ${ebook.author || "Especialista"}`, pageWidth / 2, authorY, { align: "center" });

      doc.setTextColor(156, 163, 175);
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.text(`Criado com Inteligência Artificial. Todos os direitos reservados.`, pageWidth / 2, authorY + 8, { align: "center" });

    } catch (e) {
      console.error("AI Cover preloading failed, drawing standard minimalist template", e);
      drawDefaultMinimalist(doc, ebook, selectedColor, pageWidth, pageHeight, margin, contentWidth);
    }
  } else {
    if (style === "minimalist") {
      drawDefaultMinimalist(doc, ebook, selectedColor, pageWidth, pageHeight, margin, contentWidth);
    } else if (style === "emotional") {
      // Emotional: Mood-rich solid dark colors with glowing concentric lines
      doc.setFillColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Concentric glowing mood rectangles
      for (let i = 1; i <= 3; i++) {
        doc.setDrawColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
        // Lower opacity simulated by drawing very thin lines with different offsets
        doc.setLineWidth(0.15 * i);
        doc.rect(margin - i * 2, margin - i * 2, contentWidth + i * 4, pageHeight - (margin - i * 2) * 2, "D");
      }

      // Ebook Tag
      doc.setTextColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("● O GUIA DA SUA TRANSFORMAÇÃO", margin + 12, margin + 25);

    // Title (Dynamic wrap, centered)
    doc.setTextColor(selectedColor.text[0], selectedColor.text[1], selectedColor.text[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    const titleLines = doc.splitTextToSize(ebook.title, contentWidth - 24);
    doc.text(titleLines, margin + 12, margin + 45);

    const titleHeight = titleLines.length * 9;

    // Beautiful quote box / hook
    const boxY = margin + 55 + titleHeight;
    const boxH = 32;
    doc.setFillColor(0, 0, 0, 0.2); // semi-transparent black
    doc.roundedRect(margin + 10, boxY, contentWidth - 20, boxH, 3, 3, "F");
    doc.setDrawColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin + 10, boxY, contentWidth - 20, boxH, 3, 3, "D");

    doc.setTextColor(244, 244, 245);
    doc.setFont("helvetica", "oblique");
    doc.setFontSize(10);
    const quoteText = ebook.synopsis ? ebook.synopsis.substring(0, 140) + "..." : "Uma jornada de superação e resultados extraordinários aguarda por você nas próximas páginas.";
    const quoteLines = doc.splitTextToSize(`"${quoteText}"`, contentWidth - 36);
    doc.text(quoteLines, margin + 18, boxY + 8);

    // Subtitle below the quote box
    doc.setTextColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const subtitleLines = doc.splitTextToSize(ebook.subtitle, contentWidth - 24);
    doc.text(subtitleLines, margin + 12, boxY + boxH + 12);

    // Author & Niche in Footer
    doc.setTextColor(selectedColor.text[0], selectedColor.text[1], selectedColor.text[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Criado por: ${ebook.author || "Especialista"}`, margin + 12, pageHeight - margin - 25);

    doc.setTextColor(212, 212, 216);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Método exclusivo. Proibida reprodução não autorizada.`, margin + 12, pageHeight - margin - 15);

  } else {
    // --- MODERN STYLE (Solid Background + Bold geometric structures) ---
    doc.setFillColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Geometric Modern accents (Two bold diagonal or horizontal stripes)
    doc.setFillColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.rect(0, pageHeight - margin - 60, pageWidth, 4, "F");
    
    // Draw an elegant geometric angle banner at the top corner
    doc.setFillColor(255, 255, 255, 0.04);
    doc.triangle(0, 0, pageWidth * 0.7, 0, 0, pageHeight * 0.4, "F");

    // Subtle modern border lines
    doc.setDrawColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.setLineWidth(0.8);
    doc.line(margin, margin, pageWidth - margin, margin);
    doc.line(margin, margin, margin, pageHeight - margin);
    doc.line(pageWidth - margin, margin, pageWidth - margin, pageHeight - margin);
    doc.line(margin, pageHeight - margin, pageWidth - margin, pageHeight - margin);

    // Ebook Tag
    doc.setTextColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("E-BOOK OFICIAL", margin + 10, margin + 25);

    // Title (Dynamic wrap)
    doc.setTextColor(selectedColor.text[0], selectedColor.text[1], selectedColor.text[2]);
    doc.setFontSize(28);
    const titleLines = doc.splitTextToSize(ebook.title.toUpperCase(), contentWidth - 20);
    doc.text(titleLines, margin + 10, margin + 45);

    // Divider
    const titleHeight = titleLines.length * 10;
    doc.setFillColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.rect(margin + 10, margin + 48 + titleHeight, 40, 2, "F");

    // Subtitle
    doc.setTextColor(226, 232, 240);
    doc.setFont("helvetica", "oblique");
    doc.setFontSize(14);
    const subtitleLines = doc.splitTextToSize(ebook.subtitle, contentWidth - 20);
    doc.text(subtitleLines, margin + 10, margin + 60 + titleHeight);

    // Author & Niche in Footer
    doc.setTextColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Autor: ${ebook.author || "Especialista"}`, margin + 10, pageHeight - margin - 25);

    doc.setTextColor(203, 213, 225);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Todos os direitos reservados.`, margin + 10, pageHeight - margin - 15);
    }
  }


  // --- PAGE 2: TABLE OF CONTENTS (SUMÁRIO) & SYNOPSIS ---
  doc.addPage();
  doc.setTextColor(15, 23, 42); // Deep slate for body
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Sumário & Introdução", margin, margin + 15);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 20, pageWidth - margin, margin + 20);

  // Synopsis
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105);
  const synopsisLines = doc.splitTextToSize(ebook.synopsis, contentWidth);
  doc.text(synopsisLines, margin, margin + 30);

  // Synopsis height
  const synopsisHeight = synopsisLines.length * 5 + 10;

  // Chapter List Summary
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Índice de Capítulos", margin, margin + 35 + synopsisHeight);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let summaryY = margin + 45 + synopsisHeight;
  ebook.chapters.forEach((ch, idx) => {
    const chTitle = `Capítulo ${ch.number}: ${ch.title}`;
    doc.text(chTitle, margin, summaryY);
    doc.text(`Pág. ${3 + idx}`, pageWidth - margin - 15, summaryY);
    
    // Beautiful dotted leader line connecting chapter title and page number
    doc.setLineDashPattern([1, 1], 0);
    doc.setDrawColor(203, 213, 225);
    doc.line(margin + doc.getTextWidth(chTitle) + 4, summaryY - 1, pageWidth - margin - 22, summaryY - 1);
    doc.setLineDashPattern([], 0);
    
    summaryY += 8;
  });


  // --- PAGES 3+: CHAPTERS ---
  ebook.chapters.forEach((ch, idx) => {
    doc.addPage();
    
    // Header
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(ebook.title.substring(0, 40) + "...", margin, margin);
    doc.text(`Capítulo ${ch.number}`, pageWidth - margin - 20, margin);
    doc.line(margin, margin + 3, pageWidth - margin, margin + 3);

    // Chapter Title
    doc.setTextColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    const chTitleLines = doc.splitTextToSize(`Capítulo ${ch.number}: ${ch.title}`, contentWidth);
    doc.text(chTitleLines, margin, margin + 15);

    const titleOffset = chTitleLines.length * 8 + 5;

    // Body text
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Split paragraphs
    const rawParagraphs = ch.content.split("\n\n");
    let currentY = margin + 15 + titleOffset;

    rawParagraphs.forEach((p) => {
      const pText = p.trim();
      if (!pText) return;

      // Check if this paragraph contains a structured header like [🧠 Dimensão Mental...]
      const headerMatch = pText.match(/^\[([^\]]+)\](?:\s*([\s\S]*))?$/);

      if (headerMatch) {
        const headerTitle = headerMatch[1].trim();
        const bodyContent = (headerMatch[2] || "").trim();

        // Check page overflow for section header
        if (currentY + 14 > pageHeight - margin - 15) {
          doc.addPage();
          doc.setTextColor(148, 163, 184);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.text(ebook.title.substring(0, 40) + "...", margin, margin);
          doc.text(`Capítulo ${ch.number} (continuação)`, pageWidth - margin - 40, margin);
          doc.line(margin, margin + 3, pageWidth - margin, margin + 3);
          currentY = margin + 15;
        }

        // Apply distinct pillar colors
        if (/🧠|Mental/i.test(headerTitle)) {
          doc.setTextColor(67, 56, 202); // Indigo
        } else if (/❤️|Emocional/i.test(headerTitle)) {
          doc.setTextColor(225, 29, 72); // Rose
        } else if (/✨|Espiritual/i.test(headerTitle)) {
          doc.setTextColor(217, 119, 6); // Amber
        } else if (/📋|Tarefas/i.test(headerTitle)) {
          doc.setTextColor(5, 150, 105); // Emerald
        } else {
          doc.setTextColor(71, 85, 105); // Slate
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.text(headerTitle, margin, currentY);
        currentY += 7;

        if (bodyContent) {
          doc.setTextColor(51, 65, 85);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);

          const bodyLines = doc.splitTextToSize(bodyContent, contentWidth);
          bodyLines.forEach((line: string) => {
            const lineHeight = 5.8;
            if (currentY + lineHeight > pageHeight - margin - 15) {
              doc.addPage();
              doc.setTextColor(148, 163, 184);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(8.5);
              doc.text(ebook.title.substring(0, 40) + "...", margin, margin);
              doc.text(`Capítulo ${ch.number} (continuação)`, pageWidth - margin - 40, margin);
              doc.line(margin, margin + 3, pageWidth - margin, margin + 3);
              currentY = margin + 15;
              doc.setTextColor(51, 65, 85);
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10.5);
            }
            doc.text(line, margin, currentY);
            currentY += lineHeight;
          });
        }
        currentY += 4;
        return;
      }

      // Default paragraph rendering
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);

      const lines = doc.splitTextToSize(pText, contentWidth);
      
      lines.forEach((line: string) => {
        const lineHeight = 5.8;
        if (currentY + lineHeight > pageHeight - margin - 15) {
          doc.addPage();
          // Redraw Header on new page
          doc.setTextColor(148, 163, 184);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.text(ebook.title.substring(0, 40) + "...", margin, margin);
          doc.text(`Capítulo ${ch.number} (continuação)`, pageWidth - margin - 40, margin);
          doc.line(margin, margin + 3, pageWidth - margin, margin + 3);

          currentY = margin + 15;
          doc.setTextColor(51, 65, 85);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10.5);
        }

        doc.text(line, margin, currentY);
        currentY += lineHeight;
      });

      currentY += 4; // Paragraph spacing
    });

    // Page Number
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Página ${3 + idx}`, pageWidth / 2, pageHeight - margin + 5, { align: "center" });
  });


  // --- FINAL PAGE: CONCLUSION & CALL TO ACTION ---
  doc.addPage();
  doc.setTextColor(148, 163, 184);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(ebook.title.substring(0, 40) + "...", margin, margin);
  doc.text("Conclusão", pageWidth - margin - 15, margin);
  doc.line(margin, margin + 3, pageWidth - margin, margin + 3);

  // Title
  doc.setTextColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Conclusão", margin, margin + 15);

  // Body
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const conclusionParagraphs = ebook.conclusion.split("\n\n");
  let concY = margin + 30;

  conclusionParagraphs.forEach((p) => {
    const pText = p.trim();
    if (!pText) return;

    const lines = doc.splitTextToSize(pText, contentWidth);
    
    // Render line-by-line to safely wrap paragraphs in conclusion page
    lines.forEach((line: string) => {
      const lineHeight = 6;
      if (concY + lineHeight > pageHeight - margin - 35) {
        doc.addPage();
        // Redraw Header on new page
        doc.setTextColor(148, 163, 184);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(ebook.title.substring(0, 40) + "...", margin, margin);
        doc.text("Conclusão (continuação)", pageWidth - margin - 40, margin);
        doc.line(margin, margin + 3, pageWidth - margin, margin + 3);

        concY = margin + 15;
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
      }

      doc.text(line, margin, concY);
      concY += lineHeight;
    });

    concY += 4; // Paragraph spacing
  });

  // Call to Action Box
  if (ebook.callToAction) {
    const boxHeight = 45;
    if (concY + boxHeight > pageHeight - margin - 15) {
      doc.addPage();
      concY = margin + 15;
    }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, concY + 5, contentWidth, boxHeight, 3, 3, "F");
    doc.setDrawColor(selectedColor.accent[0], selectedColor.accent[1], selectedColor.accent[2]);
    doc.setLineWidth(1);
    doc.roundedRect(margin, concY + 5, contentWidth, boxHeight, 3, 3, "D");

    doc.setTextColor(selectedColor.bg[0], selectedColor.bg[1], selectedColor.bg[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("MENSAGEM DO AUTOR", margin + 8, concY + 14);

    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const ctaLines = doc.splitTextToSize(ebook.callToAction, contentWidth - 16);
    doc.text(ctaLines, margin + 8, concY + 22);
  }

  // Save the PDF
  const filename = `${ebook.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
  doc.save(filename);
}
