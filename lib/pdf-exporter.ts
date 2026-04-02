import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFExportOptions {
    title: string;
    analysisType: string;
    results: any;
    columns?: string[];
    filename?: string;
    userName?: string;
    chartImages?: string[]; // Array of base64 images
    batchData?: Array<{ title: string; results: any; columns?: string[] }>; // For batch exports (e.g., Cronbach multi-scale)
}

/**
 * Export analysis results to PDF (Text & Table based)
 */
export async function exportToPDF(options: PDFExportOptions): Promise<void> {
    try {
        const {
            title,
            analysisType,
            results,
            columns = [],
            userName = 'Researcher',
            chartImages = []
        } = options;

        const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '');
        const safeUserName = userName.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        const filename = options.filename || `ncskit_${analysisType}_${safeUserName}_${dateStr}.pdf`;

        // Validate input data
        if (!results && (!options.batchData || options.batchData.length === 0)) {
            throw new Error('No data to export PDF');
        }

        // Helper to load font
        const loadVietnameseFont = async (doc: jsPDF) => {
            try {
                // Try both possible paths for NotoSans
                const paths = [
                    '/webr_core/vfs/usr/share/fonts/NotoSans-Regular.ttf',
                    '/webr/vfs/usr/share/fonts/NotoSans-Regular.ttf'
                ];
                
                let regularBuffer: ArrayBuffer | null = null;
                for (const path of paths) {
                    try {
                        const response = await fetch(path);
                        if (response.ok) {
                            regularBuffer = await response.arrayBuffer();
                            break;
                        }
                    } catch (e) {}
                }

                if (!regularBuffer) throw new Error('Could not load NotoSans Regular');

                const binary = Array.from(new Uint8Array(regularBuffer)).map(b => String.fromCharCode(b)).join("");
                doc.addFileToVFS('NotoSans-Regular.ttf', binary);
                doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
                
                // Try loading Bold for better headers
                const boldPath = '/webr_core/vfs/usr/share/fonts/NotoSans-Bold.ttf';
                try {
                    const boldResponse = await fetch(boldPath);
                    if (boldResponse.ok) {
                        const boldBuffer = await boldResponse.arrayBuffer();
                        const boldBinary = Array.from(new Uint8Array(boldBuffer)).map(b => String.fromCharCode(b)).join("");
                        doc.addFileToVFS('NotoSans-Bold.ttf', boldBinary);
                        doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');
                    }
                } catch (e) {}

                doc.setFont('NotoSans', 'normal');
            } catch (error) {
                console.warn('Could not load Vietnamese font, falling back to standard font:', error);
            }
        };

        const addHeader = (doc: jsPDF, showTitle = false, pageNum?: number, totalPages?: number) => {
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            // --- PREMIUM ACADEMIC HEADER ---
            // High-impact Blue-900 banner at the top
            doc.setFillColor(30, 58, 138); // Blue-900
            doc.rect(0, 0, pageWidth, 4, 'F');

            // Set font to NotoSans if loaded
            doc.setFont('NotoSans', 'bold');

            // Logo/Platform Name
            doc.setFontSize(22);
            doc.setTextColor(30, 58, 138);
            doc.text('ncsStat', 15, 22);

            // Academic Tagline
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.setFont('NotoSans', 'normal');
            doc.text('SCIENTIFIC ANALYSIS PLATFORM FOR RESEARCHERS', 15, 28);

            // Right side meta info
            doc.setFontSize(7);
            doc.setTextColor(140);
            doc.setFont('NotoSans', 'normal');
            doc.text('VERSION 2.0 (STABLE)', pageWidth - 15, 18, { align: 'right' });
            
            const exportDate = new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            doc.setFont('NotoSans', 'bold');
            doc.text(`REPORT GENERATED: ${exportDate.toUpperCase()}`, pageWidth - 15, 24, { align: 'right' });

            // Horizontal Separator
            doc.setDrawColor(240);
            doc.setLineWidth(0.5);
            doc.line(15, 34, pageWidth - 15, 34);

            // Analysis Title (On first page only)
            if (showTitle) {
                // Background for title - Professional Slate-100
                doc.setFillColor(241, 245, 249);
                const titleHeight = 20;
                doc.roundedRect(15, 40, pageWidth - 30, titleHeight, 1, 1, 'F');
                
                // Left accent bar
                doc.setFillColor(30, 58, 138); // Blue-900
                doc.rect(15, 40, 3, titleHeight, 'F');

                doc.setFont('NotoSans', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(30, 58, 138);
                const titleLines = doc.splitTextToSize(title.toUpperCase(), pageWidth - 50);
                
                // Center vertically in the box
                const lineCount = titleLines.length;
                const textHeight = lineCount * 7; // approximate line height
                const yOffset = 40 + (titleHeight / 2) - (textHeight / 2) + 5;
                
                doc.text(titleLines, 25, yOffset);
            }

            // --- PROFESSIONAL FOOTER ---
            // Footer separator
            doc.setDrawColor(220);
            doc.setLineWidth(0.3);
            doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

            // Page number & Branding
            const currentPage = pageNum || doc.getCurrentPageInfo().pageNumber;
            const total = totalPages || currentPage;
            
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.setFont('NotoSans', 'bold');
            doc.text(`NCSSTAT SYSTEM REPORT`, 15, pageHeight - 15);
            doc.text(`PAGE ${currentPage} / ${total}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
            doc.text(`HTTPS://NCSSTAT.NC SKIT.ORG`, pageWidth - 15, pageHeight - 15, { align: 'right' });

            // Reset font
            doc.setFont('NotoSans', 'normal');
        };

        const doc = new jsPDF();
        await loadVietnameseFont(doc);

        let yPos = 55; // Start content below header

        // Page break helper
        const checkPageBreak = (height: number = 20) => {
            if (yPos + height > 275) {
                doc.addPage();
                yPos = 50;
            }
        };

        const commonTableOptions = {
            styles: { font: 'NotoSans', fontSize: 9, cellPadding: 3, textColor: [50, 50, 50] as [number, number, number] },
            headStyles: { 
                fillColor: [30, 58, 138] as [number, number, number], // Blue-900
                textColor: [255, 255, 255] as [number, number, number],
                fontStyle: 'bold' as any,
                fontSize: 9,
                halign: 'center' as any
            },
            alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
            theme: 'striped' as const,
            margin: { top: 50 },
        };

        // --- CONTENT GENERATION ---

         if (analysisType === 'cronbach') {
            const alpha = results.alpha ?? results.rawAlpha ?? 0;
            const nItems = results.nItems ?? 0;
            
            // Reliability Overview Card
            doc.setFillColor(241, 245, 249);
            doc.roundedRect(15, yPos, 180, 25, 2, 2, 'F');
            
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(30, 58, 138);
            doc.text("KẾT QUẢ ĐỘ TIN CẬY (RELIABILITY OVERVIEW)", 22, yPos + 10);
            
            doc.setFontSize(10);
            doc.setTextColor(50);
            doc.setFont('NotoSans', 'normal');
            doc.text(`• Hệ số Cronbach's Alpha: ${alpha.toFixed(3)}`, 22, yPos + 18);
            doc.text(`• Số lượng biến quan sát: ${nItems}`, 100, yPos + 18);
            
            yPos += 35;

            if (results.itemTotalStats && Array.isArray(results.itemTotalStats) && results.itemTotalStats.length > 0) {
                checkPageBreak(50);
                doc.setFont('NotoSans', 'bold');
                doc.text('1. Phân tích Tương quan biến - tổng (Item-Total Statistics)', 15, yPos);
                yPos += 7;

                const headers = [['Biến quan sát', 'Trung bình thang đo', 'Phương sai thang đo', 'Tương quan biến - tổng', 'Alpha nếu loại biến']];
                const data = results.itemTotalStats.map((item: any, idx: number) => {
                    const corr = (item.correctedItemTotalCorrelation ?? 0);
                    const isLow = corr < 0.3;
                    return [
                        columns[idx] || item.itemName || `Item ${idx + 1}`,
                        (item.scaleMeanIfDeleted ?? 0).toFixed(3),
                        (item.scaleVarianceIfDeleted ?? 0).toFixed(3),
                        { content: corr.toFixed(3), styles: { fontStyle: isLow ? 'bold' : 'normal', textColor: isLow ? [185, 28, 28] : [0, 0, 0] } },
                        (item.alphaIfItemDeleted ?? 0).toFixed(3)
                    ];
                });

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: headers,
                    body: data,
                    columnStyles: {
                        1: { halign: 'center' },
                        2: { halign: 'center' },
                        3: { halign: 'center' },
                        4: { halign: 'center' }
                    }
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            // Academic Interpretation
            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(203, 213, 225);
            doc.roundedRect(15, yPos, 180, 30, 1, 1, 'FD');
            
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(30, 58, 138);
            doc.text("NHẬN ĐỊNH HỌC THUẬT (ACADEMIC INTERPRETATION):", 20, yPos + 8);
            
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(30, 41, 59);
            const evalText = alpha >= 0.9 ? 'Rất tốt (Excellent)' : alpha >= 0.7 ? 'Tốt/Chấp nhận được (Acceptable)' : 'Kém (Poor)';
            const interpretation = `Thang đo đạt độ tin cậy ${evalText} với Alpha = ${alpha.toFixed(3)}. ${alpha >= 0.7 ? 'Thang đo đủ tính nhất quán nội tại để thực hiện các bước phân tích tiếp theo.' : 'Cần xem xét loại bỏ các biến có tương quan thấp để cải thiện độ tin cậy.'}`;
            const splitInter = doc.splitTextToSize(interpretation, 170);
            doc.text(splitInter, 20, yPos + 15);
            
            yPos += 45;
        }
        else if (analysisType === 'cronbach-batch') {
            // BATCH CRONBACH - All scales in one PDF
            const batchResults = results.batchResults || [];

            // Summary Table (Using English headers for PDF compatibility)
            doc.setFontSize(14);
            doc.text(`Summary of ${batchResults.length} Scales`, 15, yPos);
            yPos += 10;

            const summaryHeaders = [['Scale Name', 'Items', "Cronbach's Alpha", 'Evaluation']];
            const summaryData = batchResults.map((r: any) => {
                const alpha = r.alpha || r.rawAlpha || 0;
                const evalText = alpha >= 0.9 ? 'Excellent' : alpha >= 0.8 ? 'Good' : alpha >= 0.7 ? 'Acceptable' : alpha >= 0.6 ? 'Questionable' : 'Poor';
                return [r.scaleName, r.nItems || '-', alpha.toFixed(3), evalText];
            });

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: summaryHeaders,
                body: summaryData,
                columnStyles: {
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' }
                }
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            // Detailed tables for each scale
            for (const r of batchResults) {
                checkPageBreak(80);
                doc.setFontSize(12);
                doc.setFont('NotoSans', 'bold');
                doc.text(`${r.scaleName}`, 15, yPos);
                doc.setFont('NotoSans', 'normal');
                yPos += 7;

                const alpha = r.alpha || r.rawAlpha || 0;
                doc.text(`Alpha: ${alpha.toFixed(3)}`, 15, yPos);
                yPos += 7;

                if (r.itemTotalStats && r.itemTotalStats.length > 0) {
                    const headers = [['Variable', 'Corrected Item-Total', 'Alpha if Deleted']];
                    const data = r.itemTotalStats.map((item: any, idx: number) => [
                        r.columns?.[idx] || item.itemName || `Item ${idx + 1}`,
                        (item.correctedItemTotalCorrelation ?? 0).toFixed(3),
                        (item.alphaIfItemDeleted ?? 0).toFixed(3)
                    ]);

                    autoTable(doc, {
                        ...commonTableOptions,
                        startY: yPos,
                        head: headers,
                        body: data,
                        columnStyles: {
                            1: { halign: 'center' },
                            2: { halign: 'center' }
                        },
                        styles: { fontSize: 8, font: 'NotoSans' }
                    });
                    yPos = (doc as any).lastAutoTable.finalY + 10;
                }
            }

            // Interpretation guide
            checkPageBreak(30);
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text('• α ≥ 0.9: Excellent | α ≥ 0.8: Good | α ≥ 0.7: Acceptable | α ≥ 0.6: Questionable | α < 0.6: Poor', 15, yPos);
            doc.setTextColor(0);
            doc.setFontSize(10);
            yPos += 10;
        }
        else if (analysisType === 'ttest-indep' || analysisType === 'ttest') {
            doc.text('Independent Samples T-Test:', 15, yPos);
            yPos += 10;

            const headers1 = [['Group', 'Mean', 'N (Sample)']];
            const data1 = [
                ['Group 1', results.mean1.toFixed(2), '-'],
                ['Group 2', results.mean2.toFixed(2), '-']
            ];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers1,
                body: data1,
                theme: 'plain',
                tableWidth: 80
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;

            const headers2 = [['t', 'df', 'Sig. (2-tailed)', 'Mean Diff', 'Cohen\'s d']];
            const data2 = [[
                results.t.toFixed(3),
                results.df.toFixed(3),
                results.pValue < 0.001 ? '< .001' : results.pValue.toFixed(3),
                results.meanDiff.toFixed(3),
                results.effectSize.toFixed(3)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers2,
                body: data2,
                headStyles: { fillColor: [52, 152, 219] as any, fontStyle: 'bold' as any }
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            if (results.varTestP !== undefined) {
                doc.setFontSize(9);
                const varMsg = results.varTestP < 0.05 ? "Violated (Welch t-test used)" : "Assumed Equal Variance";
                doc.text(`* Levene's Test: p = ${results.varTestP.toFixed(3)} (${varMsg})`, 15, yPos);
                yPos += 10;
                doc.setFontSize(10);
            }

            // Academic Interpretation for T-Test
            checkPageBreak(50);
            doc.setFillColor(248, 250, 252); // Light slate
            doc.rect(15, yPos, 180, 45, 'F');
            doc.setDrawColor(30, 58, 138); // Blue-900
            doc.line(15, yPos, 15, yPos + 45); // Left accent line
            
            yPos += 10;
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT (ACADEMIC INTERPRETATION)', 20, yPos);
            
            yPos += 8;
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            
            const isSig = results.pValue < 0.05;
            const tText = isSig 
                ? `Kết quả kiểm định T-test cho thấy có sự khác biệt có ý nghĩa thống kê (p < 0.05) giữa hai nhóm.` 
                : `Kết quả kiểm định T-test cho thấy KHÔNG có sự khác biệt có ý nghĩa thống kê (p > 0.05) giữa hai nhóm.`;
            
            const cohenText = `Mức độ tác động (Cohen's d = ${results.effectSize.toFixed(3)}) được đánh giá ở mức ${Math.abs(results.effectSize) > 0.8 ? 'Lớn' : Math.abs(results.effectSize) > 0.5 ? 'Trung bình' : 'Nhỏ'}.`;
            
            doc.text([tText, cohenText], 20, yPos, { maxWidth: 170 });
            yPos += 20;
            
            doc.setFont('NotoSans', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text('* Gợi ý: Kiểm tra tính đồng nhất phương sai (Levene\'s Test) để đảm bảo độ tin cậy của trị số t.', 20, yPos);
            
            doc.setTextColor(0);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(10);
            yPos += 15;
        }
        else if (analysisType === 'ttest-paired') {
            doc.text('Paired Samples T-Test:', 15, yPos);
            yPos += 10;

            const headers1 = [['Time', 'Mean']];
            const data1 = [
                [`Before (${columns[0] || 'V1'})`, results.meanBefore.toFixed(2)],
                [`After (${columns[1] || 'V2'})`, results.meanAfter.toFixed(2)]
            ];
            autoTable(doc, {
                ...commonTableOptions, startY: yPos, head: headers1, body: data1, theme: 'plain', tableWidth: 80
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;

            const headers2 = [['t', 'df', 'Sig. (2-tailed)', 'Mean Diff', 'Cohen\'s d']];
            const data2 = [[
                results.t.toFixed(3),
                results.df.toFixed(0),
                results.pValue < 0.001 ? '< .001' : results.pValue.toFixed(3),
                results.meanDiff.toFixed(3),
                results.effectSize.toFixed(3)
            ]];
            autoTable(doc, {
                ...commonTableOptions, startY: yPos, head: headers2, body: data2,
                headStyles: { fillColor: [52, 152, 219] as any, fontStyle: 'bold' as any }
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;
        }
        else if (analysisType === 'anova') {
            doc.text('One-Way ANOVA:', 15, yPos);
            yPos += 10;

            const headers = [['F', 'df1 (Between)', 'df2 (Within)', 'Sig.', 'Eta Squared']];
            const data = [[
                results.F.toFixed(3),
                results.dfBetween,
                results.dfWithin,
                results.pValue < 0.001 ? '< .001' : results.pValue.toFixed(3),
                results.etaSquared.toFixed(3)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers,
                body: data,
                headStyles: { fillColor: [30, 58, 138] as any, fontStyle: 'bold' as any }
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            // Group Means
            if (results.groupMeans) {
                checkPageBreak(40);
                doc.text('Group Means:', 15, yPos);
                yPos += 5;
                const hMeans = [['Group', 'Mean']];
                const dMeans = columns.map((col, i) => [col, results.groupMeans[i]?.toFixed(3) || '-']);
                if (results.grandMean) dMeans.push(['Grand Mean', results.grandMean.toFixed(3)]);

                autoTable(doc, { ...commonTableOptions, startY: yPos, head: hMeans, body: dMeans });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            // Academic Interpretation for ANOVA
            checkPageBreak(50);
            doc.setFillColor(248, 250, 252);
            doc.rect(15, yPos, 180, 45, 'F');
            doc.setDrawColor(30, 58, 138); 
            doc.line(15, yPos, 15, yPos + 45);
            
            yPos += 10;
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT (ACADEMIC INTERPRETATION)', 20, yPos);
            
            yPos += 8;
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            
            const isSigA = results.pValue < 0.05;
            const aText = isSigA 
                ? `Kết quả ANOVA cho thấy có sự khác biệt có ý nghĩa thống kê (Sig < 0.05) ít nhất giữa một cặp nhóm.` 
                : `Kết quả ANOVA cho thấy KHÔNG có sự khác biệt có ý nghĩa thống kê (Sig > 0.05) giữa các nhóm.`;
            
            const etaText = `Chỉ số Eta Squared (${results.etaSquared.toFixed(3)}) cho biết mức độ giải thích của biến phân loại đối với biến phụ thuộc.`;
            
            doc.text([aText, etaText], 20, yPos, { maxWidth: 170 });
            yPos += 20;
            
            doc.setFont('NotoSans', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text('* Gợi ý: Nếu Sig < 0.05, hãy xem xét kết quả Post-hoc (Tukey/Games-Howell) để xác định cụ thể cặp nhóm có sự khác biệt.', 20, yPos);
            
            doc.setTextColor(0);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(10);
            yPos += 15;
        }
        else if (analysisType === 'chisquare') {
            doc.text('Chi-Square Test (Independence):', 15, yPos);
            yPos += 10;

            doc.text(`Chi-Square: ${results.chiSquare.toFixed(3)}`, 15, yPos);
            yPos += 7;
            doc.text(`df: ${results.df}`, 15, yPos);
            yPos += 7;
            doc.text(`p-value: ${results.pValue < 0.001 ? '< .001' : results.pValue.toFixed(3)}`, 15, yPos);
            yPos += 10;

            doc.text(`Cramer\'s V: ${results.cramersV.toFixed(3)}`, 15, yPos);
            yPos += 15;
        }
        else if (analysisType === 'mann-whitney') {
            doc.text('Mann-Whitney U Test:', 15, yPos);
            yPos += 10;

            doc.text(`U Statistic: ${results.uStatistic.toFixed(2)}`, 15, yPos);
            yPos += 7;
            doc.text(`p-value: ${results.pValue < 0.001 ? '< .001' : results.pValue.toFixed(3)}`, 15, yPos);
            yPos += 7;
            if (results.effectSize) {
                doc.text(`Effect Size (r): ${results.effectSize.toFixed(3)}`, 15, yPos);
                yPos += 15;
            }
        }
        else if (analysisType === 'regression') {
            const { modelFit, coefficients, equation } = results;

            doc.setFontSize(10);
            doc.text(`Equation: ${equation}`, 15, yPos, { maxWidth: 180 });
            yPos += 15;

            checkPageBreak();
            doc.text(`R Square: ${modelFit.rSquared.toFixed(3)} | Adj R Square: ${modelFit.adjRSquared.toFixed(3)}`, 15, yPos);
            yPos += 7;
            doc.text(`F: ${modelFit.fStatistic.toFixed(2)} | Sig: ${modelFit.pValue < 0.001 ? '< .001' : modelFit.pValue.toFixed(3)}`, 15, yPos);
            yPos += 10;

            const headers = [['Variable', 'B', 'Std. Error', 't', 'Sig.', 'VIF']];
            const data = coefficients.map((c: any) => [
                c.term,
                c.estimate.toFixed(3),
                c.stdError.toFixed(3),
                c.tValue.toFixed(3),
                c.pValue < 0.001 ? '< .001' : c.pValue.toFixed(3),
                c.vif ? c.vif.toFixed(3) : '-'
            ]);

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers,
                body: data,
                headStyles: { 
                    fillColor: [30, 58, 138] as [number, number, number], 
                    textColor: [255, 255, 255] as [number, number, number],
                    fontStyle: 'bold' as any 
                }
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            // Academic Interpretation for Regression
            checkPageBreak(50);
            doc.setFillColor(248, 250, 252);
            doc.rect(15, yPos, 180, 50, 'F');
            doc.setDrawColor(30, 58, 138); 
            doc.line(15, yPos, 15, yPos + 50);
            
            yPos += 10;
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT (ACADEMIC INTERPRETATION)', 20, yPos);
            
            yPos += 8;
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            
            const r2 = modelFit.rSquared;
            const rText = `Mô hình có R-Square = ${r2.toFixed(3)}, cho thấy các biến độc lập giải thích được ${(r2 * 100).toFixed(1)}% sự biến thiên của biến phụ thuộc.`;
            const fText = modelFit.pValue < 0.05 
                ? `Kiểm định F có Sig < 0.05, khẳng định mô hình hồi quy là phù hợp.` 
                : `Cảnh báo: Kiểm định F có Sig > 0.05, mô hình có thể không có ý nghĩa thống kê.`;
            
            doc.text([rText, fText], 20, yPos, { maxWidth: 170 });
            yPos += 22;
            
            doc.setFont('NotoSans', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text('* Gợi ý: Kiểm tra hệ số VIF (< 10 hoặc < 2) để loại trừ hiện tượng đa cộng tuyến giữa các biến độc lập.', 20, yPos);
            
            doc.setTextColor(0);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(10);
            yPos += 15;
        }
        else if (analysisType === 'efa') {
            doc.text(`KMO: ${results.kmo.toFixed(3)}`, 15, yPos);
            yPos += 7;
            doc.text(`Bartlett Sig: ${results.bartlettP < 0.001 ? '< .001' : results.bartlettP.toFixed(3)}`, 15, yPos);
            yPos += 10;

            if (results.eigenvalues) {
                const evInfo = results.eigenvalues.slice(0, 8).map((e: number, i: number) => `F${i + 1}: ${e.toFixed(2)}`).join(', ');
                doc.text(`Eigenvalues: ${evInfo}...`, 15, yPos);
                yPos += 10;
            }

            if (results.loadings) {
                const headers = [['Variable', ...Array(results.loadings[0].length).fill(0).map((_, i) => `Factor ${i + 1}`)]];
                const data = results.loadings.map((row: number[], i: number) => {
                    return [`Var ${i + 1} (${columns[i] || ''})`, ...row.map(v => v.toFixed(3))];
                });

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: headers,
                    body: data
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }
        }
        else if (analysisType === 'cfa' || analysisType === 'sem') {
            const { fitMeasures, estimates } = results;

            if (fitMeasures) {
                checkPageBreak();
                doc.text('Model Fit Indices:', 15, yPos);
                yPos += 5;

                const fitHeaders = [['Index', 'Value']];
                const fitOrder = ['chisq', 'df', 'pvalue', 'cfi', 'tli', 'rmsea', 'srmr'];
                const fitLabels: any = { chisq: 'Chi-square', df: 'df', pvalue: 'P-value', cfi: 'CFI', tli: 'TLI', rmsea: 'RMSEA', srmr: 'SRMR' };

                const fitData = fitOrder.map(key => [fitLabels[key], fitMeasures[key]?.toFixed(3) || '-']);

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: fitHeaders,
                    body: fitData,
                    theme: 'plain',
                    tableWidth: 80
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            if (estimates) {
                checkPageBreak();
                doc.text('Parameter Estimates:', 15, yPos);
                yPos += 5;

                const estHeaders = [['LHS', 'Op', 'RHS', 'Est', 'Std.Err', 'z', 'P(>|z|)', 'Std.All']];
                const estData = estimates.map((e: any) => [
                    e.lhs,
                    e.op,
                    e.rhs,
                    e.est.toFixed(3),
                    e.se.toFixed(3),
                    e.z.toFixed(3),
                    e.pvalue < 0.001 ? '< .001' : e.pvalue.toFixed(3),
                    e.std_all.toFixed(3)
                ]);

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: estHeaders,
                    body: estData,
                    headStyles: { fillColor: [100, 100, 100] as any, fontStyle: 'bold' as any },
                    styles: { fontSize: 8, font: 'NotoSans' }
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }
        }
         else if (analysisType === 'descriptive') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('BẢNG THỐNG KÊ MIÊU TẢ (DESCRIPTIVE STATISTICS SUMMARY)', 15, yPos);
            yPos += 8;

            const headers = [['Biến quan sát', 'Mean', 'Std. Deviation', 'Minimum', 'Maximum', 'Skewness', 'Kurtosis']];
            if (results.mean && results.mean.length > 0) {
                const data = results.mean.map((_: any, i: number) => [
                    columns[i] || `Var ${i + 1}`,
                    (results.mean[i] ?? 0).toFixed(3),
                    (results.sd[i] ?? 0).toFixed(3),
                    (results.min[i] ?? 0).toFixed(3),
                    (results.max[i] ?? 0).toFixed(3),
                    (results.skew[i] ?? 0).toFixed(2),
                    (results.kurtosis[i] ?? 0).toFixed(2)
                ]);

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: headers,
                    body: data,
                    columnStyles: {
                        1: { halign: 'center' },
                        2: { halign: 'center' },
                        3: { halign: 'center' },
                        4: { halign: 'center' },
                        5: { halign: 'center' },
                        6: { halign: 'center' }
                    }
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            // Academic Interpretation
            checkPageBreak(40);
            doc.setFillColor(241, 245, 249);
            doc.setDrawColor(30, 58, 138);
            doc.setLineWidth(0.3);
            doc.roundedRect(15, yPos, 180, 45, 2, 2, 'FD');
            
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(30, 58, 138);
            doc.text("NHẬN ĐỊNH HỌC THUẬT QUY CHUẨN:", 20, yPos + 10);
            
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            
            // Dynamic academic interpretation for Descriptive stats
            const minMean = Math.min(...results.mean);
            const maxMean = Math.max(...results.mean);
            const skewArr = results.skew || [];
            const kurtArr = results.kurtosis || [];
            const isNormal = skewArr.every((s: number) => Math.abs(s) <= 2) && kurtArr.every((k: number) => Math.abs(k) <= 2);

            const interpretation = `Kết quả thống kê cho thấy các biến quan sát có giá trị trung bình trong khoảng [${minMean.toFixed(2)} - ${maxMean.toFixed(2)}]. Độ lệch chuẩn thể hiện mức độ phân tán của dữ liệu. ${isNormal ? 'Dựa trên chỉ số Skewness và Kurtosis (nằm trong khoảng [-2, 2]), dữ liệu có xu hướng phân phối chuẩn, đảm bảo điều kiện cho các kiểm định tham số tiếp theo.' : 'Tuy nhiên, phát hiện một số biến có chỉ số Skewness hoặc Kurtosis vượt ngưỡng [-2, 2], cho thấy dữ liệu có dấu hiệu vi phạm phân phối chuẩn. Cần thận trọng khi sử dụng các kiểm định tham số.'}`;
            const splitInter = doc.splitTextToSize(interpretation, 170);
            doc.text(splitInter, 20, yPos + 18);
            
            yPos += 60;
        }
        else if (analysisType === 'correlation') {
            doc.text('Correlation Matrix (Pearson):', 15, yPos);
            yPos += 10;
            const colHeaders = ['Variable', ...(columns.length > 0 ? columns : Array(results.correlationMatrix.length).fill(0).map((_, i) => `V${i + 1}`))];
            const data = results.correlationMatrix.map((row: number[], i: number) => [
                columns[i] || `V${i + 1}`,
                ...row.map((val: number, j: number) => {
                    const p = results.pValues[i][j];
                    const sig = p < 0.01 ? '**' : p < 0.05 ? '*' : '';
                    return val.toFixed(2) + sig;
                })
            ]);

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: [colHeaders],
                body: data,
                headStyles: { fillColor: [44, 62, 80] as any, fontStyle: 'bold' as any },
                styles: { fontSize: 8, font: 'NotoSans' },
                // Subtle Heatmap coloring for correlation matrix
                didParseCell: (hookData: any) => {
                    if (hookData.section === 'body' && hookData.column.index > 0) {
                        const cellText = hookData.cell.text[0] || '';
                        const numericValue = parseFloat(cellText.replace(/\*+/g, ''));
                        if (!isNaN(numericValue)) {
                            const absVal = Math.abs(numericValue);
                            
                            // Diagonal (1.0) - light slate
                            if (absVal > 0.99) {
                                hookData.cell.styles.fillColor = [241, 245, 249];
                                hookData.cell.styles.fontStyle = 'bold';
                            } else if (absVal >= 0.3) {
                                // Subtle coloring for significant/meaningful correlations
                                const intensity = Math.min((absVal - 0.3) * 1.5, 0.4); // Scale 0.3-0.7 to 0-0.4
                                if (numericValue > 0) {
                                    // Subtle blue
                                    hookData.cell.styles.fillColor = [235, 245, 255];
                                    if (absVal > 0.5) hookData.cell.styles.textColor = [30, 58, 138];
                                } else {
                                    // Subtle red
                                    hookData.cell.styles.fillColor = [254, 242, 242];
                                    if (absVal > 0.5) hookData.cell.styles.textColor = [153, 27, 27];
                                }
                            }
                        }
                    }
                }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
            doc.setFontSize(8);
            doc.text('* p < 0.05, ** p < 0.01 | Color: Blue = Positive, Red = Negative (intensity = strength)', 15, yPos);
            yPos += 10;
        }
        else if (results && typeof results === 'object') {
            const keys = Object.keys(results).filter(k => typeof results[k] === 'number' || typeof results[k] === 'string');
            const data = keys.map(k => [k, String(results[k])]);
            if (data.length > 0) {
                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: [['Metric', 'Value']],
                    body: data
                });
            }
        }

        // --- CHARTS RENDER ---
        if (chartImages.length > 0) {
            checkPageBreak(100);
            doc.addPage();
            yPos = 50;

            doc.setFontSize(14);
            doc.setFont('NotoSans', 'bold');
            doc.text('Visual Charts', 15, yPos);
            yPos += 15;

            for (const imgData of chartImages) {
                const imgWidth = 180;
                const imgHeight = 90; // Approx 2:1 aspect ratio

                checkPageBreak(imgHeight + 20);

                try {
                    doc.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 15;
                } catch (e) {
                    console.warn("Could not add image", e);
                }
            }
        }

        // --- CITATION FOOTER (Robust) ---
        checkPageBreak(50);
        yPos += 15;
        doc.setDrawColor(200);
        doc.line(15, yPos, 196, yPos);
        yPos += 10;

        doc.setFontSize(9);
        doc.setFont("times", "italic");
        doc.setTextColor(80);

        const citation1 = "Data analyzed using R (R Core Team, 2023) via ncsStat platform (Le, 2026). Reliability and factor analyses performed using psych (Revelle, 2023) and lavaan (Rosseel, 2012) packages.";
        const citation2 = "Le, P. H. (2026). ncsStat: A Web-Based Statistical Analysis Platform for Psychometric Analysis. Available at https://ncsstat.ncskit.org";

        // Split text to fit width
        const splitText1 = doc.splitTextToSize(citation1, 180);
        doc.text(splitText1, 15, yPos);
        yPos += doc.getTextDimensions(splitText1).h + 5;

        const splitText2 = doc.splitTextToSize(citation2, 180);
        doc.text(splitText2, 15, yPos);


        // --- FINAL POST-PROCESSING: APPLY HEADER TO ALL PAGES ---
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addHeader(doc, i === 1, i, totalPages);
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
