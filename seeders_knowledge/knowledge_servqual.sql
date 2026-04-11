-- NCSStat Expert Article: SERVQUAL
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'servqual-service-quality', 
    'Service Management', 
    'Mô hình SERVQUAL: Đo lường chất lượng dịch vụ chuyên sâu', 
    'SERVQUAL Model: Measuring Service Quality Professionally', 
    'Hãy đo lường khoảng cách giữa Kỳ vọng và Cảm nhận. Nếu cảm nhận < kỳ vọng, doanh nghiệp của bạn đang gặp vấn đề nghiêm trọng.', 
    'Gap analysis between Expectations and Perceptions is key. If Perception < Expectation, service quality is failing.', 
    $$[
        {"h2_vi":"1. 5 Kích thước của Chất lượng dịch vụ","h2_en":"1. The 5 Dimensions of Service Quality","content_vi":"- Tin cậy (Reliability).\n- Đáp ứng (Responsiveness).\n- Năng lực phục vụ (Assurance).\n- Đồng cảm (Empathy).\n- Hữu hình (Tangibles).","content_en":"- Reliability.\n- Responsiveness.\n- Assurance.\n- Empathy.\n- Tangibles."},
        {"h2_vi":"2. Cách thiết kế bảng hỏi SERVQUAL","h2_en":"2. Designing SERVQUAL Survey","content_vi":"Thường sử dụng thang đo Likert 5 hoặc 7 điểm với các bộ câu hỏi kép cho cả kỳ vọng và trải nghiệm thực tế.","content_en":"Uses 5 or 7-point Likert scales with paired questions for both expectations and actual experiences."},
        {"h2_vi":"3. Phân tích kết quả trên ncsStat","h2_en":"3. Analyzing Results on ncsStat","content_vi":"Sử dụng thống kê mô tả để tìm ra các 'khoảng cách' (gaps) lớn nhất trong 5 kích thước để ưu tiên cải thiện.","content_en":"Use descriptive statistics to identify the largest gaps across the 5 dimensions to prioritize improvements."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
