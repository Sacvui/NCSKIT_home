-- NCSStat Expert Article: UTAUT
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'utaut-model-guide', 
    'Research Models', 
    'Mô hình UTAUT: Sự thống nhất các lý thuyết chấp nhận công nghệ', 
    'UTAUT Model: The Unified Theory of Acceptance and Use of Technology', 
    'UTAUT có khả năng giải thích tới 70% phương sai của ý định. Đừng quên sử dụng các biến điều tiết như Tuổi, Giới tính, Kinh nghiệm.', 
    'UTAUT explains up to 70% of variance. Always include moderators like Age, Gender, and Experience for high-impact results.', 
    $$[
        {"h2_vi":"1. Tại sao UTAUT lại mạnh mẽ hơn TAM?","h2_en":"1. Why UTAUT outshines TAM?","content_vi":"Venkatesh (2003) đã tổng hợp 8 lý thuyết khác nhau để tạo ra UTAUT. Nó bao quát hơn và có độ dự báo cao hơn hẳn các mô hình đơn lẻ.","content_en":"Venkatesh (2003) synthesized 8 theories into UTAUT, offering superior predictive power compared to individual models."},
        {"h2_vi":"2. 4 Nhân tố cốt lõi của UTAUT","h2_en":"2. The 4 Core Determinants","content_vi":"1. Kỳ vọng hiệu quả (Performance Expectancy).\n2. Kỳ vọng nỗ lực (Effort Expectancy).\n3. Ảnh hưởng xã hội (Social Influence).\n4. Điều kiện thuận lợi (Facilitating Conditions).","content_en":"1. Performance Expectancy.\n2. Effort Expectancy.\n3. Social Influence.\n4. Facilitating Conditions."},
        {"h2_vi":"3. Phân tích điều tiết trên ncsStat","h2_en":"3. Moderation Analysis on ncsStat","content_vi":"Sử dụng tính năng so sánh đa nhóm (Multi-group analysis) hoặc hồi quy biến điều tiết để kiểm chứng sự khác biệt theo giới tính hoặc kinh nghiệm.","content_en":"Use Multi-group analysis or moderated regression to verify differences across gender or experience categories."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
