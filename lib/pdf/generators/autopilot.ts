import autoTable from 'jspdf-autotable';
import { PDFContext } from '../core';

export const generateAutopilotPDF = (ctx: PDFContext) => {
    const { doc, options, commonTableOptions } = ctx;
    const { results, columns = [], analysisType, title } = options;
    
    const checkPageBreak = ctx.checkPageBreak;

if (analysisType === 'auto-pilot') {
            doc.setFontSize(16);
            doc.setFont('NotoSans', 'bold');
            doc.text('BÁO CÁO PHÂN TÍCH TỰ ĐỘNG ĐA BƯỚC (AUTO-PILOT)', 15, ctx.yPos);
            ctx.yPos += 15;
            
            // 0. Mô hình nghiên cứu
            if (results.sem && results.sem.path_coefficients) {
                checkPageBreak(30);
                doc.setFontSize(14);
                doc.setFont('NotoSans', 'bold');
                doc.text('Mô hình nghiên cứu (Research Model)', 15, ctx.yPos);
                ctx.yPos += 10;
                
                doc.setFontSize(11);
                doc.setFont('NotoSans', 'normal');
                const paths: string[] = [];
                Object.entries(results.sem.path_coefficients).forEach(([to, froms]: [string, any]) => {
                    Object.entries(froms).forEach(([from, val]: [string, any]) => {
                        if (val !== 0 && from !== 'R^2' && from !== 'AdjR^2') {
                            paths.push(`${from} -> ${to}`);
                        }
                    });
                });
                
                if (paths.length > 0) {
                    doc.text('Các giả thuyết đường dẫn:', 15, ctx.yPos);
                    ctx.yPos += 6;
                    paths.forEach(p => {
                        doc.text(`• ${p}`, 20, ctx.yPos);
                        ctx.yPos += 6;
                    });
                    ctx.yPos += 5;
                }
            }

            // 1. Cronbach's Alpha
            if (results.cronbach) {
                checkPageBreak(40);
                doc.setFontSize(14);
                doc.setFont('NotoSans', 'bold');
                doc.text('Phần 1: Kiểm định Độ tin cậy thang đo (Cronbach\'s Alpha)', 15, ctx.yPos);
                ctx.yPos += 10;
                
                // 1.1 Bảng tổng hợp
                doc.setFontSize(12);
                doc.setFont('NotoSans', 'bold');
                doc.text('1.1 Bảng Tổng hợp Độ tin cậy các Thang đo', 15, ctx.yPos);
                ctx.yPos += 8;
                
                const summaryHeaders = [['Thang đo', 'Số biến', 'Cronbach\'s Alpha', 'Đánh giá', 'Biến không đạt (<0.3)']];
                const summaryData = Object.entries(results.cronbach).map(([scale, info]: [string, any]) => {
                    const res = info.data;
                    const alpha = Number(res.alpha ?? res.rawAlpha ?? 0);
                    const nItems = info.columns ? info.columns.length : 0;
                    const badItems = res.itemTotalStats
                        ? res.itemTotalStats.filter((i: any) => Number(i.correctedItemTotalCorrelation) < 0.3).map((i: any, idx: number) => info.columns[idx] || `Item ${idx+1}`)
                        : [];
                    
                    return [
                        scale,
                        String(nItems),
                        alpha.toFixed(3),
                        alpha >= 0.7 ? 'Tốt' : (alpha >= 0.6 ? 'Chấp nhận' : 'Kém'),
                        badItems.length > 0 ? badItems.join(', ') : 'Không có'
                    ];
                });
                
                autoTable(doc, {
                    ...commonTableOptions,
                    startY: ctx.yPos,
                    head: summaryHeaders,
                    body: summaryData
                });
                ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
                
                // 1.2 Chi tiết từng thang đo
                doc.setFontSize(12);
                doc.setFont('NotoSans', 'bold');
                doc.text('1.2 Phân tích Chi tiết', 15, ctx.yPos);
                ctx.yPos += 8;

                for (const [scale, info] of Object.entries(results.cronbach)) {
                    checkPageBreak(50);
                    doc.setFontSize(11);
                    doc.setFont('NotoSans', 'bold');
                    doc.text(`Thang đo: ${scale}`, 15, ctx.yPos);
                    ctx.yPos += 8;
                    
                    const res = (info as any).data;
                    
                    if (res.itemTotalStats && Array.isArray(res.itemTotalStats) && res.itemTotalStats.length > 0) {
                        const headers = [['Biến quan sát', 'Trung bình thang đo', 'Phương sai', 'Tương quan biến - tổng', 'Alpha nếu loại biến']];
                        const data = res.itemTotalStats.map((item: any, idx: number) => {
                            const corr = Number(item.correctedItemTotalCorrelation ?? 0);
                            const meanVal = Number(item.scaleMeanIfDeleted);
                            const varVal = Number(item.scaleVarianceIfDeleted);
                            return [
                                (info as any).columns[idx] || `Item ${idx+1}`,
                                isNaN(meanVal) || meanVal === 0 ? '-' : meanVal.toFixed(3),
                                isNaN(varVal) || varVal === 0 ? '-' : varVal.toFixed(3),
                                corr.toFixed(3),
                                Number(item.alphaIfItemDeleted ?? 0).toFixed(3)
                            ];
                        });
                        autoTable(doc, {
                            ...commonTableOptions,
                            startY: ctx.yPos,
                            head: headers,
                            body: data
                        });
                        ctx.yPos = (doc as any).lastAutoTable.finalY + 10;
                    }
                }
            }
            
            // 2. EFA
            if (results.efa && results.efa.data) {
                checkPageBreak(40);
                doc.setFontSize(14);
                doc.setFont('NotoSans', 'bold');
                doc.text('Phần 2: Phân tích Nhân tố Khám phá (EFA)', 15, ctx.yPos);
                ctx.yPos += 10;
                
                const efaRes = results.efa.data;
                const cols = results.efa.columns || [];
                doc.setFontSize(10);
                doc.setFont('NotoSans', 'normal');
                if (efaRes.kmo !== undefined) doc.text(`KMO Measure of Sampling Adequacy: ${Number(efaRes.kmo).toFixed(3)}`, 15, ctx.yPos);
                ctx.yPos += 7;
                if (efaRes.bartlettP !== undefined) doc.text(`Bartlett's Test of Sphericity - p-value: ${Number(efaRes.bartlettP).toFixed(4)}`, 15, ctx.yPos);
                ctx.yPos += 10;
                
                if (efaRes.loadings && efaRes.loadings.length > 0) {
                    const factors = efaRes.nFactorsUsed || efaRes.loadings[0]?.length || 0;
                    const headerRow = ['Biến quan sát'];
                    for (let i = 1; i <= factors; i++) headerRow.push(`Nhân tố ${i}`);
                    const headers = [headerRow];
                    
                    const data = efaRes.loadings.map((row: number[], idx: number) => {
                        const rowData = [cols[idx] || `Item ${idx+1}`];
                        if (Array.isArray(row)) {
                            row.forEach((v: number) => rowData.push(v === null || isNaN(v) ? '' : Number(v).toFixed(3)));
                        } else {
                            // Fallback if somehow not an array
                            for (let i = 1; i <= factors; i++) rowData.push('');
                        }
                        return rowData;
                    });
                    
                    autoTable(doc, {
                        ...commonTableOptions,
                        startY: ctx.yPos,
                        head: headers,
                        body: data
                    });
                    ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
                }
            }
            
            // 3. SEM
            if (results.sem) {
                checkPageBreak(40);
                doc.setFontSize(14);
                doc.setFont('NotoSans', 'bold');
                doc.text('Phần 3: Mô hình Cấu trúc Tuyến tính (PLS-SEM)', 15, ctx.yPos);
                ctx.yPos += 10;
                
                const semRes = results.sem;
                
                // 3.1 Construct Reliability & Validity
                if (semRes.validity && semRes.validity.cronbach) {
                    checkPageBreak(40);
                    doc.setFontSize(12);
                    doc.setFont('NotoSans', 'bold');
                    doc.text('3.1 Độ tin cậy cấu trúc & Tính hội tụ (Construct Reliability and Validity)', 15, ctx.yPos);
                    ctx.yPos += 8;
                    
                    const headers = [['Biến tiềm ẩn', 'Cronbach\'s Alpha', 'Rho_A', 'Composite Reliability', 'AVE']];
                    const data = Object.keys(semRes.validity.cronbach).map((c: string) => {
                        return [
                            c,
                            semRes.validity.cronbach[c] ? Number(semRes.validity.cronbach[c]).toFixed(3) : '-',
                            semRes.validity.rho_a && semRes.validity.rho_a[c] ? Number(semRes.validity.rho_a[c]).toFixed(3) : '-',
                            semRes.validity.composite_reliability && semRes.validity.composite_reliability[c] ? Number(semRes.validity.composite_reliability[c]).toFixed(3) : '-',
                            semRes.validity.ave && semRes.validity.ave[c] ? Number(semRes.validity.ave[c]).toFixed(3) : '-'
                        ];
                    });
                    
                    autoTable(doc, {
                        ...commonTableOptions,
                        startY: ctx.yPos,
                        head: headers,
                        body: data
                    });
                    ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
                }

                // 3.2 Discriminant Validity (HTMT)
                if (semRes.htmt && Object.keys(semRes.htmt).length > 0) {
                    checkPageBreak(40);
                    doc.setFontSize(12);
                    doc.setFont('NotoSans', 'bold');
                    doc.text('3.2 Tính phân biệt (Discriminant Validity - HTMT)', 15, ctx.yPos);
                    ctx.yPos += 8;
                    
                    const cols = Object.keys(semRes.htmt);
                    const rows = Object.keys(semRes.htmt[cols[0]] || {});
                    
                    const headers = [['-', ...cols]];
                    const data = rows.map((rowName) => {
                        const rowData = [rowName];
                        cols.forEach(colName => {
                            const val = semRes.htmt[colName][rowName];
                            rowData.push((val === undefined || val === null) ? '-' : Number(val).toFixed(3));
                        });
                        return rowData;
                    });
                    
                    autoTable(doc, {
                        ...commonTableOptions,
                        startY: ctx.yPos,
                        head: headers,
                        body: data
                    });
                    ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
                }

                // 3.3 Collinearity Assessment (VIF)
                if (semRes.vif && semRes.vif.vif_values) {
                    checkPageBreak(40);
                    doc.setFontSize(12);
                    doc.setFont('NotoSans', 'bold');
                    doc.text('3.3 Đánh giá Đa cộng tuyến (VIF)', 15, ctx.yPos);
                    ctx.yPos += 8;
                    
                    const headers = [['Construct / Item', 'VIF Value', 'Đánh giá']];
                    const data = Object.keys(semRes.vif.vif_values).map((key: string) => {
                        const val = semRes.vif.vif_values[key];
                        const isGood = val < 5;
                        const isIdeal = val < 3;
                        return [
                            key,
                            Number(val).toFixed(3),
                            isIdeal ? 'Rất tốt (< 3)' : (isGood ? 'Chấp nhận (< 5)' : 'Có vấn đề (> 5)')
                        ];
                    });
                    
                    autoTable(doc, {
                        ...commonTableOptions,
                        startY: ctx.yPos,
                        head: headers,
                        body: data
                    });
                    ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
                }
                
                // 3.4 Path Significance & Bootstrapping
                if (semRes.bootstrapping && semRes.bootstrapping.boot_paths) {
                    checkPageBreak(40);
                    doc.setFontSize(12);
                    doc.setFont('NotoSans', 'bold');
                    doc.text('3.4 Kiểm định giả thuyết (Path Significance - Bootstrapping)', 15, ctx.yPos);
                    ctx.yPos += 8;
                    
                    const bootPaths = semRes.bootstrapping.boot_paths;
                    const headers = [['Đường dẫn (Path)', 'Hệ số (Beta)', 'T-Stat', 'P-Value', 'Kết luận']];
                    const data = Object.keys(bootPaths['Original Est.'] || {}).map((path: string) => {
                        const orig = bootPaths['Original Est.'][path];
                        const tStat = bootPaths['T Stat.'][path];
                        
                        let pVal = bootPaths['P Value'] ? bootPaths['P Value'][path] : null;
                        if (pVal === null || pVal === undefined) {
                            pVal = Math.abs(tStat) > 3.29 ? 0.001 : (Math.abs(tStat) > 2.58 ? 0.01 : (Math.abs(tStat) > 1.96 ? 0.049 : 0.1));
                        }
                        const isSig = pVal < 0.05;
                        
                        return [
                            path,
                            Number(orig).toFixed(3),
                            Number(tStat).toFixed(3),
                            pVal < 0.001 ? '< 0.001' : Number(pVal).toFixed(3),
                            isSig ? 'Chấp nhận (Supported)' : 'Bác bỏ (Rejected)'
                        ];
                    });
                    
                    autoTable(doc, {
                        ...commonTableOptions,
                        startY: ctx.yPos,
                        head: headers,
                        body: data
                    });
                    ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
                } else if (semRes.path_coefficients) {
                    // Fallback to basic paths if bootstrapping is missing
                    checkPageBreak(40);
                    doc.setFontSize(12);
                    doc.setFont('NotoSans', 'bold');
                    doc.text('3.4 Hệ số tác động (Path Coefficients)', 15, ctx.yPos);
                    ctx.yPos += 8;
                    
                    const headers = [['Đường dẫn (Path)', 'Hệ số (Beta)', 'Đánh giá']];
                    const data: any[] = [];
                    Object.entries(semRes.path_coefficients || {}).forEach(([to, froms]: [string, any]) => {
                        Object.entries(froms || {}).forEach(([from, val]: [string, any]) => {
                            if (val !== 0 && from !== 'R^2' && from !== 'AdjR^2') {
                                data.push([
                                    `${from} -> ${to}`,
                                    Number(val).toFixed(3),
                                    val > 0 ? 'Tác động thuận' : 'Tác động nghịch'
                                ]);
                            }
                        });
                    });
                    
                    if (data.length > 0) {
                        autoTable(doc, {
                            ...commonTableOptions,
                            startY: ctx.yPos,
                            head: headers,
                            body: data
                        });
                        ctx.yPos = (doc as any).lastAutoTable.finalY + 15;
                    }
                }
            }
        }

    
};




