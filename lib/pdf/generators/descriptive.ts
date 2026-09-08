import autoTable from 'jspdf-autotable';
import { PDFContext } from '../core';

export const generateDescriptivePDF = (ctx: PDFContext) => {
    const { doc, options, commonTableOptions } = ctx;
    const { results, columns = [], analysisType, title } = options;
    
    const checkPageBreak = ctx.checkPageBreak;

if (analysisType === 'chisquare') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('KIỂM ĐỊNH KHI BÌNH PHƯƠNG (CHI-SQUARE INDEPENDENCE)', 15, ctx.yPos);
            ctx.yPos += 10;

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
                startY: ctx.yPos,
                head: headers,
                body: data
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT CHI-SQUARE:', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isSigChi = results.pValue < 0.05;
            const interpretChi = `Kiểm định Chi bình phương cho thấy ${isSigChi ? 'có mối quan hệ có ý nghĩa thống kê' : 'không có mối quan hệ có ý nghĩa thống kê'} giữa hai biến định danh đang xét (p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). Hệ số Cramer's V = ${results.cramersV.toFixed(3)} cho thấy mức độ liên kết ở mức ${results.cramersV > 0.3 ? 'trung bình đến mạnh' : 'yếu'}.`;
            doc.text(doc.splitTextToSize(interpretChi, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

if (analysisType === 'descriptive') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('BẢNG THỐNG KÊ MIÊU TẢ (DESCRIPTIVE STATISTICS SUMMARY)', 15, ctx.yPos);
            ctx.yPos += 8;

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
                    startY: ctx.yPos,
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
                ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            // Academic Interpretation
            checkPageBreak(40);
            doc.setFillColor(241, 245, 249);
            doc.setDrawColor(30, 58, 138);
            doc.setLineWidth(0.3);
            doc.roundedRect(15, ctx.yPos, 180, 45, 2, 2, 'FD');
            
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(30, 58, 138);
            doc.text("NHẬN ĐỊNH HỌC THUẬT QUY CHUẨN:", 20, ctx.yPos + 10);
            
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
            doc.text(splitInter, 20, ctx.yPos + 18);
            
            ctx.yPos += 60;
        }

if (analysisType === 'correlation') {
            doc.text('Correlation Matrix (Pearson):', 15, ctx.yPos);
            ctx.yPos += 10;
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
                startY: ctx.yPos,
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
            ctx.yPos = (doc as any).lastAutoTable.finalY + 10;
            doc.setFontSize(8);
            doc.text('* p < 0.05, ** p < 0.01 | Color: Blue = Positive, Red = Negative (intensity = strength)', 15, ctx.yPos);
            ctx.yPos += 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT TƯƠNG QUAN:', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const interpretCorr = `Ma trận tương quan Pearson cho thấy các mối liên hệ giữa các cặp biến quan sát. Các giá trị có dấu (*) thể hiện mối tương quan có ý nghĩa thống kê. Hệ số tương quan dương (+) cho thấy quan hệ cùng chiều, ngược lại hệ số âm (-) cho thấy quan hệ nghịch chiều. Độ lớn của hệ số phản ánh cường độ liên kết giữa các khái niệm.`;
            doc.text(doc.splitTextToSize(interpretCorr, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

    
};




