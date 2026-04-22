-- ncsStat Knowledge Base Massive Update
-- Target: ncskit.org/knowledge
-- Provides high-density academic content for core statistical methods

-- 1. SEM MEGA GUIDE (Long-form)
INSERT INTO knowledge_articles (id, slug, category, title_vi, title_en, icon_name, expert_tip_vi, content_structure)
VALUES (
  gen_random_uuid(),
  'sem-structural-equation-modeling-guide',
  'Advanced Statistics',
  'Mô hình Phương trình Cấu trúc (SEM): Từ Lý thuyết đến Thực thi',
  'Structural Equation Modeling (SEM): From Theory to Execution',
  'Layers',
  'Mẹo từ chuyên gia: Luôn kiểm tra tính đa cộng tuyến và cỡ mẫu (tối thiểu 200) trước khi chạy SEM để đảm bảo mô hình hội tụ.',
  '[
    {
      "h2_vi": "1. Bình minh của Kỷ nguyên SEM: Tại sao không chỉ là Hồi quy?",
      "h2_en": "1. The Dawn of SEM: Why not just Regression?",
      "content_vi": "Mô hình phương trình cấu trúc (SEM) không chỉ là một kỹ thuật thống kê; nó là một triết lý nghiên cứu. Trong khi hồi quy truyền thống chỉ có thể kiểm tra một mối quan hệ duy nhất tại một thời điểm, SEM cho phép chúng ta kiểm tra toàn bộ mạng lưới các mối quan hệ phức tạp, bao gồm cả các biến không quan sát được (latent variables). Bài viết này sẽ dẫn dắt bạn qua hành trình từ những khái niệm ma trận hiệp phương sai cơ bản đến những mô hình SEM đa nhóm phức tạp nhất.",
      "content_en": "SEM is more than a technique; it is a research philosophy. While traditional regression tests single paths, SEM analyzes entire networks of complex relationships, including latent variables."
    },
    {
      "h2_vi": "2. Cấu trúc của một mô hình SEM tiêu chuẩn",
      "h2_en": "2. Anatomy of a Standard SEM Model",
      "content_vi": "Một mô hình SEM thường bao gồm hai thành phần cốt lõi: Mô hình đo lường (Measurement Model) và Mô hình cấu trúc (Structural Model). Mô hình đo lường xác định cách các biến quan sát (indicators) phản ánh các nhân tố tiềm ẩn thông qua Phân tích nhân tố khẳng định (CFA). Mô hình cấu trúc sau đó thiết lập các đường dẫn tác động giữa các nhân tố này. Việc hiểu rõ sự khác biệt này là bước đầu tiên để tránh lỗi ''Identification'' phổ biến.",
      "content_en": "A standard SEM model consists of two core components: the Measurement Model and the Structural Model."
    },
    {
      "h2_vi": "3. Điều kiện tiên quyết: Cỡ mẫu và Dữ liệu",
      "h2_en": "3. Prerequisites: Sample Size and Data",
      "content_vi": "SEM là một kỹ thuật dựa trên mẫu lớn. Quy tắc ngón tay cái thông thường gợi ý tỷ lệ 10:1 hoặc 20:1 (mẫu trên mỗi biến quan sát). Đối với các mô hình phức tạp, cỡ mẫu tối thiểu 200-300 là cần thiết để đạt được độ tin cậy về các chỉ số phù hợp (Fit Indices). ncsStat sử dụng thuật toán tối ưu hóa ML (Maximum Likelihood), đòi hỏi dữ liệu tuân thủ phân phối chuẩn đa biến.",
      "content_en": "SEM is a large-sample technique. A 10:1 or 20:1 ratio of samples to indicators is recommended."
    },
    {
      "h2_vi": "4. Đọc hiểu các chỉ số độ phù hợp (Model Fit Indices)",
      "h2_en": "4. Interpreting Model Fit Indices",
      "content_vi": "Làm thế nào để biết mô hình của bạn khớp với dữ liệu thực tế? Chúng ta nhìn vào Chi-square (thường bị ảnh hưởng bởi mẫu lớn), nhưng quan trọng hơn là RMSEA (nên < 0.06), CFI/TLI (nên > 0.90 hoặc 0.95) và SRMR. Bài viết đi sâu vào ý nghĩa toán học của từng chỉ số và cách ASIG của ncsStat đưa ra các khuyến nghị tự động dựa trên các ngưỡng học thuật của Hu & Bentler (1999).",
      "content_en": "How do you know your model fits? Look at RMSEA, CFI, TLI, and SRMR."
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content_structure = EXCLUDED.content_structure,
    expert_tip_vi = EXCLUDED.expert_tip_vi;

-- 2. PEARSON CORRELATION (Enriched)
UPDATE knowledge_articles 
SET content_structure = '[
    {
      "h2_vi": "1. Bản chất của sự liên kết: Hệ số r",
      "h2_en": "1. The Essence of Linkage: The r Coefficient",
      "content_vi": "Hệ số tương quan Pearson (r) là thước đo sự liên tính tuyến tính giữa hai biến định lượng. Giá trị r nằm trong khoảng từ -1 đến +1. r = +1 biểu thị tương quan thuận hoàn hảo; r = -1 biểu thị tương quan nghịch hoàn hảo; r = 0 biểu thị không có tương quan tuyến tính. Trong nghiên cứu xã hội, một hệ số r > 0.5 thường được coi là một mối liên kết mạnh mẽ.",
      "content_en": "The Pearson correlation coefficient (r) measures the linear association between two quantitative variables, ranging from -1 to +1."
    },
    {
      "h2_vi": "2. Điều kiện tiên quyết và Cạm bẫy",
      "h2_en": "2. Prerequisites and Pitfalls",
      "content_vi": "Trước khi tin tưởng vào kết quả tương quan, dữ liệu của bạn phải thỏa mãn giả định về phân phối chuẩn và tính tuyến tính. Một sai lầm phổ biến là nhầm lẫn giữa tương quan và nhân quả (Correlation is NOT Causation). ncsStat giúp bạn kiểm tra các giả định này thông qua biểu đồ Scatter plot tích hợp sẵn.",
      "content_en": "Correlation is NOT Causation. Always check normality and linearity before interpreting r."
    },
    {
      "h2_vi": "3. Ứng dụng thực tiễn: KOL Reviews và Doanh số",
      "h2_en": "3. Case Study: KOL Reviews vs. Sales",
      "content_vi": "Giả sử bạn có r = 0.68 giữa số lượng Review từ KOL và Doanh số bán hàng. Điều này gợi ý một chiến lược Marketing tập trung vào người ảnh hưởng sẽ có hiệu quả cao. ncsStat sẽ tự động đánh giá mức độ ý nghĩa (p-value) để khẳng định mối quan hệ này không phải do ngẫu nhiên.",
      "content_en": "Practical application of r in digital marketing and sales forecasting."
    }
  ]'::jsonb
WHERE slug = 'pearson-correlation-analysis';
