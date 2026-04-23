-- ncsStat Knowledge Enrichment: THE RESEARCH MODEL MASTERCLASS (QWEN EDITION)
-- Objective: Deep-dive, expert-level academic content for Research Models

INSERT INTO knowledge_articles (id, slug, category, title_vi, title_en, icon_name, expert_tip_vi, content_structure)
VALUES (
  gen_random_uuid(),
  'what-is-a-research-model',
  'Research Design',
  'Bản chất và Cấu trúc Mô hình Nghiên cứu: Từ Triết học đến Thực thi SEM',
  'Nature and Structure of Research Models: From Philosophy to SEM Execution',
  'Network',
  'Mẹo từ chuyên gia: Một mô hình xuất sắc không nằm ở số lượng mũi tên, mà nằm ở tính Logic của các Giả thuyết (Hypotheses). Hãy nhớ: "Lý thuyết là bản đồ, còn Mô hình là con đường cụ thể bạn chọn đi". Hãy ưu tiên tính Tinh giản (Parsimony) để đạt hiệu suất giải thích cao nhất.',
  '[
    {
      "h2_vi": "1. Bản chất luận (Ontology) và Sự kiến tạo thực tại trong Mô hình",
      "h2_en": "1. Ontology and the Construction of Reality in Modeling",
      "content_vi": "Mọi mô hình nghiên cứu đều là một nỗ lực nhằm đơn giản hóa thực tại phức tạp. Tuy nhiên, NCS thường mắc sai lầm khi coi mô hình là ''sự thật hiển nhiên''. Thực chất, nó bắt nguồn từ Bản chất luận (Ontology): Bạn tin rằng thế giới tồn tại khách quan (Thực chứng) hay được kiến tạo qua lăng kính con người (Diễn giải)? \n\nKhi bạn vẽ một mũi tên từ X đến Y, bạn đang thực hiện một lời tuyên bố về nhân quả. Trong thống kê hiện đại, mô hình chính là một ''Hệ thống các phương trình đồng thời'' thể hiện sự hiệp biến giữa các khái niệm. Hiểu rõ vị thế triết học giúp bạn không bị lúng túng khi hội đồng hỏi: ''Tại sao bạn tin rằng X gây ra Y mà không phải ngược lại?''",
      "content_en": "Every research model is an attempt to simplify complex reality. It stems from Ontology: do you believe the world exists objectively or is constructed through human lenses?"
    },
    {
      "h2_vi": "2. Khung Lý thuyết vs Khung Khái niệm: Cuộc đối thoại giữa Kế thừa và Sáng tạo",
      "h2_en": "2. Theoretical vs Conceptual Frameworks: Inheritance vs. Creation",
      "content_vi": "Đây là nơi NCS thường bị ''đánh trượt'' ngay từ vòng đề cương. \n- **Khung Lý thuyết (Theoretical Framework)**: Là hệ thống các định luật đã được chuẩn hóa (ví dụ: Thuyết Hành động Hợp lý - TRA). Nó đóng vai trò như ''bộ lọc'' để bạn chọn lọc các biến số. \n- **Khung Khái niệm (Conceptual Framework)**: Là sơ đồ cụ thể mà bạn đề xuất cho nghiên cứu của mình. \n\nSự sắc sảo của một bài báo quốc tế nằm ở cách bạn ''Contextualize'' (Ngữ cảnh hóa) lý thuyết gốc vào một môi trường mới (ví dụ: Áp dụng thuyết Trao đổi Xã hội vào bối cảnh Nền kinh tế Chia sẻ). Đừng chỉ liệt kê lý thuyết, hãy giải thích cách lý thuyết đó ''vận hành'' trong mô hình của bạn.",
      "content_en": "The distinction between Theoretical and Conceptual Frameworks is where many candidates fail. One is the established laws; the other is your specific proposal."
    },
    {
      "h2_vi": "3. Phân tầng Biến số: Logic của các mối liên kết nội tại",
      "h2_en": "3. Variable Taxonomy: The Logic of Internal Linkages",
      "content_vi": "Đừng coi các biến số là những thực thể độc lập. Trong một mô hình SEM chuẩn, chúng ta phân chia thành: \n- **Biến Ngoại sinh (Exogenous)**: Những biến đóng vai trò là nguyên nhân khởi đầu, không chịu tác động từ các biến khác trong mô hình. \n- **Biến Nội sinh (Endogenous)**: Những biến là kết quả hoặc mắt xích trung gian. \n\nĐặc biệt, NCS cần phân biệt rõ **Biến Trung gian (Mediator)** - giải thích cơ chế (The process), và **Biến Điều tiết (Moderator)** - xác định điều kiện biên (The context). Một mô hình thiếu biến điều tiết thường bị coi là ''quá lý tưởng hóa'', trong khi thiếu biến trung gian sẽ khiến bài nghiên cứu trở nên ''hời hợt'' vì không giải thích được cơ chế tác động ngầm.",
      "content_en": "In a standard SEM model, we distinguish between Exogenous (cause) and Endogenous (effect/link) variables."
    },
    {
      "h2_vi": "4. Minh họa cấu trúc: Các dạng Mô hình từ Đơn giản đến Phức tạp",
      "h2_en": "4. Structural Illustrations: From Simple to Complex Models",
      "content_vi": "Chúng tôi mô phỏng các cấu trúc tư duy thông qua các sơ đồ logic: \n\n**A. Mô hình Tác động Trực tiếp (Direct Effect):**\n`[X] ----(H1)----> [Y]`\nĐây là nền tảng, nhưng hiếm khi đủ để đăng bài trên các tạp chí lớn.\n\n**B. Mô hình Trung gian (Mediation):**\n`[X] ----> [M] ----> [Y]`\nGiải mã cơ chế truyền dẫn. Tác động của X lên Y được thực hiện thông qua biến M.\n\n**C. Mô hình Điều tiết (Moderation):**\n`[X] ----> [Y]`\n`      |`\n`    [W]`\nBiến W làm thay đổi ''độ dốc'' của mối quan hệ giữa X và Y. Đây chính là yếu tố tạo nên sự đột phá cho đề tài.",
      "content_en": "We simulate thinking structures through logical diagrams: Direct, Mediation, and Moderation structures."
    },
    {
      "h2_vi": "5. Thư viện Case Study: Giải phẫu các Mô hình Đại diện",
      "h2_en": "5. Case Study Library: Anatomy of Representative Models",
      "content_vi": "Chúng tôi không chỉ giới thiệu tên, mà ''mổ xẻ'' logic của chúng: \n- **TAM (Davis, 1989)**: Tại sao ''Sự hữu ích'' lại quan trọng hơn ''Sự dễ sử dụng''? Vì con người sẵn sàng vượt qua khó khăn nếu kết quả mang lại giá trị lớn. \n- **UTAUT2 (Venkatesh, 2012)**: Sự chuyển dịch từ bối cảnh tổ chức sang bối cảnh người tiêu dùng cá nhân, bổ sung Động lực hưởng thụ (Hedonic Motivation) - một yếu tố phi lý trí nhưng quyết định hành vi mua sắm. \n- **S-O-R (Stimulus-Organism-Response)**: Cách môi trường vật lý tác động đến cảm xúc bên trong để dẫn đến hành vi. \n\nHãy học cách các học giả lớn lập luận để áp dụng vào việc xây dựng mô hình của riêng bạn.",
      "content_en": "We don''t just introduce names; we dissect their logic, from TAM''s utility focus to UTAUT2''s consumer perspective."
    },
    {
      "h2_vi": "6. Quy tắc Parsimony và Nghệ thuật của sự Tinh giản trong Khoa học",
      "h2_en": "6. The Rule of Parsimony and the Art of Scientific Simplicity",
      "content_vi": "Một mô hình có 20 mũi tên không có nghĩa là nó giỏi. Ngược lại, nó thể hiện sự lúng túng của nhà nghiên cứu trong việc xác định các biến số then chốt. Quy tắc Parsimony (Sự tinh giản) yêu cầu bạn: Hãy chọn mô hình đơn giản nhất mà vẫn giải thích được nhiều biến thiên của dữ liệu nhất (R-squared). \n\nNCS cần học cách ''cắt tỉa'' các giả thuyết yếu để làm nổi bật lên những mối quan hệ mang tính đột phá. ncsStat giúp bạn so sánh các mô hình lồng nhau (Nested models) thông qua chỉ số Chi-square difference để tìm ra điểm cân bằng hoàn hảo giữa độ phức tạp và sức mạnh giải thích.",
      "content_en": "A model with 20 arrows isn''t necessarily better; it often shows the researcher''s confusion. Parsimony requires the simplest model with maximum explanatory power."
    },
    {
      "h2_vi": "7. Từ Bản vẽ đến Thực thi: Quy trình Chuyển đổi sang Lavaan/SEM",
      "h2_en": "7. From Drawing to Execution: Transitioning to Lavaan/SEM",
      "content_vi": "Mô hình trên giấy chỉ là một ý niệm. Để nó trở thành khoa học, bạn phải chuyển đổi nó thành các biểu thức toán học. ncsStat tự động hóa quy trình này: Sơ đồ của bạn sẽ được dịch sang ngôn ngữ `lavaan` của R. \n\nChúng tôi hướng dẫn bạn cách đọc các chỉ số Model Fit (Độ phù hợp mô hình) như RMSEA, CFI, TLI. Nếu các chỉ số này không đạt, điều đó có nghĩa là cấu trúc lý thuyết của bạn chưa khớp với thực tại dữ liệu. Đây là lúc bạn cần xem xét lại logic của các mũi tên hoặc kiểm tra lại chất lượng thang đo.",
      "content_en": "A paper model is just a concept. To make it scientific, you must convert it into mathematical expressions using ncsStat''s automation."
    },
    {
      "h2_vi": "8. Ngã rẽ Quyết định: CB-SEM (Lavaan) hay PLS-SEM (SmartPLS Style)?",
      "h2_en": "8. Decision Crossroads: CB-SEM vs. PLS-SEM",
      "content_vi": "Đây là câu hỏi kinh điển trong giới học thuật. \n- **CB-SEM (Covariance-based)**: Ưu tiên tính chính xác của lý thuyết, đòi hỏi phân phối chuẩn và cỡ mẫu lớn. Phù hợp để kiểm định/xác nhận lý thuyết (Confirmatory). \n- **PLS-SEM (Partial Least Squares)**: Linh hoạt hơn với cỡ mẫu nhỏ, không yêu cầu phân phối chuẩn, và cực kỳ mạnh mẽ trong việc dự báo (Predictive). Phù hợp khi bạn muốn khám phá hoặc mở rộng lý thuyết hiện có. \n\nncsStat cung cấp cả hai bộ máy mạnh mẽ nhất (lavaan & seminr) để bạn không phải đánh đổi giữa tính hàn lâm và tính thực tiễn. Hãy chọn CB-SEM nếu bạn muốn ''chứng minh'' và chọn PLS-SEM nếu bạn muốn ''dự báo''.",
      "content_en": "Choose CB-SEM (Lavaan) for theory confirmation and PLS-SEM (seminr) for predictive power and complex models with non-normal data."
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content_structure = EXCLUDED.content_structure,
    expert_tip_vi = EXCLUDED.expert_tip_vi;
