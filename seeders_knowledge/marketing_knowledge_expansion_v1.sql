-- MARKETING KNOWLEDGE HUB EXPANSION: THE BIG THREE
SET client_encoding = 'UTF8';

-- 1. eWOM - Electronic Word of Mouth
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'ewom-marketing-impact-guide', 
    'Marketing Strategy', 
    'eWOM: Sức mạnh của lời truyền miệng kỹ thuật số trong kỷ nguyên Review', 
    'eWOM: The Power of Electronic Word of Mouth in the Review Era', 
    '💡 EXPERT INSIGHT: Đừng chỉ nhìn vào số sao (Rating). Reviewer thực tế quan tâm đến "tính chi tiết" của đánh giá. Một đánh giá dài có hình ảnh thực tế (Visual Evidence) có trọng số SEO và niềm tin gấp 5 lần đánh giá ngắn.', 
    'Master Tip: Don''t just chase high ratings. Customers value detailed reviews with visual evidence. High granularity equals high credibility and 5x conversion rate.', 
    $$[
        {"h2_vi":"1. eWOM là gì? Tại sao nó là 'tử huyệt' của Marketing hiện đại?","h2_en":"1. What is eWOM? The Critical Marketing Point","content_vi":"eWOM (Electronic Word of Mouth) là bất kỳ phát biểu tích cực hay tiêu cực nào do khách hàng tiềm năng, khách hàng thực tế hoặc khách hàng cũ đưa ra về một sản phẩm hoặc công ty, cung cấp cho mọi người và tổ chức thông qua Internet. Trong kỷ nguyên mà khách hàng tin vào người lạ trên mạng hơn là quảng cáo của nhãn hàng, eWOM chính là chìa khóa mở ra cánh cửa doanh thu. #eWOM #DigitalMarketing #ConsumerBehavior","content_en":"eWOM is any statement made by customers about a product or company available via the internet. In an era where strangers' reviews outweigh brand ads, eWOM is the master key to revenue. #OnlineReviews #MarketingImpact"},
        {"h2_vi":"2. Ma trận niềm tin: Nguồn phát tín hiệu (Source Credibility)","h2_en":"2. The Trust Matrix: Source Credibility","content_vi":"Để một đánh giá có giá trị, nó phải hội đủ 3 yếu tố: \n- **Tính chuyên môn:** Người viết có hiểu biết về sản phẩm không?\n- **Sự tin cậy:** Người viết có khách quan không?\n- **Sự thu hút:** Cách trình bày đánh giá có hấp dẫn không?\nncsStat giúp bạn đo lường sự tác động của từng yếu tố này lên ý định mua hàng thông qua các mô hình hồi quy đa biến. #SourceCredibility #TrustAnalysis","content_en":"A valuable review needs expertise, trustworthiness, and attractiveness. Use ncsStat to measure which factor most influences purchase intention through multivariate regression. #DataAnalytics"},
        {"h2_vi":"3. Chiến lược quản trị eWOM: Biến thách thức thành cơ hội","h2_en":"3. eWOM Management Strategy","content_vi":"Không phải lúc nào review tiêu cực cũng là thảm họa. Cách doanh nghiệp phản hồi (Response Strategy) chính là lúc xây dựng lại niềm tin. Hãy sử dụng thang đo ncsStat để khảo sát mức độ hài lòng sau khi xử lý khiếu nại, từ đó tối ưu hóa quy trình CSKH. #PublicRelations #CustomerCare","content_en":"Negative reviews aren't always disasters. Your response strategy is where trust is rebuilt. Use ncsStat to survey post-complaint satisfaction and optimize your CSKH flow. #CRMInsights"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- 2. Influencer Credibility
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'influencer-credibility-marketing-scale', 
    'Marketing Strategy', 
    'Độ tin cậy của Influencer: Nghệ thuật chọn đúng "KOL" cho chiến dịch', 
    'Influencer Credibility: The Art of Source Selection', 
    '🚀 CHIẾN THUẬT: Đừng chọn Influencer chỉ vì họ có nhiều Follower. Hãy chọn người có sự "Phù hợp" (Congruence) cao nhất với ngành hàng của bạn. Một Micro-influencer ngành IT review bàn phím cơ luôn có sức thuyết phục hơn một ngôi sao hạng A review đồ gia dụng.', 
    'Strategy Hack: Follower count is a vanity metric. Focus on Congruence—the fit between the influencer and your product category. Niche credibility beats mass reach every time.', 
    $$[
        {"h2_vi":"1. Mô hình Ohanian (1990) và ứng dụng trong thời đại TikTok","h2_en":"1. The Ohanian Model in the TikTok Age","content_vi":"Mô hình kinh điển của Ohanian chỉ ra 3 trụ cột tạo nên sức mạnh của người đại diện: **Chuyên môn (Expertise)**, **Sự tin cậy (Trustworthiness)** và **Sự thu hút (Attractiveness)**. Trong thời đại TikTok Shop, yếu tố 'Chuyên môn' thông qua các video Review thực thực tế đang lấn lướt yếu tố 'Thu hút' truyền thống. #InfluencerMarketing #KOL #KOC","content_en":"Ohanian's pillars—Expertise, Trustworthiness, and Attractiveness—still rule. In the TikTok Shop era, 'Expertise' shown through authentic reviews is often more powerful than traditional 'Attractiveness'. #DigitalStrategy"},
        {"h2_vi":"2. Sự phù hợp giữa Influencer và Thương hiệu (Match-up Hypothesis)","h2_en":"2. The Match-up Hypothesis","content_vi":"Tại sao có những chiến dịch tốn hàng tỷ nhưng không ra đơn? Đó là do sự lệch pha (Misalignment). Nếu Influencer có lối sống không tương đồng với giá trị lõi của thương hiệu, khách hàng sẽ nảy sinh tâm lý hoài nghi (Skepticism). Sử dụng thang đo ncsStat để kiểm tra mức độ 'phù hợp cảm nhận' của khách hàng trước khi ký hợp đồng dài hạn. #BrandAlignment #MarketingROI","content_en":"Why do expensive campaigns fail? Misalignment. If an influencer's lifestyle clashes with brand values, consumers become skeptical. Use ncsStat to test 'Perceived Fit' before signing long-term deals. #MarketingScience"},
        {"h2_vi":"3. Đo lường hiệu quả (Metrics that Matter)","h2_en":"3. Metrics that Matter: Beyond Likes","content_vi":"Lượt Like là ảo, tỷ lệ chuyển đổi và Ý định mua hàng (Purchase Intention) mới là thật. ncsStat cung cấp các công cụ phân tích trung gian để xem Influencer tác động tới Doanh số thông qua Niềm tin thương hiệu như thế nào. #DataAnalysis #ConversionRate","content_en":"Likes are vanity; conversion and Purchase Intention are reality. ncsStat offers mediation analysis tools to show how influencers drive sales through brand trust. #DigitalSuccess"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- 3. Customer Loyalty (Oliver Model)
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'customer-loyalty-oliver-model', 
    'Marketing Strategy', 
    'Lòng trung thành của Khách hàng: Hành trình 4 bước của Richard Oliver', 
    'Customer Loyalty: The 4-Stage Model by Richard Oliver', 
    '💎 INSIGHT: Đỉnh cao nhất của sự trung thành là "Action Loyalty" - khi khách hàng sẵn sàng vượt qua mọi rào cản (giá cao hơn, cửa hàng xa hơn) để mua sản phẩm của bạn. Hãy đo lường sự gắn kết này bằng thang đo chuyên sâu trên ncsStat.', 
    'Expert Tip: The pinnacle is "Action Loyalty"—where customers overcome barriers (higher prices, distance) just to buy from you. Measure this deep bond using ncsStat''s specialized scales.', 
    $$[
        {"h2_vi":"1. 4 Giai đoạn của lòng trung thành: Từ Nhận thức đến Hành động","h2_en":"1. The 4 Stages of Loyalty","content_vi":"Theo Oliver (1997, 1999), lòng trung thành không diễn ra ngay lập tức mà qua: \n- **Cognitive (Nhận thức):** Tin rằng hãng này tốt nhất.\n- **Affective (Cảm xúc):** Yêu mến thương hiệu.\n- **Conative (Ý định):** Muốn mua lại.\n- **Action (Hành động):** Thực sự mua và chống lại các chào mời từ đối thủ. #CustomerLoyalty #BrandRetention","content_en":"Loyalty develops via: Cognitive (Belief), Affective (Liking), Conative (Intent), and Action (Repeat purchase). #MarketingFoundation"},
        {"h2_vi":"2. Phân biệt Sự hài lòng và Lòng trung thành","h2_en":"2. Satisfaction vs. Loyalty: The Critical Gap","content_vi":"Một khách hàng hài lòng vẫn có thể rời bỏ bạn nếu đối thủ có giá rẻ hơn. Lòng trung thành là thứ giữ họ ở lại ngay cả khi bạn không phải là người rẻ nhất. ncsStat cung cấp phân tích đa biến để bóc tách sự khác biệt này. #CustomerInsight #RetentionStrategy","content_en":"A satisfied customer can still leave for a lower price. Loyalty keeps them with you even when you aren't the cheapest option. ncsStat helps isolate this difference through multivariate analysis. #StrategyData"},
        {"h2_vi":"3. Chiến lược nâng cấp khách hàng (Loyalty Programs)","h2_en":"3. Upgrade Strategy: Loyalty Programs","content_vi":"Làm sao để đưa khách hàng từ bước 1 lên bước 4? Cần sự kết hợp giữa chất lượng sản phẩm (Lý trí) và trải nghiệm thương hiệu (Cảm xúc). Với ncsStat, bạn có thể chạy mô hình SEM để tìm ra điểm nghẽn khiến khách hàng dừng lại ở bước 'Ý định' mà chưa chuyển sang 'Hành động'. #SEM #MarketingTips","content_en":"Moving customers from stage 1 to stage 4 requires a mix of quality (rational) and experience (emotional). Use SEM on ncsStat to find bottlenecks between 'Intent' and 'Action'. #AdvancedMarketing"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;
