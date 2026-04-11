-- RE-OPTIMIZE MARKETING SCALES (CLEAN PUSH)
SET client_encoding = 'UTF8';

-- Template function-like logic using DO block to handle Update/Insert
DO $$
BEGIN
    -- 1. eWOM
    IF EXISTS (SELECT 1 FROM scales WHERE name_vi ILIKE '%Truyền miệng trực tuyến%') THEN
        UPDATE scales SET author = 'Bambauer-Sachse & Mangold', year = 2011,
        citation = 'Bambauer-Sachse, C., & Mangold, S. (2011). Let the consumer be the judge: The predictive power of online consumer reviews. Marketing Letters.',
        description_vi = 'Đo lường tác động của các đánh giá trực tuyến đến ý định mua hàng. Tập trung vào tính hữu ích và độ tin cậy của thông tin.',
        description_en = 'Measures the impact of online consumer reviews on purchase intentions.',
        tags = ARRAY['eWOM', 'Social Media', 'Marketing'], category = ARRAY['Marketing']
        WHERE name_vi ILIKE '%Truyền miệng trực tuyến%';
    END IF;

    -- 2. Purchase Intention
    IF EXISTS (SELECT 1 FROM scales WHERE name_vi ILIKE '%Ý định mua hàng%') THEN
        UPDATE scales SET author = 'Dodds, Monroe, & Grewal', year = 1991,
        citation = 'Dodds, W. B., Monroe, K. B., & Grewal, D. (1991). Effects of price, brand, and store information on buyers'' product evaluations.',
        description_vi = 'Đo lường khả năng khách hàng sẽ mua sản phẩm trong tương lai.',
        description_en = 'Measures the likelihood of a consumer purchasing a specific product.',
        tags = ARRAY['Intention', 'Purchase'], category = ARRAY['Marketing']
        WHERE name_vi ILIKE '%Ý định mua hàng%';
    END IF;

    -- 3. Brand Trust (Insert if missing)
    IF NOT EXISTS (SELECT 1 FROM scales WHERE name_en ILIKE 'Brand Trust') THEN
        INSERT INTO scales (id, name_vi, name_en, author, year, citation, description_vi, description_en, tags, category)
        VALUES (gen_random_uuid(), 'Niềm tin thương hiệu', 'Brand Trust', 'Chaudhuri & Holbrook', 2001, 'Chaudhuri, A., & Holbrook, M. B. (2001). The chain of effects from brand trust and brand affect to brand performance. Journal of Marketing.', 
        'Đo lường sự tin tưởng của người tiêu dùng vào sự ổn định và đáng tin của thương hiệu.', 'Measures the willingness of the consumer to rely on the brand.', 
        ARRAY['Brand Trust', 'Marketing'], ARRAY['Marketing']);
    END IF;

    -- 4. Perceived Value
    UPDATE scales SET author = 'Sweeney & Soutar', year = 2001,
    citation = 'Sweeney, J. C., & Soutar, G. N. (2001). Consumer perceived value: The development of a multiple item scale. Journal of Retailing.',
    description_vi = 'Thang đo PERVAL phân tách giá trị thành 4 nhóm: Chất lượng, Cảm xúc, Xã hội và Giá cả.',
    description_en = 'Multidimensional scale measuring quality, emotional, social, and functional value.',
    tags = ARRAY['Perceived Value', 'Consumer Value'], category = ARRAY['Marketing']
    WHERE name_vi ILIKE '%Giá trị cảm nhận%';

    -- 5. Brand Image (Insert if missing)
    IF NOT EXISTS (SELECT 1 FROM scales WHERE name_en ILIKE 'Brand Image') THEN
        INSERT INTO scales (id, name_vi, name_en, author, year, citation, description_vi, description_en, tags, category)
        VALUES (gen_random_uuid(), 'Hình ảnh thương hiệu', 'Brand Image', 'David Aaker', 1996, 'Aaker, D. A. (1996). Building strong brands. Free Press.',
        'Tập hợp các liên tưởng thương hiệu trong tâm trí khách hàng.', 'The set of brand associations in the consumer''s memory.',
        ARRAY['Brand Image', 'Marketing'], ARRAY['Marketing']);
    END IF;

    -- 6. Social Media Engagement
    UPDATE scales SET author = 'Hollebeek et al.', year = 2014,
    citation = 'Hollebeek, L. D., Glynn, M. S., & Brodie, R. J. (2014). Consumer brand engagement in social media. Journal of Interactive Marketing.',
    description_vi = 'Đo lường sự gắn kết của khách hàng trên các nền tảng mạng xã hội.',
    description_en = 'Customer brand engagement in social media contexts.',
    tags = ARRAY['Engagement', 'Social Media'], category = ARRAY['Marketing']
    WHERE name_vi ILIKE '%Tương tác Thương hiệu trên MXH%';

    -- 7. Influencer Credibility
    UPDATE scales SET author = 'Ohanian', year = 1990,
    citation = 'Ohanian, R. (1990). Construction and validation of a scale to measure celebrity endorsers'' perceived expertise, trustworthiness, and attractiveness.',
    description_vi = 'Đo lường độ tin cậy của người có ảnh hưởng qua chuyên môn, sự tin tưởng và sức hút.',
    description_en = 'Measures influencer credibility through expertise, trust, and attractiveness.',
    tags = ARRAY['Influencer', 'Credibility'], category = ARRAY['Marketing']
    WHERE name_vi ILIKE '%Độ tin cậy Influencer%';

    -- 8. Customer Satisfaction (Oliver)
    UPDATE scales SET author = 'Richard L. Oliver', year = 1980,
    citation = 'Oliver, R. L. (1980). A cognitive model of the antecedents and consequences of satisfaction decisions. Journal of Marketing Research.',
    description_vi = 'Thang đo chuẩn về sự hài lòng dựa trên lý thuyết về sự kỳ vọng và xác nhận (Expectancy-Disconfirmation Theory).',
    description_en = 'The classic model of customer satisfaction based on expectancy-disconfirmation.',
    tags = ARRAY['Satisfaction', 'Consumer Behavior'], category = ARRAY['Marketing']
    WHERE name_vi ILIKE '%Sự hài lòng khách hàng%';

    -- 9. Brand Loyalty
    UPDATE scales SET author = 'Richard L. Oliver', year = 1999,
    citation = 'Oliver, R. L. (1999). Whence consumer loyalty? Journal of Marketing.',
    description_vi = 'Đo lường lòng trung thành qua 4 giai đoạn: Nhận thức, Cảm xúc, Ý định và Hành vi.',
    description_en = 'Measures loyalty along the cognitive, affective, conative, and action stages.',
    tags = ARRAY['Loyalty', 'Retention'], category = ARRAY['Marketing']
    WHERE name_vi ILIKE '%Sự trung thành thương hiệu%';

    -- 10. AIDA Model (Consumer Journey)
    IF NOT EXISTS (SELECT 1 FROM scales WHERE name_en ILIKE 'AIDA Model') THEN
        INSERT INTO scales (id, name_vi, name_en, author, year, citation, description_vi, description_en, tags, category)
        VALUES (gen_random_uuid(), 'Mô hình AIDA', 'AIDA Model', 'Strong', 1925, 'Strong, E. K. (1925). The Psychology of Selling. McGraw-Hill.',
        'Khung lý thuyết về hành trình khách hàng: Chú ý, Thú vị, Mong muốn và Hành động.', 'The classic hierarchy-of-effects model: Attention, Interest, Desire, Action.',
        ARRAY['AIDA', 'Consumer Journey'], ARRAY['Marketing']);
    END IF;

END $$;
