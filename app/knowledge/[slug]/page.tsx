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
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Đừng để bị đánh lừa bởi một con số Alpha tổng cao chót vót. Hãy luôn dành sự tập trung tối đa vào cột "Corrected Item-Total Correlation". Bất kỳ biến nào có hệ số này dưới 0.3 đều là "biến rác" đang làm yếu đi sức mạnh của thang đo.',
        expert_tip_en: 'Don\'t be fooled by a sky-high total Alpha. Always focus on the "Corrected Item-Total Correlation" column. Any variable with a coefficient under 0.3 is a "noise variable" weakening your scale.',
        items: [
            {
                h2_vi: '1. Bản chất & Triết lý nghiên cứu Chuyên sâu',
                h2_en: '1. Deep Essence & Research Philosophy',
                content_vi: 'Trong thế giới của những con số, sự hỗn loạn là kẻ thù số một. Theo Hair et al. (2010) và Nunnally & Bernstein (1994), hệ số Cronbach\'s Alpha không chỉ đơn thuần là một con số thống kê; nó là linh hồn của thang đo. Nó trả lời cho câu hỏi: "Liệu các câu hỏi mà bạn đặt ra có thực sự đang cùng nhau tấu lên một bản giao hưởng về một khái niệm trừu tượng duy nhất, hay chúng đang mâu thuẫn lẫn nhau?". \n\nThang đo là một tấm gương phản chiếu khái niệm (construct). Nếu tấm gương ấy bị rạn nứt – tức là tính nhất quán nội tại thấp – thì mọi hình ảnh bạn thấy sau đó như EFA hay Hồi quy đều sẽ bị méo mó và hoàn toàn vô nghĩa. Việc đảm bảo Alpha ở mức lý tưởng chính là nền móng cho mọi tuyên bố khoa học sau này.',
                content_en: 'In the world of numbers, chaos is the primary enemy. According to Hair et al. (2010), Cronbach\'s Alpha is more than just a statistic; it is the soul of the scale. It answers: "Are your questions playing a symphony of a single abstract concept, or are they contradicting each other?". A reliable scale is the foundation for all subsequent scientific claims.'
            },
            {
                h2_vi: '2. Ma trận Tiêu chuẩn học thuật (The Golden Standards)',
                h2_en: '2. The Golden Standards Matrix',
                content_vi: 'Dựa trên tiêu chuẩn khắt khe của Hair et al. (2010) và Nunnally & Bernstein (1994), ncsStat khuyến nghị các ngưỡng chuẩn sau:\n\n• 0.9 - 1.0: Rất cao (Lưu ý: Có thể xảy ra hiện tượng trùng lặp ý tưởng - Redundancy).\n• 0.8 - 0.9: Tuyệt vời (Ngưỡng lý chuẩn cho các bài báo quốc tế ISI/Scopus).\n• 0.7 - 0.8: Khá/Tốt (Sử dụng phổ biến trong các luận văn thạc sĩ/tiến sĩ).\n• 0.6 - 0.7: Đạt yêu cầu (Dành cho các nghiên cứu mới hoặc thang đo sơ bộ).\n• < 0.6: Loại bỏ ngay lập tức (Thang đo không có giá trị đo lường).\n\nQuan trọng: Ngoài Alpha tổng, hệ số "Item-Total Correlation" phải ≥ 0.3 để đảm bảo biến đó có đóng góp vào thang đo.',
                content_en: 'Based on standards by Hair et al. (2010) and Nunnally & Bernstein (1994), ncsStat recommends these thresholds:\n\n• 0.9 - 1.0: Very High (Possible redundancy).\n• 0.8 - 0.9: Excellent (Standard for ISI/Scopus papers).\n• 0.7 - 0.8: Good (Standard for Masters/PhD theses).\n• 0.6 - 0.7: Acceptable (Exploratory research).\n• < 0.6: Unreliable (Scale should be discarded).\n\nAdditionally, Item-Total Correlation must be ≥ 0.3.'
            },
            {
                h2_vi: '3. Practical User Case: Bài toán "Lòng trung thành Thương hiệu"',
                h2_en: '3. Practical Case: Brand Loyalty Scale',
                content_vi: 'Hãy tưởng tượng bạn đang đo lường sự trung thành bằng 4 câu: \n(1) Tôi sẽ tiếp tục mua sản phẩm này.\n(2) Tôi sẽ nhiệt tình giới thiệu cho người thân.\n(3) Tôi cảm thấy tự hào khi sử dụng nhãn hàng.\n(4) Tôi thấy vị trí cửa hàng rất thuận tiện.\n\nKhi chạy trên ncsStat, Alpha chỉ đạt 0.52 (Vi phạm). Phân tích sâu hơn, ncsStat chỉ ra rằng câu số 4 (Nhận thức địa lý) hoàn toàn lạc lõng. Trong khi 3 câu đầu nói về sự gắn kết tâm lý, câu 4 nói về câu chuyện địa lý. Hành động: Loại bỏ câu 4 làm sạch dữ liệu, Alpha vọt lên 0.78. Thang đo lúc này đã trở nên "thuần khiết" và cực kỳ đáng tin cậy.',
                content_en: 'Imagine measuring loyalty with 4 items: (1) Re-purchase; (2) Referral; (3) Pride; (4) Convenience. ncsStat shows Alpha = 0.52. Removing item 4 (Convenience) boosts Alpha to 0.78 because the scale becomes psychologically pure and focused on emotional intent.'
            }
        ]
    },
    'efa-factor-analysis': {
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn',
        title_en: 'Exploratory Factor Analysis (EFA): Discovering Inner Structures',
        category: 'Factor Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Trong nghiên cứu xã hội, hãy đặc biệt chú ý đến phép xoay Promax. Thực tế hành vi con người luôn có sự đan xen, Promax cho phép các nhân tố tương quan với nhau, phản ánh đúng bản chất "đời" hơn so với phép xoay Varimax.',
        expert_tip_en: 'In social research, pay close attention to Promax rotation. Human behavior is interconnected; Promax allows correlated factors, reflecting "real life" more accurately than Varimax.',
        items: [
            {
                h2_vi: '1. Cơ sở lý luận Chuyên sâu & Tầm nhìn',
                h2_en: '1. Deep Theoretical Foundation & Vision',
                content_vi: 'Dữ liệu thô giống như những mảnh ghép rời rạc. EFA (Exploratory Factor Analysis) là kỹ thuật ma thuật giúp chúng ta tìm thấy những "sợi dây vô hình" kết nối các biến quan sát. Nó giả định rằng đằng sau hàng chục câu hỏi khảo sát là một vài "nhân tố mẹ" đang điều khiển tất cả. Việc xác định đúng các nhóm nhân tố này chính là chìa khóa để xây dựng một mô hình nghiên cứu mạch lạc và có chiều sâu. ncsStat giúp bạn tự động hóa quy trình xoay nhân tố để đạt được cấu trúc Simple Structure lý tưởng.',
                content_en: 'EFA is a magical technique that finds "invisible strings" connecting observed variables. It assumes a few "mother factors" control dozens of survey questions. Identifying these factors is key to building a coherent research model.'
            },
            {
                h2_vi: '2. Những chỉ số kiểm soát "Cửa ngõ" quan trọng',
                h2_en: '2. Critical Gateway Control Indices',
                content_vi: 'Để kết quả EFA có giá trị học thuật, ncsStat kiểm tra nghiêm ngặt:\n• KMO (Factor Adequacy): ≥ 0.5 (Ngưỡng vàng là > 0.7) thể hiện sự đầy đủ của mẫu.\n• Bartlett\'s Test of Sphericity: Sig < 0.05 khẳng định các biến có tương quan.\n• Factor Loading: Hệ số tải nhân tố phải ≥ 0.5 để có ý nghĩa thực tiễn.\n• Phương sai trích (Cumulative Variance): Phải > 50%. Tức là các nhân tố mới phải đại diện được ít nhất một nửa "linh hồn" của đống biến cũ.\n• Eigenvalue: Phải > 1.0 (Tiêu chuẩn Kaiser) để giữ lại nhân tố.',
                content_en: 'For academic validity, ncsStat strictly verifies:\n• KMO: ≥ 0.5 (Ideal > 0.7).\n• Bartlett\'s Test: Sig < 0.05.\n• Factor Loading: ≥ 0.5 is the practical standard.\n• Cumulative Variance: Must be > 50% to ensure enough information is retained.\n• Eigenvalue: Must be > 1.0 (Kaiser criterion).'
            },
            {
                h2_vi: '3. Practical User Case: Nghiên cứu Động lực làm việc',
                h2_en: '3. Practical Case: Employee Motivation Factors',
                content_vi: 'Bạn khảo sát 30 yếu tố ảnh hưởng. ncsStat thực hiện EFA và tự động gom thành 5 nhóm nhân tố rõ rệt: (1) Phúc lợi tài chính; (2) Môi trường làm việc; (3) Khả năng thăng tiến; (4) Mối quan hệ đồng nghiệp; (5) Sự công nhận.\n\nVấn đề thường gặp: Một biến "Sự thoải mái" nhảy vào cả 2 nhóm. ncsStat phát hiện đây là "biến chéo" (Cross-loading) và khuyên bạn nên loại bỏ nó để ranh giới giữa các nhóm nhân tố được minh bạch, hỗ trợ cho bước chạy Hồi quy sau này.',
                content_en: 'Surveying 30 factors, ncsStat groups them into: (1) Financial welfare; (2) Work environment; (3) Promotion; (4) Relationships; (5) Recognition. If an item cross-loads, ncsStat advises removing it to ensure distinct boundaries between constructs.'
            }
        ]
    },
    'regression-vif-multicollinearity': {
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF): Dự báo Tác động',
        title_en: 'Multiple Regression & VIF: Predicting the Impact',
        category: 'Impact Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Hãy luôn ưu tiên đọc hệ số Beta chuẩn hóa (Standardized Beta). Nó cho phép bạn so sánh công bình giữa các biến độc lập có đơn vị đo khác nhau (vd: số năm kinh nghiệm và số tiền thu nhập).',
        expert_tip_en: 'Always prioritize Standardized Beta. It allows fair comparison between independent variables with different units (e.g., years of experience vs. income amount).',
        items: [
            {
                h2_vi: '1. Lý thuyết Hồi quy bậc cao & La bàn quản trị',
                h2_en: '1. Regression Theory & Management Compass',
                content_vi: 'Hồi quy tuyến tính (OLS) trả lời câu hỏi cốt tử: "Nếu tôi thay đổi X một đơn vị, thì Y sẽ thay đổi bao nhiêu?". Trong kinh doanh, đây chính là "la bàn" để các nhà lãnh đạo phân bổ nguồn lực. Phương trình hồi quy không chỉ là toán học; nó là mô hình mô phỏng cách thế giới vận hành thông qua các biến số. Hiểu được hệ số Beta chưa chuẩn hóa giúp bạn dự báo giá trị tuyệt đối, trong khi Beta chuẩn hóa giúp bạn so sánh mức độ ưu tiên giữa các nguồn lực khác nhau.',
                content_en: 'OLS regression answers the vital question: "If I change X by one unit, how much will Y change?". In business, this is the compass for resource allocation. Standardized Beta allows priority comparison, while unstandardized Beta predicts absolute values.'
            },
            {
                h2_vi: '2. Những rào cản kiểm định Chặt chẽ (VIF & R²)',
                h2_en: '2. Strict Verification Barriers (VIF & R²)',
                content_vi: 'Để mô hình không bị sai lệch (Bias), ncsStat quét qua các chốt chặn:\n• Hệ số R² (R-Square): Giải thích được bao nhiêu % sự biến thiên. Ngành xã hội thường từ 0.3 - 0.7 là đẹp.\n• Sig (F-test): Phải < 0.05 để khẳng định mô hình có ý nghĩa.\n• Đa cộng tuyến (VIF): Mặc dù lý thuyết chấp nhận VIF < 10, nhưng học thuật khắt khe (Hair et al.) yêu cầu VIF < 2 hoặc 5 để các biến độc lập không "nuốt chửng" lẫn nhau.',
                content_en: 'To avoid bias, ncsStat scans these checkpoints:\n• R-Square: 0.3 - 0.7 is ideal for social sciences.\n• F-test Sig: Must be < 0.05.\n• Multicollinearity (VIF): Strictly < 5 (ideally < 2) to ensure independent variables do not overlap and bias Beta coefficients.'
            },
            {
                h2_vi: '3. Practical User Case: Tác động của Marketing Mix',
                h2_en: '3. Practical Case: Marketing Mix Impact on Revenue',
                content_vi: 'Sử dụng biến: TikTok Ads (X1), FB Ads (X2), Chế độ hậu mãi (X3). Kết quả ncsStat: Beta của TikTok là 0.45, FB là 0.22. \nInsight: Đầu tư vào TikTok mang lại lợi nhuận gấp đôi cho phân khúc này. Tuy nhiên, nếu VIF của X1 và X2 > 10, chứng tỏ hai kênh này đang nhắm trùng đối tượng khách hàng, dữ liệu bị chồng lấn và ncsStat sẽ cảnh báo bạn cần gộp hoặc bỏ bớt một kênh.',
                content_en: 'Variables: TikTok (X1), FB (X2), Service (X3). ncsStat results: Beta TikTok = 0.45, FB = 0.22. Insight: TikTok is twice as effective. High VIF suggests audience overlap, requiring model simplification.'
            }
        ]
    },
    'descriptive-statistics-interpretation': {
        title_vi: 'Thống kê mô tả: Kể chuyện qua những con số',
        title_en: 'Descriptive Statistics: Storytelling through Numbers',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Một báo cáo chuyên nghiệp chuẩn quốc tế luôn phải đi kèm cột Std. Deviation. Độ lệch chuẩn thấp thể hiện sự đồng thuận; độ lệch chuẩn cao thể hiện sự phân hóa thị trường mạnh.',
        expert_tip_en: 'A professional international report must include Std. Deviation. Low SD shows consensus; high SD shows strong market polarization.',
        items: [
            {
                h2_vi: '1. Thống kê mô tả: Ngôn ngữ đầu tiên của Dữ liệu',
                h2_en: '1. The First Language of Data',
                content_vi: 'Thống kê mô tả không chỉ là đếm. Nó là cách chúng ta khái quát hóa bức tranh thực tế về đám đông. ncsStat cung cấp các chỉ số chuẩn APA:\n• Mean (Trung bình): Chỉ ra xu hướng chung.\n• Median (Trung vị): Cực kỳ cần thiết khi dữ liệu có giá trị đột biến.\n• Std. Deviation (Độ lệch chuẩn): Thể hiện sự đồng thuận của đám đông. SD thấp -> ý kiến nhất quán; SD cao -> thị trường phân hóa mạnh.\n• Skewness & Kurtosis: Kiểm tra tiền đề "Phân phối chuẩn" cho các phép tính bậc cao.',
                content_en: 'Descriptive stats generalize the population. ncsStat provides APA standards: Mean for trends, Median for outliers, Std. Deviation for consensus, and Skewness/Kurtosis to check Normality for advanced tests.'
            },
            {
                h2_vi: '2. Practical User Case: Thu nhập trung bình khách hàng',
                h2_en: '2. Practical Case: Average Customer Income',
                content_vi: 'Giả sử Mean chi tiêu là 15 triệu/tháng. Tuy nhiên, nếu trong mẫu có 1 vài "Đại gia" (Outlier) chi 1 tỷ, Mean sẽ bị kéo lên cao không thực tế. ncsStat sẽ chỉ cho bạn thấy Median là 8 triệu - đây mới là con số phản ánh đúng thực trạng của 90% khách hàng còn lại. Đừng để con số Trung bình đánh lừa chiến lược của bạn!',
                content_en: 'Mean spending might be 15M, but a few "Whales" (Outliers) spending 1B skews results. ncsStat reveals the Median at 8M—reflecting the reality of 90% of your customers. Don\'t let Mean skew your strategy.'
            }
        ]
    },
    'independent-t-test-guide': {
        title_vi: 'Independent T-test: So sánh các nhóm đối đầu',
        title_en: 'Independent T-test: Comparing Opposing Groups',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Đừng chỉ báo cáo T-test. Hãy dùng hệ số Cohen\'s d của ncsStat để nói mức độ khác biệt đó là Rất lớn hay Nhỏ. Khoa học hiện đại coi trọng Effect size hơn là Sig đơn thuần.',
        expert_tip_en: 'Don\'t just report T-test. Use Cohen\'s d from ncsStat to state if the effect size is Large or Small. Effect size matters more than just Sig in modern science.',
        items: [
            {
                h2_vi: '1. Ma trận Kiểm định chuẩn APA',
                h2_en: '1. APA Testing Matrix',
                content_vi: 'Bước 1: Levene\'s Test. Sig > 0.05 -> Dòng 1 (Phương sai đồng nhất). Sig < 0.05 -> Dòng 2. Bước 2: Sig (2-tailed) < 0.05 là bằng chứng thép khẳng định sự khác biệt thực tế giữa hai nhóm (ví dụ Nam và Nữ).',
                content_en: 'Step 1: Levene\'s Test. Sig > 0.05 (Equal variances). Step 2: T-test Sig < 0.05 is the steel evidence for real differences between two groups like Male and Female.'
            },
            {
                h2_vi: '2. Practical User Case: Local Brand vs Global Brand',
                h2_en: '2. Practical Case: Local vs Global Brand',
                content_vi: 'So sánh sự trung thành. Mean Global 4.2 > Local 3.8. Nếu Sig < 0.05, ncsStat cho phép bạn khẳng định Global Brand thực sự nắm giữ vị thế trung thành của khách hàng một cách khoa học, không phải do ngẫu nhiên.',
                content_en: 'Comparing loyalty: Global 4.2 vs Local 3.8. If Sig < 0.05, Global Brand holds a scientifically superior loyalty position, not by chance.'
            }
        ]
    },
    'one-way-anova-post-hoc': {
        title_vi: 'Phân tích ANOVA: So sánh đa nhóm chuyên sâu',
        title_en: 'One-way ANOVA: Deep Multi-group Comparison',
        category: 'Comparison Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Nếu dữ liệu vi phạm tính đồng nhất phương sai (Sig Levene < 0.05), đừng dùng Tukey. Hãy dùng phép thử Games-Howell có sẵn trong ncsStat để đạt điểm tuyệt đối chuyên môn.',
        expert_tip_en: 'If variances aren\'t homogeneous (Levene < 0.05), avoid Tukey. Use Games-Howell in ncsStat for perfect professional scoring.',
        items: [
            {
                h2_vi: '1. ANOVA vs T-test: Khi nào cần nâng cấp?',
                h2_en: '1. ANOVA vs T-test: When to Upgrade?',
                content_vi: 'Trong khi T-test chỉ so sánh được 2 nhóm, ANOVA (Analysis of Variance) cho phép chúng ta thực hiện phép so sánh đa nhóm (3 nhóm trở lên). ncsStat sử dụng thuật toán kiểm tra phương sai giữa các nhóm so với nội bộ nhóm để tìm ra sự khác biệt thực lực.',
                content_en: 'While T-test compares 2 groups, ANOVA handles 3 or more. ncsStat compares between-group vs. within-group variance to find significant differences.'
            },
            {
                h2_vi: '2. Quy trình kiểm định hai giai đoạn Quốc tế',
                h2_en: '2. International Two-Stage Testing Process',
                content_vi: 'Giai đoạn 1: Omnibus test (F-test). Nếu Sig < 0.05, ta biết có ít nhất 2 nhóm khác nhau.\nGiai đoạn 2: Post-hoc tests. ncsStat gợi ý dùng Tukey (khi phương sai đồng nhất) hoặc Games-Howell (khi phương sai khác biệt) để chỉ ra chính xác cặp nào đang "đối đầu" nhau.',
                content_en: 'Stage 1: Omnibus F-test (Sig < 0.05). Stage 2: Post-hoc tests (Tukey or Games-Howell) to pinpoint the exact differing pairs.'
            },
            {
                h2_vi: '3. Practical User Case: Khác biệt theo Trình độ học vấn',
                h2_en: '3. Practical Case: Difference by Education Level',
                content_vi: 'Chia mẫu thành: Đại học, Thạc sĩ, Tiến sĩ. ANOVA báo Sig = 0.02 (Có khác biệt). Chạy Post-hoc Tukey: Phát hiện Thạc sĩ chi nhiều hơn Đại học, nhưng Tiến sĩ lại chi ngang bằng Thạc sĩ. Insight: Chính sách chăm sóc nên tập trung đặc biệt vào phân khúc "Thạc sĩ" để tối ưu chi phí.',
                content_en: 'Categories: Bachelor, Master, PhD. ANOVA shows Sig = 0.02. Post-hoc Tukey reveals Masters spend more than Bachelors, while PhDs match Masters. Insight: Target the "Master" segment for optimal ROI.'
            }
        ]
    },
    'pearson-correlation-analysis': {
        title_vi: 'Tương quan Pearson: Bản đồ mối liên kết',
        title_en: 'Pearson Correlation: Mapping the Connections',
        category: 'Relationship Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Lưu ý cực kỳ quan trọng: Tương quan không phải là Nhân quả. Một cặp biến có r = 0.9 không có nghĩa là A gây ra B, chúng có thể cùng chịu tác động từ biến C ẩn giấu nào đó.',
        expert_tip_en: 'Crucial note: Correlation is not Causation. r = 0.9 doesn\'t mean A causes B; both might be influenced by a hidden variable C.',
        items: [
            {
                h2_vi: '1. Giải mã Sức mạnh hệ số r',
                h2_en: '1. Decoding the Power of r',
                content_vi: 'r = 0.7-1.0: Tương quan rất mạnh. 0.5-0.7: Mạnh (Lý tưởng để đưa vào hồi quy). r < 0.3: Tương quan yếu. ncsStat giúp bạn phát hiện sớm các mối quan hệ rác để tránh làm nhiễu mô hình dự báo sau này.',
                content_en: 'r 0.7-1.0: Very strong. 0.5-0.7: Strong (Ideal for regression). r < 0.3: Weak relationship. ncsStat filters noise to keep your models precise.'
            },
            {
                h2_vi: '2. Practical User Case: Review Online & Doanh số',
                h2_en: '2. Practical Case: Online Reviews & Sales',
                content_vi: 'r = 0.68 (+). Khách dành càng nhiều thời gian xem KOLs review, khả năng chốt đơn càng cao. Insight: Đầu tư vào nội dung KOLs chất lượng thay vì các quảng cáo banner truyền thống.',
                content_en: 'r = 0.68 (+). More time watching KOL reviews leads to higher purchase intent. Insight: Invest in KOL content over traditional banner ads.'
            }
        ]
    },
    'chi-square-test-independence': {
        title_vi: 'Kiểm định Chi-square: Liên kết dữ liệu định danh',
        title_en: 'Chi-square Test: Linking Categorical Data',
        category: 'Categorical Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Với bảng 2x2, hãy luôn dùng Yates\' Correction hoặc Fisher\'s Exact Test của ncsStat nếu mẫu nhỏ. Nó bảo vệ ý nghĩa thống kê cho kết quả nghiên cứu của bạn.',
        expert_tip_en: 'For 2x2 tables, always use Yates\' Correction or Fisher\'s Exact Test in ncsStat for small samples to protect statistical significance.',
        items: [
            {
                h2_vi: '1. Bản chất & Ma thuật của Phép kiểm định',
                h2_en: '1. Essence & Magic of the Test',
                content_vi: 'Chi-square so sánh cái thực tế quan sát được với cái kỳ vọng nếu mọi thứ là ngẫu nhiên. Nó là phép thử kỳ diệu để làm việc với các biến mang tính định tính (vd: Giới tính, Nghề nghiệp, Khu vực).',
                content_en: 'Chi-square compares Observed vs Expected frequencies. It is the go-to test for qualitative categorical variables.'
            },
            {
                h2_vi: '2. Practical User Case: Giới tính và Gu trà sữa',
                h2_en: '2. Practical Case: Gender and Tea Preferences',
                content_vi: 'Sig = 0.000 có nghĩa Giới tính ảnh hưởng cực mạnh đến sở thích vị trà sữa. ncsStat cung cấp thêm Cramer\'s V để bạn biết độ mạnh thực tiễn của mối liên hệ này (vd: V > 0.3 là sự liên kết rất chặt chẽ).',
                content_en: 'Sig = 0.000 means Gender strongly influences flavor preference. ncsStat adds Cramer\'s V to show the actual strength of this link.'
            }
        ]
    },
    'mediation-analysis-sobel-test': {
        title_vi: 'Biến trung gian (Mediation): Giải mã cơ chế sâu',
        title_en: 'Mediation Analysis: Decoding Core Mechanisms',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Giới Scopus/ISI hiện nay cực kỳ ưa chuộng Bootstrapping. Nó cung cấp khoảng tin cậy 95% cực kỳ uy tín cho các kết quả tác động gián tiếp (Indirect Effect).',
        expert_tip_en: 'Scopus/ISI journals now heavily favor Bootstrapping. It provides a highly credible 95% confidence interval for indirect effects.',
        items: [
            {
                h2_vi: '1. Cơ chế "Bắc cầu" Baron & Kenny',
                h2_en: '1. Baron & Kenny Bridge Mechanism',
                content_vi: 'Để là Trung gian, biến M phải là cầu nối truyền dẫn tác động từ X đến Y. Quy trình chứng minh chuỗi mắt xích trên ncsStat: X -> Y ý nghĩa; X -> M ý nghĩa; M -> Y ý nghĩa. ncsStat giúp bạn tính toán chính xác % tác động được chuyển hóa qua biến M.',
                content_en: 'To mediate, M must bridge X and Y. ncsStat proves the chain: X -> Y, X -> M, and M -> Y must all be significant.'
            },
            {
                h2_vi: '2. Practical User Case: Thiện nguyện và Doanh số',
                h2_en: '2. Practical Case: CSR and Revenue',
                content_vi: 'Làm thiện nguyện (X) làm tăng Sự tin tưởng (M), và độc Sự tin tưởng mới dẫn đến Doanh số (Y). ncsStat sẽ xác nhận cho bạn liệu thiện nguyện có tác động trực tiếp hay bắt buộc phải qua "trạm trung chuyển" Tín nhiệm.',
                content_en: 'CSR (X) increases Trust (M), which leads to Revenue (Y). ncsStat confirms if CSR acts directly or strictly through the Trust "station".'
            }
        ]
    },
    'data-cleaning-outliers-detection': {
        title_vi: 'Làm sạch dữ liệu & Outliers: Vệ sinh Khoa học',
        title_en: 'Data Cleaning & Outliers: Scientific Scrubbing',
        category: 'Preliminary Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Đừng xóa Outlier máy móc. Đôi khi nó là khởi đầu của một phân khúc khách hàng tiềm năng mới. Hãy dùng Mahalanobis Distance trên ncsStat để phát hiện những người trả lời "lụi".',
        expert_tip_en: 'Don\'t delete outliers mechanically. Use Mahalanobis Distance in ncsStat to detect "random" responders who might just be a unique new segment.',
        items: [
            {
                h2_vi: '1. Kỹ thuật nhận diện chuẩn Quốc tế',
                h2_en: '1. International Detection Standards',
                content_vi: 'ncsStat sử dụng Boxplot và Z-score để định vị điểm "đi lạc". Việc gạt bỏ các điểm cực đoan giúp đường hồi quy của bạn trung thực hơn và không bị kéo lệch bởi một vài cá nhân không đại diện.',
                content_en: 'ncsStat uses Boxplots and Z-scores. Removing extreme points makes your regression line more honest and representative of the main population.'
            },
            {
                h2_vi: '2. Practical User Case: Khảo sát thái độ nhân viên',
                h2_en: '2. Practical Case: Employee Attitude Survey',
                content_vi: 'Một nhân viên bất mãn khai 1 điểm cho toàn bộ 100 câu hỏi (trình trạng trả lời lụi). ncsStat sẽ giúp bạn gạt bỏ trường hợp này để chỉ số hài lòng trung bình của phòng ban không bị kéo tụt xuống một cách oan uổng.',
                content_en: 'A dissatisfied employee giving 1/5 for 100 questions (random response). ncsStat filters this to ensure the department\'s average stays accurate.'
            }
        ]
    },
    'sem-cfa-structural-modeling': {
        title_vi: 'Mô hình SEM và CFA: Đỉnh cao học thuật',
        title_en: 'SEM & CFA: The Academic Pinnacle',
        category: 'Advanced Analysis',
        author: 'ncsStat Editorial',
        date: '31 March 2026',
        expert_tip_vi: 'Để đạt chuẩn CFA, hãy chú ý RMSEA < 0.08 và CFI/TLI > 0.9. ncsStat cung cấp các chỉ số MI (Modification Indices) để bạn tinh chỉnh mô hình một cách thông minh nhất.',
        expert_tip_en: 'For CFA standards, keep RMSEA < 0.08 and CFI/TLI > 0.9. ncsStat provides MI indices to intelligently refine your model.',
        items: [
            {
                h2_vi: '1. Tầm nhìn Thống kê Hiện đại 2026',
                h2_en: '1. Modern Statistical Vision 2026',
                content_vi: 'SEM là sự kết hợp của EFA và Hồi quy, cho phép kiểm định toàn bộ hệ thống lý thuyết phức tạp cùng lúc. ncsStat hỗ trợ bạn kiểm định tính hội tụ và phân biệt của dữ liệu thực tế trước khi chính thức chạy mô hình cấu trúc SEM.',
                content_en: 'SEM combines EFA and Regression, testing complex theoretical systems. ncsStat confirms convergent/discriminant validity before running the full structural model.'
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
