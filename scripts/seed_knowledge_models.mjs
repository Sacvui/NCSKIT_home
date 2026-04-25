import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Note: In this environment, we use the mcp_supabase_query tool usually, 
// but for a large batch of complex JSON, a script might be cleaner to organize.
// However, I will output the final SQL or use the tool directly if possible.

const articles = [
  {
    slug: 'technology-acceptance-model-tam',
    category: 'Research Models',
    title_vi: 'Mô hình Chấp nhận Công nghệ (TAM): Hướng dẫn Chuyên sâu',
    title_en: 'Technology Acceptance Model (TAM): The Ultimate Guide',
    expert_tip_vi: 'Để bài báo TAM đạt chuẩn Scopus Q1, hãy tích hợp thêm biến \"Personal Innovativeness\" hoặc các biến điều tiết như Age/Gender để tăng tính mới.',
    expert_tip_en: 'To reach Q1 journals with TAM, integrate \"Personal Innovativeness\" or moderators like Age/Gender to enhance theoretical novelty.',
    icon_name: 'TrendingUp',
    content_structure: [
      { h2_vi: '1. Nguồn gốc và Ý nghĩa', h2_en: '1. Origin and Significance', content_vi: 'Được Fred Davis giới thiệu năm 1989, TAM là mô hình nền tảng trong nghiên cứu hành vi người dùng đối với công nghệ thông tin.', content_en: 'Introduced by Fred Davis in 1989, TAM is a cornerstone model for studying user behavior toward information technology.' },
      { h2_vi: '2. Sơ đồ Mô hình TAM', h2_en: '2. TAM Model Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/tam_model.png\" alt=\"TAM Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/tam_model.png\" alt=\"TAM Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' },
      { h2_vi: '3. Các thành phần cốt lõi', h2_en: '3. Core Constructs', content_vi: 'PU (Sự hữu ích cảm nhận) và PEOU (Sự dễ sử dụng cảm nhận) là hai tiền tố quyết định ý định sử dụng.', content_en: 'PU (Perceived Usefulness) and PEOU (Perceived Ease of Use) are the two primary antecedents of usage intention.' }
    ]
  },
  {
    slug: 'theory-of-planned-behavior-tpb',
    category: 'Behavioral Research',
    title_vi: 'Thuyết Hành vi Dự định (TPB): Giải mã Ý định',
    title_en: 'Theory of Planned Behavior (TPB): Decoding Intentions',
    expert_tip_vi: 'Biến \"Nhận thức kiểm soát hành vi\" (PBC) thường có tác động trực tiếp đến cả Ý định và Hành vi thực tế.',
    expert_tip_en: 'Perceived Behavioral Control (PBC) often has a direct impact on both Intention and Actual Behavior.',
    icon_name: 'Brain',
    content_structure: [
      { h2_vi: '1. Giới thiệu về TPB', h2_en: '1. Introduction to TPB', content_vi: 'TPB mở rộng từ Thuyết Hành động Hợp lý (TRA) bằng cách thêm vào nhân tố kiểm soát hành vi.', content_en: 'TPB extends the Theory of Reasoned Action (TRA) by adding the behavioral control factor.' },
      { h2_vi: '2. Sơ đồ Mô hình TPB', h2_en: '2. TPB Model Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/tpb_model.png\" alt=\"TPB Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/tpb_model.png\" alt=\"TPB Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' },
      { h2_vi: '3. Thái độ, Chuẩn chủ quan và PBC', h2_en: '3. Attitude, Subjective Norm, and PBC', content_vi: 'Ba nhân tố này kết hợp để tạo nên Ý định hành vi của cá nhân.', content_en: 'These three factors combine to form an individual\'s behavioral intention.' }
    ]
  },
  {
    slug: 'servqual-service-quality-model',
    category: 'Marketing Research',
    title_vi: 'Mô hình SERVQUAL: Đo lường Chất lượng Dịch vụ',
    title_en: 'SERVQUAL: Measuring Service Quality',
    expert_tip_vi: 'Trong bối cảnh số hóa, hãy xem xét sử dụng E-SERVQUAL để đo lường chất lượng dịch vụ trên nền tảng online.',
    expert_tip_en: 'In digital contexts, consider using E-SERVQUAL to measure service quality on online platforms.',
    icon_name: 'Layers',
    content_structure: [
      { h2_vi: '1. Khung lý thuyết RATER', h2_en: '1. The RATER Framework', content_vi: 'SERVQUAL đánh giá chất lượng qua 5 khía cạnh: Tin cậy, Đáp ứng, Năng lực phục vụ, Đồng cảm và Phương tiện hữu hình.', content_en: 'SERVQUAL evaluates quality through 5 dimensions: Reliability, Responsiveness, Assurance, Empathy, and Tangibles.' },
      { h2_vi: '2. Sơ đồ SERVQUAL', h2_en: '2. SERVQUAL Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/servqual_model.png\" alt=\"SERVQUAL Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/servqual_model.png\" alt=\"SERVQUAL Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  },
  {
    slug: 'utaut-technology-adoption',
    category: 'Research Models',
    title_vi: 'Thuyết Hợp nhất Chấp nhận Công nghệ (UTAUT)',
    title_en: 'UTAUT: Unified Theory of Acceptance and Use of Technology',
    expert_tip_vi: 'UTAUT mạnh hơn TAM nhờ việc đưa vào các biến điều tiết như Độ tuổi, Giới tính và Kinh nghiệm.',
    expert_tip_en: 'UTAUT is more robust than TAM as it incorporates moderators like Age, Gender, and Experience.',
    icon_name: 'Zap',
    content_structure: [
      { h2_vi: '1. Tại sao lại là UTAUT?', h2_en: '1. Why UTAUT?', content_vi: 'UTAUT được xây dựng để hợp nhất 8 lý thuyết chấp nhận công nghệ hàng đầu thế giới.', content_en: 'UTAUT was developed to unify 8 leading technology adoption theories.' },
      { h2_vi: '2. Sơ đồ UTAUT', h2_en: '2. UTAUT Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/utaut_model.png\" alt=\"UTAUT Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/utaut_model.png\" alt=\"UTAUT Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  },
  {
    slug: 'porter-five-forces-analysis',
    category: 'Market Strategy',
    title_vi: 'Mô hình 5 Áp lực Cạnh tranh của Michael Porter',
    title_en: 'Porter\'s Five Forces Analysis',
    expert_tip_vi: 'Đừng chỉ liệt kê các áp lực, hãy phân tích sự tương tác giữa chúng để tìm ra vị thế chiến lược.',
    expert_tip_en: 'Don\'t just list the forces; analyze their interactions to find your strategic positioning.',
    icon_name: 'ShieldCheck',
    content_structure: [
      { h2_vi: '1. Phân tích Cấu trúc Ngành', h2_en: '1. Industry Structure Analysis', content_vi: 'Michael Porter giúp doanh nghiệp hiểu rõ môi trường cạnh tranh thông qua 5 lực lượng cơ bản.', content_en: 'Michael Porter helps businesses understand the competitive environment through 5 fundamental forces.' },
      { h2_vi: '2. Sơ đồ 5 Áp lực', h2_en: '2. Five Forces Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/porter_5_forces.png\" alt=\"Porter Five Forces\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/porter_5_forces.png\" alt=\"Porter Five Forces\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  },
  {
    slug: 'vrio-framework-strategy',
    category: 'Market Strategy',
    title_vi: 'Khung VRIO: Đánh giá Nguồn lực Doanh nghiệp',
    title_en: 'VRIO Framework: Assessing Corporate Resources',
    expert_tip_vi: 'Nguồn lực chỉ tạo ra lợi thế bền vững khi nó thỏa mãn đồng thời cả 4 yếu tố V-R-I-O.',
    expert_tip_en: 'Resources only create sustainable advantage when they simultaneously satisfy all 4 V-R-I-O factors.',
    icon_name: 'Layers',
    content_structure: [
      { h2_vi: '1. Lý thuyết Dựa trên Nguồn lực (RBV)', h2_en: '1. Resource-Based View (RBV)', content_vi: 'RBV tập trung vào nội lực thay vì môi trường bên ngoài để tìm kiếm lợi thế cạnh tranh.', content_en: 'RBV focuses on internal strengths rather than the external environment to find competitive advantage.' },
      { h2_vi: '2. Sơ đồ VRIO', h2_en: '2. VRIO Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/vrio_framework.png\" alt=\"VRIO Framework\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/vrio_framework.png\" alt=\"VRIO Framework\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  },
  {
    slug: 'expectation-confirmation-theory-ect',
    category: 'Marketing Research',
    title_vi: 'Thuyết Kỳ vọng - Xác nhận (ECT) trong Marketing',
    title_en: 'Expectation-Confirmation Theory (ECT) in Marketing',
    expert_tip_vi: 'Sự hài lòng là kết quả của việc so sánh giữa kỳ vọng và trải nghiệm thực tế.',
    expert_tip_en: 'Satisfaction is the result of comparing expectations with actual experience.',
    icon_name: 'BookOpen',
    content_structure: [
      { h2_vi: '1. Quy trình tâm lý của khách hàng', h2_en: '1. The Consumer Psychological Process', content_vi: 'ECT giải thích cách khách hàng hình thành ý định tiếp tục sử dụng dịch vụ.', content_en: 'ECT explains how consumers form intentions to continue using a service.' },
      { h2_vi: '2. Sơ đồ ECT', h2_en: '2. ECT Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/ect_model.png\" alt=\"ECT Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/ect_model.png\" alt=\"ECT Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  },
  {
    slug: 'sor-model-marketing-behavior',
    category: 'Behavioral Research',
    title_vi: 'Mô hình S-O-R: Kích thích - Cơ thể - Phản hồi',
    title_en: 'S-O-R Model: Stimulus-Organism-Response',
    expert_tip_vi: 'Mô hình này cực kỳ hiệu quả trong nghiên cứu Marketing trải nghiệm và hành vi tại điểm bán.',
    expert_tip_en: 'This model is extremely effective in experiential marketing and point-of-sale behavior research.',
    icon_name: 'Zap',
    content_structure: [
      { h2_vi: '1. Môi trường và Cảm xúc', h2_en: '1. Environment and Emotion', content_vi: 'S-O-R nghiên cứu cách các yếu tố bên ngoài tác động đến tâm lý và dẫn đến hành vi mua sắm.', content_en: 'S-O-R studies how external factors impact psychology and lead to shopping behavior.' },
      { h2_vi: '2. Sơ đồ S-O-R', h2_en: '2. S-O-R Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/sor_model.png\" alt=\"SOR Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/sor_model.png\" alt=\"SOR Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  },
  {
    slug: 'perceived-value-marketing-strategy',
    category: 'Marketing Research',
    title_vi: 'Mô hình Giá trị Cảm nhận (Perceived Value)',
    title_en: 'Perceived Value in Marketing Strategy',
    expert_tip_vi: 'Giá trị cảm nhận không chỉ là giá cả, nó bao gồm cả các yếu tố phi tiền tệ như thời gian và nỗ lực.',
    expert_tip_en: 'Perceived value is not just about price; it includes non-monetary factors like time and effort.',
    icon_name: 'TrendingUp',
    content_structure: [
      { h2_vi: '1. Định nghĩa Giá trị', h2_en: '1. Defining Value', content_vi: 'Người dùng đánh giá lợi ích nhận được so với chi phí bỏ ra.', content_en: 'Users evaluate the benefits received relative to the costs incurred.' },
      { h2_vi: '2. Sơ đồ Giá trị Cảm nhận', h2_en: '2. Perceived Value Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/perceived_value.png\" alt=\"Perceived Value Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/perceived_value.png\" alt=\"Perceived Value Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  },
  {
    slug: 'tce-transaction-cost-economics-strategy',
    category: 'Advanced Research',
    title_vi: 'Kinh tế học Chi phí Giao dịch (TCE)',
    title_en: 'Transaction Cost Economics (TCE) in Strategy',
    expert_tip_vi: 'TCE giúp giải thích lý do tại sao các doanh nghiệp chọn sát nhập hoặc thuê ngoài thay vì tự sản xuất.',
    expert_tip_en: 'TCE explains why firms choose to merge or outsource instead of producing in-house.',
    icon_name: 'Hash',
    content_structure: [
      { h2_vi: '1. Lý thuyết của Ronald Coase', h2_en: '1. Ronald Coase\'s Theory', content_vi: 'Chi phí giao dịch là rào cản chính ảnh hưởng đến cấu trúc tổ chức.', content_en: 'Transaction costs are the main barrier affecting organizational structure.' },
      { h2_vi: '2. Sơ đồ TCE', h2_en: '2. TCE Diagram', is_html: true, content_vi: '<img src=\"/images/knowledge/tce_model.png\" alt=\"TCE Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />', content_en: '<img src=\"/images/knowledge/tce_model.png\" alt=\"TCE Model\" class=\"rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full\" />' }
    ]
  }
];

// In the real environment, I will use mcp_supabase_query to insert these.
// Since I can't run this script as an agent directly, I will convert it to a SQL statement.
