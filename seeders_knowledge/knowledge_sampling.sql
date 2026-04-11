-- NCSStat Expert Article: Sampling
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'sampling-methods-sample-size', 
    'Research Methodology', 
    'Xác định kích thước mẫu và Phương pháp chọn mẫu tối ưu', 
    'Determining Sample Size and Optimal Sampling Methods', 
    'Đối với SEM, kích thước mẫu tối thiểu nên gấp 5-10 lần số biến quan sát. Đừng quên tính đến tỷ lệ phiếu không hợp lệ.', 
    'For SEM, sample size should be 5-10 times the number of items. Account for potential invalid survey responses.', 
    $$[
        {"h2_vi":"1. Các phương pháp chọn mẫu","h2_en":"1. Sampling Methods","content_vi":"- Chọn mẫu ngẫu nhiên đơn giản.\n- Chọn mẫu thuận tiện (phổ biến trong nghiên cứu sinh viên).\n- Chọn mẫu quả cầu tuyết (Snowball sampling).","content_en":"- Simple Random Sampling.\n- Convenience Sampling (common for students).\n- Snowball Sampling."},
        {"h2_vi":"2. Công thức tính Kích thước mẫu (N)","h2_en":"2. Sample Size Formulas","content_vi":"Sử dụng công thức Yamane, Slovin cho các nghiên cứu mô tả hoặc quy tắc '5:1' (Hair) cho các mô hình nhân tố (EFA/CFA).","content_en":"Use Yamane/Slovin for descriptive studies, or the '5:1' rule (Hair) for factor-based models (EFA/CFA)."},
        {"h2_vi":"3. Tầm quan trọng của Mẫu đại diện","h2_en":"3. Representative Sampling Importance","content_vi":"Một tập mẫu lớn không quan trọng bằng một tập mẫu có tính đại diện cao. ncsStat giúp bạn phân tích sai số mẫu để đảm bảo tính khách quan.","content_en":"Representativeness outweighs size. ncsStat helps analyze sampling error to ensure objective findings."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
