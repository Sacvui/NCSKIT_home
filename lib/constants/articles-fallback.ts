export const STATIC_ARTICLES = [
    {
        slug: 'scenario-pls-sem',
        category: ['Research Scenarios', 'Structural Modeling'],
        icon_name: 'Network',
        title_vi: 'Kịch bản 1: Mô hình Cấu trúc Tuyến tính PLS-SEM',
        title_en: 'Scenario 1: Partial Least Squares SEM',
        description_vi: 'Kịch bản phân tích mô hình cấu trúc với PLS-SEM, phù hợp cho mẫu nhỏ, không yêu cầu phân phối chuẩn và mô hình dự báo phức tạp.',
        content_vi: `
            <div class="space-y-6 text-slate-700">
                <h3 class="text-2xl font-black text-slate-900 border-b pb-2">1. Lý thuyết thống kê cốt lõi</h3>
                <p><strong>PLS-SEM (Partial Least Squares Structural Equation Modeling)</strong> là một phương pháp dựa trên phương sai để ước lượng mô hình cấu trúc. Khác với CB-SEM (dựa trên hiệp phương sai), PLS-SEM tập trung vào việc tối đa hóa phương sai được giải thích của các biến nội sinh (phụ thuộc). Phương pháp này không yêu cầu giả định nghiêm ngặt về phân phối chuẩn của dữ liệu và hoạt động tốt ngay cả với cỡ mẫu nhỏ hoặc mô hình có rất nhiều biến quan sát.</p>
                <p>Trong PLS-SEM, thuật toán <strong>Bootstrapping</strong> (lấy mẫu lặp lại có hoàn lại) được sử dụng để tính toán sai số chuẩn và giá trị p-value nhằm kiểm định ý nghĩa thống kê của các giả thuyết nghiên cứu. Ngoài ra, kỹ thuật <strong>Blindfolding</strong> cung cấp chỉ số Q² để đánh giá mức độ liên quan dự đoán của mô hình.</p>
                
                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">2. Kịch bản nghiên cứu ứng dụng</h3>
                <p><strong>Ngữ cảnh:</strong> Nghiên cứu tác động của "Trải nghiệm khách hàng" và "Giá trị cảm nhận" đến "Sự hài lòng", từ đó dẫn đến "Lòng trung thành" đối với một nền tảng thương mại điện tử mới khởi nghiệp (cỡ mẫu chỉ khoảng 80-100 người).</p>
                <p><strong>Tại sao chọn PLS-SEM?</strong> Do đây là nền tảng mới, dữ liệu thu thập không có phân phối chuẩn, cỡ mẫu nhỏ và mục tiêu chính là <em>dự báo</em> Lòng trung thành hơn là kiểm định lý thuyết nền tảng chặt chẽ.</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">3. Quy trình thực thi liên hoàn trên NCSKit Auto Pilot</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Bước 1 - Cronbach's Alpha:</strong> Kiểm định độ tin cậy của các thang đo Trải nghiệm, Giá trị, Hài lòng và Trung thành (> 0.7).</li>
                    <li><strong>Bước 2 - EFA:</strong> Phân tích nhân tố khám phá để đảm bảo các biến quan sát hội tụ đúng vào 4 nhân tố cốt lõi.</li>
                    <li><strong>Bước 3 - Mô hình cấu trúc (Inner Model):</strong> Ước lượng hệ số tác động (Path Coefficients) và R-square.</li>
                    <li><strong>Bước 4 - Bootstrapping:</strong> Chạy 5000 mẫu lặp để lấy p-value. Nếu p < 0.05, giả thuyết tác động được chấp nhận.</li>
                    <li><strong>Bước 5 - Blindfolding (Q²):</strong> Đánh giá mức độ phù hợp dự báo của mô hình.</li>
                </ul>
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-6">
                    <p class="text-sm text-blue-900 font-bold">📚 Cơ sở khoa học: Hair, J. F., Hult, G. T. M., Ringle, C. M., & Sarstedt, M. (2017). A Primer on PLS-SEM. Sage.</p>
                </div>
            </div>
        `
    },
    {
        slug: 'scenario-cb-sem',
        category: ['Research Scenarios', 'Structural Modeling'],
        icon_name: 'Layers',
        title_vi: 'Kịch bản 2: Mô hình Cấu trúc Tuyến tính CB-SEM',
        title_en: 'Scenario 2: Covariance-Based SEM',
        description_vi: 'Kịch bản kiểm định lý thuyết nền tảng chặt chẽ với mô hình cấu trúc CB-SEM, đòi hỏi cỡ mẫu lớn và phân phối chuẩn.',
        content_vi: `
            <div class="space-y-6 text-slate-700">
                <h3 class="text-2xl font-black text-slate-900 border-b pb-2">1. Lý thuyết thống kê cốt lõi</h3>
                <p><strong>CB-SEM (Covariance-Based Structural Equation Modeling)</strong> là phương pháp dựa trên ma trận hiệp phương sai. Mục tiêu của CB-SEM không phải là dự báo (như PLS) mà là tái tạo lại ma trận hiệp phương sai của tổng thể dựa trên mẫu dữ liệu thu thập. Do đó, CB-SEM rất phù hợp để <em>kiểm định, khẳng định (confirm)</em> một lý thuyết nền tảng đã vững chắc.</p>
                <p>Tuy nhiên, nó đòi hỏi nghiêm ngặt: kích thước mẫu phải đủ lớn (thường > 200), dữ liệu phải có phân phối chuẩn nhiều chiều, và mô hình phải được chỉ định chính xác từ trước.</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">2. Kịch bản nghiên cứu ứng dụng</h3>
                <p><strong>Ngữ cảnh:</strong> Nghiên cứu áp dụng Mô hình Chấp nhận Công nghệ (TAM) để giải thích ý định sử dụng hệ thống AI của sinh viên. Lý thuyết TAM (Davis, 1989) đã được chứng minh qua hàng nghìn nghiên cứu. Mục tiêu ở đây là khẳng định lại mô hình này trên tập mẫu 500 sinh viên tại Việt Nam.</p>
                <p><strong>Tại sao chọn CB-SEM?</strong> Vì TAM là lý thuyết đã "trưởng thành", cỡ mẫu lớn, và mục tiêu là kiểm định mức độ phù hợp toàn cục của mô hình (Model Fit).</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">3. Quy trình thực thi liên hoàn trên NCSKit Auto Pilot</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Bước 1 - Cronbach's Alpha:</strong> Đánh giá sơ bộ sự nhất quán nội tại.</li>
                    <li><strong>Bước 2 - CFA (Phân tích nhân tố khẳng định):</strong> Đánh giá mức độ phù hợp của mô hình đo lường. Các chỉ số Fit Indices phải đạt chuẩn (CFI > 0.9, RMSEA < 0.08).</li>
                    <li><strong>Bước 3 - CB-SEM (Mô hình cấu trúc):</strong> Kiểm định đồng thời cấu trúc nhân quả. Kết quả trả về các hệ số Beta và p-value cho từng đường dẫn.</li>
                </ul>
                <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl mt-6">
                    <p class="text-sm text-teal-900 font-bold">📚 Cơ sở khoa học: Kline, R. B. (2015). Principles and Practice of Structural Equation Modeling. Guilford publications.</p>
                </div>
            </div>
        `
    },
    {
        slug: 'scenario-regression',
        category: ['Research Scenarios', 'Impact Analysis'],
        icon_name: 'TrendingUp',
        title_vi: 'Kịch bản 3: Tương quan & Hồi quy Đa biến (Linear Regression)',
        title_en: 'Scenario 3: Correlation & Multiple Regression',
        description_vi: 'Kịch bản phân tích tác động truyền thống, đánh giá độ ảnh hưởng của nhiều nhân tố độc lập lên một nhân tố phụ thuộc.',
        content_vi: `
            <div class="space-y-6 text-slate-700">
                <h3 class="text-2xl font-black text-slate-900 border-b pb-2">1. Lý thuyết thống kê cốt lõi</h3>
                <p><strong>Hồi quy tuyến tính đa biến</strong> mô tả mối quan hệ tuyến tính giữa một biến phụ thuộc (y) liên tục và nhiều biến độc lập (x1, x2...). Phương pháp OLS (Bình phương tối thiểu thông thường) tìm cách tối thiểu hóa tổng bình phương phần dư. Chỉ số <strong>R-squared (hiệu chỉnh)</strong> cho biết phần trăm biến thiên của y được giải thích bởi các biến x. <strong>Hệ số Beta chuẩn hóa</strong> cho phép so sánh sức mạnh tác động giữa các biến độc lập.</p>
                <p>Đặc biệt quan trọng trong hồi quy là kiểm tra giả định <strong>Đa cộng tuyến (Multicollinearity)</strong> thông qua hệ số VIF (VIF < 5 là an toàn, VIF > 10 là vi phạm nghiêm trọng).</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">2. Kịch bản nghiên cứu ứng dụng</h3>
                <p><strong>Ngữ cảnh:</strong> Đo lường tác động của "Môi trường làm việc", "Lương thưởng", "Đồng nghiệp", và "Lãnh đạo" lên "Hiệu suất công việc" của nhân viên văn phòng.</p>
                <p><strong>Tại sao chọn Hồi quy Đa biến?</strong> Các biến đều được tính điểm trung bình (Construct scores) và là biến định lượng liên tục. Nghiên cứu chỉ có 1 tầng tác động (không có trung gian/điều tiết phức tạp như SEM).</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">3. Quy trình thực thi liên hoàn trên NCSKit Auto Pilot</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Bước 1 - Cronbach's Alpha:</strong> Loại bỏ biến rác.</li>
                    <li><strong>Bước 2 - Tính điểm đại diện (Construct Scores):</strong> Tự động tính trung bình các biến quan sát để tạo thành biến nghiên cứu tổng quát.</li>
                    <li><strong>Bước 3 - Ma trận Tương quan (Pearson):</strong> Xem xét mối liên hệ tuyến tính 2-2 giữa tất cả các biến.</li>
                    <li><strong>Bước 4 - Hồi quy Đa biến:</strong> Cung cấp bảng hệ số Beta, P-value, VIF, và R-squared hiệu chỉnh.</li>
                </ul>
                <div class="p-4 bg-orange-50 border border-orange-200 rounded-xl mt-6">
                    <p class="text-sm text-orange-900 font-bold">📚 Cơ sở khoa học: Field, A. (2013). Discovering Statistics Using IBM SPSS Statistics. Sage.</p>
                </div>
            </div>
        `
    },
    {
        slug: 'scenario-logistic',
        category: ['Research Scenarios', 'Impact Analysis'],
        icon_name: 'Target',
        title_vi: 'Kịch bản 4: Hồi quy Logistic (Phân loại Nhị phân)',
        title_en: 'Scenario 4: Logistic Regression',
        description_vi: 'Kịch bản phân tích đặc thù khi biến phụ thuộc là định danh nhị phân (Có/Không, Mua/Không Mua).',
        content_vi: `
            <div class="space-y-6 text-slate-700">
                <h3 class="text-2xl font-black text-slate-900 border-b pb-2">1. Lý thuyết thống kê cốt lõi</h3>
                <p>Trái với hồi quy tuyến tính dự báo một giá trị liên tục, <strong>Hồi quy Logistic</strong> dùng để dự báo <em>xác suất</em> xảy ra một sự kiện (biến phụ thuộc chỉ có 2 giá trị 0 hoặc 1). Hàm logit (log của odds) được sử dụng để tuyến tính hóa mối quan hệ.</p>
                <p>Kết quả cốt lõi của mô hình này là <strong>Odds Ratio (Exp(B))</strong>. Nếu OR > 1, sự gia tăng của biến độc lập làm tăng xác suất xảy ra sự kiện. Mức độ phù hợp của mô hình thường được đánh giá qua Pseudo R-square (như Nagelkerke) và Confusion Matrix (Ma trận nhầm lẫn dự báo).</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">2. Kịch bản nghiên cứu ứng dụng</h3>
                <p><strong>Ngữ cảnh:</strong> Nghiên cứu dự báo quyết định "Mua / Không mua" (0/1) gói dịch vụ Premium của người dùng dựa trên "Độ tuổi", "Thu nhập", và "Điểm hài lòng bản Free".</p>
                <p><strong>Tại sao chọn Logistic?</strong> Vì kết quả cuối cùng (biến phụ thuộc) chỉ rơi vào 2 trạng thái phân loại, vi phạm hoàn toàn giả định phần dư chuẩn của Hồi quy tuyến tính (OLS).</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">3. Quy trình thực thi liên hoàn trên NCSKit Auto Pilot</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Bước 1 - Tiền xử lý dữ liệu:</strong> Tự động nhóm các biến thang đo và mã hóa (0/1) cho biến phụ thuộc.</li>
                    <li><strong>Bước 2 - Chạy mô hình Logistic:</strong> Tính toán các hệ số Log-odds và Exp(B) (Odds Ratio).</li>
                    <li><strong>Bước 3 - Đánh giá mô hình:</strong> Hiển thị Pseudo R² và tính toán độ chính xác tổng thể (Accuracy) qua Confusion Matrix (True Positives, False Positives...).</li>
                </ul>
                <div class="p-4 bg-pink-50 border border-pink-200 rounded-xl mt-6">
                    <p class="text-sm text-pink-900 font-bold">📚 Cơ sở khoa học: Hosmer Jr, D. W., Lemeshow, S. (2013). Applied Logistic Regression. Wiley.</p>
                </div>
            </div>
        `
    },
    {
        slug: 'scenario-compare',
        category: ['Research Scenarios', 'Comparison Analysis'],
        icon_name: 'Activity',
        title_vi: 'Kịch bản 5: So sánh Nhóm (T-Test & ANOVA)',
        title_en: 'Scenario 5: Group Comparison (T-Test & ANOVA)',
        description_vi: 'Kịch bản tự động phân luồng kiểm định sự khác biệt về giá trị trung bình giữa các nhóm nhân khẩu học.',
        content_vi: `
            <div class="space-y-6 text-slate-700">
                <h3 class="text-2xl font-black text-slate-900 border-b pb-2">1. Lý thuyết thống kê cốt lõi</h3>
                <p>Khi cần so sánh giá trị trung bình của một biến định lượng (vd: Mức độ hài lòng) giữa các nhóm phân loại (vd: Giới tính, Độ tuổi):</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Independent T-Test:</strong> Dùng khi biến phân loại chỉ có ĐÚNG 2 NHÓM (Nam/Nữ). Kiểm định Levene được dùng trước để kiểm tra tính đồng nhất phương sai.</li>
                    <li><strong>One-way ANOVA:</strong> Dùng khi có TỪ 3 NHÓM TRỞ LÊN (Độ tuổi: <18, 18-25, >25). Nếu F-test có ý nghĩa, <strong>Kiểm định Hậu định (Post-hoc, như Tukey)</strong> được kích hoạt để tìm xem chính xác nhóm nào khác nhóm nào.</li>
                </ul>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">2. Kịch bản nghiên cứu ứng dụng</h3>
                <p><strong>Ngữ cảnh:</strong> Bạn muốn biết xem "Nam và Nữ có sự khác biệt về mức độ Đồng cảm thương hiệu không?" và "Khách hàng ở miền Bắc, Trung, Nam có sự khác biệt về Mức độ chi tiêu không?".</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">3. Quy trình thực thi liên hoàn trên NCSKit Auto Pilot</h3>
                <p>Hệ thống NCSKit có trí tuệ nhân tạo nhận diện số lượng nhóm cực kỳ thông minh:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Bước 1 - Quét Dữ Liệu:</strong> Hệ thống đếm số trạng thái của biến phân nhóm. (Giới tính = 2, Vùng miền = 3).</li>
                    <li><strong>Bước 2 - Phân luồng Tự động:</strong> 
                        <br/>- Với Giới tính -> Tự kích hoạt <strong>Independent T-Test</strong> (kèm theo Levene's Test).
                        <br/>- Với Vùng miền -> Tự kích hoạt <strong>One-way ANOVA</strong>.
                    </li>
                    <li><strong>Bước 3 - Post-hoc:</strong> Trong ANOVA, nếu có khác biệt (p < 0.05), hệ thống tự động chạy Tukey HSD để liệt kê bảng các cặp so sánh (Bắc-Trung, Trung-Nam).</li>
                </ul>
            </div>
        `
    },
    {
        slug: 'scenario-scale',
        category: ['Research Scenarios', 'Factor Analysis'],
        icon_name: 'CheckCircle2',
        title_vi: 'Kịch bản 6: Phát triển Thang đo (EFA & CFA)',
        title_en: 'Scenario 6: Scale Development & Validation',
        description_vi: 'Kịch bản thẩm định chất lượng bộ câu hỏi (thang đo) thông qua sự kết hợp của EFA và CFA để loại bỏ biến rác và khẳng định cấu trúc hội tụ/phân biệt.',
        content_vi: `
            <div class="space-y-6 text-slate-700">
                <h3 class="text-2xl font-black text-slate-900 border-b pb-2">1. Lý thuyết thống kê cốt lõi</h3>
                <p>Việc phát triển một thang đo mới hoặc áp dụng thang đo nước ngoài vào bối cảnh Việt Nam đòi hỏi quy trình nghiêm ngặt. Hệ biến quan sát (items) cần trải qua các bước sàng lọc để chứng minh tính <strong>Hội tụ (Convergent Validity)</strong> và <strong>Phân biệt (Discriminant Validity)</strong>.</p>
                <p>Khởi đầu là Cronbach's Alpha (độ tin cậy nội tại), sau đó là EFA (gom nhóm tự do dựa trên phương sai trích), và cuối cùng là CFA (ép các biến phải chạy theo mô hình lý thuyết để lấy các chỉ số phù hợp CFI, RMSEA...).</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">2. Kịch bản nghiên cứu ứng dụng</h3>
                <p><strong>Ngữ cảnh:</strong> Bạn vừa thiết kế 20 câu hỏi (items) để đo lường 4 khía cạnh của "Động lực học tập trực tuyến" (Động lực nội tại, Ngoại tại, Xã hội, Thành tích). Bạn cần loại bỏ các câu hỏi gây nhiễu trước khi đem dữ liệu đi chạy hồi quy.</p>

                <h3 class="text-2xl font-black text-slate-900 border-b pb-2 mt-8">3. Quy trình thực thi liên hoàn trên NCSKit Auto Pilot</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Bước 1 - Cronbach's Alpha:</strong> Nhận diện các câu hỏi có tương quan biến-tổng (CITC) < 0.3.</li>
                    <li><strong>Bước 2 - EFA:</strong> Chạy phép quay Oblimin/Varimax. Nếu một câu hỏi bị tải (loading) lên 2 nhân tố cùng lúc hoặc tải trọng < 0.5, nó sẽ bị bộc lộ. KMO > 0.5 chứng minh dữ liệu thích hợp.</li>
                    <li><strong>Bước 3 - CFA:</strong> Kiểm định sự thuần khiết cấu trúc. Tính toán các hệ số tương quan giữa các nhân tố tiềm ẩn để khẳng định giá trị phân biệt.</li>
                </ul>
            </div>
        `
    },
    {
        slug: 'cronbach-alpha',
        category: ['Preliminary Analysis'],
        icon_name: 'Brain',
        title_vi: 'Cronbach\'s Alpha Masterclass: Từ Cơ bản đến Chuyên gia',
        title_en: 'Cronbach\'s Alpha Masterclass: From Basics to Expert'
    },
    {
        slug: 'technology-acceptance-model-tam',
        category: ['Research Models'],
        icon_name: 'TrendingUp',
        title_vi: 'Mô hình Chấp nhận Công nghệ (TAM): Hướng dẫn Chuyên sâu',
        title_en: 'Technology Acceptance Model (TAM): The Ultimate Guide'
    },
    {
        slug: 'theory-of-planned-behavior-tpb',
        category: ['Behavioral Research'],
        icon_name: 'Brain',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Chìa khóa giải mã Ý định',
        title_en: 'Theory of Planned Behavior (TPB): Decoding Intentions'
    },
    {
        slug: 'servqual-service-quality-model',
        category: ['Marketing Research'],
        icon_name: 'Layers',
        title_vi: 'Mô hình SERVQUAL: Đo lường Chất lượng Dịch vụ',
        title_en: 'SERVQUAL: Measuring Service Quality'
    },
    {
        slug: 'utaut-technology-adoption',
        category: ['Research Models'],
        icon_name: 'Zap',
        title_vi: 'Thuyết Hợp nhất Chấp nhận Công nghệ (UTAUT)',
        title_en: 'UTAUT: Unified Technology Acceptance'
    },
    {
        slug: 'porter-five-forces-analysis',
        category: ['Market Strategy'],
        icon_name: 'ShieldCheck',
        title_vi: 'Mô hình 5 Áp lực Cạnh tranh (Michael Porter)',
        title_en: 'Porter\'s Five Forces Analysis'
    },
    {
        slug: 'vrio-framework-strategy',
        category: ['Market Strategy'],
        icon_name: 'Layers',
        title_vi: 'Khung VRIO: Đánh giá Nguồn lực nội tại',
        title_en: 'VRIO Framework: Assessing Internal Resources'
    },
    {
        slug: 'expectation-confirmation-theory-ect',
        category: ['Marketing Research'],
        icon_name: 'BookOpen',
        title_vi: 'Thuyết Kỳ vọng - Xác nhận (ECT)',
        title_en: 'Expectation-Confirmation Theory (ECT)'
    },
    {
        slug: 'sor-model-marketing-behavior',
        category: ['Behavioral Research'],
        icon_name: 'Zap',
        title_vi: 'Mô hình S-O-R: Kích thích - Cơ thể - Phản hồi',
        title_en: 'S-O-R Model: Stimulus-Organism-Response'
    },
    {
        slug: 'perceived-value-marketing-strategy',
        category: ['Marketing Research'],
        icon_name: 'TrendingUp',
        title_vi: 'Mô hình Giá trị Cảm nhận (Perceived Value)',
        title_en: 'Perceived Value in Marketing Strategy'
    },
    {
        slug: 'tce-transaction-cost-economics-strategy',
        category: ['Advanced Research'],
        icon_name: 'Hash',
        title_vi: 'Kinh tế học Chi phí Giao dịch (TCE)',
        title_en: 'Transaction Cost Economics (TCE)'
    },
    {
        slug: 'descriptive-statistics-interpretation',
        category: ['Preliminary Analysis'],
        icon_name: 'BarChart3',
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua con số',
        title_en: 'Descriptive Statistics: The Art of Storytelling'
    },
    {
        slug: 'cfa-confirmatory-factor-analysis',
        category: ['Advanced Statistics'],
        icon_name: 'ShieldCheck',
        title_vi: 'CFA: Chìa khóa vàng thẩm định thang đo',
        title_en: 'CFA: The Gold Standard for Validation'
    },
    {
        slug: 'efa-factor-analysis',
        category: ['Factor Analysis'],
        icon_name: 'Layers',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn',
        title_en: 'Exploratory Factor Analysis (EFA): Discovering Inner Structures'
    },
    {
        slug: 'regression-vif-multicollinearity',
        category: ['Impact Analysis'],
        icon_name: 'LineChart',
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF): Dự báo Tác động',
        title_en: 'Multiple Regression & VIF: Predicting the Future'
    },
    {
        slug: 'sem-cfa-structural-modeling',
        category: ['Structural Modeling'],
        icon_name: 'Layers',
        title_vi: 'SEM & CFA: Đỉnh cao của Phân tích cấu trúc',
        title_en: 'SEM & CFA: Structural Modeling Masterclass'
    },
    {
        slug: 'independent-t-test-guide',
        category: ['Comparison Analysis'],
        icon_name: 'Activity',
        title_vi: 'Independent T-test: So sánh các nhóm đối đầu',
        title_en: 'Independent T-test: Comparing Opposite Groups'
    },
    {
        slug: 'one-way-anova-post-hoc',
        category: ['Comparison Analysis'],
        icon_name: 'Layers',
        title_vi: 'Phân tích ANOVA: So sánh Đa nhóm chuyên sâu',
        title_en: 'One-way ANOVA: Deep Multi-group Analysis'
    },
    {
        slug: 'pearson-correlation-analysis',
        category: ['Relationship Analysis'],
        icon_name: 'Hash',
        title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết',
        title_en: 'Pearson Correlation: The Connection Map'
    }
];
