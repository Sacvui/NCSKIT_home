import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const fullArticles = [
    {
        slug: 'cronbach-alpha',
        category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        expert_tip_vi: 'Đừng để bị đánh lừa bởi một con số Alpha tổng thấp. Hãy tập trung vào cột "Corrected Item-Total Correlation". Bất kỳ biến nào < 0.3 đều là "biến rác" cần loại bỏ ngay để làm sạch thang đo.',
        expert_tip_en: 'Focus on "Corrected Item-Total Correlation". Any item < 0.3 is noise and should be removed to purify your scale.',
        content_structure: [
            {
                h2_vi: '1. Bản chất & Triết lý nghiên cứu Chuyên sâu',
                h2_en: '1. Deep Essence & Research Philosophy',
                content_vi: 'Theo tiêu chuẩn Hair et al. (2010), Cronbach\'s Alpha đo lường mức độ các câu hỏi trong cùng một thang đo "hiểu ý nhau". Một thang đo tốt là nền tảng sống còn cho mọi phân tích EFA hay Hồi quy sau này.',
                content_en: 'Based on Hair et al. (2010), Cronbach\'s Alpha measures internal consistency. A reliable scale is the vital foundation for subsequent EFA and Regression models.'
            },
            {
                h2_vi: '2. Ma trận Tiêu chuẩn học thuật Scopus/ISI',
                h2_en: '2. Scopus/ISI Academic Standards',
                content_vi: '• 0.8 - 0.9: Tuyệt vời (Standard Gold).\n• 0.7 - 0.8: Tốt (Research Standard).\n• 0.6 - 0.7: Chấp nhận được cho nghiên cứu sơ bộ.\n• < 0.6: Loại bỏ hoàn toàn.',
                content_en: '• 0.8 - 0.9: Excellent.\n• 0.7 - 0.8: Good.\n• 0.6 - 0.7: Acceptable for exploratory study.'
            },
            {
                h2_vi: '3. Practical User Case: Lòng trung thành khách hàng',
                h2_en: '3. Practical Case: Customer Loyalty',
                content_vi: 'Nghiên cứu 4 câu: Mua lại, Giới thiệu, Tự hào, và Giá rẻ. ncsStat phát hiện câu "Giá rẻ" làm Alpha thấp (0.52). Loại bỏ nó, Alpha vọt lên 0.78 - cực kỳ đáng tin cậy.',
                content_en: 'Survey item "Low price" often clashes with psychological loyalty items. ncsStat helps identify and remove this dissonance to reach Alpha 0.78.'
            }
        ]
    },
    {
        slug: 'efa-factor-analysis',
        category: 'Factor Analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn',
        title_en: 'Exploratory Factor Analysis (EFA): Discovering Inner Structures',
        expert_tip_vi: 'Trong nghiên cứu xã hội, hãy ưu tiên phép xoay Promax. Nó cho phép các nhân tố tương quan - phản ánh đúng bản chất hành vi con người hơn Varimax.',
        expert_tip_en: 'Prioritize Promax rotation in social sciences. It allows correlated factors, which reflects real human behavior better than Varimax.',
        content_structure: [
            {
                h2_vi: '1. Bản chất của việc gom nhóm dữ liệu',
                h2_en: '1. The Essence of Data Grouping',
                content_vi: 'EFA giúp chúng ta tìm thấy những "sợi dây vô hình" kết nối các biến. Nó giả định rằng đằng sau hàng chục câu hỏi khảo sát là một vài "nhân tố mẹ" đang điều khiển tất cả.',
                content_en: 'EFA uncovers invisible strings connecting variables. It assumes a few underlying "mother factors" control dozens of survey responses.'
            },
            {
                h2_vi: '2. Các chỉ số Kiểm soát Chặt chẽ',
                h2_en: '2. Strict Control Metrics',
                content_vi: '• KMO: ≥ 0.5 (Tốt nhất > 0.7).\n• Bartlett\'s Test: Sig < 0.05.\n• Factor Loading: Phải ≥ 0.5.\n• Phương sai trích: Phải > 50%.',
                content_en: '• KMO: ≥ 0.5 (Ideal > 0.7).\n• Bartlett\'s: Sig < 0.05.\n• Loading: ≥ 0.5.\n• Cumulative Variance: > 50%.'
            },
            {
                h2_vi: '3. Practical User Case: Động lực làm việc',
                h2_en: '3. Practical Case: Workplace Motivation',
                content_vi: 'Khảo sát 30 yếu tố. ncsStat gom thành 5 nhóm: Lương thưởng, Môi trường, Sếp, Đồng nghiệp và Cơ hội. Giúp doanh nghiệp định vị đúng điểm cần cải thiện.',
                content_en: 'Survey 30 items. ncsStat clusters them into 5 groups: Salary, Environment, Boss, Peers, Opportunity. Precision targeting for HR strategy.'
            }
        ]
    },
    {
        slug: 'regression-vif-multicollinearity',
        category: 'Impact Analysis',
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF): Dự báo Tác động',
        title_en: 'Multiple Regression & VIF: Predicting the Future',
        expert_tip_vi: 'Hãy chú ý hệ số Beta chuẩn hóa. Nó giúp bạn so sánh chính xác mức độ quan trọng giữa các biến (vd: Quảng cáo vs Chăm sóc khách hàng).',
        expert_tip_en: 'Focus on Standardized Beta to compare the relative importance of variables like Ad Budget vs. Customer Service.',
        content_structure: [
            {
                h2_vi: '1. La bàn điều hướng Quản trị',
                h2_en: '1. The Management Compass',
                content_vi: 'Hồi quy OLS trả lời: "Nếu tôi thay đổi X một đơn vị, Y sẽ thay đổi bao nhêu?". Đây là công cụ dự báo quyền lực nhất cho các nhà hoạch định chiến lược.',
                content_en: 'OLS regression predicts Y based on X. It is the most powerful forecasting tool for strategic planners.'
            },
            {
                h2_vi: '2. Kiểm soát Đa cộng tuyến (VIF)',
                h2_en: '2. Controlling Multicollinearity',
                content_vi: 'VIF phải < 10 (Lý tưởng < 2 hoặc 5). Nếu VIF quá cao, các biến độc lập đang "dẫm chân lên nhau", làm sai lệch kết quả dự báo của mô hình.',
                content_en: 'VIF must be < 10 (Strictly < 5). High VIF means independent variables overlap too much, biasing your model results.'
            },
            {
                h2_vi: '3. Practical User Case: Doanh thu Marketing',
                h2_en: '3. Practical Case: Marketing ROI',
                content_vi: 'Chạy hồi quy chi phí TikTok và FB Ads lên Doanh số. ncsStat chỉ ra Beta TikTok = 0.45, FB = 0.22. TikTok hiệu quả gấp đôi cho tệp khách này.',
                content_en: 'Regressing TikTok vs FB ads on Sales. ncsStat shows TikTok Beta 0.45, FB Beta 0.22. TikTok is twice as effective for this segment.'
            }
        ]
    },
    {
        slug: 'descriptive-statistics-interpretation',
        category: 'Preliminary Analysis',
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua con số',
        title_en: 'Descriptive Statistics: The Art of Storytelling',
        expert_tip_vi: 'Hãy nhìn vào Mean và Std. Deviation. Độ lệch chuẩn thấp thể hiện sự đồng thuận; Cao thể hiện sự phân hóa thị trường rất mạnh.',
        expert_tip_en: 'Low SD means consensus; High SD indicates strong market polarization. Always report both Mean and SD.',
        content_structure: [
            {
                h2_vi: '1. Ngôn ngữ của Thực tế',
                h2_en: '1. The Language of Reality',
                content_vi: 'Thống kê mô tả giúp tóm tắt đám đông thành các chỉ số dễ hiểu. Mean, Median, và Mode giúp chúng ta hiểu "khách hàng trung bình" là ai.',
                content_en: 'Descriptive stats summarize populations. Mean, Median, and Mode help identify who the "average customer" truly is.'
            },
            {
                h2_vi: '2. Phân phối chuẩn (Normality)',
                h2_en: '2. Normality Check',
                content_vi: 'Sử dụng Skewness và Kurtosis để biết dữ liệu có bị "lệch" không. Đây là tấm vé thông hành bắt buộc trước khi dùng T-test hay ANOVA.',
                content_en: 'Use Skewness and Kurtosis to check for bias. This is the mandatory entry ticket before using T-tests or ANOVA.'
            },
            {
                h2_vi: '3. Practical User Case: Thu nhập Gen Z',
                h2_en: '3. Practical Case: Gen Z Income',
                content_vi: 'Mean 15tr nhưng Median chỉ 8tr do có vài Case "cá mập" kéo Mean lên. ncsStat khuyên bạn dùng Median để thấy đúng thực tế tệp Gen Z.',
                content_en: 'Mean 15M vs Median 8M. A few "whales" skew the mean. ncsStat suggests using Median to reflect the genuine Gen Z reality.'
            }
        ]
    },
    {
        slug: 'independent-t-test-guide',
        category: 'Comparison Analysis',
        title_vi: 'Independent T-test: So sánh các nhóm đối đầu',
        title_en: 'Independent T-test: Comparing Opposite Groups',
        expert_tip_vi: 'Levene\'s Test là "người gác cổng". Phải đảm bảo Sig > 0.05 trước khi đọc kết quả T-test ở dòng 1. Nếu không, ncsStat sẽ hướng dẫn bạn dòng 2.',
        expert_tip_en: 'Levene\'s Test is the gatekeeper. Ensure Sig > 0.05 for Row 1 usage. Otherwise, ncsStat directs you to Row 2 results.',
        content_structure: [
            {
                h2_vi: '1. Khi nào dùng T-test?',
                h2_en: '1. When to use T-test?',
                content_vi: 'Khi bạn muốn so sánh trung bình giữa 2 nhóm hoàn toàn tách biệt (Vd: Nam vs Nữ, IOS vs Android). Phép thử này xác định sự khác biệt là thực lực hay ngẫu nhiên.',
                content_en: 'Compare means between 2 distinct groups (e.g., Male vs Female). It determines if the difference is significant or just noise.'
            },
            {
                h2_vi: '2. Practical User Case: Sự hài lòng của Khách hàng',
                h2_en: '2. Practical Case: Customer Satisfaction',
                content_vi: 'So sánh mức hài lòng giữa Khách mới và Khách cũ. Mean Khách cũ 4.5 > Mới 3.8. Nếu Sig < 0.05, chiến dịch retention của bạn đang hoạt động rất tốt.',
                content_en: 'Old vs New customers. Old Mean 4.5 > New 3.8. If Sig < 0.05, your retention campaign is scientifically successful.'
            }
        ]
    },
    {
        slug: 'one-way-anova-post-hoc',
        category: 'Comparison Analysis',
        title_vi: 'Phân tích ANOVA: So sánh Đa nhóm chuyên sâu',
        title_en: 'One-way ANOVA: Deep Multi-group Analysis',
        expert_tip_vi: 'Phép thử Post-hoc (Tukey/Games-Howell) là linh hồn của ANOVA. Nó giúp bạn chỉ ra chính xác cặp nào khác nhau, không chỉ nói chung chung "có khác biệt".',
        expert_tip_en: 'Post-hoc tests (Tukey/Games-Howell) are the soul of ANOVA. They pinpoint exactly which pairs differ, not just "there is a difference".',
        content_structure: [
            {
                h2_vi: '1. Giới hạn của T-test và Sức mạnh ANOVA',
                h2_en: '1. T-test Limits & ANOVA Power',
                content_vi: 'ANOVA so sánh từ 3 nhóm trở lên. Nó giải quyết bài toán: "Liệu trình độ học vấn (Đại học/Thạc sĩ/Tiến sĩ) có làm thay đổi hành vi chi tiêu?"',
                content_en: 'ANOVA handles 3+ groups. It solves: "Does Education (Bachelor/Master/PhD) change spending behavior?".'
            },
            {
                h2_vi: '2. Practical User Case: Chi tiêu theo Thu nhập',
                h2_en: '2. Practical Case: Spending by Income Levels',
                content_vi: 'Chia 3 nhóm thu nhập: Thấp, Trung, Cao. ANOVA báo có khác biệt. Post-hoc chỉ ra nhóm Trung và Cao chi tương đương, nhóm Thấp chi kém hẳn. Giúp Marketing tối ưu phân khúc.',
                content_en: 'Low/Mid/High income. ANOVA says significant. Post-hoc reveals Mid & High spend similarly, Low spends significantly less. Optimal targeting logic.'
            }
        ]
    },
    {
        slug: 'pearson-correlation-analysis',
        category: 'Relationship Analysis',
        title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết',
        title_en: 'Pearson Correlation: The Connection Map',
        expert_tip_vi: 'Hệ số tương quan r chạy từ -1 đến +1. Hãy cẩn thận với r > 0.8 giữa các biến độc lập - đó là dấu hiệu của Đa cộng tuyến (Multicollinearity).',
        expert_tip_en: 'Correlation r spans -1 to +1. Beware r > 0.8 between independents—a clear red flag for Multicollinearity.',
        content_structure: [
            {
                h2_vi: '1. Tìm kiếm sự liên kết',
                h2_en: '1. Searching for Linkage',
                content_vi: 'Tương quan đo lường mức độ các biến "đi cùng nhau". r dương: cả 2 cùng tăng; r âm: 1 cái tăng 1 cái giảm. Đây là tiền đề cho Hồi quy.',
                content_en: 'Correlation measures how variables move together. Positive r: both increase; Negative r: one increases, one decreases. The prerequisite for Regression.'
            },
            {
                h2_vi: '2. Practical User Case: Review Online & Doanh số',
                h2_en: '2. Practical Case: Reviews vs Sales',
                content_vi: 'r = 0.65 (+). Khách càng xem Review KOLs nhiều, khả năng mua hàng càng cao. ncsStat gợi ý bạn nên đầu tư mạnh vào đội ngũ Reviewer chất lượng.',
                content_en: 'r = 0.65 (+). More KOL review views = higher purchase likelihood. ncsStat suggests investing in quality review content.'
            }
        ]
    },
    {
        slug: 'chi-square-test-independence',
        category: 'Categorical Analysis',
        title_vi: 'Kiểm định Chi-square: Liên kết dữ liệu định danh',
        title_en: 'Chi-square Test: Linking Categorical Data',
        expert_tip_vi: 'Với các đặc điểm nhân khẩu học (Giới tính, Nghề nghiệp), Chi-square là vua. Hãy đọc thêm Cramer\'s V trên ncsStat để biết độ mạnh của liên kết thực tế.',
        expert_tip_en: 'For demographics (Gender, Job), Chi-square is king. Read Cramer\'s V on ncsStat to quantify the actual strength of the association.',
        content_structure: [
            {
                h2_vi: '1. Bản chất của Bảng chéo (Crosstabs)',
                h2_en: '1. The Essence of Crosstabs',
                content_vi: 'Chi-square so sánh cái Thực tế với cái Kỳ vọng. Nếu Sig < 0.05, "Định mệnh" đã kết nối 2 biến định danh của bạn lại với nhau.',
                content_en: 'Chi-square compares Observed vs Expected. If Sig < 0.05, "Fate" has linked your two categorical variables together.'
            },
            {
                h2_vi: '2. Practical User Case: Vùng miền & Khẩu vị',
                h2_en: '2. Practical Case: Region vs Taste',
                content_vi: 'Kiểm tra: Người miền Bắc/Trung/Nam có gu ăn ngọt khác nhau không? Chi-square kết luận Sig = 0.000 -> Có sự khác biệt văn hóa vùng miền cực mạnh trong ẩm thực.',
                content_en: 'Do North/Cent/South regions prefer different sweetness? Chi-square Sig = 0.000 confirms strong regional culinary cultural differences.'
            }
        ]
    },
    {
        slug: 'mediation-analysis-sobel-test',
        category: 'Advanced Analysis',
        title_vi: 'Biến trung gian (Mediation): Giải mã cơ chế tác động',
        title_en: 'Mediation Analysis: Decoding Core Mechanisms',
        expert_tip_vi: 'Sử dụng kỹ thuật Bootstrapping của ncsStat để có khoảng tin cậy 95%. Nó uy tín hơn rất nhiều so với phép thử Sobel truyền thống trong các tạp chí Scopus/ISI.',
        expert_tip_en: 'Use ncsStat Bootstrapping for 95% Confidence Intervals. It is far more credible than the traditional Sobel test in Scopus/ISI journals.',
        content_structure: [
            {
                h2_vi: '1. Tìm kiếm "Trạm trung chuyển"',
                h2_en: '1. Searching for the "Transfer Station"',
                content_vi: 'Biến trung gian M giải thích "Tại sao X lại dẫn đến Y?". X tác động đến M, và từ M mới tác động đến Y. ncsStat giải mã mắt xích quan trọng này.',
                content_en: 'A mediator M explains "Why X leads to Y?". X impacts M, which then impacts Y. ncsStat decodes this vital link.'
            },
            {
                h2_vi: '2. Practical User Case: Thiện nguyện & Danh tiếng',
                h2_en: '2. Practical Case: CSR & Reputation',
                content_vi: 'CSR (X) làm tăng Lòng tin khách hàng (M), và Lòng tin mới làm tăng Ý định mua (Y). Nếu không có Lòng tin, thiện nguyện chưa chắc sinh ra doanh số ngay.',
                content_en: 'CSR (X) boosts Trust (M), which then increases Purchase Intent (Y). Without Trust, CSR actions may not directly translate to sales.'
            }
        ]
    },
    {
        slug: 'data-cleaning-outliers-detection',
        category: 'Preliminary Analysis',
        title_vi: 'Làm sạch dữ liệu & Outliers: Vệ sinh Khoa học',
        title_en: 'Data Cleaning & Outliers: Scientific Scrubbing',
        expert_tip_vi: 'Đừng xóa Outlier một cách máy móc. Hãy dùng Mahalanobis Distance trên ncsStat để phát hiện những người "trả lời lụi" (vd: tất cả chọn 1 hoặc 5).',
        expert_tip_en: 'Don\'t delete outliers blindly. Use Mahalanobis Distance on ncsStat to detect "junk responders" (e.g., all 1s or all 5s).',
        content_structure: [
            {
                h2_vi: '1. Kẻ hủy diệt Mô hình: Outliers',
                h2_en: '1. The Model Killer: Outliers',
                content_vi: 'Outliers là những điểm dữ liệu "cực đoan" làm lệch kết quả trung bình. Làm sạch dữ liệu là bước vệ sinh buộc phải làm để nghe được tiếng nói thực của mẫu.',
                content_en: 'Outliers are extreme data points that skew averages. Cleaning data is mandatory to hear the true voice of your sample.'
            },
            {
                h2_vi: '2. Practical User Case: Khảo sát thái độ',
                h2_en: '2. Practical Case: Attitude Survey',
                content_vi: 'Một người khai 1 điểm cho toàn bộ 100 câu hỏi (trình trạng trả lời lụi). ncsStat sẽ giúp bạn gạt bỏ trường hợp này để chỉ số hài lòng của phòng ban không bị kéo tụt oan uổng.',
                content_en: 'One responder gives 1/5 for 100 questions (junk responding). ncsStat filters this to ensure the department\'s satisfaction index stays accurate.'
            }
        ]
    },
    {
        slug: 'sem-cfa-structural-modeling',
        category: 'Advanced Analysis',
        title_vi: 'Mô hình SEM và CFA: Đỉnh cao học thuật toàn cầu',
        title_en: 'SEM & CFA: The Academic Pinnacle',
        expert_tip_vi: 'Chuẩn CFA yêu cầu RMSEA < 0.08 và CFI/TLI > 0.9. ncsStat cung cấp MI (Modification Indices) để bạn tinh chỉnh mô hình một cách thông minh nhất.',
        expert_tip_en: 'CFA standards: RMSEA < 0.08 and CFI/TLI > 0.9. ncsStat provides MIs for intelligent model refinement.',
        content_structure: [
            {
                h2_vi: '1. Tầm nhìn Thống kê Hiện đại 2026',
                h2_en: '1. Modern Statistical Vision 2026',
                content_vi: 'SEM là sự kết hợp của EFA và Hồi quy, cho phép kiểm định toàn bộ hệ thống lý thuyết phức tạp cùng lúc. Nó là "vương miện" của mọi bài nghiên cứu ISI.',
                content_en: 'SEM combines EFA and Regression, testing complex theoretical systems simultaneously. It is the crown of every ISI paper.'
            }
        ]
    }
];

async function seedCompleteAcademy() {
  console.log('--- RE-SEEDING COMPLETE AUTHORITY ACADEMY ---');
  
  for (const article of fullArticles) {
    const { error } = await supabase.from('knowledge_articles').upsert(article, { onConflict: 'slug' });
    if (error) console.error(`❌ Error Article ${article.slug}:`, error.message);
    else console.log(`✅ Fully Seeded Authority Content: ${article.slug}`);
  }

  console.log('--- AUTHORITY ACADEMY ROLLOUT COMPLETED ---');
}

seedCompleteAcademy().catch(console.error);
