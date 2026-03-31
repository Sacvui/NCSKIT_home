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

const articles = [
    {
        slug: 'cronbach-alpha',
        category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Bản giao hưởng của Tin cậy nội tại',
        title_en: 'Cronbach\'s Alpha Reliability Test: The Symphony of Internal Consistency',
        expert_tip_vi: 'Đừng để bị đánh lừa bởi một con số Alpha tổng cao chót vót. Hãy luôn dành sự tập trung tối đa vào cột "Corrected Item-Total Correlation". Bất kỳ biến nào có hệ số này dưới 0.3 đều là "biến rác" đang làm yếu đi sức mạnh của thang đo.',
        expert_tip_en: 'Don\'t be fooled by a sky-high total Alpha. Always focus on the "Corrected Item-Total Correlation" column. Any variable with a coefficient under 0.3 is a "noise variable" weakening your scale.',
        content_structure: [
            {
                h2_vi: '1. Bản chất & Triết lý nghiên cứu Chuyên sâu',
                h2_en: '1. Deep Essence & Research Philosophy',
                content_vi: 'Trong thế giới của những con số, sự hỗn loạn là kẻ thù số một. Theo Hair et al. (2010), hệ số Cronbach\'s Alpha không chỉ đơn thuần là một con số thống kê; nó là linh hồn của thang đo. Thang đo là một tấm gương phản chiếu khái niệm. Nếu tấm gương ấy bị rạn nứt – tức là tính nhất quán nội tại thấp – thì mọi hình ảnh bạn thấy sau đó như EFA hay Hồi quy đều sẽ bị méo mó và hoàn toàn vô nghĩa.',
                content_en: 'In the world of numbers, chaos is the primary enemy. According to Hair et al. (2010), Cronbach\'s Alpha is more than just a statistic; it is the soul of the scale.'
            },
            {
                h2_vi: '2. Ma trận Tiêu chuẩn học thuật (The Golden Standards)',
                h2_en: '2. The Golden Standards Matrix',
                content_vi: '• 0.9 - 1.0: Rất cao (Thận trọng với trùng lặp ý).\n• 0.8 - 0.9: Tuyệt vời (Lý chuẩn cho bài báo quốc tế).\n• 0.7 - 0.8: Khá/Tốt (Sử dụng phổ biến).\n• 0.6 - 0.7: Đạt yêu cầu.\n• < 0.6: Loại bỏ ngay lập tức.',
                content_en: '• 0.9 - 1.0: Very High.\n• 0.8 - 0.9: Excellent (Intl baseline).\n• 0.7 - 0.8: Good.\n• 0.6 - 0.7: Acceptable.\n• < 0.6: Reject.'
            },
            {
                h2_vi: '3. Practical User Case: Bài toán "Lòng trung thành Thương hiệu"',
                h2_en: '3. Practical Case: Brand Loyalty Scale',
                content_vi: 'Hãy tưởng tượng bạn đo lường sự trung thành bằng 4 câu. ncsStat báo Alpha chỉ đạt 0.52. Loại bỏ câu 4 làm sạch dữ liệu, Alpha vọt lên 0.78. Thang đo lúc này đã trở nên "thuần khiết" và cực kỳ đáng tin cậy.',
                content_en: 'Imagine measuring loyalty with 4 items. ncsStat shows Alpha = 0.52. Removing item 4 (Convenience) boosts Alpha to 0.78 because the scale becomes focused and focused on emotional intent.'
            }
        ]
    },
    {
        slug: 'efa-factor-analysis',
        category: 'Factor Analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Khám phá cấu trúc ẩn sau dữ liệu',
        title_en: 'Exploratory Factor Analysis (EFA): Discovering Inner Structures',
        expert_tip_vi: 'Trong nghiên cứu xã hội, hãy đặc biệt chú ý đến phép xoay Promax. Thực tế hành vi con người luôn có sự đan xen, Promax cho phép các nhân tố tương quan với nhau, phản ánh đúng bản chất "đời" hơn so với phép xoay Varimax.',
        expert_tip_en: 'In social research, pay close attention to Promax rotation. Human behavior is interconnected; Promax allows correlated factors, reflecting "real life" more accurately than Varimax.',
        content_structure: [
            {
                h2_vi: '1. Cơ sở lý luận Chuyên sâu & Tầm nhìn',
                h2_en: '1. Deep Theoretical Foundation & Vision',
                content_vi: 'Dữ liệu thô giống như những mảnh ghép rời rạc. EFA là kỹ thuật ma thuật giúp tìm thấy những "sợi dây vô hình" kết nối các biến quan sát. Nó giả định rằng đằng sau hàng chục câu hỏi khảo sát là một vài "nhân tố mẹ" đang điều khiển tất cả.',
                content_en: 'Raw data is like puzzle pieces. EFA is the magic technique to find "invisible strings" connecting observed variables. It assumes "mother factors" control dozens of survey questions.'
            }
        ]
    },
    {
        slug: 'regression-vif-multicollinearity',
        category: 'Impact Analysis',
        title_vi: 'Hồi quy đa biến và Đa cộng tuyến (VIF): Dự báo Tương lai',
        title_en: 'Multiple Regression & VIF: Predicting the Future',
        expert_tip_vi: 'Hãy luôn ưu tiên đọc hệ số Beta chuẩn hóa (Standardized Beta). Nó cho phép bạn so sánh công bình giữa các biến độc lập có đơn vị đo khác nhau.',
        expert_tip_en: 'Always prioritize Standardized Beta. It allows fair comparison between independent variables with different units.',
        content_structure: [
            {
                h2_vi: '1. Lý thuyết Hồi quy bậc cao & La bàn quản trị',
                h2_en: '1. Regression Theory & Management Compass',
                content_vi: 'Hồi quy tuyến tính (OLS) trả lời câu hỏi: "Nếu tôi thay đổi X một đơn vị, thì Y sẽ thay đổi bao nhiêu?". Trong kinh doanh, đây chính là "la bàn" để các nhà lãnh đạo phân bổ nguồn lực.',
                content_en: 'OLS regression answers: "If I change X by one unit, how much will Y change?". In business, this is the compass for resource allocation.'
            }
        ]
    },
    {
        slug: 'descriptive-statistics-interpretation',
        category: 'Preliminary Analysis',
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua những con số',
        title_en: 'Descriptive Statistics: Storytelling through Numbers',
        expert_tip_vi: 'Một báo cáo chuyên nghiệp chuẩn quốc tế luôn phải đi kèm cột Std. Deviation. Độ lệch chuẩn thấp thể hiện sự đồng thuận; độ lệch chuẩn cao thể hiện sự phân hóa thị trường mạnh.',
        expert_tip_en: 'A professional international report must include Std. Deviation. Low SD shows consensus; high SD shows strong market polarization.',
        content_structure: [
            {
                h2_vi: '1. Thống kê mô tả: Ngôn ngữ đầu tiên của Dữ liệu',
                h2_en: '1. The First Language of Data',
                content_vi: 'Thống kê mô tả không chỉ là đếm. Nó là cách chúng ta khái quát hóa bức tranh thực tế về đám đông. Mean (Trung bình), Median (Trung vị) và Std. Deviation (Độ lệch chuẩn) là bộ ba quyền lực cho báo cáo.',
                content_en: 'Descriptive stats generalize the population. Mean, Median, and Std. Deviation are the power trio for reporting.'
            }
        ]
    },
    {
        slug: 'independent-t-test-guide',
        category: 'Comparison Analysis',
        title_vi: 'Independent T-test: Cuộc đối đầu giữa các nhóm độc lập',
        title_en: 'Independent T-test: The Confrontation of Groups',
        expert_tip_vi: 'Đừng chỉ báo cáo T-test. Hãy dùng hệ số Cohen\'s d của ncsStat để nói mức độ khác biệt đó là Rất lớn hay Nhỏ. Khoa học hiện đại coi trọng Effect size hơn là Sig đơn thuần.',
        expert_tip_en: 'Don\'t just report T-test. Use Cohen\'s d from ncsStat to state if the effect size is Large or Small. Effect size matters more than just Sig.',
        content_structure: [
            {
                h2_vi: '1. Ma trận Kiểm định chuẩn APA',
                h2_en: '1. APA Testing Matrix',
                content_vi: 'Bước 1: Levene\'s Test. Sig > 0.05 -> Dòng 1 (Phương sai đồng nhất). Sig (2-tailed) < 0.05 là bằng chứng thép khẳng định sự khác biệt thực tế giữa hai nhóm độc lập.',
                content_en: 'Step 1: Levene\'s Test. Sig > 0.05 (Equal variances). T-test Sig < 0.05 is the steel evidence for real differences between independent groups.'
            }
        ]
    },
    {
        slug: 'one-way-anova-post-hoc',
        category: 'Comparison Analysis',
        title_vi: 'Phân tích ANOVA: So sánh Đa nhóm cực hạn',
        title_en: 'One-way ANOVA: Extreme Multi-group Comparison',
        expert_tip_vi: 'Nếu phương sai không đồng nhất (Sig Levene < 0.05), đừng dùng Tukey. Hãy dùng phép thử Games-Howell có sẵn trong ncsStat để đạt điểm tuyệt đối chuyên môn.',
        expert_tip_en: 'If variances aren\'t homogeneous (Levene < 0.05), avoid Tukey. Use Games-Howell in ncsStat for perfect professional scoring.',
        content_structure: [
            {
                h2_vi: '1. ANOVA vs T-test: Khi nào cần nâng cấp?',
                h2_en: '1. ANOVA vs T-test: When to Upgrade?',
                content_vi: 'ANOVA cho phép chúng ta thực hiện phép so sánh đa nhóm (3 nhóm trở lên). ncsStat sử dụng thuật toán kiểm tra phương sai giữa các nhóm so với nội bộ nhóm để tìm ra sự khác biệt thực lực.',
                content_en: 'ANOVA handles 3 or more groups. ncsStat compares between-group vs. within-group variance to find significant differences.'
            }
        ]
    },
    {
        slug: 'pearson-correlation-analysis',
        category: 'Relationship Analysis',
        title_vi: 'Tương quan Pearson: Bản đồ các mối liên kết tiềm ẩn',
        title_en: 'Pearson Correlation: Mapping Hidden Connections',
        expert_tip_vi: 'Lưu ý cực kỳ quan trọng: Tương quan không phải là Nhân quả. Một cặp biến có r = 0.9 không có nghĩa là A gây ra B, chúng có thể cùng chịu tác động từ biến C ẩn giấu nào đó.',
        expert_tip_en: 'Crucial note: Correlation is not Causation. r = 0.9 doesn\'t mean A causes B; both might be influenced by a hidden variable C.',
        content_structure: [
            {
                h2_vi: '1. Giải mã Sức mạnh hệ số r',
                h2_en: '1. Decoding the Power of r',
                content_vi: 'r = 0.7-1.0: Tương quan rất mạnh. 0.5-0.7: Mạnh (Lý tưởng để đưa vào hồi quy). Tương quan là bước đệm cần thiết trước mọi mô hình tác động phức tạp.',
                content_en: 'r 0.7-1.0: Very strong. 0.5-0.7: Strong (Ideal for regression). Correlation is the mandatory step before any complex impact model.'
            }
        ]
    },
    {
        slug: 'chi-square-test-independence',
        category: 'Categorical Analysis',
        title_vi: 'Kiểm định Chi-square: Liên kết những mảnh ghép định danh',
        title_en: 'Chi-square Test: Linking Categorical Data',
        expert_tip_vi: 'Với bảng 2x2, hãy luôn dùng Yates\' Correction hoặc Fisher\'s Exact Test của ncsStat nếu mẫu nhỏ. Nó bảo vệ ý nghĩa thống kê cho kết quả nghiên cứu của bạn.',
        expert_tip_en: 'For 2x2 tables, always use Yates\' Correction or Fisher\'s Exact Test in ncsStat for small samples to protect statistical significance.',
        content_structure: [
            {
                h2_vi: '1. Ma thuật của Phép kiểm định Định danh',
                h2_en: '1. Magic of Categorical Testing',
                content_vi: 'Chi-square so sánh thực tế quan sát được với kỳ vọng nếu mọi thứ là ngẫu nhiên. Nó là phép thử kỳ diệu để làm việc với biến định tính (vd: Giới tính, Nghề nghiệp).',
                content_en: 'Chi-square compares Observed vs Expected frequencies. It is the go-to test for qualitative categorical variables.'
            }
        ]
    },
    {
        slug: 'mediation-analysis-sobel-test',
        category: 'Advanced Analysis',
        title_vi: 'Biến trung gian (Mediation): Giải mã cơ chế tác động sâu',
        title_en: 'Mediation Analysis: Decoding Core Mechanisms',
        expert_tip_vi: 'Giới Scopus/ISI hiện nay cực kỳ ưa chuộng Bootstrapping. Nó cung cấp khoảng tin cậy 95% cực kỳ uy tín cho các kết quả tác động gián tiếp (Indirect Effect).',
        expert_tip_en: 'Scopus/ISI journals now heavily favor Bootstrapping. It provides a highly credible 95% confidence interval for indirect effects.',
        content_structure: [
            {
                h2_vi: '1. Cơ chế "Bắc cầu" Baron & Kenny',
                h2_en: '1. Baron & Kenny Bridge Mechanism',
                content_vi: 'Để là Trung gian, biến M phải là cầu nối truyền dẫn tác động từ X đến Y. ncsStat giúp bạn tính toán chính xác % tác động được chuyển hóa qua biến M.',
                content_en: 'To mediate, M must bridge X and Y. ncsStat calculates exactly the % effect transferred through variable M.'
            }
        ]
    },
    {
        slug: 'data-cleaning-outliers-detection',
        category: 'Preliminary Analysis',
        title_vi: 'Làm sạch dữ liệu & Outliers: Vệ sinh Khoa học',
        title_en: 'Data Cleaning & Outliers: Scientific Scrubbing',
        expert_tip_vi: 'Đừng xóa Outlier máy móc. Hãy dùng Mahalanobis Distance trên ncsStat để phát hiện những người trả lời "lụi". Đôi khi Outlier là một phân khúc khách hàng mới tiềm năng.',
        expert_tip_en: 'Don\'t delete outliers mechanically. Use Mahalanobis Distance in ncsStat to detect "random" responders. Sometimes outliers are a potential new customer segment.',
        content_structure: [
            {
                h2_vi: '1. Kỹ thuật nhận diện chuẩn Quốc tế',
                h2_en: '1. International Detection Standards',
                content_vi: 'ncsStat sử dụng Boxplot và Z-score để định vị điểm "đi lạc". Việc gạt bỏ các điểm cực đoan giúp đường hồi quy trung thực và không bị kéo lệch bởi sai số.',
                content_en: 'ncsStat uses Boxplots and Z-scores. Removing extreme points makes your regression line more honest and representative.'
            }
        ]
    },
    {
        slug: 'sem-cfa-structural-modeling',
        category: 'Advanced Analysis',
        title_vi: 'Mô hình SEM và CFA: Đỉnh cao học thuật toàn cầu',
        title_en: 'SEM & CFA: The Academic Pinnacle',
        expert_tip_vi: 'Để đạt chuẩn CFA, hãy chú ý RMSEA < 0.08 và CFI/TLI > 0.9. ncsStat cung cấp các chỉ số MI (Modification Indices) để bạn tinh chỉnh mô hình thông minh nhất.',
        expert_tip_en: 'For CFA standards, keep RMSEA < 0.08 and CFI/TLI > 0.9. ncsStat provides MI indices to intelligently refine your model.',
        content_structure: [
            {
                h2_vi: '1. Tầm nhìn Thống kê Hiện đại 2026',
                h2_en: '1. Modern Statistical Vision 2026',
                content_vi: 'SEM là sự kết hợp của EFA và Hồi quy, cho phép kiểm định toàn bộ hệ thống lý thuyết phức tạp cùng lúc. CFA khẳng định tính hội tụ và phân biệt của dữ liệu thực tế.',
                content_en: 'SEM combines EFA and Regression, testing complex theoretical systems. CFA confirms convergent/discriminant validity before running SEM.'
            }
        ]
    }
];

async function seedCMS() {
  console.log('--- STARTING CMS AUTOMATION ---');
  
  for (const article of articles) {
    const { error } = await supabase.from('knowledge_articles').upsert(article, { onConflict: 'slug' });
    if (error) console.error(`❌ Error Article ${article.slug}:`, error.message);
    else console.log(`✅ Success: ${article.slug}`);
  }

  console.log('--- SEEDING COMPLETED ---');
}

seedCMS().catch(console.error);
