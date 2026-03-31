-- ============================================================================
-- ncsStat2 - Seed Data for Modern Research Scales (2023-2024)
-- ============================================================================

-- 1. Insert New Scales (Knowledge)
INSERT INTO public.scales (
    id, category, name_vi, name_en, author, year, citation, 
    description_vi, description_en, tags, research_model
) VALUES 
(
    'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 
    ARRAY['Modern (2020+)', 'MIS', 'Innovation'], 
    'Thang đo Chấp nhận AI Tạo sinh (GAIAS)', 
    'Generative AI Acceptance Scale (GAIAS)', 
    'Nguyen & Tran', 
    2024, 
    'Nguyen, A. T., & Tran, H. Q. (2024). Measuring the acceptance of generative AI in higher education. Journal of Digital Education, 15(2), 45-62.',
    'Đánh giá sự chấp nhận và ứng dụng Trí tuệ nhân tạo tạo sinh trong công việc và học tập.',
    'Assess the acceptance and application of generative AI in work and academic environments.',
    ARRAY['AI', 'ChatGPT', 'Acceptance', 'Modern (2020+)'],
    'UTAUT-Extended'
),
(
    'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 
    ARRAY['Modern (2020+)', 'HR'], 
    'Năng lực Lãnh đạo Số (DLP)', 
    'Digital Leadership Proficiency (DLP)', 
    'Szymanska', 
    2023, 
    'Szymanska, A. (2023). Professional competencies of digital leaders in the era of Industry 4.0. Management Science Review, 29(1), 12-30.',
    'Khung năng lực lãnh đạo số dành cho quản lý cấp trung trong môi trường chuyển đổi số.',
    'Digital leadership competency framework for middle managers in digital transformation environments.',
    ARRAY['Leadership', 'Digital', 'HR', 'Agility'],
    'Industry 4.0 Competency Model'
),
(
    'c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', 
    ARRAY['Modern (2020+)', 'HR', 'Marketing'], 
    'Gắn kết Làm việc Từ xa (RWE)', 
    'Remote Work Engagement (RWE)', 
    'Wang et al.', 
    2024, 
    'Wang, Z., et al. (2024). Re-evaluating employee engagement in hybrid and remote work models. Human Resource Management Journal, 42(3), 215-233.',
    'Đo lường mức độ gắn kết và hiệu quả làm việc của nhân sự trong mô hình làm việc từ xa hoặc Hybrid.',
    'Measure employee engagement and work efficiency in remote or hybrid work models.',
    ARRAY['Remote Work', 'Hybrid', 'Engagement', 'HR'],
    'JD-R Model'
),
(
    'd4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', 
    ARRAY['Modern (2020+)', 'Marketing', 'Economics'], 
    'Ý định Mua sắm Xanh (GPI)', 
    'Green Purchase Intention (GPI)', 
    'Lee & Kim', 
    2023, 
    'Lee, S., & Kim, Y. (2023). Green purchase behavior among Gen Z: The role of environmental concern. Sustainability Research, 18(4), 567-584.',
    'Ý định mua sắm các sản phẩm thân thiện với môi trường của người tiêu dùng trẻ.',
    'Intention to purchase eco-friendly products among young consumers.',
    ARRAY['Green Marketing', 'Gen Z', 'Sustainability'],
    'Theory of Planned Behavior'
),
(
    'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 
    ARRAY['Modern (2020+)', 'MIS', 'Economics'], 
    'Rủi ro An ninh mạng Nhận thức (PCR)', 
    'Perceived Cybersecurity Risk (PCR)', 
    'Smith', 
    2024, 
    'Smith, J. (2024). Cyber risk perceptions in digital financial services. International Journal of Information Security, 23(1), 88-105.',
    'Nhận thức về rủi ro an ninh mạng khi sử dụng các dịch vụ tài chính trực tuyến (Fintech).',
    'Perceptions of cybersecurity risks when using online financial services (Fintech).',
    ARRAY['Cybersecurity', 'Fintech', 'Risk', 'Modern (2020+)'],
    'Protection Motivation Theory'
);

