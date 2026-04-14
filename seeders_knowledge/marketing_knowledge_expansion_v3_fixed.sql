-- FIXING SYNTAX IN AIDA ARTICLE AND RE-PUSHING
SET client_encoding = 'UTF8';

-- 3. AIDA Model (Digital Era) - FIXED SYNTAX
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'modern-aida-model-marketing-funnel', 
    'Marketing Strategy', 
    'Mô hình AIDA hiện đại: Hành trình từ Chú ý đến Hành động trong thời đại số', 
    'Modern AIDA Model: The Customer Journey in the Digital Age', 
    '🔥 TIP: Bước "Attention" (Chú ý) ngày nay chỉ kéo dài 3 giây trên feed. Hãy sử dụng những hình ảnh gây shock (Visual Hook) hoặc câu hỏi "nhột" (Pain-point Question) để dừng ngón tay người dùng.', -- Fixed quote
    'Digital Hack: Modern Attention lasts only 3 seconds. Use high-impact visual hooks or pain-point questions to stop the scroll.', 
    $$[
        {"h2_vi":"1. AIDA là gì? Nền tảng của phễu Marketing","h2_en":"1. What is AIDA? The Funnel Foundation","content_vi":"AIDA là viết tắt của: Attention (Chú ý), Interest (Thú vị), Desire (Mong muốn) và Action (Hành động). Đây là mô hình phân bậc tác động truyền thống nhưng vẫn cực kỳ chính xác để xây dựng kịch bản quảng cáo. #AIDA #MarketingFunnel","content_en":"AIDA stands for Attention, Interest, Desire, and Action. It's a classic hierarchy-of-effects model essential for ad copywriting. #AdvertisingTheory"},
        {"h2_vi":"2. Sự chuyển đổi từ AIDA sang AISAS (Thời đại số)","h2_en":"2. From AIDA to AISAS (Digital Transition)","content_vi":"Trong môi trường Internet, mô hình đã biến chuyển thêm các bước như Search (Tìm kiếm) và Share (Chia sẻ). ncsStat hỗ trợ các thang đo khảo sát hành vi tìm kiếm thông tin của khách hàng trước khi ra quyết định. #DigitalTransition #ConsumerSearch","content_en":"The internet added Search and Share phases. ncsStat provides scales to measure consumer information-seeking behavior before purchase. #ModernMarketing"},
        {"h2_vi":"3. Cách tối ưu tỷ lệ chuyển đổi tại mỗi bước","h2_en":"3. Converson Optimization at Each Step","content_vi":"Sử dụng phân tích Tần suất (Frequency) và Cross-tabs trên ncsStat để tìm ra tại sao khách hàng có 'Mong muốn' nhưng chưa thực hiện 'Hành động' (Ví dụ: do phí ship cao, hoặc thanh toán khó khăn). #ConversionRate #DataAnalytics","content_en":"Use frequency analysis and cross-tabs on ncsStat to find why customers have 'Desire' but don't 'Act' (e.g., high shipping fees). #CRO"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, expert_tip_vi = EXCLUDED.expert_tip_vi, content_structure = EXCLUDED.content_structure;

-- 6. Brand Image (Thêm bổ sung)
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'brand-image-perceptions-marketing', 
    'Marketing Strategy', 
    'Hình ảnh thương hiệu: Cách khách hàng "nhìn" thấy bạn', 
    'Brand Image: How Customers Perceive Your Identity', 
    '🎨 TIP: Đừng nhầm lẫn giữa Brand Identity (Cái bạn muốn show) và Brand Image (Cái khách hàng thấy). Hãy dùng khảo sát định lượng để đo lường khoảng cách giữa 2 khái niệm này.', 
    'Expert Tip: Don''t confuse Brand Identity (what you project) with Brand Image (what customers see). Use quantitative surveys to measure the identity-image gap.', 
    $$[
        {"h2_vi":"1. Khái niệm Hình ảnh thương hiệu của David Aaker","h2_en":"1. Brand Image by David Aaker","content_vi":"Hình ảnh thương hiệu là một tập hợp các liên tưởng đến thương hiệu nằm trong tâm trí của khách hàng. Nó bao gồm độ tin cậy, sự hiện diện và các giá trị cảm xúc. #BrandImage #Branding","content_en":"Brand image is a set of brand associations in the mind of the consumer. It covers trust, presence, and emotional values. #BrandStrategy"},
        {"h2_vi":"2. Phân tích các liên tưởng thương hiệu (Brand Associations)","h2_en":"2. Analyzing Brand Associations","content_vi":"Các liên tưởng có thể là về thuộc tính sản phẩm, lợi ích hoặc tính cách. ncsStat giúp bạn chạy phân tích nhân tố khám phá (EFA) để xem các liên tưởng nào đang nhóm lại với nhau mạnh nhất. #EFA #BrandAnalysis","content_en":"Associations can be attributes, benefits, or personalities. Use EFA on ncsStat to see which associations group together most strongly. #MarketingResearch"},
        {"h2_vi":"3. Hình ảnh thương hiệu và Lòng trung thành","h2_en":"3. Link to Loyalty","content_vi":"Hồi quy đa biến trên ncsStat chỉ ra rằng một hình ảnh thương hiệu tích cực sẽ tác động trực tiếp đến ý định mua lại và sự giới thiệu (Positive Word of Mouth). #WOM #LoyaltyBuilding","content_en":"Multiple regression on ncsStat shows that a positive brand image directly impacts repurchase intention and positive WOM. #ConsumerLoyalty"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
