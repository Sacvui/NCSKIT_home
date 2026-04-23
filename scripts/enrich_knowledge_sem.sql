-- ncsStat Knowledge Enrichment: SEM Mega-Guide
-- Objective: Detailed 5000-word equivalent structured content for SEM article

-- First, ensure the SEM article exists or update it
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
      "content_en": "SEM is more than a technique; it is a research philosophy. While traditional regression tests single paths, SEM analyzes entire networks of complex relationships."
    },
    {
      "h2_vi": "2. Quy trình 5 bước của một phân tích SEM chuẩn mực",
      "h2_en": "2. The 5-Step Process of SEM Analysis",
      "content_vi": "Để thực hiện SEM thành công, nhà nghiên cứu cần tuân thủ 5 giai đoạn: (1) Đặc điểm hóa mô hình dựa trên lý thuyết, (2) Nhận diện mô hình (Identification), (3) Ước lượng tham số, (4) Đánh giá độ phù hợp và (5) Hiệu chỉnh mô hình. Chúng tôi sẽ đi sâu vào từng bước để đảm bảo kết quả của bạn đạt chuẩn công bố quốc tế.",
      "content_en": "A rigorous SEM analysis involves: Specification, Identification, Estimation, Evaluation, and Modification."
    },
    {
      "h2_vi": "3. Vấn đề Định danh (Model Identification): Chìa khóa để chạy được kết quả",
      "h2_en": "3. Model Identification: The Key to Results",
      "content_vi": "Bạn có đủ thông tin để giải các phương trình không? Một mô hình chỉ có thể được ước lượng khi nó được Định danh đầy đủ (Just-identified hoặc Over-identified). Chúng tôi hướng dẫn cách tính Bậc tự do (df) và các quy tắc gán nhãn cho các biến tiềm ẩn để tránh lỗi ''Under-identified'' khiến phần mềm không thể xuất kết quả.",
      "content_en": "Is your model solvable? We explain Degrees of Freedom and rules for identifying latent variables to avoid under-identification errors."
    },
    {
      "h2_vi": "4. Đọc hiểu các chỉ số độ phù hợp (Model Fit Indices)",
      "h2_en": "4. Interpreting Model Fit Indices",
      "content_vi": "Làm thế nào để biết mô hình của bạn khớp với dữ liệu thực tế? Chúng ta nhìn vào Chi-square, nhưng quan trọng hơn là RMSEA (nên < 0.06), CFI/TLI (nên > 0.90 hoặc 0.95) và SRMR. ncsStat tự động so sánh các chỉ số này với các ngưỡng học thuật của Hu & Bentler (1999) để đưa ra kết luận chính xác nhất.",
      "content_en": "How do you know your model fits? Look at RMSEA, CFI, TLI, and SRMR based on Hu & Bentler (1999) thresholds."
    },
    {
      "h2_vi": "5. Báo cáo kết quả SEM theo chuẩn APA 7",
      "h2_en": "5. Reporting SEM Results (APA 7 Standard)",
      "content_vi": "Việc trình bày kết quả SEM đòi hỏi sự tỉ mỉ. Bạn cần cung cấp Ma trận hiệp phương sai, các hệ số hồi quy chuẩn hóa, sai số chuẩn và các chỉ số phù hợp mô hình. ncsStat cung cấp tính năng xuất bảng biểu chuẩn APA giúp bạn tiết kiệm hàng giờ định dạng thủ công.",
      "content_en": "Presenting SEM results requires detail. We provide APA-standard tables for coefficients, standard errors, and fit indices."
    },
    {
      "h2_vi": "6. Thế giới của PLS-SEM: Sức mạnh dự báo và Sự linh hoạt",
      "h2_en": "6. The World of PLS-SEM: Predictive Power and Flexibility",
      "content_vi": "Bên cạnh CB-SEM truyền thống, ncsStat tích hợp bộ máy PLS-SEM (Partial Least Squares) đẳng cấp như SmartPLS 4. PLS-SEM không dựa trên ma trận hiệp phương sai mà tập trung vào tối đa hóa biến thiên được giải thích. \n\nChúng tôi hướng dẫn bạn cách đánh giá mô hình đo lường qua HTMT, Fornell-Larcker và mô hình cấu trúc qua Bootstrapping (5000 mẫu) để lấy P-value. Đặc biệt, quy trình Blindfolding giúp bạn tính toán chỉ số Q², khẳng định giá trị dự báo thực tiễn của mô hình. Đây là công cụ không thể thiếu cho các nghiên cứu về Marketing và Quản trị kinh doanh hiện đại.",
      "content_en": "ncsStat integrates professional PLS-SEM (seminr), offering HTMT, Fornell-Larcker, Bootstrapping, and Blindfolding (Q2) for predictive research."
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content_structure = EXCLUDED.content_structure,
    expert_tip_vi = EXCLUDED.expert_tip_vi;
