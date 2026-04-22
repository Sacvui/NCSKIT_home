-- ncsStat Rich Insights Migration (FIXED UUID VERSION)
-- Targeted at enriching ncskit.org/scales with academic depth

-- 1. Update Existing Core Models using real UUIDs
UPDATE scales SET 
  description_vi = 'Mô hình Chấp nhận Công nghệ (TAM) của Davis (1989). Giải thích hành vi sử dụng thông qua Sự hữu ích cảm nhận (PU) và Sự dễ sử dụng cảm nhận (PEOU). Đây là mô hình kinh điển nhất trong nghiên cứu hệ thống thông tin.',
  research_model = 'PU/PEOU -> Attitude -> Behavioral Intention -> Actual Use'
WHERE id = 'd3434bc3-764f-4ceb-b9a2-5150cc8e5c79';

UPDATE scales SET 
  description_vi = 'Thuyết Hành vi Dự định (TPB) của Ajzen (1991). Dự báo ý định hành vi dựa trên ba trụ cột: Thái độ, Chuẩn chủ quan và Nhận thức kiểm soát hành vi. Phù hợp cho đa dạng lĩnh vực từ tâm lý học đến marketing.',
  research_model = 'Attitude/Subjective Norm/PBC -> Intention -> Behavior'
WHERE id IN ('5ad96415-9edc-49bd-90ce-b90a590d1aa3', '89e18ee1-718d-4b2e-b9bf-9614ea9633d4');

UPDATE scales SET 
  description_vi = 'Thang đo đa hướng (5 thành phần) dùng để đo lường cảm nhận của khách hàng về chất lượng dịch vụ: Hữu hình, Tin cậy, Đáp ứng, Đảm bảo và Thấu cảm.',
  research_model = 'Dimensions -> Service Quality -> Customer Satisfaction'
WHERE id = '8a7209ab-f916-4402-8a8e-326a2c538f9b';

-- 2. Enrich Professional Models with "Insights" by Name (Safer)
UPDATE scales SET 
  description_vi = 'Mô hình thống nhất về chấp nhận và sử dụng công nghệ (UTAUT) của Venkatesh (2003). Kết hợp 8 lý thuyết chấp nhận công nghệ trước đó để tạo ra khung đo lường toàn diện với 4 biến độc lập cốt lõi.',
  research_model = 'Performance/Effort Expectancy/Social Influence/Facilitating Conditions -> Intention -> Use'
WHERE id = '51c1bc6e-6f82-4495-bb1c-7ea09bddb01f';

UPDATE scales SET 
  description_vi = 'Thang đo An toàn tâm lý của Amy Edmondson (1999). Đánh giá mức độ tin tưởng giữa các thành viên nhắm tới việc học hỏi và đổi mới. Phù hợp cho nghiên cứu về hiệu quả làm việc nhóm và quản trị sự thay đổi.',
  research_model = 'Team Support -> Psychological Safety -> Learning Behavior -> Performance'
WHERE id = '19c442d5-3401-4318-b73d-00c94f77b5e4';

UPDATE scales SET 
  description_vi = 'Mô hình giá trị cảm nhận đa hướng PERVAL của Sweeney & Soutar (2001). Chia nhỏ giá trị thành 4 khía cạnh: Chất lượng, Cảm xúc, Xã hội và Giá cả (Tiền bạc), giúp hiểu sâu sắc động cơ mua hàng của người tiêu dùng.',
  research_model = 'Product/Service Attributes -> Multi-dimensional Perceived Value -> Satisfaction -> Loyalty'
WHERE id = '863135c9-857e-4491-9819-859156245087';

