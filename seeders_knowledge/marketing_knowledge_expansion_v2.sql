-- MARKETING KNOWLEDGE HUB EXPANSION: PHASE 2 (FINAL NICHE BATCH)
SET client_encoding = 'UTF8';

-- 1. Brand Trust (Niềm tin thương hiệu)
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'brand-trust-academic-guide', 
    'Marketing Strategy', 
    'Niềm tin thương hiệu: Nền tảng của mối quan hệ khách hàng bền vững', 
    'Brand Trust: The Foundation of Long-term Customer Relationships', 
    '🛡️ EXPERT TIP: Niềm tin thương hiệu không đến từ quảng cáo hào nhoáng, nó đến từ "Sự nhất quán" (Consistency). Hãy đo lường niềm tin qua 2 chiều: Năng lực (Competence) và Lòng nhân từ (Benevolence) của thương hiệu.', 
    'Expert Insight: Brand trust isn''t built via flashy ads; it''s built through Consistency. Measure trust along two dimensions: Competence and Benevolence.', 
    $$[
        {"h2_vi":"1. Định nghĩa Niềm tin thương hiệu theo Chaudhuri & Holbrook","h2_en":"1. Defining Brand Trust","content_vi":"Niềm tin thương hiệu là sự sẵn lòng của người tiêu dùng bình thường tin cậy vào khả năng của thương hiệu để thực hiện chức năng đã nêu của nó. Đây là biến trung gian cực kỳ quan trọng dẫn tới lòng trung thành. #BrandTrust #MarketingTheory","content_en":"Brand trust is the willingness of the average consumer to rely on the ability of the brand to perform its stated function. It is a critical mediator to loyalty. #ConsumerTrust"},
        {"h2_vi":"2. Cách đo lường niềm tin trong nghiên cứu định lượng","h2_en":"2. Measuring Trust in Quantitative Research","content_vi":"Sử dụng thang đo của Chaudhuri & Holbrook (2001) với các item tập trung vào: 'Tôi tin tưởng thương hiệu này', 'Tôi dựa vào thương hiệu này', 'Thương hiệu này an toàn'. ncsStat hỗ trợ bạn chạy CFA để kiểm định tính đơn hướng của thang đo này. #DataAnalytics #CFA","content_en":"Use Chaudhuri & Holbrook (2001) scales focusing on safety, reliance, and honesty. Use ncsStat to run CFA for unidimensionality testing. #AcademicResearch"},
        {"h2_vi":"3. Mối quan hệ giữa Niềm tin và Ý định mua hàng","h2_en":"3. Link between Trust and Purchase Intention","content_vi":"Trong môi trường rủi ro cao (như thương mại điện tử), niềm tin đóng vai trò là 'bộ giảm chấn' rủi ro. Khi niềm tin tăng, rào cản mua hàng giảm xuống đáng kể. #ECommerce #ConversionOptimization","content_en":"In high-risk environments like E-commerce, trust acts as a risk buffer. As trust increases, purchase barriers drop significantly. #MarketingScience"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- 2. Perceived Value (PERVAL Model)
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'perceived-value-perval-marketing', 
    'Marketing Strategy', 
    'Giá trị cảm nhận (PERVAL): Tại sao khách hàng mua sản phẩm của bạn?', 
    'Perceived Value (PERVAL): Why Customers Buy from You?', 
    '💰 HACK: Đừng chỉ cạnh tranh về giá. Hãy tập trung nâng cao "Giá trị cảm xúc" (Emotional Value) và "Giá trị xã hội" (Social Value). Khách hàng sẵn sàng trả cao hơn khi cảm thấy sản phẩm nâng tầm vị thế của họ.', 
    'Strategy Tip: Move beyond price competition. Focus on Emotional and Social Value. Customers pay a premium when a product elevates their self-image.', 
    $$[
        {"h2_vi":"1. Thang đo PERVAL của Sweeney & Soutar (2001)","h2_en":"1. The PERVAL Scale","content_vi":"Thay vì nhìn nhận giá trị một cách đơn giản là 'Chất lượng/Giá', PERVAL chia thành 4 chiều: Chất lượng (Quality), Cảm xúc (Emotional), Xã hội (Social) và Giá (Price). Cách tiếp cận đa chiều này giúp nhà nghiên cứu bóc tách lý do thực sự đằng sau quyết định mua. #PERVAL #ConsumerValue","content_en":"Instead of a simple Quality/Price ratio, PERVAL looks at 4 dimensions: Quality, Emotional, Social, and Price value. #MultiDimensionalScale"},
        {"h2_vi":"2. Ứng dụng trong việc định vị thương hiệu","h2_en":"2. Application in Brand Positioning","content_vi":"Nếu bạn đang làm về hàng xa xỉ, giá trị Xã hội phải được đặt lên hàng đầu. Nếu là hàng tiêu dùng nhanh, giá trị Chất lượng và Giá là then chốt. ncsStat giúp bạn so sánh trọng số của các thành phần này thông qua phân tích hồi quy. #BrandStrategy #MarketPositioning","content_en":"For luxury goods, Social Value is key. For FMCG, Quality and Price are paramount. Use ncsStat's regression analysis to weight these components. #MarketingStrategy"},
        {"h2_vi":"3. Giá trị cảm nhận và sự hài lòng","h2_en":"3. Value vs. Satisfaction","content_vi":"Giá trị cảm nhận xảy ra TRƯỚC khi mua (kỳ vọng), còn sự hài lòng xảy ra SAU khi dùng. Hiểu được khoảng cách này là chìa khóa để giữ chân khách hàng. #CustomerExperience #LoyaltyLoop","content_en":"Perceived value occurs pre-purchase (expectation), while satisfaction occurs post-purchase. Managing this gap is key to retention. #CustomerJourney"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- 3. AIDA Model (Digital Era)
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'modern-aida-model-marketing-funnel', 
    'Marketing Strategy', 
    'Mô hình AIDA hiện đại: Hành trình từ Chú ý đến Hành động trong thời đại số', 
    'Modern AIDA Model: The Customer Journey in the Digital Age', 
    '🔥 TIP: Bước "Attention" (Chú ý) ngày nay chỉ kéo dài 3 giây trên feed. Hãy sử dụng những hình ảnh gây shock (Visual Hook) hoặc câu hỏi 'nhột' (Pain-point Question) để dừng ngón tay người dùng.', 
    'Digital Hack: Modern Attention lasts only 3 seconds. Use high-impact visual hooks or pain-point questions to stop the scroll.', 
    $$[
        {"h2_vi":"1. AIDA là gì? Nền tảng của phễu Marketing","h2_en":"1. What is AIDA? The Funnel Foundation","content_vi":"AIDA là viết tắt của: Attention (Chú ý), Interest (Thú vị), Desire (Mong muốn) và Action (Hành động). Đây là mô hình phân bậc tác động truyền thống nhưng vẫn cực kỳ chính xác để xây dựng kịch bản quảng cáo. #AIDA #MarketingFunnel","content_en":"AIDA stands for Attention, Interest, Desire, and Action. It's a classic hierarchy-of-effects model essential for ad copywriting. #AdvertisingTheory"},
        {"h2_vi":"2. Sự chuyển đổi từ AIDA sang AISAS (Thời đại số)","h2_en":"2. From AIDA to AISAS (Digital Transition)","content_vi":"Trong môi trường Internet, mô hình đã biến chuyển thêm các bước như Search (Tìm kiếm) và Share (Chia sẻ). ncsStat hỗ trợ các thang đo khảo sát hành vi tìm kiếm thông tin của khách hàng trước khi ra quyết định. #DigitalTransition #ConsumerSearch","content_en":"The internet added Search and Share phases. ncsStat provides scales to measure consumer information-seeking behavior before purchase. #ModernMarketing"},
        {"h2_vi":"3. Cách tối ưu tỷ lệ chuyển đổi tại mỗi bước","h2_en":"3. Converson Optimization at Each Step","content_vi":"Sử dụng phân tích Tần suất (Frequency) và Cross-tabs trên ncsStat để tìm ra tại sao khách hàng có 'Mong muốn' nhưng chưa thực hiện 'Hành động' (Ví dụ: do phí ship cao, hoặc thanh toán khó khăn). #ConversionRate #DataAnalytics","content_en":"Use frequency analysis and cross-tabs on ncsStat to find why customers have 'Desire' but don't 'Act' (e.g., high shipping fees). #CRO"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- 4. Perceived Risk (Rủi ro cảm nhận)
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'perceived-risk-consumer-behavior-barriers', 
    'Marketing Strategy', 
    'Rủi ro cảm nhận: Rào cản vô hình kìm hãm doanh số', 
    'Perceived Risk: The Invisible Barrier to Sales', 
    '⚠️ CẢNH BÁO: Rủi ro tài chính không đáng sợ bằng "Rủi ro xã hội" (Social Risk) - nỗi sợ bị người khác đánh giá khi mua sai sản phẩm. Hãy sử dụng Feedback và Testimonial để triệt tiêu rào cản này.', 
    'Expert Insight: Financial risk is less scary than Social Risk—the fear of being judged for a bad purchase. Use testimonials to eliminate this barrier.', 
    $$[
        {"h2_vi":"1. 6 Loại rủi ro cảm nhận chính","h2_en":"1. The 6 Main Perceived Risks","content_vi":"Người tiêu dùng thường đối mặt với: Rủi ro chức năng, Rủi ro tài chính, Rủi ro vật lý, Rủi ro tâm lý, Rủi ro xã hội và Rủi ro thời gian. ncsStat có bộ thang đo chuyên sâu để đo lường từng loại rủi ro này. #PerceivedRisk #ConsumerBehavior","content_en":"Consumers face Functional, Financial, Physical, Psychological, Social, and Time risks. ncsStat offers specialized scales for each. #RiskAssessment"},
        {"h2_vi":"2. Tác động tiêu cực của rủi ro lên Ý định mua hàng","h2_en":"2. Risk Impact on Purchase Intention","content_vi":"Rủi ro đóng vai trò là biến 'Điều tiết' (Moderator) hoặc biến độc lập tác động ngược chiều (Negative association) tới hành vi. Nếu rủi ro quá cao, mọi nỗ lực khuyến mãi đều vô dụng. #ModerationAnalysis #MarketingBARRIER","content_en":"Risk acts as a moderator or a negative predictor. If risk is too high, promotion efforts become useless. #StatisticalAnalysis"},
        {"h2_vi":"3. Chiến lược giảm thiểu rủi ro (Risk Reduction)","h2_en":"3. Risk Reduction Strategies","content_vi":"Sử dụng Bảo hành, Cho dùng thử, hoặc chứng nhận từ bên thứ 3. Với công cụ T-test trên ncsStat, bạn có thể so sánh ý định mua hàng giữa nhóm có Cam kết bảo hành và nhóm không có. #TrustBuilding #ABTesting","content_en":"Use guarantees, trials, or 3rd-party certs. Use ncsStat's T-test to compare purchase intentions between groups with and without guarantees. #MarketingStrategy"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- 5. Social Media Engagement
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'social-media-engagement-tactics', 
    'Marketing Strategy', 
    'Sự gắn kết trên Mạng xã hội: Đọc vị hành vi Engagement của khách hàng', 
    'Social Media Engagement: Decoding Consumer Interactions', 
    '💬 EXPERT HACK: Engagement thực sự không nằm ở nút Like, nó nằm ở "Hành vi chia sẻ" (Sharing Behavior). Khi khách hàng Share bài của bạn, họ đang dùng uy tín cá nhân để bảo chứng cho thương hiệu.', 
    'Expert Tip: Real engagement isn''t about likes; it''s about Sharing Behavior. Sharing means the customer uses their personal credibility to vouch for your brand.', 
    $$[
        {"h2_vi":"1. Khái niệm Gắn kết khách hàng trực tuyến (CBE)","h2_en":"1. Customer Brand Engagement (CBE)","content_vi":"CBE (Consumer Brand Engagement) bao gồm 3 khía cạnh: Nhận thức (Say mê), Cảm xúc (Nhiệt huyết) và Hành vi (Kích hoạt). ncsStat cung cấp thang đo của Hollebeek (2014) để đo lường trọn vẹn sự gắn kết này. #SocialEngagement #CBE","content_en":"CBE involves Cognitive (Absorption), Affective (Enthusiasm), and Behavioral (Activation) dimensions. Use Hollebeek (2014) scales on ncsStat. #SocialMediaMarketing"},
        {"h2_vi":"2. Tại sao Engagement quan trọng hơn Reach?","h2_en":"2. Why Engagement Beats Reach","content_vi":"Reach chỉ là con số bề nổi. Engagement cho thấy sự sâu sắc trong mối quan hệ. ncsStat có thể giúp bạn chạy phân tích Tương quan (Correlation) để xem mức độ Engagement tác động thế nào tới Lòng trung thành thương hiệu. #SocialMetrics #MarketingAudit","content_en":"Reach is superficial. Engagement shows depth. Use ncsStat's correlation analysis to see how engagement impacts brand loyalty. #DataDrivenMarketing"},
        {"h2_vi":"3. Tối ưu nội dung dựa trên dữ liệu","h2_en":"3. Data-driven Content Optimization","content_vi":"Sử dụng ncsStat để phân tích xem loại nội dung nào (Video, Hình ảnh, Text) tạo ra mức độ gắn kết cao nhất thông qua phân tích ANOVA. #ContentStrategy #MarketingOptimization","content_en":"Analyze which content type (Video, Image, Text) drives the highest engagement using ANOVA on ncsStat. #ContentScience"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
