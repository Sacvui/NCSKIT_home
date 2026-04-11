import React from 'react';
import ArticleClient from '@/components/knowledge/ArticleClient';
import { getSupabase } from '@/utils/supabase/client';

// MASTER REPOSITORY (FALLBACK - GUARANTEED UPTIME)
// Using this directly on Server helps SEO and initial render speed
const FALLBACK_ARTICLES: Record<string, any> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha', category: 'Preliminary Analysis',
        title_vi: 'Kiểm định Cronbach\'s Alpha: Cẩm nang chuyên sâu về Độ tin cậy thang đo',
        title_en: 'Cronbach\'s Alpha: A Comprehensive Guide to Scale Reliability',
        expert_tip_vi: 'Chỉ số Alpha cao không phải lúc nào cũng tốt. Nếu α > 0.95, hãy kiểm tra "redundancy" (dư thừa nội dung). Những câu hỏi quá giống nhau sẽ làm hỏng giá trị hội tụ của thang đo.',
        expert_tip_en: "High Alpha isn't always good. If α > 0.95, check for redundancy. Overlapping items can damage your scale's validity.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'Alpha > 0.70 (Standard), Corrected Item-Total Correlation > 0.30',
        content_structure: [{
            h2_vi: '1. Nguồn gốc và Bản chất toán học của Cronbach\'s Alpha', 
            h2_en: '1. Origins and Mathematical Essence',
            content_vi: `Được giới thiệu bởi Lee Cronbach vào năm 1951, hệ số Alpha (α) đã trở thành thước đo phổ biến nhất thế giới để đánh giá độ tin cậy của một thang đo đơn hướng (unidimensional). Về mặt toán học, Cronbach's Alpha không phải là một kiểm định thống kê theo nghĩa thông thường, mà là một hệ số tương quan được hiệu chỉnh để đo lường mức độ nhất quán nội tại (Internal Consistency). Một thang đo tin cậy là thang đo mà các biến quan sát cùng "hợp lực" để đo lường một khái niệm duy nhất mà không bị nhiễu bởi các sai số ngẫu nhiên.

Sâu sắc hơn, Alpha là tỷ lệ giữa phương sai của điểm thực (true score variance) và phương sai của điểm quan sát (observed score variance). Tại ncsStat, chúng tôi nhấn mạnh rằng Alpha là một hàm số của số lượng biến (k) và tương quan trung bình giữa các biến đó. Điều này dẫn đến một nghịch lý quan trọng: nếu bạn hỏi cùng một câu hỏi 20 lần với cách diễn đạt khác nhau, Alpha sẽ tiến tới 1.0, nhưng giá trị thực tiễn và giá trị hội tụ của nghiên cứu sẽ bằng không. Do đó, hiểu rõ bản chất toán học giúp bạn tránh việc "ép" số liệu một cách vô nghĩa để đạt được các con số đẹp mắt.`,
            content_en: `Introduced by Lee Cronbach in 1951, Alpha measures internal consistency. Mathematically, it is the ratio of true score variance to total observed variance. It is driven by the number of items (k) and their average inter-correlation. Be careful: adding more items can artificially inflate Alpha without improving actual scale validity. At ncsStat, we use optimized algorithms to help you distinguish between true reliability and artificial redundancy.`
        }, {
            h2_vi: '2. Các ngưỡng giá trị học thuật: Nunnally vs. Hair et al.', 
            h2_en: '2. Academic Thresholds: Nunnally vs. Hair',
            content_vi: `Việc đánh giá Alpha là "tốt" hay "xấu" thường dựa trên các chuẩn mực kinh điển trong sách giáo khoa thống kê:
- **Ngưỡng 0.70 (Nunnally & Bernstein, 1994)**: Đây là "con số vàng" cho hầu hết các nghiên cứu khoa học xã hội. Một thang đo đạt Alpha trên 0.70 được coi là có độ tin cậy đạt chuẩn để thực hiện các phân tích tiếp theo như EFA hay Hồi quy.
- **Ngưỡng 0.60 (Hair et al., 2010)**: Đối với các nghiên cứu mang tính khám phá (exploratory research) hoặc xây dựng thang đo trong một lĩnh vực hoàn toàn mới, mức 0.60 có thể được chấp nhận nếu có lý luận chặt chẽ và cơ sở lý thuyết vững chắc hỗ trợ.
- **Ngưỡng 0.80 - 0.90**: Thang đo có độ tin cậy rất tốt, thường thấy ở các thang đo chuẩn quốc tế đã qua nhiều lần kiểm định và tinh chỉnh.
- **Vùng nguy hiểm (< 0.60)**: Thang đo không đủ độ tin cậy. Dữ liệu thu thập được chứa quá nhiều sai số đo lường, khiến các kết luận rút ra không còn giá trị khoa học. ncsStat sẽ báo đỏ nếu bạn rơi vào vùng này để cảnh báo rủi ro cho bài nghiên cứu của bạn trước khi quá muộn.`,
            content_en: `0.70 is the standard (Nunnally & Bernstein). 0.60 is acceptable for exploratory work or new field research (Hair et al.). Values above 0.90 are excellent but values above 0.95 might indicate redundancy. If your Alpha is below 0.60, the scale is generally considered unreliable for academic submission. ncsStat highlights these zones using intelligent color coding.`
        }, {
            h2_vi: '3. Corrected Item-Total Correlation: Kẻ gác cổng công lý', 
            h2_en: '3. Corrected Item-Total Correlation: The Internal Gatekeeper',
            content_vi: `Độ tin cậy tổng thể của một thang đo có thể bị "kéo xuống" một cách nghiêm trọng bởi một hoặc hai biến quan sát kém chất lượng. Để tìm ra các "mắt xích yếu" này, các nhà nghiên cứu cần nhìn vào chỉ số **Corrected Item-Total Correlation** (Tương quan biến - tổng hiệu chỉnh). 
- **Tiêu chuẩn học thuật**: Chỉ số này phản ánh mức độ tương quan của biến đó với tổng của các biến còn lại trong cùng nhân tố. Theo Nunnally (1978), chỉ số này phải lớn hơn **0.30**. 
- Nếu < 0.30: Biến đó không đóng góp vào việc đo lường khái niệm chung, nó lạc lõng và gây nhiễu cho thang đo.

**Quy trình loại biến chuyên nghiệp**: Một sai lầm phổ biến là loại bỏ tất cả các biến yếu cùng một lúc. ncsStat khuyến cáo quy trình "loại bỏ gia tăng": Hãy loại biến có tương quan thấp nhất trước, chạy lại kết quả tại ncsStat, và quan sát xem Alpha tổng có tăng lên hay không. Thường thì khi loại một biến "rác", Alpha của các biến còn lại sẽ tăng vọt lên mức đạt chuẩn một cách thần kỳ vì sai số đã được lọc bỏ.`,
            content_en: `Items with correlations below 0.30 with the total scale are statistically "lost" from the construct. Use an incremental deletion process: remove the weakest link first, then re-run the analysis. ncsStat's real-time engine allows you to iterate quickly to find the most robust subset of variables.`
        }, {
            h2_vi: '4. Giả định "Tau-equivalence" và sự hạn chế của Alpha', 
            h2_en: '4. The Tau-equivalence Constraint',
            content_vi: `Một trong những lý do khiến Cronbach's Alpha bị chỉ trích gay gắt trong những năm gần đây là giả định **Tau-equivalence**. Giả định này bắt buộc tất cả các biến quan sát phải đóng góp một trọng số (factor loadings) ngang nhau vào nhân tố mẹ. Tuy nhiên, trong thực tế tâm lý xã hội và hành vi con người, điều này hiếm khi xảy ra một cách hoàn hảo tuyệt đối.
Khi thang đo của bạn vi phạm giả định này, hệ số Alpha sẽ có xu hướng đánh giá thấp (underestimate) độ tin cậy thực sự của thang đo. Nếu bài nghiên cứu của bạn bị phản biện khắt khe về vấn đề này, hãy trình bày thêm hệ số McDonald's Omega mà ncsStat cung cấp. Đây là bằng chứng cho thấy bạn là một nhà nghiên cứu am tường và có sự đầu tư sâu sắc vào phương pháp luận.`,
            content_en: `Alpha assumes that all items contribute equally to the construct (tau-equivalence). If this is violated—as is common in real-world data—Alpha will underestimate true reliability. ncsStat provides both Alpha and Omega to ensure your methodology is bulletproof against modern peer review.`
        }, {
            h2_vi: '5. McDonald\'s Omega (ω): Tiêu chuẩn mới của các tạp chí quốc tế', 
            h2_en: '5. McDonald\'s Omega: The Modern Standard',
            content_vi: `Hệ số Omega (ω) được các học giả hiện đại như McNeish (2018) khuyến nghị mạnh mẽ sử dụng thay thế hoặc ít nhất là song song với Alpha vì nó linh hoạt và chính xác hơn. Ưu điểm vượt trội của Omega bao gồm:
1. Không yêu cầu giả định trọng số bằng nhau (Tau-equivalence) khắt khe.
2. Phản ánh chính xác hơn độ tin cậy dựa trên cấu trúc nhân tố thực tế được trích xuất.
3. Đáng tin cậy hơn hẳn khi xử lý các thang đo có số lượng biến ít (ví dụ các tiểu nhân tố chỉ có 3 biến quan sát).

Tại ncsStat, chúng tôi tự hào cung cấp song song cả hai chỉ số này giúp bài nghiên cứu của bạn đạt tiêu chuẩn xuất bản của các tạp chí quốc tế hàng đầu (Q1/Q2). Việc báo cáo đồng thời cả Alpha và Omega cho thấy sự chuyên nghiệp và cập nhật xu hướng thống kê hiện đại nhất của tác giả.`,
            content_en: `Omega (ω) provides a more accurate reliability estimate by relaxing the strict assumptions of Alpha. Modern researchers (McNeish, 2018) prefer Omega for its robustness. ncsStat reports both figures seamlessly to help you stay ahead of international publishing trends.`
        }, {
            h2_vi: '6. Quy trình 05 bước xử lý khi Alpha thấp tại ncsStat', 
            h2_en: '6. 5-Step Process for Low Alpha Troubleshooting',
            content_vi: `Nếu hệ thống ncsStat báo đỏ kết quả Alpha, đừng hoảng loạn. Hãy thực hiện bình tĩnh theo quy trình chuẩn sau:
1. **Kiểm tra Đảo nhãn (Reverse Coding)**: Kiểm tra lại xem các câu hỏi nội dung "ngược" đã được đảo điểm (1->5 thành 5->1) chưa. Đây là lỗi cơ bản chiếm 80% các trường hợp Alpha âm hoặc cực thấp.
2. **Quan sát Alpha if Item Deleted**: Xác định xem biến nào nếu xóa đi sẽ giúp Alpha của cả nhóm tăng mạnh nhất.
3. **Phân tích nội dung (Qualitative check)**: Đọc lại câu hỏi đó, liệu nó có gây nhầm lẫn về mặt ngôn ngữ hoặc khái niệm cho người trả lời không?
4. **Kiểm tra cỡ mẫu**: Alpha rất nhạy cảm với mẫu quá lẻ hoặc quá nhỏ. Nếu N < 50, chỉ số này thường không ổn định.
5. **Loại bỏ biến (Clean up)**: Nếu đã thử mọi cách không cứu vãn được, hãy mạnh dạn loại bỏ biến đó để làm sạch dữ liệu trước khi thực hiện các phân tích đa biến phức tạp hơn.`,
            content_en: `1. Check reverse coding. 2. Use 'Alpha if Item Deleted' column. 3. Re-read item phrasing for ambiguities. 4. Check N-size (N > 100 preferred). 5. Perform final deletion if the item fails to correlate above 0.3 with the rest of the scale.`
        }, {
            h2_vi: '7. Tương tác chiến thuật giữa Cronbach\'s Alpha và EFA', 
            h2_en: '7. Tactical Interaction between Alpha and Factor Analysis',
            content_vi: `Mối quan hệ giữa Alpha và EFA là mối quan hệ giữa "Sàng lọc thô" và "Thẩm định tinh". 
Bước chạy Alpha đầu tiên giúp bạn loại bỏ những biến hoàn toàn không cùng tần số với tập mẫu, "dọn đường" cho phép xoay nhân tố chính xác hơn. Tuy nhiên, một sai lầm chết người mà ncsStat muốn bạn tránh là tin rằng Alpha cao thì cấu trúc EFA sẽ tự động tốt. Alpha có thể rất cao ngay cả khi các biến thuộc về 2 nhân tố khác nhau (unidimensional violation). Do đó, quy trình chuẩn mực là: Chạy Alpha thô -> Chạy EFA -> Chạy Alpha lại cho TỪNG NHÂN TỐ mới sau khi phân nhóm. Đây mới là cách làm của một chuyên gia phân tích thực thụ.`,
            content_en: `Alpha is for initial screening; EFA is for structural confirmation. High Alpha does not guarantee unidimensionality. Always re-calculate Alpha for each specific factor discovered during EFA to ensure each sub-scale is individually reliable.`
        }, {
            h2_vi: '8. Trình bày kết quả chuyên nghiệp theo chuẩn APA 7', 
            h2_en: '8. Reporting Reliability Results in APA 7 Format',
            content_vi: `Khi trình bày kết quả trong chương 4 của bài nghiên cứu, bạn nên sử dụng văn văn mẫu chuẩn APA sau:
"Kết quả phân tích độ tin cậy cho thấy thang đo [Tên Thang Đo] gồm 5 biến quan sát đạt hệ số Cronbach's Alpha là .84 và hệ số McDonald's Omega là .85. Các hệ số tương quan biến-tổng hiệu chỉnh đều nằm trong mức lý tưởng (.52 đến .74, đều > .30), cho thấy không có dấu hiệu dư thừa hay thiếu hụt nội dung. Thang đo đạt mức độ nhất quán nội tại cao và đủ điều kiện để thực hiện các phân tích kiểm định giả thuyết tiếp theo."

Tại ncsStat, chúng tôi cung cấp các mẫu nhận định học thuật tự động bằng tiếng Việt và tiếng Anh sát với yêu cầu của các Hội đồng chấm luận văn nhất, giúp bạn tiết kiệm thời gian và đảm bảo độ chính xác tuyệt đối trong ngôn ngữ khoa học.`,
            content_en: `Report Alpha, Omega, and the range of item-total correlations. Example: "The scale showed high reliability (α = .84, ω = .85) with all items surpassing the .30 threshold." Use ncsStat's export feature to get pre-formatted APA tables and interpretations directly.`
        }]
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

