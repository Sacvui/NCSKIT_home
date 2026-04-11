-- NCSStat Expert Article: Descriptive Statistics
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'descriptive-statistics-normality', 
    'Preliminary Analysis', 
    'Thống kê mô tả và Kiểm định phân phối chuẩn', 
    'Descriptive Statistics and Normality Testing', 
    'Đừng bỏ qua Skewness và Kurtosis. Nếu dữ liệu quá lệch, các phép kiểm định tham số (như T-test, ANOVA) sẽ mất giá trị.', 
    'Monitor Skewness and Kurtosis. Extreme deviations invalidate parametric tests like T-Tests and ANOVA.', 
    $$[
        {"h2_vi":"1. Các chỉ số đo lường trung tâm","h2_en":"1. Measures of Central Tendency","content_vi":"Mean (Trung bình), Median (Trung vị), và Mode (Yếu vị). Mean là chỉ số nhạy cảm nhất với giá trị ngoại lai (outliers).","content_en":"Mean, Median, and Mode. Remember that Mean is highly sensitive to outliers."},
        {"h2_vi":"2. Đo lường sự phân tán","h2_en":"2. Measures of Dispersion","content_vi":"Độ lệch chuẩn (Standard Deviation) và Phương sai (Variance) cho biết dữ liệu của bạn tập trung hay phân tán rộng ra khỏi điểm trung bình.","content_en":"Standard Deviation and Variance indicate how concentrated or spread out the data is from the mean."},
        {"h2_vi":"3. Kiểm định Phân phối chuẩn","h2_en":"3. Normality Testing","content_vi":"Sử dụng biểu đồ Histogram hoặc kiểm định Shapiro-Wilk/Kolmogorov-Smirnov trên ncsStat để xác định dữ liệu có chuẩn hay không trước khi chạy các phép phân tích bậc cao.","content_en":"Use Histograms or Shapiro-Wilk/Kolmogorov-Smirnov tests on ncsStat to verify normality before high-level analysis."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
