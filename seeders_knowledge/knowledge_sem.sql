-- NCSStat Expert Article: SEM
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'sem-structural-equation-modeling', 
    'Advanced Statistics', 
    'SEM: Mô hình cấu trúc tuyến tính - Đỉnh cao của phân tích dữ liệu', 
    'Structural Equation Modeling (SEM): The Peak of Data Analysis', 
    'SEM cho phép bạn kiểm định toàn bộ mô hình phức tạp với nhiều biến trung gian cùng lúc. Hãy sử dụng Bootstrapping để kiểm định ý nghĩa của hiệu ứng trung gian.', 
    'SEM tests entire complex models with multiple mediators simultaneously. Use Bootstrapping to verify mediation significance.', 
    $$[
        {"h2_vi":"1. Tại sao SEM lại được ưa chuộng?","h2_en":"1. Why SEM is Preferred?","content_vi":"Khác với hồi quy thông thường, SEM xử lý được sai số đo lường và cho phép các mối quan hệ đan xen phức tạp (Vd: A -> B -> C).","content_en":"Unlike OLS regression, SEM accounts for measurement error and handles complex interlocking paths like A -> B -> C."},
        {"h2_vi":"2. Quy trình 2 bước: Measurement Model và Structural Model","h2_en":"2. Two-Step Approach","content_vi":"Bước 1: Chạy CFA cho mô hình đo lường. Bước 2: Chạy cấu trúc (Structural) để kiểm định các giả thuyết nghiên cứu.","content_en":"Step 1: Measurement model via CFA. Step 2: Structural model for hypothesis testing."},
        {"h2_vi":"3. Phân tích Path Diagram trên ncsStat","h2_en":"3. Path Diagram Analysis","content_vi":"Hệ thống ncsStat cung cấp các chỉ số tác động trực tiếp, gián tiếp và tổng thể một cách trực quan, giúp bạn viết báo cáo chuẩn APA 7.","content_en":"ncsStat provides visual direct, indirect, and total effect indices, facilitating APA 7 compliant reporting."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
