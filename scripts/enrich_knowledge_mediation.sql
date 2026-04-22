-- ncsStat Knowledge Enrichment: Mediation & Moderation Mega-Guide
-- Objective: Detailed content for Mediation/Moderation article

INSERT INTO knowledge_articles (id, slug, category, title_vi, title_en, icon_name, expert_tip_vi, content_structure)
VALUES (
  gen_random_uuid(),
  'mediation-moderation-analysis-guide',
  'Core Statistics',
  'Phân tích Trung gian và Điều tiết: Khám phá Cơ chế Tác động',
  'Mediation & Moderation Analysis: Exploring Causal Mechanisms',
  'Zap',
  'Mẹo từ chuyên gia: Luôn sử dụng kỹ thuật Bootstrapping (với mẫu lặp >= 5000) khi kiểm tra tác động trung gian để đảm bảo tính chuẩn xác của kết luận.',
  '[
    {
      "h2_vi": "1. Biến Trung gian (Mediation): Giải thích TẠI SAO?",
      "h2_en": "1. Mediation: Explaining WHY?",
      "content_vi": "Biến trung gian (M) giải thích cơ chế mà qua đó biến độc lập (X) tác động đến biến phụ thuộc (Y). Chúng tôi đi sâu vào quy trình kiểm tra tác động gián tiếp, từ kiểm định Sobel truyền thống đến phương pháp Bootstrapping hiện đại được tích hợp trong ncsStat, giúp bạn xác định xem tác động đó là Trung gian toàn phần hay Trung gian một phần.",
      "content_en": "Mediation (M) explains the process through which X affects Y. We cover indirect effects testing from Sobel to modern Bootstrapping methods."
    },
    {
      "h2_vi": "2. Biến Điều tiết (Moderation): Giải thích KHI NÀO?",
      "h2_en": "2. Moderation: Explaining WHEN?",
      "content_vi": "Biến điều tiết (W) làm thay đổi cường độ hoặc hướng của mối quan hệ giữa X và Y. Bài viết hướng dẫn cách tạo biến tương tác (interaction term), cách đọc đồ thị dốc (simple slopes plot) và cách giải thích ý nghĩa của hệ số tương tác trong các mô hình thực tế.",
      "content_en": "Moderation (W) changes the strength or direction of the X-Y relationship. We guide you through interaction terms and simple slopes plots."
    },
    {
      "h2_vi": "3. Phân biệt rõ rệt giữa Trung gian và Điều tiết",
      "h2_en": "3. Key Differences: Mediation vs Moderation",
      "content_vi": "Rất nhiều nhà nghiên cứu nhầm lẫn giữa hai khái niệm này. Chúng tôi cung cấp bảng so sánh trực quan về mặt lý thuyết và mô hình hóa (Path Diagram), giúp bạn lựa chọn đúng cấu trúc mô hình ngay từ giai đoạn thiết kế nghiên cứu.",
      "content_en": "Many researchers confuse these two. We provide a clear comparison of theoretical frameworks and path diagrams."
    },
    {
      "h2_vi": "4. Phân tích Bootstrapping: Tiêu chuẩn vàng hiện đại",
      "h2_en": "4. Bootstrapping: The Modern Gold Standard",
      "content_vi": "Tại sao không nên dùng kiểm định Sobel? ncsStat ưu tiên sử dụng Bootstrapping vì nó không đòi hỏi giả định về phân phối chuẩn của tác động gián tiếp. Chúng tôi giải thích cách đọc khoảng tin cậy (Confidence Intervals) để khẳng định ý nghĩa thống kê của các mối quan hệ phức tạp.",
      "content_en": "Why avoid Sobel? ncsStat uses Bootstrapping for indirect effects, as it doesn''t assume normal distribution. Learn to read Confidence Intervals for robust results."
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content_structure = EXCLUDED.content_structure,
    expert_tip_vi = EXCLUDED.expert_tip_vi;
