-- NCSStat Expert Article: T-Test
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    't-test-independent-paired', 
    'Difference Analysis', 
    'Kiểm định T-Test: So sánh trung bình hai nhóm độc lập và phụ thuộc', 
    'T-Test: Comparing Means for Independent and Paired Samples', 
    'Chú ý kiểm định Levene. Nếu phương sai không đồng nhất, hãy đọc dòng "Equal variances not assumed".', 
    'Watch Levene''s test. If variances are unequal, use the "Equal variances not assumed" results.', 
    $$[
        {"h2_vi":"1. Independent Samples T-Test","h2_en":"1. Independent Samples T-Test","content_vi":"Dùng để so sánh sự khác biệt về trung bình của 2 nhóm riêng biệt (Vd: Sự hài lòng của khách hàng Miền Bắc vs Miền Nam).","content_en":"Compares mean differences between two distinct groups (e.g., satisfaction in North vs. South regions)."},
        {"h2_vi":"2. Paired Samples T-Test","h2_en":"2. Paired Samples T-Test","content_vi":"Dùng để so sánh cùng một nhóm trước và sau một tác động (Vd: Điểm số trước và sau khi học khóa học ncsStat).","content_en":"Compares the same group before and after an intervention (e.g., test scores pre- and post-ncsStat training)."},
        {"h2_vi":"3. Trình bày kết quả theo APA 7","h2_en":"3. APA 7 Reporting","content_vi":"Luôn báo cáo giá trị t, df và p. Ví dụ: (t(58) = 2.45, p < .05). ncsStat hỗ trợ kết xuất câu nhận định này tự động.","content_en":"Always report t, df, and p values. ncsStat provides automated APA narrative generation."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
