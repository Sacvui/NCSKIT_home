-- Hóa giải sự "đơn giản" của các Thang đo bằng nội dung học thuật chuyên sâu
-- 1. Cập nhật TAM
UPDATE "scales" 
SET 
  author = 'Fred D. Davis',
  year = 1989,
  citation = 'Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS quarterly, 319-340.',
  description_vi = 'Mô hình Chấp nhận Công nghệ (TAM) là khung lý thuyết phổ biến nhất để giải thích hành vi chấp nhận công nghệ thông tin. Thang đo tập trung vào hai yếu tố cốt lõi: Nhận thức sự hữu ích (PU) và Nhận thức tính dễ sử dụng (PEOU).',
  description_en = 'The Technology Acceptance Model (TAM) is an information systems theory that models how users come to accept and use a technology. It focuses on Perceived Usefulness (PU) and Perceived Ease of Use (PEOU).',
  tags = ARRAY['Technology', 'Acceptance', 'MIS', 'Behavior', 'Classic'],
  category = ARRAY['MIS', 'Modern (2020+)'],
  research_model = 'Antecedents -> Attitude -> Intention'
WHERE name_en ILIKE '%Technology Acceptance Model%' OR name_vi ILIKE '%Chap nhan cong nghe%';

-- 2. Cập nhật TPB
UPDATE "scales" 
SET 
  author = 'Icek Ajzen',
  year = 1991,
  citation = 'Ajzen, I. (1991). The theory of planned behavior. Organizational behavior and human decision processes, 50(2), 179-211.',
  description_vi = 'Thuyết Hành vi Dự định (TPB) mở rộng từ thuyết hành động hợp lý, bổ sung thêm yếu tố Nhận thức kiểm soát hành vi (PBC) bên cạnh Thái độ và Chuẩn chủ quan. Đây là nền tảng cho mọi nghiên cứu về Ý định hành vi.',
  description_en = 'The Theory of Planned Behavior (TPB) link beliefs and behavior. It improves upon the theory of reasoned action by including perceived behavioral control.',
  tags = ARRAY['Psychology', 'Behavior', 'Intention', 'Human Action'],
  category = ARRAY['Psychology', 'Marketing'],
  research_model = 'Attitude, Subjective Norm, PBC -> Intention'
WHERE name_en ILIKE '%Theory of Planned Behavior%' OR name_vi ILIKE '%Thuyết Hành vi dự định%';

-- 3. Cập nhật SERVQUAL
UPDATE "scales" 
SET 
  author = 'Parasuraman, Zeithaml, & Berry',
  year = 1988,
  citation = 'Parasuraman, A., Zeithaml, V. A., & Berry, L. L. (1988). Servqual: A multiple-item scale for measuring consumer perceptions of service quality. Journal of retailing, 64(1).',
  description_vi = 'Thang đo SERVQUAL đo lường chất lượng dịch vụ thông qua 5 khía cạnh: Tin cậy, Đáp ứng, Năng lực phục vụ, Đồng cảm và Phương tiện hữu hình. Đây là tiêu chuẩn vàng trong quản trị dịch vụ.',
  description_en = 'SERVQUAL is a multi-dimensional research instrument designed to capture consumer expectations and perceptions of a service along five dimensions.',
  tags = ARRAY['Service Quality', 'Marketing', 'Satisfaction', 'Retailing'],
  category = ARRAY['Marketing'],
  research_model = 'Dimensions -> Service Quality -> Satisfaction'
WHERE name_en ILIKE '%SERVQUAL%' OR name_vi ILIKE '%Chat luong dich vu%';

-- 4. Cập nhật Customer Loyalty
UPDATE "scales" 
SET 
  author = 'Richard L. Oliver',
  year = 1997,
  citation = 'Oliver, R. L. (1997). Satisfaction: A Behavioral Perspective on the Consumer. Routledge.',
  description_vi = 'Mô hình lòng trung thành của Oliver phân tách thành 4 giai đoạn: Nhận thức, Cảm xúc, Ý định và Hành động. Giúp doanh nghiệp hiểu sâu mức độ gắn kết của khách hàng.',
  description_en = 'Oliver''s four-stage loyalty model describes loyalty developing through cognitive, affective, conative, and finally action phases.',
  tags = ARRAY['Loyalty', 'Relationship Marketing', 'Retention'],
  category = ARRAY['Marketing'],
  research_model = 'Satisfaction -> Loyalty -> CRM'
WHERE name_en ILIKE '%Loyalty%' OR name_vi ILIKE '%Sá»± trung thÃ nh thÆ°Æ¡ng hiá»‡u%';
