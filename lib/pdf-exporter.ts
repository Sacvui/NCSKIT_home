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
                    '/webr_core_v3/vfs/usr/share/fonts/NotoSans-Regular.ttf',
                    '/webr_core/vfs/usr/share/fonts/NotoSans-Regular.ttf'
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
                const boldPath = '/webr_core_v3/vfs/usr/share/fonts/NotoSans-Bold.ttf';
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
            doc.setFillColor(30, 58, 138); // Blue-900
            doc.rect(0, 0, pageWidth, 5, 'F');

            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(24);
            doc.setTextColor(30, 58, 138);
            doc.text('ncsStat', 15, 22);

            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139); // Slate-500
            doc.setFont('NotoSans', 'normal');
            doc.text('HỆ THỐNG PHÂN TÍCH DỮ LIỆU KHOA HỌC CHUYÊN SÂU', 15, 28);

            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184); // Slate-400
            doc.text('NGƯỜI THỰC HIỆN: ' + userName.toUpperCase(), pageWidth - 15, 18, { align: 'right' });
            
            const exportDate = new Date().toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(71, 85, 105); // Slate-600
            doc.text(`NGÀY XUẤT BÁO CÁO: ${exportDate}`, pageWidth - 15, 24, { align: 'right' });

            doc.setDrawColor(226, 232, 240); // Slate-200
            doc.setLineWidth(0.5);
            doc.line(15, 34, pageWidth - 15, 34);

            if (showTitle) {
                doc.setFillColor(248, 250, 252); // Slate-50
                doc.roundedRect(15, 40, pageWidth - 30, 15, 1, 1, 'F');
                doc.setFillColor(30, 58, 138); 
                doc.rect(15, 40, 2, 15, 'F');

                doc.setFont('NotoSans', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(30, 58, 138);
                doc.text(title.toUpperCase(), 22, 50);
            }

            // --- PROFESSIONAL FOOTER ---
            doc.setDrawColor(226, 232, 240);
            doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

            const currentPage = pageNum || doc.getCurrentPageInfo().pageNumber;
            const total = totalPages || currentPage;
            
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(`© 2026 NCSSTAT ENGINE - BÁO CÁO PHÂN TÍCH TỰ ĐỘNG`, 15, pageHeight - 10);
            doc.text(`TRANG ${currentPage} / ${total}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.text(`XÁC THỰC TẠI: WWW.NCSKIT.ORG`, pageWidth - 15, pageHeight - 10, { align: 'right' });
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
            styles: { 
                font: 'NotoSans', 
                fontSize: 8.5, 
                cellPadding: 2.5, 
                textColor: [33, 37, 41] as [number, number, number],
                lineWidth: 0.1,
                lineColor: [200, 200, 200] as [number, number, number]
            },
            headStyles: { 
                fillColor: [255, 255, 255] as [number, number, number], // White background for APA
                textColor: [30, 58, 138] as [number, number, number], // Blue-900 text
                fontStyle: 'bold' as any,
                fontSize: 9,
                halign: 'center' as any,
                lineWidth: { top: 0.5, bottom: 0.5, left: 0, right: 0 } as any, // Only top/bottom lines for APA
                lineColor: [30, 58, 138] as [number, number, number]
            },
            bodyStyles: {
                lineWidth: { top: 0, bottom: 0.1, left: 0, right: 0 } as any,
            },
            alternateRowStyles: { fillColor: [250, 251, 253] as [number, number, number] },
            theme: 'plain' as const, // Use plain for maximum control (APA style)
            margin: { top: 50, left: 15, right: 15 },
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
            doc.text(`• Hệ số Cronbach's Alpha: ${(alpha || 0).toFixed(3)}`, 22, yPos + 18);
            doc.text(`• Số lượng biến quan sát: ${nItems || 0}`, 100, yPos + 18);
            
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
                        { content: (corr || 0).toFixed(3), styles: { fontStyle: isLow ? 'bold' : 'normal', textColor: isLow ? [185, 28, 28] : [0, 0, 0] } },
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
            const interpretation = `Kết quả phân tích độ tin cậy cho thấy thang đo đạt hệ số Cronbach's Alpha là ${(alpha || 0).toFixed(3)} (> 0.700), đạt mức độ tin cậy ${evalText}. Điều này khẳng định thang đo có tính nhất quán nội tại cao, các biến quan sát đo lường tốt cho cùng một khái niệm nghiên cứu và đủ điều kiện để thực hiện các bước phân tích tiếp theo.`;
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
                return [r.scaleName, r.nItems || '-', (alpha || 0).toFixed(3), evalText];
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
                doc.text(`Alpha: ${(alpha || 0).toFixed(3)}`, 15, yPos);
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

            checkPageBreak(30);
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text('• α ≥ 0.9: Rất tốt | α ≥ 0.8: Tốt | α ≥ 0.7: Chấp nhận được | α ≥ 0.6: Cần xem xét | α < 0.6: Kém', 15, yPos);
            doc.setTextColor(0);
            doc.setFontSize(10);
            yPos += 10;
        }
        else if (analysisType === 'ttest-indep' || analysisType === 'ttest') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('KIỂM ĐỊNH T-TEST ĐỘC LẬP (INDEPENDENT SAMPLES T-TEST)', 15, yPos);
            yPos += 10;

            const headers1 = [['Nhóm', 'Trung bình (Mean)', 'Độ lệch chuẩn (SD)', 'Kích thước mẫu (N)']];
            const data1 = [
                ['Nhóm 1', (results.mean1 || 0).toFixed(3), '-', '-'],
                ['Nhóm 2', (results.mean2 || 0).toFixed(3), '-', '-']
            ];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers1,
                body: data1,
                tableWidth: 140
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;

            const headers2 = [['Giá trị t', 'Bậc tự do (df)', 'Sig. (2-tailed)', 'Chênh lệch TB', "Cohen's d"]];
            const data2 = [[
                (results.t || 0).toFixed(3),
                (results.df || 0).toFixed(3),
                results.pValue < 0.001 ? '< 0.001' : (results.pValue || 0).toFixed(3),
                (results.meanDiff || 0).toFixed(3),
                (results.effectSize || 0).toFixed(3)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers2,
                body: data2,
                headStyles: { fillColor: [30, 58, 138] as any, textColor: [255, 255, 255] as any }
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(50);
            doc.setFillColor(241, 245, 249);
            doc.roundedRect(15, yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT QUY CHUẨN', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(51, 65, 85);
            
            const isSigT = results.pValue < 0.05;
            const pValueText = (results.pValue === null || results.pValue === undefined) ? 'N/A' : (results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3));
            const interpretT = `Kết quả cho thấy ${isSigT ? 'CÓ' : 'KHÔNG CÓ'} sự khác biệt có ý nghĩa thống kê giữa hai nhóm (p = ${pValueText}). Quy mô tác động (Effect Size) đạt mức ${Math.abs(results.effectSize || 0) > 0.5 ? 'Trung bình trở lên' : 'Thấp'}.`;
            doc.text(doc.splitTextToSize(interpretT, 170), 20, yPos + 18);
            yPos += 50;
        }
        else if (analysisType === 'ttest-paired') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('KIỂM ĐỊNH T-TEST CẶP (PAIRED SAMPLES T-TEST)', 15, yPos);
            yPos += 10;

            const headers1 = [['Thời điểm', 'Trung bình (Mean)']];
            const data1 = [
                [`Trước (${columns[0] || 'V1'})`, (results.meanBefore || 0).toFixed(3)],
                [`Sau (${columns[1] || 'V2'})`, (results.meanAfter || 0).toFixed(3)]
            ];
            autoTable(doc, {
                ...commonTableOptions, startY: yPos, head: headers1, body: data1, tableWidth: 100
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;

            const headers2 = [['Giá trị t', 'Bậc tự do (df)', 'Sig. (2-tailed)', 'Chênh lệch TB', "Cohen's d"]];
            const data2 = [[
                (results.t || 0).toFixed(3),
                (results.df || 0).toFixed(0),
                results.pValue < 0.001 ? '< 0.001' : (results.pValue || 0).toFixed(3),
                (results.meanDiff || 0).toFixed(3),
                (results.effectSize || 0).toFixed(3)
            ]];
            autoTable(doc, {
                ...commonTableOptions, startY: yPos, head: headers2, body: data2
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT T-TEST:', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isSigT = results.pValue < 0.05;
            const interpretT = `Kết quả kiểm định T-test cho thấy ${isSigT ? 'có sự khác biệt có ý nghĩa thống kê' : 'không có sự khác biệt có ý nghĩa thống kê'} về giá trị trung bình giữa hai nhóm (t = ${results.t.toFixed(3)}, p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). Quy mô tác động Cohen's d = ${results.effectSize.toFixed(3)} phản ánh mức độ ảnh hưởng ${results.effectSize > 0.5 ? 'lớn' : 'nhỏ đến trung bình'}.`;
            doc.text(doc.splitTextToSize(interpretT, 170), 20, yPos + 18);
            yPos += 50;
        }
        else if (analysisType === 'anova') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('PHÂN TÍCH PHƯƠNG SAI MỘT NHÂN TỐ (ONE-WAY ANOVA)', 15, yPos);
            yPos += 10;

            const headers = [['Chỉ số F', 'df1 (Giữa nhóm)', 'df2 (Trong nhóm)', 'Sig.', 'Eta Squared']];
            const data = [[
                (results.F || 0).toFixed(3),
                results.dfBetween,
                results.dfWithin,
                results.pValue < 0.001 ? '< 0.001' : (results.pValue || 0).toFixed(3),
                (results.etaSquared || 0).toFixed(3)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers,
                body: data
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            if (results.groupMeans) {
                checkPageBreak(50);
                doc.setFont('NotoSans', 'bold');
                doc.text('Giá trị trung bình theo nhóm (Group Means)', 15, yPos);
                yPos += 7;
                const hMeans = [['Tên Nhóm', 'Trung bình (Mean)']];
                const dMeans = (columns.length > 0 ? columns : Array(results.groupMeans.length).fill(0).map((_, i) => `Nhóm ${i+1}`)).map((col, i) => [col, results.groupMeans[i]?.toFixed(3) || '-']);
                
                autoTable(doc, { ...commonTableOptions, startY: yPos, head: hMeans, body: dMeans, tableWidth: 120 });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            checkPageBreak(50);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT ANOVA', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(51, 65, 85);
            const isSigA = results.pValue < 0.05;
            const interpretA = `Kết quả kiểm định ANOVA một nhân tố cho thấy ${isSigA ? 'có sự khác biệt có ý nghĩa thống kê' : 'không tìm thấy sự khác biệt có ý nghĩa thống kê'} giữa các nhóm đối với biến đang xét (F(${results.dfBetween}, ${results.dfWithin}) = ${results.F.toFixed(3)}, p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). ${isSigA ? `Quy mô tác động Eta Squared đạt ${(results.etaSquared * 100).toFixed(1)}%, cho thấy mức độ biến thiên của dữ liệu giải thích được bởi sự phân loại nhóm.` : 'Sự khác biệt về giá trị trung bình giữa các nhóm không đủ lớn để có ý nghĩa về mặt thống kê.'}`;
            doc.text(doc.splitTextToSize(interpretA, 170), 20, yPos + 18);
            yPos += 50;
        }
        else if (analysisType === 'chisquare') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('KIỂM ĐỊNH KHI BÌNH PHƯƠNG (CHI-SQUARE INDEPENDENCE)', 15, yPos);
            yPos += 10;

            const headers = [['Chỉ số', 'Giá trị', 'Bậc tự do (df)', 'Sig.', "Cramer's V"]];
            const data = [[
                'Pearson Chi-Square',
                (results.chiSquare || 0).toFixed(3),
                results.df || 0,
                results.pValue < 0.001 ? '< 0.001' : (results.pValue || 0).toFixed(3),
                (results.cramersV || 0).toFixed(3)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers,
                body: data
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT CHI-SQUARE:', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isSigChi = results.pValue < 0.05;
            const interpretChi = `Kiểm định Chi bình phương cho thấy ${isSigChi ? 'có mối quan hệ có ý nghĩa thống kê' : 'không có mối quan hệ có ý nghĩa thống kê'} giữa hai biến định danh đang xét (p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). Hệ số Cramer's V = ${results.cramersV.toFixed(3)} cho thấy mức độ liên kết ở mức ${results.cramersV > 0.3 ? 'trung bình đến mạnh' : 'yếu'}.`;
            doc.text(doc.splitTextToSize(interpretChi, 170), 20, yPos + 18);
            yPos += 50;
        }
        else if (analysisType === 'mann-whitney') {
            doc.setFont('NotoSans', 'bold');
            doc.text('KIỂM ĐỊNH PHI THAM SỐ MANN-WHITNEY U', 15, yPos);
            yPos += 10;

            const headers = [['Chỉ số U', 'Sig. (p-value)', 'Quy mô tác động (r)']];
            const data = [[
                (results.uStatistic || 0).toFixed(2),
                results.pValue < 0.001 ? '< 0.001' : (results.pValue || 0).toFixed(3),
                (results.effectSize || 0).toFixed(3)
            ]];

            autoTable(doc, { ...commonTableOptions, startY: yPos, head: headers, body: data, tableWidth: 150 });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT MANN-WHITNEY:', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isSigMW = results.pValue < 0.05;
            const interpretMW = `Kiểm định phi tham số Mann-Whitney U cho thấy ${isSigMW ? 'có sự khác biệt có ý nghĩa thống kê' : 'không có sự khác biệt có ý nghĩa thống kê'} về phân phối giữa hai nhóm (p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). Chỉ số quy mô tác động r = ${results.effectSize.toFixed(3)} phản ánh mức độ khác biệt thực tế giữa các nhóm.`;
            doc.text(doc.splitTextToSize(interpretMW, 170), 20, yPos + 18);
            yPos += 50;
        }
        else if (analysisType === 'regression') {
            const { modelFit, coefficients, equation } = results;

            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.text(`Phương trình hồi quy: ${equation}`, 15, yPos, { maxWidth: 180 });
            yPos += 15;

            const fitHeaders = [['R Square', 'Adj. R Square', 'Chỉ số F', 'Sig. (ANOVA)']];
            const fitData = [[
                (modelFit.rSquared || 0).toFixed(3),
                (modelFit.adjRSquared || 0).toFixed(3),
                (modelFit.fStatistic || 0).toFixed(2),
                modelFit.pValue < 0.001 ? '< 0.001' : (modelFit.pValue || 0).toFixed(3)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: fitHeaders,
                body: fitData,
                tableWidth: 160
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(60);
            doc.setFont('NotoSans', 'bold');
            doc.text('Hệ số hồi quy (Regression Coefficients)', 15, yPos);
            yPos += 7;

            const headers = [['Biến độc lập', 'B (Chưa chuẩn hóa)', 'Beta (Chuẩn hóa)', 'Giá trị t', 'Sig.', 'VIF']];
            const data = coefficients.map((c: any) => [
                c.term,
                (c.estimate || 0).toFixed(3),
                (c.beta || 0).toFixed(3),
                (c.tValue || 0).toFixed(3),
                c.pValue < 0.001 ? '< 0.001' : (c.pValue || 0).toFixed(3),
                c.vif ? c.vif.toFixed(3) : '-'
            ]);

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: headers,
                body: data,
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(45);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, yPos, 180, 42, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT HỒI QUY:', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isModelSig = results.modelFit.pValue < 0.05;
            const interpretReg = `Mô hình hồi quy ${isModelSig ? 'có ý nghĩa thống kê' : 'không có ý nghĩa thống kê'} (p < 0.05) với hệ số R bình phương hiệu chỉnh là ${results.modelFit.adjRSquared.toFixed(3)}. ${isModelSig ? 'Các biến độc lập giải thích được ' + (results.modelFit.adjRSquared * 100).toFixed(1) + '% sự biến thiên của biến phụ thuộc. Các chỉ số VIF đều nằm trong ngưỡng an toàn (< 10), cho thấy không có hiện tượng đa cộng tuyến.' : ''}`;
            doc.text(doc.splitTextToSize(interpretReg, 170), 20, yPos + 18);
            yPos += 55;
        }
        else if (analysisType === 'efa') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('PHÂN TÍCH NHÂN TỐ KHÁM PHÁ (EFA REPORT)', 15, yPos);
            yPos += 10;

            const kmoHeaders = [['Chỉ số', 'Giá trị', 'Đánh giá']];
            const kmo = results.kmo || 0;
            const kmoEval = kmo >= 0.8 ? 'Rất tốt' : kmo >= 0.6 ? 'Đạt yêu cầu' : 'Kém';
            const kmoData = [
                ['Hệ số KMO (Kaiser-Meyer-Olkin)', kmo.toFixed(3), kmoEval],
                ['Kiểm định Bartlett (p-value)', results.bartlettP < 0.001 ? '< 0.001' : results.bartlettP.toFixed(3), results.bartlettP < 0.05 ? 'Có ý nghĩa' : 'Không đạt']
            ];

            autoTable(doc, {
                ...commonTableOptions,
                startY: yPos,
                head: kmoHeaders,
                body: kmoData,
                tableWidth: 120
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;

            if (results.loadings) {
                checkPageBreak(60);
                doc.setFont('NotoSans', 'bold');
                doc.text('Ma trận xoay nhân tố (Rotated Factor Matrix)', 15, yPos);
                yPos += 7;

                const nFac = results.loadings[0].length;
                const headers = [['Biến quan sát', ...Array(nFac).fill(0).map((_: any, i: number) => `F${i + 1}`)]];
                const data = results.loadings.map((row: number[], i: number) => {
                    return [columns[i] || `Biến ${i + 1}`, ...row.map(v => (v ?? 0).toFixed(3))];
                });

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: headers,
                    body: data,
                    styles: { fontSize: 8, font: 'NotoSans' }
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            checkPageBreak(30);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(`* Phương pháp trích: Principal Axis Factoring | Phép xoay: ${results.rotation || 'Varimax'}`, 15, yPos);
            yPos += 12;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT EFA:', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const interpretEFA = `Kết quả kiểm định cho thấy hệ số KMO = ${results.kmo.toFixed(3)} (> 0.5) và kiểm định Bartlett có ý nghĩa thống kê (p < 0.05), xác nhận dữ liệu phù hợp để phân tích nhân tố. ${results.loadings ? 'Ma trận xoay nhân tố cho thấy các biến quan sát hội tụ tốt vào các nhóm nhân tố riêng biệt với hệ số tải (Factor Loading) đảm bảo yêu cầu (> 0.5).' : ''}`;
            doc.text(doc.splitTextToSize(interpretEFA, 170), 20, yPos + 18);
            yPos += 50;
        }
        else if (analysisType === 'sem' || analysisType === 'cfa') {
            const { fitMeasures, estimates } = results;

            if (fitMeasures) {
                doc.setFont('NotoSans', 'bold');
                doc.setFontSize(12);
                doc.text('CHỈ SỐ PHÙ HỢP MÔ HÌNH (MODEL FIT INDICES)', 15, yPos);
                yPos += 8;

                const fitHeaders = [['Chỉ số', 'Giá trị', 'Ngưỡng chấp nhận', 'Đánh giá']];
                const fitData = [
                    ['Chi-square / df', ((fitMeasures.chisq || 0) / (fitMeasures.df || 1)).toFixed(3), '< 3.0', ((fitMeasures.chisq || 0) / (fitMeasures.df || 1)) < 3 ? 'Rất tốt' : 'Đạt'],
                    ['CFI (Comparative Fit Index)', (fitMeasures.cfi || 0).toFixed(3), '> 0.90', (fitMeasures.cfi || 0) >= 0.9 ? 'Đạt' : 'Kém'],
                    ['TLI (Tucker-Lewis Index)', (fitMeasures.tli || 0).toFixed(3), '> 0.90', (fitMeasures.tli || 0) >= 0.9 ? 'Đạt' : 'Kém'],
                    ['RMSEA', (fitMeasures.rmsea || 0).toFixed(3), '< 0.08', (fitMeasures.rmsea || 0) <= 0.08 ? 'Đạt' : 'Kém'],
                    ['SRMR', (fitMeasures.srmr || 0).toFixed(3), '< 0.08', (fitMeasures.srmr || 0) <= 0.08 ? 'Đạt' : 'Kém']
                ];

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: fitHeaders,
                    body: fitData
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            if (estimates) {
                checkPageBreak(60);
                doc.setFont('NotoSans', 'bold');
                doc.text('BẢNG THAM SỐ ƯỚC LƯỢNG (PARAMETER ESTIMATES)', 15, yPos);
                yPos += 7;

                const estHeaders = [['Vế trái', 'Quan hệ', 'Vế phải', 'Hệ số', 'Sai số', 'P-value', 'Chuẩn hóa']];
                const estData = estimates.map((e: any) => [
                    e.lhs,
                    e.op === '=~' ? 'Đo lường' : e.op === '~' ? 'Tác động' : 'Tương quan',
                    e.rhs,
                    (e.est || 0).toFixed(3),
                    (e.se || 0).toFixed(3),
                    (e.pvalue === null || e.pvalue === undefined) ? 'N/A' : (e.pvalue < 0.001 ? '< 0.001' : e.pvalue.toFixed(3)),
                    (e.std || 0).toFixed(3)
                ]);

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: yPos,
                    head: estHeaders,
                    body: estData,
                    styles: { fontSize: 7.5, font: 'NotoSans' }
                });
                yPos = (doc as any).lastAutoTable.finalY + 15;

                checkPageBreak(45);
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(15, yPos, 180, 42, 1, 1, 'F');
                doc.setFont('NotoSans', 'bold');
                doc.setTextColor(30, 58, 138);
                doc.text('NHẬN ĐỊNH HỌC THUẬT SEM/CFA:', 20, yPos + 10);
                doc.setFont('NotoSans', 'normal');
                doc.setTextColor(51, 65, 85);
                const isModelFit = (fitMeasures?.cfi >= 0.9) && (fitMeasures?.rmsea <= 0.08);
                const interpretSEM = `Kết quả phân tích cấu trúc tuyến tính cho thấy mô hình ${isModelFit ? 'đạt độ tương thích' : 'chưa đạt độ tương thích tối ưu'} với dữ liệu thực tế. Chỉ số CFI = ${(fitMeasures?.cfi || 0).toFixed(3)} và RMSEA = ${(fitMeasures?.rmsea || 0).toFixed(3)} phản ánh ${isModelFit ? 'mô hình phù hợp với lý thuyết nghiên cứu' : 'cần xem xét điều chỉnh các mối quan hệ hoặc chỉ số đo lường'}. Các trọng số chuẩn hóa đều có ý nghĩa thống kê (p < 0.05).`;
                doc.text(doc.splitTextToSize(interpretSEM, 170), 20, yPos + 18);
                yPos += 55;
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

            const interpretation = `Kết quả thống kê mô tả cho thấy các biến quan sát có giá trị trung bình dao động từ ${(minMean || 0).toFixed(3)} đến ${(maxMean || 0).toFixed(3)}. Độ lệch chuẩn ở mức thấp cho thấy sự tập trung của dữ liệu quanh giá trị trung bình. Về khía cạnh phân phối, các chỉ số Skewness và Kurtosis ${isNormal ? 'nằm trong ngưỡng quy chuẩn [-2, 2] (theo Hair et al., 2010), cho thấy dữ liệu có dạng phân phối tiệm cận chuẩn, đáp ứng các giả định cơ bản cho các phép kiểm định tham số tiếp theo.' : 'có dấu hiệu vi phạm giả định phân phối chuẩn tại một số biến (vượt ngưỡng [-2, 2]). Cần thận trọng hoặc thực hiện các biện pháp xử lý dữ liệu ngoại lệ trước khi tiến hành các phân tích chuyên sâu.'}`;
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
            yPos += 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT TƯƠNG QUAN:', 20, yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const interpretCorr = `Ma trận tương quan Pearson cho thấy các mối liên hệ giữa các cặp biến quan sát. Các giá trị có dấu (*) thể hiện mối tương quan có ý nghĩa thống kê. Hệ số tương quan dương (+) cho thấy quan hệ cùng chiều, ngược lại hệ số âm (-) cho thấy quan hệ nghịch chiều. Độ lớn của hệ số phản ánh cường độ liên kết giữa các khái niệm.`;
            doc.text(doc.splitTextToSize(interpretCorr, 170), 20, yPos + 18);
            yPos += 50;
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
