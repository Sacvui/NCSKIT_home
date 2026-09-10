export const STATIC_ARTICLES = [
    {
        slug: 'scenario-pls-sem',
        category: ['Research Scenarios', 'Structural Modeling'],
        icon_name: 'Network',
        title_vi: 'Kịch bản 1: Mô hình Cấu trúc Tuyến tính PLS-SEM',
        title_en: 'Scenario 1: Partial Least Squares SEM',
        description_vi: 'Hướng dẫn phân tích PLS-SEM chuyên sâu. Giải pháp tối ưu cho cỡ mẫu nhỏ, dữ liệu không phân phối chuẩn và mô hình nghiên cứu phức tạp.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Tổng quan về phương pháp</h3>
                    <p class="mb-4">Trong thực hành phân tích số liệu luận văn, <strong>PLS-SEM (Partial Least Squares Structural Equation Modeling)</strong> đang dần thay thế các phương pháp truyền thống nhờ khả năng giải quyết các mô hình cấu trúc phức tạp. Bản chất của thuật toán PLS-SEM là tối đa hóa phương sai được giải thích (R²) của các cấu trúc nội sinh.</p>
                    <div class="bg-white p-4 rounded-xl border border-indigo-100 mt-4 text-sm">
                        <h4 class="font-bold text-indigo-800 mb-2">Điều kiện áp dụng PLS-SEM:</h4>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Mục tiêu cốt lõi của nghiên cứu là <strong>dự báo</strong> hành vi hoặc xác định các nhân tố tác động trọng yếu (Key Drivers).</li>
                            <li>Dữ liệu thu thập thực tế vi phạm giả định phân phối chuẩn (Non-normal data).</li>
                            <li>Cỡ mẫu khảo sát nhỏ, không đủ đáp ứng quy tắc khắt khe của AMOS/CB-SEM.</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Hướng dẫn đọc kết quả SmartPLS</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Đánh giá Mô hình Đo lường</h4>
                            <ul class="space-y-3 text-sm">
                                <li><span class="font-bold text-blue-600">Hệ số tải ngoài:</span> Cần đạt mức ≥ 0.708.</li>
                                <li><span class="font-bold text-blue-600">Độ tin cậy cấu trúc:</span> Composite Reliability (CR) cần nằm trong khoảng <strong>0.70 - 0.90</strong>.</li>
                                <li><span class="font-bold text-blue-600">Tính hội tụ:</span> Hệ số AVE phải ≥ 0.50.</li>
                                <li><span class="font-bold text-blue-600">Tính phân biệt:</span> Tỷ số <strong>HTMT cần < 0.85</strong>.</li>
                            </ul>
                        </div>
                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Đánh giá Mô hình Cấu trúc</h4>
                            <ul class="space-y-3 text-sm">
                                <li><span class="font-bold text-teal-600">Đa cộng tuyến (VIF):</span> Giá trị VIF nội bộ phải < 3.0.</li>
                                <li><span class="font-bold text-teal-600">Kiểm định giả thuyết:</span> Chạy Bootstrapping. Giả thuyết được chấp nhận khi P-value < 0.05.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
                    <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                    <p>Hair, J. F., Risher, J. J., Sarstedt, M., & Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review</em>, 31(1), 2-24.</p>
                </div>
            </div>`
    },
    {
        slug: 'scenario-cb-sem',
        category: ['Research Scenarios', 'Structural Modeling'],
        icon_name: 'Layers',
        title_vi: 'Kịch bản 2: Mô hình Cấu trúc Hiệp phương sai CB-SEM',
        title_en: 'Scenario 2: Covariance-Based SEM',
        description_vi: 'Hướng dẫn phân tích CFA và SEM bằng AMOS. Phương pháp luận chuẩn mực để kiểm định sự phù hợp của lý thuyết nghiên cứu.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Tổng quan về mô hình CB-SEM</h3>
                    <p class="mb-4">Khác với mô hình PLS tập trung vào dự báo, <strong>CB-SEM</strong> được thiết kế chuyên biệt để <strong>Khẳng định lý thuyết (Theory Confirmation)</strong>. Khi sử dụng các dịch vụ chạy AMOS, thuật toán Maximum Likelihood (ML) sẽ tính toán khoảng cách chênh lệch giữa ma trận hiệp phương sai của dữ liệu thu thập thực tế và ma trận hiệp phương sai lý thuyết.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Quy trình thực hiện Phân tích CFA bằng AMOS</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                        <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Bước 1: Phân Tích Nhân Tố Khẳng Định (CFA)</h4>
                        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                            <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>CMIN/df:</strong> Phải < 3.0 (Tốt), có thể chấp nhận < 5.0.</li>
                            <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>CFI & TLI:</strong> Cần ≥ 0.90 (Ưu tiên > 0.95).</li>
                            <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>RMSEA:</strong> Yêu cầu < 0.08.</li>
                        </ul>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Bước 2: Phân Tích Mô Hình Cấu Trúc (SEM)</h4>
                        <ul class="list-disc pl-5 space-y-2 text-sm">
                            <li>Sử dụng <strong>Beta chuẩn hóa</strong> để xác định biến độc lập có tác động mạnh nhất.</li>
                            <li>Đánh giá <strong>P-value</strong> (hiển thị là ***). Nếu P-value < 0.05, giả thuyết được chấp nhận.</li>
                        </ul>
                    </div>
                </div>
                <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
                    <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                    <p>Kline, R. B. (2015). <em>Principles and practice of structural equation modeling</em> (4th ed.). Guilford publications.</p>
                </div>
            </div>`
    },
    {
        slug: 'scenario-regression',
        category: ['Research Scenarios', 'Impact Analysis'],
        icon_name: 'LineChart',
        title_vi: 'Kịch bản 3: Hồi quy Tuyến tính Đa biến (OLS)',
        title_en: 'Scenario 3: Multiple Linear Regression (OLS)',
        description_vi: 'Quy trình hồi quy đa biến trên SPSS. Hướng dẫn cách đọc hệ số Beta, R-square và cách khắc phục đa cộng tuyến hiệu quả.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> 1. Bản chất của mô hình Hồi quy Đa biến</h3>
                    <p class="mb-3"><strong>Hồi quy Tuyến tính Đa biến (Multiple Regression)</strong> là phương pháp cốt lõi nhất khi thực hiện phân tích số liệu trên SPSS. Mục tiêu là đo lường mức độ tác động của các biến độc lập (X) lên một biến phụ thuộc (Y).</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Các bước đọc kết quả phân tích hồi quy SPSS</h3>
                    <div class="space-y-4">
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                            <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 1</div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">Đánh giá độ phù hợp của mô hình (ANOVA & R Square)</h4>
                                <p class="text-sm mt-2"><strong>Sig. kiểm định F:</strong> Bắt buộc phải < 0.05. <br/><strong>R bình phương hiệu chỉnh:</strong> % sự biến thiên của biến phụ thuộc được giải thích bởi mô hình.</p>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                            <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 2</div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">Diễn giải hệ số Beta và Đa cộng tuyến</h4>
                                <p class="text-sm mt-2">Biến độc lập nào có <strong>Sig. < 0.05</strong> thì biến đó mới có tác động ý nghĩa thống kê. Khắc phục đa cộng tuyến: Giá trị <strong>VIF</strong> phải < 10 (tốt nhất là < 3).</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
                    <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                    <p>Field, A. (2013). <em>Discovering statistics using IBM SPSS statistics</em> (4th ed.). Sage publications.</p>
                </div>
            </div>`
    },
    {
        slug: 'scenario-logistic',
        category: ['Research Scenarios', 'Impact Analysis'],
        icon_name: 'Binary',
        title_vi: 'Kịch bản 4: Hồi quy Logistic Nhị phân',
        title_en: 'Scenario 4: Binary Logistic Regression',
        description_vi: 'Áp dụng hồi quy logistic nhị phân trên SPSS để dự báo xác suất và ra quyết định. Phân tích tác động thông qua hệ số Odds Ratio.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Đặc điểm của Hồi quy Logistic Nhị phân</h3>
                    <p class="mb-4">Hồi quy Logistic không dự báo trực tiếp giá trị của biến phụ thuộc, mà dự báo <strong>Xác suất (Probability)</strong> xảy ra sự kiện đó (ví dụ: Mua hay Không mua).</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Đọc hệ số Odds Ratio (Exp(B))</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ul class="space-y-3 text-sm">
                            <li><span class="font-bold text-teal-600">Exp(B) > 1:</span> Tác động thuận chiều. Khả năng xảy ra sự kiện Y=1 sẽ tăng gấp Exp(B) lần khi X tăng.</li>
                            <li><span class="font-bold text-teal-600">Exp(B) < 1:</span> Tác động ngược chiều.</li>
                        </ul>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'scenario-compare',
        category: ['Research Scenarios', 'Comparative Analysis'],
        icon_name: 'GitCompare',
        title_vi: 'Kịch bản 5: So sánh Khác biệt (T-test & ANOVA)',
        title_en: 'Scenario 5: Mean Differences (T-test & ANOVA)',
        description_vi: 'Hướng dẫn kiểm định Independent T-test và One-way ANOVA trên SPSS. Phương pháp phân tích sự khác biệt trung bình.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Phương pháp Kiểm định Khác biệt Nhóm</h3>
                    <p class="mb-4">Sử dụng <strong>Independent T-Test</strong> cho 2 nhóm (Nam/Nữ) và <strong>ANOVA</strong> cho 3 nhóm trở lên (Độ tuổi).</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Hướng dẫn đọc kết quả</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ul class="space-y-3 text-sm">
                            <li><strong>Levene's Test:</strong> Kiểm tra phương sai đồng nhất.</li>
                            <li><strong>Sig. T-test / ANOVA:</strong> Nếu < 0.05, có sự khác biệt có ý nghĩa thống kê giữa các nhóm.</li>
                        </ul>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'scenario-scale',
        category: ['Research Scenarios', 'Measurement Validation'],
        icon_name: 'Target',
        title_vi: 'Kịch bản 6: Thẩm định Thang đo (Cronbach\'s Alpha & EFA)',
        title_en: 'Scenario 6: Scale Validation (Cronbach\'s Alpha & EFA)',
        description_vi: 'Hướng dẫn chạy kiểm định độ tin cậy thang đo Cronbach Alpha và phân tích nhân tố khám phá EFA.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Quy tắc đọc kết quả (Rules of Thumb)</h3>
                    <p class="mb-4">Đánh giá mô hình đo lường là bước đi đầu tiên trong mọi luận văn định lượng.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Cronbach's Alpha</h4>
                        <ul class="space-y-3 text-sm">
                            <li><strong>Hệ số tổng:</strong> > 0.70.</li>
                            <li><strong>Tương quan biến - tổng:</strong> > 0.30 (Nếu < 0.30 phải loại bỏ biến).</li>
                        </ul>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">EFA</h4>
                        <ul class="space-y-3 text-sm">
                            <li><strong>KMO:</strong> > 0.50.</li>
                            <li><strong>Tổng phương sai trích:</strong> > 50%.</li>
                            <li><strong>Hệ số tải nhân tố:</strong> > 0.50.</li>
                        </ul>
                    </div>
                </div>
            </div>`
    },

    // ==========================================
    // THEORIES SECTION
    // ==========================================
    {
        slug: 'technology-acceptance-model-tam',
        category: ['Theories', 'Information Systems'],
        icon_name: 'MonitorSmartphone',
        title_vi: 'Mô hình Chấp nhận Công nghệ (TAM)',
        title_en: 'Technology Acceptance Model (TAM)',
        description_vi: 'Mô hình kinh điển trong nghiên cứu hành vi ứng dụng công nghệ thông tin. Lý thuyết cốt lõi để vẽ mô hình TAM trong luận văn thạc sĩ.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Nguồn gốc Lý thuyết TAM</h3>
                    <p class="mb-4">Mô hình <strong>Chấp nhận Công nghệ (TAM - Technology Acceptance Model)</strong> do Fred Davis đề xuất vào năm 1989 là một trong những khung lý thuyết có tầm ảnh hưởng lớn nhất trên toàn cầu khi nghiên cứu về hành vi ứng dụng Công nghệ Thông tin (CNTT).</p>
                    <p>Trong thời đại chuyển đổi số hiện nay, các sinh viên làm luận văn thạc sĩ thường xuyên sử dụng TAM để giải thích lý do tại sao người dùng (khách hàng, nhân viên) lại chấp nhận hoặc từ chối sử dụng một hệ thống phần mềm, ứng dụng di động, hoặc công nghệ AI mới.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Cấu trúc Nhân tố cốt lõi của TAM</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                        <ul class="space-y-4 text-sm">
                            <li class="bg-slate-50 p-4 rounded-lg border border-slate-100"><strong>Nhận thức sự hữu ích (Perceived Usefulness - PU):</strong> Mức độ mà một cá nhân tin rằng việc sử dụng một hệ thống cụ thể sẽ nâng cao hiệu suất làm việc của họ. Đây là nhân tố dự báo mạnh mẽ nhất cho Ý định sử dụng.</li>
                            <li class="bg-slate-50 p-4 rounded-lg border border-slate-100"><strong>Nhận thức tính dễ sử dụng (Perceived Ease of Use - PEOU):</strong> Mức độ mà cá nhân tin rằng việc sử dụng hệ thống sẽ không tốn nhiều nỗ lực học hỏi. PEOU có tác động trực tiếp đến PU.</li>
                            <li class="bg-slate-50 p-4 rounded-lg border border-slate-100"><strong>Ý định hành vi (Behavioral Intention - BI):</strong> Quyết định chủ quan của người dùng về việc sẽ sử dụng công nghệ trong tương lai.</li>
                        </ul>
                    </div>
                </div>
                <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
                    <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                    <p>Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. <em>MIS quarterly</em>, 319-340.</p>
                </div>
            </div>`
    },
    {
        slug: 'theory-of-planned-behavior-tpb',
        category: ['Theories', 'Psychology'],
        icon_name: 'Brain',
        title_vi: 'Thuyết Hành vi Dự định (TPB)',
        title_en: 'Theory of Planned Behavior (TPB)',
        description_vi: 'Thuyết Hành vi Dự định (TPB) giải thích ý định thực hiện hành vi thông qua 3 yếu tố: Thái độ, Chuẩn chủ quan và Nhận thức kiểm soát hành vi.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Khái quát về Mô hình nghiên cứu TPB</h3>
                    <p class="mb-4"><strong>Thuyết Hành vi Dự định (Theory of Planned Behavior - TPB)</strong> được Icek Ajzen phát triển (1991) là bản nâng cấp từ Thuyết Hành động Hợp lý (TRA). TPB được giới nghiên cứu học thuật đánh giá cao vì nó đã bổ sung thêm nhân tố "Nhận thức kiểm soát hành vi" để khắc phục điểm yếu của TRA trong việc giải thích những hành vi mà con người không hoàn toàn có khả năng kiểm soát chủ động.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Ba trụ cột của TPB</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ul class="space-y-4 text-sm">
                            <li class="p-3 border-b"><strong>Thái độ đối với hành vi (Attitude):</strong> Đánh giá tích cực hoặc tiêu cực của cá nhân đối với việc thực hiện hành vi.</li>
                            <li class="p-3 border-b"><strong>Chuẩn chủ quan (Subjective Norm):</strong> Áp lực xã hội cảm nhận được từ những người quan trọng xung quanh (gia đình, bạn bè) về việc nên hay không nên thực hiện hành vi.</li>
                            <li class="p-3 border-b"><strong>Nhận thức kiểm soát hành vi (Perceived Behavioral Control):</strong> Niềm tin của cá nhân về sự dễ dàng hay khó khăn khi thực hiện hành vi (phản ánh trải nghiệm trong quá khứ và các rào cản dự kiến).</li>
                        </ul>
                    </div>
                </div>
                <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
                    <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                    <p>Ajzen, I. (1991). The theory of planned behavior. <em>Organizational behavior and human decision processes</em>, 50(2), 179-211.</p>
                </div>
            </div>`
    },
    {
        slug: 'servqual-service-quality-model',
        category: ['Theories', 'Marketing'],
        icon_name: 'Star',
        title_vi: 'Mô hình Chất lượng Dịch vụ (SERVQUAL)',
        title_en: 'Service Quality Model (SERVQUAL)',
        description_vi: 'Tìm hiểu thang đo SERVQUAL với 5 thành phần cốt lõi: Tin cậy, Đáp ứng, Đảm bảo, Đồng cảm, và Hữu hình trong nghiên cứu sự hài lòng khách hàng.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Thang đo SERVQUAL là gì?</h3>
                    <p class="mb-4">Mô hình <strong>SERVQUAL</strong> (kết hợp từ "Service" và "Quality") được Parasuraman, Zeithaml và Berry phát triển vào năm 1988. Đây là thang đo chuẩn mực nhất để đo lường khoảng cách giữa "Kỳ vọng" của khách hàng và "Cảm nhận thực tế" của họ sau khi trải nghiệm dịch vụ.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> 5 Thành phần của Mô hình SERVQUAL</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>1. Độ tin cậy (Reliability):</strong> Khả năng cung cấp dịch vụ chính xác, đúng hạn như đã hứa hẹn.</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>2. Độ đáp ứng (Responsiveness):</strong> Sự sẵn sàng giúp đỡ khách hàng và cung cấp dịch vụ kịp thời.</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>3. Năng lực phục vụ (Assurance):</strong> Kiến thức, kỹ năng và thái độ tạo sự tin tưởng của nhân viên.</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>4. Sự đồng cảm (Empathy):</strong> Mức độ quan tâm, chăm sóc cá nhân hóa dành cho khách hàng.</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 md:col-span-2"><strong>5. Phương tiện hữu hình (Tangibles):</strong> Cơ sở vật chất, trang thiết bị, diện mạo nhân viên và tài liệu truyền thông.</div>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'utaut-technology-adoption',
        category: ['Theories', 'Information Systems'],
        icon_name: 'Cpu',
        title_vi: 'Mô hình Chấp nhận và Sử dụng Công nghệ (UTAUT)',
        title_en: 'Unified Theory of Acceptance and Use of Technology',
        description_vi: 'Thuyết UTAUT hợp nhất 8 mô hình lý thuyết hành vi, lý giải ý định sử dụng công nghệ thông qua Kỳ vọng hiệu quả, Kỳ vọng nỗ lực và Ảnh hưởng xã hội.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Tính ưu việt của mô hình nghiên cứu UTAUT</h3>
                    <p class="mb-4">Phát triển bởi Venkatesh et al. (2003), <strong>UTAUT</strong> là một nỗ lực nhằm tổng hợp và thống nhất 8 mô hình lý thuyết nổi bật (bao gồm TAM, TPB, TRA) về sự chấp nhận công nghệ. UTAUT có khả năng giải thích tới 70% phương sai của ý định hành vi, cao hơn rất nhiều so với TAM (chỉ khoảng 40%).</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Bốn biến định lượng chính trong UTAUT</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ul class="space-y-4 text-sm">
                            <li class="p-3 border-b"><strong>Kỳ vọng hiệu quả (Performance Expectancy):</strong> Sự tin tưởng rằng hệ thống sẽ giúp đạt được hiệu suất công việc cao hơn.</li>
                            <li class="p-3 border-b"><strong>Kỳ vọng nỗ lực (Effort Expectancy):</strong> Mức độ dễ dàng khi sử dụng hệ thống.</li>
                            <li class="p-3 border-b"><strong>Ảnh hưởng xã hội (Social Influence):</strong> Mức độ cá nhân nhận thức được rằng những người quan trọng khác tin rằng họ nên sử dụng hệ thống mới.</li>
                            <li class="p-3 border-b"><strong>Điều kiện thuận lợi (Facilitating Conditions):</strong> Mức độ cá nhân tin rằng có sự hỗ trợ về mặt tổ chức và hạ tầng kỹ thuật để sử dụng hệ thống.</li>
                        </ul>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'porter-five-forces-analysis',
        category: ['Theories', 'Strategy'],
        icon_name: 'Shield',
        title_vi: 'Mô hình 5 Áp lực Cạnh tranh của Porter',
        title_en: 'Porter\'s Five Forces',
        description_vi: 'Áp dụng Mô hình 5 áp lực cạnh tranh của Michael Porter trong phân tích môi trường vi mô và hoạch định chiến lược kinh doanh.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Khung phân tích chiến lược của Michael Porter</h3>
                    <p class="mb-4">Ra đời năm 1979 tại Trường Kinh doanh Harvard, mô hình <strong>5 Áp lực cạnh tranh</strong> giúp nhà quản trị phân tích sức hấp dẫn (khả năng sinh lời) của một ngành công nghiệp. Không chỉ trong kinh doanh, đây là khung lý thuyết bắt buộc trong các luận văn thạc sĩ quản trị kinh doanh (MBA) khi đề xuất giải pháp chiến lược.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Giải phẫu 5 Áp lực</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>1. Đối thủ cạnh tranh hiện tại (Industry Rivalry):</strong> Mức độ khốc liệt của cuộc chiến giành thị phần giữa các doanh nghiệp đang có mặt trên thị trường.</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>2. Nguy cơ từ đối thủ tiềm ẩn (Threat of New Entrants):</strong> Rào cản gia nhập ngành cao hay thấp (vốn, bản quyền, quy mô).</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>3. Đe dọa từ sản phẩm thay thế (Threat of Substitutes):</strong> Các sản phẩm từ ngành khác nhưng có chung chức năng giải quyết nhu cầu của khách hàng.</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200"><strong>4. Quyền lực thương lượng của Nhà cung cấp (Bargaining Power of Suppliers):</strong> Khả năng ép giá từ các nhà cung cấp nguyên vật liệu độc quyền.</div>
                        <div class="bg-white p-4 rounded-xl border border-slate-200 md:col-span-2"><strong>5. Quyền lực thương lượng của Khách hàng (Bargaining Power of Buyers):</strong> Quyền lực ép giá của khách hàng dựa trên khối lượng mua và độ nhạy cảm về giá.</div>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'vrio-framework-strategy',
        category: ['Theories', 'Strategy'],
        icon_name: 'Gem',
        title_vi: 'Mô hình Lợi thế Cạnh tranh VRIO',
        title_en: 'VRIO Framework',
        description_vi: 'Phân tích tài nguyên nội bộ doanh nghiệp bằng khung VRIO: Value, Rarity, Inimitability, và Organization để tạo lợi thế cạnh tranh bền vững.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Năng lực cốt lõi theo góc nhìn VRIO</h3>
                    <p class="mb-4">Được Jay B. Barney hoàn thiện vào năm 1991, khung <strong>VRIO</strong> là một công cụ chẩn đoán chiến lược xuất phát từ quan điểm Dựa trên nguồn lực (Resource-Based View). Nó đánh giá liệu các nguồn lực và năng lực bên trong của công ty có thể đem lại lợi thế cạnh tranh bền vững hay không.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Đánh giá qua lăng kính 4 câu hỏi</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ul class="space-y-4 text-sm">
                            <li class="p-3 border-b"><strong>Value (Có giá trị không?):</strong> Nguồn lực có giúp công ty khai thác cơ hội hoặc vô hiệu hóa các mối đe dọa không?</li>
                            <li class="p-3 border-b"><strong>Rarity (Có hiếm không?):</strong> Có nhiều đối thủ sở hữu nguồn lực tương tự không? Nếu không hiếm, công ty chỉ đạt được bình đẳng cạnh tranh.</li>
                            <li class="p-3 border-b"><strong>Inimitability (Có khó bắt chước không?):</strong> Chi phí bắt chước có quá đắt đỏ do lịch sử độc nhất, tính mập mờ nhân quả hoặc độ phức tạp xã hội không?</li>
                            <li class="p-3 border-b"><strong>Organization (Có tổ chức để khai thác không?):</strong> Công ty có cấu trúc quản trị, hệ thống thưởng phạt phù hợp để vắt kiệt giá trị từ nguồn lực đó không?</li>
                        </ul>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'expectation-confirmation-theory-ect',
        category: ['Theories', 'Marketing'],
        icon_name: 'Repeat',
        title_vi: 'Thuyết Kỳ vọng - Xác nhận (ECT)',
        title_en: 'Expectation Confirmation Theory',
        description_vi: 'Nghiên cứu hành vi mua lại và tiếp tục sử dụng thông qua mô hình Expectation-Confirmation Theory của Oliver (1980).',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Thuyết ECT giải thích sự hài lòng như thế nào?</h3>
                    <p class="mb-4"><strong>Thuyết Kỳ vọng - Xác nhận (ECT)</strong> do Oliver (1980) tiên phong đề xuất, là cơ sở lý thuyết mạnh mẽ nhất giải thích sự hình thành lòng trung thành và ý định tiếp tục sử dụng (Continuance Intention) của khách hàng sau khi mua hàng.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6">2. Cơ chế Xác nhận (Confirmation)</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p class="text-sm">Trạng thái xác nhận xảy ra khi hiệu suất thực tế của sản phẩm (Perceived Performance) bằng hoặc vượt qua Kỳ vọng ban đầu (Expectation). Sự xác nhận tích cực này dẫn đến <strong>Sự hài lòng (Satisfaction)</strong>, từ đó thôi thúc hành vi mua lặp lại. ECT thường được giới luận văn sử dụng kết hợp với TAM để nghiên cứu hệ thống e-learning hoặc Mobile Banking.</p>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'sor-model-marketing-behavior',
        category: ['Theories', 'Marketing'],
        icon_name: 'Activity',
        title_vi: 'Mô hình Kích thích - Cơ thể - Phản hồi (S-O-R)',
        title_en: 'Stimulus-Organism-Response Model',
        description_vi: 'Khung lý thuyết S-O-R trong phân tích hành vi người tiêu dùng, giải thích tác động của môi trường lên cảm xúc và phản ứng mua hàng.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Mô hình hành vi môi trường học S-O-R</h3>
                    <p class="mb-4">Bắt nguồn từ Tâm lý học môi trường (Mehrabian & Russell, 1974), mô hình <strong>S-O-R</strong> khẳng định rằng môi trường vật lý ảnh hưởng đến cảm xúc của con người, và từ đó thúc đẩy hành vi của họ. Ngày nay, mô hình S-O-R là "xương sống" cho các nghiên cứu luận văn về Thương mại điện tử (E-commerce) và hành vi mua bốc đồng (Impulse Buying).</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6">2. Ba thành phần của S-O-R</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ul class="space-y-4 text-sm">
                            <li class="p-3 border-b"><strong>Stimulus (Kích thích - S):</strong> Các yếu tố môi trường bên ngoài (ví dụ: giao diện website, âm nhạc cửa hàng, khuyến mãi flash sale).</li>
                            <li class="p-3 border-b"><strong>Organism (Cơ thể - O):</strong> Những thay đổi nội tâm, bao gồm cảm xúc (hưng phấn, thư giãn) và nhận thức (tin tưởng) do kích thích mang lại.</li>
                            <li class="p-3 border-b"><strong>Response (Phản hồi - R):</strong> Hành vi tiếp cận (ở lại lâu hơn, mua hàng) hoặc né tránh (rời khỏi trang web).</li>
                        </ul>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'perceived-value-marketing-strategy',
        category: ['Theories', 'Marketing'],
        icon_name: 'BadgeDollarSign',
        title_vi: 'Lý thuyết Giá trị Cảm nhận (Perceived Value)',
        title_en: 'Perceived Value Theory',
        description_vi: 'Khái niệm Giá trị cảm nhận của Zeithaml (1988) - Trọng tâm của mọi chiến lược định giá và định vị thương hiệu.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Định nghĩa chuẩn xác về Giá trị Cảm nhận</h3>
                    <p class="mb-4">Theo Zeithaml (1988), <strong>Giá trị cảm nhận (Perceived Value)</strong> là sự đánh giá tổng thể của người tiêu dùng về tiện ích của một sản phẩm/dịch vụ dựa trên nhận thức về những gì họ nhận được (Get) so với những gì họ phải bỏ ra (Give).</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6">2. Sự đánh đổi (The Trade-off)</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p class="text-sm">Yếu tố "Nhận được" không chỉ là tính năng lý tính (chất lượng sản phẩm), mà còn bao gồm giá trị cảm xúc và địa vị xã hội. Ngược lại, "Bỏ ra" không chỉ là tiền bạc, mà còn bao gồm thời gian chờ đợi, rủi ro và nỗ lực học hỏi. Khách hàng chỉ mua khi Giá trị cảm nhận > 0.</p>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'tce-transaction-cost-economics-strategy',
        category: ['Theories', 'Strategy'],
        icon_name: 'Handshake',
        title_vi: 'Lý thuyết Chi phí Giao dịch (TCE)',
        title_en: 'Transaction Cost Economics',
        description_vi: 'Giải thích quyết định "Tự làm hay Mua ngoài" của doanh nghiệp thông qua lăng kính Lý thuyết Chi phí Giao dịch của Oliver Williamson.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Bản chất của Lý thuyết TCE</h3>
                    <p class="mb-4">Phát triển bởi Oliver Williamson (Giải Nobel Kinh tế), <strong>Lý thuyết Chi phí Giao dịch (TCE)</strong> lập luận rằng các doanh nghiệp tồn tại để giảm thiểu chi phí giao dịch trên thị trường mở. Mọi quyết định Thuê ngoài (Outsourcing) hay Tự làm (In-house) đều dựa trên việc so sánh chi phí tổ chức nội bộ và chi phí giao dịch bên ngoài.</p>
                </div>
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6">2. Ba yếu tố tạo nên Chi phí giao dịch</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <ul class="space-y-4 text-sm">
                            <li class="p-3 border-b"><strong>Tính đặc thù của tài sản (Asset Specificity):</strong> Khi một khoản đầu tư không thể chuyển đổi mục đích sử dụng, công ty có xu hướng muốn giữ nó trong nội bộ.</li>
                            <li class="p-3 border-b"><strong>Tính không chắc chắn (Uncertainty):</strong> Môi trường càng biến động, hợp đồng bên ngoài càng rủi ro.</li>
                            <li class="p-3 border-b"><strong>Tần suất giao dịch (Frequency):</strong> Giao dịch diễn ra liên tục thì nên tự tổ chức nội bộ để tối ưu chi phí.</li>
                        </ul>
                    </div>
                </div>
            </div>`
    }
];
