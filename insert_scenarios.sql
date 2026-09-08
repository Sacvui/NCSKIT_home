INSERT INTO academy_resources (slug, type, title_vi, title_en, description_vi, description_en, content_vi, content_en, category, meta_data)
VALUES
(
    'scenario-pls-sem',
    'method',
    'Kịch bản 1: Mô hình Cấu trúc Tuyến tính PLS-SEM',
    'Scenario 1: Partial Least Squares SEM',
    'Phân tích mô hình cấu trúc phức tạp, hướng tới mục tiêu dự báo. Giải pháp tối ưu cho cỡ mẫu nhỏ và dữ liệu không phân phối chuẩn.',
    'Complex structural equation modeling for predictive purposes. Optimal for small samples and non-normal data.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
        <p class="mb-4"><strong>PLS-SEM (Partial Least Squares Structural Equation Modeling)</strong> là phương pháp phân tích đa biến thế hệ thứ hai (Variance-based SEM). Khác với CB-SEM nhằm tái tạo ma trận hiệp phương sai, thuật toán của PLS-SEM hoạt động thông qua một chuỗi các phương trình hồi quy OLS lặp (iterative OLS regressions) nhằm <strong>tối đa hóa phương sai được giải thích (R²)</strong> của các biến phụ thuộc (Hair et al., 2019).</p>
        <p class="mb-4">Đặc tính nổi bật của PLS-SEM là tính linh hoạt cao (Soft Modeling): Không yêu cầu phân phối chuẩn, xử lý tốt cỡ mẫu nhỏ, và hỗ trợ hoàn hảo cả mô hình đo lường kết quả (Reflective) lẫn nguyên nhân (Formative).</p>
        <div class="bg-white p-4 rounded-xl border border-indigo-100 mt-4 text-sm">
            <h4 class="font-bold text-indigo-800 mb-2">Khi nào bắt buộc dùng PLS-SEM?</h4>
            <ul class="list-disc pl-5 space-y-1">
                <li>Mục tiêu nghiên cứu là <strong>dự báo</strong> hành vi hoặc xác định các nhân tố mục tiêu (Target Constructs).</li>
                <li>Mô hình cấu trúc phức tạp (nhiều biến trung gian, biến điều tiết, nhiều cấu trúc).</li>
                <li>Cỡ mẫu không đủ lớn để hội tụ trong CB-SEM (quy tắc 10 times rule).</li>
            </ul>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Tiêu Chuẩn Đánh Giá (Evaluation Thresholds)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Mô hình Đo lường (Measurement Model)</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-blue-600">Outer Loadings:</span> > 0.708 (Chấp nhận > 0.4 nếu việc xóa không làm tăng CR/AVE lên ngưỡng).</li>
                    <li><span class="font-bold text-blue-600">Reliability:</span> Cronbach’s Alpha, rho_A, và Composite Reliability (CR) phải nằm trong khoảng <strong>0.70 - 0.90</strong>. (> 0.95 có nguy cơ trùng lặp nội dung).</li>
                    <li><span class="font-bold text-blue-600">Convergent Validity:</span> AVE > 0.50 (Giải thích > 50% phương sai của các biến quan sát).</li>
                    <li><span class="font-bold text-blue-600">Discriminant Validity:</span> Tỷ số <strong>HTMT < 0.85</strong> (hoặc 0.90 đối với các khái niệm có định nghĩa gần nhau).</li>
                </ul>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 border-b pb-2 text-lg">Mô hình Cấu trúc (Structural Model)</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-teal-600">Collinearity (VIF):</span> VIF nội bộ cấu trúc phải < 3.0 (hoặc tối đa < 5.0) để đảm bảo không bị đa cộng tuyến.</li>
                    <li><span class="font-bold text-teal-600">Path Coefficients (β):</span> Đánh giá qua Bootstrapping (5,000 mẫu). Yêu cầu t-value > 1.96 hoặc p-value < 0.05 (mức ý nghĩa 5%).</li>
                    <li><span class="font-bold text-teal-600">Explanatory Power:</span> Hệ số R² (0.25 = Yếu, 0.50 = Vừa, 0.75 = Mạnh).</li>
                    <li><span class="font-bold text-teal-600">Effect Size (f²):</span> Đánh giá sức mạnh đóng góp: 0.02 (Nhỏ), 0.15 (Vừa), 0.35 (Lớn).</li>
                </ul>
            </div>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Báo Cáo Luận Văn & Khuyến Nghị</h3>
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p class="mb-4">Trong báo cáo khoa học, kết quả PLS-SEM luôn được trình bày theo trình tự 2 bước độc lập theo hướng dẫn của Hair et al. (2019):</p>
            <ol class="list-decimal pl-5 space-y-3 font-medium">
                <li><strong>Giai đoạn 1:</strong> Khẳng định độ tin cậy và giá trị (Trình bày Bảng Outer Loadings, CR, AVE và Ma trận HTMT). Chỉ khi Giai đoạn 1 đạt chuẩn mới được phép diễn giải Giai đoạn 2.</li>
                <li><strong>Giai đoạn 2:</strong> Báo cáo phương trình cấu trúc. Kẻ bảng chi tiết gồm: Giả thuyết (H1, H2...), Beta gốc, T-Statistics, P-Values, Khoảng tin cậy 95% (CI), và Kết luận (Chấp nhận/Bác bỏ).</li>
                <li><strong>Nâng cao (Tùy chọn):</strong> Báo cáo thêm phân tích cấu trúc dự báo ngoài mẫu (PLSpredict) với Q² > 0 để khẳng định mô hình có ý nghĩa dự báo thực tiễn.</li>
            </ol>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Hair, J. F., Risher, J. J., Sarstedt, M., & Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review</em>, 31(1), 2-24. https://doi.org/10.1108/EBR-11-2018-0203</p>
            <p>Henseler, J., Ringle, C. M., & Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. <em>Journal of the Academy of Marketing Science</em>, 43(1), 115-135. https://doi.org/10.1007/s11747-014-0403-8</p>
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
    'Phân tích mô hình cấu trúc dựa trên hiệp phương sai. Tiêu chuẩn vàng để kiểm định và khẳng định các lý thuyết khoa học.',
    'Covariance-based structural equation modeling. The gold standard for theory testing and confirmation.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> 1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
        <p class="mb-4"><strong>CB-SEM (Covariance-Based Structural Equation Modeling)</strong> là mô hình cấu trúc tuyến tính kinh điển dựa trên ma trận hiệp phương sai. Không giống như PLS-SEM ưu tiên tối đa hóa phương sai (R²), thuật toán Maximum Likelihood (ML) của CB-SEM tìm cách ước lượng các tham số sao cho sự chênh lệch giữa <strong>Ma trận hiệp phương sai thực tế của mẫu (Sample Covariance Matrix)</strong> và <strong>Ma trận hiệp phương sai lý thuyết (Implied Covariance Matrix)</strong> là nhỏ nhất.</p>
        <p class="mb-4">Chính vì tính chất khắt khe này, CB-SEM được xem là công cụ tối thượng để <strong>Khẳng định lý thuyết (Theory Confirmation)</strong>. Nó đòi hỏi dữ liệu tuân thủ nghiêm ngặt giả định phân phối chuẩn nhiều chiều (Multivariate Normality) và kích thước mẫu tối thiểu thường từ 200 - 300 quan sát trở lên (Kline, 2015).</p>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Quy Trình Phân Tích & Tiêu Chuẩn Model Fit</h3>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Bước 1: Phân Tích Nhân Tố Khẳng Định (CFA)</h4>
            <p class="mb-3">CFA đánh giá độ phù hợp của mô hình đo lường toàn cục. Mô hình chỉ được chấp nhận khi vượt qua các bài kiểm tra Model Fit khắt khe:</p>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>CMIN/df (Chi-square/df):</strong> < 3.0 (Tốt), < 5.0 (Chấp nhận được).</li>
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>CFI & TLI:</strong> > 0.90 (Tuyệt đối ưu tiên > 0.95).</li>
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>RMSEA:</strong> < 0.08 (Tốt nhất là < 0.05). Cho biết sai số xấp xỉ bậc hai.</li>
                <li class="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong>SRMR:</strong> < 0.08. Tổng bình phương phần dư chuẩn hóa.</li>
            </ul>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Bước 2: Phân Tích Cấu Trúc (SEM)</h4>
            <p class="mb-3">Sau khi CFA thỏa mãn, tiến hành chuyển các mũi tên tương quan (Covariance) thành mũi tên nhân quả (Path) để kiểm định giả thuyết.</p>
            <ul class="list-disc pl-5 space-y-2 text-sm">
                <li>Sử dụng hệ số <strong>Standardized Regression Weights (Beta chuẩn hóa)</strong> để so sánh sức mạnh tác động giữa các biến độc lập lên cùng một biến phụ thuộc.</li>
                <li>Đánh giá <strong>P-value (C.R. / t-value)</strong>: Nếu C.R. > 1.96 tương đương P-value < 0.05, giả thuyết được chấp nhận ở mức độ tin cậy 95%.</li>
                <li>Xử lý lỗi biến nội sinh thông qua <strong>Modification Indices (MI)</strong>: Nếu MI của e1 <--> e2 cực lớn (>15) và có cơ sở lý thuyết, có thể nối chúng lại để tăng độ Fit, tuy nhiên không lạm dụng để tránh mô hình bị "Overfit".</li>
            </ul>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Báo Cáo Luận Văn & Khuyến Nghị</h3>
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p class="mb-3">Đặc sản của báo cáo CB-SEM là <strong>Sơ đồ cấu trúc trực quan (Path Diagram)</strong>. Hãy đảm bảo đưa sơ đồ AMOS/LISREL có hiển thị Beta chuẩn hóa và R² lên báo cáo.</p>
            <p class="mb-3">Ngoài ra, phải báo cáo <strong>Độ tin cậy và Tính phân biệt (Fornell-Larcker Criterion)</strong> dựa trên kết quả CFA: Căn bậc hai của AVE phải LỚN HƠN tất cả các hệ số tương quan giữa các cấu trúc.</p>
            <div class="p-3 bg-red-50 text-red-800 rounded-lg mt-3 border border-red-100 text-sm">
                <strong>Cảnh báo (Caution):</strong> Không nên chuyển đổi qua lại giữa PLS-SEM và CB-SEM chỉ vì P-value không đạt. Hãy chọn công cụ từ đầu dựa trên mục tiêu nghiên cứu (Kiểm định lý thuyết = CB-SEM, Khám phá/Dự báo = PLS-SEM).
            </div>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong>
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
    'Phân tích sự tác động tuyến tính của nhiều biến độc lập lên một biến phụ thuộc định lượng. Kịch bản phân tích nhân quả kinh điển.',
    'Linear impact analysis of multiple independent variables on a continuous dependent variable. Classic causal analysis.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> 1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
        <p class="mb-3"><strong>Hồi quy Tuyến tính Đa biến (Multiple Linear Regression)</strong> là mô hình toán học giải thích sự biến thiên của một biến phụ thuộc (Y - liên tục) dựa trên sự thay đổi của hai hay nhiều biến độc lập (X1, X2... Xn).</p>
        <p class="mb-3">Thuật toán sử dụng là <strong>Bình phương tối thiểu thông thường (Ordinary Least Squares - OLS)</strong>. Mục tiêu cốt lõi của OLS là tìm ra một siêu phẳng (hyperplane) sao cho <strong>tổng bình phương của các phần dư (Sum of Squared Residuals - SSR)</strong> là nhỏ nhất.</p>
        <div class="mt-5 p-4 bg-white rounded-xl border border-indigo-100 text-sm">
            <h4 class="font-bold text-indigo-800 mb-2">5 Giả định kinh điển (BLUE - Best Linear Unbiased Estimator):</h4>
            <ol class="list-decimal pl-5 space-y-1">
                <li>Mối quan hệ tuyến tính (Linearity) giữa X và Y.</li>
                <li>Không có sự tự tương quan của phần dư (Durbin-Watson).</li>
                <li>Đồng phương sai của phần dư (Homoscedasticity).</li>
                <li>Không có đa cộng tuyến hoàn hảo (Multicollinearity).</li>
                <li>Phần dư tuân theo phân phối chuẩn (Normality of Residuals).</li>
            </ol>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Quy Trình Phân Tích & Các Chỉ Số Tiêu Chuẩn</h3>
        <div class="space-y-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 1</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Kiểm tra Tương quan (Pearson Correlation)</h4>
                    <p class="text-sm mt-2">Trước khi chạy hồi quy, lập ma trận tương quan để đảm bảo các biến độc lập (X) CÓ tương quan ý nghĩa với biến phụ thuộc (Y), nhưng KHÔNG tương quan quá mạnh với nhau (r > 0.8 là dấu hiệu cảnh báo đa cộng tuyến).</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 2</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Đánh giá Độ phù hợp Toàn cục (ANOVA & R²)</h4>
                    <p class="text-sm mt-2"><strong>Mức ý nghĩa F (Sig. ANOVA):</strong> Bắt buộc phải < 0.05. Nó chứng minh rằng mô hình hồi quy (tập hợp các biến X) dự báo biến Y tốt hơn việc chỉ dùng giá trị trung bình của Y.<br/><strong>Adjusted R-Square (R² hiệu chỉnh):</strong> Phản ánh % biến thiên của Y được giải thích bởi các X. Dùng R² hiệu chỉnh thay vì R² để tránh bị phạt khi đưa rác (nhiều biến không ý nghĩa) vào mô hình.</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Bước 3</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Phân tích Hệ số Hồi quy & Đa cộng tuyến</h4>
                    <p class="text-sm mt-2"><strong>Sig. của T-test:</strong> Từng hệ số Beta phải có Sig. < 0.05 để giả thuyết H_i được chấp nhận.<br/><strong>Beta chuẩn hóa (Standardized Beta):</strong> Sử dụng để so sánh TẦM QUAN TRỌNG tương đối. Biến nào có trị tuyệt đối Beta chuẩn hóa lớn nhất, biến đó tác động mạnh nhất.<br/><strong>VIF (Variance Inflation Factor):</strong> Bắt buộc VIF < 10 (Nghiêm ngặt: VIF < 5 hoặc < 3). Nếu VIF cao, các Beta bị nhiễu và mất đi độ tin cậy.</p>
                </div>
            </div>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Chẩn Đoán Phần Dư (Residual Diagnostics)</h3>
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p class="mb-4 text-sm">Một bài báo cáo khoa học chất lượng cao không bao giờ bỏ qua bước chẩn đoán phần dư sau hồi quy:</p>
            <ul class="list-disc pl-5 space-y-2 text-sm font-medium">
                <li><strong>Biểu đồ Histogram & P-P Plot:</strong> Đường cong hình chuông chứng minh phần dư tuân theo quy luật phân phối chuẩn.</li>
                <li><strong>Biểu đồ Scatterplot (ZRESID vs ZPRED):</strong> Các điểm phân tán ngẫu nhiên quanh trục 0 (không tạo thành hình phễu hay đường cong) chứng minh phương sai phần dư là đồng nhất và mô hình là tuyến tính.</li>
            </ul>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Field, A. (2013). <em>Discovering statistics using IBM SPSS statistics</em> (4th ed.). Sage publications.</p>
            <p>Wooldridge, J. M. (2015). <em>Introductory econometrics: A modern approach</em> (6th ed.). Cengage Learning.</p>
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
    'Phân loại và dự báo xác suất xảy ra của một sự kiện phân đôi (Có/Không, Sống/Chết, Mua/Không Mua).',
    'Classification and predicting probability of a binary outcome (Yes/No, Buy/Not Buy).',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
        <p class="mb-3">Khác với Hồi quy OLS, khi <strong>biến phụ thuộc (Y) là biến định danh nhị phân (0 hoặc 1)</strong>, chúng ta không thể dùng đường thẳng để dự báo (vì giá trị Y không thể vượt quá 1 hoặc nhỏ hơn 0).</p>
        <p class="mb-3"><strong>Hồi quy Logistic Nhị phân (Binary Logistic Regression)</strong> sử dụng <strong>hàm Logistic (Sigmoid Curve)</strong> để uốn nắn đường hồi quy thành hình chữ S, giới hạn kết quả luôn nằm trong khoảng xác suất từ [0, 1]. Thay vì tối thiểu hóa phần dư, nó sử dụng thuật toán <strong>Maximum Likelihood Estimation (MLE)</strong> để tìm ra hệ số làm tối đa hóa xác suất thu được các dữ liệu quan sát được.</p>
        <p>Trung tâm của Logistic Regression là khái niệm <strong>Logit (Log của Odds)</strong>. <em>Odds</em> là tỷ lệ giữa xác suất xảy ra sự kiện và xác suất không xảy ra sự kiện <code>(p / (1-p))</code>.</p>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Quy Trình Phân Tích Thực Chiến</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Đánh Giá Độ Phù Hợp (Model Fit)</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-blue-600">Omnibus Tests (Chi-square):</span> Sig < 0.05. Chứng minh mô hình có các biến độc lập dự báo tốt hơn mô hình Null (chỉ có hằng số).</li>
                    <li><span class="font-bold text-blue-600">-2 Log Likelihood:</span> Trị số càng nhỏ càng tốt, thể hiện mức độ "unexplained variance" (phương sai không giải thích được) càng ít.</li>
                    <li><span class="font-bold text-blue-600">Pseudo R²:</span> (Cox & Snell / Nagelkerke). Khác R² của OLS, đây là giá trị giả lập, thường dao động 0.2 - 0.5 là có thể chấp nhận.</li>
                    <li><span class="font-bold text-blue-600">Hosmer-Lemeshow Test:</span> Trái ngược với các test khác, ở đây ta cần <strong>Sig > 0.05</strong> để chứng minh dữ liệu dự báo KHÔNG có khác biệt với dữ liệu quan sát thực tế (Model fit tốt).</li>
                </ul>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Ma Trận Nhầm Lẫn (Confusion Matrix)</h4>
                <p class="text-sm mb-3">Đo lường năng lực phân loại thực tế của mô hình thông qua Bảng Phân loại (Classification Table).</p>
                <ul class="space-y-2 text-sm font-medium">
                    <li><strong>Overall Percentage:</strong> Tỷ lệ dự đoán đúng tổng thể (Thường > 70% là rất tốt trong khoa học xã hội).</li>
                    <li><strong>Sensitivity (Độ nhạy):</strong> Tỷ lệ dự đoán chính xác sự kiện (Event = 1).</li>
                    <li><strong>Specificity (Độ đặc hiệu):</strong> Tỷ lệ dự đoán chính xác phi sự kiện (Event = 0).</li>
                </ul>
            </div>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Báo Cáo Ý Nghĩa Của Exp(B) - Odds Ratio</h3>
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p class="mb-4">Hạt nhân của việc giải thích Logistic Regression nằm ở <strong>Exp(B) - Odds Ratio (Tỷ số chênh lệch)</strong>:</p>
            <ul class="list-disc pl-5 space-y-3 text-sm">
                <li><strong>Exp(B) > 1:</strong> Biến độc lập X có tác động THUẬN lên Y. Tăng X thêm 1 đơn vị, khả năng xảy ra sự kiện Y sẽ TĂNG lên <code>(Exp(B) - 1)*100</code> phần trăm. <br/><em>Ví dụ: Tăng thu nhập 1 triệu, tỷ lệ mở thẻ (Odds) tăng gấp 1.5 lần.</em></li>
                <li><strong>Exp(B) < 1:</strong> Biến độc lập X có tác động NGHỊCH. Tăng X thêm 1 đơn vị, khả năng xảy ra sự kiện Y sẽ GIẢM đi <code>(1 - Exp(B))*100</code> phần trăm.</li>
                <li><strong>Biến giả (Dummy Variables):</strong> Khi X là phân loại (VD: Giới tính), Exp(B) là tỷ lệ Odds của nhóm đang xét so sánh với nhóm tham chiếu (Reference Group).</li>
            </ul>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Hosmer Jr, D. W., Lemeshow, S., & Sturdivant, R. X. (2013). <em>Applied logistic regression</em> (Vol. 398). John Wiley & Sons.</p>
            <p>Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2018). <em>Multivariate data analysis</em> (8th ed.). Cengage Learning.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Classification"}',
    '{"icon_name": "GitMerge"}'
),
(
    'scenario-compare',
    'method',
    'Kịch bản 5: So sánh Khác biệt (T-test & ANOVA)',
    'Scenario 5: Mean Comparison (T-test & ANOVA)',
    'Đánh giá sự khác biệt mang ý nghĩa thống kê về trị số trung bình của các nhóm định tính. Phân tích nền tảng trong thực nghiệm.',
    'Assessing statistically significant differences in means across categorical groups. Foundational analysis in experiments.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
        <p class="mb-3">Kiểm định sự khác biệt giá trị trung bình (Mean Comparison) là lõi của các nghiên cứu thực nghiệm (A/B testing, y sinh học) hoặc phân tích đặc điểm nhân khẩu học trong khảo sát.</p>
        <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Independent Samples T-Test:</strong> Dùng khi muốn so sánh trung bình của ĐÚNG 2 nhóm độc lập (Ví dụ: Nhóm Khách hàng Nam vs Nữ). Nó phân tích xem sự chênh lệch (diff) giữa 2 nhóm có đủ lớn so với sự dao động ngẫu nhiên (standard error) hay không.</li>
            <li><strong>One-way ANOVA (Analysis of Variance):</strong> Dùng khi so sánh TỪ 3 NHÓM TRỞ LÊN (VD: Cấp quản lý, Nhân viên, Thực tập sinh). Thuật toán phân tích tỷ lệ giữa <em>phương sai giữa các nhóm (Between-groups)</em> và <em>phương sai trong nội bộ nhóm (Within-groups)</em> (Chỉ số F). Nếu F đủ lớn (Sig < 0.05), ít nhất có một cặp nhóm khác biệt nhau.</li>
        </ul>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Quy Trình Thực Hiện & Kiểm Định</h3>
        <div class="space-y-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Giai đoạn 1</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Kiểm định Phương Sai Đồng Nhất (Levene Test)</h4>
                    <p class="text-sm mt-2">Trước khi xem xét P-value của T-test hay ANOVA, <strong>bắt buộc</strong> phải đọc bảng Levene''s Test để xem phương sai giữa các nhóm có bằng nhau không.
                    <br/>- Nếu <strong>Sig. Levene > 0.05:</strong> Phương sai đồng nhất. Đọc kết quả "Equal variances assumed" (T-test) hoặc bảng ANOVA chuẩn.
                    <br/>- Nếu <strong>Sig. Levene < 0.05:</strong> Phương sai KHÔNG đồng nhất. Hệ thống phải đọc kết quả "Equal variances not assumed" (Welch t-test) hoặc Welch ANOVA để tránh sai số loại I.</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Giai đoạn 2</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Quyết Định Thống Kê (Decision)</h4>
                    <p class="text-sm mt-2">Đọc Sig. (2-tailed) của t-test hoặc Sig. của F-test. Nếu Sig. < 0.05, có bằng chứng thống kê để kết luận có sự khác biệt giữa các nhóm. Nếu Sig. > 0.05, ta kết luận không có sự khác biệt về mặt ý nghĩa, mọi chênh lệch nếu có chỉ là ngẫu nhiên.</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-start">
                <div class="bg-blue-100 text-blue-600 font-bold px-3 py-1 rounded-lg shrink-0 mt-1">Giai đoạn 3</div>
                <div>
                    <h4 class="font-bold text-slate-900 text-lg">Kiểm Định Hậu Định (Post-Hoc Test - Chỉ dành cho ANOVA)</h4>
                    <p class="text-sm mt-2">ANOVA chỉ cho biết "Có ít nhất 1 cặp khác nhau" nhưng KHÔNG chỉ ra là cặp nào. Vì vậy, ta phải chạy Post-Hoc:
                    <br/>- Phương sai đồng nhất: Chạy <strong>Tukey HSD</strong> (Phổ biến nhất, kiểm soát lạm phát sai số).
                    <br/>- Phương sai KHÔNG đồng nhất: Chạy <strong>Games-Howell</strong>.</p>
                </div>
            </div>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Gastwirth, J. L., Gel, Y. R., & Miao, W. (2009). The impact of Levene test of equality of variances on statistical theory and practice. <em>Statistical Science</em>, 24(3), 343-360.</p>
            <p>Howell, D. C. (2012). <em>Statistical methods for psychology</em> (8th ed.). Cengage Learning.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Difference Analysis"}',
    '{"icon_name": "Users"}'
),
(
    'scenario-scale',
    'method',
    'Kịch bản 6: Phát triển và Thẩm định Thang đo (EFA)',
    'Scenario 6: Scale Development (EFA)',
    'Thanh lọc biến, cô đọng dữ liệu và khám phá cấu trúc nhân tố ẩn. Bước đệm bắt buộc trước khi hồi quy.',
    'Variable purification, data reduction, and latent structure exploration. Mandatory precursor to regression.',
    to_json('<div class="space-y-10 text-slate-700 leading-relaxed">
    <div class="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <h3 class="text-2xl font-black text-indigo-900 mb-4 flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> 1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
        <p class="mb-3"><strong>Phân tích Nhân tố Khám phá (Exploratory Factor Analysis - EFA)</strong> là một kỹ thuật giảm thiểu dữ liệu (Data Reduction). Nhiệm vụ của nó là rút gọn hàng chục/hàng trăm câu hỏi khảo sát (Items/Observed Variables) thành một vài nhóm cốt lõi (Factors/Latent Variables) có ý nghĩa lý thuyết, dựa trên mô hình tương quan tuyến tính giữa chúng.</p>
        <p class="mb-3">EFA không dựa trên bất kỳ định hướng trước nào (a priori). Nó để cho dữ liệu "tự lên tiếng". Điều này phân biệt EFA với CFA (Nơi người nghiên cứu ép các biến vào các nhân tố cụ thể). EFA là bước THANH LỌC bắt buộc để loại bỏ các câu hỏi rác (gây nhiễu, tải trọng chéo) trước khi đưa các nhân tố sạch vào mô hình Hồi quy OLS đa biến.</p>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">2</span> Chuẩn Mực Hàn Lâm Đánh Giá EFA</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Điều Kiện Khởi Chạy (Prerequisites)</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-blue-600">Cronbach''s Alpha sơ bộ:</span> Phải chạy kiểm định độ tin cậy nội bộ trước. Bỏ các biến có Corrected Item-Total Correlation < 0.3.</li>
                    <li><span class="font-bold text-blue-600">Hệ số KMO (Kaiser-Meyer-Olkin):</span> Phải nằm trong khoảng <strong>0.50 đến 1.00</strong> (Tốt nhất > 0.70). Đo lường sự thích hợp của mẫu dữ liệu.</li>
                    <li><span class="font-bold text-blue-600">Bartlett''s Test of Sphericity:</span> Sig < 0.05. Chứng minh các biến quan sát có tương quan với nhau trong tổng thể, đủ điều kiện gom nhóm.</li>
                </ul>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 class="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Tiêu Chuẩn Rút Trích (Extraction Metrics)</h4>
                <ul class="space-y-3 text-sm">
                    <li><span class="font-bold text-blue-600">Eigenvalue:</span> Theo tiêu chuẩn Kaiser, chỉ giữ lại các nhân tố có Eigenvalue > 1.0.</li>
                    <li><span class="font-bold text-blue-600">Tổng phương sai trích (Cumulative %):</span> Phải giải thích được tối thiểu <strong>50%</strong> (Trong khoa học xã hội) sự biến thiên của toàn bộ dữ liệu.</li>
                    <li><span class="font-bold text-blue-600">Phép xoay (Rotation):</span> <em>Varimax</em> (Phổ biến, ép các nhân tố độc lập) hoặc <em>Promax</em> (Cho phép các nhân tố có tương quan thực tế).</li>
                </ul>
            </div>
        </div>
    </div>
    <div>
        <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg shadow-md">3</span> Báo Cáo Ma Trận Xoay (Pattern/Rotated Matrix)</h3>
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <p class="mb-4">Kết quả quan trọng nhất của EFA là Ma trận Nhân tố đã xoay. Các quy tắc "Tử thần" cần loại bỏ biến ngay lập tức:</p>
            <ol class="list-decimal pl-5 space-y-3 text-sm font-medium">
                <li><strong>Hệ số tải (Factor Loading) quá thấp:</strong> Biến có tải trọng lớn nhất < 0.50 (Không đại diện được cho ai).</li>
                <li><strong>Tải trọng chéo (Cross-loading / Phân biệt kém):</strong> Biến tải lên ĐỒNG THỜI 2 nhân tố mà chênh lệch giữa hai hệ số tải trọng (Max_Loading - Second_Max_Loading) <strong>< 0.30</strong>. (Biến bị "Bắt cá hai tay").</li>
                <li><strong>Nhân tố đơn độc (Single-item factor):</strong> Nhân tố tách ra nhưng chỉ chứa 1 hoặc 2 biến quan sát (Thiếu tính đại diện vững chắc, tối thiểu nên có 3 items).</li>
            </ol>
            <p class="mt-4 text-sm text-slate-600"><em>Lưu ý: Quá trình loại bỏ biến trong EFA phải làm tuần tự TỪNG BIẾN MỘT (loại biến xấu nhất trước, sau đó chạy lại lệnh từ đầu) để đảm bảo không bị hiệu ứng domino làm lệch cấu trúc.</em></p>
        </div>
    </div>
    <div class="p-6 bg-slate-900 rounded-2xl text-slate-300 text-sm mt-10 border-l-4 border-indigo-500 shadow-xl">
        <strong class="text-white text-base block mb-3">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong>
        <div class="space-y-3">
            <p>Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2018). <em>Multivariate data analysis</em> (8th ed.). Cengage Learning.</p>
            <p>DeVellis, R. F. (2016). <em>Scale development: Theory and applications</em> (4th ed.). Sage publications.</p>
        </div>
    </div>
</div>'::text),
    NULL,
    '{"Research Scenarios", "Reliability & Validity"}',
    '{"icon_name": "Layers"}'
)
ON CONFLICT (slug) DO UPDATE SET
    title_vi = EXCLUDED.title_vi,
    description_vi = EXCLUDED.description_vi,
    content_vi = EXCLUDED.content_vi;