import React from 'react';
import ArticleClient from '@/components/knowledge/ArticleClient';
import { getSupabase } from '@/utils/supabase/client';

// MASTER REPOSITORY (FALLBACK - GUARANTEED UPTIME)
// Using this directly on Server helps SEO and initial render speed
const FALLBACK_ARTICLES: Record<string, any> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha', category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Tiêu chuẩn Vàng về Độ tin cậy thang đo',
        title_en: 'Cronbach\'s Alpha: The Gold Standard for Scale Reliability',
        expert_tip_vi: 'Nếu Alpha > 0.95, hãy kiểm tra xem có biến nào bị lặp nội dung không. Độ tin cậy quá cao đôi khi là dấu hiệu của sự dư thừa.',
        expert_tip_en: "If Alpha > 0.95, check for redundant items. Extremely high reliability can sometimes indicate content overlap.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Alpha > 0.70 (Accepted), Corrected Item-Total Correlation > 0.30',
        content_structure: [{
            h2_vi: '1. Khái niệm và Ý nghĩa của Tin cậy nội tại', 
            h2_en: '1. Concept and Importance of Internal Consistency',
            content_vi: `Độ tin cậy Cronbach's Alpha là thước đo mức độ nhất quán nội tại của một tập hợp các biến quan sát (items) dùng để đo lường một khái niệm trừu tượng (như Sự hài lòng, Lòng trung thành). Trong nghiên cứu định lượng, trước khi thực hiện các phân tích phức tạp như EFA hay Hồi quy, chúng ta buộc phải chứng minh rằng các câu hỏi trong bảng hỏi "hiểu ý nhau" và cùng đo lường một khía cạnh duy nhất.

Một hệ số Alpha cao cho thấy các biến quan sát có sự tương quan chặt chẽ với nhau. Ngược lại, nếu Alpha thấp, điều đó có nghĩa là người trả lời đã hiểu các câu hỏi theo các cách khác nhau, hoặc thang đo của bạn đang bị "nhiễu" bởi các yếu tố không liên quan.`,
            content_en: `Cronbach's Alpha measures the internal consistency of a set of items. It ensures that all questions in a scale are measuring the same underlying construct before proceeding to complex analyses.`
        }, {
            h2_vi: '2. Quy tắc "0.7" và các biến thể học thuật', 
            h2_en: '2. The 0.7 Rule and Academic Variations',
            content_vi: `Hầu hết các nhà nghiên cứu (như Hair et al., 2010; Nunnally & Bernstein, 1994) đều thống nhất các ngưỡng sau:
- Alpha >= 0.9: Thang đo rất tốt, nhưng cần lưu ý sự dư thừa (Redundancy).
- 0.8 <= Alpha < 0.9: Thang đo tốt, có độ tin cậy cao.
- 0.7 <= Alpha < 0.8: Thang đo đạt yêu cầu, có thể sử dụng được.
- 0.6 <= Alpha < 0.7: Có thể chấp nhận được đối với các nghiên cứu mới (Exploratory research).
- Alpha < 0.6: Thang đo không đạt yêu cầu, cần xem xét lại toàn bộ cấu trúc.

Lưu ý quan trọng: Số lượng câu hỏi trong thang đo ảnh hưởng trực tiếp đến Alpha. Một thang đo có 20 câu hỏi thường có Alpha cao hơn thang đo 3 câu hỏi, ngay cả khi độ tương quan giữa các biến là như nhau.`,
            content_en: `The widely accepted threshold is 0.7. However, for NEW exploratory research, 0.6 may be acceptable according to Nunnally (1978).`
        }, {
            h2_vi: '3. Chỉ số "Corrected Item-Total Correlation" - Kẻ gác cổng', 
            h2_en: '3. Corrected Item-Total Correlation - The Gatekeeper',
            content_vi: `Đây là chỉ số quan trọng nhất trong bảng kết quả ncsStat. Nó đo lường mối tương quan của một biến quan sát cụ thể với tổng các biến còn lại trong thang đo.
Tiêu chuẩn học thuật: Phải > 0.30.

Nếu chỉ số này thấp hơn 0.30, điều đó có nghĩa là câu hỏi đó không "ăn nhập" với phần còn lại của thang đo. Bạn nên loại bỏ biến này để tăng độ tin cậy tổng thể. Tuy nhiên, hãy luôn kiểm tra cột "Cronbach's Alpha if Item Deleted" để xem liệu việc loại bỏ có thực sự làm tăng Alpha tổng hay không.`,
            content_en: `This metric assesses how well a single item fits with the rest of the scale. Academic standards require this value to be greater than 0.30.`
        }, {
            h2_vi: '4. Cách xử lý khi Alpha thấp trên hệ thống ncsStat', 
            h2_en: '4. Handling Low Alpha using ncsStat',
            content_vi: `Khi gặp trường hợp Alpha không đạt chuẩn, bạn hãy thực hiện theo quy trình "Lọc sạch" sau:
1. Quan sát cột Corrected Item-Total Correlation và tìm các biến < 0.3.
2. Loại bỏ từng biến một (ưu tiên biến thấp nhất trước), sau đó chạy lại kiểm định.
3. Kiểm tra lại ngữ nghĩa của các câu hỏi bị loại. Thường là do câu hỏi bị phủ định (Reverse-coded) mà chưa được đảo nhãn, hoặc câu hỏi quá khó hiểu đối với mẫu khảo sát.
4. Nếu sau khi loại biến mà Alpha vẫn < 0.6, bạn có thể cần phải thu thập thêm dữ liệu hoặc xây dựng lại thang đo lý thuyết.`,
            content_en: `Identify items with correlation < 0.3, remove them one by one, and re-run the test until the scale achieves the target reliability.`
        }]
    },
    'efa-factor-analysis': {
        slug: 'efa-factor-analysis', category: 'Factor Analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Cấu trúc ẩn của dữ liệu nghiên cứu',
        title_en: 'Exploratory Factor Analysis (EFA): Unveiling Latent Data Structures',
        expert_tip_vi: 'Dùng phép xoay Promax (Oblique) nếu bạn tin rằng các nhân tố có tương quan với nhau, điều này phản ánh đúng thực tế xã hội hơn Varimax.', 
        expert_tip_en: "Use Promax rotation if you suspect constructs are correlated, as it reflects social reality better than Varimax.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'KMO > 0.5, Bartlett Sig. < 0.05, Factor Loading > 0.5',
        content_structure: [{
            h2_vi: '1. Mục tiêu tối thượng của EFA', 
            h2_en: '1. The Ultimate Goal of EFA',
            content_vi: `EFA (Exploratory Factor Analysis) là kỹ thuật giảm dữ liệu được dùng để rút gọn một tập hợp lớn các biến quan sát thành một số ít các nhân tố (Factors) đại diện. Mục tiêu là tìm ra các biến nào "đi cùng nhau" để tạo nên một khái niệm lý thuyết. 
Ví dụ: Các câu hỏi về "Giá cả", "Chương trình khuyến mãi", "Quà tặng" có thể cùng hội tụ lại thành một nhân tố chung gọi là "Chính sách Marketing". EFA giúp xác định liệu cấu trúc dữ liệu thực tế có khớp với mô hình lý thuyết mà bạn đã xây dựng hay không.`,
            content_en: `EFA is a data reduction technique used to shrink a large number of variables into a smaller set of factors based on shared variance.`
        }, {
            h2_vi: '2. Các chỉ số kiểm định điều kiện (KMO & Bartlett)', 
            h2_en: '2. Preliminary Tests (KMO & Bartlett)',
            content_vi: `Trước khi xem xét các nhân tố, bạn phải vượt qua hai "cửa ải" thống kê:
- Hệ số KMO (Kaiser-Meyer-Olkin): Phải từ 0.5 đến 1.0. KMO càng tiến về 1 thì dữ liệu càng phù hợp để phân tích nhân tố. Nếu KMO < 0.5, bài nghiên cứu của bạn sẽ bị coi là không có giá trị thống kê.
- Kiểm định Bartlett: Phải có ý nghĩa thống kê (Sig. < 0.05). Điều này chứng minh các biến quan sát có tương quan với nhau và việc chạy EFA là có ý nghĩa.`,
            content_en: `KMO must be > 0.5 and Bartlett test must be significant (p < 0.05) to ensure the data is suitable for factoring.`
        }, {
            h2_vi: '3. Tiêu chuẩn chọn nhân tố (Eigenvalue & Cumulative Variance)', 
            h2_en: '3. Factor Retention Criteria',
            content_vi: `Làm thế nào để biết nên lấy bao nhiêu nhân tố?
- Hệ số Eigenvalue: Chỉ giữ lại các nhân tố có Eigenvalue > 1 (Tiêu chuẩn Kaiser). Nhân tố có Eigenvalue < 1 giải thích ít thông tin hơn cả một biến đơn lẻ, do đó bị loại bỏ.
- Tổng phương sai trích (Cumulative Variance): Nên đạt mức > 50%. Điều này đảm bảo các nhân tố bạn giữ lại giải thích được hơn một nửa sự biến thiên của dữ liệu ban đầu.`,
            content_en: `Keep factors with Eigenvalue > 1. Aim for a Cumulative Variance explained of at least 50% to 60%.`
        }, {
            h2_vi: '4. Hệ số tải nhân tố (Factor Loadings) và Phép xoay', 
            h2_en: '4. Factor Loadings and Rotation',
            content_vi: `Factor Loading là chỉ số cho biết độ mạnh của mối quan hệ giữa biến quan sát và nhân tố. 
- Tiêu chuẩn: Loading > 0.5 được coi là có ý nghĩa thực tiễn tốt. Nếu Loading < 0.3, biến đó nên bị loại bỏ.
- Hiện tượng tải chéo (Cross-loading): Nếu một biến tải mạnh lên CẢ HAI nhân tố (hiệu số loading < 0.3), biến đó bị coi là không phân biệt và cần được loại bỏ để làm sạch mô hình.

Về phép xoay: ncsStat hỗ trợ cả Varimax (xoay vuông góc) và Promax (xoay xiên). Trong khoa học hành vi, các chuyên gia thường khuyến nghị Promax vì các yếu tố tâm lý con người hiếm khi hoàn toàn độc lập với nhau.`,
            content_en: `Factor loadings should exceed 0.5. Be wary of cross-loadings, where an item contributes heavily to two different factors.`
        }]
    },
    'regression-vif-multicollinearity': {
        slug: 'regression-vif-multicollinearity', category: 'Impact Analysis',
        title_vi: 'Hồi quy đa biến và Hiện tượng Đa cộng tuyến (VIF): Cẩm nang chuyên sâu cho Nghiên cứu sinh', 
        title_en: 'Multiple Regression & Multicollinearity (VIF): In-depth Guide for Doctoral Research',
        expert_tip_vi: 'Khi VIF > 5, đừng vội loại biến. Hãy kiểm tra lại tương quan Pearson. Đôi khi việc gộp biến (Factor Score) là giải pháp tối ưu hơn.', 
        expert_tip_en: "When VIF > 5, don't just delete variables. Check Pearson correlations first. Sometimes using Factor Scores is a better solution.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'VIF < 5 (Acceptable), VIF < 10 (Maximum), Tolerance > 0.1',
        content_structure: [{
            h2_vi: '1. Bản chất của Phân tích Hồi quy trong Nghiên cứu Định lượng', 
            h2_en: '1. The Essence of Regression in Quantitative Research',
            content_vi: `Phân tích hồi quy tuyến tính bội (Multiple Linear Regression) là "xương sống" của hầu hết các nghiên cứu khoa học xã hội hiện đại. Mục tiêu cốt lõi của nó là xác định xem một nhóm các biến độc lập (Predictors) giải thích bao nhiêu phần trăm sự biến thiên của biến phụ thuộc (Outcome). 

Trong các luận văn Thạc sĩ và Tiến sĩ, hồi quy không chỉ đơn thuần là việc tìm ra mối quan hệ nhân quả. Nó còn là công cụ để kiểm định giả thuyết nghiên cứu, đo lường độ mạnh của các tác động thông qua hệ số Beta chuẩn hóa (Standardized Beta). Khi bạn chạy hồi quy trên hệ thống ncsStat, thuật toán R-engine sẽ tính toán các trọng số tối ưu nhất để cực tiểu hóa sai số bình phương, từ đó đưa ra mô hình dự báo sát thực tế nhất.`,
            content_en: `Multiple Linear Regression is the backbone of modern social science research. Its core goal is to determine how much of the variance in a dependent variable (Outcome) can be explained by a set of independent variables (Predictors).`
        }, {
            h2_vi: '2. Tại sao Đa cộng tuyến (Multicollinearity) lại là "Kẻ thù" của Hồi quy?', 
            h2_en: '2. Why Multicollinearity is the Enemy of Regression',
            content_vi: `Đa cộng tuyến xảy ra khi các biến độc lập trong mô hình của bạn có tương quan quá mạnh với nhau. Hãy tưởng tượng bạn đang cố gắng nghe hai người nói cùng một nội dung vào hai tai: bạn sẽ rất khó để phân biệt ai là người thực sự cung cấp thông tin quý giá. 

Trong thống kê, đa cộng tuyến làm "thổi phồng" sai số chuẩn (Standard Errors). Điều này dẫn đến một nghịch lý nguy hiểm: Mô hình có R-square rất cao (trông có vẻ tốt) nhưng hầu hết các hệ số Beta lại không có ý nghĩa thống kê (p-value > 0.05). Nếu không kiểm soát đa cộng tuyến, kết quả nghiên cứu của bạn sẽ bị sai lệch hoàn toàn, và các nhà phản biện khoa học sẽ dễ dàng bác bỏ bài báo của bạn ngay từ vòng sơ loại.`,
            content_en: `Multicollinearity occurs when independent variables are highly correlated. It inflates standard errors, making it difficult to determine the unique contribution of each predictor.`
        }, {
            h2_vi: '3. Variance Inflation Factor (VIF) - Thước đo chuẩn mực', 
            h2_en: '3. Variance Inflation Factor (VIF) - The Standard Metric',
            content_vi: `Để định lượng mức độ đa cộng tuyến, chúng ta sử dụng chỉ số VIF (Hệ số phóng đại biến thiên). VIF cho biết sai số của hệ số hồi quy được ước lượng bị phóng đại lên bao nhiêu lần so với trường hợp các biến độc lập không tương quan.

Thông thường, các ngưỡng học thuật được áp dụng như sau:
- VIF = 1: Không có tương quan, điều kiện lý tưởng.
- 1 < VIF < 5: Đa cộng tuyến ở mức chấp nhận được. Hầu hết các nghiên cứu quốc tế coi ngưỡng 5 là an toàn.
- 5 < VIF < 10: Dấu hiệu cảnh báo nguy hiểm. Bạn cần xem xét kỹ các biến này.
- VIF > 10: Đa cộng tuyến nghiêm trọng. Kết quả hồi quy không còn đáng tin cậy.

Ngoài VIF, hệ thống ncsStat cũng cung cấp chỉ số Tolerance (Dung sai). Tolerance = 1/VIF. Nếu Tolerance < 0.1, đó là bằng chứng xác thực cho hiện tượng đa cộng tuyến.`,
            content_en: `To quantify multicollinearity, we use the VIF. Common thresholds: VIF < 5 is generally safe, while VIF > 10 indicates severe issues.`
        }, {
            h2_vi: '4. Các bước xử lý khi VIF vượt ngưỡng trên ncsStat', 
            h2_en: '4. Remedial Actions for High VIF',
            content_vi: `Nếu hệ thống báo đỏ các chỉ số VIF, bạn đừng quá lo lắng. Dưới đây là quy trình xử lý chuyên nghiệp được các chuyên gia ncsStat đề xuất:

Bước 1: Kiểm tra Ma trận tương quan (Correlation Matrix). Nếu hai biến có tương quan Pearson > 0.8, chúng là "nghi phạm" chính gây ra đa cộng tuyến.

Bước 2: Loại bỏ biến có VIF cao nhất. Thử chạy lại mô hình và quan sát sự thay đổi của R-square. Nếu R-square không giảm đáng kể, việc loại bỏ biến là đúng đắn.

Bước 3: Gộp biến (Data Reduction). Sử dụng Phân tích nhân tố khám phá (EFA) để gộp các biến quan sát có tương quan mạnh thành một nhân tố đại diện duy nhất. Đây là cách tiếp cận hàn lâm nhất giúp bảo toàn thông tin mà vẫn sạch đa cộng tuyến.

Bước 4: Tăng kích thước mẫu. Đôi khi đa cộng tuyến chỉ là tạm thời do cỡ mẫu quá nhỏ, không phản ánh đúng tổng thể.`,
            content_en: `If VIF is high, consider checking the correlation matrix, removing the offending variable, or using Factor Analysis to combine related variables.`
        }, {
            h2_vi: '5. Diễn giải kết quả Hồi quy chuẩn APA 7', 
            h2_en: '5. Interpreting Regression Results (APA 7 Style)',
            content_vi: `Khi trình bày kết quả trong chương 4 của luận văn, bạn cần tuân thủ cấu trúc sau:
- Báo cáo chỉ số F và giá trị p của kiểm định ANOVA để khẳng định mô hình có phù hợp hay không.
- Báo cáo R-square và Adjusted R-square để cho biết mức độ giải thích của mô hình.
- Trình bày bảng Coefficient với các cột: B (hệ số chưa chuẩn hóa), Beta (hệ số đã chuẩn hóa), t, p-value và quan trọng là cột VIF.

Ví dụ nhận định: "Kết quả kiểm định cho thấy mô hình không vi phạm hiện tượng đa cộng tuyến (VIF cao nhất là 2.45 < 5). Biến Cảm nhận hữu ích có tác động mạnh nhất đến Ý định sử dụng (Beta = .452, p < .001)." Đây chính là cách viết giúp bài nghiên cứu của bạn đạt điểm tuyệt đối về năng lực trình bày khoa học.`,
            content_en: `Reporting should include F-statistics, R-square, and coefficients (B, Beta, t, p, and VIF). Ensure all tables follow APA formatting standards provided by ncsStat exports.`
        }]
    }
};

