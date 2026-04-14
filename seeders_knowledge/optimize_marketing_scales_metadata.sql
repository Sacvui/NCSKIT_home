-- MARKETING SCALE ENRICHMENT (FIXED FOCUS)
-- 1. Electronic Word of Mouth (eWOM)
UPDATE "scales" SET 
  author = 'Bambauer-Sachse & Mangold', year = 2011,
  citation = 'Bambauer-Sachse, C., & Mangold, S. (2011). Let the consumer be the judge: The predictive power of online consumer reviews. Marketing Letters.',
  description_vi = 'Đo lường sự tác động của các đánh giá trực tuyến (Online Reviews) đến ý định mua hàng. Tập trung vào độ tin cậy và sự hữu ích của thông tin truyền miệng kỹ thuật số.',
  description_en = 'Measures the impact of online consumer reviews on purchase intentions, focusing on informational value and credibility.',
  tags = ARRAY['eWOM', 'Social Media', 'Marketing', 'Digital Consumer'],
  category = ARRAY['Marketing'],
  research_model = 'eWOM -> Brand Trust -> Purchase Intention'
WHERE name_vi ILIKE '%Truyền miệng trực tuyến%';

-- 2. Purchase Intention
UPDATE "scales" SET 
  author = 'Dodds, Monroe, & Grewal', year = 1991,
  citation = 'Dodds, W. B., Monroe, K. B., & Grewal, D. (1991). Effects of price, brand, and store information on buyers'' product evaluations.',
  description_vi = 'Thang đo kinh điển đo lường khả năng một cá nhân thực hiện hành vi mua một sản phẩm hoặc dịch vụ trong tương lai gần.',
  description_en = 'A classic scale measuring the likelihood of a consumer purchasing a specific product or service.',
  tags = ARRAY['Intention', 'Behavior', 'Purchase'],
  category = ARRAY['Marketing'],
  research_model = 'Attitude -> Purchase Intention -> Actual Purchase'
WHERE name_vi ILIKE '%Ý định mua hàng%';

-- 3. Brand Trust
UPDATE "scales" SET 
  author = 'Chaudhuri & Holbrook', year = 2001,
  citation = 'Chaudhuri, A., & Holbrook, M. B. (2001). The chain of effects from brand trust and brand affect to brand performance: the role of brand loyalty.',
  description_vi = 'Đo lường niềm tin của khách hàng vào khả năng thực hiện lời hứa của thương hiệu và sự cam kết về chất lượng.',
  description_en = 'Measures the willingness of the average consumer to rely on the ability of the brand to perform its stated function.',
  tags = ARRAY['Brand Trust', 'Relationship', 'Branding'],
  category = ARRAY['Marketing'],
  research_model = 'Brand Experience -> Brand Trust -> Brand Loyalty'
WHERE name_vi ILIKE '%Niềm tin thương hiệu%';

-- 4. Perceived Value (PERVAL)
UPDATE "scales" SET 
  author = 'Sweeney & Soutar', year = 2001,
  citation = 'Sweeney, J. C., & Soutar, G. N. (2001). Consumer perceived value: The development of a multiple item scale.',
  description_vi = 'Thang đo PERVAL phân tách giá trị cảm nhận thành 4 khía cạnh: Giá trị chất lượng, Giá trị cảm xúc, Giá trị xã hội và Giá định giá.',
  description_en = 'A multidimensional scale that measures quality, emotional, social, and price value perceived by consumers.',
  tags = ARRAY['Perceived Value', 'Consumer Value', 'Quality'],
  category = ARRAY['Marketing'],
  research_model = 'Product Features -> Perceived Value -> Satisfaction'
WHERE name_vi ILIKE '%Giá trị cảm nhận%';

-- 5. Brand Image
UPDATE "scales" SET 
  author = 'David Aaker', year = 1996,
  citation = 'Aaker, D. A. (1996). Building strong brands. Free Press.',
  description_vi = 'Đo lường tập hợp các liên tưởng đến thương hiệu trong tâm trí khách hàng, bao gồm các thuộc tính hữu hình và vô hình.',
  description_en = 'Assesses the set of brand associations in the consumer''s mind regarding both tangible and intangible attributes.',
  tags = ARRAY['Brand Image', 'Positioning', 'Marketing'],
  category = ARRAY['Marketing'],
  research_model = 'Marketing Mix -> Brand Image -> Brand Equity'
WHERE name_vi ILIKE '%Hình ảnh thương hiệu%';

