import autoTable from 'jspdf-autotable';
import { PDFContext } from '../core';

export const generateComparisonPDF = (ctx: PDFContext) => {
    const { doc, options, commonTableOptions } = ctx;
    const { results, columns = [], analysisType, title } = options;
    
    const checkPageBreak = ctx.checkPageBreak;

if (analysisType === 'ttest-indep' || analysisType === 'ttest') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('KIỂM ĐỊNH T-TEST ĐỘC LẬP (INDEPENDENT SAMPLES T-TEST)', 15, ctx.yPos);
            ctx.yPos += 10;

            const headers1 = [['Nhóm', 'Trung bình (Mean)', 'Độ lệch chuẩn (SD)', 'Kích thước mẫu (N)']];
            const data1 = [
                ['Nhóm 1', (results.mean1 || 0).toFixed(3), '-', '-'],
                ['Nhóm 2', (results.mean2 || 0).toFixed(3), '-', '-']
            ];

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: headers1,
                body: data1,
                tableWidth: 140
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 10;

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
                startY: ctx.yPos,
                head: headers2,
                body: data2,
                headStyles: { fillColor: [30, 58, 138] as any, textColor: [255, 255, 255] as any }
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(50);
            doc.setFillColor(241, 245, 249);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT QUY CHUẨN', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(51, 65, 85);
            
            const isSigT = results.pValue < 0.05;
            const pValueText = (results.pValue === null || results.pValue === undefined) ? 'N/A' : (results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3));
            const interpretT = `Kết quả cho thấy ${isSigT ? 'CÓ' : 'KHÔNG CÓ'} sự khác biệt có ý nghĩa thống kê giữa hai nhóm (p = ${pValueText}). Quy mô tác động (Effect Size) đạt mức ${Math.abs(results.effectSize || 0) > 0.5 ? 'Trung bình trở lên' : 'Thấp'}.`;
            doc.text(doc.splitTextToSize(interpretT, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

if (analysisType === 'ttest-paired') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('KIỂM ĐỊNH T-TEST CẶP (PAIRED SAMPLES T-TEST)', 15, ctx.yPos);
            ctx.yPos += 10;

            const headers1 = [['Thời điểm', 'Trung bình (Mean)']];
            const data1 = [
                [`Trước (${columns[0] || 'V1'})`, (results.meanBefore || 0).toFixed(3)],
                [`Sau (${columns[1] || 'V2'})`, (results.meanAfter || 0).toFixed(3)]
            ];
            autoTable(doc, {
                ...commonTableOptions, startY: ctx.yPos, head: headers1, body: data1, tableWidth: 100
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 10;

            const headers2 = [['Giá trị t', 'Bậc tự do (df)', 'Sig. (2-tailed)', 'Chênh lệch TB', "Cohen's d"]];
            const data2 = [[
                (results.t || 0).toFixed(3),
                (results.df || 0).toFixed(0),
                results.pValue < 0.001 ? '< 0.001' : (results.pValue || 0).toFixed(3),
                (results.meanDiff || 0).toFixed(3),
                (results.effectSize || 0).toFixed(3)
            ]];
            autoTable(doc, {
                ...commonTableOptions, startY: ctx.yPos, head: headers2, body: data2
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT T-TEST:', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isSigT = results.pValue < 0.05;
            const interpretT = `Kết quả kiểm định T-test cho thấy ${isSigT ? 'có sự khác biệt có ý nghĩa thống kê' : 'không có sự khác biệt có ý nghĩa thống kê'} về giá trị trung bình giữa hai nhóm (t = ${results.t.toFixed(3)}, p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). Quy mô tác động Cohen's d = ${results.effectSize.toFixed(3)} phản ánh mức độ ảnh hưởng ${results.effectSize > 0.5 ? 'lớn' : 'nhỏ đến trung bình'}.`;
            doc.text(doc.splitTextToSize(interpretT, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

if (analysisType === 'anova') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('PHÂN TÍCH PHƯƠNG SAI MỘT NHÂN TỐ (ONE-WAY ANOVA)', 15, ctx.yPos);
            ctx.yPos += 10;

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
                startY: ctx.yPos,
                head: headers,
                body: data
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            if (results.groupMeans) {
                checkPageBreak(50);
                doc.setFont('NotoSans', 'bold');
                doc.text('Giá trị trung bình theo nhóm (Group Means)', 15, ctx.yPos);
                ctx.yPos += 7;
                const hMeans = [['Tên Nhóm', 'Trung bình (Mean)']];
                const dMeans = (columns.length > 0 ? columns : Array(results.groupMeans.length).fill(0).map((_, i) => `Nhóm ${i+1}`)).map((col, i) => [col, results.groupMeans[i]?.toFixed(3) || '-']);
                
                autoTable(doc, { ...commonTableOptions, startY: ctx.yPos, head: hMeans, body: dMeans, tableWidth: 120 });
                ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
            }

            checkPageBreak(50);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT ANOVA', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(51, 65, 85);
            const isSigA = results.pValue < 0.05;
            const interpretA = `Kết quả kiểm định ANOVA một nhân tố cho thấy ${isSigA ? 'có sự khác biệt có ý nghĩa thống kê' : 'không tìm thấy sự khác biệt có ý nghĩa thống kê'} giữa các nhóm đối với biến đang xét (F(${results.dfBetween}, ${results.dfWithin}) = ${results.F.toFixed(3)}, p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). ${isSigA ? `Quy mô tác động Eta Squared đạt ${(results.etaSquared * 100).toFixed(1)}%, cho thấy mức độ biến thiên của dữ liệu giải thích được bởi sự phân loại nhóm.` : 'Sự khác biệt về giá trị trung bình giữa các nhóm không đủ lớn để có ý nghĩa về mặt thống kê.'}`;
            doc.text(doc.splitTextToSize(interpretA, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

if (analysisType === 'mann-whitney') {
            doc.setFont('NotoSans', 'bold');
            doc.text('KIỂM ĐỊNH PHI THAM SỐ MANN-WHITNEY U', 15, ctx.yPos);
            ctx.yPos += 10;

            const headers = [['Chỉ số U', 'Sig. (p-value)', 'Quy mô tác động (r)']];
            const data = [[
                (results.uStatistic || 0).toFixed(2),
                results.pValue < 0.001 ? '< 0.001' : (results.pValue || 0).toFixed(3),
                (results.effectSize || 0).toFixed(3)
            ]];

            autoTable(doc, { ...commonTableOptions, startY: ctx.yPos, head: headers, body: data, tableWidth: 150 });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(40);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT MANN-WHITNEY:', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isSigMW = results.pValue < 0.05;
            const interpretMW = `Kiểm định phi tham số Mann-Whitney U cho thấy ${isSigMW ? 'có sự khác biệt có ý nghĩa thống kê' : 'không có sự khác biệt có ý nghĩa thống kê'} về phân phối giữa hai nhóm (p = ${results.pValue < 0.001 ? '< 0.001' : results.pValue.toFixed(3)}). Chỉ số quy mô tác động r = ${results.effectSize.toFixed(3)} phản ánh mức độ khác biệt thực tế giữa các nhóm.`;
            doc.text(doc.splitTextToSize(interpretMW, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

if (analysisType === 'twoway-anova') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('PHÂN TÍCH PHƯƠNG SAI HAI NHÂN TỐ (TWO-WAY ANOVA)', 15, ctx.yPos);
            ctx.yPos += 10;

            const headers = [['Nguồn tác động', 'df', 'Sum of Squares', 'F-value', 'Sig. (p)', 'Partial η²']];
            const data = (results.table || []).map((row: any) => {
                const isResiduals = row.source.toLowerCase().includes('residuals') || row.source.toLowerCase().includes('sai so');
                return [
                    row.source,
                    row.df,
                    (row.ss || 0).toFixed(3),
                    !isResiduals ? (row.f || 0).toFixed(3) : '-',
                    !isResiduals ? (row.p < 0.001 ? '< .001' : (row.p || 0).toFixed(4)) : '-',
                    !isResiduals ? (row.etaPartial || 0).toFixed(3) : '-'
                ];
            });

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: headers,
                body: data,
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(50);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 40, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT TWO-WAY ANOVA:', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            
            const table = results.table || [];
            const sigEffects = table.filter((r: any) => r.p < 0.05 && !r.source.toLowerCase().includes('residual'));
            const interpret2Way = `Kết quả phân tích phương sai hai nhân tố cho thấy có ${sigEffects.length} nguồn tác động có ý nghĩa thống kê (p < 0.05). ${sigEffects.length > 0 ? 'Điều này chỉ ra rằng các yếu tố đầu vào hoặc sự tương tác giữa chúng ảnh hưởng đáng kể đến biến phụ thuộc.' : 'Không tìm thấy sự khác biệt có ý nghĩa thống kê từ các nhân tố chính cũng như tương tác giữa chúng.'}`;
            doc.text(doc.splitTextToSize(interpret2Way, 170), 20, ctx.yPos + 18);
            ctx.yPos += 50;
        }

if (analysisType === 'kruskal-wallis') {
            doc.setFont('NotoSans', 'bold');
            doc.text('KIỂM ĐỊNH PHI THAM SỐ KRUSKAL-WALLIS H', 15, ctx.yPos);
            ctx.yPos += 10;

            const headers = [['Chi-squared', 'df', 'Sig. (p-value)', 'Quy mô tác động (Epsilon²)']];
            const data = [[
                (results.statistic || 0).toFixed(3),
                results.df || 0,
                results.pValue < 0.001 ? '< .001' : (results.pValue || 0).toFixed(3),
                (results.epsilonSquared || 0).toFixed(3)
            ]];

            autoTable(doc, { ...commonTableOptions, startY: ctx.yPos, head: headers, body: data, tableWidth: 160 });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
        }

if (analysisType === 'wilcoxon') {
            doc.setFont('NotoSans', 'bold');
            doc.text('KIỂM ĐỊNH PHI THAM SỐ WILCOXON SIGNED-RANK', 15, ctx.yPos);
            ctx.yPos += 10;

            const headers = [['Giá trị W', 'Sig. (p-value)', 'Quy mô tác động (r)']];
            const data = [[
                (results.statistic || 0).toFixed(1),
                results.pValue < 0.001 ? '< .001' : (results.pValue || 0).toFixed(3),
                (results.effectSize || 0).toFixed(3)
            ]];

            autoTable(doc, { ...commonTableOptions, startY: ctx.yPos, head: headers, body: data, tableWidth: 140 });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
        }

    
};




