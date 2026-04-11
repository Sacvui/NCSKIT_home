-- NCSStat Expert Article: CFA
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'cfa-confirmatory-factor-analysis', 
    'Advanced Statistics', 
    'CFA: Phân tích nhân tố khẳng định và Giá trị hội tụ', 
    'Confirmatory Factor Analysis (CFA): Validity and Reliability', 
    'CFA không chỉ là EFA nâng cao. Nó dùng để khẳng định mô hình lý thuyết. Hãy chú ý các chỉ số CR (Hệ số tin cậy tổng hợp) và AVE (Phương sai trích trung bình).', 
    'CFA isn''t just advanced EFA; it confirms theoretical models. Focus on CR (Composite Reliability) and AVE (Average Variance Extracted).', 
    $$[
        {"h2_vi":"1. Sự khác biệt giữa EFA và CFA","h2_en":"1. EFA vs. CFA Differences","content_vi":"EFA là để khám phá xem biến nào thuộc nhân tố nào. CFA là để khẳng định xem các biến đó có thực sự thuộc nhân tố đó như lý thuyết đã nói hay không.","content_en":"EFA explores structure; CFA confirms it based on pre-established theory."},
        {"h2_vi":"2. Các chỉ số độ phù hợp (Model Fit)","h2_en":"2. Model Fit Indices","content_vi":"CFI, TLI >= 0.9; RMSEA <= 0.08; GFI >= 0.9. Đây là các 'gác cổng' cho một mô hình CFA chuẩn quốc tế.","content_en":"CFI, TLI >= 0.9; RMSEA <= 0.08; GFI >= 0.9 are the benchmarks for model validity."},
        {"h2_vi":"3. Kiểm định Giá trị hội tụ và Giá trị phân biệt","h2_en":"3. Convergent and Discriminant Validity","content_vi":"Sử dụng AVE (phải > 0.5) và CR (phải > 0.7) để chứng minh các thang đo của bạn đạt chuẩn khoa học.","content_en":"AVE must exceed 0.5 and CR must exceed 0.7 to ensure scale scientific validity."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
