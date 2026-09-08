import autoTable from 'jspdf-autotable';
import { PDFContext } from '../core';

export const generateFactorPDF = (ctx: PDFContext) => {
    const { doc, options, commonTableOptions } = ctx;
    const { results, columns = [], analysisType, title } = options;
    
    const checkPageBreak = ctx.checkPageBreak;

if (analysisType === 'cluster') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('PHÂN TÍCH PHÂN CỤM (CLUSTER ANALYSIS - K-MEANS)', 15, ctx.yPos);
            ctx.yPos += 10;

            const headers = [['Cụm (Cluster)', 'Số lượng phần tử (Size)', 'Within SS']];
            const data = (results.size || []).map((s: number, i: number) => [
                `Cụm ${i + 1}`,
                s,
                (results.withinSS?.[i] || 0).toFixed(3)
            ]);

            autoTable(doc, { ...commonTableOptions, startY: ctx.yPos, head: headers, body: data, tableWidth: 140 });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
            
            doc.setFontSize(9);
            doc.text(`Tổng biến thiên nội bộ (Total Within SS): ${(results.totWithinSS || 0).toFixed(3)}`, 15, ctx.yPos);
            ctx.yPos += 7;
            doc.text(`Biến thiên giữa các cụm (Between SS): ${(results.betweensSS || 0).toFixed(3)}`, 15, ctx.yPos);
            ctx.yPos += 15;
        }

if (analysisType === 'efa') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('PHÂN TÍCH NHÂN TỐ KHÁM PHÁ (EFA REPORT)', 15, ctx.yPos);
            ctx.yPos += 10;

            const kmoHeaders = [['Chỉ số', 'Giá trị', 'Đánh giá']];
            const kmo = results.kmo || 0;
            const kmoEval = kmo >= 0.8 ? 'Rất tốt' : kmo >= 0.6 ? 'Đạt yêu cầu' : 'Kém';
            const kmoData = [
                ['Hệ số KMO (Kaiser-Meyer-Olkin)', kmo.toFixed(3), kmoEval],
                ['Kiểm định Bartlett (p-value)', results.bartlettP < 0.001 ? '< 0.001' : results.bartlettP.toFixed(3), results.bartlettP < 0.05 ? 'Có ý nghĩa' : 'Không đạt']
            ];

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: kmoHeaders,
                body: kmoData,
                tableWidth: 120
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            if (results.loadings) {
                checkPageBreak(60);
                doc.setFont('NotoSans', 'bold');
                doc.text('Ma trận xoay nhân tố (Rotated Factor Matrix)', 15, ctx.yPos);
                ctx.yPos += 7;

                const nFac = results.loadings[0].length;
                const headers = [['Biến quan sát', ...Array(nFac).fill(0).map((_: any, i: number) => `F${i + 1}`)]];
                const data = results.loadings.map((row: number[], i: number) => {
                    return [columns[i] || `Biến ${i + 1}`, ...row.map(v => (v ?? 0).toFixed(3))];
                });

                autoTable(doc, {
                    ...commonTableOptions,
                    startY: ctx.yPos,
                    head: headers,
                    body: data,
                    styles: { fontSize: 8, font: 'NotoSans' }
                });
                ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            checkPageBreak(30);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(`* Phương pháp trích: Principal Axis Factoring | Phép xoay: ${results.rotation || 'Varimax'}`, 15, ctx.yPos);
            ctx.yPos += 12;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT EFA:', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const interpretEFA = `Kết quả kiểm định cho thấy hệ số KMO = ${results.kmo.toFixed(3)} (> 0.5) và kiểm định Bartlett có ý nghĩa thống kê (p < 0.05), xác nhận dữ liệu phù hợp để phân tích nhân tố. ${results.loadings ? 'Ma trận xoay nhân tố cho thấy các biến quan sát hội tụ tốt vào các nhóm nhân tố riêng biệt với hệ số tải (Factor Loading) đảm bảo yêu cầu (> 0.5).' : ''}`;
            doc.text(doc.splitTextToSize(interpretEFA, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

if (analysisType === 'sem' || analysisType === 'cfa') {
            const { fitMeasures, estimates } = results;

            if (fitMeasures) {
                doc.setFont('NotoSans', 'bold');
                doc.setFontSize(12);
                doc.text('CHỈ SỐ PHÙ HỢP MÔ HÌNH (MODEL FIT INDICES)', 15, ctx.yPos);
                ctx.yPos += 8;

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
                    startY: ctx.yPos,
                    head: fitHeaders,
                    body: fitData
                });
                ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            if (estimates) {
                checkPageBreak(60);
                doc.setFont('NotoSans', 'bold');
                doc.text('BẢNG THAM SỐ ƯỚC LƯỢNG (PARAMETER ESTIMATES)', 15, ctx.yPos);
                ctx.yPos += 7;

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
                    startY: ctx.yPos,
                    head: estHeaders,
                    body: estData,
                    styles: { fontSize: 7.5, font: 'NotoSans' }
                });
                ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

                checkPageBreak(45);
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(15, ctx.yPos, 180, 42, 1, 1, 'F');
                doc.setFont('NotoSans', 'bold');
                doc.setTextColor(30, 58, 138);
                doc.text('NHẬN ĐỊNH HỌC THUẬT SEM/CFA:', 20, ctx.yPos + 10);
                doc.setFont('NotoSans', 'normal');
                doc.setTextColor(51, 65, 85);
                const isModelFit = (fitMeasures?.cfi >= 0.9) && (fitMeasures?.rmsea <= 0.08);
                const interpretSEM = `Kết quả phân tích cấu trúc tuyến tính cho thấy mô hình ${isModelFit ? 'đạt độ tương thích' : 'chưa đạt độ tương thích tối ưu'} với dữ liệu thực tế. Chỉ số CFI = ${(fitMeasures?.cfi || 0).toFixed(3)} và RMSEA = ${(fitMeasures?.rmsea || 0).toFixed(3)} phản ánh ${isModelFit ? 'mô hình phù hợp với lý thuyết nghiên cứu' : 'cần xem xét điều chỉnh các mối quan hệ hoặc chỉ số đo lường'}. Các trọng số chuẩn hóa đều có ý nghĩa thống kê (p < 0.05).`;
                doc.text(doc.splitTextToSize(interpretSEM, 170), 20, ctx.yPos + 18);
                ctx.yPos += 55;
            }
        }

    
};




