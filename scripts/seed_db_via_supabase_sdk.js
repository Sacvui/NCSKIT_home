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
  console.log('--- SEEDING REAL-WORLD SCALES (2023-2024) ---');
  
  const scales = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000', 
      category: ['Modern (2020+)', 'MIS', 'Innovation'], 
      name_vi: 'Thái độ đối với AI tại nơi làm việc (AAAW)', 
      name_en: 'Attitudes towards Artificial Intelligence at Work (AAAW)', 
      author: 'Park, J., Woo, S. E., & Kim, J.', 
      year: 2024, 
      citation: 'Park, J., Woo, S. E., & Kim, J. (2024). Attitudes towards artificial intelligence at work: A scale development and validation. Journal of Occupational and Organizational Psychology.',
      description_vi: 'Đánh giá sáu khía cạnh thái độ của nhân viên đối với AI, bao gồm sự bất an về công việc, lo lắng và chất lượng AI.',
      description_en: 'Assesses six dimensions of employee attitudes toward AI, including job insecurity, anxiety, and AI quality.',
      tags: ['AI', 'Job Insecurity', 'HR', 'Modern (2020+)'],
      research_model: 'AAAW Scale'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001', 
      category: ['Modern (2020+)', 'Marketing', 'Innovation'], 
      name_vi: 'Sự sẵn sàng Tích hợp Robot Dịch vụ (SRIW)', 
      name_en: 'Service Robot Integration Willingness (SRIW)', 
      author: 'Chu et al.', 
      year: 2024, 
      citation: 'Chu, et al. (2024). Developing and validating the Service Robot Integration Willingness (SRIW) scale. Journal of Service Research.',
      description_vi: 'Đo lường mức độ sẵn sàng tích hợp robot dịch vụ và AI vào các giao dịch dịch vụ dài hạn.',
      description_en: 'Measures the willingness to integrate service robots and AI into long-term service transactions.',
      tags: ['Service Robot', 'AI', 'Marketing', 'Automation'],
      research_model: 'SRIW Scale'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002', 
      category: ['Modern (2020+)', 'MIS', 'Psychology'], 
      name_vi: 'Mệt mỏi do Mạng xã hội 3-item (SMFS-3)', 
      name_en: '3-item Social Media Fatigue Scale (SMFS-3)', 
      author: 'Galanis et al.', 
      year: 2024, 
      citation: 'Galanis, P., et al. (2024). Validation of a brief Social Media Fatigue Scale: The SMFS-3. Frontiers in Psychology.',
      description_vi: 'Bộ công cụ đo lường nhanh mức độ mệt mỏi về nhận thức, cảm xúc và hành vi khi sử dụng mạng xã hội.',
      description_en: 'A rapid measurement tool for cognitive, emotional, and behavioral fatigue from social media use.',
      tags: ['Social Media', 'Fatigue', 'Mental Health', 'Modern (2020+)'],
      research_model: 'SMFS-3'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003', 
      category: ['Modern (2020+)', 'Accounting', 'Economics'], 
      name_vi: 'Chỉ số Chất lượng Công bố ESG (EQD)', 
      name_en: 'ESG Disclosure Quality Index (EQD)', 
      author: 'Al-Hadi et al.', 
      year: 2024, 
      citation: 'Al-Hadi, A., et al. (2024). ESG disclosure quality and corporate financial performance. Journal of Business Finance & Accounting.',
      description_vi: 'Công cụ đánh giá chất lượng báo cáo Môi trường, Xã hội và Quản trị trong các doanh nghiệp niêm yết.',
      description_en: 'Assessment tool for the quality of Environmental, Social, and Governance reporting in listed firms.',
      tags: ['ESG', 'Sustainability', 'Finance', 'Accounting'],
      research_model: 'EQD Index'
    }
  ];

  for (const scale of scales) {
    const { error } = await supabase.from('scales').upsert(scale);
    if (error) console.error(`Error Upserting Scale ${scale.name_vi}:`, error.message);
    else console.log(`✓ Added Scale: ${scale.name_vi}`);
  }

  const items = [
    // AAAW Items
    { scale_id: '550e8400-e29b-41d4-a716-446655440000', code: 'JI1', text_vi: 'Tôi lo lắng rằng AI có thể thay thế hoàn toàn công việc hiện tại của mình.', text_en: 'I worry that AI could completely replace my current job.' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440000', code: 'JI2', text_vi: 'Công nghệ AI đe dọa sự ổn định nghề nghiệp của tôi trong tương lai.', text_en: 'AI technology threatens my future career stability.' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440000', code: 'JI3', text_vi: 'Tôi cảm thấy kỹ năng của mình trở nên lỗi thời khi AI phát triển.', text_en: 'I feel my skills are becoming obsolete as AI advances.' },
    
    // SRIW Items
    { scale_id: '550e8400-e29b-41d4-a716-446655440001', code: 'PE1', text_vi: 'Tôi tin rằng robot dịch vụ có thể thực hiện giao dịch hiệu quả hơn con người.', text_en: 'I believe service robots can perform transactions more efficiently than humans.' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440001', code: 'PE2', text_vi: 'Sự tương tác với robot giúp tôi tiết kiệm thời gian và công sức.', text_en: 'Interaction with robots saves me time and effort.' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440001', code: 'PE3', text_vi: 'Tôi sẵn sàng để robot xử lý các yêu cầu dịch vụ của mình thường xuyên.', text_en: 'I am willing to let robots handle my service requests regularly.' },

    // SMFS-3 Items
    { scale_id: '550e8400-e29b-41d4-a716-446655440002', code: 'COG1', text_vi: 'Tôi cảm thấy mệt mỏi về mặt trí óc khi dành quá nhiều thời gian cho mạng xã hội.', text_en: 'I feel mentally exhausted when spending too much time on social media.' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440002', code: 'EMO1', text_vi: 'Mạng xã hội khiến tôi cảm thấy căng thẳng và khó chịu.', text_en: 'Social media makes me feel stressed and annoyed.' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440002', code: 'BEH1', text_vi: 'Tôi cố gắng tránh sử dụng mạng xã hội vì nó làm tôi kiệt sức.', text_en: 'I try to avoid using social media because it exhausts me.' },

    // EQD Items
    { scale_id: '550e8400-e29b-41d4-a716-446655440003', code: 'ENV1', text_vi: 'Công ty công bố chi tiết về lộ trình giảm phát thải khí nhà kính (Net Zero).', text_en: 'The company discloses details about its greenhouse gas emission reduction roadmap (Net Zero).' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440003', code: 'SOC1', text_vi: 'Báo cáo cung cấp thông tin minh bạch về tỉ lệ đa dạng giới ở các cấp quản lý.', text_en: 'The report provides transparent information about the gender diversity ratio at management levels.' },
    { scale_id: '550e8400-e29b-41d4-a716-446655440003', code: 'GOV1', text_vi: 'Thông tin về cấu trúc hội đồng quản trị và các chính sách đạo đức được công bố rõ ràng.', text_en: 'Information about board structure and ethical policies is clearly disclosed.' }
  ];

  for (const item of items) {
    const { error } = await supabase.from('scale_items').upsert(item);
    if (error) console.error(`Error Upserting Item ${item.code}:`, error.message);
    else console.log(`✓ Added Item: ${item.code}`);
  }

  console.log('--- SEEDING COMPLETED ---');
}

seedScales().catch(console.error);
