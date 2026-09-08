import jsPDF from 'jspdf';
import { 
    PDFExportOptions, 
    PDFContext, 
    loadVietnameseFont, 
    addHeader, 
    COMMON_TABLE_OPTIONS,
    renderCharts,
    renderCitation
} from './pdf/core';

import { generateReliabilityPDF } from './pdf/generators/reliability';
import { generateComparisonPDF } from './pdf/generators/comparison';
import { generateRegressionPDF } from './pdf/generators/regression';
import { generateFactorPDF } from './pdf/generators/factor';
import { generateDescriptivePDF } from './pdf/generators/descriptive';
import { generateAutopilotPDF } from './pdf/generators/autopilot';

export type { PDFExportOptions };

export async function exportToPDF(options: PDFExportOptions): Promise<void> {
    try {
        const {
            title,
            analysisType,
            results,
            userName = 'Researcher',
        } = options;

        const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '');
        const safeUserName = userName.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        const filename = options.filename || `ncskit_${analysisType}_${safeUserName}_${dateStr}.pdf`;

        if (!results && (!options.batchData || options.batchData.length === 0)) {
            throw new Error('No data to export PDF');
        }

        const doc = new jsPDF();
        await loadVietnameseFont(doc);

        const ctx: PDFContext = {
            doc,
            yPos: 55,
            options,
            commonTableOptions: COMMON_TABLE_OPTIONS,
            checkPageBreak: function (height: number = 20) {
                if (this.yPos + height > 275) {
                    this.doc.addPage();
                    this.yPos = 50;
                }
            }
        };

        // Bind the checkPageBreak function to ctx so `this` works correctly
        ctx.checkPageBreak = ctx.checkPageBreak.bind(ctx);

        // Routing to appropriate generator based on analysisType
        const reliabilityTypes = ['cronbach', 'omega', 'cronbach-batch', 'omega-batch'];
        const comparisonTypes = ['ttest-indep', 'ttest', 'ttest-paired', 'anova', 'twoway-anova', 'mann-whitney', 'kruskal-wallis', 'wilcoxon'];
        const regressionTypes = ['regression', 'logistic'];
        const factorTypes = ['efa', 'cfa', 'sem', 'cluster'];
        const descriptiveTypes = ['descriptive', 'chisquare', 'correlation'];
        const autopilotTypes = ['auto-pilot'];

        if (reliabilityTypes.includes(analysisType)) {
            generateReliabilityPDF(ctx);
        } else if (comparisonTypes.includes(analysisType)) {
            generateComparisonPDF(ctx);
        } else if (regressionTypes.includes(analysisType)) {
            generateRegressionPDF(ctx);
        } else if (factorTypes.includes(analysisType)) {
            generateFactorPDF(ctx);
        } else if (descriptiveTypes.includes(analysisType)) {
            generateDescriptivePDF(ctx);
        } else if (autopilotTypes.includes(analysisType)) {
            generateAutopilotPDF(ctx);
        } else {
            console.warn(`Unsupported analysis type for PDF generation: ${analysisType}`);
        }

        // Render visual charts if any
        renderCharts(ctx);

        // Render citation footer
        renderCitation(ctx);

        // Apply headers/footers to all pages
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addHeader(doc, userName, title, i === 1, i, totalPages);
        }

        doc.save(filename);
    } catch (error) {
        console.error("PDF Export Error:", error);
    }
}

// Deprecated html2canvas method
export async function exportWithCharts(elementId: string, filename: string): Promise<void> {
    console.warn("Screenshot export is disabled due to compatibility issues. Please use Text Export.");
}