-- 2. Insert New Scale Items (Variables)
INSERT INTO public.scale_items (scale_id, code, text_vi, text_en) VALUES
-- GAIAS Items
('a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 'GAI1', 'Sử dụng AI tạo sinh (như ChatGPT) giúp tôi hoàn thành công việc nhanh hơn.', 'Using generative AI (like ChatGPT) helps me complete tasks faster.'),
('a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 'GAI2', 'Sử dụng các công cụ AI tạo sinh rất dễ dàng và không tốn nhiều công sức.', 'Using generative AI tools is easy and does not require much effort.'),
('a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 'GAI3', 'Những người xung quanh tôi đều đang ứng dụng AI tạo sinh vào cuộc sống.', 'People around me are applying generative AI in their lives.'),
('a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 'GAI4', 'Tôi có dự định sẽ tiếp tục sử dụng AI tạo sinh trong tương lai cho mục đích nghiên cứu.', 'I intend to continue using generative AI for research purposes in the future.'),

-- DLP Items
('b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 'DLP1', 'Tôi có tầm nhìn rõ ràng về cách công nghệ số sẽ thay đổi bộ phận của mình.', 'I have a clear vision of how digital technology will change my department.'),
('b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 'DLP2', 'Tôi thường xuyên cập nhật các kỹ năng số mới nhất để quản lý đội ngũ hiệu quả hơn.', 'I regularly update the latest digital skills to manage my team more effectively.'),
('b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 'DLP3', 'Tôi khuyến khích văn hóa thử nghiệm và chấp nhận thất bại trong các dự án Chuyển đổi số.', 'I encourage a culture of experimentation and accepting failure in Digital Transformation projects.'),
('b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 'DLP4', 'Tôi có khả năng điều chỉnh chiến lược linh hoạt khi gặp phải các thay đổi về công nghệ.', 'I am able to adjust strategies flexibly when encountering technological changes.'),

-- RWE Items
('c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', 'RWE1', 'Tôi cảm thấy hoàn toàn tự chủ và chủ động khi làm việc từ xa.', 'I feel completely autonomous and proactive when working remotely.'),
('c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', 'RWE2', 'Tôi vẫn nhận được sự hỗ trợ và phản hồi kịp thời từ đồng nghiệp dù không gặp mặt trực tiếp.', 'I still receive timely support and feedback from colleagues despite not meeting in person.'),
('c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', 'RWE3', 'Tôi luôn cảm thấy mình là một phần quan trọng của tổ chức ngay cả khi làm việc tại nhà.', 'I always feel like an important part of the organization even when working from home.'),
('c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', 'RWE4', 'Sự kết nối giữa tôi và cấp trên vẫn rất bền chặt qua các nền tảng kỹ thuật số.', 'The connection between me and my supervisor remains strong through digital platforms.'),

-- GPI Items
('d4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', 'GPI1', 'Tôi ưu tiên mua các sản phẩm có bao gói có thể tái chế hoặc phân hủy sinh học.', 'I prioritize buying products with recyclable or biodegradable packaging.'),
('d4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', 'GPI2', 'Tôi sẵn sàng trả mức giá cao hơn cho các sản phẩm hữu cơ hoặc thân thiện với môi trường.', 'I am willing to pay a higher price for organic or eco-friendly products.'),
('d4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', 'GPI3', 'Tôi sẽ giới thiệu các sản phẩm xanh cho bạn bè và người thân của mình.', 'I will recommend green products to my friends and relatives.'),

-- PCR Items
('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 'PCR1', 'Tôi lo ngại về việc thông tin tài chính cá nhân bị rò rỉ khi giao dịch trực tuyến.', 'I am concerned about personal financial information leaks during online transactions.'),
('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 'PCR2', 'Khả năng bị tấn công bởi mã độc hoặc lừa đảo qua mạng khiến tôi cảm thấy không an toàn.', 'The possibility of being attacked by malware or online scams makes me feel unsafe.'),
('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 'PCR3', 'Tôi luôn kiểm tra độ tin cậy của ứng dụng Fintech trước khi đăng ký tài khoản.', 'I always check the reliability of a Fintech app before registering an account.'),
('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 'PCR4', 'Tôi cảm thấy hệ thống bảo mật hiện tại của các ngân hàng số vẫn còn nhiều kẽ hở.', 'I feel that the current security systems of digital banks still have many loopholes.');
