'use client';

import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Clock, Share2, Bookmark, User, 
    ShieldCheck, CheckCircle2, TrendingUp
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getStoredLocale, type Locale } from '@/lib/i18n';
import Link from 'next/link';

const articleData = {
    'cronbach-alpha': {
        title_vi: 'Kiểm định độ tin cậy Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Đừng để bị đánh lừa bởi một con số Alpha tổng cao chót vót. Hãy luôn dành sự tập trung tối đa vào cột "Corrected Item-Total Correlation". Bất kỳ biến nào có hệ số này dưới 0.3 đều là "biến rác" đang làm yếu đi sức mạnh của thang đo.',
        expert_tip_en: 'Don\'t be fooled by a sky-high total Alpha. Always focus on the "Corrected Item-Total Correlation" column. Any variable with a coefficient under 0.3 is a "noise variable" weakening your scale.',
        items: [
            {
                h2_vi: '1. Bản chất & Triết lý nghiên cứu',
                h2_en: '1. Essence & Research Philosophy',
                content_vi: 'Trong thế giới của những con số, sự hỗn loạn là kẻ thù số một. Theo Hair et al. (2010), hệ số Cronbach\'s Alpha không chỉ đơn thuần là một con số thống kê; nó là linh hồn của thang đo. Nó trả lời cho câu hỏi: "Liệu các câu hỏi mà bạn đặt ra có thực sự đang cùng nhau tấu lên một bản giao hưởng về một khái niệm trừu tượng duy nhất, hay chúng đang mâu thuẫn lẫn nhau?". Thang đo là một tấm gương phản chiếu khái niệm (construct). Nếu tấm gương ấy bị rạn nứt – tức là tính nhất quán nội tại thấp – thì mọi hình ảnh bạn thấy sau đó như EFA hay Hồi quy đều sẽ bị méo mó và hoàn toàn vô nghĩa.',
                content_en: 'In the world of numbers, chaos is the primary enemy. According to Hair et al. (2010), Cronbach\'s Alpha is more than just a statistic; it is the soul of the scale. It answers: "Are your questions playing a symphony of a single abstract concept, or are they contradicting each other?".'
            },
            {
                h2_vi: '2. Ma trận Tiêu chuẩn học thuật (The Golden Standards)',
                h2_en: '2. The Golden Standards Matrix',
                content_vi: 'Dựa trên tiêu chuẩn của Hair et al. (2010) và Nunnally & Bernstein (1994):\n• 0.9 - 1.0: Rất cao (Thận trọng với trùng lặp ý).\n• 0.8 - 0.9: Tuyệt vời (Lý chuẩn cho bài báo quốc tế ISI/Scopus).\n• 0.7 - 0.8: Khá/Tốt (Sử dụng phổ biến trong luận văn).\n• 0.6 - 0.7: Đạt yêu cầu (Dành cho nghiên cứu mới).\n• < 0.6: Loại bỏ ngay lập tức.',
                content_en: 'Based on Hair et al. (2010) and Nunnally & Bernstein (1994):\n• 0.9 - 1.0: Very High (Watch out for redundancy).\n• 0.8 - 0.9: Excellent (Standard for ISI/Scopus papers).\n• 0.7 - 0.8: Good (Standard for Masters/PhD theses).'
            },
            {
                h2_vi: '3. Practical User Case: Bài toán "Lòng trung thành Thương hiệu"',
                h2_en: '3. Practical Case: Brand Loyalty Scale',
                content_vi: 'Hãy tưởng tượng bạn đo lường lòng trung thành bằng 4 câu: (1) Sẽ quay lại mua; (2) Sẽ giới thiệu bạn bè; (3) Tự hào khi sử dụng; (4) Thấy giá xe rẻ. \nKhi chạy ncsStat, Alpha chỉ đạt 0.52. ncsStat chỉ ra rằng câu số 4 (Nhận thức giá) hoàn toàn lạc lõng. Trong khi 3 câu đầu nói về sự gắn kết tâm lý, câu 4 nói về câu chuyện kinh tế. Hành động: Loại bỏ câu 4, Alpha vọt lên 0.78. Thang đo lúc này đã trở nên "thuần khiết" và cực kỳ đáng tin cậy.',
                content_en: 'Imagine measuring loyalty with 4 items: (1) Re-purchase intent; (2) Referral intent; (3) Pride; (4) Price perception. ncsStat shows Alpha = 0.52. Removing item 4 (Price) boosts Alpha to 0.78 because the scale becomes psychologically pure.'
            }
        ]
    },
    'efa-factor-analysis': {
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn sau dữ liệu',
        title_en: 'Exploratory Factor Analysis (EFA): Discovering Inner Structures',
        category: 'Factor Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Trong nghiên cứu xã hội, hãy đặc biệt chú ý đến phép xoay Promax. Thực tế hành vi con người luôn có sự đan xen, Promax cho phép các nhân tố tương quan với nhau, phản ánh đúng bản chất "đời" hơn so với phép xoay Varimax.',
        expert_tip_en: 'In social research, pay close attention to Promax rotation. Human behavior is interconnected; Promax allows correlated factors, reflecting "real life" more accurately than Varimax.',
        items: [
            {
                h2_vi: '1. Cơ sở lý luận Chuyên sâu',
                h2_en: '1. Deep Theoretical Foundation',
                content_vi: 'EFA là kỹ thuật ma thuật giúp tìm thấy những "sợi dây vô hình" kết nối các biến quan sát. Nó giả định rằng đằng sau hàng chục câu hỏi khảo sát là một vài "nhân tố mẹ" đang điều khiển tất cả. Việc xác định đúng các nhóm nhân tố này chính là chìa khóa để xây dựng một mô hình nghiên cứu mạch lạc và có chiều sâu.',
                content_en: 'EFA is a magical technique that finds "invisible strings" connecting observed variables. It assumes a few "mother factors" control dozens of survey questions.'
            },
            {
                h2_vi: '2. Những chỉ số kiểm soát "Cửa ngõ"',
                h2_en: '2. Gateway Control Indices',
                content_vi: '• KMO (Factor Adequacy): ≥ 0.5 (Tốt nhất > 0.7). \n• Bartlett\'s Test: Sig < 0.05. \n• Factor Loading: Hệ số tải ≥ 0.5 là mốc lý tưởng. \n• Phương sai trích (Cumulative Variance): Phải > 50% để đảm bảo các nhân tố mới đại diện được linh hồn dữ liệu.',
                content_en: '• KMO: ≥ 0.5 (Ideally > 0.7). \n• Bartlett\'s Test: Sig < 0.05. \n• Factor Loading: ≥ 0.5 is ideal. \n• Cumulative Variance: Must be > 50%.'
            },
            {
                h2_vi: '3. Practical User Case: Nghiên cứu Động lực làm việc',
                h2_en: '3. Practical Case: Employee Motivation',
                content_vi: 'Bạn khảo sát 30 yếu tố. ncsStat tự động gom thành 5 cột: (1) Phúc lợi tài chính; (2) Môi trường làm việc; (3) Giá trị tự thân;... Một biến "Sự thoải mái" nhảy vào cả 2 nhóm. ncsStat khuyên bỏ biến chéo này để mô hình sắc nét.',
                content_en: 'Surveying 30 factors, ncsStat groups them into: (1) Financial welfare; (2) Work environment; (3) Self-value. If an item cross-loads, ncsStat suggests removing it for a sharp model.'
            }
        ]
    },
    'regression-vif-multicollinearity': {
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF): Dự báo Tương lai',
        title_en: 'Multiple Regression & VIF: Predicting the Future',
        category: 'Impact Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Hãy luôn ưu tiên đọc hệ số Beta chuẩn hóa (Standardized Beta). Nó cho phép bạn so sánh công bình giữa các biến độc lập có đơn vị đo khác nhau (vd: số năm kinh nghiệm và số tiền thu nhập).',
        expert_tip_en: 'Always prioritize Standardized Beta. It allows fair comparison between independent variables with different units (e.g., years of experience vs. income amount).',
        items: [
            {
                h2_vi: '1. Lý thuyết Hồi quy & La bàn quản trị',
                h2_en: '1. Regression Theory & Management Compass',
                content_vi: 'Hồi quy tuyến tính (OLS) trả lời câu hỏi: "Nếu tôi thay đổi X một đơn vị, Y sẽ thay đổi bao nhiêu?". Trong kinh doanh, đây là "la bàn" để lãnh đạo phân bổ nguồn lực. Phương trình mô phỏng cách thế giới vận hành thông qua các biến số.',
                content_en: 'OLS regression answers: "If I change X by one unit, how much will Y change?". In business, this is the compass for resource allocation.'
            },
            {
                h2_vi: '2. Những rào cản kiểm định Chặt chẽ',
                h2_en: '2. Strict Verification Barriers',
                content_vi: '1. R² (R-Square): Ngưỡng 0.3 - 0.7 là lý tưởng cho xã hội. \n2. F-test Sig: Phải < 0.05. \n3. VIF: Phải < 10 (Học thuật khắt khe yêu cầu < 2 hoặc 5).',
                content_en: '1. R-Square: 0.3 - 0.7 is ideal for social sciences. \n2. F-test Sig: Must be < 0.05. \n3. VIF: Must be < 10 (Strictly < 2 or 5).'
            },
            {
                h2_vi: '3. Practical User Case: Tác động của Marketing Mix lên Doanh thu',
                h2_en: '3. Practical Case: Marketing Mix Impact on Revenue',
                content_vi: 'Biến: Ngân sách TikTok (X1), FB Ads (X2). ncsStat chỉ ra Beta TikTok = 0.45, FB = 0.22. KOLs/TikTok mang hiệu quả gấp đôi. Nếu VIF > 10, X1 và X2 chồng lấn, làm sai lệch kết luận.',
                content_en: 'Variables: TikTok Budget (X1), FB Ads (X2). ncsStat shows Beta TikTok = 0.45, FB = 0.22. TikTok is twice as effective. High VIF indicates overlap, biasing results.'
            }
        ]
    },
    'descriptive-statistics-interpretation': {
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua những con số',
        title_en: 'Descriptive Statistics: Storytelling through Numbers',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Một báo cáo chuyên nghiệp chuẩn quốc tế luôn phải đi kèm cột Std. Deviation. Độ lệch chuẩn thấp thể hiện sự đồng thuận; độ lệch chuẩn cao thể hiện sự phân hóa thị trường mạnh.',
        expert_tip_en: 'A professional international report must include Std. Deviation. Low SD shows consensus; high SD shows strong market polarization.',
        items: [
            {
                h2_vi: '1. Ngôn ngữ đầu tiên của Dữ liệu',
                h2_en: '1. The First Language of Data',
                content_vi: 'Thống kê mô tả không chỉ là đếm. Nó bao gồm Mean (Phổ quát), Median (Chuẩn xác khi có Outlier) và Skewness/Kurtosis (Kiểm tra Phân phối chuẩn cho bước sau). Một báo cáo tốt giúp người đọc cảm nhận độ dày của mẫu.',
                content_en: 'Descriptive stats isn\'t just counting. It includes Mean, Median (for Outliers), and Skewness/Kurtosis (Normality test).'
            },
            {
                h2_vi: '2. Practical User Case: Khảo sát thu nhập Gen Z',
                h2_en: '2. Practical Case: Gen Z Income Survey',
                content_vi: 'Mean 15tr nhưng có bạn thu nhập 500tr (Outlier) làm Mean bị nhiễu. ncsStat khuyên dùng Median (8tr) để phản ánh thực tế Gen Z gần gũi hơn.',
                content_en: 'Mean might be 15M, but a 500M outlier skews it. ncsStat suggests using Median (8M) for a more realistic Gen Z profile.'
            }
        ]
    },
    'independent-t-test-guide': {
        title_vi: 'Independent T-test: Cuộc đối đầu giữa các nhóm độc lập',
        title_en: 'Independent T-test: The Confrontation of Groups',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Đừng chỉ báo cáo T-test. Hãy dùng hệ số Cohen\'s d của ncsStat để nói mức độ khác biệt đó là Rất lớn hay Nhỏ. Khoa học hiện đại coi trọng Effect size hơn là Sig đơn thuần.',
        expert_tip_en: 'Don\'t just report T-test. Use Cohen\'s d from ncsStat to state if the effect size is Large or Small. Effect size matters more than just Sig in modern science.',
        items: [
            {
                h2_vi: '1. Ma trận Kiểm định APA',
                h2_en: '1. APA Testing Matrix',
                content_vi: 'Bước 1: Levene\'s Test. Sig > 0.05 -> Dòng 1 (Phương sai đồng nhất). Sig < 0.05 -> Dòng 2. Bước 2: Sig (2-tailed) < 0.05 là bằng chứng thép khẳng định sự khác biệt thực tế.',
                content_en: 'Step 1: Levene\'s Test. Sig > 0.05 (Equal variances). Step 2: T-test Sig < 0.05 is the steel evidence for real differences.'
            },
            {
                h2_vi: '2. Practical User Case: Local Brand vs Global Brand',
                h2_en: '2. Practical Case: Local vs Global Brand',
                content_vi: 'So sánh sự trung thành. Mean Global 4.2 > Local 3.8. Nếu Sig < 0.05, Global Brand thực sự nắm giữ vị thế trung thành của khách hàng một cách khoa học.',
                content_en: 'Comparing loyalty: Global 4.2 vs Local 3.8. If Sig < 0.05, Global Brand holds a scientifically superior loyalty position.'
            }
        ]
    },
    'one-way-anova-post-hoc': {
        title_vi: 'Phân tích ANOVA: So sánh Đa nhóm cực hạn',
        title_en: 'One-way ANOVA: Extreme Multi-group Comparison',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Nếu dữ liệu vi phạm tính đồng nhất phương sai (Sig Levene < 0.05), đừng dùng Tukey. Hãy dùng phép thử Games-Howell có sẵn trong ncsStat để đạt điểm tuyệt đối chuyên môn.',
        expert_tip_en: 'If variances aren\'t homogeneous (Levene < 0.05), avoid Tukey. Use Games-Howell in ncsStat for perfect professional scoring.',
        items: [
            {
                h2_vi: '1. ANOVA vs T-test',
                h2_en: '1. ANOVA vs T-test',
                content_vi: 'ANOVA so sánh phương sai giữa nhóm và nội bộ nhóm. Giai đoạn 1: Omnibus F-test báo có khác biệt. Giai đoạn 2: Post-hoc (Tukey/Bonferroni) vạch trần đúng cặp khác biệt.',
                content_en: 'ANOVA compares between-group and within-group variance. Stage 1: Omnibus F-test. Stage 2: Post-hoc (Tukey/Bonferroni) reveals the exact differing pairs.'
            },
            {
                h2_vi: '2. Practical User Case: Chi tiêu theo Trình độ học vấn',
                h2_en: '2. Practical Case: Spending by Education',
                content_vi: 'Nhóm: Đại học, Thạc sĩ, Tiến sĩ. Tukey chỉ ra Thạc sĩ chi nhiều hơn Đại học, nhưng Tiến sĩ ngang Thạc sĩ. Insight: Thạc sĩ là tệp khách hàng Luxury tối ưu.',
                content_en: 'Groups: Bachelors, Masters, PhD. Tukey shows Masters spend more than Bachelors, but PhD spend similarly to Masters. Insight: Masters are the optimal luxury target.'
            }
        ]
    },
    'pearson-correlation-analysis': {
        title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết tiềm ẩn',
        title_en: 'Pearson Correlation: Mapping Hidden Connections',
        category: 'Relationship Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Lưu ý cực kỳ quan trọng: Tương quan không phải là Nhân quả. Một cặp biến có r = 0.9 không có nghĩa là A gây ra B, chúng có thể cùng chịu tác động từ biến C ẩn giấu nào đó.',
        expert_tip_en: 'Crucial note: Correlation is not Causation. r = 0.9 doesn\'t mean A causes B; both might be influenced by a hidden variable C.',
        items: [
            {
                h2_vi: '1. Sức mạnh hệ số r',
                h2_en: '1. Power of r Coefficient',
                content_vi: 'r = 0.7-1.0: Rất mạnh. 0.5-0.7: Mạnh (Lý tưởng cho hồi quy). r < 0.3: Yếu. Tương quan là bước đệm cần thiết trước mọi mô hình tác động phức tạp.',
                content_en: 'r 0.7-1.0: Very strong. 0.5-0.7: Strong (Ideal for regression). r < 0.3: Weak.'
            },
            {
                h2_vi: '2. Practical User Case: "Xem Review" & "Ý định chốt đơn"',
                h2_en: '2. Practical Case: "Reviews" & "Purchase Intent"',
                content_vi: 'r = 0.68 (+). Khách dành càng nhiều thời gian xem KOLs review, khả năng chốt đơn càng cao. Insight: Đầu tư KOLs chất lượng thay vì banner khô khan.',
                content_en: 'r = 0.68 (+). More time watching KOL reviews leads to higher purchase intent. Insight: Invest in KOL content over dry banners.'
            }
        ]
    },
    'chi-square-test-independence': {
        title_vi: 'Kiểm định Chi-square: Liên kết những mảnh ghép định danh',
        title_en: 'Chi-square Test: Linking Categorical Pieces',
        category: 'Categorical Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Với bảng 2x2, hãy luôn dùng Yates\' Correction hoặc Fisher\'s Exact Test của ncsStat nếu mẫu nhỏ. Nó bảo vệ tính khoa học cho kết quả nghiên cứu của bạn.',
        expert_tip_en: 'For 2x2 tables, always use Yates\' Correction or Fisher\'s Exact Test in ncsStat for small samples to protect scientific integrity.',
        items: [
            {
                h2_vi: '1. Bản chất & Ma thuật bảng chéo',
                h2_en: '1. Essence of Crosstabs',
                content_vi: 'Chi-square so sánh cái thực tế quan sát được với cái kỳ vọng nếu mọi thứ là ngẫu nhiên. Nó là phép thử kỳ diệu để làm việc với biến định danh (Nominal).',
                content_en: 'Chi-square compares Observed vs Expected frequencies. It is the magic test for Nominal variables.'
            },
            {
                h2_vi: '2. Practical User Case: "Khu vực" và "Gu ẩm thực"',
                h2_en: '2. Practical Case: "Region" and "Taste Preference"',
                content_vi: 'Sig = 0.000 có nghĩa Văn hóa vùng miền (Bắc/Trung/Nam) ảnh hưởng cực mạnh đến khẩu vị. Hãy đo độ mạnh qua Cramer\'s V (> 0.3 là rất có giá thực tiễn).',
                content_en: 'Sig = 0.000 means regional culture (North/Cent/South) strongly influences taste. Measure strength via Cramer\'s V (> 0.3 is practical).'
            }
        ]
    },
    'mediation-analysis-sobel-test': {
        title_vi: 'Biến trung gian (Mediation): Giải mã cơ chế tác động sâu',
        title_en: 'Mediation Analysis: Decoding Deep Core Mechanisms',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Giới Scopus/ISI hiện nay cực kỳ ưa chuộng Bootstrapping. Nó cung cấp khoảng tin cậy 95% cực kỳ uy tín cho các kết quả tác động gián tiếp (Indirect Effect).',
        expert_tip_en: 'Scopus/ISI journals now heavily favor Bootstrapping. It provides a highly credible 95% confidence interval for indirect effects.',
        items: [
            {
                h2_vi: '1. Cơ chế "Bắc cầu" Baron & Kenny',
                h2_en: '1. Baron & Kenny "Bridging" Mechanism',
                content_vi: 'Để là Trung gian, biến M phải là cầu nối. Quy trình chứng minh chuỗi mắt xích: X -> Y ý nghĩa; X -> M ý nghĩa; M -> Y ý nghĩa. ncsStat tính toán chính xác % tác động chuyển hóa qua M.',
                content_en: 'For M to be a mediator, it must bridge X and Y. X -> Y, X -> M, and M -> Y must all be significant.'
            },
            {
                h2_vi: '2. Practical User Case: "Làm thiện nguyện" & "Doanh số"',
                h2_en: '2. Practical Case: "CSR" & "Revenue"',
                content_vi: 'CSR (X) làm tăng Sự tin tưởng (M), và độc Sự tin tưởng mới dẫn đến Ý định mua (Y). Nếu không có M, thiện nguyện chưa chắc sinh ra doanh số ngay.',
                content_en: 'CSR (X) increases Trust (M), and Trust leads to Purchase Intent (Y). Without Trust, charity does not directly generate revenue.'
            }
        ]
    },
    'data-cleaning-outliers-detection': {
        title_vi: 'Làm sạch dữ liệu & Outliers: Vệ sinh con số chuẩn khoa học',
        title_en: 'Data Cleaning & Outliers: Scientific Scrubbing',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Đừng xóa Outlier máy móc. Đôi khi nó là khởi đầu của một phân khúc khách hàng tiềm năng mới. Hãy phân tích kỹ lý do khác biệt trước khi quyết định gạt bỏ.',
        expert_tip_en: 'Don\'t delete outliers mechanically. Sometimes they represent a new potential customer segment. Analyze the difference before discarding.',
        items: [
            {
                h2_vi: '1. Kỹ thuật nhận diện Bậc cao',
                h2_en: '1. Advanced Detection Techniques',
                content_vi: 'Boxplot định vị điểm "đi lạc". Mahalanobis Distance phát hiện đáp viên trả lời "lụi" (vd: 100 câu đều chọn mức 5). ncsStat quét sạch "tiếng nhiễu" để nghe thấy tiếng nói thực dữ liệu.',
                content_en: 'Boxplots locate "stray" points. Mahalanobis Distance detects "random" responders. ncsStat scrubs noise to hear the true data voice.'
            },
            {
                h2_vi: '2. Practical User Case: Khảo sát thu nhập',
                h2_en: '2. Practical Case: Income Survey',
                content_vi: 'Một người khai 1 tỷ/tháng trong khi đa số 10-20tr làm chệch hồi quy. ncsStat giúp gạt trường hợp cực đoan này để mô hình chính xác nhất cho tệp mục tiêu.',
                content_en: 'Someone claiming 1B/month while others earn 10-20M skews regression. ncsStat filters this extreme case for target accuracy.'
            }
        ]
    },
    'sem-cfa-structural-modeling': {
        title_vi: 'Mô hình SEM và CFA: Đỉnh cao của Phân tích học thuật',
        title_en: 'SEM & CFA: The Pinnacle of Academic Analysis',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Để đạt chuẩn CFA, hãy chú ý RMSEA < 0.08 và CFI/TLI > 0.9. Nếu thang đo không đạt, hãy dùng các chỉ số MI (Modification Indices) để tinh chỉnh mô hình một cách thông minh.',
        expert_tip_en: 'For CFA standards, keep RMSEA < 0.08 and CFI/TLI > 0.9. Use Modification Indices (MI) to intelligently refine the model if it fails.',
        items: [
            {
                h2_vi: '1. Tầm nhìn Thống kê Hiện đại',
                h2_en: '1. Modern Statistical Vision',
                content_vi: 'SEM là sự kết hợp của EFA và Hồi quy, cho phép kiểm định toàn bộ hệ thống lý thuyết phức tạp cùng lúc. CFA khẳng định tính hội tụ và phân biệt của dữ liệu thực tế trước khi chạy SEM.',
                content_en: 'SEM combines EFA and Regression, testing complex theoretical systems simultaneously. CFA confirms convergent/discriminant validity.'
            }
        ]
    }
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
    const [locale, setLocale] = useState<Locale>('vi');
    const isVi = locale === 'vi';
    const slug = params.slug;
    const article = articleData[slug as keyof typeof articleData] || articleData['cronbach-alpha'];

    useEffect(() => {
        setLocale(getStoredLocale());
        const handleLocaleChange = () => setLocale(getStoredLocale());
        window.addEventListener('localeChange', handleLocaleChange);
        return () => window.removeEventListener('localeChange', handleLocaleChange);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <Header />
            
            <main className="pt-32 pb-24">
                {/* Article Header */}
                <header className="container mx-auto px-6 max-w-4xl mb-12">
                    <Link href="/knowledge" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-10 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        {isVi ? 'Quay lại thư viện' : 'Back to library'}
                    </Link>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 shadow-sm">
                            {article.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>15 min read</span>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
                        {isVi ? article.title_vi : article.title_en}
                    </h1>
                    
                    <div className="flex items-center justify-between py-10 border-y border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                <User className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-base uppercase tracking-tight leading-none mb-1.5">{article.author}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{article.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors text-slate-600 hover:text-indigo-600 border border-slate-100">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors text-slate-600 hover:text-indigo-600 border border-slate-100">
                                <Bookmark className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight 
                        prose-p:text-slate-800 prose-p:leading-[1.8] prose-p:text-lg prose-p:font-normal
                        prose-strong:text-indigo-600 prose-strong:font-black">
                        
                        {article.items.map((section, idx) => (
                            <div key={idx} className="mb-16 last:mb-0">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 border-l-4 border-indigo-600 pl-6 py-1">
                                    {isVi ? section.h2_vi : section.h2_en}
                                </h2>
                                <div className="text-slate-800 leading-[1.8] text-lg lg:text-xl font-normal whitespace-pre-line bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                                    {isVi ? section.content_vi : section.content_en}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Professional Tip Box */}
                    <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden my-24 border border-white/10">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <CheckCircle2 className="w-48 h-48 rotate-12 text-indigo-400" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black mb-6 flex items-center gap-4 text-indigo-400 uppercase tracking-widest">
                                <ShieldCheck className="w-8 h-8" />
                                {isVi ? 'Tư vấn Chuyên gia ncsStat' : 'ncsStat Expert Strategy'}
                            </h4>
                            <p className="text-slate-300 text-xl font-light leading-relaxed mb-10">
                                {isVi ? article.expert_tip_vi : article.expert_tip_en}
                            </p>
                            <Link href="/analyze" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/50">
                                {isVi ? 'Bắt đầu kiểm định ngay' : 'Start Analyzing Now'}
                                <TrendingUp className="w-5 h-5 ml-1" />
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