const DEFAULT_ARTICLE = {
    slug: 'unknown', category: 'Academy Content', title_vi: 'Đang tải nội dung...', title_en: 'Loading Content...',
    expert_tip_vi: 'Đang tải...', expert_tip_en: 'Loading...', author: 'ncsStat', updated_at: new Date().toISOString(),
    content_structure: [{ h2_vi: 'Đang tải...', h2_en: 'Loading...', content_vi: 'Nội dung đang được hệ thống nạp từ thư viện tri thức...', content_en: 'Please wait while content is loading...' }]
};

export async function generateStaticParams() {
    return [
        { slug: 'cronbach-alpha' }, { slug: 'efa-factor-analysis' }, { slug: 'regression-vif-multicollinearity' },
        { slug: 'descriptive-statistics-interpretation' }, { slug: 'independent-t-test-guide' }, { slug: 'one-way-anova-post-hoc' },
        { slug: 'pearson-correlation-analysis' }, { slug: 'chi-square-test-independence' }, { slug: 'mediation-analysis-sobel-test' },
        { slug: 'data-cleaning-outliers-detection' }, { slug: 'sem-cfa-structural-modeling' }
    ];
}

// Ensure the page stays dynamic even if pre-rendered
export const dynamicParams = true;

const supabase = getSupabase();

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    let article = FALLBACK_ARTICLES[slug] || DEFAULT_ARTICLE;
    
    try {
        const { data, error } = await supabase.from('knowledge_articles').select('*').eq('slug', slug).single();
        if (data && !error) {
            article = data;
        }
    } catch (e) {
        console.error("Server fetch error - Using Fallback");
    }

    return (
        <ArticleClient 
            initialArticle={article} 
            fallbackArticles={FALLBACK_ARTICLES} 
            slug={slug} 
        />
    );
}
