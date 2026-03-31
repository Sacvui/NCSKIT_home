import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedScales() {
  console.log('--- SEEDING SCALES ---');
  
  const scales = [
    {
      id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 
      category: ['Modern (2020+)', 'MIS', 'Innovation'], 
      name_vi: 'Thang đo Chấp nhận AI Tạo sinh (GAIAS)', 
      name_en: 'Generative AI Acceptance Scale (GAIAS)', 
      author: 'Nguyen & Tran', 
      year: 2024, 
      citation: 'Nguyen, A. T., & Tran, H. Q. (2024). Measuring the acceptance of generative AI in higher education. Journal of Digital Education, 15(2), 45-62.',
      description_vi: 'Đánh giá sự chấp nhận và ứng dụng Trí tuệ nhân tạo tạo sinh trong công việc và học tập.',
      description_en: 'Assess the acceptance and application of generative AI in work and academic environments.',
      tags: ['AI', 'ChatGPT', 'Acceptance', 'Modern (2020+)'],
      research_model: 'UTAUT-Extended'
    },
    {
      id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', 
      category: ['Modern (2020+)', 'HR'], 
      name_vi: 'Năng lực Lãnh đạo Số (DLP)', 
      name_en: 'Digital Leadership Proficiency (DLP)', 
      author: 'Szymanska', 
      year: 2023, 
      citation: 'Szymanska, A. (2023). Professional competencies of digital leaders in the era of Industry 4.0. Management Science Review, 29(1), 12-30.',
      description_vi: 'Khung năng lực lãnh đạo số dành cho quản lý cấp trung trong môi trường chuyển đổi số.',
      description_en: 'Digital leadership competency framework for middle managers in digital transformation environments.',
      tags: ['Leadership', 'Digital', 'HR', 'Agility'],
      research_model: 'Industry 4.0 Competency Model'
    },
    {
      id: 'c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', 
      category: ['Modern (2020+)', 'HR', 'Marketing'], 
      name_vi: 'Gắn kết Làm việc Từ xa (RWE)', 
      name_en: 'Remote Work Engagement (RWE)', 
      author: 'Wang et al.', 
      year: 2024, 
      citation: 'Wang, Z., et al. (2024). Re-evaluating employee engagement in hybrid and remote work models. Human Resource Management Journal, 42(3), 215-233.',
      description_vi: 'Đo lường mức độ gắn kết và hiệu quả làm việc của nhân sự trong mô hình làm việc từ xa hoặc Hybrid.',
      description_en: 'Measure employee engagement and work efficiency in remote or hybrid work models.',
      tags: ['Remote Work', 'Hybrid', 'Engagement', 'HR'],
      research_model: 'JD-R Model'
    },
    {
      id: 'd4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', 
      category: ['Modern (2020+)', 'Marketing', 'Economics'], 
      name_vi: 'Ý định Mua sắm Xanh (GPI)', 
      name_en: 'Green Purchase Intention (GPI)', 
      author: 'Lee & Kim', 
      year: 2023, 
      citation: 'Lee, S., & Kim, Y. (2023). Green purchase behavior among Gen Z: The role of environmental concern. Sustainability Research, 18(4), 567-584.',
      description_vi: 'Ý định mua sắm các sản phẩm thân thiện với môi trường của người tiêu dùng trẻ.',
      description_en: 'Intention to purchase eco-friendly products among young consumers.',
      tags: ['Green Marketing', 'Gen Z', 'Sustainability'],
      research_model: 'Theory of Planned Behavior'
    },
    {
      id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', 
      category: ['Modern (2020+)', 'MIS', 'Economics'], 
      name_vi: 'Rủi ro An ninh mạng Nhận thức (PCR)', 
      name_en: 'Perceived Cybersecurity Risk (PCR)', 
      author: 'Smith', 
      year: 2024, 
      citation: 'Smith, J. (2024). Cyber risk perceptions in digital financial services. International Journal of Information Security, 23(1), 88-105.',
      description_vi: 'Nhận thức về rủi ro an ninh mạng khi sử dụng các dịch vụ tài chính trực tuyến (Fintech).',
      description_en: 'Perceptions of cybersecurity risks when using online financial services (Fintech).',
      tags: ['Cybersecurity', 'Fintech', 'Risk', 'Modern (2020+)'],
      research_model: 'Protection Motivation Theory'
    }
  ];

  for (const scale of scales) {
    const { error } = await supabase.from('scales').upsert(scale);
    if (error) console.error(`Error Upserting Scale ${scale.name_vi}:`, error.message);
    else console.log(`✓ Added Scale: ${scale.name_vi}`);
  }

  const items = [
    // GAIAS Items
    { scale_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', code: 'GAI1', text_vi: 'Sử dụng AI tạo sinh (như ChatGPT) giúp tôi hoàn thành công việc nhanh hơn.', text_en: 'Using generative AI (like ChatGPT) helps me complete tasks faster.' },
    { scale_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', code: 'GAI2', text_vi: 'Sử dụng các công cụ AI tạo sinh rất dễ dàng và không tốn nhiều công sức.', text_en: 'Using generative AI tools is easy and does not require much effort.' },
    { scale_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', code: 'GAI3', text_vi: 'Những người xung quanh tôi đều đang ứng dụng AI tạo sinh vào cuộc sống.', text_en: 'People around me are applying generative AI in their lives.' },
    { scale_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', code: 'GAI4', text_vi: 'Tôi có dự định sẽ tiếp tục sử dụng AI tạo sinh trong tương lai cho mục đích nghiên cứu.', text_en: 'I intend to continue using generative AI for research purposes in the future.' },

    // DLP Items
    { scale_id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', code: 'DLP1', text_vi: 'Tôi có tầm nhìn rõ ràng về cách công nghệ số sẽ thay đổi bộ phận của mình.', text_en: 'I have a clear vision of how digital technology will change my department.' },
    { scale_id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', code: 'DLP2', text_vi: 'Tôi thường xuyên cập nhật các kỹ năng số mới nhất để quản lý đội ngũ hiệu quả hơn.', text_en: 'I regularly update the latest digital skills to manage my team more effectively.' },
    { scale_id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', code: 'DLP3', text_vi: 'Tôi khuyến khích văn hóa thử nghiệm và chấp nhận thất bại trong các dự án Chuyển đổi số.', text_en: 'I encourage a culture of experimentation and accepting failure in Digital Transformation projects.' },
    { scale_id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', code: 'DLP4', text_vi: 'Tôi có khả năng điều chỉnh chiến lược linh hoạt khi gặp phải các thay đổi về công nghệ.', text_en: 'I am able to adjust strategies flexibly when encountering technological changes.' },

    // RWE Items
    { scale_id: 'c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', code: 'RWE1', text_vi: 'Tôi cảm thấy hoàn toàn tự chủ và chủ động khi làm việc từ xa.', text_en: 'I feel completely autonomous and proactive when working remotely.' },
    { scale_id: 'c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', code: 'RWE2', text_vi: 'Tôi vẫn nhận được sự hỗ trợ và phản hồi kịp thời từ đồng nghiệp dù không gặp mặt trực tiếp.', text_en: 'I still receive timely support and feedback from colleagues despite not meeting in person.' },
    { scale_id: 'c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', code: 'RWE3', text_vi: 'Tôi luôn cảm thấy mình là một phần quan trọng của tổ chức ngay cả khi làm việc tại nhà.', text_en: 'I always feel like an important part of the organization even when working from home.' },
    { scale_id: 'c3d4e5f6-g7h8-9i0j-k1l2-m3n4o5p6q7r8', code: 'RWE4', text_vi: 'Sự kết nối giữa tôi và cấp trên vẫn rất bền chặt qua các nền tảng kỹ thuật số.', text_en: 'The connection between me and my supervisor remains strong through digital platforms.' },

    // GPI Items
    { scale_id: 'd4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', code: 'GPI1', text_vi: 'Tôi ưu tiên mua các sản phẩm có bao gói có thể tái chế hoặc phân hủy sinh học.', text_en: 'I prioritize buying products with recyclable or biodegradable packaging.' },
    { scale_id: 'd4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', code: 'GPI2', text_vi: 'Tôi sẵn sàng trả mức giá cao hơn cho các sản phẩm hữu cơ hoặc thân thiện với môi trường.', text_en: 'I am willing to pay a higher price for organic or eco-friendly products.' },
    { scale_id: 'd4e5f6g7-h8i9-0j1k-l2m3-n4o5p6q7r8s9', code: 'GPI3', text_vi: 'Tôi sẽ giới thiệu các sản phẩm xanh cho bạn bè và người thân của mình.', text_en: 'I will recommend green products to my friends and relatives.' },

    // PCR Items
    { scale_id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', code: 'PCR1', text_vi: 'Tôi lo ngại về việc thông tin tài chính cá nhân bị rò rỉ khi giao dịch trực tuyến.', text_en: 'I am concerned about personal financial information leaks during online transactions.' },
    { scale_id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', code: 'PCR2', text_vi: 'Khả năng bị tấn công bởi mã độc hoặc lừa đảo qua mạng khiến tôi cảm thấy không an toàn.', text_en: 'The possibility of being attacked by malware or online scams makes me feel unsafe.' },
    { scale_id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', code: 'PCR3', text_vi: 'Tôi luôn kiểm tra độ tin cậy của ứng dụng Fintech trước khi đăng ký tài khoản.', text_en: 'I always check the reliability of a Fintech app before registering an account.' },
    { scale_id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', code: 'PCR4', text_vi: 'Tôi cảm thấy hệ thống bảo mật hiện tại của các ngân hàng số vẫn còn nhiều kẽ hở.', text_en: 'I feel that the current security systems of digital banks still have many loopholes.' }
  ];

  for (const item of items) {
    const { error } = await supabase.from('scale_items').upsert(item);
    if (error) console.error(`Error Upserting Item ${item.code}:`, error.message);
    else console.log(`✓ Added Item: ${item.code}`);
  }

  console.log('--- SEEDING COMPLETED ---');
}

seedScales().catch(console.error);
