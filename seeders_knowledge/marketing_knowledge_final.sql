-- MARKETING KNOWLEDGE HUB: THE FINAL PIECE
SET client_encoding = 'UTF8';

-- 7. Purchase Intention (Ý định mua hàng)
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'purchase-intention-metric-marketing', 
    'Marketing Strategy', 
    'Ý định mua hàng: "Chén thánh" của mọi nhà nghiên cứu Marketing', 
    'Purchase Intention: The Holy Grail of Marketing Research', 
    '🎯 INSIGHT: Ý định mua hàng không phải là Hành vi mua hàng. Có một "Khoảng cách Ý định-Hành vi" (Intention-Behavior Gap) rất lớn. Hãy dùng các biến điều tiết như "Áp lực thời gian" hoặc "Sự sẵn có" để thu hẹp khoảng cách này.', 
    'Expert Tip: Intention is not Action. There is an "Intention-Behavior Gap". Use moderators like Time Pressure or Availability to narrow this gap in your model.', 
    $$[
        {"h2_vi":"1. Ý định mua hàng là gì?","h2_en":"1. What is Purchase Intention?","content_vi":"Ý định mua hàng là xác suất mà người tiêu dùng sẽ mua một sản phẩm hoặc dịch vụ nhất định trong một khoảng thời gian cụ thể. Đây là chỉ số dự báo tốt nhất cho hành vi thực tế. #PurchaseIntention #ConsumerBehavior","content_en":"Purchase intention is the probability that a consumer will buy a product or service within a specific time. It is the best predictor of actual behavior. #MarketingMetrics"},
        {"h2_vi":"2. Các tiền tố tác động đến Ý định mua hàng","h2_en":"2. Antecedents to Purchase Intention","content_vi":"Trong mô hình ncsStat, ý định mua thường bị tác động bởi: Thái độ, Chuẩn chủ quan, Niềm tin và Giá trị cảm nhận. Bạn có thể sử dụng phân tích Path Analysis (Đường dẫn) để xem yếu tố nào có trọng số tác động cao nhất. #PathAnalysis #RegressionAnalysis","content_en":"Purchase intention is typically driven by Attitude, Subjective Norms, Trust, and Perceived Value. Use Path Analysis on ncsStat to find the strongest driver. #DataDrivenMarketing"},
        {"h2_vi":"3. Đo lường theo thang đo Dodds et al. (1991)","h2_en":"3. Measuring via Dodds Scale","content_vi":"Thang đo 3-item của Dodds tập trung vào: 'Khả năng cao tôi sẽ mua', 'Tôi có ý định mua', 'Tôi chắc chắn sẽ mua'. ncsStat giúp bạn tính toán Cronbach Alpha để đảm bảo thang đo này đạt độ tin cậy trong bối cảnh nghiên cứu của bạn. #AcademicScale #MarketingResearch","content_en":"Dodds' 3-item scale focuses on probability, intent, and certainty of purchase. Use ncsStat to calculate Cronbach Alpha for local reliability. #ReliabilityTest"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