-- 6. Social Media Engagement
UPDATE "scales" SET 
  author = 'Hollebeek et al.', year = 2014,
  citation = 'Hollebeek, L. D., Glynn, M. S., & Brodie, R. J. (2014). Consumer brand engagement in social media: Conceptualization, scale development and validation.',
  description_vi = 'Đo lường sự gắn kết của người tiêu dùng trên mạng xã hội qua các khía cạnh nhận thức, cảm xúc và hành vi.',
  description_en = 'Measures consumer-brand engagement in social media contexts along cognitive, affective, and behavioral dimensions.',
  tags = ARRAY['Social Media', 'Engagement', 'Digital Marketing'],
  category = ARRAY['Marketing'],
  research_model = 'Content Strategy -> Social Media Engagement -> Loyalty'
WHERE name_vi ILIKE '%Tương tác Thương hiệu trên MXH%';

-- 7. Influencer Credibility
UPDATE "scales" SET 
  author = 'Ohanian', year = 1990,
  citation = 'Ohanian, R. (1990). Construction and validation of a scale to measure celebrity endorsers'' perceived expertise, trustworthiness, and attractiveness.',
  description_vi = 'Đo lường độ tin cậy của Influencer thông qua 3 yếu tố: Chuyên môn (Expertise), Sự tin tưởng (Trustworthiness) và Sự thu hút (Attractiveness).',
  description_en = 'The Ohanian scale measures the source credibility of endorsers/influencers through expertise, trustworthiness, and attractiveness.',
  tags = ARRAY['Influencer', 'Credibility', 'Advertising'],
  category = ARRAY['Marketing'],
  research_model = 'Influencer Match -> Credibility -> Purchase Intention'
WHERE name_vi ILIKE '%Độ tin cậy Influencer%';

-- 8. Customer Engagement (Brodie)
UPDATE "scales" SET 
  author = 'Brodie et al.', year = 2011,
  citation = 'Brodie, R. J., Hollebeek, L. D., Jurić, B., & Ilić, A. (2011). Customer engagement: Conceptual domain, fundamental propositions, and theoretical framework.',
  description_vi = 'Khung lý thuyết về sự gắn kết khách hàng vượt ra ngoài hành vi mua sắm, tập trung vào sự tham gia tâm lý của khách hàng với thương hiệu.',
  description_en = 'A framework for customer engagement beyond purchase behavior, focusing on a psychological state that occurs through interactive customer experiences.',
  tags = ARRAY['Customer Engagement', 'Experiential Marketing'],
  category = ARRAY['Marketing'],
  research_model = 'Experience -> Customer Engagement -> Retention'
WHERE name_vi ILIKE '%Sự gắn kết nhân viên%' AND category @> ARRAY['Marketing']::varchar[]; -- Sửa lỗi nếu có sự nhầm lẫn với HR

-- 9. Perceived Risk
UPDATE "scales" SET 
  author = 'Stone & Gronhaug', year = 1993,
  citation = 'Stone, R. N., & Gronhaug, K. (1993). Perceived risk: Further considerations for the marketing discipline.',
  description_vi = 'Đo lường sự không chắc chắn và hậu quả tiêu cực cảm nhận được của khách hàng khi mua sản phẩm: rủi ro tài chính, rủi ro xã hội, rủi ro chức năng.',
  description_en = 'Assesses the consumer''s perceived uncertainty and adverse consequences of buying a product or service.',
  tags = ARRAY['Risk', 'Consumer Behavior', 'Barrier'],
  category = ARRAY['Marketing'],
  research_model = 'Perceived Risk -> Trust -> Intention to Buy (Negative relationship)'
WHERE name_vi ILIKE '%Nhận thức Rủi ro%';

-- 10. Digitalization / IT Infusion in Marketing
UPDATE "scales" SET 
  author = 'Zhu et al.', year = 2006,
  citation = 'Zhu, K., Kraemer, K. L., & Xu, S. (2006). The process of innovation assimilation by firms in different countries: A technology diffusion perspective on e-business.',
  description_vi = 'Đo lường mức độ thâm nhập của công nghệ số vào các quy trình kinh doanh và marketing của doanh nghiệp.',
  description_en = 'Measures the depth and breadth of digital technology integration into marketing and business processes.',
  tags = ARRAY['Digitalization', 'Innovation', 'E-Business'],
  category = ARRAY['Marketing', 'MIS'],
  research_model = 'Resources -> Digitalization -> Competitive Advantage'
WHERE name_vi ILIKE '%Sự thâm nhập công nghệ%';
