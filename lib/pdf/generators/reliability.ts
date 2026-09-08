import autoTable from 'jspdf-autotable';
import { PDFContext } from '../core';

export const generateReliabilityPDF = (ctx: PDFContext) => {
    const { doc, options, commonTableOptions } = ctx;
    const { results, columns = [], analysisType } = options;
    
    if (analysisType === 'cronbach' || analysisType === 'omega') {
        const isOmega = analysisType === 'omega';
        const alpha = results.alpha ?? results.rawAlpha ?? 0;
        const omega = results.omega ?? 0;
        const primaryScore = isOmega && omega > 0 ? omega : alpha;
        const primaryLabel = isOmega ? "McDonald's Omega (\u03c9)" : "Cronbach's Alpha (\u03b1)";
        const nItems = results.nItems ?? 0;
        
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(15, ctx.yPos, 180, 25, 2, 2, 'F');
        
        doc.setFont('NotoSans', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 58, 138);
        doc.text(isOmega ? "K\u1EBET QU\u1EA2 \u0110\u1ED8 TIN C\u1EACY - McDONALD'S OMEGA" : "K\u1EBET QU\u1EA2 \u0110\u1ED8 TIN C\u1EACY (RELIABILITY OVERVIEW)", 22, ctx.yPos + 10);
        
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.setFont('NotoSans', 'normal');
        doc.text(`\u2022 H\u1EC7 s\u1ED1 ${primaryLabel}: ${(primaryScore || 0).toFixed(3)}`, 22, ctx.yPos + 18);
        doc.text(`\u2022 S\u1ED1 l\u01B0\u1EE3ng bi\u1EBFn quan s\u00E1t: ${nItems || 0}`, 100, ctx.yPos + 18);
        
        ctx.yPos += 35;

        if (results.itemTotalStats && Array.isArray(results.itemTotalStats) && results.itemTotalStats.length > 0) {
            ctx.checkPageBreak(50);
            doc.setFont('NotoSans', 'bold');
            doc.text('1. Ph\u00E2n t\u00EDch T\u01B0\u01A1ng quan bi\u1EBFn - t\u1ED5ng (Item-Total Statistics)', 15, ctx.yPos);
            ctx.yPos += 7;

            const headers = [['Bi\u1EBFn quan s\u00E1t', 'Trung b\u00ECnh thang \u0111o', 'Ph\u01B0\u01A1ng sai thang \u0111o', 'T\u01B0\u01A1ng quan bi\u1EBFn - t\u1ED5ng', 'Alpha n\u1EBFu lo\u1EA1i bi\u1EBFn']];
            const data = results.itemTotalStats.map((item: any, idx: number) => {
                const corr = (item.correctedItemTotalCorrelation ?? 0);
                const isLow = corr < 0.3;
                return [
                    columns[idx] || item.itemName || `Item ${idx + 1}`,
                    (item.scaleMeanIfDeleted ?? 0).toFixed(3),
                    (item.scaleVarianceIfDeleted ?? 0).toFixed(3),
                    { content: (corr || 0).toFixed(3), styles: { fontStyle: isLow ? 'bold' : 'normal', textColor: isLow ? [185, 28, 28] : [0, 0, 0] } },
                    (item.alphaIfItemDeleted ?? 0).toFixed(3)
                ];
            });

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: headers,
                body: data,
                columnStyles: {
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' },
                    4: { halign: 'center' }
                }
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
        }

        ctx.checkPageBreak(40);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(15, ctx.yPos, 180, 30, 1, 1, 'FD');
        
        doc.setFont('NotoSans', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 58, 138);
        doc.text("NH\u1EACN \u0110\u1ECBNH H\u1ECCC THU\u1EACT (ACADEMIC INTERPRETATION):", 20, ctx.yPos + 8);
        
        doc.setFont('NotoSans', 'normal');
        doc.setTextColor(30, 41, 59);
        const evalText = primaryScore >= 0.9 ? 'R\u1EA5t t\u1ED1t (Excellent)' : primaryScore >= 0.7 ? 'T\u1ED1t/Ch\u1EA5p nh\u1EADn \u0111\u01B0\u1EE3c (Acceptable)' : 'K\u00E9m (Poor)';
        const interpretation = isOmega
            ? `K\u1EBFt qu\u1EA3 ph\u00E2n t\u00EDch \u0111\u1ED9 tin c\u1EADy cho th\u1EA5y thang \u0111o \u0111\u1EA1t h\u1EC7 s\u1ED1 McDonald's Omega l\u00E0 ${(primaryScore || 0).toFixed(3)}, \u0111\u1EA1t m\u1EE9c \u0111\u1ED9 tin c\u1EADy ${evalText}. McDonald's Omega \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng thay cho Cronbach's Alpha \u0111\u1EC3 v\u01B0\u1EE3t qua gi\u1EDBi h\u1EA1n c\u1EE7a gi\u1EA3 \u0111\u1ECBnh tau-equivalent, mang l\u1EA1i \u01B0\u1EDBc l\u01B0\u1EE3ng \u0111\u1ED9 tin c\u1EADy ch\u00EDnh x\u00E1c h\u01A1n. H\u1EC7 s\u1ED1 Cronbach's Alpha tham kh\u1EA3o: ${(alpha || 0).toFixed(3)}.`
            : `K\u1EBFt qu\u1EA3 ph\u00E2n t\u00EDch \u0111\u1ED9 tin c\u1EADy cho th\u1EA5y thang \u0111o \u0111\u1EA1t h\u1EC7 s\u1ED1 Cronbach's Alpha l\u00E0 ${(alpha || 0).toFixed(3)} (> 0.700), \u0111\u1EA1t m\u1EE9c \u0111\u1ED9 tin c\u1EADy ${evalText}. \u0110i\u1EC1u n\u00E0y kh\u1EB3ng \u0111\u1ECBnh thang \u0111o c\u00F3 t\u00EDnh nh\u1EA5t qu\u00E1n n\u1ED9i t\u1EA1i cao, c\u00E1c bi\u1EBFn quan s\u00E1t \u0111o l\u01B0\u1EDDng t\u1ED1t cho c\u00F9ng m\u1ED9t kh\u00E1i ni\u1EC7m nghi\u00EAn c\u1EE9u v\u00E0 \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n \u0111\u1EC3 th\u1EF1c hi\u1EC7n c\u00E1c b\u01B0\u1EDBc ph\u00E2n t\u00EDch ti\u1EBFp theo.`;
        const splitInter = doc.splitTextToSize(interpretation, 170);
        doc.text(splitInter, 20, ctx.yPos + 15);
        
        ctx.yPos += 45;
    }
    else if (analysisType === 'cronbach-batch' || analysisType === 'omega-batch') {
        const isOmegaBatch = analysisType === 'omega-batch';
        const batchResults = results.batchResults || [];

        doc.setFontSize(14);
        doc.text(`Summary of ${batchResults.length} Scales`, 15, ctx.yPos);
        ctx.yPos += 10;

        const metricHeader = isOmegaBatch ? "McDonald's Omega" : "Cronbach's Alpha";
        const summaryHeaders = [['Scale Name', 'Items', metricHeader, 'Evaluation']];
        const summaryData = batchResults.map((r: any) => {
            const score = isOmegaBatch ? (r.omega || 0) : (r.alpha || r.rawAlpha || 0);
            const evalText = score >= 0.9 ? 'Excellent' : score >= 0.8 ? 'Good' : score >= 0.7 ? 'Acceptable' : score >= 0.6 ? 'Questionable' : 'Poor';
            return [r.scaleName, r.nItems || '-', (score || 0).toFixed(3), evalText];
        });

        autoTable(doc, {
            ...commonTableOptions,
            startY: ctx.yPos,
            head: summaryHeaders,
            body: summaryData,
            columnStyles: {
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' }
            }
        });
        ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

        for (const r of batchResults) {
            ctx.checkPageBreak(80);
            doc.setFontSize(12);
            doc.setFont('NotoSans', 'bold');
            doc.text(`${r.scaleName}`, 15, ctx.yPos);
            doc.setFont('NotoSans', 'normal');
            ctx.yPos += 7;

            const score = isOmegaBatch ? (r.omega || 0) : (r.alpha || r.rawAlpha || 0);
            const scoreLabel = isOmegaBatch ? 'Omega' : 'Alpha';
            doc.text(`${scoreLabel}: ${(score || 0).toFixed(3)}`, 15, ctx.yPos);
            ctx.yPos += 7;

            if (r.itemTotalStats && r.itemTotalStats.length > 0) {
                const headers = [['Variable', 'Corrected Item-Total', 'Alpha if Deleted']];
                const data = r.itemTotalStats.map((item: any, idx: number) => [
                    r.columns?.[idx] || item.itemName || `Item ${idx + 1}`,
                    (item.correctedItemTotalCorrelation ?? 0).toFixed(3),
                    (item.alphaIfItemDeleted ?? 0).toFixed(3)
                ]);

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: ctx.yPos,
                    head: headers,
                    body: data,
                    columnStyles: {
                        1: { halign: 'center' },
                        2: { halign: 'center' }
                    },
                    styles: { fontSize: 8, font: 'NotoSans' }
                });
                ctx.yPos = (doc as any).lastAutoTable.finalY + 10;
            }
        }

        ctx.checkPageBreak(30);
        doc.setFontSize(8);
        doc.setTextColor(100);
        const scaleNote = isOmegaBatch
            ? '\u2022 \u03c9 \u2265 0.9: R\u1EA5t t\u1ED1t | \u03c9 \u2265 0.8: T\u1ED1t | \u03c9 \u2265 0.7: Ch\u1EA5p nh\u1EADn \u0111\u01B0\u1EE3c | \u03c9 \u2265 0.6: C\u1EA7n xem x\u00E9t | \u03c9 < 0.6: K\u00E9m'
            : '\u2022 \u03b1 \u2265 0.9: R\u1EA5t t\u1ED1t | \u03b1 \u2265 0.8: T\u1ED1t | \u03b1 \u2265 0.7: Ch\u1EA5p nh\u1EADn \u0111\u01B0\u1EE3c | \u03b1 \u2265 0.6: C\u1EA7n xem x\u00E9t | \u03b1 < 0.6: K\u00E9m';
        doc.text(scaleNote, 15, ctx.yPos);
        doc.setTextColor(0);
        doc.setFontSize(10);
        ctx.yPos += 10;
    }
};




