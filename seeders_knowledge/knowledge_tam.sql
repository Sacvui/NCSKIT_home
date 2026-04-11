-- NCSStat Expert Article: TAM
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'technology-acceptance-model-tam', 
    'Research Models', 
    'Mô hình TAM: Hướng dẫn ứng dụng và Phân tích chuyên sâu', 
    'Technology Acceptance Model (TAM): Implementation Guide', 
    'Đừng chỉ dùng PU và PEOU thuần túy. Hãy tích hợp thêm Niềm tin (Trust) hoặc Tính di động (Mobility) để tăng tính mới cho bài báo.', 
    'Beyond PU/PEOU, integrate Trust or Mobility to enhance research novelty for Scopus publication.', 
    $$[
        {"h2_vi":"1. Tổng quan về Mô hình TAM (Davis, 1989)","h2_en":"1. Overview of TAM","content_vi":"TAM là mô hình phổ biến nhất để giải thích hành vi chấp nhận công nghệ. Nó tập trung vào hai yếu tố chính: Sự hữu ích cảm nhận (PU) và Sự dễ sử dụng cảm nhận (PEOU).","content_en":"TAM explains technology adoption through two pillars: Perceived Usefulness (PU) and Perceived Ease of Use (PEOU)."},
        {"h2_vi":"2. Phân tích chi tiết các biến quan sát","h2_en":"2. Item Analysis","content_vi":"- PU: Mức độ người dùng tin rằng công nghệ giúp tăng hiệu quả công việc.\n- PEOU: Mức độ người dùng cảm thấy việc sử dụng công nghệ là không tốn nhiều nỗ lực.","content_en":"- PU: Efficiency gains.\n- PEOU: Effortlessness of use."},
        {"h2_vi":"3. Quy trình chạy trên ncsStat","h2_en":"3. ncsStat Workflow","content_vi":"Chạy Cronbach's Alpha -> EFA -> Hồi quy hoặc SEM để kiểm định các giả thuyết nối từ PEOU sang PU và từ cả hai sang Ý định sử dụng.","content_en":"Run Alpha -> EFA -> Regression/SEM to test paths from PEOU to PU and Intention."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
