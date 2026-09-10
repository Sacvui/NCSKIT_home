const rawArticles = [
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
        description_vi: 'Hướng dẫn chuyên sâu (Deep-dive) về Mô hình TAM. Phân tích cấu trúc nhân tố, sự tiến hóa thành TAM 2, TAM 3 và cách ứng dụng vào luận văn thạc sĩ.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <!-- 1. Nguồn gốc & Bối cảnh -->
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Nguồn gốc & Bối cảnh ra đời (Historical Context)</h3>
                    <p class="mb-4">Mô hình <strong>Chấp nhận Công nghệ (TAM - Technology Acceptance Model)</strong> do Fred Davis giới thiệu lần đầu tiên vào năm 1989 trong luận án tiến sĩ của ông tại MIT. Mục tiêu ban đầu của Davis là tìm ra một mô hình lý thuyết để giải thích tại sao nhân viên văn phòng lại chấp nhận hoặc từ chối sử dụng hệ thống máy tính mới tại nơi làm việc.</p>
                    <p>TAM được xây dựng dựa trên nền tảng của <em>Thuyết Hành động Hợp lý (TRA)</em> của Fishbein và Ajzen, nhưng Davis đã thay thế các biến số niềm tin phức tạp trong TRA bằng hai cấu trúc nhận thức đặc thù dành riêng cho môi trường công nghệ thông tin. Chính sự đơn giản nhưng có sức mạnh dự báo cao (thường giải thích được 40% - 50% ý định hành vi) đã giúp TAM trở thành mô hình thống trị toàn cầu trong lĩnh vực Hệ thống thông tin (Information Systems).</p>
                </div>
                
                <!-- 2. Giải phẫu cấu trúc -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Giải phẫu cấu trúc các nhân tố (Construct Anatomy)</h3>
                    <p class="mb-4">TAM nguyên bản xoay quanh 2 nhân tố (biến độc lập) cốt lõi quyết định đến Ý định sử dụng (Behavioral Intention). Khi thiết kế bảng câu hỏi khảo sát, bạn cần bám sát định nghĩa của 2 nhân tố này:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-blue-500">
                            <h4 class="font-bold text-slate-900 mb-3 text-lg">1. Nhận thức Hữu ích (Perceived Usefulness - PU)</h4>
                            <p class="text-sm mb-4"><em>Định nghĩa:</em> Mức độ mà một người tin rằng việc sử dụng một hệ thống cụ thể sẽ nâng cao hiệu suất làm việc của họ.</p>
                            <p class="text-sm font-semibold text-slate-900 mb-2">Ví dụ câu hỏi đo lường (Thang Likert 5 điểm):</p>
                            <ul class="list-disc pl-5 text-sm space-y-1 text-slate-600">
                                <li>PU1: Sử dụng hệ thống [X] giúp tôi hoàn thành công việc nhanh hơn.</li>
                                <li>PU2: Hệ thống [X] giúp cải thiện chất lượng công việc của tôi.</li>
                                <li>PU3: Nhìn chung, hệ thống [X] rất hữu ích cho công việc/cuộc sống của tôi.</li>
                            </ul>
                            <div class="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold">🎯 PU là nhân tố có sức mạnh tác động lớn nhất đến Ý định sử dụng trong 90% các nghiên cứu thực nghiệm.</div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                            <h4 class="font-bold text-slate-900 mb-3 text-lg">2. Nhận thức Dễ sử dụng (Perceived Ease of Use - PEOU)</h4>
                            <p class="text-sm mb-4"><em>Định nghĩa:</em> Mức độ mà một người tin rằng việc sử dụng hệ thống sẽ không đòi hỏi nhiều nỗ lực về mặt thể chất lẫn tinh thần.</p>
                            <p class="text-sm font-semibold text-slate-900 mb-2">Ví dụ câu hỏi đo lường (Thang Likert 5 điểm):</p>
                            <ul class="list-disc pl-5 text-sm space-y-1 text-slate-600">
                                <li>PEOU1: Thao tác trên hệ thống [X] rất dễ học và dễ nhớ.</li>
                                <li>PEOU2: Giao diện của hệ thống [X] rất rõ ràng và dễ hiểu.</li>
                                <li>PEOU3: Tôi không cần đến sự trợ giúp kỹ thuật để sử dụng [X].</li>
                            </ul>
                            <div class="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">💡 Lưu ý: Theo TAM, PEOU không chỉ tác động đến Ý định sử dụng, mà còn tác động thuận chiều trực tiếp lên PU.</div>
                        </div>
                    </div>
                </div>

                <!-- 3. Sự tiến hóa -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Sự tiến hóa của Mô hình (Model Evolution)</h3>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p class="mb-4">Theo thời gian, giới học thuật nhận ra rằng chỉ 2 biến PU và PEOU là không đủ để bao quát bức tranh tâm lý con người. Do đó, Venkatesh và Davis đã nâng cấp mô hình thành các phiên bản mới:</p>
                        <ul class="space-y-4">
                            <li class="bg-white p-4 rounded-xl border border-slate-200">
                                <strong class="text-indigo-700">Mô hình TAM 2 (2000):</strong> Bổ sung các biến số <em>Ảnh hưởng xã hội (Social Influence)</em> và <em>Các quy trình nhận thức công cụ (Cognitive Instrumental Processes)</em>. TAM 2 giải thích lý do vì sao một người ban đầu thấy hệ thống hữu ích (Do áp lực từ sếp, hình ảnh cá nhân, chất lượng đầu ra).
                            </li>
                            <li class="bg-white p-4 rounded-xl border border-slate-200">
                                <strong class="text-indigo-700">Mô hình TAM 3 (2008):</strong> Tích hợp sâu vào nhân tố "Tính dễ sử dụng". TAM 3 bổ sung các biến như <em>Sự e ngại máy tính (Computer Anxiety)</em>, <em>Sự tự tin vào khả năng sử dụng máy tính (Computer Self-efficacy)</em> và <em>Niềm vui khi sử dụng (Playfulness)</em>.
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 4. Ứng dụng vẽ mô hình -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">4</span> Ứng dụng thực tế vào Luận văn Thạc sĩ</h3>
                    <p class="mb-4">Ngày nay, nếu bạn chỉ dùng đúng 2 biến của TAM nguyên bản để làm luận văn thạc sĩ, hội đồng bảo vệ sẽ đánh giá đề tài của bạn "quá đơn giản và thiếu tính mới". Để đạt điểm cao, bạn cần sử dụng TAM làm <strong>Base Model (Mô hình nền tảng)</strong> và tích hợp thêm các nhân tố ngoại sinh (External Variables) phù hợp với ngữ cảnh nghiên cứu.</p>
                    <div class="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <h4 class="font-bold text-amber-900 mb-3">Ví dụ ý tưởng ghép mô hình (Hybrid Models):</h4>
                        <ul class="list-disc pl-5 space-y-2 text-amber-800 text-sm">
                            <li><strong>Nghiên cứu App Ngân hàng (Mobile Banking):</strong> Ghép TAM với biến <em>Rủi ro cảm nhận (Perceived Risk)</em> và <em>Sự tin tưởng (Trust)</em>.</li>
                            <li><strong>Nghiên cứu Nền tảng học trực tuyến (E-learning):</strong> Ghép TAM với <em>Sự tương tác xã hội (Social Interaction)</em> và <em>Chất lượng hệ thống (System Quality)</em>.</li>
                            <li><strong>Nghiên cứu Chatbot AI:</strong> Ghép TAM với <em>Tính nhân hóa cảm nhận (Perceived Anthropomorphism)</em>.</li>
                        </ul>
                    </div>
                </div>

                <!-- 5. Khuyến nghị phân tích -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">5</span> Khuyến nghị phương pháp phân tích (Methodological Advice)</h3>
                    <div class="bg-slate-900 text-slate-300 p-6 rounded-2xl border-l-4 border-indigo-500 shadow-xl">
                        <p class="mb-4 text-white font-medium">Khi xử lý dữ liệu từ mô hình TAM mở rộng, bạn nên chọn công cụ nào?</p>
                        <p class="mb-3 text-sm">Do mô hình TAM thường được kết hợp thêm nhiều biến mới (tạo ra mô hình cấu trúc phức tạp) và dữ liệu thu thập từ thang đo Likert thường bị lệch chuẩn (Mọi người có xu hướng đánh số 4 và 5), <strong>PLS-SEM (sử dụng SmartPLS)</strong> là lựa chọn lý tưởng nhất.</p>
                        <p class="text-sm">PLS-SEM xử lý tốt dữ liệu không phân phối chuẩn và tối ưu hóa việc dự báo Ý định sử dụng (R-square). Bạn có thể <a href="/analyze" class="text-indigo-400 font-bold hover:underline">nhấn vào đây để tải file Excel lên hệ thống NCSKIT</a> và chạy tự động toàn bộ mô hình đo lường cũng như kiểm định giả thuyết cấu trúc theo phương pháp PLS-SEM.</p>
                        
                        <div class="mt-6 pt-6 border-t border-slate-700">
                            <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                            <div class="space-y-3 text-xs">
                                <p>Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. <em>MIS quarterly</em>, 319-340.</p>
                                <p>Venkatesh, V., & Davis, F. D. (2000). A theoretical extension of the technology acceptance model: Four longitudinal field studies. <em>Management science</em>, 46(2), 186-204.</p>
                                <p>Venkatesh, V., & Bala, H. (2008). Technology acceptance model 3 and a research agenda on interventions. <em>Decision sciences</em>, 39(2), 273-315.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'theory-of-planned-behavior-tpb',
        category: ['Theories', 'Psychology'],
        icon_name: 'Brain',
        title_vi: 'Thuyết Hành vi Dự định (TPB)',
        title_en: 'Theory of Planned Behavior (TPB)',
        description_vi: 'Hướng dẫn chuyên sâu về Thuyết Hành vi Dự định (TPB). Phân tích 3 trụ cột (Thái độ, Chuẩn chủ quan, Kiểm soát hành vi) và cách thiết kế bảng hỏi.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <!-- 1. Nguồn gốc & Bối cảnh -->
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Khái quát và Bối cảnh ra đời (Historical Context)</h3>
                    <p class="mb-4"><strong>Thuyết Hành vi Dự định (Theory of Planned Behavior - TPB)</strong> được Icek Ajzen phát triển vào năm 1991. Đây là bản nâng cấp hoàn hảo nhằm khắc phục những lỗ hổng của Thuyết Hành động Hợp lý (TRA - Theory of Reasoned Action) trước đó.</p>
                    <p>Hạn chế lớn nhất của TRA là nó giả định con người luôn có khả năng kiểm soát hoàn toàn hành vi của mình. Tuy nhiên trong thực tế, dù bạn rất muốn mua một chiếc ô tô (Ý định cao), nhưng bạn lại không có đủ tiền hoặc chưa có bằng lái. Ajzen đã giải quyết bài toán này bằng cách thêm vào nhân tố thứ ba: <em>Nhận thức kiểm soát hành vi (Perceived Behavioral Control)</em>, biến TPB trở thành mô hình dự báo hành vi tâm lý học số một thế giới.</p>
                </div>

                <!-- 2. Giải phẫu cấu trúc -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Ba trụ cột cấu thành Ý định (The Three Pillars)</h3>
                    <p class="mb-4">Mô hình TPB khẳng định Ý định hành vi (Intention) được định hình bởi 3 yếu tố độc lập. Hiểu đúng bản chất của chúng sẽ giúp bạn thiết kế câu hỏi khảo sát không bị trùng lặp ngữ nghĩa:</p>
                    <div class="space-y-4">
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start border-l-4 border-l-rose-500">
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">1. Thái độ đối với hành vi (Attitude towards behavior)</h4>
                                <p class="text-sm mt-2 text-slate-600">Đánh giá tổng quan (tích cực hoặc tiêu cực) của cá nhân về việc thực hiện hành vi. Thái độ được hình thành từ niềm tin về hậu quả của hành vi đó.</p>
                                <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ: "Tôi cho rằng việc mua thực phẩm hữu cơ là rất tốt cho sức khỏe và môi trường."</div>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start border-l-4 border-l-blue-500">
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">2. Chuẩn chủ quan (Subjective Norm)</h4>
                                <p class="text-sm mt-2 text-slate-600">Áp lực xã hội cảm nhận được về việc nên hay không nên thực hiện hành vi. Đây là sức mạnh của đám đông, được quyết định bởi những người quan trọng (gia đình, bạn bè, sếp).</p>
                                <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ: "Gia đình và bạn thân của tôi đều khuyên tôi nên dùng thực phẩm hữu cơ."</div>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start border-l-4 border-l-emerald-500">
                            <div>
                                <h4 class="font-bold text-slate-900 text-lg">3. Nhận thức kiểm soát hành vi (Perceived Behavioral Control - PBC)</h4>
                                <p class="text-sm mt-2 text-slate-600">Sự cảm nhận của cá nhân về mức độ dễ dàng hay khó khăn khi thực hiện hành vi. Phản ánh các rào cản về Nguồn lực (Tiền bạc, thời gian) và Năng lực bản thân.</p>
                                <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ: "Tôi hoàn toàn có đủ khả năng tài chính và dễ dàng tìm mua thực phẩm hữu cơ gần nhà."</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. Các biến số mở rộng -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Ứng dụng & Mở rộng (Extensions)</h3>
                    <p class="mb-4">Trong các bài báo khoa học chuẩn ISI/Scopus, tác giả hiếm khi chỉ đo lường 3 biến cơ bản của TPB. Tùy thuộc vào chủ đề nghiên cứu, hội đồng sẽ mong đợi bạn "cấy ghép" thêm các biến số mới (Construct Addition) để tăng tính độc đáo (Novelty):</p>
                    <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <ul class="list-disc pl-5 space-y-3 text-indigo-900 text-sm">
                            <li><strong>Nghiên cứu Tiêu dùng Xanh (Green Consumption):</strong> Thêm biến <em>Nhận thức về môi trường (Environmental Concern)</em> hoặc <em>Kiến thức môi trường (Environmental Knowledge)</em> tác động lên Thái độ.</li>
                            <li><strong>Nghiên cứu Khởi nghiệp (Entrepreneurial Intention):</strong> Thêm biến <em>Chấp nhận rủi ro (Risk-taking propensity)</em> và <em>Nhu cầu thành đạt (Need for achievement)</em>.</li>
                            <li><strong>Nghiên cứu Mua sắm xa xỉ (Luxury Brands):</strong> Thay thế "Chuẩn chủ quan" bằng việc tách nhỏ thành <em>Ảnh hưởng thông tin (Informational Influence)</em> và <em>Ảnh hưởng định mức (Normative Influence)</em>.</li>
                        </ul>
                    </div>
                </div>

                <!-- 4. Khuyến nghị phân tích -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">4</span> Khuyến nghị phương pháp phân tích thống kê</h3>
                    <div class="bg-slate-900 text-slate-300 p-6 rounded-2xl border-l-4 border-emerald-500 shadow-xl">
                        <p class="mb-4 text-white font-medium">TPB nên dùng hồi quy OLS hay mô hình SEM?</p>
                        <p class="mb-3 text-sm">Nhiều sinh viên sử dụng phần mềm SPSS để tính giá trị trung bình (Compute Variable) của các câu hỏi Likert rồi chạy <strong>Hồi quy tuyến tính đa biến (OLS Regression)</strong>. Tuy nhiên, cách làm này <strong>đã lỗi thời</strong> vì nó bỏ qua hoàn toàn sai số đo lường (Measurement Error) của các câu hỏi thành phần.</p>
                        <p class="text-sm">Thay vào đó, bạn bắt buộc phải áp dụng <strong>Mô hình cấu trúc (CB-SEM hoặc PLS-SEM)</strong>. Các phần mềm thế hệ mới (như hệ thống R-Wasm của NCSKIT) cho phép phân tích CFA (Đo lường độ tin cậy) và SEM (Kiểm định giả thuyết H1, H2, H3) cùng một lúc. Điều này giúp hệ số tác động (Beta) của Thái độ, Chuẩn chủ quan và PBC lên Ý định trở nên chính xác và đáng tin cậy hơn rất nhiều.</p>
                        
                        <div class="mt-6 pt-6 border-t border-slate-700">
                            <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                            <div class="space-y-3 text-xs">
                                <p>Ajzen, I. (1991). The theory of planned behavior. <em>Organizational behavior and human decision processes</em>, 50(2), 179-211.</p>
                                <p>Armitage, C. J., & Conner, M. (2001). Efficacy of the theory of planned behaviour: A meta‐analytic review. <em>British journal of social psychology</em>, 40(4), 471-499.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    },
    {
        slug: 'servqual-service-quality-model',
        category: ['Theories', 'Marketing'],
        icon_name: 'Star',
        title_vi: 'Mô hình Chất lượng Dịch vụ (SERVQUAL)',
        title_en: 'Service Quality Model (SERVQUAL)',
        description_vi: 'Hướng dẫn chuyên sâu Thang đo SERVQUAL. Giải phẫu 5 thành phần cốt lõi (RATER) và Mô hình 5 khoảng cách chất lượng dịch vụ.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <!-- 1. Nguồn gốc -->
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Khái quát và Bối cảnh ra đời</h3>
                    <p class="mb-4">Khác với sản phẩm hữu hình, "dịch vụ" mang tính vô hình, không đồng nhất và không thể lưu trữ. Để đo lường một thứ trừu tượng như vậy, Parasuraman, Zeithaml và Berry đã giới thiệu <strong>Mô hình SERVQUAL</strong> vào năm 1988.</p>
                    <p>SERVQUAL định nghĩa Chất lượng dịch vụ là khoảng cách (Gap) giữa <strong>Sự kỳ vọng (Expectations)</strong> của khách hàng trước khi mua và <strong>Sự cảm nhận (Perceptions)</strong> của họ sau khi trải nghiệm dịch vụ. Nếu Cảm nhận > Kỳ vọng, chất lượng dịch vụ được đánh giá là tuyệt hảo.</p>
                </div>

                <!-- 2. RATER -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Giải phẫu 5 Thành phần của Thang đo (Mô hình RATER)</h3>
                    <p class="mb-4">Từ 10 thành phần ban đầu, SERVQUAL đã được tinh gọn lại thành 5 thứ nguyên cốt lõi (viết tắt là RATER) với 22 biến quan sát:</p>
                    <div class="space-y-4">
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-rose-500">
                            <h4 class="font-bold text-slate-900 text-lg">1. Độ tin cậy (Reliability)</h4>
                            <p class="text-sm mt-2 text-slate-600">Khả năng cung cấp dịch vụ chính xác và đúng hẹn ngay từ lần đầu tiên. Đây thường là yếu tố quan trọng nhất.</p>
                            <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ Likert: "Ngân hàng X luôn thực hiện các giao dịch chính xác không để xảy ra sai sót."</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
                            <h4 class="font-bold text-slate-900 text-lg">2. Năng lực phục vụ (Assurance)</h4>
                            <p class="text-sm mt-2 text-slate-600">Kiến thức, chuyên môn và thái độ lịch sự của nhân viên, khả năng tạo sự tin tưởng cho khách hàng.</p>
                            <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ Likert: "Nhân viên của ngân hàng X có đủ kiến thức chuyên môn để trả lời mọi thắc mắc của tôi."</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                            <h4 class="font-bold text-slate-900 text-lg">3. Phương tiện hữu hình (Tangibles)</h4>
                            <p class="text-sm mt-2 text-slate-600">Cơ sở vật chất, trang thiết bị, không gian và diện mạo của nhân viên.</p>
                            <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ Likert: "Ngân hàng X có cơ sở vật chất khang trang và thiết bị giao dịch hiện đại."</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                            <h4 class="font-bold text-slate-900 text-lg">4. Sự đồng cảm (Empathy)</h4>
                            <p class="text-sm mt-2 text-slate-600">Sự quan tâm chăm sóc cá nhân hóa, hiểu rõ nhu cầu riêng biệt của từng khách hàng.</p>
                            <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ Likert: "Ngân hàng X có giờ giấc làm việc thuận tiện cho cá nhân tôi."</div>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
                            <h4 class="font-bold text-slate-900 text-lg">5. Độ đáp ứng (Responsiveness)</h4>
                            <p class="text-sm mt-2 text-slate-600">Sự sẵn lòng giúp đỡ và cung cấp dịch vụ nhanh chóng, không để khách hàng phải chờ đợi.</p>
                            <div class="mt-2 bg-slate-50 p-3 rounded-lg text-xs italic">Ví dụ Likert: "Nhân viên ngân hàng X luôn sẵn sàng giúp đỡ tôi ngay lập tức."</div>
                        </div>
                    </div>
                </div>

                <!-- 3. Phương pháp tiếp cận -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Ứng dụng & Biến thể (SERVPERF)</h3>
                    <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                        <p class="mb-4 text-sm text-indigo-900">Mặc dù SERVQUAL cực kỳ nổi tiếng, việc bắt khách hàng phải làm khảo sát 2 lần (1 lần hỏi Kỳ vọng, 1 lần hỏi Cảm nhận) khiến bảng câu hỏi quá dài (44 câu).</p>
                        <p class="text-sm text-indigo-900">Năm 1992, Cronin và Taylor đã đề xuất mô hình <strong>SERVPERF</strong>. Mô hình này giữ nguyên 22 biến của 5 thành phần RATER, nhưng <strong>chỉ đo lường sự Cảm nhận thực tế (Performance)</strong>, bỏ qua phần Kỳ vọng. Ngày nay, 90% luận văn về mức độ hài lòng khách hàng tại Việt Nam thực chất đang sử dụng mô hình SERVPERF thay vì SERVQUAL gốc.</p>
                    </div>
                </div>

                <!-- 4. Khuyến nghị phân tích -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">4</span> Khuyến nghị phương pháp phân tích thống kê</h3>
                    <div class="bg-slate-900 text-slate-300 p-6 rounded-2xl border-l-4 border-emerald-500 shadow-xl">
                        <p class="mb-4 text-white font-medium">Quy trình phân tích chuẩn mực cho dữ liệu SERVPERF</p>
                        <p class="mb-3 text-sm">Với 22 biến quan sát, điều đầu tiên bạn phải làm là <strong>Phân tích nhân tố khám phá (EFA)</strong> để kiểm tra xem 22 biến này có thực sự gom tụ lại thành 5 nhóm (RATER) như lý thuyết hay không. Rất nhiều trường hợp dữ liệu bị gom lại chỉ còn 3 hoặc 4 nhóm (Ví dụ: Tin cậy và Đáp ứng bị gộp chung).</p>
                        <p class="text-sm">Sau khi chạy EFA và Cronbach's Alpha, bạn sẽ tính giá trị trung bình đại diện cho các nhóm, và đưa vào mô hình <strong>Hồi quy tuyến tính (OLS)</strong> với biến phụ thuộc là "Sự hài lòng của khách hàng".</p>
                        
                        <div class="mt-6 pt-6 border-t border-slate-700">
                            <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                            <div class="space-y-3 text-xs">
                                <p>Parasuraman, A., Zeithaml, V. A., & Berry, L. L. (1988). Servqual: A multiple-item scale for measuring consumer perceptions of service quality. <em>Journal of retailing</em>, 64(1), 12-40.</p>
                                <p>Cronin Jr, J. J., & Taylor, S. A. (1992). Measuring service quality: a reexamination and extension. <em>Journal of marketing</em>, 56(3), 55-68.</p>
                            </div>
                        </div>
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
        description_vi: 'Hướng dẫn chuyên sâu Thuyết UTAUT. Tổng hợp 4 biến độc lập cốt lõi, vai trò của các biến điều tiết và cách áp dụng vào nghiên cứu hành vi công nghệ.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <!-- 1. Nguồn gốc -->
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Sự ra đời của siêu mô hình (The Super Model)</h3>
                    <p class="mb-4">Trước năm 2003, giới nghiên cứu bị "ngộp" trong một biển lý thuyết về sự chấp nhận công nghệ (TAM, TPB, TRA, Thuyết Khuếch tán Đổi mới - IDT...). Venkatesh và cộng sự đã thực hiện một siêu nghiên cứu, chắt lọc và hợp nhất 8 mô hình mạnh nhất để tạo ra <strong>UTAUT (Unified Theory of Acceptance and Use of Technology)</strong>.</p>
                    <p>Sức mạnh của UTAUT nằm ở việc nó có thể giải thích tới <strong>70%</strong> sự biến thiên trong ý định sử dụng công nghệ của người dùng, cao hơn rất nhiều so với mức 40% của TAM gốc.</p>
                </div>

                <!-- 2. Giải phẫu cấu trúc -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Giải phẫu 4 Biến Độc lập Cốt lõi</h3>
                    <p class="mb-4">Thay vì dùng PU và PEOU của TAM, UTAUT sử dụng hệ thống biến bao quát hơn:</p>
                    <div class="space-y-4">
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                            <h4 class="font-bold text-slate-900 text-lg">1. Kỳ vọng hiệu quả (Performance Expectancy - PE)</h4>
                            <p class="text-sm mt-2 text-slate-600">Niềm tin rằng hệ thống sẽ giúp cá nhân đạt hiệu suất công việc cao. Tương đồng với PU trong TAM. Là biến dự báo mạnh nhất cho ý định.</p>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                            <h4 class="font-bold text-slate-900 text-lg">2. Kỳ vọng nỗ lực (Effort Expectancy - EE)</h4>
                            <p class="text-sm mt-2 text-slate-600">Mức độ dễ dàng gắn liền với việc sử dụng hệ thống. Tương đồng với PEOU trong TAM.</p>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
                            <h4 class="font-bold text-slate-900 text-lg">3. Ảnh hưởng xã hội (Social Influence - SI)</h4>
                            <p class="text-sm mt-2 text-slate-600">Áp lực từ những người quan trọng xung quanh (sếp, bạn bè, đồng nghiệp) cho rằng cá nhân nên sử dụng công nghệ mới. Tương đồng với Subjective Norm trong TPB.</p>
                        </div>
                        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
                            <h4 class="font-bold text-slate-900 text-lg">4. Điều kiện thuận lợi (Facilitating Conditions - FC)</h4>
                            <p class="text-sm mt-2 text-slate-600">Niềm tin rằng có đủ cơ sở hạ tầng tổ chức và kỹ thuật để hỗ trợ việc sử dụng hệ thống. Đặc biệt, biến FC không chỉ tác động lên Ý định, mà còn có khả năng tác động trực tiếp lên <strong>Hành vi sử dụng thực tế (Use Behavior)</strong>.</p>
                        </div>
                    </div>
                </div>

                <!-- 3. Biến điều tiết -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> "Vũ khí bí mật": Các Biến Điều tiết (Moderators)</h3>
                    <div class="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <p class="mb-4 text-sm text-amber-900">Điểm làm nên sức mạnh của UTAUT chính là việc đưa vào 4 biến nhân khẩu học để đóng vai trò làm biến điều tiết. Sự tác động của 4 biến độc lập lên ý định sẽ mạnh hay yếu phụ thuộc vào:</p>
                        <ul class="list-disc pl-5 space-y-2 text-amber-900 text-sm font-medium">
                            <li><strong>Giới tính (Gender):</strong> Nam giới quan tâm nhiều đến Kỳ vọng hiệu quả (PE), trong khi nữ giới quan tâm nhiều đến Kỳ vọng nỗ lực (EE) và Ảnh hưởng xã hội (SI).</li>
                            <li><strong>Độ tuổi (Age):</strong> Người trẻ tuổi bị chi phối bởi PE, người lớn tuổi bị chi phối bởi EE, SI và FC.</li>
                            <li><strong>Kinh nghiệm (Experience):</strong> Người mới dùng bị áp lực bởi xã hội (SI) nhiều hơn người đã có kinh nghiệm.</li>
                            <li><strong>Tính tự nguyện (Voluntariness of Use):</strong> SI chỉ có tác động mạnh trong môi trường bắt buộc sử dụng (ví dụ: công ty áp dụng phần mềm ERP mới bắt buộc).</li>
                        </ul>
                    </div>
                </div>

                <!-- 4. Khuyến nghị phân tích -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">4</span> Khuyến nghị phương pháp phân tích thống kê</h3>
                    <div class="bg-slate-900 text-slate-300 p-6 rounded-2xl border-l-4 border-indigo-500 shadow-xl">
                        <p class="mb-3 text-sm">Khi làm luận văn với UTAUT, việc xử lý <strong>Biến điều tiết (Moderating Variables)</strong> bằng SPSS truyền thống là một cơn ác mộng (phải tạo biến tương tác thủ công).</p>
                        <p class="text-sm">Tôi khuyên bạn nên sử dụng hệ thống <strong>SmartPLS (PLS-SEM)</strong>. Thuật toán phân tích đa nhóm (MGA - Multi-Group Analysis) trong SmartPLS cho phép bạn kiểm định sự khác biệt giữa nhóm Nam/Nữ, Lớn tuổi/Trẻ tuổi một cách hoàn toàn tự động và ra biểu đồ trực quan.</p>
                        
                        <div class="mt-6 pt-6 border-t border-slate-700">
                            <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
                            <div class="space-y-3 text-xs">
                                <p>Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view. <em>MIS quarterly</em>, 425-478.</p>
                            </div>
                        </div>
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
        description_vi: 'Hướng dẫn phân tích môi trường vi mô doanh nghiệp bằng Mô hình 5 áp lực cạnh tranh. Định hình chiến lược đại dương xanh.',
        content_vi: `
            <div class="space-y-10 text-slate-700 leading-relaxed">
                <!-- 1. Nguồn gốc -->
                <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                    <h3 class="text-2xl font-black text-indigo-900 mb-4">1. Khung phân tích chiến lược kinh điển</h3>
                    <p class="mb-4">Ra đời năm 1979 trên tạp chí Harvard Business Review bởi Giáo sư Michael Porter, mô hình <strong>5 Áp lực cạnh tranh (Five Forces)</strong> đã thay đổi vĩnh viễn cách các giám đốc điều hành hoạch định chiến lược.</p>
                    <p>Mô hình này giúp nhà quản trị phân tích sức hấp dẫn (khả năng sinh lời) của một ngành công nghiệp cụ thể. Chân lý của Porter rất đơn giản: Ngành càng chịu nhiều áp lực, biên lợi nhuận của doanh nghiệp càng mỏng.</p>
                </div>

                <!-- 2. Giải phẫu -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Giải phẫu 5 Áp lực (The 5 Forces)</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-rose-500">
                            <h4 class="font-bold text-slate-900 text-lg mb-2">1. Cạnh tranh nội bộ ngành (Rivalry)</h4>
                            <p class="text-sm text-slate-600">Mức độ khốc liệt của cuộc chiến giành thị phần. Áp lực cao khi: Ngành tăng trưởng chậm, có nhiều đối thủ ngang sức, rào cản rút lui (Exit barriers) cao.</p>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-orange-500">
                            <h4 class="font-bold text-slate-900 text-lg mb-2">2. Đe dọa từ Đối thủ tiềm ẩn (New Entrants)</h4>
                            <p class="text-sm text-slate-600">Những người lính mới sẵn sàng nhảy vào ăn chia miếng bánh. Áp lực được giảm thiểu bởi "Rào cản gia nhập" (Vốn, bản quyền, tính kinh tế theo quy mô).</p>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-blue-500">
                            <h4 class="font-bold text-slate-900 text-lg mb-2">3. Đe dọa từ Sản phẩm thay thế (Substitutes)</h4>
                            <p class="text-sm text-slate-600">Các sản phẩm ngoài ngành nhưng có chung công năng (Ví dụ: Skype thay thế vé máy bay công tác). Áp lực cao khi chi phí chuyển đổi (Switching cost) của khách hàng thấp.</p>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500">
                            <h4 class="font-bold text-slate-900 text-lg mb-2">4. Quyền lực Nhà cung cấp (Suppliers)</h4>
                            <p class="text-sm text-slate-600">Nhà cung cấp có thể ép giá đầu vào, làm giảm biên lợi nhuận của bạn. Áp lực cao khi: Thị trường có ít nhà cung cấp độc quyền, bạn không phải khách hàng lớn của họ.</p>
                        </div>
                        <div class="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-purple-500 md:col-span-2">
                            <h4 class="font-bold text-slate-900 text-lg mb-2">5. Quyền lực Khách hàng (Buyers)</h4>
                            <p class="text-sm text-slate-600">Khách hàng có thể ép bạn giảm giá hoặc đòi hỏi chất lượng cao hơn. Áp lực cao khi: Khách hàng mua khối lượng lớn, sản phẩm của bạn không có sự khác biệt (Commodity).</p>
                        </div>
                    </div>
                </div>

                <!-- 3. Ứng dụng -->
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Ứng dụng trong Luận văn MBA</h3>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p class="mb-4 text-sm text-slate-700">Trong luận văn thạc sĩ quản trị kinh doanh, Porter's Five Forces không phải là công cụ đo lường định lượng (chạy SPSS), mà là công cụ <strong>Định tính (Qualitative)</strong> để xây dựng Chiến lược cấp Công ty (Corporate Strategy).</p>
                        <p class="text-sm text-slate-700">Hãy kết hợp 5 áp lực này với phân tích SWOT và PESTEL để đề xuất một trong 3 Chiến lược Cạnh tranh Tổng quát của Porter: Dẫn đầu chi phí (Cost Leadership), Khác biệt hóa (Differentiation) hoặc Tập trung (Focus).</p>
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

const authorSignature = `
<div class="mt-12 pt-6 border-t border-slate-200 text-right text-sm">
    <span class="text-slate-500 italic">By</span> <strong class="text-slate-900 font-bold">Lê Phúc Hải</strong>
</div>`;

export const STATIC_ARTICLES = rawArticles.map(article => ({
    ...article,
    content_vi: article.content_vi + authorSignature
}));