-- 3. Insert Missing High-Impact Models (Using extensions to generate IDs if needed)
-- Note: Replace gen_random_uuid() with extensions like pgcrypto if not available
INSERT INTO scales (id, name_vi, name_en, author, year, citation, description_vi, description_en, category, research_model)
VALUES 
(
  gen_random_uuid(),
  'Mô hình Chấp nhận Công nghệ Mở rộng (UTAUT2)',
  'Extended Unified Theory of Acceptance and Use of Technology',
  'Venkatesh et al.',
  2012,
  'Venkatesh, V., Thong, J. Y., & Xu, X. (2012). Consumer acceptance and use of information technology: extending the unified theory of acceptance and use of technology. MIS Quarterly.',
  'Bản nâng cấp của UTAUT dành riêng cho bối cảnh người tiêu dùng, bổ sung thêm các yếu tố Động lực hưởng thụ, Giá trị thặng dư và Thói quen.',
  'An extension of UTAUT tailored for consumer contexts, adding Hedonic Motivation, Price Value, and Habit.',
  ARRAY['MIS', 'Modern Research (2020+)'],
  'Performance/Effort/Social/Facilitating/Hedonic/Price/Habit -> Intention'
),
(
  gen_random_uuid(),
  'Niềm tin Thương hiệu',
  'Brand Trust Scale',
  'Chaudhuri & Holbrook',
  2001,
  'Chaudhuri, A., & Holbrook, M. B. (2001). The chain of effects from brand trust and brand affect to brand performance: the role of brand loyalty. Journal of Marketing.',
  'Đo lường mức độ tin cậy và sự sẵn lòng dựa vào khả năng thực hiện chức năng đã hứa của thương hiệu. Là biến trung gian quan trọng trong mối quan hệ giữa Marketing và Lòng trung thành.',
  'Measures the level of confidence and willingness to rely on a brand’s ability to perform its stated function.',
  ARRAY['Marketing'],
  'Brand Experience -> Brand Trust -> Brand Loyalty'
),
(
  gen_random_uuid(),
  'Sự gắn kết công việc (UWES-9)',
  'Utrect Work Engagement Scale',
  'Schaufeli et al.',
  2006,
  'Schaufeli, W. B., Bakker, A. B., & Salanova, M. (2006). The measurement of work engagement with a short questionnaire: A cross-national study. Educational and Psychological Measurement.',
  'Thang đo rút gọn 9 mục đo lường sự gắn kết công việc qua 3 khía cạnh: Sức mạnh (Vigor), Sự cống hiến (Dedication) và Sự hấp dẫn (Absorption).',
  'A 9-item scale measuring work engagement through Vigor, Dedication, and Absorption.',
  ARRAY['HR', 'Modern Research (2020+)'],
  'Job Resources -> Work Engagement -> Job Performance'
),
(
  gen_random_uuid(),
  'Niềm tin vào năng lực bản thân (General Self-Efficacy)',
  'General Self-Efficacy Scale (GSE)',
  'Schwarzer & Jerusalem',
  1995,
  'Schwarzer, R., & Jerusalem, M. (1995). Generalized Self-Efficacy scale. Measures in health psychology: A user’s portfolio. Causal and control beliefs.',
  'Đánh giá niềm tin của một cá nhân vào khả năng ứng phó với các tình huống khó khăn và giải quyết vấn đề. Là nhân tố then chốt trong tâm lý học hành vi.',
  'Assesses optimistic self-beliefs to cope with a variety of difficult demands in life.',
  ARRAY['Psychology'],
  'Self-Efficacy -> Goal Setting -> Task Performance'
),
(
  gen_random_uuid(),
  'Chất lượng cảm nhận Sản phẩm (Perceived Quality)',
  'Perceived Product Quality',
  'Aaker',
  1991,
  'Aaker, D. A. (1991). Managing Brand Equity. Free Press.',
  'Cảm nhận tổng thể của khách hàng về chất lượng hoặc tính ưu việt của một sản phẩm/dịch vụ so với các lựa chọn thay thế.',
  'Customer’s perception of the overall quality or superiority of a product or service with respect to its intended purpose.',
  ARRAY['Marketing'],
  'Brand Image -> Perceived Quality -> Purchase Intention'
);

-- 4. Global Append Insight
UPDATE scales SET description_vi = description_vi || ' [Insight: Sử dụng thang đo Likert 5 hoặc 7 điểm. Độ tin cậy Cronbach''s Alpha kỳ vọng > 0.70]' 
WHERE description_vi NOT LIKE '%[Insight%' 
AND (name_vi LIKE '%Thang Ä‘o%' OR name_vi LIKE '%MÃ´ hÃ¬nh%');