Việc báo cáo η² giúp bạn khẳng định với hội đồng rằng biến phân loại (ví dụ: Trình độ học vấn) đóng góp bao nhiêu phần vào việc giải thích hành vi khách hàng. ncsStat tính toán chỉ số này tự động cho mọi mô hình ANOVA.`,
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
    'pearson-correlation-analysis': {
        slug: 'pearson-correlation-analysis', category: 'Association Analysis',
        title_vi: 'Tương quan Pearson: Đo lường sức mạnh mối quan hệ tuyến tính',
        title_en: 'Pearson Correlation: Measuring Linear Relationship Strength',
        expert_tip_vi: 'Tương quan không có nghĩa là Nhân quả (Correlation is not Causation). Một hệ số r = 0.8 rất đẹp nhưng có thể do cả hai biến cùng chịu tác động của một biến thứ ba.', 
        expert_tip_en: "Remember: Correlation is not Causation. High correlation might be driven by a lurking third variable.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'r > 0.3 (Medium), r > 0.5 (Strong), Sig. < 0.05',
        content_structure: [{
            h2_vi: '1. Bản chất và Ý nghĩa của Hệ số tương quan Pearson (r)', 
            h2_en: '1. Nature and Meaning of the Pearson Coefficient (r)',
            content_vi: `Hệ số tương quan Pearson (r) là thước đo chuẩn mực để đánh giá mối quan hệ tuyến tính giữa hai biến định lượng. Chỉ số này chạy từ -1 (Nghịch biến hoàn hảo) qua 0 (Không tương quan) đến 1 (Thuận biến hoàn hảo). 

