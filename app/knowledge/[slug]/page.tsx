import React from 'react';
import { Metadata } from 'next';
import ArticleClient from '@/components/knowledge/ArticleClient';
import { getSupabase } from '@/utils/supabase/client';
import { FALLBACK_ARTICLES, DEFAULT_ARTICLE } from '@/lib/constants/knowledge-fallbacks';

// Cấu hình Metadata động cho SEO bài viết
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    const supabase = getSupabase();
    
    // Thử lấy dữ liệu từ DB cho SEO
    const { data: article } = await supabase
        .from('knowledge_articles')
        .select('title_vi, category')
        .eq('slug', slug)
        .single();

    const currentArticle = article || FALLBACK_ARTICLES[slug];

    if (!currentArticle) {
        return { title: 'Bài viết không tồn tại | ncsStat' };
    }

    const title = `${currentArticle.title_vi || 'Kiến thức Thống kê'} - ncsStat Academy`;
    const description = `Tìm hiểu chuyên sâu về ${currentArticle.title_vi} và các ứng dụng trong nghiên cứu khoa học. Tài liệu học thuật chuẩn quốc tế tại ncsStat.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `https://ncskit.org/knowledge/${slug}`,
        }
    };
}

export async function generateStaticParams() {
    return [
        { slug: 'cronbach-alpha' }, 
        { slug: 'efa-factor-analysis' }, 
        { slug: 'regression-vif-multicollinearity' }
    ];
}

