-- ncsStat Knowledge Enrichment: What is a Research Model?
-- Objective: Detailed explanation and library entry for Research Models

INSERT INTO knowledge_articles (id, slug, category, title_vi, title_en, icon_name, expert_tip_vi, content_structure)
VALUES (
  gen_random_uuid(),
  'what-is-a-research-model',
  'Research Design',
  'Mô hình Nghiên cứu là gì? Hướng dẫn xây dựng Khung lý thuyết chuẩn',
  'What is a Research Model? Building a Standard Theoretical Framework',
  'Network',
  'Mẹo từ chuyên gia: Một mô hình nghiên cứu tốt phải có nền tảng từ lý thuyết gốc (Foundational Theory). Đừng bao giờ nối các mũi tên mà không có lập luận logic.',
  '[
    {
      "h2_vi": "1. Bản chất luận (Ontology) và Sự hình thành Tư duy Mô hình",
      "h2_en": "1. Ontology and the Formation of Model Thinking",
      "content_vi": "Mô hình nghiên cứu không bắt đầu từ những mũi tên, mà bắt đầu từ cách nhà khoa học nhìn nhận thế giới. Trong Triết học Khoa học, Bản chất luận (Ontology) đặt câu hỏi: Thực tại có tồn tại độc lập với con người không? Nếu bạn theo trường phái Thực chứng (Positivism), mô hình của bạn sẽ là những cấu trúc cứng nhắc, đo lường được. Nếu bạn theo thuyết Diễn giải (Interpretivism), mô hình sẽ linh hoạt và phụ thuộc vào bối cảnh. Việc hiểu rõ vị thế triết học của mình giúp NCS bảo vệ mô hình trước những câu hỏi hóc búa nhất của hội đồng về tính khách quan và tính đại diện của dữ liệu.",
      "content_en": "Research models don''t start with arrows; they start with how a scientist perceives the world. Ontology asks: Does reality exist independently of humans?"
    },
    {
      "h2_vi": "2. Khung Lý thuyết (Theoretical Framework) - Tòa lâu đài tri thức",
      "h2_en": "2. Theoretical Framework - The Castle of Knowledge",
      "content_vi": "Khung lý thuyết là nền móng vững chắc nhất của bài nghiên cứu. Nó là tập hợp các lý thuyết đã được thừa nhận rộng rãi (ví dụ: Thuyết Trao đổi Xã hội - SET, Thuyết Nguồn lực - RBV). Một sai lầm phổ biến là NCS cố gắng tự ''sáng tạo'' ra mối quan hệ mà không dựa trên bất kỳ lý thuyết gốc nào. Bài viết này hướng dẫn bạn cách truy hồi (Trace back) từ các biến số của mình về các lý thuyết mẹ để đảm bảo tính hàn lâm. Chúng tôi phân tích cách phối hợp đa lý thuyết (Multi-theory approach) để giải thích các hiện tượng phức tạp trong thời đại kinh tế số.",
      "content_en": "The Theoretical Framework is the bedrock of research. It is a collection of established theories like SET or RBV."
    },
    {
      "h2_vi": "3. Khung Khái niệm (Conceptual Framework) - Dấu ấn của cá nhân",
      "h2_en": "3. Conceptual Framework - The Personal Signature",
      "content_vi": "Nếu Khung lý thuyết là bản đồ tổng quát, thì Khung khái niệm là con đường cụ thể bạn chọn đi. Đây là nơi bạn thể hiện sự sáng tạo và đóng góp mới của mình cho khoa học. Chúng tôi hướng dẫn cách cụ thể hóa (Operationalize) các khái niệm trừu tượng thành các biến số đo lường được. Một Khung khái niệm tốt phải thể hiện rõ: (1) Cái gì được nghiên cứu, (2) Tại sao nó lại liên kết với nhau, và (3) Kết quả cuối cùng là gì. Đây chính là phần ''đắt giá'' nhất trong chương 2 của một cuốn luận án tiến sĩ.",
      "content_en": "While the Theoretical Framework is a general map, the Conceptual Framework is your specific chosen path."
    },
    {
      "h2_vi": "4. Taxonomy của Biến số: Từ Đơn giản đến Đa tầng",
      "h2_en": "4. Variable Taxonomy: From Simple to Multi-layered",
      "content_vi": "Chúng ta đi sâu vào bản chất của các loại biến: \n- **Biến Độc lập (IV)**: Nguyên nhân hoặc tác nhân dự báo. \n- **Biến Phụ thuộc (DV)**: Kết quả chịu tác động. \n- **Biến Trung gian (Mediation)**: Cơ chế truyền dẫn (The mechanism). Ví dụ: Sự tin tưởng (IV) -> Sự cam kết (Mediation) -> Ý định mua hàng (DV). \n- **Biến Điều tiết (Moderation)**: Điều kiện biên (Boundary conditions). Ví dụ: Thu nhập cao hay thấp sẽ làm thay đổi mức độ ảnh hưởng của Quảng cáo đến Quyết định mua hàng. \nHiểu rõ các loại biến này là chìa khóa để thiết lập các phương trình cấu trúc (SEM) chính xác trên hệ thống ncsStat.",
      "content_en": "Deep dive into variable types: Independent, Dependent, Mediating, and Moderating."
    },
    {
      "h2_vi": "5. Mô hình Trung gian (Mediation) - Giải mã cơ chế ''Tại sao''",
      "h2_en": "5. Mediation Models - Decoding the ''Why''",
      "content_vi": "Tại sao X lại tác động đến Y? Trung gian là câu trả lời. Chúng tôi phân tích sự khác biệt giữa Trung gian toàn phần (Full Mediation) và Trung gian một phần (Partial Mediation). Đồng thời, bài viết giới thiệu về Trung gian song song (Parallel Mediation) và Trung gian nối tiếp (Serial Mediation). Đây là những cấu trúc cao cấp giúp bài nghiên cứu của bạn đạt độ sâu cần thiết để công bố trên các tạp chí quốc tế hàng đầu. ncsStat sử dụng kỹ thuật Bootstrapping để kiểm định các tác động gián tiếp này với độ chính xác tuyệt đối.",
      "content_en": "Why does X affect Y? Mediation is the answer. We analyze Full, Partial, Parallel, and Serial Mediation."
    },
    {
      "h2_vi": "6. Mô hình Điều tiết (Moderation) - Xác định bối cảnh ''Khi nào''",
      "h2_en": "6. Moderation Models - Defining the ''When''",
      "content_vi": "Tác động của X lên Y không phải lúc nào cũng giống nhau cho mọi đối tượng. Biến điều tiết trả lời cho câu hỏi: Trong bối cảnh nào thì tác động này mạnh hơn hoặc yếu đi? Chúng tôi hướng dẫn cách xử lý biến tương tác (Interaction terms) và cách vẽ đồ thị dốc (Simple Slopes Plot). Việc phát hiện ra một biến điều tiết mới (ví dụ: Năng lực số - Digital Literacy) trong một mối quan hệ kinh điển thường là điểm cộng lớn nhất cho tính mới của đề tài.",
      "content_en": "The effect of X on Y isn''t always constant. Moderation answers: Under what conditions is this effect stronger or weaker?"
    },
    {
      "h2_vi": "7. Mô hình Kết hợp: Moderated Mediation & Mediated Moderation",
      "h2_en": "7. Hybrid Models: Moderated Mediation and Mediated Moderation",
      "content_vi": "Đỉnh cao của mô hình hóa nghiên cứu là sự kết hợp. Chúng tôi giải thích mô hình Trung gian bị Điều tiết (Moderated Mediation) - nơi tác động gián tiếp thay đổi theo giá trị của biến điều tiết. Đây là những mô hình thường thấy trong các bài báo Q1. ncsStat hỗ trợ bạn kiểm định các chỉ số Conditional Indirect Effects (Tác động gián tiếp có điều kiện), giúp bạn đưa ra những kết luận quản trị vô cùng tinh tế và sắc sảo.",
      "content_en": "The peak of research modeling is combination. We explain Moderated Mediation models used in top-tier journals."
    },
    {
      "h2_vi": "8. Thư viện Case Study 1: Mô hình TAM và sự tiến hóa",
      "h2_en": "8. Case Study Library 1: TAM and its Evolution",
      "content_vi": "Phân tích chi tiết mô hình Technology Acceptance Model (Davis, 1989). Từ hai biến cốt lõi là Perceived Usefulness (PU) và Perceived Ease of Use (PEOU), chúng ta xem xét cách nó tiến hóa lên TAM2, TAM3 và đặc biệt là UTAUT2. Chúng tôi hướng dẫn cách NCS có thể ''mix'' TAM với các yếu tố hiện đại như Sự tin tưởng (Trust) hoặc Rủi ro cảm nhận (Perceived Risk) để tạo ra các mô hình nghiên cứu đột phá trong lĩnh vực Fintech hoặc Thương mại điện tử.",
      "content_en": "Detailed analysis of TAM and its evolution to UTAUT2. How to contextualize these for modern Fintech research."
    },
    {
      "h2_vi": "9. Thư viện Case Study 2: Mô hình S-O-R trong kỷ nguyên số",
      "h2_en": "9. Case Study Library 2: S-O-R Model in the Digital Era",
      "content_vi": "Mô hình Stimulus-Organism-Response (S-O-R) là khung lý thuyết cực mạnh để nghiên cứu hành vi người tiêu dùng trực tuyến. Stimulus (Kích thích) -> Organism (Trạng thái tâm lý) -> Response (Phản ứng/Hành vi). Bài viết phân tích cách các yếu tố như Giao diện website (Stimulus) tác động đến Sự thích thú (Organism) dẫn đến hành vi Mua hàng ngẫu hứng (Response). Đây là lựa chọn hàng đầu cho các nghiên cứu về Social Commerce và Metaverse.",
      "content_en": "The S-O-R model is a powerful framework for online consumer behavior research, from stimulus to psychological state to response."
    },
    {
      "h2_vi": "10. Quy tắc Parsimony và Thống kê Bayes trong Mô hình hóa",
      "h2_en": "10. Parsimony and Bayesian Thinking in Modeling",
      "content_vi": "Nghệ thuật của một nhà khoa học lớn là làm cho những điều phức tạp trở nên đơn giản. Quy tắc Parsimony yêu cầu bạn không nên thêm biến vào mô hình chỉ để cho ''đẹp''. Chúng tôi hướng dẫn cách sử dụng các chỉ số như AIC, BIC để so sánh và lựa chọn mô hình tối ưu nhất. Ngoài ra, bài viết còn giới thiệu sơ lược về tư duy Bayes - cách cập nhật niềm tin về mô hình dựa trên dữ liệu mới, một xu hướng đang trỗi dậy mạnh mẽ trong thống kê hiện đại.",
      "content_en": "The art of a great scientist is making the complex simple. Use AIC/BIC to select the most parsimonious model."
    },
    {
      "h2_vi": "11. Cách trình bày Sơ đồ Mô hình (Path Diagram) đạt chuẩn quốc tế",
      "h2_en": "11. Presenting Path Diagrams at International Standards",
      "content_vi": "Hình ảnh là ngôn ngữ đầu tiên mà Reviewer tiếp nhận. Chúng tôi hướng dẫn các quy tắc đồ họa chuẩn: (1) Biến tiềm ẩn dùng hình elip, (2) Biến quan sát dùng hình chữ nhật, (3) Tác động nhân quả dùng mũi tên một chiều, (4) Tương quan dùng mũi tên hai chiều. ncsStat tích hợp công cụ vẽ sơ đồ tự động, giúp bạn xuất ra những hình ảnh vector sắc nét, sẵn sàng đưa vào bản thảo bài báo mà không lo bị vỡ hình hay sai quy chuẩn.",
      "content_en": "Visuals are the first thing reviewers see. Follow graphic standards: Ellipses for latent variables, rectangles for indicators."
    },
    {
      "h2_vi": "12. Tương lai của Mô hình hóa: AI và Machine Learning",
      "h2_en": "12. The Future of Modeling: AI and Machine Learning",
      "content_vi": "Chúng ta đang bước vào kỷ nguyên mà các mô hình cấu trúc truyền thống bắt đầu kết hợp với thuật toán học máy (Machine Learning). ncsStat đang phát triển các tính năng dự báo thông minh, cho phép mô hình của bạn không chỉ giải thích quá khứ mà còn dự đoán tương lai với độ chính xác cao. Bài viết kết thúc bằng một tầm nhìn về sự giao thoa giữa Thống kê học thuật và Khoa học dữ liệu thực chiến, mở ra những cơ hội nghiên cứu vô tận cho thế hệ NCS tiếp theo.",
      "content_en": "We are entering an era where traditional structural models combine with Machine Learning algorithms for high-accuracy predictions."
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET content_structure = EXCLUDED.content_structure,
    expert_tip_vi = EXCLUDED.expert_tip_vi;
