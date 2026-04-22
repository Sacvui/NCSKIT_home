-- ncsStat Knowledge Enrichment: CFA Mega-Guide
-- Objective: Detailed structured content for CFA article

INSERT INTO knowledge_articles (id, slug, category, title_vi, title_en, icon_name, expert_tip_vi, content_structure)
VALUES (
  gen_random_uuid(),
  'cfa-confirmatory-factor-analysis-guide',
  'Advanced Statistics',
  'Phân tích Nhân tố Khẳng định (CFA): Nền tảng của Phép đo lường',
  'Confirmatory Factor Analysis (CFA): The Foundation of Measurement',
  'Target',
  'Mẹo từ chuyên gia: Luôn báo cáo giá trị hội tụ (AVE) và độ phân biệt (CR) trước khi chuyển sang mô hình cấu trúc SEM.',
  '[
    {
      "h2_vi": "1. EFA vs CFA: Khi nào thì cần Khẳng định?",
      "h2_en": "1. EFA vs CFA: When to Confirm?",
      "content_vi": "Khác với Phân tích nhân tố khám phá (EFA) dùng để tìm kiếm cấu trúc tiềm ẩn, CFA được dùng để kiểm tra xem cấu trúc đó có thực sự tồn tại như lý thuyết dự đoán hay không. CFA là bước bắt buộc trong quy trình hai bước của Anderson & Gerbing (1988) để đảm bảo mô hình đo lường của bạn đạt yêu cầu trước khi kiểm tra các giả thuyết cấu trúc.",
      "content_en": "Unlike EFA which explores structure, CFA tests if a pre-defined theoretical structure holds true. It is a mandatory step in the two-step SEM approach."
    },
    {
      "h2_vi": "2. Đánh giá Giá trị Hội tụ (Convergent Validity)",
      "h2_en": "2. Assessing Convergent Validity",
      "content_vi": "Làm thế nào để biết các biến quan sát thực sự đo lường cùng một nhân tố? Chúng ta dựa vào Hệ số tải nhân tố chuẩn hóa (nên > 0.5, lý tưởng > 0.7), Độ tin cậy tổng hợp (CR > 0.7) và Phương sai trích trung bình (AVE > 0.5). Bài viết này giải thích tại sao AVE lại là chỉ số vàng để khẳng định tính hội tụ của thang đo.",
      "content_en": "We use Factor Loadings (>0.5), Composite Reliability (CR > 0.7), and Average Variance Extracted (AVE > 0.5) to confirm constructs converge."
    },
    {
      "h2_vi": "3. Giá trị Phân biệt (Discriminant Validity): Quy tắc Fornell-Larcker",
      "h2_en": "3. Discriminant Validity: The Fornell-Larcker Criterion",
      "content_vi": "Hai nhân tố khác nhau có thực sự phân biệt với nhau không? Quy tắc Fornell-Larcker yêu cầu căn bậc hai của AVE phải lớn hơn tương quan giữa các nhân tố đó. Ngoài ra, ncsStat còn hỗ trợ chỉ số HTMT (Heterotrait-Monotrait ratio) hiện đại để phát hiện sự thiếu hụt giá trị phân biệt chính xác hơn.",
      "content_en": "Discriminant validity ensures constructs are unique. We support Fornell-Larcker and modern HTMT ratios for precise detection."
    },
    {
      "h2_vi": "4. Chỉ số Model Fit trong CFA",
      "h2_en": "4. Model Fit Indices in CFA",
      "content_vi": "Tương tự như SEM, CFA đòi hỏi các chỉ số phù hợp như CMIN/df, GFI, CFI và RMSEA. Chúng tôi hướng dẫn cách đọc các chỉ số này và cách xử lý khi mô hình đo lường không đạt yêu cầu thông qua các chỉ số hiệu chỉnh (Modification Indices - MI).",
      "content_en": "CFA requires fit indices like CMIN/df, GFI, CFI, and RMSEA. We guide you through interpreting and improving these via Modification Indices."
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content_structure = EXCLUDED.content_structure,
    expert_tip_vi = EXCLUDED.expert_tip_vi;
