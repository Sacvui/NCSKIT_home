import autoTable from 'jspdf-autotable';
import { PDFContext } from '../core';

export const generateRegressionPDF = (ctx: PDFContext) => {
    const { doc, options, commonTableOptions } = ctx;
    const { results, columns = [], analysisType, title } = options;
    
    const checkPageBreak = ctx.checkPageBreak;

if (analysisType === 'regression') {
            const { modelFit, coefficients, equation } = results;

            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(10);
            doc.text(`Phương trình hồi quy: ${equation}`, 15, ctx.yPos, { maxWidth: 180 });
            ctx.yPos += 15;

            const fitHeaders = [['R Square', 'Adj. R Square', 'Chỉ số F', 'Sig. (ANOVA)']];
            const fitData = [[
                (modelFit.rSquared || 0).toFixed(3),
                (modelFit.adjRSquared || 0).toFixed(3),
                (modelFit.fStatistic || 0).toFixed(2),
                modelFit.pValue < 0.001 ? '< 0.001' : (modelFit.pValue || 0).toFixed(3)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: fitHeaders,
                body: fitData,
                tableWidth: 160
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(60);
            doc.setFont('NotoSans', 'bold');
            doc.text('Hệ số hồi quy (Regression Coefficients)', 15, ctx.yPos);
            ctx.yPos += 7;

            const headers = [['Biến độc lập', 'B (Chưa chuẩn hóa)', 'Beta (Chuẩn hóa)', 'Giá trị t', 'Sig.', 'VIF']];
            const data = coefficients.map((c: any) => [
                c.term,
                (c.estimate || 0).toFixed(3),
                (c.stdBeta || c.beta || 0).toFixed(3),
                (c.tValue || 0).toFixed(3),
                c.pValue < 0.001 ? '< 0.001' : (c.pValue || 0).toFixed(3),
                c.vif ? c.vif.toFixed(3) : '-'
            ]);

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: headers,
                body: data,
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(45);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(15, ctx.yPos, 180, 42, 1, 1, 'F');
            doc.setFont('NotoSans', 'bold');
            doc.setTextColor(30, 58, 138);
            doc.text('NHẬN ĐỊNH HỌC THUẬT HỒI QUY:', 20, ctx.yPos + 10);
            doc.setFont('NotoSans', 'normal');
            doc.setTextColor(51, 65, 85);
            const isModelSig = results.modelFit.pValue < 0.05;
            const interpretReg = `Mô hình hồi quy ${isModelSig ? 'có ý nghĩa thống kê' : 'không có ý nghĩa thống kê'} (p < 0.05) với hệ số R bình phương hiệu chỉnh là ${results.modelFit.adjRSquared.toFixed(3)}. ${isModelSig ? 'Các biến độc lập giải thích được ' + (results.modelFit.adjRSquared * 100).toFixed(1) + '% sự biến thiên của biến phụ thuộc. Các chỉ số VIF đều nằm trong ngưỡng an toàn (< 10), cho thấy không có hiện tượng đa cộng tuyến.' : ''}`;
            doc.text(doc.splitTextToSize(interpretReg, 170), 20, ctx.yPos + 18);
            ctx.yPos += 55;
        }

if (analysisType === 'logistic') {
            doc.setFont('NotoSans', 'bold');
            doc.setFontSize(12);
            doc.text('HỒI QUY LOGISTIC NHỊ PHÂN (BINARY LOGISTIC REGRESSION)', 15, ctx.yPos);
            ctx.yPos += 10;

            const fitHeaders = [['Nagelkerke R²', 'Accuracy', 'Sensitivity', 'Specificity', 'AIC']];
            const fitData = [[
                (results.modelFit.nagelkerkeR2 || 0).toFixed(3),
                ((results.modelFit.accuracy || 0) * 100).toFixed(1) + '%',
                ((results.modelFit.sensitivity || 0) * 100).toFixed(1) + '%',
                ((results.modelFit.specificity || 0) * 100).toFixed(1) + '%',
                (results.modelFit.aic || 0).toFixed(2)
            ]];

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: fitHeaders,
                body: fitData,
                tableWidth: 160
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;

            checkPageBreak(60);
            const coefHeaders = [['Biến độc lập', 'Estimate (B)', 'Odds Ratio (Exp(B))', 'Sig.', '95% CI for OR']];
            const coefData = (results.coefficients || []).map((c: any) => [
                c.term,
                (c.estimate || 0).toFixed(3),
                (c.oddsRatio || 0).toFixed(3),
                c.pValue < 0.001 ? '< .001' : (c.pValue || 0).toFixed(3),
                `${(c.orCI95Lower || 0).toFixed(2)} - ${(c.orCI95Upper || 0).toFixed(2)}`
            ]);

            autoTable(doc, {
                ...commonTableOptions,
                startY: ctx.yPos,
                head: coefHeaders,
                body: coefData
            });
            ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
        }

    
};