Tại ncsStat, chúng tôi nhấn mạnh rằng tương quan Pearson giúp bạn xác định xem hai biến có "đi cùng nhau" hay không trước khi thực hiện các phép hồi quy nhân quả phức tạp hơn. Một bài nghiên cứu thiếu đi ma trận tương quan sẽ bị coi là thiếu sự thăm dò dữ liệu cơ bản.`,
            content_en: `Pearson's 'r' quantifies the strength and direction of a linear relationship between two continuous variables ranging from -1 to +1. ncsStat displays these associations clearly to help you explore your variables before causal modeling.`
        }, {
            h2_vi: '2. Phân biệt Tương quan thuận và Tương quan nghịch', 
            h2_en: '2. Distinguishing Positive and Negative Associations',
            content_vi: `Dấu của hệ số r cho biết hướng của mối quan hệ:
- **r dương (+)**: Hai biến cùng tăng hoặc cùng giảm (ví dụ: Chăm chỉ học và Điểm số).
- **r âm (-)**: Một biến tăng thì biến kia giảm (ví dụ: Thời gian dùng smartphone và Thị lực).

ncsStat bóc tách hướng tác động này một cách trực quan, giúp bạn nhanh chóng khẳng định các giả thuyết kỳ vọng ban đầu của mình.`,
            content_en: `A positive 'r' means variables rise and fall together; negative means they move in opposite directions. ncsStat highlights the direction of each link to confirm your research hypotheses.`
        }, {
            h2_vi: '3. Ma trận tương quan (Correlation Matrix): Bản đồ quan hệ', 
            h2_en: '3. The Correlation Matrix: Your Relationship Map',
            content_vi: `Đây là bảng tổng hợp tất cả các cặp tương quan trong dữ liệu của bạn. Tại ncsStat, ma trận này được trình bày kèm theo các ký hiệu ý nghĩa thống kê (*) để bạn nhận diện ngay lập tức các mối quan hệ mật thiết. 

Ma trận tương quan cũng là công cụ đầu tiên giúp phát hiện hiện tượng Đa cộng tuyến tiềm ẩn: nếu r > 0.8 giữa hai biến độc lập, bạn cần hết sức thận trọng khi đưa cả hai vào mô hình hồi quy.`,
            content_en: `A correlation matrix provides a bird’s eye view of all bivariate links. ncsStat marks significant correlations with asterisks (*) for fast identification. This matrix is also your first defense against multicollinearity.`
        }, {
            h2_vi: '4. Diễn giải mức độ mạnh yếu của mối quan hệ', 
            h2_en: '4. Interpreting the Strength of Linear Relationships',
            content_vi: `Hệ số r bao nhiêu được coi là "mạnh"? ncsStat áp dụng tiêu chuẩn kinh điển của Cohen (1988):
- **|r| < 0.3**: Tương quan yếu.
- **|r| từ 0.3 đến 0.5**: Tương quan trung bình.
- **|r| > 0.5**: Tương quan mạnh.

Tuy nhiên, trong các nghiên cứu xã hội mang tính phức tạp, ngay cả một tương quan r = 0.2 có ý nghĩa thống kê cũng có thể mang lại những phát hiện quan trọng. ncsStat giúp bạn đánh giá con số này trong bối cảnh thực tế của dữ liệu.`,
            content_en: `Academic standards (Cohen, 1988) define strength as: Weak (<.3), Moderate (.3 to .5), and Strong (>.5). ncsStat provides context to these numbers, ensuring your interpretations match academic rigor.`
        }, {
            h2_vi: '5. Hệ số xác định (R-squared) trong Tương quan', 
            h2_en: '5. Coefficient of Determination (r²) in Correlation',
            content_vi: `Bình phương hệ số tương quan (r²) cho biết bao nhiêu phần trăm sự biến thiên của biến này được giải thích bởi biến kia. Ví dụ, nếu r = 0.5, thì r² = 0.25 (25%). Điều này có nghĩa là biến A giải thích được 25% biến thiên của biến B. ncsStat tự động tính toán chỉ số này để bạn thấy được mức độ quan trọng thực tế của mối quan hệ, thay vì chỉ nhìn vào con số r đơn thuần.`,
            content_en: `Squaring the 'r' value gives you the shared variance (r²). It’s a measure of how much one variable overlaps with another. ncsStat calculates this for every significant link to clarify the impact size.`
        }, {
            h2_vi: '6. Biểu đồ Scatter Plot: Nhìn thấu cấu trúc tương quan', 
            h2_en: '6. Scatter Plots: Visualizing Causal Candidates',
            content_vi: `ncsStat xuất bản các biểu đồ Scatter chuẩn đẹp, kèm theo đường thẳng hồi quy (Regression Line). Biểu đồ này giúp bạn phát hiện:
1. Mối quan hệ đó có thực sự tuyến tính không?
2. Có xuất hiện các giá trị ngoại lai (Outliers) làm sai lệch r không?
3. Dữ liệu có bị hiện tượng biến thiên phương sai thay đổi (Heteroscedasticity) không?

Hình ảnh luôn có giá trị thuyết phục hơn ngàn lời nói trong báo cáo khoa học.`,
            content_en: `Charts like Scatter Plots reveal outliers and non-linear patterns that numbers hide. ncsStat generates these visuals with best-fit lines to prepare your data for regression modeling.`
        }, {
            h2_vi: '7. Spearman\'s Rho: Khi dữ liệu không hoàn hảo', 
            h2_en: '7. Spearman’s Rho: Robust Correlation for Ordinal Data',
            content_vi: `Nếu dữ liệu của bạn là biến thứ bậc (ví dụ: Thứ hạng) hoặc vi phạm nặng nề tính phân phối chuẩn, hệ số Pearson sẽ không còn chính xác. ncsStat cung cấp phương án **Spearman\'s Rho** thay thế. 

Hệ số này đánh giá mối liên hệ dựa trên thứ hạng, giúp kết quả của bạn ổn định và đáng tin cậy hơn trước các nhiễu từ dữ liệu không chuẩn.`,
            content_en: `When normality fails or data is ordinal, Spearman’s Rho is the standard choice. It calculates correlation based on ranks rather than values. ncsStat automatically recommends this if your variables cross non-normal thresholds.`
        }, {
            h2_vi: '8. Trình bày Ma trận tương quan chuẩn APA 7', 
            h2_en: '8. Reporting Correlation Matrices in APA 7 Style',
            content_vi: `Báo cáo phân tích tương quan cần có một ma trận tam giác (thường là tam giác dưới) để tránh lặp lại thông tin.
"Kết quả phân tích tương quan Pearson cho thấy các biến độc lập đều có mối tương quan thuận có ý nghĩa thống kê với biến phụ thuộc (r từ .35 đến .68, p < .01). Đồng thời, các tương quan giữa các biến độc lập đều < .80, cho thấy mô hình không có dấu hiệu đa cộng tuyến nghiêm trọng."

 ncsStat cung cấp tính năng xuất bảng đúng định dạng APA để bạn chèn trực tiếp vào luận văn của mình.`,
            content_en: `APA style requires a lower triangular matrix with Means, SDs, and asterisks for p-values. ncsStat’s exports are fully compliant with these standards, ensuring your work is ready for immediate academic submission.`
        }]
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
        }, {
            h2_vi: '8. Ghi nhật ký (Log) làm sạch dữ liệu cho Phản biện', 
            h2_en: '8. Logging Evidence of Data Purification',
            content_vi: `Trong báo cáo khoa học, bạn phải giải thích bạn đã làm sạch dữ liệu thế nào. 
"Từ 300 mẫu thô, sau khi kiểm tra khoảng cách Mahalanobis (p < .001) và Straight-lining, chúng tôi đã loại bỏ 12 mẫu không hợp lệ. Tập dữ liệu cuối cùng đưa vào phân tích là 288 mẫu đạt chuẩn."

 ncsStat tự động xuất ra nhật ký làm sạch để bạn minh bạch hóa quy trình nghiên cứu của mình.`,
            content_en: `Transparency in data cleaning is a hallmark of good science. ncsStat generates a summary of your purification process, such as IDs removed and methods used, which you can include in your 'Methodology' section.`
        }]
    },
    'sem-cfa-structural-modeling': {
        slug: 'sem-cfa-structural-modeling', category: 'Factor Analysis',
        title_vi: 'Mô hình cấu trúc SEM và CFA: Đỉnh cao của Phân tích định lượng',
        title_en: 'SEM & CFA: The Pinnacle of Structural Equation Modeling',
        expert_tip_vi: 'Nếu chỉ số Model Fit không đạt, hãy nhìn vào Modification Indices (MI). Việc nối các sai số (residuals) có thể cải thiện Fit nhưng phải có cơ sở lý thuyết vững chắc.', 
        expert_tip_en: "If Model Fit is low, check the Modification Indices (MI). Covarying residuals can improve fit but must be theoretically justified.",
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        thresholds: 'CFI/TLI > 0.90, RMSEA/SRMR < 0.08',
        content_structure: [{
            h2_vi: '1. CFA và SEM khác gì so với EFA và Hồi quy?', 
            h2_en: '1. CFA & SEM vs. EFA & Regression: The Key Differences',
            content_vi: `Trong khi EFA là "khám phá" cấu trúc, thì CFA (Confirmatory Factor Analysis) là "khẳng định" cấu trúc đó dựa trên lý thuyết đã có. SEM (Structural Equation Modeling) là bước tiến hóa, cho phép kiểm định đồng thời nhiều mối quan hệ nhân quả phức tạp giữa các biến tiềm ẩn cùng một lúc. ncsStat sử dụng engine Lavaan chuẩn quốc tế để thực hiện các phép tính SEM/CFA hiện đại nhất hiện nay.`,
            content_en: `CFA confirms existing theories while SEM tests complex causal chains involving multiple latent constructs. Unlike basic regression, SEM accounts for measurement error, providing more accurate parameter estimates. ncsStat uses the industry-standard Lavaan engine for these analyses.`
        }, {
            h2_vi: '2. Đánh giá độ phù hợp của mô hình (Model Fit Indices)', 
            h2_en: '2. Master Model Fit Indices: CFI, TLI, RMSEA, SRMR',
            content_vi: `Không giống hồi quy chỉ nhìn vào R-square, SEM đòi hỏi một bộ chỉ số Fit để xem mô hình lý thuyết có khớp với dữ liệu thực tế không:
- **CFI/TLI > 0.90**: Mô hình đạt độ phù hợp tốt.
- **RMSEA < 0.08**: Sai số xấp xỉ trong mức chấp nhận được.
- **SRMR < 0.08**: Sai số dư đạt yêu cầu.

ncsStat trình bày các chỉ số này một cách rõ ràng kèm theo đánh giá "Đạt" hay "Không đạt" theo các chuẩn mực học thuật mới nhất.`,
            content_en: `SEM models are judged by their fit to reality. You need CFI/TLI > 0.90 and RMSEA/SRMR < 0.08. ncsStat presents these indices in a clear dashboard, highlighting whether your model meets international publishing standards.`
        }, {
            h2_vi: '3. Giá trị hội tụ (AVE) và Độ tin cậy tổng hợp (CR)', 
            h2_en: '3. Convergent Validity: AVE & Composite Reliability (CR)',
            content_vi: `Trong CFA, Cronbach's Alpha là không đủ. Bạn cần tính:
- **CR (Composite Reliability) > 0.7**: Độ tin cậy tổng hợp cao.
- **AVE (Average Variance Extracted) > 0.5**: Biến tiềm ẩn giải thích được hơn 50% biến thiên của các biến quan sát.

ncsStat tự động tính toán AVE và CR cho từng nhân tố, giúp bạn khẳng định giá trị hội tụ của thang đo một cách mạnh mẽ nhất.`,
            content_en: `In the SEM world, CR and AVE are the kings of reliability and validity. CR should exceed 0.7 and AVE should be over 0.5. ncsStat automates these complex calculations, saving you from tedious manual formulas.`
        }, {
            h2_vi: '4. Kiểm định Tính phân biệt qua tiêu chuẩn Fornell-Larcker', 
            h2_en: '4. Discriminant Validity: The Fornell-Larcker Criterion',
            content_vi: `Để chứng minh các nhân tố là khác biệt hoàn toàn, căn bậc hai của AVE phải lớn hơn tương quan giữa các nhân tố đó. ncsStat thực hiện phép so sánh này tự động, cung cấp bảng ma trận phân biệt chuẩn mực, giúp bạn vượt qua các vòng phản biện khắt khe về tính độc bản của các khái niệm nghiên cứu.`,
            content_en: `Discriminant validity ensures your constructs aren't redundant. Square root of AVE must outperform inter-construct correlations. ncsStat builds the Fornell-Larcker matrix automatically to validate your research model's uniqueness.`
        }, {
            h2_vi: '5. Ước lượng mô hình cấu trúc (Path Analysis) trong SEM', 
            h2_en: '5. Structural Model Estimation and Path Coefficients',
            content_vi: `Sau khi mô hình đo lường đạt chuẩn, chúng ta tiến hành chạy mô hình cấu trúc để kiểm định các giả thuyết H1, H2... ncsStat cung cấp các hệ số Beta, giá trị t-value và p-value cho từng đường dẫn. 

Chúng tôi cũng hỗ trợ tính năng tính toán tác động trực tiếp, gián tiếp và tổng hợp trong các mô hình phức tạp có nhiều biến trung gian lồng nhau.`,
            content_en: `Once measurement is solid, you test your hypotheses. ncsStat provides comprehensive path coefficients, highlighting significant relationships in bold and calculating complex indirect effects in multi-stage models.`
        }, {
            h2_vi: '6. Xử lý khi Model Fit không đạt: Modification Indices (MI)', 
            h2_en: '6. Using Modification Indices (MI) to Improve Fit',
            content_vi: `Nếu mô hình của bạn "xấu", ncsStat sẽ cung cấp bảng MI gợi ý các mối liên kết tiềm năng để giảm chỉ số Chi-square. Tuy nhiên, chúng tôi luôn cảnh báo bạn: chỉ thực hiện các hiệu chỉnh MI khi có cơ sở lý thuyết mạnh mẽ hỗ trợ, tránh việc "ép" mô hình chạy theo số liệu một cách vô hồn.`,
            content_en: `Low fit isn't the end. Modification Indices suggest paths to improve your results. ncsStat provides these suggestions but advises academic caution—only link residuals if theory allows, not just for higher numbers.`
        }, {
            h2_vi: '7. So sánh mô hình (Model Comparison) và Tính bất biến (Invariance)', 
            h2_en: '7. Model Comparison and Group Invariance Analysis',
            content_vi: `ncsStat hỗ trợ so sánh các mô hình khác nhau (ví dụ: Mô hình tới hạn vs Mô hình lý thuyết) qua chỉ số Δχ². Chúng tôi cũng cung cấp các phép thử tính bất biến đa nhóm (Multi-group SEM) để xem mô hình của bạn có giữ nguyên giá trị khi áp dụng cho các nhóm đối tượng khác nhau (ví dụ: Nam vs Nữ) hay không.`,
            content_en: `Does your model work for everyone? Multi-group SEM tests for invariance across categories. ncsStat’s advanced module allows you to compare structural models and ensure your findings are universally applicable.`
        }, {
            h2_vi: '8. Trình bày biểu đồ SEM chuyên nghiệp chuẩn quốc tế', 
            h2_en: '8. Exporting International-Standard SEM Diagrams',
            content_vi: `Một báo cáo SEM không thể thiếu sơ đồ đường dẫn với đầy đủ các chỉ số sai số và hệ số tải. ncsStat tích hợp tính năng vẽ diagram tự động, cho phép bạn xuất ra các hình ảnh vector chất lượng cao, giúp bài nghiên cứu của bạn đạt tiêu chuẩn trình bày của các tạp chí Q1 hàng đầu thế giới.`,
            content_en: `Professional SEM reporting requires high-quality diagrams showing errors and paths. ncsStat generates detailed, vector-ready visual models that meet the strictest requirements of top-tier academic journals.`
        }]
    },
    'technology-acceptance-model-tam': {
        slug: 'technology-acceptance-model-tam', category: 'Research Models',
        title_vi: 'Mô hình Chấp nhận Công nghệ (TAM): Hỗ trợ Chuyên sâu từ A-Z',
        title_en: 'Technology Acceptance Model (TAM): The Ultimate Guide',
        expert_tip_vi: 'Đừng chỉ dừng lại ở mô hình gốc năm 1989. Để đạt chuẩn Scopus/ISI, hãy tích hợp TAM với Trust hoặc Rủi ro cảm nhận.',
        expert_tip_en: 'For Scopus/ISI standards, integrate TAM with Trust or Perceived Risk.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            { h2_vi: '1. Nguồn gốc của TAM', h2_en: '1. Origins of TAM', content_vi: 'Mô hình TAM (Davis, 1989) giải thích lý do tại sao người dùng chấp nhận công nghệ mới dựa trên PU và PEOU.', content_en: 'TAM explains tech adoption based on PU and PEOU.' },
            { h2_vi: '2. Các biến số cốt lõi', h2_en: '2. Core Variables', content_vi: 'PU (Hữu ích cảm nhận) và PEOU (Dễ sử dụng cảm nhận) là hai chân kiềng của mô hình.', content_en: 'PU and PEOU are the two pillars of the model.' }
        ]
    },
    'theory-of-planned-behavior-tpb': {
        slug: 'theory-of-planned-behavior-tpb', category: 'Behavioral Research',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Giải mã Ý định',
        title_en: 'Theory of Planned Behavior (TPB): Decoding Intentions',
        expert_tip_vi: 'PBC là điểm khác biệt lớn nhất giữa TRA và TPB. Đừng quên đưa nó vào như một biến điều tiết.',
        expert_tip_en: 'PBC is the main difference between TRA and TPB.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            { h2_vi: '1. Cấu trúc TPB', h2_en: '1. TPB Structure', content_vi: 'TPB bao gồm Thái độ, Chuẩn chủ quan và Kiểm soát hành vi cảm nhận (PBC).', content_en: 'TPB includes Attitude, Subjective Norms, and PBC.' }
        ]
    },
    'signaling-theory-research': {
        slug: 'signaling-theory-research', category: 'Market Strategy',
        title_vi: 'Lý thuyết Tín hiệu (Signaling Theory): Khi hành động lên tiếng',
        title_en: 'Signaling Theory: Actions Speak Louder Than Words',
        expert_tip_vi: 'Tín hiệu chỉ có giá trị khi nó tốn kém để thực hiện (Costly signaling).',
        expert_tip_en: 'A signal is only valuable if it is costly to implement.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            { h2_vi: '1. Cơ chế Tín hiệu', h2_en: '1. Signaling Mechanism', content_vi: 'Lý thuyết này giải thích cách người bán truyền tải thông tin về chất lượng cho người mua.', content_en: 'This theory explains quality signaling from sellers to buyers.' }
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
                Ngược lại, PLS-SEM (như SmartPLS) tập trung vào việc **giải thích phương sai** của các biến phụ thuộc. Nói cách khác, nếu bạn muốn biết các biến độc lập "dự báo" được bao nhiêu phần trăm hành vi của khách hàng, PLS-SEM là vũ khí tối thượng. Tại ncsStat, chúng tôi giúp bạn định hướng đúng mục tiêu này ngay từ bước đầu tiên.`,
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
        { slug: 'common-method-bias-survey-research' }, { slug: 'pls-sem-vs-cb-sem-selection' }, { slug: 'writing-academic-results-apa' }
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
