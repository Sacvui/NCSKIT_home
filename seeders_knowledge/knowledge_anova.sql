-- NCSStat Expert Article: ANOVA
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'anova-analysis-of-variance', 
    'Difference Analysis', 
    'ANOVA: Phân tích phương sai và So sánh đa nhóm', 
    'ANOVA: Analysis of Variance and Multi-group Comparison', 
    'Nếu kết quả Anova có ý nghĩa (Sig < 0.05), bạn bắt buộc phải chạy Post-hoc (như Tukey hoặc Scheffe) để biết chính xác nhóm nào khác nhóm nào.', 
    'If ANOVA is significant (Sig < 0.05), you must run Post-hoc tests (Tukey/Scheffe) to identify specific group differences.', 
    $$[
        {"h2_vi":"1. Khi nào thì dùng ANOVA thay vì T-Test?","h2_en":"1. ANOVA vs. T-Test","content_vi":"Dùng T-test khi so sánh 2 nhóm (Nam/Nữ). Dùng ANOVA khi bạn có từ 3 nhóm trở lên (Vd: SV năm 1, năm 2, năm 3, năm 4).","content_en":"Use T-Test for 2 groups; use ANOVA for 3 or more groups (e.g., Year 1, 2, 3, 4 students)."},
        {"h2_vi":"2. Giả định về tính đồng nhất phương sai","h2_en":"2. Homogeneity of Variance","content_vi":"Kiểm định Levene phải có Sig > 0.05. Nếu không, bạn phải sử dụng kết quả Welch ANOVA thay vì ANOVA thông thường.","content_en":"Levene''s test must have Sig > 0.05. If violated, use Welch ANOVA results instead of standard ANOVA."},
        {"h2_vi":"3. Đọc kết quả Post-hoc trên ncsStat","h2_en":"3. Interpreting Post-hoc on ncsStat","content_vi":"Hệ thống sẽ tự động so sánh từng cặp nhóm và đánh dấu các cặp có sự khác biệt ý nghĩa, giúp bạn nhận định chính xác bối cảnh nghiên cứu.","content_en":"ncsStat automatically pairs groups and highlights significant differences for precise contextual interpretation."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
