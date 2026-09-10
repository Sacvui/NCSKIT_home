INSERT INTO academy_resources (slug, type, title_vi, title_en, description_vi, description_en, content_vi, content_en, category, meta_data)
VALUES
(
    'scenario-pls-sem',
    'method',
    'Kịch bản 1: Mô hình Cấu trúc Tuyến tính PLS-SEM',
    'Scenario 1: Partial Least Squares SEM',
    'Hướng dẫn phân tích PLS-SEM chuyên sâu. Giải pháp tối ưu cho cỡ mẫu nhỏ, dữ liệu không phân phối chuẩn và mô hình nghiên cứu phức tạp.',
    'Complex structural equation modeling for predictive purposes. Optimal for small samples and non-normal data.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Tổng quan về phương pháp (Methodological Overview)</h3>
        <p class="mb-4">Trong thực hành phân tích số liệu luận văn, <strong>PLS-SEM (Partial Least Squares Structural Equation Modeling)</strong> đang dần thay thế các phương pháp truyền thống nhờ khả năng giải quyết các mô hình cấu trúc phức tạp. Bản chất của thuật toán PLS-SEM là tối đa hóa phương sai được giải thích (R²) của các cấu trúc nội sinh (biến phụ thuộc), thay vì cố gắng tái tạo ma trận hiệp phương sai như CB-SEM.</p>
        <p class="mb-4">Theo Hair et al. (2019), giảng viên và hội đồng bảo vệ thường khuyến nghị sử dụng phần mềm SmartPLS để chạy mô hình PLS-SEM khi nghiên cứu của bạn thuộc một trong các trường hợp sau:</p>
        <div class="bg-white p-4 rounded-xl border border-indigo-100 mt-4 text-sm">
            <h4 class="font-bold text-indigo-800 mb-2">Điều kiện áp dụng PLS-SEM:</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li>Mục tiêu cốt lõi của nghiên cứu là <strong>dự báo</strong> hành vi hoặc xác định các nhân tố tác động trọng yếu (Key Drivers).</li>
                <li>Dữ liệu thu thập thực tế vi phạm giả định phân phối chuẩn (Non-normal data).</li>
                <li>Cỡ mẫu khảo sát nhỏ, không đủ đáp ứng quy tắc khắt khe của AMOS/CB-SEM.</li>
                <li>Mô hình bao gồm các biến đo lường kết quả (Reflective) kết hợp với đo lường nguyên nhân (Formative).</li>
            </ul>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Hướng dẫn đọc kết quả SmartPLS (Evaluation Criteria)</h3>
        <p class="mb-4">Quy trình phân tích PLS-SEM chuẩn học thuật bắt buộc phải trải qua 2 giai đoạn độc lập. Dưới đây là các ngưỡng tiêu chuẩn để bạn bảo vệ kết quả trước hội đồng:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Giai đoạn 1: Đánh giá Mô hình Đo lường</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-blue-600">Hệ số tải ngoài (Outer Loadings):</span> Cần đạt mức ≥ 0.708. Trong một số trường hợp, hệ số từ 0.4 - 0.7 có thể được giữ lại nếu việc xóa biến quan sát đó không làm tăng đáng kể hệ số AVE hay CR.</li>
                    <li><span class="font-bold text-blue-600">Độ tin cậy cấu trúc (Reliability):</span> Các chỉ số Cronbach’s Alpha, rho_A và Composite Reliability (CR) cần nằm trong khoảng <strong>0.70 - 0.90</strong>. (Lưu ý: Nếu CR > 0.95, hội đồng có thể nghi ngờ các câu hỏi khảo sát đang bị trùng lặp ngữ nghĩa).</li>
                    <li><span class="font-bold text-blue-600">Tính hội tụ (Convergent Validity):</span> Hệ số phương sai trích (AVE) phải ≥ 0.50.</li>
                    <li><span class="font-bold text-blue-600">Tính phân biệt (Discriminant Validity):</span> Sử dụng tỷ số HTMT thay vì tiêu chuẩn Fornell-Larcker cũ. Tỷ số <strong>HTMT cần < 0.85</strong> (hoặc < 0.90 nếu các khái niệm có sự tương đồng lớn về mặt lý thuyết).</li>
                </ul>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Giai đoạn 2: Đánh giá Mô hình Cấu trúc</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-teal-600">Đa cộng tuyến (VIF):</span> Giá trị VIF nội bộ (Inner VIF) phải < 3.0 (hoặc linh động < 5.0).</li>
                    <li><span class="font-bold text-teal-600">Kiểm định giả thuyết (Path Coefficients):</span> Sử dụng kỹ thuật Bootstrapping (chạy 5,000 mẫu con) để trích xuất T-statistics và P-value. Giả thuyết được chấp nhận khi P-value < 0.05.</li>
                    <li><span class="font-bold text-teal-600">Năng lực giải thích (R²):</span> Đánh giá phần trăm biến thiên: 0.25 (Yếu), 0.50 (Trung bình), 0.75 (Đáng kể).</li>
                    <li><span class="font-bold text-teal-600">Mức độ tác động (Effect Size f²):</span> 0.02 (Nhỏ), 0.15 (Trung bình), 0.35 (Lớn). Dùng để kết luận biến độc lập nào đóng góp nhiều nhất vào mô hình.</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Hair, J. F., Risher, J. J., Sarstedt, M., & Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review</em>, 31(1), 2-24. https://doi.org/10.1108/EBR-11-2018-0203</p>
            <p>Henseler, J., Ringle, C. M., & Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. <em>Journal of the Academy of Marketing Science</em>, 43(1), 115-135.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Structural Modeling"}',
    '{"icon_name": "Network"}'
),
(
    'scenario-cb-sem',
    'method',
    'Kịch bản 2: Mô hình Cấu trúc Hiệp phương sai CB-SEM',
    'Scenario 2: Covariance-Based SEM',
    'Hướng dẫn phân tích CFA và SEM bằng AMOS. Phương pháp luận chuẩn mực để kiểm định sự phù hợp của lý thuyết nghiên cứu.',
    'Covariance-based structural equation modeling. The gold standard for theory testing and confirmation.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Tổng quan về mô hình CB-SEM</h3>
        <p class="mb-4">Khác với mô hình PLS tập trung vào dự báo, <strong>CB-SEM (Covariance-Based Structural Equation Modeling)</strong> được thiết kế chuyên biệt để <strong>Khẳng định lý thuyết (Theory Confirmation)</strong>. Khi sử dụng các dịch vụ chạy AMOS, thuật toán Maximum Likelihood (ML) sẽ tính toán khoảng cách chênh lệch giữa ma trận hiệp phương sai của dữ liệu thu thập thực tế và ma trận hiệp phương sai lý thuyết.</p>
        <p class="mb-4">Chính vì tính chất kiểm định khắt khe này, CB-SEM đòi hỏi bộ dữ liệu khảo sát của bạn phải đáp ứng giả định phân phối chuẩn nhiều chiều (Multivariate Normality) và kích thước mẫu tối thiểu thường từ 200 quan sát trở lên (Kline, 2015).</p>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Quy trình thực hiện Phân tích CFA bằng AMOS</h3>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Bước 1: Phân Tích Nhân Tố Khẳng Định (Confirmatory Factor Analysis - CFA)</h4>
            <p class="mb-3">CFA đóng vai trò kiểm tra độ phù hợp của mô hình đo lường toàn cục. Luận văn của bạn chỉ được hội đồng đánh giá cao khi các chỉ số Model Fit đạt ngưỡng tiêu chuẩn:</p>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>CMIN/df (Chi-square/df):</strong> Phải < 3.0 (Tốt), có thể chấp nhận < 5.0.</li>
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>CFI & TLI:</strong> Cần ≥ 0.90 (Ưu tiên > 0.95 để khẳng định mô hình xuất sắc).</li>
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>RMSEA:</strong> Yêu cầu < 0.08. Đây là chỉ số sai số xấp xỉ bậc hai, càng thấp càng tốt.</li>
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>SRMR:</strong> < 0.08. Thể hiện tổng bình phương phần dư chuẩn hóa.</li>
            </ul>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Bước 2: Phân Tích Mô Hình Cấu Trúc (SEM)</h4>
            <p class="mb-3">Sau khi CFA đạt chuẩn, nhà nghiên cứu tiến hành kiểm định các giả thuyết (Path Analysis):</p>
            <ul class="list-disc pl-5 space-y-2 text-sm">
                <li>Sử dụng <strong>Beta chuẩn hóa (Standardized Estimates)</strong> để xác định biến độc lập nào có mức độ tác động mạnh nhất lên biến phụ thuộc.</li>
                <li>Đánh giá mức ý nghĩa <strong>P-value</strong> (thường hiển thị là *** hoặc chỉ số C.R. > 1.96). Nếu P-value < 0.05, giả thuyết nghiên cứu có ý nghĩa thống kê và được chấp nhận.</li>
                <li><strong>Gỡ rối Model Fit:</strong> Nếu các chỉ số độ phù hợp không đạt, có thể sử dụng Modification Indices (MI) để nối các sai số (error terms) của những biến quan sát thuộc cùng một nhân tố. Lời khuyên là không lạm dụng MI để tránh hiện tượng Overfitting.</li>
            </ul>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Kline, R. B. (2015). <em>Principles and practice of structural equation modeling</em> (4th ed.). Guilford publications.</p>
            <p>Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2018). <em>Multivariate data analysis</em> (8th ed.). Cengage Learning.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Structural Modeling"}',
    '{"icon_name": "CheckCircle2"}'
),
(
    'scenario-regression',
    'method',
    'Kịch bản 3: Hồi quy Tuyến tính Đa biến (OLS)',
    'Scenario 3: Multiple Linear Regression (OLS)',
    'Quy trình hồi quy đa biến trên SPSS. Hướng dẫn cách đọc hệ số Beta, R-square và cách khắc phục đa cộng tuyến hiệu quả.',
    'Linear impact analysis of multiple independent variables on a continuous dependent variable. Classic causal analysis.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> 1. Bản chất của mô hình Hồi quy Đa biến</h3>
        <p class="mb-3"><strong>Hồi quy Tuyến tính Đa biến (Multiple Regression)</strong> là phương pháp cốt lõi nhất khi thực hiện phân tích số liệu trên SPSS. Mục tiêu của thuật toán OLS (Bình phương tối thiểu thông thường) là tìm ra đường thẳng hồi quy sao cho tổng bình phương các phần dư (sai số) là nhỏ nhất, từ đó đo lường chính xác mức độ tác động của các biến độc lập (X) lên một biến phụ thuộc (Y).</p>
        <div class="mt-5 p-4 bg-white rounded-xl border border-indigo-100 text-sm">
            <h4 class="font-bold text-indigo-800 mb-2">Lưu ý trước khi chạy hồi quy:</h4>
            <p class="mb-2">Một mô hình hồi quy SPSS chỉ có giá trị suy diễn thống kê khi thỏa mãn các giả định hồi quy (BLUE). Bạn cần kiểm tra hiện tượng đa cộng tuyến, phương sai phần dư thay đổi và tính phân phối chuẩn của phần dư.</p>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Các bước đọc kết quả phân tích hồi quy SPSS</h3>
        <div class="space-y-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 1</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Phân tích Tương quan (Pearson Correlation)</h4>
                    <p class="text-sm mt-2">Đánh giá ma trận tương quan Pearson để đảm bảo các biến X có tương quan tuyến tính với biến Y (Sig. < 0.05). Đồng thời quan sát sơ bộ, nếu hai biến X có hệ số tương quan r > 0.8, khả năng cao mô hình sẽ gặp hiện tượng đa cộng tuyến.</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 2</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Đánh giá độ phù hợp của mô hình (Bảng Model Summary & ANOVA)</h4>
                    <p class="text-sm mt-2"><strong>Sig. kiểm định F (ANOVA):</strong> Bắt buộc phải < 0.05, chứng tỏ mô hình hồi quy xây dựng được phù hợp với tập dữ liệu tổng thể.<br/><strong>R bình phương hiệu chỉnh (Adjusted R Square):</strong> Dùng để kết luận các biến độc lập giải thích được bao nhiêu % sự biến thiên của biến phụ thuộc. Nên sử dụng R² hiệu chỉnh thay vì R² thông thường để kết quả khách quan hơn khi có nhiều biến độc lập.</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 3</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Diễn giải hệ số Beta và gỡ lỗi Đa cộng tuyến</h4>
                    <p class="text-sm mt-2"><strong>Mức ý nghĩa (Sig.):</strong> Biến độc lập nào có Sig. < 0.05 thì biến đó mới có tác động ý nghĩa thống kê lên Y.<br/><strong>Khắc phục đa cộng tuyến SPSS:</strong> Dựa vào hệ số phóng đại phương sai (VIF) trong bảng Coefficients. Nếu <strong>VIF > 10</strong> (nhiều giảng viên yêu cầu VIF < 3), bạn bắt buộc phải loại bỏ biến độc lập đó để tránh làm sai lệch hệ số Beta của các biến còn lại.</p>
                </div>
            </div>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Chẩn đoán phần dư (Residual Diagnostics)</h3>
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p class="mb-4 text-sm">Để bài luận văn không bị hội đồng bắt bẻ, hãy đưa hai biểu đồ sau vào báo cáo:</p>
            <ul class="list-disc pl-5 space-y-2 text-sm font-medium">
                <li><strong>Biểu đồ Histogram / Normal P-P Plot:</strong> Nếu phần dư bám sát đường chéo, giả định phân phối chuẩn của phần dư được thỏa mãn.</li>
                <li><strong>Biểu đồ Scatterplot:</strong> Các điểm Scatter phân tán ngẫu nhiên, không theo quy luật rõ ràng chứng minh phương sai của phần dư không đổi (Homoscedasticity).</li>
            </ul>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Field, A. (2013). <em>Discovering statistics using IBM SPSS statistics</em> (4th ed.). Sage publications.</p>
            <p>Hoàng Trọng, & Chu Nguyễn Mộng Ngọc. (2008). <em>Phân tích dữ liệu nghiên cứu với SPSS</em>. Nhà xuất bản Hồng Đức.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Impact Analysis"}',
    '{"icon_name": "LineChart"}'
),
(
    'scenario-logistic',
    'method',
    'Kịch bản 4: Hồi quy Logistic Nhị phân',
    'Scenario 4: Binary Logistic Regression',
    'Áp dụng hồi quy logistic nhị phân trên SPSS để dự báo xác suất và ra quyết định. Phân tích tác động thông qua hệ số Odds Ratio.',
    'Binary outcome prediction using logistic regression. Assessing probability impacts through Odds Ratios.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Đặc điểm của Hồi quy Logistic Nhị phân</h3>
        <p class="mb-4">Khi thực hiện các nghiên cứu về hành vi hoặc đánh giá rủi ro, biến phụ thuộc của bạn thường không phải là biến định lượng liên tục mà là dạng phân loại có hai trạng thái (Ví dụ: 0 = Không mua hàng, 1 = Có mua hàng). Trong trường hợp này, <strong>Hồi quy Logistic nhị phân SPSS</strong> là công cụ bắt buộc thay thế cho hồi quy OLS.</p>
        <p class="mb-4">Hồi quy Logistic không dự báo trực tiếp giá trị của biến phụ thuộc, mà nó dự báo <strong>Xác suất (Probability)</strong> xảy ra sự kiện đó thông qua hàm Logit tự nhiên.</p>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Hướng dẫn đọc kết quả Logistic Regression</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Kiểm định Mô hình (Model Evaluation)</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-blue-600">Omnibus Test:</span> Yêu cầu mức ý nghĩa Sig. < 0.05 để khẳng định mô hình có khả năng dự báo tốt hơn so với việc đoán mò ngẫu nhiên.</li>
                    <li><span class="font-bold text-blue-600">Pseudo R-Square:</span> Thường xem xét chỉ số Nagelkerke R Square (dao động từ 0 đến 1) để biết mô hình giải thích được bao nhiêu % sự biến thiên của biến phụ thuộc. Khoảng > 0.2 là mức chấp nhận được trong nghiên cứu xã hội.</li>
                    <li><span class="font-bold text-blue-600">Hosmer-Lemeshow Test:</span> Trái ngược với Omnibus, bài kiểm tra này yêu cầu mức ý nghĩa <strong>Sig. > 0.05</strong> để khẳng định mức độ phù hợp toàn cục của mô hình (không có sự khác biệt giữa thực tế và dự báo).</li>
                    <li><span class="font-bold text-blue-600">Classification Table:</span> Bảng tỷ lệ dự báo đúng (Overall Percentage). Tỷ lệ > 50% (lý tưởng là > 70%) chứng minh mô hình hoạt động hiệu quả.</li>
                </ul>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Đọc hệ số Odds Ratio (Exp(B))</h4>
                <p class="mb-3 text-sm">Trong bảng "Variables in the Equation", bạn chú ý đến hai giá trị: Mức ý nghĩa Sig. và hệ số Exp(B) hay còn gọi là Tỷ số chênh (Odds Ratio).</p>
                <ul class="space-y-3 text-sm">
                    <li>Chỉ luận giải các biến có mức ý nghĩa <strong>Sig. < 0.05</strong>.</li>
                    <li><span class="font-bold text-teal-600">Exp(B) > 1:</span> Tác động thuận chiều. Cứ mỗi 1 đơn vị tăng lên của biến X, tỷ số chênh (khả năng xảy ra sự kiện Y=1) sẽ tăng gấp Exp(B) lần.</li>
                    <li><span class="font-bold text-teal-600">Exp(B) < 1:</span> Tác động ngược chiều. Sự gia tăng của X làm giảm khả năng xảy ra sự kiện Y=1.</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Hosmer Jr, D. W., Lemeshow, S., & Sturdivant, R. X. (2013). <em>Applied logistic regression</em> (Vol. 398). John Wiley & Sons.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Impact Analysis", "Classification"}',
    '{"icon_name": "Binary"}'
),
(
    'scenario-difference',
    'method',
    'Kịch bản 5: So sánh Khác biệt (T-test & ANOVA)',
    'Scenario 5: Mean Differences (T-test & ANOVA)',
    'Hướng dẫn kiểm định Independent T-test và One-way ANOVA trên SPSS. Phương pháp phân tích sự khác biệt trung bình theo đặc điểm nhân khẩu học.',
    'Group comparison using Independent Samples T-test and One-way ANOVA to evaluate mean differences across demographic characteristics.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Phương pháp Kiểm định Khác biệt Nhóm</h3>
        <p class="mb-4">Trong luận văn nghiên cứu định lượng, hội đồng thường yêu cầu sinh viên phải thực hiện phần phân tích sự khác biệt để xem liệu các nhóm nhân khẩu học khác nhau (như Giới tính, Độ tuổi, Thu nhập) có cảm nhận khác nhau về một yếu tố nào đó hay không. Hai công cụ chính để thực hiện là <strong>Independent Samples T-Test</strong> và <strong>One-way ANOVA SPSS</strong>.</p>
        <div class="bg-white p-4 rounded-xl border border-indigo-100 mt-4 text-sm flex flex-col md:flex-row gap-4">
            <div class="flex-1">
                <h4 class="font-bold text-indigo-800 mb-2">T-Test Độc lập</h4>
                <p>Sử dụng khi phân loại nhóm (Biến định tính) <strong>chỉ có đúng 2 giá trị</strong>. (Ví dụ: So sánh mức độ hài lòng giữa nhóm Nam và Nữ).</p>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-indigo-800 mb-2">Phân tích Phương sai (ANOVA)</h4>
                <p>Sử dụng khi phân loại nhóm có <strong>từ 3 giá trị trở lên</strong>. (Ví dụ: So sánh động lực làm việc giữa các nhóm Kinh nghiệm: Dưới 1 năm, 1-3 năm, và Trên 3 năm).</p>
            </div>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Hướng dẫn đọc kết quả và Xử lý</h3>
        <div class="space-y-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Independent T-Test</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Cách đọc bảng kết quả T-Test</h4>
                    <p class="text-sm mt-2">Trước tiên, luôn phải quan sát phần kiểm định tính đồng nhất phương sai của Levene (Levene''s Test for Equality of Variances).</p>
                    <ul class="list-disc pl-5 mt-2 text-sm text-slate-600">
                        <li><strong>Nếu Sig. Levene > 0.05:</strong> Phương sai đồng nhất, đọc kết quả ở dòng <em>Equal variances assumed</em>.</li>
                        <li><strong>Nếu Sig. Levene < 0.05:</strong> Phương sai không đồng nhất, bắt buộc phải đọc kết quả ở dòng <em>Equal variances not assumed</em>.</li>
                    </ul>
                    <p class="text-sm mt-2">Tiếp theo, đánh giá giá trị Sig. của kiểm định t (Sig. 2-tailed). Nếu Sig. < 0.05, ta kết luận có sự khác biệt mang ý nghĩa thống kê giữa hai nhóm.</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">One-way ANOVA</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Phân tích ANOVA 1 yếu tố trên SPSS</h4>
                    <p class="text-sm mt-2">Cũng tương tự như T-Test, cần kiểm tra Test of Homogeneity of Variances trước. Tuy nhiên, trọng tâm của ANOVA là kết quả của bảng ANOVA chính:</p>
                    <ul class="list-disc pl-5 mt-2 text-sm text-slate-600">
                        <li><strong>Nếu Sig. ANOVA < 0.05:</strong> Có ít nhất một cặp nhóm có sự khác biệt. Sau đó, tiến hành đọc bảng phân tích đi sâu (Post Hoc Test - Thường dùng phép thử Tukey HSD) để chỉ mặt điểm tên chính xác hai nhóm nào đang khác biệt nhau.</li>
                        <li><strong>Nếu Sig. ANOVA > 0.05:</strong> Không có sự khác biệt, dừng phân tích tại đây.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Pallant, J. (2020). <em>SPSS survival manual: A step by step guide to data analysis using IBM SPSS</em> (7th ed.). Routledge.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Comparative Analysis"}',
    '{"icon_name": "GitCompare"}'
),
(
    'scenario-reliability',
    'method',
    'Kịch bản 6: Thẩm định Thang đo (Cronbach''s Alpha & EFA)',
    'Scenario 6: Scale Validation (Cronbach''s Alpha & EFA)',
    'Hướng dẫn chạy kiểm định độ tin cậy thang đo Cronbach Alpha và phân tích nhân tố khám phá EFA trên phần mềm SPSS. Cách xử lý hiện tượng loại biến.',
    'Validation of measurement scales using Cronbach''s Alpha for internal consistency and Exploratory Factor Analysis (EFA) for construct validity.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Tầm quan trọng của việc Thẩm định Thang đo</h3>
        <p class="mb-4">Trong bất kỳ quy trình phân tích dữ liệu nghiên cứu khoa học nào (SPSS, AMOS hay SmartPLS), đánh giá mô hình đo lường luôn là thao tác tiên quyết. Mục tiêu là để chứng minh bảng câu hỏi khảo sát của bạn đáng tin cậy và có giá trị đo lường đúng các khái niệm lý thuyết.</p>
        <p class="mb-4">Hai bài kiểm tra "vỡ lòng" nhưng vô cùng quan trọng là <strong>Kiểm định độ tin cậy Cronbach''s Alpha</strong> (đo lường sự nhất quán nội tại) và <strong>Phân tích nhân tố khám phá EFA</strong> (đánh giá giá trị hội tụ và phân biệt).</p>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Quy tắc đọc kết quả (Rules of Thumb)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Kiểm định Cronbach''s Alpha</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-blue-600">Hệ số Cronbach Alpha tổng:</span> Cần lớn hơn 0.60 đối với nghiên cứu khám phá mới, và <strong>> 0.70</strong> đối với các nghiên cứu định lượng thông dụng (Nunnally, 1978).</li>
                    <li><span class="font-bold text-blue-600">Hệ số tương quan biến - tổng (Corrected Item-Total Correlation):</span> Đây là rào cản loại biến khắc nghiệt nhất. Bất kỳ biến quan sát nào có chỉ số này <strong>< 0.30</strong> thì bắt buộc phải bị loại bỏ khỏi mô hình.</li>
                    <li><span class="font-bold text-blue-600">Mẹo tăng Cronbach Alpha:</span> Nếu Alpha quá thấp, hãy quan sát cột <em>Cronbach''s Alpha if Item Deleted</em>. Nếu xóa một biến làm hệ số tổng tăng mạnh lên đạt chuẩn, bạn nên loại biến đó.</li>
                </ul>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Phân tích Nhân tố Khám phá (EFA)</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-teal-600">Chỉ số KMO & Bartlett:</span> Hệ số KMO phải nằm trong khoảng 0.50 đến 1.0 (chuẩn nhất > 0.6). Kiểm định Bartlett phải có mức ý nghĩa Sig. < 0.05.</li>
                    <li><span class="font-bold text-teal-600">Tổng phương sai trích (Total Variance Explained):</span> Hệ số Eigenvalue phải > 1.0 và giá trị phương sai trích lũy kế (Cumulative %) phải vượt <strong>50%</strong>.</li>
                    <li><span class="font-bold text-teal-600">Bảng Ma trận xoay (Rotated Component Matrix):</span> Cần xem xét Hệ số tải nhân tố (Factor Loading) phải > 0.50. Nếu một biến quan sát tải lên 2 nhân tố (Cross-loading) mà sự chênh lệch hệ số tải giữa chúng < 0.30, biến đó phải bị loại bỏ do vi phạm tính phân biệt.</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích dẫn tham khảo chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2018). <em>Multivariate data analysis</em> (8th ed.). Cengage Learning.</p>
            <p>Nunnally, J. C. (1978). <em>Psychometric theory</em> (2nd ed.). McGraw-Hill.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Measurement Validation"}',
    '{"icon_name": "Target"}'
);