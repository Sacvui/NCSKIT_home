-- NCSStat Expert Article: Marketing Mix 7P
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'marketing-mix-7p-framework', 
    'Marketing Strategy', 
    'Marketing Mix 7P: Khung lý thuyết kinh điển cho dịch vụ hiện đại', 
    'Marketing Mix 7P: The Modern Service Framework', 
    '💡 INSIGHT: Trong thời đại số, chữ P thứ 8 (Productive/Performance) hoặc biến "Sự cá nhân hóa" đang dần trở thành yếu tố sống còn. Đừng chỉ dừng lại ở 4P truyền thống nếu bạn đang làm về TMĐT hay Dịch vụ.', 
    'Expert Tip: In the digital age, don''t stop at 4P. For e-commerce and services, focus on Personalization and Performance to add academic value.', 
    $$[
        {"h2_vi":"1. Từ 4P đến 7P: Cuộc tiến hóa của chiến lược Marketing","h2_en":"1. Evolution: From 4P to 7P","content_vi":"Mô hình 4P (Product, Price, Place, Promotion) của McCarthy (1960) là nền tảng, nhưng với sự bùng nổ của ngành dịch vụ, Booms & Bitner (1981) đã bổ sung thêm 3P quan trọng: People (Con người), Process (Quy trình) và Physical Evidence (Bằng chứng hữu hình). #MarketingMix #7P #ServiceMarketing","content_en":"While 4P covers products, the 7P model by Booms & Bitner (1981) adds People, Process, and Physical Evidence—essential for the service industry. #MarketingStrategy"},
        {"h2_vi":"2. Giải mã 3P bổ sung trong ngành dịch vụ","h2_en":"2. The 3 New Ps in Services","content_vi":"- **People:** Nhân viên là 'đại sứ' thương hiệu. Thái độ và năng lực của họ quyết định 70% sự hài lòng.\n- **Process:** Quy trình phục vụ nhanh gọn, minh bạch giúp giảm chi phí tâm lý cho khách hàng.\n- **Physical Evidence:** Không gian, trang thiết bị giúp khách hàng 'hữu hình hóa' dịch vụ vô hình. #CustomerExperience","content_en":"People represent the brand, Process ensures efficiency, and Physical Evidence makes intangible services tangible. #ExpertGuidance"},
        {"h2_vi":"3. Cách đưa 7P vào mô hình nghiên cứu định lượng","h2_en":"3. Quantifying 7P in Your Thesis","content_vi":"Thay vì chỉ mô tả, hãy biến 7P thành 7 nhân tố độc lập tác động đến Ý định mua hàng hoặc Lòng trung thành. ncsStat sẽ giúp bạn chạy hồi quy để xem chữ P nào đang 'kéo' doanh thu của bạn đi lên mạnh nhất. #DataAnalysis #NCStat","content_en":"Transform the 7Ps into independent variables. Use regression to identify which 'P' impacts your revenue or loyalty metrics the most. #StatisticalResearch"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: STP Strategy
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'stp-marketing-strategy', 
    'Marketing Strategy', 
    'Chiến lược STP: Phân khúc, Nhắm mục tiêu và Định vị thương hiệu', 
    'STP Strategy: Segmentation, Targeting, and Positioning', 
    '🚀 CHIẾN THUẬT: Định vị (Positioning) không phải là những gì bạn làm với sản phẩm, mà là những gì bạn làm với tâm trí khách hàng. Hãy sử dụng bản đồ định vị trên ncsStat để tìm ra "khoảng trống" thị trường.', 
    'Strategy Hack: Positioning is about conquering the customer''s mind. Use perceptual maps on ncsStat to find lucrative market gaps.', 
    $$[
        {"h2_vi":"1. Segmentation: Đừng bán cho tất cả mọi người","h2_en":"1. Segmentation: Define Your Playground","content_vi":"Phân đoạn thị trường là bước chia thị trường lớn thành các nhóm nhỏ dựa trên địa lý, nhân khẩu học hoặc hành vi. Nếu bạn cố gắng làm hài lòng tất cả, bạn sẽ không làm hài lòng ai cả. #MarketSegmentation","content_en":"Segmentation breaks large markets into niche groups. Trying to please everyone often results in pleasing no one. #Targeting"},
        {"h2_vi":"2. Targeting: Chọn 'miếng bánh' ngon nhất","h2_en":"2. Targeting: Choosing the Right Slice","content_vi":"Dựa trên nguồn lực doanh nghiệp, bạn chọn ra phân đoạn tiềm năng nhất. Hãy nhìn vào quy mô, khả năng tăng trưởng và mức độ cạnh tranh của phân đoạn đó. #BusinessStrategy","content_en":"Select fragments based on size, growth potential, and competition density. Pick where you can win. #ExpertAdvice"},
        {"h2_vi":"3. Positioning: Khắc tên thương hiệu vào tâm trí khách hàng","h2_en":"3. Positioning: Owning the Mental Space","content_vi":"Định vị là việc tạo ra một hình ảnh khác biệt so với đối thủ. Bạn là 'Rẻ nhất', 'Sang trọng nhất' hay 'An toàn nhất'? ncsStat giúp bạn phân tích dữ liệu khảo sát để xác tra xem khách hàng hiện đang định vị bạn ở đâu. #BrandPositioning","content_en":"Positioning defines your uniqueness. Are you the 'Cheapest', 'Most Luxurious', or 'Safest'? Use data to see where you truly land in customer minds. #MarketingResearch"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: Brand Equity Keller
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'brand-equity-keller-model', 
    'Brand Management', 
    'Giá trị Thương hiệu: Phân tích mô hình CBBE của Kevin Keller', 
    'Customer-Based Brand Equity (CBBE): The Keller Model', 
    '💎 INSIGHT: Đỉnh cao của giá trị thương hiệu là "Sự cộng hưởng" (Resonance). Khi khách hàng coi thương hiệu là một phần bản sắc của họ, bạn đã thành công tuyệt đối.', 
    'Master Tip: Resonance is the peak of brand equity. When customers identify with the brand as part of their persona, loyalty becomes unbreakable.', 
    $$[
        {"h2_vi":"1. Kim tự tháp Giá trị thương hiệu (CBBE)","h2_en":"1. The CBBE Pyramid","content_vi":"Kevin Keller (1993) đề xuất 4 bước xây dựng thương hiệu từ nền móng (Sự nhận diện) lên đến đỉnh cao (Sự cộng hưởng/Mối quan hệ mật thiết). #BrandEquity #KellerModel","content_en":"Keller (1993) outlines 4 stages from basic Brand Identity up to deep Brand Resonance. #MarketingPillar"},
        {"h2_vi":"2. Sáu khối thành tố xây dựng niềm tin","h2_en":"2. The Six Building Blocks","content_vi":"Nhận diện, Ý nghĩa, Hiệu suất, Hình ảnh, Cảm xúc và Phán xét. Mỗi khối đại diện cho một câu hỏi mà khách hàng dành cho thương hiệu. #Branding","content_en":"Identity, Meaning, Performance, Imagery, Feelings, and Judgments. Each block answers vital customer questions. #BrandSuccess"},
        {"h2_vi":"3. Phân tích định lượng Brand Equity trên ncsStat","h2_en":"3. Quantifying Brand Equity","content_vi":"Sử dụng phân tích nhân tố EFA/CFA để kiểm chứng các kích thước của giá trị thương hiệu. Đo lường sự tác động của từng khối lên Ý định mua hàng lặp lại. #CFA #StructuralModeling","content_en":"Use CFA to validate brand equity dimensions. Measure how each block drives repeat purchase intentions. #NCStat"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
