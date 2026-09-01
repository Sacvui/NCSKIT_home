import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { logger } from '@/utils/logger';

/**
 * Export a React DOM element to a multipage PDF using html-to-image and jsPDF.
 * 
 * @param elementId The ID of the DOM element to capture.
 * @param filename The desired filename for the downloaded PDF.
 * @param title Optional title to print at the top of the PDF.
 */
export async function exportHtmlToPdf(elementId: string, filename: string, title?: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id ${elementId} not found`);
    }

    try {
        // Prepare element for better capture
        // We temporarily force it to be visible and have white background
        const originalBg = element.style.background;
        const originalOverflow = element.style.overflow;
        
        element.style.background = '#ffffff';
        element.style.overflow = 'visible';

        const imgData = await toPng(element, {
            backgroundColor: '#ffffff',
            pixelRatio: 2, // High resolution
        });

        // Restore styles
        element.style.background = originalBg;
        element.style.overflow = originalOverflow;
        
        // A4 Paper sizing
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Add 10mm margin
        const margin = 10;
        const printWidth = pdfWidth - (margin * 2);
        
        // Calculate proportional height based on print width
        const imgProps = pdf.getImageProperties(imgData);
        const printHeight = (imgProps.height * printWidth) / imgProps.width;

        let heightLeft = printHeight;
        let position = margin;
        
        // If title provided, add it to first page
        if (title) {
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(title, pdfWidth / 2, margin + 5, { align: 'center' });
            position += 15; // Move down below title
            heightLeft -= 15;
        }

        // Add first page
        pdf.addImage(imgData, 'PNG', margin, position, printWidth, printHeight);
        heightLeft -= (pdfHeight - position - margin);

        // Add subsequent pages if content overflows
        while (heightLeft >= 0) {
            position = heightLeft - printHeight + margin;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, printWidth, printHeight);
            heightLeft -= (pdfHeight - (margin * 2));
        }

        pdf.save(filename);
    } catch (error) {
        logger.error('Failed to generate PDF:', error);
        throw new Error('Failed to generate PDF from HTML content.');
    }
}