export const dynamicParams = true;

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const supabase = getSupabase();
    let article = FALLBACK_ARTICLES[slug] || DEFAULT_ARTICLE;

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('knowledge_articles')
                .select('*')
                .eq('slug', slug)
                .single();
            
            if (data && !error) {
                article = data;
            }
        } catch (e) {
            console.error("Server fetch error - Using Fallback");
        }
    }

    return (
        <ArticleClient 
            initialArticle={article} 
            fallbackArticles={FALLBACK_ARTICLES} 
            slug={slug} 
        />
    );
}

            {
                h2_vi: '2. Ngưỡng giá trị: Khi nào là "Đạt chuẩn"?',
                h2_en: '2. Thresholds: When is it "Acceptable"?',
                content_vi: `Trong nghiên cứu học thuật quốc tế:
- **> 0.8**: Rất tốt, thang đo có độ tin cậy cao.
- **0.7 - 0.8**: Tốt, mức phổ biến nhất trong các bài báo Scopus/ISI.
- **0.6 - 0.7**: Có thể chấp nhận được, thường dành cho các nghiên cứu mới hoặc thang đo mới phát triển.
Nếu con số này < 0.6, ncsStat sẽ bôi đỏ cảnh báo, báo hiệu bạn cần rà soát lại tập mẫu hoặc nội dung câu hỏi.`,
                content_en: `In global research: >0.8 is excellent, 0.7-0.8 is the gold standard for Scopus/ISI journals, and 0.6-0.7 is acceptable for exploratory research. Anything below 0.6 is flagged by ncsStat, signaling a need to re-evaluate your items or sample quality.`
            },
            {
                h2_vi: '3. Hiệu ứng "Alpha if Item Deleted": Kỹ thuật tinh chỉnh',
                h2_en: '3. "Alpha if Item Deleted": The Refinement Technique',
                content_vi: `Tại ncsStat, chúng tôi trình bày một bảng chi tiết cho từng biến. Nếu bạn thấy một câu hỏi (ví dụ: GSKEP5) mà khi xóa nó đi, Alpha tổng tăng từ 0.65 lên 0.82, thì đó là bằng chứng thép để loại bỏ GSKEP5 khỏi mô hình. Việc này không phải là "ép số liệu", mà là loại bỏ những nhiễu loạn để tìm thấy bản chất thực sự của thang đo.`,
                content_en: `ncsStat provides a granular breakdown per item. If deleting an item (e.g., GSKEP5) surges the Alpha from 0.65 to 0.82, you have empirical grounds to prune that item. This isn't data-fudging; it's removing noise to reveal the true signal of your construct.`
            },
            {
                h2_vi: '4. Tương quan biến - tổng (Corrected Item-Total Correlation)',
                h2_en: '4. Corrected Item-Total Correlation',
                content_vi: `Một chỉ số "vệ sĩ" khác là Tương quan biến - tổng. Quy chuẩn yêu cầu con số này phải **> 0.3**. Nếu một biến có tương quan thấp hơn ngưỡng này, nó đang lạc lõng với phần còn lại của thang đo. ncsStat tự động bôi đậm các biến vi phạm, giúp bạn tiết kiệm hàng giờ soi bảng số liệu thủ công.`,
                content_en: `The "guardian" metric: Corrected Item-Total Correlation must exceed 0.3. If an item falls below this, it's out of sync with the scale. ncsStat automatically bolds these violations, saving you hours of manual data inspection.`
            },
            {
                h2_vi: '5. McDonald\'s Omega (ω): Tiêu chuẩn mới của các tạp chí quốc tế', 
                h2_en: '5. McDonald\'s Omega: The Modern Standard',
                content_vi: `Hệ số Omega (ω) được các học giả hiện đại khuyến nghị sử dụng vì nó linh hoạt và chính xác hơn Alpha. ncsStat cung cấp song song cả hai chỉ số này giúp bài nghiên cứu của bạn đạt tiêu chuẩn xuất bản của các tạp chí quốc tế hàng đầu (Q1/Q2). Việc báo cáo đồng thời cả Alpha và Omega cho thấy sự chuyên nghiệp và cập nhật xu hướng thống kê hiện đại nhất của tác giả.`,
                content_en: `Omega (ω) provides a more accurate reliability estimate by relaxing the strict assumptions of Alpha. ncsStat reports both figures seamlessly to help you stay ahead of international publishing trends.`
            },
            {
                h2_vi: '6. Phân tích độ tin cậy cho đa nhân tố (Multi-construct)',
                h2_en: '6. Multi-construct Reliability Analysis',
                content_vi: `Nghiên cứu của bạn không chỉ có "Hoài nghi xanh" mà còn có "Niềm tin", "Ý định mua". Bạn phải chạy Cronbach's Alpha riêng rẽ cho từng nhân tố này. ncsStat hỗ trợ phân tích hàng loạt, xuất bảng tổng hợp cho tất cả các biến vào một file duy nhất, giúp bạn sẵn sàng cho việc trình bày trong chương 4 của luận văn.`,
                content_en: `Research often involves multiple constructs like "Skepticism," "Trust," and "Intention." You must run reliability tests for each separately. ncsStat supports batch analysis, exporting a consolidated table for all variables, ready for your dissertation's results chapter.`
            },
            {
                h2_vi: '7. Tránh bẫy "Alpha cao ảo": Hiện tượng lặp câu hỏi',
                h2_en: '7. Avoiding the "Artificial Alpha" Trap: Item Redundancy',
                content_vi: `Một hệ số Alpha cực cao (ví dụ > 0.95) đôi khi không phải là tốt. Nó có thể là dấu hiệu của việc bạn đặt các câu hỏi quá giống nhau (ví dụ: "Tôi thích sản phẩm này" và "Tôi cảm thấy sản phẩm này hay"). ncsStat giúp bạn nhận diện sự trùng lặp này, khuyến khích các câu hỏi có góc nhìn đa dạng nhưng vẫn quy tụ về một hướng.`,
                content_en: `An extremely high Alpha (>0.95) isn't always good—it may indicate redundant questions (e.g., "I like this" vs. "This is good"). ncsStat helps you spot these overlaps, encouraging diverse perspectives that still converge on a single construct.`
            },
            {
                h2_vi: '8. Trình bày kết quả chuẩn APA 7 cho bài báo quốc tế',
                h2_en: '8. Professional APA 7 Reporting for Global Journals',
                content_vi: `Báo cáo chuẩn: "Thang đo Hoài nghi xanh gồm 5 biến quan sát đạt độ tin cậy tốt với hệ số Cronbach’s Alpha = .85. Sau khi rà soát, tất cả các hệ số tương quan biến tổng đều > .50, do đó không có biến nào bị loại." ncsStat tự động tạo ra những đoạn văn bản mẫu này, giúp bài viết của bạn mang đậm phong cách của một học giả chuyên nghiệp.`,
                content_en: `Standard phrasing: "The 5-item Green Skepticism scale showed high reliability (Alpha = .85), with all item-total correlations exceeding .50." ncsStat generates these professional narratives, ensuring your paper reads like a seasoned scholar's work.`
            },
            {
                h2_vi: '9. Bí mật đăng bài: Giải trình khi Alpha "mấp mé" 0.6',
                h2_en: '9. Journal Secret: Defending Borderline Alphas',
                content_vi: `Khi Alpha nằm trong khoảng 0.6 - 0.7, nhiều hội đồng có thể sẽ vặn vẹo bạn. Bí kíp từ ncsStat: Hãy trích dẫn Hair et al. (2010) hoặc Robinson et al. (1991), nhấn mạnh rằng trong các nghiên cứu khám phá (Exploratory research) hoặc bối cảnh văn hóa mới, mức 0.6 là hoàn toàn hợp lệ. Ngoài ra, hãy kết hợp báo cáo "Inter-item correlation" (> 0.2) để củng cố rằng dù Alpha thấp nhưng các biến vẫn thuộc về cùng một miền khái niệm.`,
                content_en: `When Alpha falls between 0.6 and 0.7, reviewers might push back. ncsStat's tip: Cite Hair et al. (2010) or Robinson et al. (1991), arguing that 0.6 is acceptable for exploratory contexts or new scales. Supplement this by reporting 'Inter-item correlation' (> 0.2) to prove conceptual unity despite the lower score.`
            }
        ]
    },
    'efa-factor-analysis': {
        slug: 'efa-factor-analysis', category: 'Factor Analysis',
        title_vi: 'Phân tích nhân tố khám phá (EFA): Cấu trúc ẩn của dữ liệu nghiên cứu',
        title_en: 'Exploratory Factor Analysis (EFA): Unveiling Latent Data Structures',
        expert_tip_vi: 'Dùng phép xoay Promax nếu bạn tin rằng các nhân tố có tương quan, điều này phản ánh đúng thực tế xã hội hơn Varimax.', 
        expert_tip_en: "Use Promax rotation if you suspect constructs are correlated, as it reflects social reality better than Varimax.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'KMO > 0.5, Bartlett Sig. < 0.05, Factor Loading > 0.5',
        content_structure: [{
            h2_vi: '1. Mục tiêu và Bản chất học thuật của Phân tích EFA', 
            h2_en: '1. Goals and Scientific Essence of EFA',
            content_vi: `EFA (Exploratory Factor Analysis) là một kỹ thuật toán học phức tạp được sử dụng để giảm dữ liệu, rút gọn một tập hợp lớn các biến quan sát thành một số ít các nhân tố đại diện (Latent Constructs). Trong nghiên cứu định lượng, EFA đóng vai trò là "chiếc gương soi" giúp xác định liệu các câu hỏi khảo sát của bạn có thực sự hội tụ vào đúng các khái niệm lý thuyết như kỳ vọng ban đầu hay không. 

Tại ncsStat, chúng tôi sử dụng thuật toán Principal Component Analysis (PCA) hoặc Principal Axis Factoring để bóc tách từng lớp phương sai của dữ liệu. Mục tiêu cuối cùng là đảm bảo tính đơn hướng và giá trị hội tụ của thang đo, giúp các phân tích tiếp theo (như SEM hay Regression) có nền tảng vững chắc nhất. Không có EFA, bài nghiên cứu của bạn chỉ là một tập hợp các số liệu rời rạc thiếu cấu trúc.`,
            content_en: `EFA is a data reduction technique that extracts latent factors from a pool of observed variables. It confirms if your items actually measure what you intended to measure based on theoretical foundations. ncsStat uses optimized R engines to perform these complex matrix operations with high precision.`
        }, {
            h2_vi: '2. Kiểm định KMO và Bartlett: Điều kiện "cần" để tiến hành', 
            h2_en: '2. KMO & Bartlett: Prerequisites for Analysis',
            content_vi: `Trước khi bước vào phân tích ma trận xoay nhân tố, dữ liệu của bạn phải vượt qua hai bài kiểm tra "cửa ngõ" quan trọng bậc nhất:
- **Hệ số KMO (Kaiser-Meyer-Olkin)**: Đo lường tính thích hợp của mẫu. Giá trị KMO phải nằm trong khoảng từ 0 đến 1. Ngưỡng tối thiểu là 0.5, nhưng các nghiên cứu chất lượng cao tại ncsStat thường yêu cầu KMO > 0.7 (Mức tốt) hoặc > 0.8 (Mức rất tốt).
- **Kiểm định Bartlett (Bartlett\'s Test of Sphericity)**: Kiểm tra xem các biến quan sát có tương quan với nhau hay không. Kết quả phải có ý nghĩa thống kê (Sig. < 0.05) để phủ nhận giả thuyết ma trận tương quan là ma trận đơn vị. 

Nếu KMO thấp hoặc Bartlett không có ý nghĩa, việc chạy EFA là hoàn toàn vô nghĩa và không có giá trị học thuật. ncsStat sẽ cảnh báo bạn ngay lập tức nếu dữ liệu không đạt các tiêu chuẩn này.`,
            content_en: `KMO measures sampling adequacy (threshold > 0.5, ideally > 0.7). Bartlett's test must be significant (p < 0.05) to ensure variables are sufficiently correlated for factoring. If these conditions aren't met, your EFA results will be technically invalid.`
        }, {
            h2_vi: '3. Tiêu chuẩn quốc tế trong việc trích xuất nhân tố (Factor Retention)', 
            h2_en: '3. Global Standards for Factor Retention',
            content_vi: `Việc quyết định giữ lại bao nhiêu nhân tố là một nghệ thuật kết hợp giữa toán học và lý thuyết. ncsStat áp dụng 3 tiêu chuẩn vàng của giới học thuật: 
1. **Eigenvalue > 1 (Tiêu chuẩn Kaiser)**: Đảm bảo nhân tố giữ lại giải thích được nhiều biến thiên hơn một biến đơn lẻ. Đây là tiêu chuẩn phổ biến nhất.
2. **Tổng phương sai trích (Total Variance Explained) > 50-60%**: Đảm bảo rằng các nhân tố được giữ lại giải thích được phần lớn (ít nhất hơn một nửa) thông tin gốc của dữ liệu.
3. **Biểu đồ Scree Plot**: Quan sát điểm "gãy" của đồ thị. Số lượng nhân tố nằm phía trên điểm gãy sẽ được ưu tiên giữ lại.

Việc tuân thủ nghiêm ngặt các ngưỡng này giúp mô hình nghiên cứu của bạn không bị quá tải (overfitting) hoặc quá đơn giản (underfitting).`,
            content_en: `Determinining how many factors to keep involves: 1. Kaiser Criterion (Eigenvalue > 1). 2. Cumulative Variance > 50%. 3. Scree Plot analysis. ncsStat provides all these indicators in a few clicks to justify your inclusion decisions.`
        }, {
            h2_vi: '4. Hệ số tải nhân tố (Factor Loadings) và Sàng lọc biến rác', 
            h2_en: '4. Factor Loadings and Item Purification',
            content_vi: `Hệ số tải nhân tố (Factor Loading) chính là "sợi dây" liên kết giữa biến quan sát và nhân tố. Nó phản ánh mức độ đóng góp của biến đó vào khái niệm chung. 
- **Ngưỡng đạt chuẩn (Hair et al., 2010)**: Hệ số tải > 0.5 được coi là đạt yêu cầu thực tiễn. Một số nghiên cứu khắt khe yêu cầu > 0.7.
- **Biến tải chéo (Cross-loading)**: Nếu một biến tải lên nhiều nhân tố cùng lúc với khoảng cách hệ số tải < 0.3, biến đó được coi là "không tinh khiết" và cần bị loại bỏ.
- **Biến không đạt (Cross-loading)**: Biến không tải lên bất kỳ nhân tố nào với hệ số > 0.3 cũng cần được xem xét xử lý.

 ncsStat tự động tô đậm các biến yếu hoặc biến tải chéo để bạn dễ dàng "gạn đục khơi trong" cho thang đo của mình.`,
            content_en: `Loadings show how strongly an item relates to a factor. Threshold is typically > 0.5. Watch out for cross-loadings, where an item contributes significantly to multiple factors. ncsStat highlights these issues automatically.`
        }, {
            h2_vi: '5. Phép xoay nhân tố: Varimax (Vuông góc) vs. Promax (Xiên)', 
            h2_en: '5. Factor Rotation: Varimax vs. Promax',
            content_vi: `Ma trận nhân tố thô thường rất khó diễn giải. Phép xoay (Rotation) giúp làm rõ cấu trúc nhân tố bằng cách luân chuyển các trục tọa độ trong không gian dữ liệu.
- **Varimax (Orthogonal Rotation)**: Phép xoay vuông góc, giả định rằng các nhân tố hoàn toàn độc lập với nhau. Đây là lựa chọn truyền thống và dễ trình bày.
- **Promax/Direct Oblimin (Oblique Rotation)**: Phép xoay xiên, cho phép các nhân tố có tương quan với nhau.

Tại ncsStat, chúng tôi khuyến nghị dùng **Promax** cho các nghiên cứu hành vi con người (tâm lý, quản trị, marketing) vì trong thế giới thực, các yếu tố tâm lý hiếm khi tồn tại biệt lập hoàn toàn. Việc chọn phép xoay đúng phản ánh sự trưởng thành trong tư duy thống kê của bạn.`,
            content_en: `Rotation makes factor structures interpretable. Varimax assumes independent factors, while Promax allows for correlation. Promax is often superior for social science research where constructs are naturally related.`
        }, {
            h2_vi: '6. Xử lý khi biến quan sát "nhảy" nhân tố hoặc vi phạm cấu trúc', 
            h2_en: '6. Troubleshooting Factor Misalignment',
            content_vi: `Trong thực tế khảo sát, câu chuyện biến "nhảy" sang một nhân tố hoàn toàn khác so với lý thuyết là thường xuyên xảy ra. Khi gặp tình huống này, hãy kiểm tra:
1. **Nội dung câu hỏi**: Liệu câu hỏi đó có mang hàm ý mà người trả lời hiểu lầm sang hướng khác không?
2. **Kích thước mẫu (N)**: Nếu N quá nhỏ (dưới 100), ma trận EFA thường không ổn định và dễ gây nhiễu.
3. **Hiện tượng đảo nhãn**: Chắc chắn bạn đã đảo điểm các biến ngược trước khi chạy EFA.

ncsStat cung cấp công cụ "Interactive EFA" cho phép bạn thử loại bỏ biến rác và quan sát sự thay đổi của cấu trúc nhân tố ngay lập tức mà không cần tốn thời gian thiết lập lại từ đầu.`,
            content_en: `Unexpected factor assignments often stem from poor phrasing, small samples, or incorrect coding. ncsStat allows quick iterations to identify and solve these structural issues during the purification phase.`
        }, {
            h2_vi: '7. Tính hội tụ và Tính phân biệt trong kết quả EFA', 
            h2_en: '7. Convergence and Discriminant Validity in EFA',
            content_vi: `Một kết quả EFA đẹp phải thỏa mãn đồng thời hai điều kiện:
- **Giá trị hội tụ (Convergent Validity)**: Các biến đo lường cho cùng một khái niệm phải cùng tải về một nhân tố với hệ số cao (> 0.5).
- **Giá trị phân biệt (Discriminant Validity)**: Các biến thuộc biến nhân tố này không được tải mạnh sang nhân tố khác (không có tải chéo vi phạm).

Đây là "chứng chỉ" xác nhận rằng thang đo của bạn đã sẵn sàng cho các phép kiểm định mô hình cấu trúc phức tạp (SEM). ncsStat sẽ tự động kiểm tra các tiêu chuẩn này và đưa ra điểm số đánh giá chất lượng thang đo cho bài báo cáo của bạn.`,
            content_en: `Convergence means items intended for a specific construct load together strongly. Discriminant validity means they don't load on others. High-quality EFA results serve as the prerequisite for SEM and CFA.`
        }, {
            h2_vi: '8. Trình bày Ma trận xoay và Kết quả theo chuẩn APA 7', 
            h2_en: '8. Reporting EFA Results in APA 7 Structure',
            content_vi: `Một báo cáo EFA chuyên nghiệp cần bao gồm: Hệ số KMO, Sig. Bartlett, bảng Tổng phương sai trích (Cumulative Variance) và quan trọng nhất là Ma trận xoay nhân tố (Rotated Pattern/Structure Matrix).
"Phân tích EFA được thực hiện với phép xoay Promax cho thấy 20 biến quan sát hội tụ vào 4 nhân tố tại điểm dừng Eigenvalue = 1.25. Tổng phương sai trích đạt 65.4%, các hệ số tải nhân tố đều nằm trong khoảng từ .58 đến .89, đạt yêu cầu về giá trị hội tụ và phân biệt."

Hãy sử dụng tính năng "Export Academic Table" của ncsStat để có ngay các bảng biểu EFA chuẩn mực, sẵn sàng dán trực tiếp vào file Word luận văn của bạn mà không cần chỉnh sửa định dạng thủ công.`,
            content_en: `Include KMO, Bartlett’s test, Total Variance, and the Rotated Component Matrix. ncsStat provides automatic table generation following APA 7 requirements for immediate use in your dissertation or research paper.`
        },
        {
            h2_vi: '9. Bí mật đăng bài: Khi biến "lạc trôi" sang nhân tố khác',
            h2_en: '9. Journal Secret: Handling Factor Misalignment',
            content_vi: `Reviewer sẽ hỏi gì khi một biến lẽ ra thuộc nhân tố A lại nhảy sang nhân tố B? Thay vì xóa ngay lập tức, hãy thử giải thích dựa trên "Giá trị nội dung" (Content Validity). Có thể trong bối cảnh nghiên cứu của bạn (ví dụ: thị trường Việt Nam), người dùng hiểu khái niệm đó theo một cách khác. Việc giải thích thấu đáo các biến "lạc trôi" này đôi khi lại mở ra một Research Gap cực kỳ đắt giá cho bài báo của bạn.`,
            content_en: `What if an item loads on a different factor than expected? Instead of deleting it, attempt a defense via "Content Validity." Perhaps in your specific context (e.g., emerging markets), consumers interpret the concept differently. Defending these "misalignments" often uncovers high-value Research Gaps that lead to a successful publication.`
        }]
    },
    'regression-vif-multicollinearity': {
        slug: 'regression-vif-multicollinearity', category: 'Impact Analysis',
        title_vi: 'Hồi quy đa biến và Hiện tượng Đa cộng tuyến (VIF): Cẩm nang chuyên sâu', 
        title_en: 'Multiple Regression & Multicollinearity (VIF): In-depth Guide',
        expert_tip_vi: 'Khi VIF > 5, đừng vội loại biến. Hãy kiểm tra lại tương quan Pearson. Đôi khi việc gộp biến (Factor Score) là giải pháp tối ưu hơn.', 
        expert_tip_en: "When VIF > 5, don't just delete variables. Check Pearson correlations first. Sometimes using Factor Scores is a better solution.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'VIF < 5 (Acceptable), VIF < 10 (Maximum), Tolerance > 0.1',
        content_structure: [{
            h2_vi: '1. Bản chất của Phân tích Hồi quy trong Nghiên cứu Định lượng', 
            h2_en: '1. The Essence of Regression in Quantitative Research',
            content_vi: `Phân tích hồi quy tuyến tính bội (Multiple Linear Regression) là "xương sống" của hầu hết các nghiên cứu khoa học xã hội và kinh tế hiện đại. Mục tiêu cốt lõi của nó là xác định xem một nhóm các biến độc lập (Predictors) giải thích được bao nhiêu phần trăm sự biến thiên của biến phụ thuộc (Outcome). Tại ncsStat, thuật toán R-engine sẽ thực hiện các phép tính bình phương tối thiểu (OLS) để cực tiểu hóa sai số, từ đó đưa ra mô hình dự báo sát thực tế nhất.

Hồi quy không chỉ trả lời câu hỏi "Có tác động hay không?" mà còn trả lời câu hỏi "Tác động mạnh bao nhiêu?". Đây chính là nền tảng để các nhà hoạch định chính sách hoặc nhà quản lý đưa ra các quyết định dựa trên bằng chứng (evidence-based decision making). Một mô hình hồi quy tốt là tiền đề cho mọi kết luận khoa học có giá trị.`,
            content_en: `Multiple Linear Regression is the fundamental tool for quantifying relationships between multiple predictors and a dependent variable. It aims to minimize the sum of squared errors to find the best fit line. ncsStat uses powerful R kernels to ensure results are computationally accurate and meet global research standards.`
        }, {
            h2_vi: '2. Tại sao Đa cộng tuyến (Multicollinearity) lại là "Kẻ thù" của Hồi quy?', 
            h2_en: '2. Why Multicollinearity is the Mortal Enemy of Regression',
            content_vi: `Đa cộng tuyến xảy ra khi các biến độc lập trong mô hình của bạn có tương quan quá mạnh với nhau (> 0.8 hoặc 0.9). Điều này dẫn đến sự không ổn định nghiêm trọng trong việc ước lượng các hệ số hồi quy. 

Trong thống kê, đa cộng tuyến làm "thổi phồng" sai số chuẩn (Standard Errors) của các hệ số Beta. Điều này dẫn đến một nghịch lý gây nhức nhối cho các nhà nghiên cứu: Mô hình có R-square rất cao (độ phù hợp cực tốt) nhưng hầu hết các hệ số Beta lại không có ý nghĩa thống kê (p-value > 0.05). Hậu quả là bạn không thể kết luận được biến nào thực sự quan trọng. ncsStat giúp bạn phát hiện sớm hiện tượng này để tránh những sai lệch hoàn toàn trong kết quả nghiên cứu trước khi bạn nộp bài.`,
            content_en: `Multicollinearity occurs when predictors are highly redundant. It inflates standard errors, making results unstable and nonsensical (high R2 but non-significant predictors). ncsStat’s VIF and Tolerance diagnostics help you identify these "internal conflicts" in your data before they invalidate your findings.`
        }, {
            h2_vi: '3. Hiểu về Variance Inflation Factor (VIF) và Tolerance', 
            h2_en: '3. Decoding VIF and Tolerance Metrics',
            content_vi: `Để định lượng đa cộng tuyến một cách chính xác nhất, giới học thuật sử dụng hai chỉ số quan trọng: **VIF (Hệ số phóng đại biến thiên)** và **Tolerance (Dung sai)**.
- **VIF**: Cho biết sai số của hệ số hồi quy bị phóng đại lên bao nhiêu lần do đa cộng tuyến. 
- **Tolerance**: Là nghịch đảo của VIF (Tolerance = 1/VIF).

**Ngưỡng học thuật**: Thông thường, VIF < 5 được coi là an toàn tuyệt đối. Trong một số trường hợp nghiên cứu phức tạp, ngưỡng VIF < 10 có thể được chấp nhận. Tuy nhiên, nếu VIF > 10, đây là dấu hiệu của đa cộng tuyến nghiêm trọng và bắt buộc phải xử lý. ncsStat sẽ tự động bôi đỏ các giá trị VIF vượt ngưỡng để bạn có hành động khắc phục ngay lập tức.`,
            content_en: `VIF quantifies how much the excitement of multicollinearity is inflating your variance. Standard academic thresholds suggest VIF < 5 for strict models and < 10 for lenient ones. Tolerance (the reciprocal of VIF) should be > 0.1. ncsStat provides real-time alerts when these metrics cross hazardous lines.`
        }, {
            h2_vi: '4. Đánh giá Độ phù hợp: R-square vs. Adjusted R-square', 
            h2_en: '4. Assessing Model Fit: R2 and Adjusted R2',
            content_vi: `R-square (Hệ số xác định) cho biết tỷ lệ biến thiên của biến phụ thuộc được giải thích bởi toàn bộ mô hình. Tuy nhiên, R-square có một nhược điểm lớn: nó luôn tăng khi bạn thêm bất kỳ biến nào vào mô hình, kể cả biến đó là rác. 

Vì vậy, các chuyên gia ncsStat luôn khuyến nghị bạn dùng **Adjusted R-square** (R-square hiệu chỉnh) để báo cáo. Chỉ số này sẽ "phạt" mô hình nếu bạn thêm vào những biến độc lập không thực sự có ý nghĩa, giúp đánh giá độ phù hợp của mô hình một cách khách quan và chính xác nhất, tránh hiện tượng "Overfitting" (quá khớp) dữ liệu.`,
            content_en: `R-square measures the proportion of variance explained by your model. However, Adjusted R-square is superior for multiple regression because it penalizes for non-significant predictors, giving a more honest reflection of your model’s predictive power.`
        }, {
            h2_vi: '5. Ý nghĩa thực tiễn của Hệ số Beta Chuẩn hóa (Standardized Beta)', 
            h2_en: '5. The Power of Standardized Beta Coefficients',
            content_vi: `Hệ số Beta chuẩn hóa là công cụ mạnh mẽ nhất để so sánh mức độ tác động giữa các biến độc lập có đơn vị đo lường khác nhau (ví dụ: so sánh tác động của "Độ tuổi" và "Thu nhập"). 

Nếu nhân tố A có Beta = 0.4 và nhân tố B có Beta = 0.2, bạn có thể khẳng định chắc chắn rằng nhân tố A có mức độ tác động mạnh gấp đôi nhân tố B lên biến phụ thuộc. Tại ncsStat, chúng tôi trình bày cả hai loại hệ số: Unstandardized Beta (để xây dựng phương trình dự báo) và Standardized Beta (để so sánh tầm quan trọng của các nhân tố), giúp bài nghiên cứu của bạn sâu sắc và chuyên nghiệp hơn.`,
            content_en: `Standardized Beta coefficients erase the measurement units of your predictors, allowing for direct comparison of influence. A Beta of .5 is twice as powerful as a Beta of .25. ncsStat highlights the most influential paths to help you focus your discussion.`
        }, {
            h2_vi: '6. Phân tích Phần dư (Residuals) và các Giả định OLS khắt khe', 
            h2_en: '6. Residual Analysis and OLS Assumptions',
            content_vi: `Một mô hình hồi quy chỉ thực sự có giá trị khi nó thỏa mãn các giả định cơ bản của phương pháp OLS. ncsStat cung cấp đầy đủ các kiểm định cho:
1. **Tính tuyến tính**: Mối quan hệ giữa các biến phải là đường thẳng.
2. **Tính độc lập (Durbin-Watson)**: Phần dư không được tự tương quan (ngưỡng 1.5 - 2.5).
3. **Phân phối chuẩn của phần dư**: Kiểm tra qua biểu đồ Normal P-P Plot.
4. **Phương sai sai số không đổi (Homoscedasticity)**: Đảm bảo độ chính xác của các kiểm định t và F.

Việc bỏ qua các bước kiểm tra phần dư là sai lầm chết người khiến bài báo cáo của bạn dễ dàng bị các phản biện bác bỏ vì thiếu tính chính xác về mặt toán học.`,
            content_en: `Regression relies on strict assumptions: linearity, independence (Durbin-Watson), and normal residuals. ncsStat’s diagnostic suite provides automated tests for all three, ensuring your model results are theoretically sound and publishable.`
        }, {
            h2_vi: '7. Các bước xử lý chuyên sâu khi VIF vượt ngưỡng cho phép', 
            h2_en: '7. Clinical Remedial Steps for High VIF Issues',
            content_vi: `Nếu hệ thống ncsStat báo đỏ VIF > 5, bạn có 3 giải pháp hàn lâm nhất để xử lý:
1. **Loại bỏ biến**: Ưu tiên loại bỏ biến có VIF cao nhất hoặc biến có tương quan Pearson > 0.8 với biến khác.
2. **Gộp biến (Data Reduction)**: Sử dụng Phân tích nhân tố khám phá (EFA) hoặc tính điểm trung bình (Factor Score) để gộp các biến bị trùng lắp nội dung thành một nhân tố đại diện duy nhất. Đây là giải pháp tối ưu nhất để bảo toàn thông tin.
3. **Tăng kích thước mẫu**: Đôi khi đa cộng tuyến chỉ là hiện tượng tạm thời do cỡ mẫu quá nhỏ, không phản ánh đúng đặc điểm của tổng thể.

Quy trình này giúp mô hình sạch đa cộng tuyến, các hệ số Beta trở nên ổn định và có ý nghĩa thống kê thực sự cho các kết luận khoa học của bạn.`,
            content_en: `Don't panic about high VIF. Remedial steps include: Removing the redundant variable, using Factor Analysis to merge predictors, or increasing sample size to stabilize estimates. ncsStat guides you through these strategic choices with real-time feedback.`
        }, {
            h2_vi: '8. Trình bày kết quả Hồi quy chuyên nghiệp theo chuẩn APA 7', 
            h2_en: '8. Reporting Regression Results (APA 7 Global Standard)',
            content_vi: `Khi trình bày kết quả trong báo cáo khoa học, bạn cần tuân thủ cấu trúc nghiêm ngặt:
- Báo cáo ý nghĩa của toàn bộ mô hình qua chỉ số F và Sig. của bảng ANOVA.
- Báo cáo Adjusted R-square để khẳng định sức mạnh giải thích.
- Trình bày bảng Coefficients với đầy đủ các cột: B, SE, Beta, t, p-value và quan trọng nhất là cột VIF để chứng minh mô hình không vi phạm giả định.

"Kết quả kiểm định cho thấy mô hình hồi quy đạt độ phù hợp tốt (F = 45.2, p < .001) và không vi phạm đa cộng tuyến (VIF < 2.4). Biến 'Trải nghiệm khách hàng' có tác động mạnh nhất đến 'Lòng trung thành' (Beta = .452, p < .001)." Đây là cách viết giúp bài nghiên cứu của bạn đạt điểm tuyệt đối về năng lực thực hành thống kê.`,
            content_en: `Reporting should include model fit (F and p-value), variance explained (Adjusted R2), and detailed coefficients (B, Beta, t, p, and VIF). ncsStat auto-generates these interpretations to ensure your report meets the highest academic presentation standards.`
        },
        {
            h2_vi: '9. Bí mật đăng bài: Bảo vệ mô hình có R-square thấp',
            h2_en: '9. Journal Secret: Defending Low R-square Models',
            content_vi: `Nhiều bạn lo lắng khi R-square chỉ đạt 0.1 - 0.2. Thực tế trong khoa học hành vi, con người rất khó đoán định nên R-square thấp là bình thường. ncsStat khuyên bạn hãy tập trung vào ý nghĩa của hệ số Beta và p-value. Một mô hình giải thích được 10% nhưng chỉ ra được một tác động có ý nghĩa của chính sách lên hành vi vẫn có giá trị đăng bài Scopus cao hơn một mô hình R-square 0.9 nhưng bị đa cộng tuyến.`,
            content_en: `Don't panic if your R-square is only 0.1 - 0.2. In behavioral science, human intent is noisy, making low R-squares common. ncsStat suggests focusing on Beta significance and p-values. A model explaining 10% of variance with a meaningful policy-driven path is more publishable than an R-square 0.9 model riddled with multicollinearity.`
        }]
    },
    'independent-t-test-guide': {
        slug: 'independent-t-test-guide', category: 'Difference Analysis',
        title_vi: 'Kiểm định Independent Samples T-test: So sánh sự khác biệt giữa hai nhóm độc lập',
        title_en: 'Independent Samples T-test: Comparing Two Independent Groups',
        expert_tip_vi: 'Luôn kiểm tra Kiểm định Levene trước. Nếu Sig. Levene < 0.05, bạn phải đọc kết quả ở dòng "Equal variances not assumed".', 
        expert_tip_en: "Always check Levene's Test first. If Levene's Sig. < 0.05, read the results from the 'Equal variances not assumed' row.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Levene Sig. > 0.05, T-test Sig. < 0.05',
        content_structure: [{
            h2_vi: '1. Bản chất và Mục tiêu của Kiểm định Independent T-test', 
            h2_en: '1. The Essence and Goals of Independent Samples T-test',
            content_vi: `Kiểm định T-test mẫu độc lập là một trong những phép thử phổ biến nhất để so sánh giá trị trung bình của một biến định lượng (ví dụ: Sự hài lòng, Thu nhập, Điểm số) giữa hai nhóm đối tượng hoàn toàn tách biệt (ví dụ: Nam và Nữ, Người đã kết hôn và Người độc thân). 

Tại ncsStat, chúng tôi nhấn mạnh mục tiêu của phép thử này là xác định xem sự khác biệt quan sát được giữa hai nhóm là thực sự tồn tại trong tổng thể hay chỉ là do ngẫu nhiên khi chọn mẫu. Đây là công cụ đắc lực để các nhà nghiên cứu khẳng định các giả thuyết về sự khác biệt theo đặc điểm nhân khẩu học.`,
            content_en: `The Independent Samples T-test compares the means of two unrelated groups on the same continuous, dependent variable. It determines if the statistical difference between them is significant or merely due to sampling chance. ncsStat provides crystal-clear output to help you justify group comparisons.`
        }, {
            h2_vi: '2. Các Giả định khắt khe trước khi thực hiện T-test', 
            h2_en: '2. Strict Assumptions for T-test Validity',
            content_vi: `Để kết quả T-test có giá trị khoa học, dữ liệu của bạn phải thỏa mãn 3 giả định:
1. **Tính độc lập**: Các quan sát trong nhóm này không liên quan đến nhóm kia.
2. **Phân phối chuẩn**: Biến phụ thuộc phải có phân phối chuẩn trong mỗi nhóm (kiểm tra qua Skewness/Kurtosis hoặc Shapiro-Wilk).
3. **Phương sai đồng nhất**: Độ biến thiên của dữ liệu trong hai nhóm phải tương đồng.

ncsStat tích hợp sẵn các công cụ kiểm tra giả định này ngay trong luồng phân tích, giúp bạn an tâm về tính chính xác của các kết luận rút ra.`,
            content_en: `Validity depends on three pillars: Independence of observations, normality of the dependent variable across groups, and homogeneity of variance. ncsStat’s workflow includes automated checks for these assumptions before you interpret p-values.`
        }, {
            h2_vi: '3. Hiểu về Kiểm định Levene và Giả định phương sai đồng nhất', 
            h2_en: '3. Decoding Levene’s Test for Homogeneity of Variance',
            content_vi: `Trước khi đọc kết quả T-test chính, bạn bắt buộc phải "đi ngang qua" kiểm định Levene. 
- **Nếu Sig. Levene > 0.05**: Phương sai hai nhóm đồng nhất. Bạn sẽ đọc trị số t và p-value ở dòng "Equal variances assumed".
- **Nếu Sig. Levene < 0.05**: Phương sai không đồng nhất. Bạn phải đọc kết quả ở dòng "Equal variances not assumed" (còn gọi là Welch's T-test).

ncsStat tự động phân tích và đưa ra lời khuyên chính xác dòng nào cần đọc, giúp các nhà nghiên cứu trẻ không bao giờ bị nhầm lẫn khi trình bày báo cáo.`,
            content_en: `Levene’s test checks if your groups have equal variances. Sig > 0.05 means you use the standard T-test; Sig < 0.05 means you use the Welch T-test. ncsStat highlights the correct row for you, preventing common interpretation errors.`
        }, {
            h2_vi: '4. Diễn giải P-value và Ý nghĩa thống kê trong So sánh', 
            h2_en: '4. Interpreting P-values and Statistical Significance',
            content_vi: `Chỉ số Sig. (2-tailed) hay P-value là "chìa khóa" cuối cùng. 
- **P < 0.05**: Có sự khác biệt có ý nghĩa thống kê giữa hai nhóm. Bạn có căn cứ để bác bỏ giả thuyết H0.
- **P > 0.05**: Không có sự khác biệt. Mọi chênh lệch về con số trung bình chỉ là do ngẫu nhiên.

Tại ncsStat, chúng tôi trình bày P-value một cách trực quan, giúp bạn nhanh chóng xác định được mức độ tin cậy của sự khác biệt đó (95%, 99% hay 99.9%).`,
            content_en: `The P-value (Sig.) is your threshold for success. Below 0.05 indicates a real difference between groups. ncsStat provides exact p-values down to three decimals to support your scientific claims.`
        }, {
            h2_vi: '5. Độ lớn tác động Cohen\'s d: Khác biệt bao nhiêu là đủ?', 
            h2_en: '5. Effect Size: Cohen’s d and Practical Significance',
            content_vi: `Trong các nghiên cứu tầm quốc tế, P-value là chưa đủ. Bạn cần biết sự khác biệt đó là lớn hay nhỏ về mặt thực tiễn. Chỉ số Cohen's d là thước đo tiêu chuẩn:
- **d = 0.2**: Tác động nhỏ.
- **d = 0.5**: Tác động trung bình.
- **d = 0.8**: Tác động lớn.

ncsStat tự động tính toán Cohen's d, giúp bài nghiên cứu của bạn đạt tầm vóc học thuật sâu sắc hơn, thay vì chỉ dừng lại ở việc báo cáo "có" hay "không" đơn thuần.`,
            content_en: `P-value tells you IF there is a difference; Cohen’s d tells you HOW BIG it is. Reporting effect size is now mandatory in APA 7 journals. ncsStat automates this calculation for every T-test.`
        }, {
            h2_vi: '6. Xử lý khi vi phạm Giả định phân phối chuẩn', 
            h2_en: '6. Handling Violations of the Normality Assumption',
            content_vi: `Nếu dữ liệu của bạn vi phạm nặng nề phân phối chuẩn (Skewness/Kurtosis quá lớn), phép thử T-test có thể không còn chính xác. Khi đó, ncsStat khuyên bạn nên sử dụng kiểm định phi tham số **Mann-Whitney U** thay thế.

Kiểm định này dựa trên thứ hạng (ranks) thay vì giá trị trung bình, giúp kết quả của bạn vẫn đứng vững về mặt toán học ngay cả khi tập dữ liệu bị lệch mạnh hoặc có nhiều Outliers.`,
            content_en: `If normality fails, switch to the Mann-Whitney U test. This non-parametric alternative uses ranks instead of means, making it robust against outliers and skewed data. ncsStat suggests this transition automatically.`
        }, {
            h2_vi: '7. Trực quan hóa sự khác biệt qua biểu đồ cột và sai số', 
            h2_en: '7. Visualizing Group Differences with Error Bars',
            content_vi: `Con số nói lên sự thật, nhưng biểu đồ làm cho sự thật đó trở nên thuyết phục. ncsStat xuất bản các biểu đồ Bar Chart kèm theo thanh sai số (Error Bars) thể hiện Khoảng tin cậy 95%. 

Sự tách rời giữa hai cột kèm theo các ký hiệu ý nghĩa thống kê (*) sẽ giúp người đọc báo cáo của bạn nắm bắt được kết quả nghiên cứu chỉ trong vài giây quan sát.`,
            content_en: `Our Bar Charts with 95% Confidence Interval error bars provide visual proof of group divergence. Use ncsStat's high-res exports to enhance the visual impact of your findings.`
        }, {
            h2_vi: '8. Trình bày kết quả T-test chuyên nghiệp chuẩn APA 7', 
            h2_en: '8. Reporting T-test Results in APA 7 Standards',
            content_vi: `Báo cáo T-test cần có đầy đủ trị số t, bậc tự do (df) và mức ý nghĩa (p). 
"Kết quả cho thấy có sự khác biệt có ý nghĩa về mức độ stress giữa nhóm quản lý (M = 3.8, SD = 0.5) và nhóm nhân viên (M = 3.1, SD = 0.6), t(198) = 4.25, p < .001. Hệ số Cohen's d = 0.65 cho thấy mức độ tác động trung bình."

Hãy tận dụng tính năng nhận định tự động của ncsStat để có văn bản chuẩn mực, sẵn sàng đưa vào chương 4 luận văn của bạn.`,
            content_en: `Report t, df, and p-values following APA 7. Example: t(198) = 4.25, p < .001. ncsStat generates these academic phrases automatically to save you time and ensure format accuracy.`
        }]
    },
    'one-way-anova-post-hoc': {
        slug: 'one-way-anova-post-hoc', category: 'Difference Analysis',
        title_vi: 'Phân tích ANOVA một nhân tố và Kiểm định Post-hoc: So sánh đa nhóm',
        title_en: 'One-Way ANOVA & Post-hoc Tests: Multi-Group Comparisons',
        expert_tip_vi: 'Nếu ANOVA có ý nghĩa nhưng Post-hoc không tìm thấy cặp nào khác biệt, hãy kiểm tra lại cỡ mẫu của từng nhóm. Các nhóm quá lệch nhau sẽ làm giảm công suất thống kê.', 
        expert_tip_en: "If ANOVA is significant but Post-hoc finds no specific group differences, check your group sizes. Highly unequal N can reduce statistical power.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'F-test Sig. < 0.05, Brown-Forsythe/Welch if Levene fails',
        content_structure: [{
            h2_vi: '1. Tại sao dùng ANOVA thay vì chạy nhiều phép thử T-test?', 
            h2_en: '1. Why ANOVA Instead of Multiple T-tests?',
            content_vi: `Khi bạn muốn so sánh giá trị trung bình từ 3 nhóm trở lên (ví dụ: So sánh Sự hài lòng giữa các nhóm Độ tuổi: <18, 18-30, >30), việc chạy 3 phép thử T-test riêng biệt sẽ làm tăng sai lầm loại I (Family-wise error rate). 

ANOVA (Analysis of Variance) giải quyết triệt để vấn đề này bằng cách kiểm định đồng thời sự khác biệt giữa tất cả các nhóm chỉ trong một phép thử duy nhất, giữ cho mức ý nghĩa 0.05 luôn được bảo toàn. Tại ncsStat, chúng tôi cung cấp quy trình ANOVA tinh gọn và chính xác nhất.`,
            content_en: `Running multiple T-tests increases the chance of a Type I error. ANOVA tests for any difference across all means simultaneously, maintaining your alpha level. ncsStat automates this to ensure your multi-group comparisons stay statistically valid.`
        }, {
            h2_vi: '2. Bản chất toán học của chỉ số F (F-statistic)', 
            h2_en: '2. The Mathematical Foundation of the F-statistic',
            content_vi: `Trị số F trong bảng ANOVA là tỷ lệ giữa phương sai giữa các nhóm (Between-groups variance) và phương sai trong nội bộ nhóm (Within-groups variance). 
- F càng lớn: Khả năng tồn tại sự khác biệt thực sự càng cao.
- F gần bằng 1: Sự khác biệt giữa các nhóm chỉ ngang bằng với sự biến thiên tự nhiên bên trong mẫu.

ncsStat không chỉ cung cấp trị số F mà còn diễn giải ý nghĩa của nó dựa trên bậc tự do, giúp bạn hiểu sâu sắc tại sao mô hình của mình lại có ý nghĩa thống kê hay không.`,
            content_en: `The F-ratio compares variance between groups to variance within groups. A high F stringly suggests that group means are not equal. ncsStat provides detailed F-tables and p-values to clarify these structural differences.`
        }, {
            h2_vi: '3. Kiểm định Levene và các biến thể ANOVA (Welch/Brown-Forsythe)', 
            h2_en: '3. Levene’s Test and Robust ANOVA Alternatives',
            content_vi: `Tương tự T-test, ANOVA đòi hỏi phương sai đồng nhất. Nếu Sig. Levene < 0.05, kết quả ANOVA truyền thống có thể bị sai lệch. 
 ncsStat cung cấp các giải pháp "Robust ANOVA" mạnh mẽ như kiểm định **Welch** hoặc **Brown-Forsythe**. Đây là các phép hiệu chuẩn tiên tiến giúp bạn vẫn đưa ra được kết luận chính xác ngay cả khi dữ liệu vi phạm giả định phương sai, một tình huống cực kỳ phổ biến trong thực tế thu thập dữ liệu xã hội.`,
            content_en: `Standard ANOVA assumes equal variances. If Levene fails, ncsStat provides Welch's F and Brown-Forsythe tests as robust alternatives. These ensure academic integrity even when your data isn't perfect.`
        }, {
            h2_vi: '4. Kiểm định hậu kiểm (Post-hoc): Đi tìm sự khác biệt cụ thể', 
            h2_en: '4. Post-hoc Tests: pinpointing Specific Group Differences',
            content_vi: `Kết quả ANOVA Sig. < 0.05 chỉ cho bạn biết "có ít nhất một cặp nhóm khác nhau", nhưng chưa biết chính xác là cặp nào. Đó là lúc bạn cần đến Post-hoc.
- **Tukey HSD**: Lựa chọn phổ biến nhất khi phương sai đồng nhất.
- **Games-Howell**: Lựa chọn vàng khi phương sai KHÔNG đồng nhất.
- **LSD/Bonferroni**: Các lựa chọn thay thế tùy theo mục đích nghiên cứu.

ncsStat tự động đề xuất và thực hiện phép thử Post-hoc phù hợp nhất, giải quyết bài toán so sánh từng đôi một một cách khoa học.`,
            content_en: `ANOVA is an omnibus test; it tells you there's a difference but not where. Post-hoc tests like Tukey or Games-Howell pinpoint exactly which pairs differ. ncsStat handles these multiple comparisons with automated error correction.`
        }, {
            h2_vi: '5. Độ lớn tác động Eta-squared (η²): Tầm quan trọng của yếu tố', 
            h2_en: '5. Effect Size: Eta-squared (η²) and Model Importance',
            content_vi: `Chỉ số η² cho biết bao nhiêu phần trăm sự biến thiên của biến phụ thuộc là do sự khác biệt giữa các nhóm gây ra. 
- **η² = 0.01**: Tác động yếu.
- **η² = 0.06**: Tác động trung bình.
- **η² = 0.14**: Tác động mạnh.

Việc báo cáo η² giúp bạn khẳng định với hội đồng rằng biến phân loại (ví dụ: Trình độ học văn) đóng góp bao nhiêu phần vào việc giải thích hành vi khách hàng. ncsStat tính toán chỉ số này tự động cho mọi mô hình ANOVA.`,
            content_en: `Eta-squared quantifies the percentage of variance explained by your grouping variable. It's the "R-square for ANOVA." ncsStat helps you justify the practical importance of your group categories using these standardized effect sizes.`
        }, {
            h2_vi: '6. Phân tích Đơn điệu và Xu hướng (Trend Analysis)', 
            h2_en: '6. Linearity and Trend Analysis in ANOVA',
            content_vi: `Trong một số nghiên cứu, bạn không chỉ muốn biết các nhóm có khác nhau không, mà còn muốn biết liệu có một xu hướng tăng dần hay giảm dần theo các thứ bậc (ví dụ: Thu nhập tăng thì Hài lòng tăng) hay không. ncsStat hỗ trợ kiểm định xu hướng (Linear Trend), giúp bạn phát hiện các mối quan hệ tuyến tính ẩn sau các nhóm phân loại, nâng tầm bài viết từ mô tả sang dự báo.`,
            content_en: `Trend analysis looks for patterns (linear, quadratic) across groups. This adds predictive power to your descriptive analysis. ncsStat allows you to test for specific directions in your group means.`
        }, {
            h2_vi: '7. Xử lý khi vi phạm tính Phân phối chuẩn của ANOVA', 
            h2_en: '7. Dealing with Non-normal Group Distributions',
            content_vi: `Khi các nhóm có kích thước mẫu quá nhỏ hoặc vi phạm nặng nề tính phân phối chuẩn, phép thử **Kruskal-Wallis** (ANOVA phi tham số) là sự lựa chọn thay thế an toàn. ncsStat cung cấp đầy đủ công cụ này, cho phép bạn thực hiện các so sánh đa nhóm ngay cả khi dữ liệu không đạt chuẩn mực lý tưởng.`,
            content_en: `If normality fails, use the Kruskal-Wallis test. ncsStat provides seamless transitions to non-parametric equivalents to ensure your results stay scientifically robust under any data condition.`
        }, {
            h2_vi: '8. Trình bày kết quả ANOVA chuyên nghiệp chuẩn APA 7', 
            h2_en: '8. Professional ANOVA Reporting following APA 7 Standards',
            content_vi: `Báo cáo cần có F(df_between, df_within), p-value và kết quả Post-hoc.
"Kết quả ANOVA cho thấy có sự khác biệt có ý nghĩa về hiệu quả công việc giữa 3 phòng ban, F(2, 147) = 5.67, p = .004, η² = .08. Kiểm định Tukey chỉ ra rằng phòng Marketing (M = 4.2) có hiệu quả cao hơn đáng kể so với phòng Nhân sự (M = 3.5)."

 ncsStat cung cấp các bảng biểu đẹp mắt và mẫu văn bản học thuật để bạn hoàn thiện báo cáo của mình chỉ bằng vài lần click chuột.`,
            content_en: `APA style requires reporting F-values with degrees of freedom and p-values. Example: F(2, 45) = 3.89, p = .028. ncsStat’s output is pre-formatted for direct copy-pasting into your academic work.`
        }]
    },
    'descriptive-statistics-interpretation': {
        slug: 'descriptive-statistics-interpretation', category: 'Preliminary Analysis',
        title_vi: 'Thống kê mô tả: Nghệ thuật kể chuyện qua các con số',
        title_en: 'Descriptive Statistics: The Art of Storytelling with Numbers',
        expert_tip_vi: 'Mean (Trung bình) rất nhạy cảm với Outliers. Hãy luôn báo cáo kèm theo Median (Trung vị) và Độ lệch chuẩn (SD) để có cái nhìn trung thực nhất.',
        expert_tip_en: 'Mean is sensitive to outliers. Always report Median and Standard Deviation (SD) for a robust overview of your data.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Trung bình, Trung vị và Yếu vị: "Bộ ba" định vị dữ liệu',
                h2_en: '1. Mean, Median, and Mode: Positioning Your Data',
                content_vi: `Đây là những chỉ số đo lường xu hướng tập trung. Trong khi Mean cho biết giá trị trung bình tổng thể, thì Median là "điểm rơi" chính giữa của tập dữ liệu. Nếu Mean và Median cách xa nhau, dữ liệu của bạn đang bị lệch (skewed). ncsStat giúp bạn phát hiện sự lệch pha này để chọn các phép kiểm định phi tham số phù hợp nếu cần thiết.`,
                content_en: `The Mean provides the overall average, while the Median identifies the central point of the distribution. A large discrepancy between them indicates skewness. ncsStat highlights these differences to guide your choice between parametric and non-parametric tests.`
            },
            {
                h2_vi: '2. Độ lệch chuẩn (SD) và Phương sai: Thước đo của sự ổn định',
                h2_en: '2. Standard Deviation and Variance: Measuring Stability',
                content_vi: `SD cho biết mức độ phân tán của dữ liệu quanh giá trị trung bình. SD thấp có nghĩa là mọi người trả lời khá giống nhau (độ đồng thuận cao). SD cao gợi ý rằng có sự chia rẽ trong ý kiến hoặc dữ liệu chứa nhiều ngoại lai (Outliers). Tại ncsStat, chúng tôi bôi đậm các giá trị SD > 1.5 để bạn lưu ý về tính biến động của tập mẫu.`,
                content_en: `SD measures data dispersion. A low SD indicates high consensus among respondents, while a high SD suggests polarized opinions or potential outliers. ncsStat flags high SD values (>1.5) to alert you to excessive data volatility.`
            },
            {
                h2_vi: '3. Skewness (Độ lệch) và Kurtosis (Độ nhọn): Chẩn đoán Phân phối chuẩn',
                h2_en: '3. Skewness and Kurtosis: Diagnosing Normality',
                content_vi: `Để chạy các phép thử mạnh mẽ như T-test, ANOVA hay SEM, dữ liệu cần có phân phối chuẩn. Skewness (độ lệch) nên nằm trong khoảng [-2; 2] và Kurtosis (độ nhọn) nên nằm trong khoảng [-7; 7] (theo Kline, 2011). Nếu vượt quá ngưỡng này, các kết luận thống kê của bạn sẽ bị hội đồng nghi ngờ về tính chính xác. ncsStat tự động kiểm tra các ngưỡng này cho bạn một cách nghiêm ngặt.`,
                content_en: `Normality is crucial for parametric tests. Skewness should be within [-2, 2] and Kurtosis within [-7, 7] (Kline, 2011). Violating these thresholds can invalidate your statistical conclusions. ncsStat provides automated normality checks to ensure your data meets rigorous academic criteria.`
            },
            {
                h2_vi: '4. Tần suất (Frequency) và Tỷ lệ: Đọc vị đặc điểm nhân khẩu học',
                h2_en: '4. Frequencies and Percentages: Reading Demographics',
                content_vi: `Trong nghiên cứu xã hội, việc báo cáo tần suất giúp họa lên "chân dung" đối tượng khảo sát. "Có bao nhiêu % là nam? Bao nhiêu % có thu nhập trên 10 triệu?". ncsStat cung cấp các bảng tần suất sạch đẹp kèm biểu đồ tròn/cột tự động, sẵn sàng để bạn dán vào phần "Đặc điểm mẫu nghiên cứu" trong luận văn.`,
                content_en: `Frequencies and percentages paint a profile of your respondents. ncsStat provides pre-formatted frequency tables and automated charts (pie/bar) for your "Sample Profile" section, ensuring professional presentation of demographic data.`
            },
            {
                h2_vi: '5. Phân tích Min - Max: Giới hạn của sự trải nghiệm',
                h2_en: '5. Min-Max Analysis: The Boundaries of Experience',
                content_vi: `Giá trị nhỏ nhất và lớn nhất giúp bạn kiểm soát lỗi nhập liệu (ví dụ: tuổi 200) và thấy được biên độ của cảm xúc/hành vi. "Sự hài lòng thấp nhất là 1, cao nhất là 5". ncsStat tự động lọc ra các giá trị vô lý để bạn làm sạch dữ liệu (Data cleaning) trước khi phân tích chính thức.`,
                content_en: `Min and Max values help spot data entry errors (e.g., age 200) and reveal the range of respondent experiences. ncsStat automatically filters out nonsensical values during the cleaning phase, protecting the integrity of your final counts.`
            },
            {
                h2_vi: '6. Trực quan hóa dữ liệu: Histogram và Boxplot',
                h2_en: '6. Data Visualization: Histograms and Boxplots',
                content_vi: `Một biểu đồ có giá trị hơn ngàn con số. Histogram giúp bạn thấy hình dáng của phân phối (hình chuông hay lệch). Boxplot giúp bạn khoanh vùng Outliers một cách trực quan. ncsStat xuất bản các hình ảnh chất lượng cao (300 DPI) đủ tiêu chuẩn để in ấn trong luận văn hoặc gửi tạp chí quốc tế.`,
                content_en: `Visuals speak louder than tables. Histograms show distribution shapes, while Boxplots identify outliers visually. ncsStat generates high-resolution (300 DPI) plots ready for publication or final dissertation printing.`
            },
            {
                h2_vi: '7. Sai sót thường gặp khi báo cáo Thống kê mô tả',
                h2_en: '7. Common Pitfalls in Descriptive Reporting',
                content_vi: `Sai lầm lớn nhất là báo cáo quá nhiều số thập phân (nên để 2-3 chữ số) hoặc chỉ báo cáo Mean mà quên mất phân bổ. ncsStat tự động làm tròn số liệu theo chuẩn APA và đưa ra các nhận định về tính đại diện của mẫu, giúp bài báo cáo của bạn chuyên nghiệp và thuyết phục hơn trong mắt các phản biện khó tính.`,
                content_en: `Avoid over-reporting decimals (2-3 is ideal) and neglecting to report distribution dispersion. ncsStat automatically formats numbers according to APA standards and provides representative narratives to boost the credibility of your report.`
            },
            {
                h2_vi: '8. Cách viết nhận định đặc điểm mẫu chuẩn APA 7',
                h2_en: '8. Writing Sample Descriptions in APA 7 Style',
                content_vi: `Mẫu văn văn chuẩn: "Tập mẫu nghiên cứu gồm 300 đối tượng, trong đó nữ giới chiếm đa số (65%). Độ tuổi trung bình là 24.5 (SD = 2.1). Các biến quan sát đều đạt giá trị Skewness và Kurtosis nằm trong ngưỡng cho phép, cho thấy dữ liệu có phân phối chuẩn và đủ điều kiện để thực hiện các phân tích tiếp theo." ncsStat tự động tạo ra những đoạn văn này, bạn chỉ cần copy và dán vào bài viết của mình.`,
                content_en: `Standard phrasing: "The sample consisted of 300 individuals, predominantly female (65%). The mean age was 24.5 (SD = 2.1)." Use ncsStat's auto-narrative feature to generate these standard academic phrases for immediate use in your paper.`
            },
            {
                h2_vi: '9. Bí mật đăng bài: "Làm đẹp" bảng số liệu mô tả',
                h2_en: '9. Journal Secret: Polishing Descriptive Tables',
                content_vi: `Thay vì trình bày một bảng dài dằng dặc, hãy dùng "Grand Mean" (Trung bình của các trung bình) cho từng nhân tố. Điều này giúp Reviewer nhanh chóng nắm bắt được biến nào đang có điểm số cao nhất trong mô hình. ncsStat tự động tính toán Grand Mean này cho bạn, giúp cấu trúc bài viết trở nên gọn gàng và đậm chất học giả quốc tế.`,
                content_en: `Avoid long, exhaustive item lists. Instead, report the "Grand Mean" (average of averages) per construct. This allows reviewers to instantly identify the dominant factors in your model. ncsStat automates Grand Mean calculations, making your results section lean and professionally structured.`
            }
        ]
    },
    'pearson-correlation-analysis': {
        slug: 'pearson-correlation-analysis', category: 'Association Analysis',
        title_vi: 'Tương quan Pearson Masterclass: Thẩm định mối liên kết giữa các biến số',
        title_en: 'Pearson Correlation Masterclass: Validating Inter-variable Links',
        expert_tip_vi: 'Hãy luôn kiểm tra đồ thị Scatter Plot trước khi đọc hệ số r. Một giá trị r = 0 có thể không phải là không có mối liên hệ, mà là do mối liên hệ đó không tuyến tính (ví dụ hình chữ U). Pearson chỉ đo được đường thẳng!', 
        expert_tip_en: "Always inspect the Scatter Plot first. An 'r' of 0 doesn't necessarily mean no relationship; it just means no linear relationship. Pearson only captures straight lines!",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'r > 0.3 (Medium), r > 0.5 (Strong), p < 0.05 (Significant)',
        content_structure: [
            {
                h2_vi: '1. Bản chất cốt lõi của Hệ số Tương quan Pearson (r)',
                h2_en: '1. The Core Essence of Pearson’s Correlation (r)',
                content_vi: `Hệ số tương quan Pearson (Product-Moment Correlation) là "xương sống" của phân tích thống kê khám phá. Nó định lượng độ mạnh và hướng của mối quan hệ tuyến tính giữa hai biến định lượng. 
                ncsStat giúp bạn hiểu rằng giá trị r không chỉ là một con số, mà là bằng chứng về cách các biến số "vận động" cùng nhau. Trong nghiên cứu học thuật, đây là bước đệm bắt buộc trước khi tiến hành các phân tích nhân quả chuyên sâu như hồi quy hay cấu trúc tuyến tính (SEM).`,
                content_en: `Pearson’s r is the backbone of exploratory statistics, quantifying the strength and direction of linear links between scales. ncsStat empowers you to see beyond the number, treating 'r' as empirical evidence of how variables move in tandem—an essential precursor to causal modeling and SEM.`
            },
            {
                h2_vi: '2. Ma trận tương quan: "Bản đồ" chiến lược của nhà nghiên cứu',
                h2_en: '2. The Correlation Matrix: A Researcher’s Strategic Map',
                content_vi: `Thay vì nhìn vào từng cặp biến đơn lẻ, ncsStat trình bày ma trận tương quan tổng thể. Điều này giúp bạn:
- **Nhận diện các mối liên kết tiềm năng**: Tìm thấy những quan hệ "bất ngờ" có thể dẫn đến các phát hiện mới.
- **Phát hiện sớm Đa cộng tuyến**: Nếu hai biến độc lập có $r > 0.8$, chúng có thể đang đo lường cùng một thứ, gây rủi ro cho mô hình hồi quy sau này.
Ma trận của chúng tôi được tối ưu hóa hiển thị với các ký hiệu ý nghĩa (*) chuẩn quốc tế.`,
                content_en: `ncsStat presents a holistic correlation matrix instead of isolated pairs. This allows you to identify hidden links for new hypotheses and detect early signs of multicollinearity (r > .8), which can jeopardize regression models. Our matrices feature international standard significance markers (*).`
            },
            {
                h2_vi: '3. Kiểm định các Giả định khắt khe của Pearson',
                h2_en: '3. Testing the Rigorous Assumptions of Pearson',
                content_vi: `Để hệ số Pearson có giá trị pháp lý học thuật, dữ liệu cần đạt 3 điều kiện:
1. **Tính tuyến tính**: Mối liên hệ phải có dạng đường thẳng (kiểm tra qua Scatter Plot).
2. **Phân phối chuẩn**: Các biến nên có phân phối hình chuông.
3. **Không có Outliers**: Các điểm dữ liệu quá khác biệt có thể kéo hệ số r về phía nó, làm sai lệch kết quả.
ncsStat tích hợp sẵn các kiểm định giả định này, giúp bạn tự tin bảo vệ kết quả trước hội đồng.`,
                content_en: `For 'r' to be academically valid, data must be linear, normally distributed, and free of outliers. Extreme data points can skew the coefficient significantly. ncsStat integrates built-in assumption checks, ensuring your findings can withstand rigorous peer review.`
            },
            {
                h2_vi: '4. Diễn giải Độ lớn Hiệu ứng (r) và Ý nghĩa thực tiễn',
                h2_en: '4. Interpreting Effect Size (r) and Practical Significance',
                content_vi: `Đừng chỉ nhìn vào p-value. Một kết quả $p < 0.05$ nhưng $r = 0.1$ thì mối liên hệ đó rất mờ nhạt. ncsStat khuyến nghị khung diễn giải của Cohen (1988):
- **0.1 - 0.3**: Nhỏ/Yếu (Small/Weak).
- **0.3 - 0.5**: Trung bình (Medium).
- **> 0.5**: Lớn/Mạnh (Large/Strong).
Việc báo cáo được độ lớn hiệu ứng cho thấy bạn là một nhà nghiên cứu có tư duy sâu sắc về tác động thực tế thay vì chỉ chạy theo các con số ảo.`,
                content_en: `Don't chase p-values alone; an 'r' of .1 is negligible even if significant. ncsStat follows Cohen’s (1988) thresholds: .1 (Small), .3 (Medium), and .5+ (Strong). Reporting effect size marks you as a sophisticated researcher focused on practical impact rather than just statistical noise.`
            },
            {
                h2_vi: '5. Hệ số xác định ($R^2$): Tỷ lệ biến thiên giải thích',
                h2_en: '5. Coefficient of Determination ($R^2$): Explained Variance',
                content_vi: `Đây là bước tiến quan trọng từ tương quan sang dự báo. Bằng cách bình phương hệ số r, bạn biết được biến này giải thích được bao nhiêu phần trăm sự thay đổi của biến kia. 
Ví dụ: $r = 0.7 \Rightarrow R^2 = 0.49$. Nghĩa là 49% sự biến thiên của biến phụ thuộc đã được "nắm giữ" bởi biến độc lập. ncsStat tự động tính toán tỷ lệ này, giúp báo cáo của bạn đầy đủ và thuyết phục hơn bao giờ hết.`,
                content_en: `R-squared ($r^2$) is the bridge from association to prediction. Squaring 'r' tells you what percentage of variance is shared. For instance, r = .7 means 49% of the variation is overlaps. ncsStat automates this calculation, adding a layer of depth and conviction to your reporting.`
            },
            {
                h2_vi: '6. Trình bày Scatter Plot chuẩn tạp chí Q1/High-Impact',
                h2_en: '6. High-Impact Scatter Plots for Top-Tier Journals',
                content_vi: `Một biểu đồ Scatter Plot chuyên nghiệp không chỉ có các chấm dữ liệu mà còn cần đường hồi quy và dải tin cậy (Confidence Band). 
ncsStat xuất bản các biểu đồ cao cấp, giúp bạn thấy ngay xu hướng tập trung của dữ liệu. Biểu đồ này là bằng chứng thép để chứng minh tính tuyến tính và làm cho bài báo báo khoa học của bạn trở nên trực quan, sinh động thoát khỏi sự khô khan của bảng biểu.`,
                content_en: `Top-tier journals demand professional visuals. ncsStat generates scatter plots complete with regression lines and confidence bands. These graphs are "ironclad evidence" for linearity, making your paper visually engaging and academically superior to text-heavy reports.`
            },
            {
                h2_vi: '7. Xử lý khi vi phạm giả định: Spearman và Kendall',
                h2_en: '7. Handling Violations: When to use Spearman and Kendall',
                content_vi: `Nếu dữ liệu không phân phối chuẩn hoặc có quá nhiều Outliers không thể xóa bỏ, đừng lo lắng. ncsStat hỗ trợ các phương pháp phi tham số:
- **Spearman\'s Rho**: Dựa trên thứ hạng, cực kỳ bền vững với các giá trị ngoại lai.
- **Kendall\'s Tau**: Thích hợp cho tập mẫu nhỏ hoặc khi có nhiều giá trị bằng nhau.
Biết khi nào nên chuyển đổi phương pháp là dấu hiệu của một chuyên gia nghiên cứu thực thụ.`,
                content_en: `When normality fails or outliers persist, ncsStat offers non-parametric pivots: Spearman’s Rho for rank-based robustness and Kendall’s Tau for small samples with ties. Knowing when to switch methods is the hallmark of a true statistical expert.`
            },
            {
                h2_vi: '8. Quy chuẩn báo cáo Tương quan chuẩn APA 7',
                h2_en: '8. Mastering APA 7 Standards for Correlation Reporting',
                content_vi: `Báo cáo chuẩn cần kèm theo Giá trị Trung bình (M) và Độ lệch chuẩn (SD). 
Văn bản mẫu: "Kết quả cho thấy một mối tương quan thuận mạnh mẽ và có ý nghĩa thống kê giữa sự hài lòng và lòng trung thành, r(298) = .72, p < .001." 
ncsStat cung cấp các mẫu nhận định tự động đúng font, đúng định dạng nghiêng của chuẩn APA 7, giúp bạn hoàn thiện chương 4 của luận văn chỉ trong vài giây.`,
                content_en: `Standard reports must include M and SD. Phrasing: "A strong positive correlation was found between satisfaction and loyalty, r(298) = .72, p < .001." ncsStat provides these auto-narratives, formatted perfectly with italics and spacing for immediate inclusion in your results chapter.`
            },
            {
                h2_vi: '9. Bí mật đăng bài: Tương quan không phải là Nhân quả',
                h2_en: '9. Journal Secret: Correlation is Not Causation',
                content_vi: `Câu nói kinh điển này là bẫy của mọi phản biện. Dù r = 0.9, bạn cũng không được dùng từ "tác động" ở chương này. Hãy dùng từ "liên hệ", "đồng biến". Việc dùng đúng thuật ngữ ở bước tương quan giúp bạn tránh được những gậy phê bình về mặt logic từ các tạp chí hạng A. ncsStat bôi đậm các lưu ý về thuật ngữ này để bạn luôn đi đúng hướng.`,
                content_en: `The classic "Correlation is not Causation" is a reviewer favorite. Even with r = 0.9, avoid using "impact" or "influence" in this section. Stick to "association" or "positive link." Using correct terminology here protects your logical framework from being torn apart by top-tier reviewers.`
            }
        ]
    },
    'chi-square-test-independence': {
        slug: 'chi-square-test-independence', category: 'General Statistics',
        title_vi: 'Kiểm định Chi-Square (Chi bình phương): Mối quan hệ giữa các biến định danh',
        title_en: 'Chi-Square Test of Independence: Analyzing Nominal Data',
        expert_tip_vi: 'Nếu có hơn 20% số ô có tần số mong đợi (Expected Count) < 5, kết quả Chi-square có thể không đáng tin. Khi đó hãy dùng Fisher’s Exact Test.', 
        expert_tip_en: "If >20% of cells have an expected count < 5, Chi-square may be invalid. Use Fisher's Exact Test instead.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Expected count > 5 in 80% of cells, Sig. < 0.05',
        content_structure: [{
            h2_vi: '1. Khi nào thì dùng Chi-Square thay vì T-test hay ANOVA?', 
            h2_en: '1. Choosing Chi-Square Over Mean comparison Tests',
            content_vi: `Bạn sử dụng phép thử Chi-Square khi cả hai biến nghiên cứu đều là biến định danh (Categorical/Nominal). Ví dụ: "Có mối liên hệ nào giữa Giới tính (Nam/Nữ) và Sở thích âm nhạc (Pop/Rock/Jazz) hay không?". 

Vì đây là dữ liệu đếm tần số, không thể tính được Giá trị trung bình (Mean), do đó các phép thử thông thường như T-test là không thể áp dụng. ncsStat giúp bạn xử lý các bảng chéo (Crosstab) phức tạp một cách chuẩn mực nhất.`,
            content_en: `Use Chi-Square when both variables are categorical. Since you can't calculate means for "Gender" or "Preference," traditional T-tests are invalid. ncsStat specializes in these frequency-based associations.`
        }, {
            h2_vi: '2. Tần số Quan sát (Observed) và Tần số Mong đợi (Expected)', 
            h2_en: '2. Observed vs. Expected Frequency Concepts',
            content_vi: `Chi-Square đo lường mức độ chênh lệch giữa những gì chúng ta thực sự đếm được (Observed) và những gì chúng ta kỳ vọng sẽ thấy (Expected) nếu hai biến hoàn toàn độc lập với nhau. 

Nếu sai lệch này đủ lớn, chúng ta kết luận hai biến có liên quan. ncsStat trình bày chi tiết cả hai loại tần số này để bạn thấy được bức tranh toàn cảnh về sự phân bổ của dữ liệu.`,
            content_en: `Chi-Square evaluates if the gap between what you saw and what you expected is significant. If the gap is large, the variables are dependent. ncsStat displays both counts to help you see where the data deviates from independence.`
        }, {
            h2_vi: '3. Giả định về kích thước ô (Cell Count) và tính hợp lệ', 
            h2_en: '3. Cell Count Assumptions and Statistical Validity',
            content_vi: `Một điểm yếu của Chi-Square là nó rất nhạy cảm với các ô có tần số quá nhỏ. Quy chuẩn học thuật yêu cầu: ít nhất 80% số ô trong bảng chéo phải có Tần số mong đợi > 5. 

Nếu dữ liệu của bạn không đạt ngưỡng này, kết quả Chi-square có thể bị sai lệch (lạm phát ý nghĩa). ncsStat sẽ tự động kiểm tra và hiển thị cảnh báo ngay lập tức nếu dữ liệu của bạn vi phạm giả định này.`,
            content_en: `Chi-Square is invalid if too many cells have expected counts below 5. Academic rigor requires 80% of cells to stay above this threshold. ncsStat flags these violations to protect your report from technical criticism.`
        }, {
            h2_vi: '4. Kiểm định Fisher\'s Exact: Cứu cánh cho mẫu nhỏ', 
            h2_en: '4. Fisher’s Exact Test: A Savior for Small Specimen Sizes',
            content_vi: `Khi bạn có một bảng chéo 2x2 mà các ô có tần số quá thấp (vi phạm giả định Chi-square), ncsStat cung cấp phép thử **Fisher\'s Exact Test**. 

Đây là phương pháp tính toán xác suất chính xác, không dựa trên các xấp xỉ phân phối, giúp bạn vẫn đưa ra được kết luận khoa học đáng tin cậy ngay cả khi kích thước mẫu cực kỳ hạn chế.`,
            content_en: `For 2x2 tables with small samples, Fisher's Exact Test provides precise p-values where Chi-Square fails. ncsStat calculates this automatically to ensure your small-scale studies stay publishable.`
        }, {
            h2_vi: '5. Hệ số Phi và Cramer\'s V: Đo lường độ mạnh liên kết', 
            h2_en: '5. Measuring Association Strength with Phi and Cramer’s V',
            content_vi: `P-value < 0.05 chỉ nói rằng "có liên quan", nhưng không nói được mức độ liên quan đó là chặt chẽ hay lỏng lẻo. Hệ số **Phi** (cho bảng 2x2) và **Cramer\'s V** (cho bảng lớn hơn) là giải pháp của ncsStat:
- **0.1**: Mối liên hệ yếu.
- **0.3**: Mối liên hệ trung bình.
- **0.5**: Mối liên hệ mạnh.

Báo cáo Cramer\'s V là cách chuyên nghiệp nhất để thể hiện tầm quan trọng thực tế của phát hiện nghiên cứu trong các biến định danh.`,
            content_en: `P-values determine significance; Phi and Cramer’s V determine strength. Measuring association is key to understanding the real-world impact of your survey categories. ncsStat provides these metrics in every Crosstab analysis.`
        }, {
            h2_vi: '6. Phân tích Tỷ lệ phần trăm và cấu trúc hàng/cột', 
            h2_en: '6. Percentage Analysis: Rows vs. Columns Structural Insight',
            content_vi: `ncsStat trình bày bảng chéo kèm theo các tỷ lệ phần trăm theo hàng (Row %) hoặc cột (Column %). Điều này vô cùng quan trọng để diễn giải. 
Ví dụ: "Trong số nam giới, 80% chọn sản phẩm A, trong khi tỷ lệ này ở nữ giới chỉ là 20%". Con số tỷ lệ này mới là thứ làm cho kết quả Chi-square trở nên sinh động và dễ hiểu đối với người đọc báo cáo.`,
            content_en: `Row and Column percentages provide the narrative for your Chi-Square results. ncsStat calculates these distributions to show clear contrasts between your groupings, making your report data-driven and easy to read.`
        }, {
            h2_vi: '7. Kiểm định Chi-Square cho tính tương đồng (Goodness-of-Fit)', 
            h2_en: '7. Chi-Square Goodness-of-Fit: Matching Theoretical Distributions',
            content_vi: `Ngoài việc kiểm định mối liên hệ, Chi-Square còn được dùng để xem tỷ lệ quan sát của bạn có khớp với một tỷ lệ lý thuyết nào đó không. Ví dụ: "Cơ cấu mẫu thu thập được có khớp với cơ cấu dân số thực tế hay không?". ncsStat hỗ trợ phép tính này để bạn khẳng định tính đại diện và chất lượng của tập mẫu mình đã thu thập.`,
            content_en: `Goodness-of-fit testing confirms if your sample distribution matches population benchmarks. This is vital for verifying sample representativeness. ncsStat provides the tools to justify your sampling methodology.`
        }, {
            h2_vi: '8. Trình bày Chi-Square chuyên nghiệp theo chuẩn APA 7', 
            h2_en: '8. Reporting Chi-Square in APA 7 (Standardized format)',
            content_vi: `Báo cáo Chi-Square cần có giá trị χ², bậc tự do (df) và p-value.
"Kết quả kiểm định Chi-square cho thấy có mối liên hệ có ý nghĩa giữa Giới tính và Quyết định mua hàng, χ²(2, N = 250) = 12.45, p = .002. Hệ số Cramer's V = .22 cho thấy mức độ liên kết trung bình."

Sử dụng ncsStat để tự động tạo ra những dòng nhận định này giúp bài viết của bạn đạt chuẩn mực học thuật quốc tế cao nhất.`,
            content_en: `Report using the χ² symbol, including degrees of freedom and total sample size. Example: χ²(2, N = 250) = 12.45, p = .002. ncsStat's outputs are pre-formatted for seamless academic integration.`
        }]
    },
    'mediation-analysis-sobel-test': {
        slug: 'mediation-analysis-sobel-test', category: 'Impact Analysis',
        title_vi: 'Phân tích Biến trung gian và Kiểm định Sobel: Cơ chế tác động gián tiếp',
        title_en: 'Mediation Analysis & Sobel Test: Understanding Indirect Effects',
        expert_tip_vi: 'Đừng chỉ dựa vào Sobel test vì nó yêu cầu phân phối chuẩn của tích (a*b). Hãy ưu tiên sử dụng Bootstrap Confidence Interval để có kết quả đáng tin cậy hơn.', 
        expert_tip_en: "Don't rely solely on the Sobel test as it assumes normality of the indirect effect product. Prioritize Bootstrap CIs for more robust results.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Sobel Z > 1.96 (Sig. < 0.05), Bootstrap CI does not contain zero',
        content_structure: [{
            h2_vi: '1. Biến trung gian (Mediator) là gì và Tại sao nó quan trọng?', 
            h2_en: '1. What is a Mediator and Why Does it Matter?',
            content_vi: `Trong nghiên cứu khoa học xã hội, mối quan hệ giữa biến X và biến Y thường không đơn giản là tác động trực tiếp. Biến trung gian (M) giải thích "tại sao" hoặc "bằng cách nào" X lại tác động đến Y. 

Ví dụ: "Chính sách phúc lợi (X)" tác động đến "Sự gắn kết (Y)" thông qua "Sự hài lòng công việc (M)". Nếu không có M, chúng ta chỉ biết KẾT QUẢ mà không hiểu được CƠ CHẾ. ncsStat giúp bạn bóc tách các lớp tác động này một cách tinh tế và khoa học.`,
            content_en: `A mediator (M) explains the mechanism through which X influences Y. It answers the "how" and "why" behind an observed relationship. ncsStat provides advanced mediation modeling to unveil these hidden paths in your research framework.`
        }, {
            h2_vi: '2. Quy trình 4 bước của Baron & Kenny (1986) kinh điển', 
            h2_en: '2. The Classic 4-Step Approach by Baron & Kenny',
            content_vi: `Đây là quy trình đặt nền móng cho phân tích trung gian:
Step 1: X tác động có ý nghĩa lên Y (Tổng tác động).
Step 2: X tác động có ý nghĩa lên M (Path a).
Step 3: M tác động có ý nghĩa lên Y (Path b).
Step 4: Khi đưa cả X và M vào, tác động của X lên Y (Path c') giảm xuống hoặc biến mất.

ncsStat tự động kiểm tra đồng thời cả 4 bước này, giúp bạn nhanh chóng xác định xem mô hình của mình có tiềm năng trung gian hay không.`,
            content_en: `The Baron & Kenny steps require significant paths from X to Y, X to M, and M to Y. Finally, the direct effect of X on Y must decrease when M is present. ncsStat automates this sequential testing for immediate feedback.`
        }, {
            h2_vi: '3. Kiểm định Sobel: Trắc nghiệm ý nghĩa của tác động gián tiếp', 
            h2_en: '3. The Sobel Test: Testing Indirect Effect Significance',
            content_vi: `Kiểm định Sobel xác định xem việc giảm tác động từ c xuống c' có thực sự có ý nghĩa thống kê hay không. Chỉ số Sobel Z > 1.96 tương đương với mức ý nghĩa p < 0.05. 

Mặc dù mạnh mẽ, nhưng Sobel test có nhược điểm là giả định tích (a*b) có phân phối chuẩn - một điều hiếm khi xảy ra. ncsStat cung cấp Sobel test như một chỉ số tham chiếu nhanh cho báo cáo của bạn.`,
            content_en: `Sobel’s Z-test determines if the drop from the total effect to the direct effect is statistically significant. ncsStat calculates Sobel figures instantly to provide a quick academic check for your mediation hypotheses.`
        }, {
            h2_vi: '4. Trung gian Toàn phần (Full) vs. Trung gian Một phần (Partial)', 
            h2_en: '4. Full vs. Partial Mediation: Interpreting the Nuance',
            content_vi: `Sự khác biệt này nằm ở Path c' (Tác động trực tiếp):
- **Full Mediation**: X không còn tác động lên Y khi có M. Toàn bộ sức mạnh của X đã chuyển hóa qua M.
- **Partial Mediation**: X vẫn còn tác động lên Y nhưng yếu đi. Nghĩa là ngoài M, còn có những con đường khác chưa được khám phá.

ncsStat giúp bạn diễn giải chính xác loại hình trung gian, từ đó đề xuất các hướng nghiên cứu tiếp theo một cách chuyên nghiệp.`,
            content_en: `Full mediation means M completely explains the relationship between X and Y. Partial mediation implies that M is only part of the story. ncsStat’s detailed path coefficients make it easy to distinguish between these two states.`
        }, {
            h2_vi: '5. Sức mạnh của Bootstrapping: Tiêu chuẩn vàng hiện đại', 
            h2_en: '5. Bootstrapping: The Modern Gold Standard for Mediation',
            content_vi: `Thay vì dựa vào các giả định phân phối khắt khe, Bootstrapping lấy mẫu lặp lại hàng ngàn lần để ước lượng Khoảng tin cậy (CI) cho tác động gián tiếp. 
- **Quy tắc**: Nếu khoảng [Lower, Upper] của 95% CI KHÔNG chứa số 0, tác động trung gian có ý nghĩa. 

Tại ncsStat, chúng tôi tích hợp sẵn tính năng Bootstrap 5000 mẫu, đảm bảo bài nghiên cứu của bạn đạt tiêu chuẩn cao nhất của các tạp chí quốc tế.`,
            content_en: `Bootstrapping uses repeated sampling to build a non-parametric confidence interval for the indirect effect. If the CI avoids zero, your mediation is significant. ncsStat supports up to 5000 bootstrap iterations for maximum precision.`
        }, {
            h2_vi: '6. Tác động gián tiếp (Indirect Effect) và Hiệu ứng tổng hợp', 
            h2_en: '6. Calculating Indirect and Total Effects',
            content_vi: `Tác động tổng hợp (Total Effect) = Tác động trực tiếp (Direct Effect) + Tác động gián tiếp (Indirect Effect). 
ncsStat bóc tách các con số này và trình bày dưới dạng ma trận hoặc sơ đồ, giúp bạn thấy được dòng chảy của dữ liệu từ nguyên nhân đến kết quả cuối cùng một cách mạch lạc.`,
            content_en: `Total effect is the sum of direct and indirect paths. ncsStat breaks down these components into easy-to-read tables, allowing you to explain the "total impact" of your independent variables.`
        }, {
            h2_vi: '7. Trực quan hóa mô hình trung gian qua Diagram', 
            h2_en: '7. Visualizing Mediation via Path Diagrams',
            content_vi: `Một sơ đồ có các mũi tên kèm theo hệ số Beta (Standardized Coefficients) là cách tốt nhất để trình bày mô hình trung gian. ncsStat xuất bản các sơ đồ đường dẫn (Path Diagrams) chuẩn mực, tự động vẽ các mối quan hệ a, b, c và c', giúp bài báo cáo của bạn sinh động và dễ hiểu vượt trội.`,
            content_en: `A clean path diagram with standardized betas is worth a thousand words. ncsStat generates detailed visual models that show the strength of every link in your mediation chain for a professional dissertation look.`
        }, {
            h2_vi: '8. Trình bày kết quả Trung gian theo chuẩn APA 7', 
            h2_en: '8. Reporting Mediation Results in APA 7 Format',
            content_vi: `Báo cáo cần trình bày đầy đủ các hệ số path và kết quả Bootstrap. 
"Kết quả phân tích cho thấy 'Sự hài lòng' đóng vai trò trung gian một phần (Indirect effect = .15, 95% CI [.08, .24]). Vì khoảng tin cậy không chứa giá trị 0, giả thuyết H1 về vai trò trung gian được ủng hộ."

 ncsStat cung cấp các văn bản mẫu để bạn chèn trực tiếp vào báo cáo, đảm bảo chuẩn mực khoa học tuyệt đối.`,
            content_en: `Report coefficients, p-values, and Bootstrap CIs. Example: "The indirect effect of X on Y through M was significant (b = .15, 95% CI [.08, .24])." Use ncsStat's auto-generated text to meet professional publishing criteria.`
        }]
    },
    'data-cleaning-outliers-detection': {
        slug: 'data-cleaning-outliers-detection', category: 'Data Management',
        title_vi: 'Làm sạch dữ liệu và Xử lý Outliers: Bước chuẩn bị sống còn',
        title_en: 'Data Cleaning & Outlier Detection: The Critical First Step',
        expert_tip_vi: 'Đừng xóa Outliers một cách mù quáng. Đôi khi chúng phản ánh một nhóm đối tượng đặc biệt mà bạn nên nghiên cứu riêng thay vì loại bỏ.', 
        expert_tip_en: "Don't delete outliers blindly. Sometimes they represent a unique subgroup that deserves its own focused analysis.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Z-score > 3.0, Mahalanobis p < .001',
        content_structure: [{
            h2_vi: '1. Tầm quan trọng của việc "Làm sạch" dữ liệu', 
            h2_en: '1. Why Data Cleaning is Mandatory',
            content_vi: `Dữ liệu thô thu thập từ khảo sát thường chứa đầy "rác": câu trả lời cẩu thả, lỗi nhập liệu, hoặc các giá trị ngoại lai. Nếu không làm sạch, mọi phép tính thống kê sau đó đều sẽ bị sai lệch. Tại ncsStat, chúng tôi coi đây là bước "lọc máu" cho dữ liệu nghiên cứu, đảm bảo đầu vào tinh khiết để có đầu ra chính xác.`,
            content_en: `Raw survey data is often messy. Processing uncleaned data leads to invalid conclusions. ncsStat provides a systematic cleaning suite to filter out noise and ensure your dataset is ready for high-precision modeling.`
        }, {
            h2_vi: '2. Phát hiện Outliers đơn biến qua Z-score', 
            h2_en: '2. Univariate Outliers: Detection via Z-scores',
            content_vi: `Outliers đơn biến là những giá trị cực đoan trên một biến duy nhất. ncsStat sử dụng Z-score chuẩn hóa để phát hiện chúng. 
- **Z > 3 hoặc Z < -3**: Được coi là giá trị ngoại lai tiềm năng. 

Công cụ của chúng tôi liệt kê danh sách các quan sát nghi vấn để bạn kiểm tra lại xem đó là lỗi nhập liệu hay là một phản hồi thực tế đặc biệt.`,
            content_en: `Univariate outliers are extreme values on a single variable. ncsStat uses standardized Z-scores (threshold |Z| > 3) to identify these cases for your review and possible removal or adjustment.`
        }, {
            h2_vi: '3. Khoảng cách Mahalanobis: Outliers đa biến', 
            h2_en: '3. Mahalanobis Distance: Finding Multivariate Outliers',
            content_vi: `Có những quan sát nhìn từng biến thì bình thường, nhưng khi kết hợp lại thì lại vô lý (ví dụ: tuổi 10 nhưng thu nhập 1 tỷ). Đó là Outliers đa biến. ncsStat sử dụng khoảng cách Mahalanobis kết hợp với phân phối Chi-square để tìm ra những "kẻ lạc loài" này trong không gian đa chiều, bảo vệ mô hình hồi quy của bạn khỏi những nhiễu loạn ẩn giấu.`,
            content_en: `Multivariate outliers are invisible when looking at variables individually but appear abnormal in combination. ncsStat uses Mahalanobis algorithms to spot these hidden disruptors in your multidimensional data space.`
        }, {
            h2_vi: '4. Kiểm tra Câu trả lời trùng lắp và cẩu thả', 
            h2_en: '4. Detecting Careless and Duplicate Responses',
            content_vi: `Một số người trả lời chỉ chọn toàn "5" hoặc "1" cho mọi câu hỏi để xong việc. ncsStat tích hợp thuật toán kiểm tra phương sai nội bộ của từng quan sát. Nếu phương sai bằng 0 (Straight-lining), chúng tôi sẽ cảnh báo bạn loại bỏ các phản hồi thiếu nghiêm túc này để bảo toàn độ tin cậy của thang đo.`,
            content_en: `Straight-lining (selecting the same answer for everything) ruins scale reliability. ncsStat checks the internal variance of every response to flag careless participants, ensuring your final data represents genuine opinions.`
        }, {
            h2_vi: '5. Xử lý Dữ liệu bị thiếu (Missing Data): Nên xóa hay nên bù?', 
            h2_en: '5. Managing Missing Data: Deletion vs. Imputation',
            content_vi: `Dữ liệu bị thiếu là cơn ác mộng của hồi quy. ncsStat cung cấp 2 giải pháp:
1. **Listwise Deletion**: Loại bỏ hoàn toàn quan sát có ô trống.
2. **Mean Imputation**: Điền giá trị trung bình vào ô trống.

Chúng tôi sẽ tư vấn giải pháp nào phù hợp nhất dựa trên tỷ lệ % dữ liệu bị thiếu trong mẫu của bạn.`,
            content_en: `Missing values can truncate your sample size or bias your results. ncsStat offers smart deletion and imputation options, helping you choose the most scientific way to fill the gaps without distorting the data.`
        }, {
            h2_vi: '6. Biến đổi dữ liệu (Data Transformation) để đạt tính chuẩn', 
            h2_en: '6. Data Transformation for Achieving Normality',
            content_vi: `Nếu dữ liệu bị lệch (skewed), bạn không nhất thiết phải xóa nó. ncsStat cung cấp các phép biến đổi Logarith, Căn bậc hai (Square Root) để nắn chỉnh phân phối về dạng chuẩn, giúp bạn vẫn có thể sử dụng các phép kiểm định tham số mạnh mẽ mà không làm mất đi quan sát quý giá.`,
            content_en: `When data is skewed, transformation is often better than deletion. ncsStat provides Log and Square Root transformation tools to normalize your distributions, preserving your sample size while meeting parametric assumptions.`
        }, {
            h2_vi: '7. Trực quan hóa dữ liệu sạch qua Boxplot', 
            h2_en: '7. Visualizing Clean Data with Boxplots',
            content_vi: `Biểu đồ hộp (Boxplot) là cách tốt nhất để khoanh vùng Outliers. ncsStat vẽ các Boxplot chuyên nghiệp, đánh dấu rõ số thứ tự (ID) của các quan sát ngoại lai, giúp bạn thực hiện thao tác làm sạch dữ liệu một cách trực quan và chính xác nhất.`,
            content_en: `Boxplots are the classic tool for identifying outliers. ncsStat marks specific case IDs in its high-resolution boxplots, making it easy for you to target and verify anomalies before finalizing your dataset.`
        },
        {
            h2_vi: '8. Mahalanobis Distance: Kỹ thuật phát hiện Outliers đa biến bài bản',
            h2_en: '8. Mahalanobis Distance: Multivariate Outlier Detection',
            content_vi: `Khi bạn có nhiều biến quan sát, việc chỉ nhìn vào từng biến lẻ (univariate) là chưa đủ. Khoảng cách Mahalanobis trong R giúp bạn xác định các quan sát "lạc loài" trong không gian đa chiều. ncsStat tự động tính toán giá trị này và so sánh với giá trị tới hạn Chi-square. Nếu p < 0.001, đó là bằng chứng thép để loại bỏ Outliers, giúp mô hình của bạn không bị sai lệch bởi những quan sát bất thường.`,
            content_en: `Univariate detection isn't enough for multi-item scales. Mahalanobis distance measures how far a case is from the multivariate centroid. ncsStat automates this calculation, comparing results against Chi-square critical values. A p < 0.001 flag provides a robust, academic justification for case removal, ensuring your structural paths aren't skewed by anomalies.`
        },
        {
            h2_vi: '9. Kiểm định Phân phối chuẩn: Đảm bảo nền tảng cho SEM',
            h2_en: '9. Normality Testing: The Foundation for SEM',
            content_vi: `Hầu hết các phép thử SEM (CB-SEM) đều yêu cầu dữ liệu có phân phối chuẩn đa biến. ncsStat cung cấp các chỉ số Skewness (Độ xiên) và Kurtosis (Độ nhọn) chi tiết. Quy chuẩn hiện đại yêu cầu Skewness < 3 và Kurtosis < 10. Nếu dữ liệu vi phạm nghiêm trọng, chúng tôi sẽ gợi ý bạn chuyển sang dùng PLS-SEM - một phương pháp linh hoạt hơn với dữ liệu không chuẩn.`,
            content_en: `CB-SEM requires multivariate normality. ncsStat reports Skewness and Kurtosis for every item. Academic standards typically accept Skewness < 3 and Kurtosis < 10. If your data fails these tests, ncsStat's decision engine will recommend switching to PLS-SEM, which is more robust to non-normal distributions.`
        }
        ]
    },
    'sem-cfa-structural-modeling': {
        slug: 'sem-cfa-structural-modeling', category: 'Factor Analysis',
        title_vi: 'Mô hình cấu trúc SEM và CFA: Đỉnh cao của Phân tích định lượng',
        title_en: 'SEM & CFA: The Pinnacle of Structural Equation Modeling',
        expert_tip_vi: 'Nếu chỉ số Model Fit không đạt, hãy nhìn vào Modification Indices (MI). Việc nối các sai số (residuals) có thể cải thiện Fit nhưng phải có cơ sở lý thuyết vững chắc.', 
        expert_tip_en: "If Model Fit is low, check the Modification Indices (MI). Covarying residuals can improve fit but must be theoretically justified.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'CFI/TLI > 0.90, RMSEA/SRMR < 0.08',
        content_structure: [
            {
                h2_vi: '1. Bản chất học thuật: Từ Hồi quy đến SEM và Mô hình S-O-R',
                h2_en: '1. Academic Essence: From Regression to SEM and S-O-R',
                content_vi: `Trong khi hồi quy truyền thống coi mọi phép đo là hoàn hảo, SEM (Structural Equation Modeling) thừa nhận sai số đo lường. 
                Đặc biệt, SEM là công cụ hoàn hảo để kiểm định mô hình **S-O-R (Stimulus-Organism-Response)**. Ví dụ: Marketing xanh (Stimulus) tác động đến Hoài nghi xanh/Niềm tin (Organism), từ đó dẫn đến Ý định mua (Response). ncsStat giúp bạn mô hình hóa chuỗi tâm lý phức tạp này, giúp bài nghiên cứu đạt tầm vóc của các báo cáo khoa học quốc tế.`,
                content_en: `Traditional regression ignores measurement error; SEM embraces it. SEM is the gold standard for testing the **S-O-R (Stimulus-Organism-Response)** framework. For instance, Green Marketing (S) triggers Green Skepticism (O), which influences Purchase Intention (R). ncsStat helps you map these psychological chains with high academic rigor.`
            },
            {
                h2_vi: '2. Giải mã Model Fit: Khi nào thì mô hình của bạn "khớp" với thực tế?',
                h2_en: '2. Decoding Model Fit: When Does Your Theory Match Reality?',
                content_vi: `Thách thức lớn nhất của SEM là bài toán Model Fit. ncsStat cung cấp bộ 3 chỉ số quyền lực nhất:
                - **CFI/TLI (> 0.90)**: Đo lường mức độ cải thiện của mô hình so với mô hình cơ sở.
                - **RMSEA (< 0.08)**: Sai số xấp xỉ trên mỗi bậc tự do. Đây là chỉ số khắt khe nhất được các tạp chí Q1 ưu tiên.
                - **SRMR (< 0.08)**: Độ lệch trung bình giữa hiệp phương sai quan sát và dự báo.
                Nếu các chỉ số này không đạt, mô hình của bạn dù có p-value < 0.05 cũng sẽ bị coi là thiếu giá trị khoa học. ncsStat tự động phân tích và đưa ra các gợi ý hiệu chỉnh thông minh cho bạn.`,
                content_en: `Model fit is the gatekeeper of SEM. ncsStat evaluates the "Power Trio": CFI/TLI (>0.90), RMSEA (<0.08), and SRMR (<0.08). Even with significant paths, a poor-fitting model is scientifically invalid. ncsStat provides automated feedback on these thresholds to ensure your dissertation meets international rigorous standards.`
            },
            {
                h2_vi: '3. Giá trị hội tụ (AVE) và Độ tin cậy tổng hợp (CR): Bước qua bóng tối của Alpha',
                h2_en: '3. Convergent Validity (AVE) and CR: Moving Beyond Alpha',
                content_vi: `Cronbach\'s Alpha đã quá cũ cho các nghiên cứu hiện đại. Reviewer quốc tế đòi hỏi **CR (Composite Reliability)** và **AVE (Average Variance Extracted)**.
                - **CR > 0.7**: Chứng minh các biến quan sát thực sự đo lường cùng một khái niệm.
                - **AVE > 0.5**: Chứng minh nhân tố mẹ giải thích được "phần lớn" biến thiên của các biến con.
                ncsStat tự động chiết xuất các hệ số tải (loadings) và thực hiện các phép tính tích phân hiệp phương sai để đưa ra bảng AVE/CR chuẩn mực, giúp bạn tiết kiệm hàng giờ loay hoay với Excel.`,
                content_en: `Modern reviewers demand CR (>0.7) and AVE (>0.5) instead of just Alpha. AVE confirms that your latent construct explains more than half of its indicators' variance. ncsStat automates these high-level calculations by extracting standardized loadings and computing covariance integrals, ensuring your validity report is bulletproof.`
            },
            {
                h2_vi: '4. Kiểm định Tính phân biệt qua tiêu chuẩn Fornell-Larcker và HTMT',
                h2_en: '4. Discriminant Validity: Fornell-Larcker and the HTMT Revolution',
                content_vi: `Các nhân tố của bạn có bị trùng lắp về mặt khái niệm không? SEM đòi hỏi bằng chứng về tính phân biệt:
                - **Fornell-Larcker**: Căn bậc hai của AVE phải lớn hơn tương quan giữa các nhân tố.
                - **HTMT (< 0.85)**: Tiêu chuẩn vàng mới nhất. Nếu HTMT quá cao, bạn đang đo lường cùng một thứ dưới hai cái tên khác nhau.
                ncsStat cung cấp cả hai bảng kiểm định này, giúp bài viết của bạn đạt độ sâu học thuật mà ít bài nghiên cứu trong nước có được.`,
                content_en: `Discriminant validity proves your constructs are unique. ncsStat performs the classic Fornell-Larcker comparison and the modern HTMT ratio check (<0.85). Our automated matrices identify conceptual overlaps, protecting your research from being dismissed due to redundant variables.`
            },
            {
                h2_vi: '5. Phân tích đường dẫn (Path Analysis) và Kiểm định giả thuyết',
                h2_en: '5. Path Analysis and Hypothesis Testing in SEM',
                content_vi: `Đây là trái tim của chương 4 luận văn. ncsStat trình bày các hệ số Beta chuẩn hóa (Standardized estimates) để bạn so sánh mức độ tác động giữa các biến có đơn vị đo khác nhau. 
                Đặc biệt, trong các mô hình SEM phức tạp, chúng tôi hỗ trợ tính toán **Tác động trực tiếp**, **Tác động gián tiếp (qua biến trung gian)** và **Tổng tác động**. Kết quả được trình bày kèm giá trị Critical Ratio (C.R) và P-value, giúp việc nhận định các giả thuyết H1, H2... trở nên rõ ràng và thuyết phục tuyệt đối.`,
                content_en: `Path analysis is the heart of your results chapter. ncsStat reports standardized estimates for direct, indirect, and total effects. By providing Critical Ratios (C.R) and exact P-values, we ensure that your hypothesis testing (H1, H2, etc.) is interpreted with absolute clarity and academic authority.`
            },
            {
                h2_vi: '6. Modification Indices (MI): Nghệ thuật nắn chỉnh mô hình khoa học',
                h2_en: '6. Modification Indices (MI): The Art of Scientific Model Tuning',
                content_vi: `Khi Model Fit của bạn "chết chìm" trong các chỉ số đỏ, bảng MI là phao cứu sinh. Nó gợi ý các mối liên kết tiềm năng giữa các sai số (residuals) để giảm trị số Chi-square. 
                Tuy nhiên, ncsStat luôn kèm theo cảnh báo: "Chỉ nối các sai số của cùng một nhân tố và phải có giải trình lý thuyết". Việc hiệu chỉnh MI một cách mù quáng sẽ phá hỏng bản chất khoa học của mô hình. Chúng tôi hướng dẫn bạn cách hiệu chỉnh sao cho đúng đạo đức nghiên cứu nhất.`,
                content_en: `When fit indices fail, Modification Indices (MI) provide a path forward by suggesting error covariances. ncsStat provides these suggestions with a strict warning: only apply links backed by theoretical logic. We guide you through ethical model tuning to achieve valid fit without sacrificing structural integrity.`
            },
            {
                h2_vi: '7. CFA Đa nhóm (Multigroup SEM) và Tính bất biến (Invariance)',
                h2_en: '7. Multigroup SEM and Measurement Invariance',
                content_vi: `Thang đo của bạn có dùng được cho cả người giàu và người nghèo, nam và nữ không? Đây là câu hỏi về tính bất biến (Invariance). 
                ncsStat hỗ trợ kiểm định qua 3 cấp độ: **Configural**, **Metric** và **Scalar**. Nếu mô hình vượt qua được các cấp độ này, bạn có thể tự tin so sánh giá trị trung bình giữa các nhóm một cách chính thống. Đây là kỹ thuật cao cấp thường thấy ở các luận án Tiến sĩ và bài báo Q1 mà ncsStat đơn giản hóa cho bạn.`,
                content_en: `Measurement invariance tests if your scale functions identically across sub-groups (e.g., gender or nationality). ncsStat supports Configural, Metric, and Scalar invariance testing—a must-have for PhD-level research and top-tier publications. We simplify this complex multi-stage process into actionable results.`
            },
            {
                h2_vi: '8. Trình bày sơ đồ SEM chuẩn Q1: Biến số liệu thành tác phẩm nghệ thuật',
                h2_en: '8. Professional Q1-Style SEM Diagrams: Data as Art',
                content_vi: `Đừng bao giờ gửi một tấm hình chụp màn hình mờ nhạt vào bài báo. ncsStat tích hợp công nghệ xuất bản Diagram tự động với định dạng Vector sắc nét. 
                Sơ đồ của bạn sẽ hiển thị đầy đủ các hệ số tải, sai số, và các mối liên kết với bố cục chuyên nghiệp. Một sơ đồ SEM đẹp không chỉ giúp Reviewer dễ hiểu mà còn thể hiện sự đầu tư nghiêm túc và đẳng cấp của nhà nghiên cứu.`,
                content_en: `Never submit low-res screenshots. ncsStat generates high-definition vector diagrams with professional layouts, showing factor loadings, error terms, and structural paths. A well-designed SEM diagram not only clarifies your findings for reviewers but also marks your work as high-caliber academic output.`
            },
            {
                h2_vi: '9. Bí mật đăng bài: Sự đánh đổi giữa CFI và RMSEA',
                h2_en: '9. Journal Secret: The CFI-RMSEA Trade-off',
                content_vi: `Đôi khi CFI của bạn đạt 0.95 (tuyệt vời) nhưng RMSEA lại là 0.09 (hơi cao). Đừng vội nản lòng. Bạn có thể giải trình rằng RMSEA thường bị thổi phồng khi bậc tự do (df) thấp hoặc mẫu nhỏ. Hãy trích dẫn Kenny et al. (2015) để bảo vệ rằng trong một số điều kiện, CFI là chỉ số đáng tin cậy hơn. ncsStat giúp bạn chọn lựa những tài liệu tham khảo uy tín nhất để bảo vệ mô hình của mình.`,
                content_en: `If your CFI is 0.95 but RMSEA is 0.09, you can still publish. RMSEA is often artificially high in small models with low degrees of freedom. Cite Kenny et al. (2015) to argue that CFI is a more stable indicator under these conditions. ncsStat provides the citations needed to bulletproof your model's defense.`
            }
        ]
    },
    'technology-acceptance-model-tam': {
        slug: 'technology-acceptance-model-tam', category: 'Research Models',
        title_vi: 'Mô hình Chấp nhận Công nghệ (TAM): Hỗ trợ Chuyên sâu từ A-Z',
        title_en: 'Technology Acceptance Model (TAM): The Ultimate Masterclass',
        expert_tip_vi: 'Đừng chỉ dừng lại ở mô hình gốc năm 1989. Để đạt chuẩn Scopus/ISI, hãy tích hợp TAM với Trust (Niềm tin) hoặc Perceived Risk (Rủi ro cảm nhận) để tăng tính mới cho bài báo.',
        expert_tip_en: 'For Scopus/ISI standards, integrate TAM with Trust or Perceived Risk to enhance the originality of your research.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'PU/PEOU Loadings > 0.70, AVE > 0.5, CR > 0.7',
        content_structure: [
            {
                h2_vi: '1. Nguồn gốc của TAM: Từ TRA đến cuộc cách mạng số',
                h2_en: '1. Origins of TAM: From TRA to the Digital Revolution',
                content_vi: `Được Fred Davis giới thiệu vào năm 1989, TAM (Technology Acceptance Model) được coi là mô hình phổ biến nhất và có ảnh hưởng nhất trong việc giải thích hành vi chấp nhận công nghệ của người dùng. 
                Dựa trên nền tảng của Thuyết Hành động Hợp lý (TRA), TAM tập trung vào hai yếu tố then chốt: Hữu ích cảm nhận (PU) và Dễ sử dụng cảm nhận (PEOU). Tại ncsStat, chúng tôi giúp bạn đặt nền móng lý thuyết vững chắc cho TAM bằng cách kết nối nó với bối cảnh thực tế của cuộc cách mạng công nghiệp 4.0.`,
                content_en: `Introduced by Fred Davis in 1989, TAM is the most influential model for explaining user technology adoption. Built on the Theory of Reasoned Action (TRA), it focuses on two pillars: Perceived Usefulness (PU) and Perceived Ease of Use (PEOU). ncsStat helps you establish a strong theoretical foundation for TAM within the context of the Industry 4.0 revolution.`
            },
            {
                h2_vi: '2. Hữu ích cảm nhận (PU): Động lực chính của sự chấp nhận',
                h2_en: '2. Perceived Usefulness (PU): The Primary Driver',
                content_vi: `Hữu ích cảm nhận là mức độ mà một cá nhân tin rằng việc sử dụng một hệ thống cụ thể sẽ nâng cao hiệu suất công việc của họ. 
                Trong các bài nghiên cứu chuẩn Q1, PU thường xuyên là biến có tác động mạnh nhất đến Ý định hành vi (BI). ncsStat cung cấp các công cụ phân tích để bạn chứng minh được "giá trị gia tăng" của công nghệ mà bạn đang nghiên cứu, từ AI, Blockchain đến các ứng dụng Fintech.`,
                content_en: `PU is the degree to which a person believes using a particular system would enhance their job performance. In Q1-tier research, PU is often the strongest predictor of Behavioral Intention (BI). ncsStat provide the analytical tools to demonstrate the "added value" of your focal technology, from AI to Fintech apps.`
            },
            {
                h2_vi: '3. Dễ sử dụng cảm nhận (PEOU): Rào cản hay Bàn đạp?',
                h2_en: '3. Perceived Ease of Use (PEOU): Barrier or Catalyst?',
                content_vi: `PEOU là mức độ mà một cá nhân tin rằng việc sử dụng hệ thống sẽ không tốn nhiều công sức. 
                Một phát hiện quan trọng trong lý thuyết TAM là PEOU thường tác động gián tiếp đến Ý định hành vi thông qua PU. Điều này có nghĩa là nếu một công nghệ dễ sử dụng, người ta sẽ thấy nó hữu ích hơn. ncsStat giúp bạn làm rõ mối quan hệ trung gian này, giúp bài viết đạt độ sâu học thuật vượt trội.`,
                content_en: `PEOU reflects the degree to which a person believes using a system would be effortless. A key theoretical finding is that PEOU often influences BI indirectly through PU. ncsStat helps you clarify this mediating relationship, providing the academic depth required for high-level publications.`
            },
            {
                h2_vi: '4. Biến ngoại lai (External Variables) và sự mở rộng của TAM',
                h2_en: '4. External Variables and the Evolution of TAM',
                content_vi: `Thách thức lớn nhất khi dùng TAM là chọn đúng các biến ngoại lai để đưa vào mô hình. Đó có thể là Đặc điểm cá nhân, Sự hỗ trợ của tổ chức, hoặc Ảnh hưởng xã hội. 
                Các chuyên gia tại ncsStat khuyên bạn nên xem xét mô hình mở rộng như TAM 2, TAM 3 hoặc UTAUT để giải thích được nhiều phương sai hơn. Việc chọn đúng biến ngoại lai chính là chìa khóa để bài nghiên cứu của bạn được các tạp chí lớn chấp nhận.`,
                content_en: `The biggest challenge in TAM-based research is selecting the right external variables, such as individual characteristics, organizational support, or social influence. ncsStat experts suggest considering extended models like TAM 2 or TAM 3 to explain more variance—a crucial step for acceptance into major journals.`
            },
            {
                h2_vi: '5. Phân tích TAM bằng SEM: Khi cơ chế trở nên phức tạp',
                h2_en: '5. Analyzing TAM with SEM: Capturing Complex Mechanisms',
                content_vi: `Đừng chỉ dùng hồi quy tuyến tính cho TAM. Mô hình này đòi hỏi Phân tích mô hình cấu trúc (SEM) để kiểm định đồng thời các mối quan hệ trực tiếp và gián tiếp. 
                ncsStat hỗ trợ bạn chạy các mô hình SEM phức tạp, từ việc đánh giá mô hình đo lường (Measurement Model) đến việc kiểm định ý nghĩa của các đường dẫn tác động (Path coefficients), đảm bảo tính chính xác tuyệt đối cho các kết luận nghiên cứu.`,
                content_en: `Avoid simple linear regression for TAM; Structural Equation Modeling (SEM) is required to test simultaneous direct and indirect effects. ncsStat supports complex SEM modeling, from measurement model evaluation to path coefficient significance testing, ensuring absolute accuracy for your findings.`
            },
            {
                h2_vi: '6. Vai trò của Tính mới (Originality) trong nghiên cứu TAM',
                h2_en: '6. The Role of Originality in TAM Research',
                content_vi: `Hàng ngàn bài báo đã dùng TAM. Vậy làm sao để bài của bạn khác biệt? 
                Bí quyết nằm ở việc đưa vào những biến điều tiết (Moderators) như Kinh nghiệm, Tuổi tác hoặc Văn hóa. ncsStat cung cấp kỹ thuật Phân tích đa nhóm (Multi-group Analysis) để bạn tìm ra những sự khác biệt tinh tế giữa các nhóm người dùng, tạo nên điểm nhấn học thuật (Research Gap) đắt giá cho bài báo.`,
                content_en: `Thousands of papers use TAM. To stand out, incorporate moderators like experience, age, or culture. ncsStat provides multi-group analysis techniques to uncover subtle differences between user segments, creating a high-value research gap for your paper.`
            },
            {
                h2_vi: '7. Trình bày kết quả TAM chuẩn học thuật quốc tế',
                h2_en: '7. Professional Reporting of TAM Results',
                content_vi: `Một báo cáo TAM chuẩn cần có: Bảng hệ số tải (Factor Loadings), Bảng Model Fit, và quan trọng nhất là Sơ đồ đường dẫn (Path Diagram). 
                ncsStat giúp bạn xuất bản các sơ đồ vector sắc nét, thể hiện rõ các hệ số tác động β và giá trị p. "Kết quả cho thấy PEOU tác động tích cực đến PU (β = .45, p < .001), khẳng định rằng sự thuận tiện là tiền đề quan trọng cho giá trị hữu ích." Những câu nhận định này sẽ làm tăng tính thuyết phục cho bài viết của bạn.`,
                content_en: `Professional TAM reporting requires factor loading tables, model fit indices, and vector path diagrams. ncsStat helps you export sharp visuals showing β weights and p-values. Clear interpretations like "PEOU positively influences PU (β=.45, p<.001)" enhance the persuasive power of your research.`
            },
            {
                h2_vi: '8. Tổng kết: Check-list cho bài nghiên cứu TAM hoàn hảo',
                h2_en: '8. Conclusion: The Perfect TAM Research Checklist',
                content_vi: `Để bài viết đạt đỉnh cao, hãy đảm bảo:
                1. PU và PEOU đã được hiệu chỉnh cho phù hợp với bối cảnh cụ thể.
                2. Đã đưa vào ít nhất 2 biến ngoại lai mới.
                3. Đã sử dụng SEM (PLS hoặc CB) để phân tích.
                4. Đã thảo luận sâu về ý nghĩa quản trị.
                ncsStat luôn đồng hành cùng bạn để biến những mô hình TAM khô khan thành những tác phẩm khoa học đầy cảm hứng.`,
                content_en: `For top-tier output, ensure: context-specific PU/PEOU scales, at least two original external variables, SEM-based analysis, and deep managerial implications. ncsStat transforms rigid TAM models into inspiring scientific narratives.`
            }
        ]
    },
    'theory-of-planned-behavior-tpb': {
        slug: 'theory-of-planned-behavior-tpb', category: 'Behavioral Research',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Giải mã Ý định và Hành động',
        title_en: 'Theory of Planned Behavior (TPB): Decoding Intentions and Actions',
        expert_tip_vi: 'PBC (Kiểm soát hành vi cảm nhận) là trái tim của TPB. Đừng coi nó chỉ là biến ảnh hưởng đến ý định; nó còn có thể tác động trực tiếp lên hành vi thực tế.',
        expert_tip_en: 'PBC is the heart of TPB. Do not treat it only as a predictor of intention; it can also directly influence actual behavior.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Factor Loadings > 0.70, AVE > 0.5, R-Square > 0.4',
        content_structure: [
            {
                h2_vi: '1. Bản chất của TPB: Từ Thái độ đến Hiện thực',
                h2_en: '1. The Essence of TPB: From Attitude to Reality',
                content_vi: `Thuyết Hành vi Dự định (TPB) của Icek Ajzen (1991) là mô hình nền tảng trong tâm lý học hành vi. 
                Nó giải thích rằng hành vi của con người không phải ngẫu nhiên mà được thúc đẩy bởi Ý định (Intention). Ý định lại được hình thành từ ba yếu tố: Thái độ, Chuẩn chủ quan và Kiểm soát hành vi cảm nhận. ncsStat cung cấp các công cụ trắc nghiệm để bạn đo lường chính xác các khái niệm trừu tượng này.`,
                content_en: `Ajzen's TPB (1991) is a cornerstone of behavioral psychology. It suggests that human behavior is driven by Intention, which in turn is shaped by Attitude, Subjective Norms, and Perceived Behavioral Control. ncsStat provides the psychometric tools to measure these abstract constructs with precision.`
            },
            {
                h2_vi: '2. Thái độ (Attitude): Lăng kính cá nhân',
                h2_en: '2. Attitude: The Individual Lens',
                content_vi: `Thái độ là sự đánh giá thuận lợi hay không thuận lợi đối với một hành vi cụ thể. 
                Trong TPB, thái độ không chỉ là cảm xúc mà còn là sự tin tưởng vào kết quả của hành vi đó. ncsStat giúp bạn phân tích các cấu trúc niềm tin (Belief structures) ẩn sau thái độ, giúp bạn hiểu sâu hơn tại sao người dùng lại chọn "Yêu" hoặc "Ghét" một sản phẩm/dịch vụ.`,
                content_en: `Attitude is the favorable or unfavorable evaluation of a behavior. In TPB, it involves both affect and cognitive beliefs about outcomes. ncsStat helps you analyze the underlying belief structures, providing deeper insight into why users embrace or reject a focal behavior.`
            },
            {
                h2_vi: '3. Chuẩn chủ quan (Subjective Norms): Áp lực từ xã hội',
                h2_en: '3. Subjective Norms: Social Pressure and Influence',
                content_vi: `Đó là nhận thức về các kỳ vọng xã hội từ những người quan trọng (gia đình, bạn bè, đồng nghiệp). 
                Trong thời đại mạng xã hội, Chuẩn chủ quan ngày càng trở nên phức tạp với sự xuất hiện của các Influencers và cộng đồng trực tuyến. ncsStat hỗ trợ bạn đo lường sức mạnh của những ảnh hưởng xã hội này, một yếu tố cực kỳ quan trọng trong các nghiên cứu về Marketing và Truyền thông.`,
                content_en: `Subjective norms reflect perceived social pressure from significant others. In the age of social media, this includes influencers and online communities. ncsStat supports the measurement of these social pressures—a vital element in modern marketing and communication research.`
            },
            {
                h2_vi: '4. Kiểm soát hành vi cảm nhận (PBC): Chìa khóa của sự khác biệt',
                h2_en: '4. Perceived Behavioral Control (PBC): The Key differentiator',
                content_vi: `PBC là niềm tin của một người vào khả năng kiểm soát và thực hiện hành vi của mình. 
                Đây là yếu tố phân biệt quan trọng giữa TRA và TPB. PBC giải thích tại sao có những người "muốn" (ý định cao) nhưng không "làm" (hành vi thấp) do thiếu nguồn lực hoặc kỹ năng. ncsStat giúp bạn phân tích rào cản này để đề xuất các giải pháp thực tiễn hiệu quả.`,
                content_en: `PBC is the belief in one's ability to perform a behavior. It is the defining difference between TRA and TPB, explaining why high intention doesn't always lead to action due to a lack of resources or skills. ncsStat helps you analyze these barriers to provide actionable practical solutions.`
            },
            {
                h2_vi: '5. Mối quan hệ giữa Ý định và Hành vi thực tế',
                h2_en: '5. The Intention-Behavior Gap',
                content_vi: `Thách thức lớn nhất trong các nghiên cứu dùng TPB là khoảng cách từ ý định đến hành vi thực tế. 
                ncsStat khuyên bạn nên thực hiện các nghiên cứu theo thời gian (Longitudinal studies) hoặc đưa vào các biến điều tiết như "Cơ hội" hay "Cam kết". Chúng tôi cung cấp các kỹ thuật phân tích tiên tiến để "thu hẹp" khoảng cách này, mang lại giá trị thực tiễn cao cho luận văn của bạn.`,
                content_en: `The intention-behavior gap is the primary challenge for researchers using TPB. ncsStat suggests using longitudinal designs or including moderators like "Opportunity" or "Commitment." We provide advanced analytics to bridge this gap, enhancing the practical value of your research.`
            },
            {
                h2_vi: '6. Mở rộng TPB: Khi chuẩn mực đạo đức lên tiếng',
                h2_en: '6. Extending TPB: Incorporating Moral Norms',
                content_vi: `Để bài viết đạt chuẩn Q1, các chuyên gia ncsStat thường gợi ý mở rộng TPB với các biến như: Chuẩn mực đạo đức, Sự hối tiếc dự kiến, hoặc Bản sắc cá nhân. 
                Đặc biệt trong các nghiên cứu về tiêu dùng bền vững hoặc y tế, việc mở rộng này là bắt buộc để bài báo có đủ tính mới học thuật. ncsStat hỗ trợ bạn kiểm định các biến bổ sung này một cách chuẩn xác.`,
                content_en: `To reach Q1-tier quality, ncsStat experts recommend extending TPB with variables like moral norms, anticipated regret, or self-identity. Especially in sustainability or healthcare research, these extensions are mandatory for originality. ncsStat supports the rigorous testing of these additional constructs.`
            },
            {
                h2_vi: '7. Phân tích tác động gián tiếp và trung gian trong TPB',
                h2_en: '7. Indirect and Mediating Effects in TPB',
                content_vi: `TPB bản chất là một mô hình mạng lưới. Thái độ, Chuẩn chủ quan và PBC đều tác động gián tiếp đến Hành vi thông qua Ý định. 
                Sử dụng các kỹ thuật như Sobel test hoặc Bootstrapping tại ncsStat, bạn có thể chứng minh được ý nghĩa của các tác động gián tiếp này, giúp củng cố lập luận khoa học một cách vững chắc nhất.`,
                content_en: `TPB is inherently a network model where Intention mediates between its predictors and behavior. Utilizing Sobel tests or Bootstrapping via ncsStat, you can prove the significance of these indirect effects, solidifying your scientific arguments.`
            },
            {
                h2_vi: '8. Trình bày kết quả TPB chuyên nghiệp chuẩn APA',
                h2_en: '8. Professional APA Reporting of TPB Results',
                content_vi: `Một báo cáo TPB hoàn chỉnh phải trình bày được: Hệ số tương quan giữa các biến, Kết quả hồi quy/SEM và Sơ đồ mô hình. 
                ncsStat tự động hóa việc tạo các bảng biểu này. "Kết quả cho thấy Ý định hành vi giải thích được 45% biến thiên của Hành vi thực tế (R² = .45), với PBC đóng vai trò quan trọng nhất (β = .52, p < .001)." Đây là cách viết giúp bạn chinh phục mọi hội đồng chấm luận văn.`,
                content_en: `Complete TPB reports should feature correlation matrices, regression/SEM results, and path diagrams. ncsStat automates these: "Behavioral Intention explained 45% of variance in actual behavior (R²=.45), with PBC being the strongest predictor (β=.52, p<.001)."—The perfect phrasing for academic success.`
            }
        ]
    },
    'signaling-theory-research': {
        slug: 'signaling-theory-research', category: 'Market Strategy',
        title_vi: 'Lý thuyết Tín hiệu (Signaling Theory): Chìa khóa giải mã Thông tin bất đối xứng',
        title_en: 'Signaling Theory: Solving Asymmetric Information Challenges',
        expert_tip_vi: 'Tín hiệu chỉ có giá trị khi nó "tốn kém" để thực hiện (Costly Signaling). Một tín hiệu dễ dàng bị sao chép bởi đối thủ yếu sẽ không còn giá trị phân loại trên thị trường.',
        expert_tip_en: 'A signal is only effective if it is "costly" to implement. Signals that can be easily mimicked by low-quality players lose their market discriminatory value.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Signal Honesty, Signal Observability, Receiver Perception',
        content_structure: [
            {
                h2_vi: '1. Bản chất của Lý thuyết Tín hiệu: Từ Sinh học đến Kinh tế',
                h2_en: '1. Essence of Signaling Theory: From Biology to Economics',
                content_vi: `Khởi đầu từ nghiên cứu về hành vi động vật của Zahavi và được Michael Spence đưa vào kinh tế học (đạt giải Nobel), Lý thuyết Tín hiệu giải thích cách các bên truyền tải thông tin về chất lượng thực sự của mình khi đối phương không thể quan sát trực tiếp. 
                ncsStat giúp bạn áp dụng lý thuyết này vào các bối cảnh hiện đại như Tuyển dụng, Thương mại điện tử và Quản trị thương hiệu, nơi thông tin bất đối xứng luôn hiện hữu.`,
                content_en: `Originating from biology and later revolutionized by Michael Spence (Nobel Prize), Signaling Theory explains how parties transmit quality information under asymmetric conditions. ncsStat helps you apply this theory to modern contexts like recruitment, e-commerce, and brand management, where hidden information is prevalent.`
            },
            {
                h2_vi: '2. Thông tin bất đối xứng (Information Asymmetry): Nguồn gốc của vấn đề',
                h2_en: '2. Information Asymmetry: The Root Cause',
                content_vi: `Thông tin bất đối xứng xảy ra khi một bên (Người phát tín hiệu) có thông tin tốt hơn về chất lượng sản phẩm/dịch vụ so với bên kia (Người nhận tín hiệu). 
                Điều này dẫn đến rủi ro đạo đức và lựa chọn ngược. ncsStat cung cấp các mô hình phân tích để đo lường mức độ "khoảng cách thông tin" này, giúp bài nghiên cứu của bạn có chiều sâu tư duy chiến lược cực cao.`,
                content_en: `Information asymmetry occurs when one party (Signaler) possesses better information than the other (Receiver). This leads to moral hazard and adverse selection. ncsStat provides analytical frameworks to measure this "information gap," elevating the strategic depth of your research.`
            },
            {
                h2_vi: '3. Đặc điểm của một Tín hiệu hiệu quả: Chi phí và Sự quan sát',
                h2_en: '3. Characteristics of Effective Signals: Cost and Observability',
                content_vi: `Để một tín hiệu có giá trị, nó phải thỏa mãn hai điều kiện: 
                1. **Tính tốn kém (Costly)**: Chi phí phát tín hiệu phải cao đối với người có chất lượng thấp nhưng thấp đối với người có chất lượng cao.
                2. **Tính quan sát được (Observable)**: Người nhận phải thấy và hiểu được tín hiệu đó. 
                ncsStat giúp bạn thiết kế và kiểm định các loại tín hiệu như Bằng cấp, Chứng chỉ ISO, hay Giải thưởng thương hiệu trong bài nghiên cứu của mình.`,
                content_en: `An effective signal must be: 1. Costly (higher burden for low-quality signalers) and 2. Observable (receivable and understandable). ncsStat helps you design and test signals such as educational degrees, ISO certifications, or brand awards in your analytical framework.`
            },
            {
                h2_vi: '4. Người phát (Signaler) và Chiến lược gửi tín hiệu',
                h2_en: '4. The Signaler and Strategic Transmission',
                content_vi: `Người phát tín hiệu thường là các thực thể (Cá nhân, Công ty) sở hữu thông tin nội bộ mà người ngoài không biết. 
                Lựa chọn đúng tín hiệu để gửi đi là một quyết định chiến lược. ncsStat hỗ trợ bạn phân tích hiệu quả của việc gửi các "Tín hiệu mềm" (Lời hứa) so với "Tín hiệu cứng" (Cam kết tài chính) để tối ưu hóa niềm tin của khách hàng.`,
                content_en: `Signalers are entities (individuals/firms) possessing private information. Choosing the right signal is a strategic decision. ncsStat assists you in analyzing the effectiveness of "soft signals" (promises) versus "hard signals" (financial commitments) to optimize customer trust.`
            },
            {
                h2_vi: '5. Người nhận (Receiver) và Cơ chế giải mã',
                h2_en: '5. The Receiver and Decoding Mechanisms',
                content_vi: `Người nhận tín hiệu phải đối mặt với thách thức: Liệu tín hiệu này là thật hay giả? 
                Quá trình giải mã phụ thuộc vào danh tiếng của người phát và kinh nghiệm của người nhận. ncsStat cung cấp các mô hình đo lường "Độ tin cậy của tín hiệu" (Signal Credibility) từ góc nhìn của khách hàng, giúp bạn làm rõ yếu tố then chốt dẫn đến quyết định mua hàng.`,
                content_en: `Receivers face a dilemma: Is the signal honest or deceptive? Decoding depends on the signaler's reputation and the receiver's experience. ncsStat calculates "Signal Credibility" from the consumer's perspective, highlighting the pivotal factor in decision-making processes.`
            },
            {
                h2_vi: '6. Tín hiệu trong bối cảnh Kỹ thuật số: Review và Ranking',
                h2_en: '6. Signaling in the Digital Era: Reviews and Rankings',
                content_vi: `Trong thế giới Online, các tín hiệu truyền thống bị thay thế hoặc bổ sung bởi Đánh giá từ người dùng (Online Reviews), Số lượng người theo dõi, và Thứ hạng tìm kiếm. 
                ncsStat giúp bạn phân tích các thuật toán tín hiệu số này, một chủ đề đang cực kỳ "hot" trong các bài báo Scopus về Thương mại điện tử và Marketing hiện đại.`,
                content_en: `In the online world, traditional signals are augmented by online reviews, follower counts, and search rankings. ncsStat helps you analyze these digital signaling algorithms—a high-interest topic in contemporary Scopus articles on e-commerce and marketing.`
            },
            {
                h2_vi: '7. Kiểm định tác động của Tín hiệu đến Niềm tin và Ý định',
                h2_en: '7. Testing Signal Impact on Trust and Intention',
                content_vi: `Mục tiêu cuối cùng của tín hiệu là xây dựng Niềm tin. 
                Sử dụng các mô hình trung gian tại ncsStat, bạn có thể chứng minh: Tín hiệu -> Niềm tin -> Ý định mua hàng. Việc chỉ ra Niềm tin là biến trung gian sẽ làm cho mô hình nghiên cứu của bạn trở nên logic và thuyết phục tuyệt đối trước các phản biện khắt khe.`,
                content_en: `The ultimate goal of signaling is building trust. Using ncsStat's mediation models, you can prove the logic: Signal -> Trust -> Purchase Intention. Identifying Trust as the mediator makes your research model logically bulletproof for rigorous peer review.`
            },
            {
                h2_vi: '8. Trình bày Lý thuyết Tín hiệu trong báo cáo khoa học',
                h2_en: '8. Reporting Signaling Theory in Scientific Papers',
                content_vi: `Khi viết chương 2 (Cơ sở lý thuyết) và chương 4 (Kết quả), bạn hãy nhấn mạnh vào "Tính trung thực của tín hiệu" (Signal Honesty). 
                ncsStat hỗ trợ bạn tạo các bảng so sánh hiệu quả giữa các loại tín hiệu khác nhau. "Nghiên cứu khẳng định rằng Chứng chỉ chất lượng là tín hiệu mạnh hơn so với Quảng cáo đơn thuần (p < .05), nhờ vào chi phí thực hiện cao hơn." Đây là những kết luận mang tầm vóc chuyên gia.`,
                content_en: `In your literature review and results sections, emphasize "Signal Honesty." ncsStat helps you build comparison tables of signal effectiveness: "The research confirms that Quality Certifications act as a stronger signal than mere advertising (p<.05) due to higher implementation costs"—Expert-level conclusions.`
            }
        ]
    },
    'common-method-bias-survey-research': {
        slug: 'common-method-bias-survey-research', category: 'Advanced Research',
        title_vi: 'Common Method Bias (CMB): Hiểm họa vô hình và Cách khắc chế chuẩn Scopus',
        title_en: 'Common Method Bias (CMB): Invisible Threats and Scopus-Grade Remedies',
        expert_tip_vi: 'Kiểm định Harman là chưa đủ để thuyết phục Reviewer quốc tế. Hãy thảo luận về "Procedural Remedies" (biện pháp quy trình) ngay trong phần phương pháp nghiên cứu.',
        expert_tip_en: "Harman's test isn't enough for international journals. Discuss 'Procedural Remedies' directly in your Methodology section.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Bản chất của CMB: Tại sao dữ liệu của bạn bị "nhiễm độc"?',
                h2_en: '1. The Essence of CMB: Why Is Your Data Contaminated?',
                content_vi: `Common Method Bias (CMB) không phải là lỗi ngẫu nhiên, mà là sai số hệ thống phát sinh từ phương pháp đo lường. Khi bạn sử dụng cùng một bảng hỏi, cùng một thang đo (ví dụ Likert 5 điểm), và thu thập từ cùng một người trả lời trong cùng một thời điểm cho cả biến độc lập và phụ thuộc, dữ liệu sẽ phát sinh một "mẫu số chung". 
                Mẫu số chung này làm thổi phồng các tương quan giữa các biến một cách giả tạo. Reviewer gọi đây là hiện tượng "Mối quan hệ ảo" (Spurious relationships). Tại ncsStat, chúng tôi giúp bạn nhận diện sự thổi phồng này để bảo vệ tính chính xác của các kết luận khoa học.`,
                content_en: `CMB is systematic error variance shared among variables measured with the same method. When independent and dependent variables are collected from the same respondent at the same time using identical scale formats, an artificial "common variance" is created. This inflates correlations, leading to spurious results. ncsStat helps you detect and mitigate this inflation to maintain scientific integrity.`
            },
            {
                h2_vi: '2. Nguồn gốc của sai lệch: Cái bẫy của Tâm lý học hành vi',
                h2_en: '2. Sources of Bias: The Trap of Behavioral Psychology',
                content_vi: `CMB đến từ nhiều nguồn mà nhà nghiên cứu thường bỏ qua:
                - **Sự mong muốn xã hội (Social Desirability)**: Người trả lời cố gắng trả lời sao cho "có vẻ tốt" thay vì trả lời đúng sự thật.
                - **Hiệu ứng hào quang (Halo Effect)**: Một cảm xúc tốt về công ty sẽ khiến họ chấm điểm cao cho mọi khía cạnh khác (lương, sếp, môi trường).
                - **Xu hướng đồng thuận (Acquiescence)**: Người trả lời có thói quen chọn "Đồng ý" mà không đọc kỹ nội dung.
                Hiểu rõ các nguồn này giúp bạn viết phần "Thảo luận" (Discussion) sâu sắc hơn khi giải thích về các hạn chế của nghiên cứu.`,
                content_en: `CMB stems from various psychological factors: Social Desirability (answering to "look good"), the Halo Effect (one positive perception coloring all responses), and Acquiescence bias (blindly agreeing). Identifying these sources allows for a more nuanced Discussion section and realistic interpretation of findings.`
            },
            {
                h2_vi: '3. Kiểm định Harman’s Single Factor: "Cửa ngõ" đầu tiên',
                h2_en: '3. Harman’s Single Factor: The Entry-level Diagnostic',
                content_vi: `Đây là kiểm định phổ biến nhất thế giới nhờ tính đơn giản. Bạn đưa tất cả các biến quan sát vào một phân tích nhân tố khám phá (EFA) và ép chúng về một nhân tố duy nhất (không xoay). 
                **Ngưỡng quyết định**: Nếu nhân tố duy nhất này giải thích > 50% tổng phương sai, mô hình của bạn đã bị "nhiễm độc" CMB nặng nề. ncsStat thực hiện kiểm định này chỉ trong 1 giây, cung cấp bằng chứng thép để bạn ghi vào bài báo cáo khoa học của mình.`,
                content_en: `Harman's Single Factor test involves running an unrotated EFA on all items. If one factor captures more than 50% of the total variance, CMB is likely a significant issue. ncsStat automates this calculation, providing the empirical proof needed for your 'Results' section.`
            },
            {
                h2_vi: '4. Kiểm định Marker Variable: Tiêu chuẩn của các tạp chí hạng A',
                h2_en: '4. The Marker Variable Technique: The A-Journal Standard',
                content_vi: `Reviewer quốc tế hiện nay thường yêu cầu phương pháp Marker Variable. Bạn chọn một biến "Dấu hiệu" hoàn toàn không liên quan đến mô hình lý thuyết (ví dụ: "Thái độ với màu xanh lá cây") và đưa vào phân tích. 
                Nếu tương quan giữa biến Marker và các biến chính cao, đó là bằng chứng không thể chối cãi của CMB. Tại ncsStat, chúng tôi hướng dẫn bạn cách chọn và tính toán sự thay đổi của tương quan (Correlation adjustments) khi có sự hiện diện của biến Marker.`,
                content_en: `Marker Variable technique involves adding a construct theoretically unrelated to your model. If this "Marker" correlates significantly with your primary variables, CMB is present. High-impact journals prefer this method over Harman's. ncsStat provides the computational guidance to perform correlation adjustments using Marker data.`
            },
            {
                h2_vi: '5. Biện pháp Quy trình (Procedural Remedies): Phòng bệnh hơn chữa bệnh',
                h2_en: '5. Procedural Remedies: Prevention is Better Than Cure',
                content_vi: `Đừng đợi đến khi có dữ liệu mới lo CMB. Các chuyên gia tại ncsStat khuyên bạn áp dụng các biện pháp sau ngay khi thiết kế:
                1. **Temporal Separation**: Thu thập biến X vào tuần 1, biến Y vào tuần 2.
                2. **Scale Diversity**: Dùng Likert 5 điểm cho X và 7 điểm cho Y.
                3. **Anonymity Assurance**: Cam kết bảo mật tuyệt đối để giảm sự mong muốn xã hội.
                Việc liệt kê các biện pháp này trong bài báo sẽ làm tăng tính thuyết phục của nghiên cứu lên gấp bội.`,
                content_en: `Proactive prevention includes: Temporal Separation (time-lagged surveys), Scale Diversity (mixing 5-point and 7-point Likert scales), and guaranteeing anonymity to reduce social desirability. Documenting these steps in your paper significantly boosts research credibility.`
            },
            {
                h2_vi: '6. Common Latent Factor (CLF) trong AMOS/CFA',
                h2_en: '6. Common Latent Factor (CLF) in AMOS/CFA',
                content_vi: `Nếu bạn sử dụng AMOS, phương pháp CLF là mạnh mẽ nhất. Bạn tạo một biến tiềm ẩn chung và nối nó vào tất cả các biến quan sát trong mô hình. 
                Bằng cách so sánh các hệ số đường dẫn trước và sau khi có CLF, bạn có thể xác định chính xác mức độ sai lệch của từng biến. ncsStat cung cấp video hướng dẫn chi tiết cách thực hiện kỹ thuật phức tạp này trong AMOS để bảo vệ luận văn của bạn trước các phản biện khắt khe.`,
                content_en: `The CLF method in AMOS creates a common factor linked to all indicators. By comparing path coefficients with and without this factor, you quantify the bias on a per-item basis. ncsStat provides specialized tutorials for this advanced structural technique to bulletproof your dissertation.`
            },
            {
                h2_vi: '7. Tác động của CMB đến kết quả: Thổi phồng hay Triệt tiêu?',
                h2_en: '7. Impact on Results: Inflation or Suppression?',
                content_vi: `Một quan niệm sai lầm là CMB chỉ làm tăng tương quan. Trong một số trường hợp, nó có thể gây ra hiện tượng "Triệt tiêu" (Suppression), làm cho các mối quan hệ có thật trở nên không có ý nghĩa thống kê. 
                Điều này cực kỳ nguy hiểm vì nó có thể khiến bạn bác bỏ những giả thuyết đúng (Sai lầm loại II). Hiểu rõ cơ chế này giúp bạn tự tin hơn khi bảo vệ kết quả nghiên cứu trước hội đồng.`,
                content_en: `CMB doesn't just inflate results; it can also suppress them, making significant relationships appear non-significant. This leads to Type II errors (rejecting true hypotheses). Understanding this mechanism is vital for defending your findings during a viva or peer review.`
            },
            {
                h2_vi: '8. Tổng kết: Bảng kiểm soát CMB cho bài báo quốc tế',
                h2_en: '8. Conclusion: The CMB Checklist for Quality Output',
                content_vi: `Để bài báo đạt chuẩn, hãy đảm bảo:
                1. Đã áp dụng ít nhất 2 biện pháp quy trình (Procedural).
                2. Đã thực hiện kiểm định Harman (mức sàn).
                3. Đã thực hiện ít nhất 1 kiểm định nâng cao (CLF hoặc Marker Variable).
                4. Đã thảo luận về CMB trong phần "Hạn chế của nghiên cứu".
                ncsStat luôn đồng hành cùng bạn để biến những quy trình phức tạp này thành những dòng báo cáo mượt mà và thuyết phục.`,
                content_en: `For a publishable paper, tick these boxes: Use at least two procedural remedies, run Harman's test, perform one advanced diagnostic (CLF/Marker), and discuss CMB in your 'Limitations' section. ncsStat transforms these rigorous steps into a streamlined, high-quality research narrative.`
            }
        ]
    },
    'pls-sem-vs-cb-sem-selection': {
        slug: 'pls-sem-vs-cb-sem-selection', category: 'Advanced Statistics',
        title_vi: 'PLS-SEM vs CB-SEM: Cuộc soán ngôi trong Phân tích mô hình cấu trúc',
        title_en: 'PLS-SEM vs CB-SEM: The Battle of Structural Equation Modeling',
        expert_tip_vi: 'Đừng chọn phần mềm trước khi chọn phương pháp. Hãy dùng CB-SEM (Amos) để kiểm định lý thuyết cũ, và PLS-SEM (SmartPLS) để phát triển lý thuyết mới hoặc khi mẫu nhỏ.',
        expert_tip_en: 'Theoretical goals drive method selection. Use CB-SEM for theory testing and PLS-SEM for theory development or small samples.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'CB-SEM: CFI > 0.90; PLS-SEM: SRMR < 0.08, Q2 > 0',
        content_structure: [
            {
                h2_vi: '1. Triết học đằng sau: Xác nhận (Confirmation) vs. Dự báo (Prediction)',
                h2_en: '1. Theoretical Nuance: Confirmation vs. Prediction',
                content_vi: `Sự khác biệt cốt lõi giữa CB-SEM (Covariance-Based) và PLS-SEM (Partial Least Squares) không nằm ở phần mềm, mà nằm ở mục tiêu nghiên cứu. 
                CB-SEM (như Amos, Lavaan) được thiết kế để **xác nhận** một lý thuyết đã vững chắc. Nó cố gắng giảm thiểu sự khác biệt giữa ma trận hiệp phương sai của mẫu và ma trận hiệp phương sai dự kiến của mô hình. 
                Ngược lại, PLS-SEM (như SmartPLS) tập trung vào việc **giải thích phương sai** của các biến phụ thuộc. Nói cách khác, if bạn muốn biết các biến độc lập "dự báo" được bao nhiêu phần trăm hành vi của khách hàng, PLS-SEM là vũ khí tối thượng. Tại ncsStat, chúng tôi giúp bạn định hướng đúng mục tiêu này ngay từ bước đầu tiên.`,
                content_en: `CB-SEM (Amos) is designed for theory testing and confirmation by minimizing the discrepancy between sample and predicted covariance matrices. PLS-SEM (SmartPLS) targets variance explanation and prediction. If your goal is to maximize R-squared and identify key drivers, PLS-SEM is the superior choice.`
            },
            {
                h2_vi: '2. Bản chất Toán học: Hiệp phương sai vs. Thành phần chính',
                h2_en: '2. Mathematical Foundations: Covariance vs. Variance',
                content_vi: `CB-SEM coi các biến tiềm ẩn là các thực thể "thực sự" gây ra các biến quan sát (Reflective). Nó đòi hỏi dữ liệu phải có phân phối chuẩn đa biến để các ước lượng ML (Maximum Likelihood) đạt độ chính xác.
                PLS-SEM lại coi biến tiềm ẩn là các "tổng hợp tuyến tính" (Composites) của các biến quan sát. Nó sử dụng thuật toán lặp để ước lượng các trọng số, do đó nó không yêu cầu giả định phân phối chuẩn. Đây là lý do tại sao PLS-SEM cực kỳ mạnh mẽ khi xử lý dữ liệu khảo sát thực tế vốn thường bị lệch hoặc có Outliers.`,
                content_en: `CB-SEM estimates model parameters to reproduce the covariance matrix, requiring multivariate normality. PLS-SEM uses a series of ordinary least squares (OLS) regressions to maximize explained variance. This non-parametric nature makes PLS-SEM robust against non-normal data and complex model specifications.`
            },
            {
                h2_vi: '3. Bài toán Cỡ mẫu: Quy tắc "10 lần" và sự thật đằng sau',
                h2_en: '3. Sample Size: The "10-times Rule" and Modern Reality',
                content_vi: `Một trong những lý do lớn nhất khiến PLS-SEM trở nên phổ biến là khả năng làm việc với mẫu nhỏ (Small samples). Quy tắc kinh điển của Barclay et al. (1995) cho rằng mẫu chỉ cần gấp 10 lần số đường dẫn tác động vào biến tiềm ẩn phức tạp nhất. 
                Tuy nhiên, ncsStat khuyến cáo bạn nên thận trọng: mẫu nhỏ trong PLS-SEM mang lại kết quả nhưng có thể thiếu "công suất thống kê" (Power). CB-SEM ngược lại, yêu cầu mẫu khá lớn (thường N > 200) để mô hình hội tụ. Nếu bạn chỉ thu thập được 100-150 mẫu, hãy mạnh dạn chọn PLS-SEM để tránh lỗi "Non-positive definite matrix" trong Amos.`,
                content_en: `While CB-SEM typically requires N > 200 for stable estimates, PLS-SEM can function with samples as small as 30-50, famously following the "10-times rule." However, for high-impact publishing, ncsStat suggests power analysis to ensure your sample size provides sufficient sensitivity to detect effects.`
            },
            {
                h2_vi: '4. Đánh giá Mô hình đo lường: Chỉ số nào mới quan trọng?',
                h2_en: '4. Measurement Model: Which Indices Matter?',
                content_vi: `Trong CB-SEM, chúng ta "tôn thờ" Model Fit như CFI, TLI, RMSEA. Nếu các chỉ số này không đạt, mô hình coi như bị bác bỏ.
                Trong PLS-SEM, Model Fit không phải là ưu tiên hàng đầu. Thay vào đó, chúng ta tập trung vào **Độ tin cậy tổng hợp (CR)**, **AVE (>0.5)** và đặc biệt là hệ số **HTMT** để kiểm tra tính phân biệt. ncsStat tự động tính toán HTMT - tiêu chuẩn khắt khe nhất hiện nay - giúp bạn chứng minh các nhân tố của mình là hoàn toàn khác biệt và đáng tin cậy.`,
                content_en: `CB-SEM relies heavily on global fit indices (CFI, TLI, RMSEA). PLS-SEM prioritizes predictive power and indicator reliability. Standard reports in PLS-SEM must include Composite Reliability (CR), AVE, and the HTMT ratio for discriminant validity. ncsStat provides automated HTMT tables, the gold standard in modern SEM research.`
            },
            {
                h2_vi: '5. Xử lý Mô hình phức tạp và Biến điều tiết',
                h2_en: '5. Handling Complexity and Moderation',
                content_vi: `Khi mô hình của bạn bắt đầu xuất hiện hàng chục biến và hàng trăm mũi tên, CB-SEM thường gặp khó khăn trong việc "hội tụ" và đưa ra các con số vô lý (Heywood cases). 
                PLS-SEM xử lý các mô hình khổng lồ một cách mượt mà. Đặc biệt, việc phân tích **Biến điều tiết (Moderation)** và **Phân tích đa nhóm (MGA)** trong SmartPLS đơn giản và mạnh mẽ hơn Amos rất nhiều. Nếu bài viết của bạn tập trung vào sự khác biệt giữa các nhóm khách hàng, PLS-SEM là sự lựa chọn không cần bàn cãi.`,
                content_en: `Complex models with many constructs and indicators often fail to reach convergence in CB-SEM. PLS-SEM excels in high-complexity environments and offers superior tools for Moderating effects and Multi-Group Analysis (MGA). If your thesis involves interaction effects, PLS-SEM is computationally more stable and user-friendly.`
            },
            {
                h2_vi: '6. Sức mạnh dự báo: Thông số PLSpredict',
                h2_en: '6. Predictive Power: The Rise of PLSpredict',
                content_vi: `Các tạp chí hàng đầu (Q1) hiện nay không còn thỏa mãn với p-value < 0.05. Họ muốn thấy khả năng dự báo của mô hình trên dữ liệu mới. 
                Đây là nơi PLS-SEM tỏa sáng rực rỡ với tính năng **PLSpredict**. Nó sử dụng kỹ thuật "hold-out sample" để chứng minh rằng mô hình của bạn thực sự có giá trị ứng dụng thực tiễn chứ không chỉ là khớp số liệu một cách ngẫu nhiên. ncsStat tích hợp các hướng dẫn sâu để bạn báo cáo RMSE và MAE từ PLSpredict, ghi điểm tuyệt đối với các phản biện quốc tế.`,
                content_en: `Top-tier journals now demand evidence of out-of-sample predictive power. PLSpredict is the standard metric for this in PLS-SEM. By comparing RMSE and MAE across model and benchmark samples, you prove your research has real-world utility. ncsStat helps you interpret these advanced "Predictive Relevance" figures.`
            },
            {
                h2_vi: '7. Nhược điểm cần lưu ý: Tính chệch (Bias) và Tính nhất quán',
                h2_en: '7. Critical Drawbacks: Bias and Consistency Issues',
                content_vi: `Học thuật công tâm đòi hỏi chúng ta nhìn vào cả nhược điểm. PLS-SEM bị chỉ trích là có "tính chệch" (PLS bias) - các hệ số tải có xu hướng cao hơn và hệ số đường dẫn thấp hơn một chút so với giá trị thực. 
                Tuy nhiên, với sự ra đời của **Consistent PLS (PLSc)**, nhược điểm này đã được khắc phục hoàn toàn. ncsStat hỗ trợ cả hai thuật toán này, giúp bạn trả lời mọi câu hỏi chất vấn của hội đồng về tính nhất quán của ước lượng.`,
                content_en: `PLS-SEM was traditionally criticized for "parameter estimation bias." However, Consistent PLS (PLSc) algorithms have bridged the gap between PLS and Covariance methods. ncsStat allows you to toggle between standard and consistent PLS to satisfy rigorous reviewers demanding unbiased estimates.`
            },
            {
                h2_vi: '8. Quy trình 05 bước ra quyết định chuẩn chuyên gia',
                h2_en: '8. 5-Step Expert Decision Framework',
                content_vi: `Để chọn đúng phương pháp, hãy tự hỏi:
                1. **Mục tiêu?** (Test lý thuyết -> CB-SEM; Khám phá/Dự báo -> PLS-SEM).
                2. **Mô hình phức tạp?** (Rất phức tạp -> PLS-SEM).
                3. **Dữ liệu?** (Không chuẩn/Mẫu nhỏ -> PLS-SEM).
                4. **Biến quan sát?** (Reflective -> Cả hai; Formative -> Bắt buộc PLS-SEM).
                5. **Sức mạnh dự báo?** (Cần thiết -> PLS-SEM).
                
                Tại ncsStat, chúng tôi cung cấp công cụ "Methodology Advisor" tự động gợi ý phương pháp cho bạn dựa trên dữ liệu thật. Hãy nhớ: không có phương pháp tốt nhất, chỉ có phương pháp phù hợp nhất với bài nghiên cứu của bạn.`,
                content_en: `1. Study Goal? 2. Structural Complexity? 3. Data Distribution? 4. Measurement Perspective (Reflective vs Formative)? 5. Predictive Importance? ncsStat’s Methodology Advisor automates this decision matrix to ensure you start your analysis on the right track.`
            }
        ]
    },
    'cfa-confirmatory-factor-analysis': {
        slug: 'cfa-confirmatory-factor-analysis', category: 'Advanced Statistics',
        title_vi: 'Phân tích nhân tố khẳng định (CFA): Chìa khóa vàng thẩm định thang đo',
        title_en: 'Confirmatory Factor Analysis (CFA): The Gold Standard for Validation',
        expert_tip_vi: 'CFA không phải là EFA. Bạn phải có mô hình lý thuyết trước khi chạy. Nếu Model Fit không đạt, hãy nhìn vào Modification Indices (MI) để tìm cách cải thiện.',
        expert_tip_en: 'CFA is not EFA. You must have a theoretical model first. If Model Fit is low, use Modification Indices (MI) to refine your paths.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'CFI/TLI > 0.90, RMSEA < 0.08, SRMR < 0.08, AVE > 0.5, CR > 0.7',
        content_structure: [
            {
                h2_vi: '1. CFA là gì và Tại sao nó lại "cao cấp" hơn EFA?',
                h2_en: '1. What is CFA and Why is it Superior to EFA?',
                content_vi: `Trong khi EFA là "đi tìm" cấu trúc ẩn, thì CFA là "khẳng định" cấu trúc đó dựa trên các lý thuyết đã có. Bạn nói với phần mềm: "Tôi tin rằng 5 câu này thuộc về nhân tố A", và CFA sẽ trả lời: "Đúng hay Sai". ncsStat sử dụng engine Lavaan (R) để thực hiện các phép tính ma trận phức tạp, đưa bài nghiên cứu của bạn lên tầm vóc của các báo cáo khoa học quốc tế.`,
                content_en: `While EFA discovers structures, CFA confirms them based on prior theory. You dictate the factor structure, and CFA tests its validity against the empirical data. ncsStat leverages the powerful Lavaan engine for these complex matrix operations, elevating your research to international standards.`
            },
            {
                h2_vi: '2. Bộ chỉ số Model Fit: "Hàng rào" kỹ thuật khắt khe',
                h2_en: '2. Model Fit Indices: The Rigorous Criteria',
                content_vi: `Không giống các phép thử thông thường, CFA đòi hỏi mô hình phải "khớp" với dữ liệu thực tế thông qua các chỉ số:
- **CFI / TLI > 0.90**: Độ phù hợp tốt.
- **RMSEA < 0.08**: Sai số xấp xỉ đạt yêu cầu.
- **SRMR < 0.08**: Sai số dư chuẩn hóa đạt chuẩn.
Tại ncsStat, chúng tôi trình bày các chỉ số này trên một bảng tóm tắt trực quan, giúp bạn biết ngay mô hình của mình có đủ điều kiện để nộp bài hay không.`,
                content_en: `CFA demands a high fit between your model and the data. Essential thresholds include CFI/TLI > 0.90 and RMSEA/SRMR < 0.08. ncsStat presents these in a clear dashboard, highlighting any metrics that fall below academic expectations.`
            },
            {
                h2_vi: '3. Giá trị hội tụ (AVE và CR): Đo lường sự thuần khiết',
                h2_en: '3. Convergent Validity: AVE and Composite Reliability (CR)',
                content_vi: `CFA giúp bạn chứng minh các biến quan sát thực sự hội tụ về nhân tố mẹ:
- **AVE (Average Variance Extracted) > 0.5**: Nhân tố giải thích được hơn 50% biến thiên của các biến.
- **CR (Composite Reliability) > 0.7**: Độ tin cậy tổng hợp đạt chuẩn.
ncsStat tự động tính toán hai chỉ số phức tạp này, giúp bạn vượt qua các vòng phản biện khắt khe về tính hội tụ của thang đo.`,
                content_en: `In the CFA world, AVE should exceed 0.5 and CR should exceed 0.7. These confirm that your indicators truly capture the essence of the latent construct. ncsStat automates these tedious calculations, saving you from manual errors and complex formulas.`
            },
            {
                h2_vi: '4. Tính phân biệt: Fornell-Larcker vs. HTMT',
                h2_en: '4. Discriminant Validity: Fornell-Larcker vs. HTMT',
                content_vi: `Bạn phải chứng minh các nhân tố là hoàn toàn khác biệt nhau. ncsStat hỗ trợ cả hai phương pháp:
- **Fornell-Larcker**: So sánh căn bậc hai AVE với tương quan.
- **HTMT (Heterotrait-Monotrait Ratio)**: Tiêu chuẩn vàng mới nhất (nên < 0.85).
Việc báo cáo được HTMT cho thấy bạn là một nhà nghiên cứu am tường và luôn cập nhật những xu hướng thống kê hiện đại nhất thế giới.`,
                content_en: `Discriminant validity ensures your constructs aren't redundant. ncsStat supports both the classic Fornell-Larcker criterion and the modern HTMT ratio (< 0.85). Reporting HTMT demonstrates your familiarity with contemporary statistical standards and increases your paper's chance of acceptance.`
            },
            {
                h2_vi: '5. Sơ đồ đường dẫn (Path Diagram): Bản đồ của tri thức',
                h2_en: '5. Path Diagrams: The Map of Knowledge',
                content_vi: `Một sơ đồ CFA với các mũi tên, sai số và hệ số tải chuẩn hóa (Standardized Loadings) là minh chứng trực quan mạnh mẽ nhất cho thang đo của bạn. ncsStat xuất bản các sơ đồ vector sắc nét, tự động vẽ các mối quan hệ phức tạp, giúp luận văn của bạn chuyên nghiệp và thu hút người đọc hơn hẳn các bảng số liệu khô khan.`,
                content_en: `Clear path diagrams with standardized loadings provide powerful visual proof of your factor structure. ncsStat generates high-quality vector diagrams automatically, transforming raw data into professional visuals that anchor your dissertation's findings.`
            },
            {
                h2_vi: '6. Modification Indices (MI): Mẹo cứu vãn mô hình "xấu"',
                h2_en: '6. Modification Indices (MI): Rescuing a Poor Fit',
                content_vi: `Nếu chỉ số Fit thấp, ncsStat sẽ cung cấp bảng MI gợi ý các mối liên kết tiềm năng giữa các sai số (Error covariances). Mẹo chuyên gia: chỉ nên nối các sai số của những biến thuộc cùng một nhân tố và có cơ sở lý thuyết vững chắc. Việc lạm dụng MI mà không có giải trình sẽ khiến bài nghiên cứu của bạn bị coi là "ép số liệu" (Data snooping).`,
                content_en: `When fit is low, ncsStat provides MI tables suggesting potential paths or error covariances to improve results. Caution: only link errors based on theoretical justification to avoid being accused of "data snooping" or artificial fit-hacking.`
            },
            {
                h2_vi: '7. CFA Đa nhóm (Invariance): Kiểm định tính bền vững',
                h2_en: '7. Multi-Group CFA (Invariance): Testing Structural Stability',
                content_vi: `Thang đo của bạn có dùng được cho cả Nam và Nữ không? ncsStat hỗ trợ kiểm định tính bất biến đo lường (Measurement Invariance). Nếu thang đo vượt qua được kiểm định này, bạn có thể tự tin khẳng định kết quả nghiên cứu của mình là bền vững và có tính tổng quát hóa cực cao trên nhiều đối tượng khác nhau.`,
                content_en: `Measurement Invariance tests if your scale works identically across different groups (e.g., Male vs. Female). Passing this test confirms your instrument's structural stability and enhances the generalizability of your research conclusions.`
            },
            {
                h2_vi: '8. Trình bày kết quả CFA chuẩn quốc tế APA 7',
                h2_en: '8. Professional CFA Reporting Following APA 7',
                content_vi: ` Một báo cáo CFA hoàn chỉnh cần: Bảng chỉ số Model Fit, Ma trận hệ số tải chuẩn hóa, Bảng AVE/CR/HTMT và Sơ đồ đường dẫn. "Kết quả CFA cho thấy mô hình đạt độ phù hợp tốt (CFI = .92, RMSEA = .06). Tất cả các hệ số tải đều > 0.6 và AVE đạt 0.55, khẳng định giá trị hội tụ của thang đo." Hãy để ncsStat giúp bạn viết những câu nhận định này một cách hoàn hảo nhất.`,
                content_en: `A complete report requires Fit indices, Standardized Loadings, and AVE/CR/HTMT tables. Example: "The CFA showed an excellent fit (CFI = .92, RMSEA = .06) with all loadings over 0.6." ncsStat's auto-narrative generates these professional phrases for your results section.`
            }
        ]
    },
    'writing-academic-results-apa': {
        slug: 'writing-academic-results-apa', category: 'Academic Writing',
        title_vi: 'Viết kết quả nghiên cứu chuẩn Q1: Bậc thầy ngôn ngữ học thuật',
        title_en: 'Writing Q1-Level Results: Master of Academic Narrative',
        expert_tip_vi: 'Đừng chỉ báo cáo p-value. Hãy tập trung vào "Effect Size" và "Confidence Intervals". Đây mới là thứ Reviewer các tạp chí lớn quan tâm nhất.',
        expert_tip_en: "Don't just report p-values. Focus on Effect Size and Confidence Intervals. This is what top-tier journal reviewers look for.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Nghệ thuật kể chuyện (Storytelling) qua ma trận số liệu',
                h2_en: '1. The Art of Storytelling via Statistical Matrices',
                content_vi: `Sai lầm lớn nhất của các nghiên cứu sinh là coi chương 4 (Kết quả) như một bản báo cáo khô khan. Thực tế, kết quả nghiên cứu là một câu chuyện. Bạn dẫn dắt người đọc từ việc mô tả tập mẫu, đến việc khẳng định thang đo sạch sẽ, và cuối cùng là sự vỡ òa khi giả thuyết được ủng hộ. 
                Tại ncsStat, chúng tôi giúp bạn xây dựng mạch truyện này một cách logic. Hãy bắt đầu bằng một cái nhìn tổng thể trước khi đi sâu vào chi tiết, giúp người đọc không bị "ngộp" giữa hàng trăm con số.`,
                content_en: `The biggest mistake in reporting results is treating the data chapter as a dry list. Instead, view it as a narrative. Guide your reader from sample descriptions to measurement purification, culminating in the "eureka" moment of supported hypotheses. ncsStat helps you build this logical flow, starting with the big picture before diving into granular statistics.`
            },
            {
                h2_vi: '2. Trình bày Tương quan: Bước đệm cho sự bùng nổ',
                h2_en: '2. Reporting Correlations: The Prelude to Significance',
                content_vi: `Đừng chỉ dán bảng tương quan rồi viết "Các biến có tương quan với nhau". Hãy viết về **mức độ (magnitude)** và **hướng (direction)**. 
                "Kết quả sơ bộ cho thấy một mối liên hệ thuận mạnh mẽ giữa A và B (r = .65, p < .01), điều này cung cấp căn cứ thực nghiệm ban đầu để tiến hành các phân tích hồi quy chuyên sâu hơn." Cách viết này cho thấy bạn là một nhà nghiên cứu có tầm nhìn hệ thống chứ không phải chỉ chạy phần mềm một cách máy móc.`,
                content_en: `Don't just paste a table and say "variables are correlated." Discuss the magnitude and direction. "Preliminary results reveal a strong positive association (r = .65, p < .01), providing initial empirical grounds for further regression testing." This phrasing demonstrates a systemic understanding of your analysis.`
            },
            {
                h2_vi: '3. Mô tả giả thuyết: Ngôn ngữ của sự khẳng định',
                h2_en: '3. Stating Hypotheses: The Language of Confirmation',
                content_vi: `Khi trình bày kết quả kiểm định giả thuyết, hãy sử dụng các cụm từ mạnh mẽ nhưng thận trọng:
                - **"Kết quả thực nghiệm ủng hộ mạnh mẽ giả thuyết H1..."**
                - **"Bằng chứng thống kê cho thấy sự tồn tại của tác động..."**
                Tránh dùng từ "chứng minh" (prove) vì trong khoa học chúng ta chỉ đang "thu thập bằng chứng ủng hộ". Việc dùng đúng thuật ngữ giúp bạn ghi điểm chuyên nghiệp trong mắt hội đồng. ncsStat tự động gợi ý các mẫu câu này dựa trên kết quả p-value của bạn.`,
                content_en: `Use strong yet scholarly phrases: "Empirical results strongly support H1..." or "Statistical evidence indicates the presence of an effect..." Avoid "prove," as science is about supporting claims with evidence. Using correct terminology marks you as a professional researcher. ncsStat's auto-narrative feature suggests these phrases based on your exact p-values.`
            },
            {
                h2_vi: '4. Giải mã Hệ số Beta: Ý nghĩa thực tiễn quan trọng hơn con số',
                h2_en: '4. Decoding Beta: Practical Significance Over Raw Numbers',
                content_vi: `Reviewer không quan tâm Beta = 0.35 nghĩa là gì về mặt toán học. Họ muốn biết nó có nghĩa gì về mặt thực tế. 
                "Với hệ số Beta = 0.35, nghiên cứu cho thấy khi doanh nghiệp tăng 1 đơn vị trong đầu tư công nghệ, sự hài lòng của khách hàng sẽ tăng thêm 0.35 đơn vị." Cách diễn giải này đưa con số từ sách giáo khoa ra ngoài thực tiễn, làm cho bài nghiên cứu của bạn trở nên sống động và có giá trị áp dụng cao.`,
                content_en: `Reviewers aren't interested in the math behind Beta = 0.35; they want practical meaning. "With a Beta of 0.35, the study indicates that for each unit increase in tech investment, customer satisfaction rises by 0.35 units." This interpretation brings data to life, making your research impactful and actionable.`
            },
            {
                h2_vi: '5. Tầm quan trọng của Effect Size (f²) và R-square',
                h2_en: '5. The Power of Effect Size (f²) and R2',
                content_vi: `P-value chỉ nói lên "có tác động", nhưng R-square và f² mới nói lên "tác động đó lớn thế nào". 
                "Dù tác động có ý nghĩa thống kê (p < .05), nhưng hệ số f² = .02 cho thấy mức độ tác động rất nhỏ." Việc trung thực báo cáo cả những tác động nhỏ cho thấy sự khách quan và liêm chính trong nghiên cứu của bạn. ncsStat bôi đậm các chỉ số này để bạn không bao giờ bỏ sót chúng trong báo cáo.`,
                content_en: `P-values indicate presence; R2 and f2 indicate magnitude. "Despite the significant p-value, an f2 of .02 suggests a negligible effect." Reporting small effects with honesty demonstrates research integrity. ncsStat highlights these metrics so you never miss them in your final report.`
            },
            {
                h2_vi: '6. Trình bày Bảng biểu chuẩn APA 7: Sạch đẹp và Chuyên nghiệp',
                h2_en: '6. APA 7 Table Standards: Clean, Crisp, Professional',
                content_vi: `Một bảng biểu chuẩn APA không có các đường kẻ dọc, font chữ thường là Times New Roman 12, và ghi chú (Note) phải rõ ràng. 
                ncsStat cung cấp tính năng "Một click xuất bảng APA", giúp bạn tiết kiệm hàng giờ đồng hồ ngồi kẻ bảng trong Word. Hãy nhớ: một bài luận văn sạch đẹp về hình thức đã chiếm được 30% thiện cảm của hội đồng chấm.`,
                content_en: `APA tables have no vertical lines and use clear notes for significance levels. ncsStat's "One-Click APA Export" saves hours of formatting. A clean, well-presented dissertation immediately earns academic respect from the committee.`
            },
            {
                h2_vi: '7. Ngôn ngữ của sự thận trọng (Hedging) và Hạn chế',
                h2_en: '7. Hedging Language and Acknowledging Limitations',
                content_vi: `Người mới thường cố gắng khẳng định mọi thứ là hoàn hảo. Chuyên gia thường dùng "Hedging":
                - "Kết quả này gợi ý rằng..."
                - "Có khả năng là..."
                Việc thừa nhận các giới hạn của dữ liệu và dùng ngôn ngữ thận trọng không phải là yếu kém, mà là sự trưởng thành trong tư duy phản biện. Điều này giúp bạn "né" được các câu hỏi vặn vẹo của hội đồng về tính tổng quát hóa của kết quả.`,
                content_en: `Novices claim perfection; experts use "hedging." Phrases like "results suggest that..." or "it is possible that..." reflect critical maturity. Acknowledging data limits protects you from tough questions regarding the generalizability of your findings.`
            },
            {
                h2_vi: '8. Tổng kết: Check-list viết kết quả không thể bị bác bỏ',
                h2_en: '8. Conclusion: The Irrefutable Results Checklist',
                content_vi: `Trước khi nộp bài, hãy kiểm tra:
                1. Đã báo cáo giá trị trung bình (M) và độ lệch chuẩn (SD)?
                2. Đã có trị số t, f, p cho mọi kiểm định?
                3. Đã có Confidence Intervals (CI)?
                4. Đã có Effect Size?
                5. Bảng biểu đã bỏ đường kẻ dọc chưa?
                Cùng ncsStat, mỗi con số bạn viết ra đều mang trong mình sức nặng của tri thức và sự chính xác tuyệt đối.`,
                content_en: `Final checklist: Did you report M and SD? Are t, F, and p values included for all tests? Did you provide CIs and Effect Sizes? Are your tables free of vertical lines? With ncsStat, every number you report carries the weight of academic authority and precision.`
            }
        ]
    },
    'interaction-effects-moderation': {
        slug: 'interaction-effects-moderation', category: 'Advanced Research',
        title_vi: 'Biến tương tác & Điều tiết (Moderation): Khi 1+1 không chỉ bằng 2',
        title_en: 'Interaction Effects & Moderation: Beyond Simple Additivity',
        expert_tip_vi: 'Hãy sử dụng kỹ thuật "Mean Centering" cho các biến trước khi tạo tích tương tác để tránh đa cộng tuyến cao.',
        expert_tip_en: 'Apply "Mean Centering" before creating product terms to mitigate potential multicollinearity issues.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Biến điều tiết là gì? Khi 1+1 không chỉ bằng 2',
                h2_en: '1. What is a Moderator? Beyond Simple Additivity',
                content_vi: `Biến điều tiết (Moderator) là biến số làm thay đổi cường độ hoặc chiều hướng tác động của biến độc lập (X) lên biến phụ thuộc (Y). 
                Tại ncsStat, chúng tôi giúp bạn hiểu rằng X không phải lúc nào cũng tác động lên Y theo một cách duy nhất. Sự hiện diện của biến M (ví dụ: Công nghệ, Văn hóa, Thu nhập) sẽ làm cho mối quan hệ này trở nên "nhạy cảm" hơn. Đây là chìa khóa để giải thích những kết quả nghiên cứu trái ngược nhau trong quá khứ.`,
                content_en: `A moderator (M) changes the strength or direction of the relationship between X and Y. ncsStat empowers you to move beyond simple linear thinking, exploring how factors like Technology or Culture make relationships "contingent." Moderation is the key to resolving conflicting findings in existing literature.`
            },
            {
                h2_vi: '2. Kỹ thuật Mean Centering: Khắc chế đa cộng tuyến',
                h2_en: '2. Mean Centering: Mitigating Multicollinearity',
                content_vi: `Khi tạo biến tương tác (X*M), bạn thường gặp vấn đề đa cộng tuyến cực cao do X*M tương quan mạnh với X và M gốc. 
                ncsStat tự động thực hiện **Mean Centering** (lấy giá trị trừ đi trung bình) trước khi nhân. Kỹ thuật này giúp hệ số hồi quy trở nên ổn định và dễ diễn giải hơn, đồng thời đảm bảo mô hình của bạn vượt qua được các vòng kiểm định VIF khắt khe của các tạp chí quốc tế.`,
                content_en: `Creating interaction terms (X*M) often leads to severe multicollinearity. ncsStat automates **Mean Centering**—subtracting the mean from each score before multiplication. This stabilizes regression coefficients and ensures your model passes strict VIF diagnostics required by top-tier journals.`
            },
            {
                h2_vi: '3. Cách đọc Slope Plot: Nghệ thuật trực quan hóa sự tương tác',
                h2_en: '3. Simple Slope Analysis: Visualizing Interaction',
                content_vi: `Con số Beta của biến tương tác có ý nghĩa (p < 0.05) mới chỉ là điều kiện cần. Để thuyết phục người đọc, bạn cần biểu đồ Simple Slope. 
                ncsStat xuất bản các đồ thị với 3 đường thẳng đại diện cho: M thấp (-1 SD), M trung bình, và M cao (+1 SD). Nếu các đường này không song song và có độ dốc khác nhau, bạn đã có bằng chứng "vàng" về hiệu ứng điều tiết.`,
                content_en: `A significant interaction p-value is just the start. ncsStat generates Simple Slope plots representing M at low (-1 SD), mean, and high (+1 SD) levels. Non-parallel lines with varying slopes provide visual "gold" evidence of moderation, making your findings intuitive and publishable.`
            },
            {
                h2_vi: '4. Điều tiết của Biến định tính (Categorical Moderator)',
                h2_en: '4. Categorical Moderators: Multi-group Insights',
                content_vi: `Trong Marketing, chúng ta thường điều tiết bằng Giới tính (Nam/Nữ) hoặc Thế hệ (Gen Z/Millennials). 
                ncsStat hỗ trợ phân tích đa nhóm (Multi-group Analysis - MGA) để so sánh các hệ số đường dẫn giữa các nhóm. Việc chỉ ra rằng "Chính sách giá chỉ tác động đến ý định mua của người thu nhập thấp" là một insight cực kỳ giá trị cho các đề xuất quản trị trong luận văn của bạn.`,
                content_en: `Marketing often uses gender or generational cohorts as moderators. ncsStat supports Multi-group Analysis (MGA) to compare path coefficients across segments. Highlighting that "Price only impacts intention for low-income groups" provides high-value managerial insights for your thesis.`
            },
            {
                h2_vi: '5. Vùng ý nghĩa Johnson-Neyman: Kỹ thuật đỉnh cao',
                h2_en: '5. Johnson-Neyman Technique: Identifying the Tipping Point',
                content_vi: `Thay vì chỉ chia nhóm Thấp/Cao, kỹ thuật Johnson-Neyman cho biết **chính xác tại giá trị nào** của biến điều tiết thì tác động của X lên Y bắt đầu có ý nghĩa (hoặc mất ý nghĩa). 
                ncsStat cung cấp biểu đồ vùng ý nghĩa này, giúp bạn đưa ra những kết luận cực kỳ chi tiết: "Chỉ khi niềm tin khách hàng đạt trên mức 3.5 điểm, thì quảng cáo mới bắt đầu có tác dụng". Đây là đẳng cấp của các bài báo Scopus Q1.`,
                content_en: `Beyond the high/low split, the Johnson-Neyman technique identifies the exact value of M where the X-Y relationship becomes significant. ncsStat provides this significance zone mapping, allowing for precise conclusions like: "Advertising only works when trust exceeds 3.5." This is the hallmark of Q1 Scopus research.`
            },
            {
                h2_vi: '6. Điều tiết bậc cao (Three-way Interaction)',
                h2_en: '6. Three-way Interaction: Navigating Complexity',
                content_vi: `Đôi khi tác động của X lên Y bị điều tiết bởi M1, và mối quan hệ đó lại tiếp tục bị thay đổi bởi M2. 
                ncsStat hỗ trợ mô hình hóa tương tác 3 chiều (Three-way interaction), giúp bạn giải quyết các bài toán thực tế siêu phức tạp. Dù khó diễn giải, nhưng nếu làm chủ được kỹ thuật này, bài nghiên cứu của bạn sẽ đứng ở một vị thế hoàn toàn khác về năng lực phân tích.`,
                content_en: `Sometimes the X-Y link is moderated by M1, which is further contingent on M2. ncsStat supports three-way interaction modeling for hyper-complex real-world problems. Mastering this complex interpretation places your research in an elite tier of analytical capability.`
            },
            {
                h2_vi: '7. Sai lầm thường gặp: Nhầm lẫn giữa Trung gian và Điều tiết',
                h2_en: '7. Common Pitfall: Confusion between Mediation and Moderation',
                content_vi: `Nghiên cứu sinh rất hay nhầm hai khái niệm này. Trung gian (Mediation) giải thích **Cơ chế** (X làm tăng M, rồi M làm tăng Y). Điều tiết (Moderation) giải thích **Bối cảnh** (Tác động X-Y thay đổi tùy theo M). 
                ncsStat tích hợp công cụ "Model Checker" để giúp bạn xác định đúng bản chất của biến dựa trên khung lý thuyết, tránh những sai sót cơ bản làm hỏng cấu trúc bài nghiên cứu.`,
                content_en: `Researchers often confuse these two. Mediation explains the *Mechanism* (How?), while Moderation explains the *Context* (When?). ncsStat’s Model Checker helps you correctly identify construct roles based on your framework, preventing structural errors that could invalidate your entire study.`
            },
            {
                h2_vi: '8. Trình bày kết quả Điều tiết chuẩn APA 7 cho tạp chí quốc tế',
                h2_en: '8. Professional APA 7 Reporting for Moderation',
                content_vi: `Báo cáo điều tiết cần bảng hệ số tương tác và biểu đồ slope. 
                "Kết quả cho thấy tương tác giữa X và M có ý nghĩa thống kê (β = .25, p < .01). Phân tích slope chỉ ra rằng tác động của X lên Y mạnh hơn đáng kể ở nhóm có M cao so với nhóm có M thấp." ncsStat tự động soạn thảo những đoạn văn bản này, giúp bạn tự tin gửi bài đi các tạp chí quốc tế hàng đầu.`,
                content_en: `Reporting moderation requires interaction tables and slope plots. "The interaction between X and M was significant (β = .25, p < .01). Slope analysis revealed that X's impact on Y is significantly stronger at high levels of M." ncsStat generates these academic narratives for top-tier journal submissions.`
            }
        ]
    },
    'manipulation-check-scenario': {
        slug: 'manipulation-check-scenario', category: 'Research Methodology',
        title_vi: 'Manipulation Check: Bảo hiểm tính hợp lệ cho thực nghiệm',
        title_en: 'Manipulation Check: Validity Insurance for Experiments',
        expert_tip_vi: 'Nếu Manipulation Check thất bại (p > 0.05), toàn bộ kết luận thực nghiệm sẽ không còn giá trị. Hãy kiểm soát nó thật tốt.',
        expert_tip_en: 'A failed manipulation check invalidates your experiment. Control it rigorously in your pilot study.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Manipulation Check là gì? "Bảo hiểm" cho nghiên cứu thực nghiệm',
                h2_en: '1. What is a Manipulation Check? The Experimental Insurance',
                content_vi: `Trong các nghiên cứu thực nghiệm kịch bản (Scenario-based experiments), bạn chia người trả lời vào các nhóm khác nhau (ví dụ: nhóm xem giá cao và nhóm xem giá thấp). 
                Manipulation Check là bước kiểm tra xem người trả lời có thực sự nhận thấy sự khác biệt đó không. Nếu họ không nhận ra giá là cao hay thấp, mọi kết quả về "Ý định mua" sau đó đều vô giá trị. ncsStat giúp bạn "chốt chặn" tính hợp lệ này ngay từ đầu.`,
                content_en: `In scenario-based experiments, you assign participants to different conditions (e.g., high vs. low price). A manipulation check verifies if participants actually perceived the intended difference. If they failed to notice the price variance, all subsequent data on "Purchase Intention" is invalid. ncsStat secures this vital validity check for you.`
            },
            {
                h2_vi: '2. Kỹ thuật đo lường: Thang đo hay Câu hỏi trực tiếp?',
                h2_en: '2. Measurement Techniques: Scales vs. Direct Questions',
                content_vi: `Có hai cách phổ biến để làm Manipulation Check:
                1. **Câu hỏi định danh**: "Kịch bản bạn vừa đọc mô tả sản phẩm có giá như thế nào?" (Rẻ/Đắt).
                2. **Thang đo Likert**: "Hãy đánh giá mức độ sang trọng của thương hiệu trong kịch bản trên" (1-7 điểm). 
                ncsStat khuyên bạn dùng thang đo Likert để có thể chạy kiểm định T-test hoặc ANOVA, mang lại bằng chứng thống kê mạnh mẽ hơn cho báo cáo của bạn.`,
                content_en: `Two common methods: Nominal questions ("Was the price high or low?") or Likert scales ("Rate the brand's luxury level"). ncsStat recommends Likert scales to allow for T-test or ANOVA confirmation, providing stronger empirical evidence for your experimental success.`
            },
            {
                h2_vi: '3. Phân tích kết quả: T-test và ANOVA lên ngôi',
                h2_en: '3. Analyzing Results: T-test and ANOVA Dominance',
                content_vi: `Để báo cáo Manipulation Check thành công, bạn cần chứng minh giá trị trung bình giữa các nhóm thực nghiệm có sự khác biệt rất lớn (p < .001). 
                ncsStat tự động chạy các phép so sánh này và xuất bảng "Manipulation Success Report". Một chỉ số p-value cực nhỏ ở bước này là "giấy thông hành" để bài nghiên cứu của bạn được các phản biện tin tưởng về mặt phương pháp luận.`,
                content_en: `Successful checks must show significant mean differences across conditions (p < .001). ncsStat automates these comparisons and generates a "Manipulation Success Report." An extremely low p-value here acts as a "passport," gaining reviewer trust in your methodology.`
            },
            {
                h2_vi: '4. Xử lý khi Manipulation Check thất bại: Đừng cố ép số!',
                h2_en: '4. When Checks Fail: Do Not Force the Data!',
                content_vi: `Nếu p > 0.05, nghĩa là kịch bản của bạn không đủ mạnh để người dùng phân biệt. 
                ncsStat tư vấn cho bạn 2 giải pháp: 
                1. **Pilot Study**: Chạy thử trên mẫu nhỏ (N=30) để điều chỉnh kịch bản trước khi thu thập mẫu lớn. 
                2. **Exclude cases**: Loại bỏ những người trả lời sai câu hỏi kiểm tra (Attention check) để làm sạch dữ liệu. Tuy nhiên, việc này cần được giải trình minh bạch trong bài báo.`,
                content_en: `If p > 0.05, your manipulation was too weak. ncsStat advises: 1. Run a Pilot Study (N=30) to refine scenarios before the main wave. 2. Transparently exclude participants who failed attention checks. ncsStat helps you identify these non-compliant cases to protect your experimental integrity.`
            },
            {
                h2_vi: '5. Tính thực tế (Realism) và Sự đắm mình (Immersion)',
                h2_en: '5. Realism and Participant Immersion',
                content_vi: `Ngoài việc kiểm tra xem họ có thấy sự khác biệt không, bạn cần kiểm tra xem kịch bản có giống thực tế (Perceived Realism) không. 
                ncsStat hỗ trợ các thang đo "Realism Check" để bạn khẳng định rằng: "Mặc dù là kịch bản giả định, nhưng người dùng thấy nó rất giống với trải nghiệm mua sắm thực tế của họ". Điều này làm tăng tính tổng quát hóa (External validity) cho nghiên cứu thực nghiệm.`,
                content_en: `Beyond difference, check for Perceived Realism. ncsStat supports "Realism Check" scales to confirm that while the scenario was hypothetical, participants found it reflective of real-world shopping. This boosts your study's external validity—a key requirement for top journals.`
            },
            {
                h2_vi: '6. Trình bày Manipulation Check chuẩn quốc tế trong bài báo',
                h2_en: '6. Professional Reporting of Manipulation Results',
                content_vi: `Mẫu viết: "Kết quả kiểm định kịch bản cho thấy nhóm tiếp xúc với quảng cáo xanh có nhận thức về tính bền vững cao hơn đáng kể so với nhóm đối chứng (M_green = 5.8 vs M_control = 2.4; t = 12.5, p < .001). Điều này khẳng định thực nghiệm đã thành công." ncsStat tự động tạo ra những đoạn văn này, giúp bài báo của bạn đạt chuẩn mực học thuật cao nhất.`,
                content_en: `Standard phrasing: "The manipulation check revealed that the green-ad group perceived significantly higher sustainability than the control group (M_green=5.8 vs M_control=2.4; t=12.5, p<.001), confirming a successful manipulation." ncsStat generates these snippets for seamless academic integration.`
            }
        ]
    },
    'systematic-literature-review-slr': {
        slug: 'systematic-literature-review-slr', category: 'Research Design',
        title_vi: 'SLR: Tổng quan lý thuyết hệ thống chuẩn PRISMA',
        title_en: 'SLR: Systematic Literature Review following PRISMA',
        expert_tip_vi: 'Đừng quên vẽ sơ đồ PRISMA để mô tả quá trình loại bỏ tài liệu. Đây là tiêu chuẩn vàng của SLR.',
        expert_tip_en: 'Always include a PRISMA flow diagram to document your screening process. It is the gold standard for SLRs.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. SLR là gì? Tại sao "Tổng quan" lại là một phương pháp nghiên cứu?',
                h2_en: '1. What is SLR? Why "Review" is a Research Method',
                content_vi: `Systematic Literature Review (SLR) không phải là việc đọc và kể lại vài bài báo. Đây là một quy trình nghiên cứu khoa học, minh bạch và có thể lặp lại để xác định, đánh giá và tổng hợp tất cả các bằng chứng liên quan đến một chủ đề. 
                ncsStat giúp bạn chuyển từ "đọc tự phát" sang "tổng hợp hệ thống", giúp bạn tìm ra các **Khoảng trống nghiên cứu (Research Gaps)** một cách khách quan nhất.`,
                content_en: `SLR is a scientific, transparent, and reproducible process for synthesizing all evidence on a topic. It is far more than a casual summary. ncsStat transitions your workflow from "spontaneous reading" to "systematic synthesis," helping you objectively identify Research Gaps for your dissertation.`
            },
            {
                h2_vi: '2. Tiêu chuẩn PRISMA: "Bản đồ chỉ đường" cho bài báo SLR',
                h2_en: '2. PRISMA Standards: The SLR Roadmap',
                content_vi: `Để bài SLR được đăng trên các tạp chí Q1/Q2, bạn bắt buộc phải tuân thủ hướng dẫn PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses). 
                ncsStat cung cấp checklist PRISMA giúp bạn kiểm soát từ khâu đặt câu hỏi nghiên cứu (PICO), tìm kiếm từ khóa đến khâu trích xuất dữ liệu, đảm bảo bài viết của bạn đạt độ tin cậy tuyệt đối.`,
                content_en: `For Q1/Q2 success, PRISMA compliance is mandatory. ncsStat provides a PRISMA checklist covering everything from PICO research questions to data extraction, ensuring your review meets international rigorous standards.`
            },
            {
                h2_vi: '3. Chiến lược tìm kiếm từ khóa và Lựa chọn Database',
                h2_en: '3. Search Strategy and Database Selection',
                content_vi: `Một bài SLR tốt bắt đầu từ một chuỗi tìm kiếm (Search String) hoàn hảo trên các cơ sở dữ liệu uy tín như Web of Science (WoS), Scopus, hay ScienceDirect. 
                ncsStat hướng dẫn bạn cách kết hợp toán tử Boolean (AND, OR, NOT) và các ký tự đại diện (*) để không bỏ sót bất kỳ bài báo quan trọng nào, tránh hiện tượng "Selection Bias" (sai lệch lựa chọn) làm hỏng tính tổng quát của bài review.`,
                content_en: `Success starts with a perfect Search String on WoS or Scopus. ncsStat guides you in combining Boolean operators (AND, OR) and wildcards (*) to capture all relevant papers, preventing "Selection Bias" from undermining your review's comprehensiveness.`
            },
            {
                h2_vi: '4. Sơ đồ luồng PRISMA: Minh chứng cho sự khắt khe',
                h2_en: '4. PRISMA Flow Diagram: Evidence of Rigor',
                content_vi: `Reviewer muốn thấy chính xác bạn đã loại bao nhiêu bài và vì lý do gì. 
                ncsStat hỗ trợ bạn vẽ sơ đồ luồng PRISMA: từ tổng số bài tìm được (ví dụ 1000 bài), qua các bước lọc tiêu đề, tóm tắt và cuối cùng còn lại các bài "tinh hoa" (ví dụ 50 bài) để phân tích. Đây là biểu đồ quan trọng nhất trong một bài báo SLR.`,
                content_en: `Reviewers need to see exactly how you filtered your sample. ncsStat helps you build the PRISMA Flow Diagram—showing the journey from 1000 initial hits to the final 50 "elite" papers. This visual evidence of rigor is the most important chart in any SLR paper.`
            },
            {
                h2_vi: '5. Đánh giá chất lượng tài liệu (Quality Appraisal)',
                h2_en: '5. Quality Appraisal: Filtering the Best Evidence',
                content_vi: `Không phải bài báo nào cũng có giá trị như nhau. Bạn cần đánh giá chất lượng các bài đã chọn bằng các công cụ như JBI hoặc CASP. 
                ncsStat cung cấp các tiêu chí đánh giá về phương pháp luận, kích thước mẫu và độ tin cậy của kết quả, giúp bạn chỉ trích dẫn những bằng chứng "thép" nhất cho bài nghiên cứu của mình.`,
                content_en: `Not all papers are equal. You must assess quality using tools like JBI or CASP. ncsStat provides appraisal criteria for methodology and sample size, ensuring you only cite the strongest "ironclad" evidence in your final synthesis.`
            },
            {
                h2_vi: '6. Tổng hợp dữ liệu (Data Synthesis) và Phân tích nội dung',
                h2_en: '6. Data Synthesis and Thematic Analysis',
                content_vi: `Sau khi có các bài báo, bạn cần "mổ xẻ" chúng để tìm ra các Themes chung. 
                ncsStat hướng dẫn bạn cách lập bảng tổng hợp (Synthesis Table) bao gồm: Tác giả, Năm, Phương pháp, Biến số chính và Kết quả cốt lõi. Từ bảng này, bạn sẽ nhận diện được các xu hướng (Trends) và các mâu thuẫn (Conflicts) trong lý thuyết hiện tại.`,
                content_en: `After selection, "dissect" the papers for common themes. ncsStat guides you in building a Synthesis Table (Author, Year, Method, Key Variables, Core Findings). From here, you’ll identify trends and theoretical conflicts—the foundation for your own research.`
            },
            {
                h2_vi: '7. Nhận diện Research Gaps: Bàn đạp cho nghiên cứu tương lai',
                h2_en: '7. Identifying Research Gaps: The Dissertation Catalyst',
                content_vi: `Đây là mục tiêu tối thượng của bài SLR. 
                ncsStat giúp bạn phân loại các khoảng trống thành: Khoảng trống lý thuyết (Theory gap), Khoảng trống bối cảnh (Context gap - ví dụ: chưa nghiên cứu tại Việt Nam), và Khoảng trống phương pháp (Method gap). Việc chỉ ra được những gì thế giới "chưa làm" sẽ giúp luận án của bạn trở nên vô giá.`,
                content_en: `The ultimate SLR goal: finding Theory, Context, and Method gaps. Identifying what the world "hasn't done yet"—like a lack of studies in emerging markets—makes your own dissertation invaluable and highly original.`
            }
        ]
    },
    'qualitative-coding-expert-interview': {
        slug: 'qualitative-coding-expert-interview', category: 'Qualitative Research',
        title_vi: 'Mã hóa định tính & Phỏng vấn sâu: Khoa học từ những con chữ',
        title_en: 'Qualitative Coding & In-depth Interviews: The Science of Words',
        expert_tip_vi: 'Hãy sử dụng Mã hóa 3 bước (Open, Axial, Selective) để trích xuất tinh hoa từ nội dung phỏng vấn chuyên gia.',
        expert_tip_en: 'Use 3-step coding (Open, Axial, Selective) to distill essence from expert interview transcripts.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Mã hóa định tính (Qualitative Coding) là gì? Khoa học hóa cảm xúc',
                h2_en: '1. What is Qualitative Coding? Scientizing Subjectivity',
                content_vi: `Phân tích định tính không phải là việc trích dẫn đại vài câu phỏng vấn. Đó là quá trình mã hóa (Coding) để biến hàng trăm trang bản ký âm (Transcripts) thành các cấu trúc lý thuyết có ý nghĩa. 
                Tại ncsStat, chúng tôi giúp bạn thực hiện quy trình này một cách hệ thống, giúp các phát hiện định tính của bạn có sức nặng và độ tin cậy ngang hàng với dữ liệu định lượng.`,
                content_en: `Qualitative analysis isn't just cherry-picking quotes. It’s a systematic coding process that transforms hundreds of transcript pages into meaningful theoretical structures. ncsStat ensures your qualitative findings carry the same weight and rigor as quantitative data.`
            },
            {
                h2_vi: '2. Mã hóa 3 bước: Quy trình chuẩn của Grounded Theory',
                h2_en: '2. The 3-Step Coding Process: Grounded Theory Standard',
                content_vi: `ncsStat hướng dẫn bạn quy trình mã hóa kinh điển:
                1. **Open Coding**: Bóc tách dữ liệu thành các đoạn nhỏ và dán nhãn (Mã hóa mở).
                2. **Axial Coding**: Tìm kiếm mối liên hệ giữa các nhãn để tạo thành các phạm trù (Categories).
                3. **Selective Coding**: Kết nối các phạm trù để hình thành nên mô hình lý thuyết cốt lõi (Core Theme). 
                Quy trình này đảm bảo tính khách quan và chiều sâu cho bài nghiên cứu của bạn.`,
                content_en: `ncsStat guides you through the classic sequence: 1. Open Coding (labeling data segments), 2. Axial Coding (connecting labels into categories), and 3. Selective Coding (integrating categories into a core theory). This ensures your findings are grounded and deeply insightful.`
            },
            {
                h2_vi: '3. Độ tin cậy liên người mã (Inter-coder Reliability - ICR)',
                h2_en: '3. Inter-coder Reliability (ICR): Ensuring Objectivity',
                content_vi: `Một bài nghiên cứu định tính chuẩn Scopus cần có ít nhất 2 người mã hóa độc lập. 
                ncsStat giúp bạn tính toán hệ số **Cohen’s Kappa** hoặc **Percent Agreement** để chứng minh rằng kết quả mã hóa không phải là ý kiến chủ quan của một mình bạn. Chỉ số Kappa > 0.7 là bằng chứng thép cho độ tin cậy của phân tích định tính.`,
                content_en: `Top-tier qualitative research requires independent coders. ncsStat helps you compute Cohen’s Kappa or Percent Agreement to prove your results aren't just subjective opinions. A Kappa > 0.7 provides "ironclad" evidence of analytical reliability for peer reviewers.`
            },
            {
                h2_vi: '4. Sự bão hòa dữ liệu (Data Saturation): Khi nào nên dừng phỏng vấn?',
                h2_en: '4. Data Saturation: When to Stop Interviewing',
                content_vi: `Sai lầm của người mới là phỏng vấn càng nhiều càng tốt. Chuyên gia tập trung vào tính "Bão hòa": khi các cuộc phỏng vấn mới không còn mang lại mã hóa (code) mới nào nữa. 
                ncsStat cung cấp các biểu đồ "Saturation Curve" giúp bạn chứng minh với hội đồng rằng: "Với 15 chuyên gia này, dữ liệu đã bão hòa và việc phỏng vấn thêm là không cần thiết". Đây là cách bảo vệ cỡ mẫu định tính khoa học nhất.`,
                content_en: `Novices interview as many as possible; experts stop at saturation—when new interviews yield no new codes. ncsStat helps you document this "Saturation Curve," providing a scientific justification for your sample size that satisfies even the most skeptical examiners.`
            },
            {
                h2_vi: '5. Phân tích nội dung (Content Analysis) vs. Phân tích chủ đề (Thematic)',
                h2_en: '5. Content Analysis vs. Thematic Analysis',
                content_vi: `ncsStat giúp bạn phân biệt hai kỹ thuật này:
                - **Content Analysis**: Tập trung vào tần suất xuất hiện của từ ngữ (Định tính kết hợp định lượng).
                - **Thematic Analysis**: Tập trung vào việc tìm kiếm các ý nghĩa tiềm ẩn (Latent meanings). 
                Việc chọn đúng phương pháp giúp bài viết của bạn có định hướng rõ ràng và sử dụng thuật ngữ chính xác trong phần "Research Design".`,
                content_en: `ncsStat clarifies the choice: Content Analysis (focusing on word frequency/counts) vs. Thematic Analysis (uncovering latent meanings). Choosing the right label for your methodology ensures clarity and technical accuracy in your research design chapter.`
            },
            {
                h2_vi: '6. Trình bày kết quả định tính chuẩn APA: Đan xen con chữ và lý thuyết',
                h2_en: '6. Professional Qualitative Reporting: Weaving Text and Theory',
                content_vi: `Báo cáo định tính cần sự cân bằng giữa "Lời trích dẫn" (Evidence) và "Lý giải của tác giả" (Interpretation). 
                ncsStat hỗ trợ các mẫu bảng "Theme-Quote Matrix", giúp bạn trình bày các phát hiện một cách khoa học nhất. "Chủ đề 'Sự hoài nghi' được thể hiện rõ qua chia sẻ của Chuyên gia A: 'Tôi không tin vào các nhãn dán xanh nếu không có chứng chỉ đi kèm'". Cách viết này làm cho luận văn của bạn vô cùng thuyết phục và đậm chất học thuật.`,
                content_en: `Great reporting balances raw quotes with author interpretation. ncsStat provides "Theme-Quote Matrix" templates, ensuring your findings are presented with rigor. "The 'Skepticism' theme is evident in Expert A's quote..."—this weaving of evidence and theory makes your dissertation deeply persuasive.`
            }
        ]
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
        { slug: 'data-cleaning-outliers-detection' }, { slug: 'sem-cfa-structural-modeling' },
        { slug: 'common-method-bias-survey-research' }, { slug: 'pls-sem-vs-cb-sem-selection' }, { slug: 'writing-academic-results-apa' },
        { slug: 'cfa-confirmatory-factor-analysis' }, { slug: 'technology-acceptance-model-tam' },
        { slug: 'theory-of-planned-behavior-tpb' }, { slug: 'signaling-theory-research' },
        { slug: 'interaction-effects-moderation' }, { slug: 'manipulation-check-scenario' },
        { slug: 'systematic-literature-review-slr' }, { slug: 'qualitative-coding-expert-interview' }
    ];
}

// Ensure the page stays dynamic even if pre-rendered
export const dynamicParams = true;

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    let article = FALLBACK_ARTICLES[slug] || DEFAULT_ARTICLE;
    
    const supabase = getSupabase();

    if (supabase) {
        try {
            const { data, error } = await supabase.from('knowledge_articles').select('*').eq('slug', slug).single();
            if (data && !error) {
                article = data;
            }
        } catch (e) {
            console.error("Server fetch error - Using Fallback");
        }
    }

    return (
        <ArticleClient 
            initialArticle={article} 
            fallbackArticles={FALLBACK_ARTICLES} 
            slug={slug} 
        />
    );
}
