import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://xfftxehejtmxcoftkkmo.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnR4ZWhlanRteGNvZnRra21vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk3MTY2OCwiZXhwIjoyMDg0NTQ3NjY4fQ.C8nIHqDdaZGfz4mX7eYK5Or_0gyVydXXX4jum8E_ITU"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const scenarios = [
    {
        "id": "scenario-pls-sem",
        "html": `
            <div class="space-y-8 text-slate-700 leading-relaxed">
                <!-- Header Insight -->
                <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h3 class="text-xl font-black text-indigo-900 mb-2">1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
                    <p class="mb-3"><strong>PLS-SEM (Partial Least Squares Structural Equation Modeling)</strong> là kỹ thuật phân tích đa biến thế hệ thứ hai (Second-generation technique) dựa trên phương pháp tối đa hóa phương sai được giải thích (Variance-based) của các cấu trúc nội sinh (Hair et al., 2019).</p>
                    <p>Không giống như CB-SEM, PLS-SEM không yêu cầu dữ liệu tuân theo phân phối chuẩn nhiều chiều (Multivariate Normal Distribution). Thuật toán này sử dụng kỹ thuật <strong>Bootstrapping phi tham số</strong> (lấy mẫu lặp lại ngẫu nhiên có hoàn lại) để tạo ra các phân phối thống kê thực nghiệm, từ đó tính toán sai số chuẩn (Standard Errors) và giá trị p-value nhằm kiểm định độ tin cậy của các giả thuyết.</p>
                </div>

                <!-- Application -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span> Kịch Bản Nghiên Cứu Ứng Dụng</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-2">Bối Cảnh (Context):</h4>
                        <p class="mb-4">Nghiên cứu tác động của "Trải nghiệm người dùng" (UX) và "Giá trị cảm nhận" (Perceived Value) đến "Sự hài lòng" (Satisfaction), từ đó dẫn đến "Lòng trung thành" (Loyalty) đối với một nền tảng SaaS khởi nghiệp.</p>
                        <h4 class="font-bold text-slate-900 mb-2">Biện Luận Phương Pháp (Methodological Justification):</h4>
                        <ul class="list-disc pl-5 space-y-2">
                            <li><strong>Cỡ mẫu hạn chế (Small Sample Size):</strong> Nền tảng mới ra mắt, dữ liệu thu thập chỉ đạt n=120. PLS-SEM vẫn duy trì được sức mạnh thống kê (Statistical Power) trong điều kiện này.</li>
                            <li><strong>Mục tiêu cốt lõi:</strong> Trọng tâm của nghiên cứu là <em>dự báo (prediction)</em> hành vi Lòng trung thành của người dùng thay vì kiểm định/khẳng định lại một lý thuyết đã phát triển mạnh (Theory Confirmation).</li>
                        </ul>
                    </div>
                </div>

                <!-- Auto Pilot Workflow -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">3</span> Quy Trình Thực Thi Liên Hoàn (Auto Pilot Workflow)</h3>
                    <div class="space-y-4">
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">1</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Đánh giá Mô hình Đo lường (Measurement Model Assessment)</h4>
                                <p class="text-sm mt-1">Kiểm định giá trị hội tụ thông qua Hệ số tải ngoài (Outer Loadings > 0.708) và Phương sai trích trung bình (AVE > 0.50). Đánh giá độ tin cậy bằng Composite Reliability (CR) và rho_A.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">2</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Tính Phân biệt (Discriminant Validity - HTMT)</h4>
                                <p class="text-sm mt-1">Hệ thống áp dụng tỷ số Heterotrait-Monotrait Ratio (HTMT) thay vì Fornell-Larcker theo tiêu chuẩn mới nhất của Henseler et al. (2015). Yêu cầu HTMT &lt; 0.85 (hoặc 0.90 với khái niệm tương đồng).</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">3</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Đánh giá Mô hình Cấu trúc (Structural Model - Bootstrapping)</h4>
                                <p class="text-sm mt-1">Kích hoạt Bootstrapping (5,000 resamples) để đánh giá hệ số tác động (Path Coefficients) và p-value. Phân tích hệ số xác định R² và chỉ số dự báo ngoài mẫu Q² (Blindfolding).</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reference -->
                <div class="p-5 bg-slate-900 rounded-xl text-slate-300 text-sm mt-8 border-l-4 border-indigo-500">
                    <strong class="text-white">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong><br/>
                    Hair, J. F., Risher, J. J., Sarstedt, M., & Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review</em>, 31(1), 2-24.<br/>
                    Henseler, J., Ringle, C. M., & Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. <em>Journal of the Academy of Marketing Science</em>, 43(1), 115-135.
                </div>
            </div>`
    },
    {
        "id": "scenario-cb-sem",
        "html": `
            <div class="space-y-8 text-slate-700 leading-relaxed">
                <!-- Header Insight -->
                <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h3 class="text-xl font-black text-indigo-900 mb-2">1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
                    <p class="mb-3"><strong>CB-SEM (Covariance-Based Structural Equation Modeling)</strong> là kỹ thuật mô hình hóa cấu trúc dựa trên ma trận hiệp phương sai. Trái ngược với mục tiêu tối đa hóa phương sai của PLS-SEM, CB-SEM tập trung vào việc ước lượng các thông số mô hình sao cho ma trận hiệp phương sai được ngụ ý (Implied Covariance Matrix) càng sát với ma trận hiệp phương sai của mẫu thực tế (Sample Covariance Matrix) càng tốt.</p>
                    <p>Vì tính chất chặt chẽ này, CB-SEM là <em>Tiêu chuẩn Vàng (Gold Standard)</em> để <strong>Khẳng định và Kiểm định Lý thuyết (Theory Confirmation/Testing)</strong>. Nó đòi hỏi dữ liệu tuân thủ phân phối chuẩn nhiều chiều nghiêm ngặt và kích thước mẫu đủ lớn (thường N > 200).</p>
                </div>

                <!-- Application -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span> Kịch Bản Nghiên Cứu Ứng Dụng</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-2">Bối Cảnh (Context):</h4>
                        <p class="mb-4">Nghiên cứu kiểm định lại Mô hình Chấp nhận Công nghệ (TAM) kinh điển của Davis (1989) trong bối cảnh sinh viên đại học sử dụng Generative AI (ví dụ: ChatGPT) cho học tập (N=450).</p>
                        <h4 class="font-bold text-slate-900 mb-2">Biện Luận Phương Pháp (Methodological Justification):</h4>
                        <ul class="list-disc pl-5 space-y-2">
                            <li><strong>Lý thuyết vững chắc (Strong Theory):</strong> TAM đã được kiểm chứng bằng hàng ngàn nghiên cứu trên thế giới. Bạn không khám phá lý thuyết mới, mà đang kiểm tra xem lý thuyết này có còn đúng (fit) trong bối cảnh AI giáo dục tại Việt Nam hay không.</li>
                            <li><strong>Quy mô dữ liệu:</strong> Cỡ mẫu lớn (N=450) và thỏa mãn phân phối chuẩn, rất lý tưởng cho công cụ Maximum Likelihood (ML) của CB-SEM.</li>
                        </ul>
                    </div>
                </div>

                <!-- Auto Pilot Workflow -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">3</span> Quy Trình Thực Thi Liên Hoàn (Auto Pilot Workflow)</h3>
                    <div class="space-y-4">
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">1</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Phân Tích Nhân Tố Khẳng Định (Confirmatory Factor Analysis - CFA)</h4>
                                <p class="text-sm mt-1">Đánh giá độ phù hợp của mô hình đo lường toàn cục. Hệ thống sẽ tự động quét và tính toán các chỉ số Model Fit quan trọng: Chi-square/df (&lt; 3), CFI (&gt; 0.90), TLI (&gt; 0.90), RMSEA (&lt; 0.08) và SRMR (&lt; 0.08).</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">2</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Kiểm Định Độ Tin Cậy & Giá Trị (Reliability & Validity)</h4>
                                <p class="text-sm mt-1">Trích xuất Factor Loadings để tính toán tự động Composite Reliability (CR) và Average Variance Extracted (AVE). Đảm bảo giá trị phân biệt qua kiểm định Fornell-Larcker.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">3</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Mô Hình Cấu Trúc (Structural Equation Modeling)</h4>
                                <p class="text-sm mt-1">Kiểm định đồng thời toàn bộ mạng lưới cấu trúc nhân quả (Simultaneous Equation Solving). Đánh giá hệ số Beta chưa chuẩn hóa/chuẩn hóa và trị số p-value của các giả thuyết H1, H2, H3.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reference -->
                <div class="p-5 bg-slate-900 rounded-xl text-slate-300 text-sm mt-8 border-l-4 border-indigo-500">
                    <strong class="text-white">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong><br/>
                    Kline, R. B. (2015). <em>Principles and practice of structural equation modeling</em> (4th ed.). Guilford publications.<br/>
                    Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2018). <em>Multivariate data analysis</em> (8th ed.). Cengage Learning.
                </div>
            </div>`
    },
    {
        "id": "scenario-regression",
        "html": `
            <div class="space-y-8 text-slate-700 leading-relaxed">
                <!-- Header Insight -->
                <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h3 class="text-xl font-black text-indigo-900 mb-2">1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
                    <p class="mb-3"><strong>Hồi quy Tuyến tính Đa biến (Multiple Linear Regression - OLS)</strong> là phương pháp nền tảng mạnh mẽ dùng để mô hình hóa mối quan hệ tuyến tính giữa một biến phụ thuộc (Dependent Variable - Y) và nhiều biến độc lập (Independent Variables - X_i).</p>
                    <p>Thuật toán Bình phương Tối thiểu Thông thường (OLS - Ordinary Least Squares) tìm cách tối thiểu hóa tổng bình phương phần dư (Sum of Squared Residuals) để tìm ra đường thẳng/siêu phẳng (Hyperplane) phù hợp nhất với dữ liệu. Yêu cầu của phương pháp này là không có hiện tượng <strong>Đa cộng tuyến (Multicollinearity)</strong> nghiêm trọng giữa các biến độc lập và phần dư phải có phân phối chuẩn đồng nhất (Homoscedasticity).</p>
                </div>

                <!-- Application -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span> Kịch Bản Nghiên Cứu Ứng Dụng</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-2">Bối Cảnh (Context):</h4>
                        <p class="mb-4">Khảo sát ảnh hưởng trực tiếp của 4 yếu tố: "Môi trường làm việc" (X1), "Lương thưởng" (X2), "Mối quan hệ đồng nghiệp" (X3), và "Chất lượng lãnh đạo" (X4) đến "Hiệu suất công việc" (Y) của nhân sự ngành IT.</p>
                        <h4 class="font-bold text-slate-900 mb-2">Biện Luận Phương Pháp (Methodological Justification):</h4>
                        <ul class="list-disc pl-5 space-y-2">
                            <li><strong>Kiến trúc tác động đơn tầng (Single-level impact):</strong> Toàn bộ các biến độc lập tác động trực tiếp và song song lên một biến đích duy nhất, không có biến trung gian phức tạp. OLS là công cụ hoàn hảo, nhẹ và độ chính xác cao nhất cho kiến trúc này.</li>
                            <li><strong>Phân tích tầm quan trọng (Importance Analysis):</strong> Hồi quy cung cấp Hệ số Beta chuẩn hóa (Standardized Beta Coefficients), giúp nhà quản lý xác định yếu tố nào (ví dụ: Lương hay Đồng nghiệp) có sức mạnh tác động lớn nhất để ưu tiên nguồn lực.</li>
                        </ul>
                    </div>
                </div>

                <!-- Auto Pilot Workflow -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">3</span> Quy Trình Thực Thi Liên Hoàn (Auto Pilot Workflow)</h3>
                    <div class="space-y-4">
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">1</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Ma Trận Tương Quan Pearson (Correlation Matrix)</h4>
                                <p class="text-sm mt-1">Đánh giá nhanh chiều hướng và sức mạnh tương quan tuyến tính (r) giữa các biến. Phát hiện sớm các cặp biến độc lập có hệ số tương quan r > 0.8 (nguy cơ đa cộng tuyến).</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">2</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Kiểm định Sự phù hợp Toàn cục (ANOVA / F-test)</h4>
                                <p class="text-sm mt-1">Hệ thống phân tích mô hình tổng quát (Model Summary) trả về Adjusted R-Square để đánh giá mô hình giải thích được bao nhiêu % sự biến thiên của Y. Nếu Sig. của kiểm định F &lt; 0.05, mô hình hồi quy hoàn toàn hợp lệ.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">3</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Trích xuất Hệ Số Beta & VIF (Coefficients Analysis)</h4>
                                <p class="text-sm mt-1">Xuất bảng trọng số hồi quy để kiểm định t-test cho từng biến. Tự động kiểm soát hiện tượng Đa cộng tuyến thông qua Hệ số phóng đại phương sai (Variance Inflation Factor - VIF). Hệ thống sẽ cảnh báo đỏ nếu VIF > 5.0 (Field, 2013).</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reference -->
                <div class="p-5 bg-slate-900 rounded-xl text-slate-300 text-sm mt-8 border-l-4 border-indigo-500">
                    <strong class="text-white">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong><br/>
                    Field, A. (2013). <em>Discovering statistics using IBM SPSS statistics</em> (4th ed.). Sage publications.<br/>
                    Wooldridge, J. M. (2015). <em>Introductory econometrics: A modern approach</em> (6th ed.). Cengage Learning.
                </div>
            </div>`
    },
    {
        "id": "scenario-logistic",
        "html": `
            <div class="space-y-8 text-slate-700 leading-relaxed">
                <!-- Header Insight -->
                <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h3 class="text-xl font-black text-indigo-900 mb-2">1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
                    <p class="mb-3">Khi biến phụ thuộc (Dependent Variable) không phải là thang đo định lượng liên tục mà là một quyết định phân loại nhị phân (Ví dụ: Có/Không, Sống/Chết, Vỡ nợ/Không vỡ nợ), Hồi quy OLS tuyến tính sẽ thất bại và đưa ra các dự báo vô lý (ngoài khoảng 0-1).</p>
                    <p><strong>Hồi quy Logistic Nhị phân (Binary Logistic Regression)</strong> là giải pháp chuẩn mực. Phương pháp này áp dụng hàm Sigmoid để chuyển đổi (transform) các giá trị dự báo vào khoảng 0 đến 1, biểu diễn xác suất xảy ra sự kiện. Nó tối đa hóa hàm Likelihood (Maximum Likelihood Estimation - MLE) thay vì tối thiểu hóa phần dư. Kết quả trung tâm là <strong>Odds Ratio (Tỷ số chênh lệch - Exp(B))</strong>.</p>
                </div>

                <!-- Application -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span> Kịch Bản Nghiên Cứu Ứng Dụng</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-2">Bối Cảnh (Context):</h4>
                        <p class="mb-4">Bộ phận Marketing của một ngân hàng cần dự đoán khả năng "Mở thẻ tín dụng" (1 = Mở, 0 = Không mở) dựa trên hồ sơ khách hàng: "Thu nhập hàng tháng" (X1 - liên tục), "Lịch sử nợ xấu" (X2 - phân loại), và "Số năm giao dịch" (X3).</p>
                        <h4 class="font-bold text-slate-900 mb-2">Biện Luận Phương Pháp (Methodological Justification):</h4>
                        <ul class="list-disc pl-5 space-y-2">
                            <li><strong>Phân loại nhị phân (Binary Classification):</strong> Yêu cầu nghiên cứu không phải là đo lường cường độ, mà là dự báo chính xác một trong hai hành vi. Logistic Regression cho phép kết hợp hoàn hảo cả biến độc lập định lượng (Thu nhập) và định tính (Lịch sử nợ xấu) trong cùng một phương trình.</li>
                            <li><strong>Ý nghĩa kinh doanh thực tiễn:</strong> Odds Ratio cung cấp góc nhìn cực kỳ thực tiễn: "Khách hàng thu nhập trên 30 triệu có xác suất (odds) mở thẻ cao gấp 4.5 lần nhóm dưới 15 triệu".</li>
                        </ul>
                    </div>
                </div>

                <!-- Auto Pilot Workflow -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">3</span> Quy Trình Thực Thi Liên Hoàn (Auto Pilot Workflow)</h3>
                    <div class="space-y-4">
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">1</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Mã hóa Dữ liệu Tự động (Dummy Encoding)</h4>
                                <p class="text-sm mt-1">Hệ thống phân tích bản chất các biến, tự động thiết lập biến giả (Dummy variable) cho các biến định danh nhiều nhóm. Đảm bảo biến phụ thuộc được ánh xạ chặt chẽ thành 0 (Reference) và 1 (Target Event).</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">2</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Ước lượng Mô Hình và Phù Hợp (Model Fit Analysis)</h4>
                                <p class="text-sm mt-1">Chạy mô hình Block 0 (chưa có biến độc lập) và Block 1 (có biến độc lập) để so sánh chỉ số -2 Log Likelihood. Tính toán Cox & Snell R-square và Nagelkerke R-square để xác định độ mạnh của mô hình.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">3</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Phân tích Hệ Số Exp(B) và Confusion Matrix</h4>
                                <p class="text-sm mt-1">Giải nghĩa chỉ số Odds Ratio (Exp B) để tìm ra những nhân tố có đòn bẩy dự báo mạnh nhất. Khởi tạo Ma trận Nhầm lẫn (Confusion Matrix) để đánh giá tỷ lệ dự báo đúng tổng thể (Overall Percentage Accuracy).</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reference -->
                <div class="p-5 bg-slate-900 rounded-xl text-slate-300 text-sm mt-8 border-l-4 border-indigo-500">
                    <strong class="text-white">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong><br/>
                    Hosmer Jr, D. W., Lemeshow, S., & Sturdivant, R. X. (2013). <em>Applied logistic regression</em> (Vol. 398). John Wiley & Sons.
                </div>
            </div>`
    },
    {
        "id": "scenario-compare",
        "html": `
            <div class="space-y-8 text-slate-700 leading-relaxed">
                <!-- Header Insight -->
                <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h3 class="text-xl font-black text-indigo-900 mb-2">1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
                    <p class="mb-3">Kiểm định khác biệt giá trị trung bình (Mean Comparison) là xương sống của phương pháp thực nghiệm và khảo sát để phân tích ảnh hưởng của nhân khẩu học (Demographics) hoặc các can thiệp (Interventions).</p>
                    <p>Hai công cụ thống kê vô hướng cơ bản nhất là <strong>Independent Samples T-Test</strong> (áp dụng khi biến độc lập phân nhóm chỉ có ĐÚNG 2 cấp độ như Nam/Nữ) và <strong>One-way ANOVA (Phân tích Phương sai một yếu tố)</strong> (áp dụng khi biến phân nhóm có TỪ 3 cấp độ trở lên). Cả hai phương pháp đều dựa trên kiểm định thống kê F hoặc t để so sánh phương sai giữa các nhóm (Between-group Variance) so với phương sai trong nội bộ nhóm (Within-group Variance).</p>
                </div>

                <!-- Application -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span> Kịch Bản Nghiên Cứu Ứng Dụng</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-2">Bối Cảnh (Context):</h4>
                        <p class="mb-4">Trong một báo cáo nghiên cứu thị trường F&B (Fast Food), nhà quản lý muốn biết: <br/>1. Nam và Nữ có sự khác biệt về "Mức độ sẵn sàng chi trả" không? <br/>2. Các nhóm Thu nhập (&lt;10tr, 10-20tr, &gt;20tr) có sự khác biệt về "Sự trung thành với thương hiệu" không?</p>
                        <h4 class="font-bold text-slate-900 mb-2">Biện Luận Phương Pháp (Methodological Justification):</h4>
                        <ul class="list-disc pl-5 space-y-2">
                            <li><strong>Phân luồng thông minh:</strong> Câu hỏi (1) rõ ràng yêu cầu T-test vì Giới tính chỉ có 2 nhóm định danh. Trong khi câu hỏi (2) có 3 cấp độ thu nhập, bắt buộc phải dùng ANOVA để tránh việc làm phình sai số loại I (Type I Error) nếu cứ cố tình chạy 3 cái T-test riêng biệt.</li>
                        </ul>
                    </div>
                </div>

                <!-- Auto Pilot Workflow -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">3</span> Quy Trình Thực Thi Liên Hoàn (Auto Pilot Workflow)</h3>
                    <p class="mb-4">Hệ thống <strong>NCSKit Engine</strong> trang bị cơ chế tự chẩn đoán (Auto-diagnostics) để hoàn toàn loại bỏ sai sót của người dùng:</p>
                    <div class="space-y-4">
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">1</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Quét & Nhận Diện Hình Thái Dữ Liệu</h4>
                                <p class="text-sm mt-1">Đếm số lượng categories của biến phân loại. Tự động định tuyến (Routing): 2 nhóm -> Kích hoạt Pipeline T-test; ≥3 nhóm -> Kích hoạt Pipeline ANOVA.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">2</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Kiểm định Phương Sai Đồng Nhất (Levene's Test)</h4>
                                <p class="text-sm mt-1">Luôn chạy Levene's Test trước. Nếu p > 0.05 (phương sai đồng nhất), hệ thống dùng ANOVA/T-test chuẩn. Nếu p &lt; 0.05, hệ thống tự động chuyển sang kiểm định kháng nhiễu (Welch's t-test hoặc Welch's ANOVA) cực kỳ chặt chẽ.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">3</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Kiểm Định Hậu Định (Post-Hoc Analysis)</h4>
                                <p class="text-sm mt-1">Nếu có khác biệt ý nghĩa trong ANOVA (p &lt; 0.05), tự động kích hoạt kiểm định Tukey HSD để liệt kê chính xác cặp nhóm nào tạo ra sự khác biệt (Vd: Khác biệt chỉ xảy ra giữa nhóm &lt;10tr và &gt;20tr).</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reference -->
                <div class="p-5 bg-slate-900 rounded-xl text-slate-300 text-sm mt-8 border-l-4 border-indigo-500">
                    <strong class="text-white">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong><br/>
                    Gastwirth, J. L., Gel, Y. R., & Miao, W. (2009). The impact of Levene's test of equality of variances on statistical theory and practice. <em>Statistical Science</em>, 24(3), 343-360.
                </div>
            </div>`
    },
    {
        "id": "scenario-scale",
        "html": `
            <div class="space-y-8 text-slate-700 leading-relaxed">
                <!-- Header Insight -->
                <div class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                    <h3 class="text-xl font-black text-indigo-900 mb-2">1. Cơ Sở Khoa Học (Theoretical Foundation)</h3>
                    <p class="mb-3">Phát triển và thẩm định thang đo (Scale Development & Validation) là quy trình sống còn để chứng minh chất lượng của dữ liệu định lượng, đảm bảo rằng các câu hỏi khảo sát thực sự đo lường đúng hiện tượng cần nghiên cứu.</p>
                    <p>Khung phân tích tiêu chuẩn bao gồm hai bước lớn: Khám phá cấu trúc tiềm ẩn thông qua <strong>Phân tích nhân tố khám phá (Exploratory Factor Analysis - EFA)</strong> để nhóm các biến quan sát (items) có tương quan mạnh với nhau; tiếp theo là xác nhận độ tinh gọn và chặt chẽ của cấu trúc này bằng <strong>Phân tích nhân tố khẳng định (Confirmatory Factor Analysis - CFA)</strong> nhằm xác thực tính Hội tụ (Convergent Validity) và Phân biệt (Discriminant Validity).</p>
                </div>

                <!-- Application -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span> Kịch Bản Nghiên Cứu Ứng Dụng</h3>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-2">Bối Cảnh (Context):</h4>
                        <p class="mb-4">Bạn biên dịch và hiệu chỉnh lại bộ thang đo "Áp lực học tập tâm lý" từ một bài báo Mỹ, bổ sung thêm 5 câu hỏi mới cho phù hợp bối cảnh văn hóa sinh viên Việt Nam, tổng cộng gồm 25 biến quan sát (items) thuộc 5 khía cạnh.</p>
                        <h4 class="font-bold text-slate-900 mb-2">Biện Luận Phương Pháp (Methodological Justification):</h4>
                        <ul class="list-disc pl-5 space-y-2">
                            <li>Vì thang đo đã bị can thiệp (dịch thuật, sửa đổi, bổ sung items), bạn không thể áp dụng mù quáng lý thuyết gốc. Bạn phải chạy EFA để "lọc" các items gây nhiễu, sau đó chạy CFA để kiểm tra chỉ số độ phù hợp (Model fit) trước khi mang bộ số liệu này đi hồi quy hoặc bảo vệ luận văn.</li>
                        </ul>
                    </div>
                </div>

                <!-- Auto Pilot Workflow -->
                <div>
                    <h3 class="text-xl font-black text-slate-900 mb-4 flex items-center gap-2"><span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">3</span> Quy Trình Thực Thi Liên Hoàn (Auto Pilot Workflow)</h3>
                    <div class="space-y-4">
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">1</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Sàng Lọc Sơ Bộ bằng Cronbach's Alpha</h4>
                                <p class="text-sm mt-1">Đánh giá tính nhất quán (Internal Consistency). Nhận diện các biến có hệ số Tương quan biến tổng (Corrected Item-Total Correlation) &lt; 0.3 để cảnh báo loại bỏ sớm.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">2</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Trích xuất Cấu Trúc Khám Phá (EFA Matrix)</h4>
                                <p class="text-sm mt-1">Áp dụng kiểm định KMO (&gt;0.5) và Bartlett's Test. Sử dụng phương pháp trích PCA hoặc PAF kết hợp phép xoay Promax/Varimax. Hệ thống tự động làm nổi bật (highlight) hiện tượng tải chéo (Cross-loadings) để người dùng dễ nhận diện các biến xấu.</p>
                            </div>
                        </div>
                        <div class="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div class="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center">3</div>
                            <div>
                                <h4 class="font-bold text-slate-900">Khẳng Định Tuyệt Đối (Confirmatory Factor Analysis)</h4>
                                <p class="text-sm mt-1">Xây dựng ma trận CFA dựa trên kết quả EFA. Đo lường chính xác các chỉ số như Chi-square/df, RMSEA, CFI. Cung cấp Modification Indices (MI) để gợi ý vẽ liên kết hiệp phương sai giữa các phần dư (Covariance of Errors) nhằm tối ưu độ phù hợp mô hình.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Reference -->
                <div class="p-5 bg-slate-900 rounded-xl text-slate-300 text-sm mt-8 border-l-4 border-indigo-500">
                    <strong class="text-white">📚 Trích Dẫn Khoa Học Chuẩn APA 7:</strong><br/>
                    DeVellis, R. F. (2016). <em>Scale development: Theory and applications</em> (4th ed.). Sage publications.<br/>
                    Brown, T. A. (2015). <em>Confirmatory factor analysis for applied research</em> (2nd ed.). Guilford publications.
                </div>
            </div>`
    }
]

async function updateDB() {
    console.log("Starting Supabase update...")
    for (const scenario of scenarios) {
        const { data, error } = await supabase
            .from('academy_resources')
            .update({ content_vi: scenario.html })
            .eq('slug', scenario.id)
            .select()
            
        if (error) {
            console.error("Failed to update " + scenario.id + ": ", error)
        } else {
            console.log("Successfully updated " + scenario.id + ". Rows affected: " + data.length)
        }
    }
    console.log("Finished DB update.")
}

updateDB()
