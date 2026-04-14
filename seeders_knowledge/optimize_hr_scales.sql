-- PHASE 1: HR & MANAGEMENT SCALE ENRICHMENT
-- 1. Transformational Leadership
UPDATE "scales" SET 
  author = 'Bass & Avolio', year = 1994,
  citation = 'Bass, B. M., & Avolio, B. J. (1994). Improving organizational effectiveness through transformational leadership. Sage.',
  description_vi = 'Thang đo MLQ (Multifactor Leadership Questionnaire) đo lường 4 thành tố: Ảnh hưởng lý tưởng hóa, Truyền cảm hứng, Kích thích trí tuệ và Quan tâm cá nhân.',
  description_en = 'The MLQ assesses transformational leadership through idealized influence, inspirational motivation, intellectual stimulation, and individualized consideration.',
  tags = ARRAY['Leadership', 'Management', 'HR', 'Organizational Behavior'],
  category = ARRAY['HR'],
  research_model = 'Leadership -> Employee Engagement -> Performance'
WHERE name_vi ILIKE '%Lãnh đạo Chuyển đổi%';

-- 2. Job Satisfaction (MSQ)
UPDATE "scales" SET 
  author = 'Weiss, Dawis, England, & Lofquist', year = 1967,
  citation = 'Weiss, D. J., Dawis, R. V., & England, G. W. (1967). Manual for the Minnesota Satisfaction Questionnaire.',
  description_vi = 'Thang đo MSQ (Minnesota Satisfaction Questionnaire) đo lường mức độ hài lòng với công việc qua các khía cạnh nội tại và ngoại tại như lương thưởng, đồng nghiệp và sự tự chủ.',
  description_en = 'The MSQ measures job satisfaction based on intrinsic and extrinsic reinforcement factors in the workplace.',
  tags = ARRAY['Satisfaction', 'HR', 'Employee Well-being'],
  category = ARRAY['HR'],
  research_model = 'Job Characteristics -> Satisfaction -> Retention'
WHERE name_vi ILIKE '%Sự hài lòng công việc%';

-- 3. Organizational Commitment
UPDATE "scales" SET 
  author = 'Meyer & Allen', year = 1991,
  citation = 'Meyer, J. P., & Allen, N. J. (1991). A three-component conceptualization of organizational commitment. Human resource management review.',
  description_vi = 'Mô hình cam kết 3 thành phần: Tình cảm (Affective), Duy trì (Continuance) và Chuẩn mực (Normative). Giải mã lý do nhân viên gắn bó với tổ chức.',
  description_en = 'Describes organizational commitment through affective, continuance, and normative dimensions.',
  tags = ARRAY['Commitment', 'HR', 'Turnover'],
  category = ARRAY['HR'],
  research_model = 'HR Practices -> Commitment -> Performance'
WHERE name_vi ILIKE '%Cam kết tổ chức%';

-- 4. Work Engagement (UWES)
UPDATE "scales" SET 
  author = 'Schaufeli et al.', year = 2006,
  citation = 'Schaufeli, W. B., Bakker, A. B., & Salanova, M. (2006). The measurement of work engagement with a short questionnaire. Educational and psychological measurement.',
  description_vi = 'Thang đo UWES-9 đo lường sự gắn kết công việc qua 3 khía cạnh: Sức sống (Vigor), Sự tận tâm (Dedication) và Sự hấp thụ (Absorption).',
  description_en = 'The Utrecht Work Engagement Scale (UWES) measures vigor, dedication, and absorption at work.',
  tags = ARRAY['Engagement', 'Productivity', 'HR'],
  category = ARRAY['HR'],
  research_model = 'Resources -> Engagement -> Task Performance'
WHERE name_vi ILIKE '%Sự gắn kết công việc%';

-- 5. Psychological Safety
UPDATE "scales" SET 
  author = 'Amy Edmondson', year = 1999,
  citation = 'Edmondson, A. (1999). Psychological safety and learning behavior in work teams. Administrative science quarterly.',
  description_vi = 'Đo lường niềm tin chung của các thành viên trong nhóm rằng nhóm là nơi an toàn để chấp nhận rủi ro giữa các cá nhân mà không sợ bị trừng phạt.',
  description_en = 'Measures the shared belief that the team is safe for interpersonal risk-taking without fear of negative consequences.',
  tags = ARRAY['Safety', 'Teamwork', 'Innovation', 'Culture'],
  category = ARRAY['HR', 'Psychology'],
  research_model = 'Safety -> Team Learning -> Unit Performance'
WHERE name_vi ILIKE '%An toàn tâm lý%';

-- 6. Turnover Intention
UPDATE "scales" SET 
  author = 'Mobley et al.', year = 1978,
  citation = 'Mobley, W. H., Horner, S. O., & Hollingsworth, A. T. (1978). An evaluation of precursors of hospital employee turnover. Journal of Applied psychology.',
  description_vi = 'Đo lường ý định rời bỏ tổ chức của nhân viên, là biến số kết quả quan trọng nhất trong các nghiên cứu về quản trị nguồn nhân lực.',
  description_en = 'Measures the cognitive process and intention of an employee to leave their current organization.',
  tags = ARRAY['Turnover', 'Retention', 'HR Strategy'],
  category = ARRAY['HR'],
  research_model = 'Dissatisfaction -> Turnover Intention -> Actual Turnover'
WHERE name_vi ILIKE '%Ý định nghỉ việc%';

-- 7. Organizational Citizenship Behavior (OCB)
UPDATE "scales" SET 
  author = 'Dennis Organ', year = 1988,
  citation = 'Organ, D. W. (1988). Organizational citizenship behavior: The good soldier syndrome. Lexington Books.',
  description_vi = 'Hành vi công dân tổ chức (OCB) là những đóng góp vượt ngoài mô tả công việc, giúp tổ chức vận hành trơn tru và hiệu quả hơn.',
  description_en = 'Voluntary behaviors that are not part of an employee''s formal job requirements but promote the effective functioning of the organization.',
  tags = ARRAY['OCB', 'Employee Behavior', 'Altruism'],
  category = ARRAY['HR'],
  research_model = 'Leadership -> OCB -> Group Productivity'
WHERE name_vi ILIKE '%Hành vi công dân tổ chức%';

-- 8. Ethical Leadership
UPDATE "scales" SET 
  author = 'Brown, Treviño, & Harrison', year = 2005,
  citation = 'Brown, M. E., Treviño, L. K., & Harrison, D. A. (2005). Ethical leadership: A social learning perspective for construct development and testing.',
  description_vi = 'Đo lường phong cách lãnh đạo chuẩn mực thông qua hành động cá nhân và các mối quan hệ giao tiếp, thúc đẩy đạo đức trong tổ chức.',
  description_en = 'The demonstration of normatively appropriate conduct through personal actions and interpersonal relationships.',
  tags = ARRAY['Ethics', 'Leadership', 'Culture'],
  category = ARRAY['HR'],
  research_model = 'Ethical Leadership -> Trust -> Deviant Behavior (Negative)'
WHERE name_vi ILIKE '%Lãnh đạo đạo đức%';
