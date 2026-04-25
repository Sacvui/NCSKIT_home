export const FALLBACK_ARTICLES: Record<string, any> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha', category: 'Scale Reliability',
        title_vi: 'Cronbach\'s Alpha: Đánh giá tính nhất quán nội tại Masterclass',
        title_en: 'Cronbach\'s Alpha: Internal Consistency Masterclass',
        expert_tip_vi: 'Hãy luôn kiểm tra cột "Cronbach\'s Alpha if Item Deleted". Nếu xóa một câu mà Alpha tăng mạnh, câu đó chính là "kẻ phá bĩnh" thang đo của bạn.',
        expert_tip_en: 'Look beyond the global Alpha. Check "Alpha if Item Deleted"—if removing an item spikes the score, that item is undermining your scale.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Cronbach\'s Alpha là gì? Tại sao phải "nhất quán"?',
                h2_en: '1. What is Cronbach\'s Alpha? The Need for Consistency',
                content_vi: `Hãy tưởng tượng bạn đang đo lường sự "Hoài nghi xanh" (Green Skepticism) của người tiêu dùng bằng 5 câu hỏi. Nếu một người trả lời "Rất đồng ý" ở câu 1 nhưng lại "Rất không đồng ý" ở câu 2 (trong khi cả hai cùng đo một nội dung), thì thang đo của bạn đang có vấn đề. Cronbach's Alpha chính là thước đo xem các câu hỏi đó có "về cùng một đội" hay không.`,
                content_en: `Imagine measuring "Green Skepticism" with 5 items. If a respondent strongly agrees with item 1 but strongly disagrees with item 2, your scale is flawed. Cronbach's Alpha tests if your items belong to the same "team."`
            }
        ]
    },
    'technology-acceptance-model-tam': {
        slug: 'technology-acceptance-model-tam', category: 'Research Models',
        title_vi: 'Mô hình TAM Masterclass: Chìa khóa giải mã hành vi công nghệ',
        title_en: 'TAM Model Masterclass: Decoding Technology Behavior',
        expert_tip_vi: 'Để bài báo TAM đạt chuẩn Scopus Q1, hãy tích hợp thêm biến "Personal Innovativeness" hoặc các biến điều tiết như Age/Gender để tăng tính mới học thuật.',
        expert_tip_en: 'To reach Q1 journals with TAM, integrate "Personal Innovativeness" or moderators like Age/Gender to enhance theoretical novelty.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Nguồn gốc và Triết lý của TAM (Fred Davis, 1989)', 
                h2_en: '1. Origin and Philosophy of TAM',
                content_vi: 'Được Fred Davis giới thiệu lần đầu vào năm 1989 dựa trên Thuyết Hành động Hợp lý (TRA), TAM đã trở thành mô hình quyền lực nhất trong việc giải thích lý do tại sao người dùng chấp nhận hoặc từ chối công nghệ. Thay vì tập trung vào các tính năng kỹ thuật, TAM tập trung vào "nhận thức tâm lý" của người dùng.',
                content_en: 'Introduced by Fred Davis in 1989 based on the Theory of Reasoned Action (TRA), TAM has become the most powerful model for explaining why users adopt or reject technology. Instead of technical features, TAM focuses on the "psychological perception" of the user.'
            },
            {
                h2_vi: '2. Hai trụ cột quyết định: PU và PEOU', 
                h2_en: '2. The Two Pillars: PU and PEOU',
                content_vi: 'Mô hình xoay quanh hai biến độc lập chính:\n\n- **Sự hữu ích cảm nhận (Perceived Usefulness - PU):** Mức độ người dùng tin rằng công nghệ sẽ giúp họ tăng hiệu suất công việc. Ví dụ: "Sử dụng ncsStat giúp tôi hoàn thành phân tích nhanh hơn 50%".\n- **Sự dễ sử dụng cảm nhận (Perceived Ease of Use - PEOU):** Mức độ người dùng tin rằng việc học và sử dụng công nghệ đó là không tốn nhiều nỗ lực.',
                content_en: 'The model revolves around two primary independent variables:\n\n- **Perceived Usefulness (PU):** The degree to which a person believes that using a particular system would enhance his or her job performance.\n- **Perceived Ease of Use (PEOU):** The degree to which a person believes that using a particular system would be free of effort.'
            },
            {
                h2_vi: '3. Sơ đồ Mô hình TAM Chuẩn quốc tế', 
                h2_en: '3. International Standard TAM Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 1: Cấu trúc cơ bản của Mô hình Chấp nhận Công nghệ (TAM)</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 1: Basic Structure of the Technology Acceptance Model (TAM)</p></div>'
            },
            {
                h2_vi: '4. Các giả thuyết nghiên cứu phổ biến (Hypotheses)', 
                h2_en: '4. Common Research Hypotheses',
                content_vi: 'Trong một bài báo chuẩn SEM, bạn thường sẽ kiểm định các giả thuyết sau:\n- **H1:** PEOU có tác động tích cực đến PU.\n- **H2:** PEOU có tác động tích cực đến Ý định sử dụng (BI).\n- **H3:** PU có tác động tích cực đến Ý định sử dụng (BI).\n- **H4:** Ý định sử dụng (BI) dẫn đến Hành vi sử dụng thực tế (AU).',
                content_en: 'In a standard SEM paper, you will typically test these hypotheses:\n- **H1:** PEOU has a positive effect on PU.\n- **H2:** PEOU has a positive effect on Behavioral Intention (BI).\n- **H3:** PU has a positive effect on Behavioral Intention (BI).\n- **H4:** BI leads to Actual Usage (AU).'
            },
            {
                h2_vi: '5. Hướng dẫn phân tích trên ncsStat', 
                h2_en: '5. ncsStat Analysis Guide',
                content_vi: 'Để chạy mô hình TAM trên ncsStat, bạn hãy thực hiện theo quy trình:\n1. Tải dữ liệu khảo sát lên.\n2. Chạy **Cronbach\'s Alpha** để kiểm tra độ tin cậy thang đo PU, PEOU.\n3. Chạy **CFA** để kiểm định tính hội tụ.\n4. Sử dụng module **SEM (PLS-SEM)** để kiểm định các cung tác động H1, H2, H3.',
                content_en: 'To run a TAM model on ncsStat, follow this workflow:\n1. Upload your survey data.\n2. Run **Cronbach\'s Alpha** to check PU/PEOU reliability.\n3. Run **CFA** to test convergent validity.\n4. Use the **SEM (PLS-SEM)** module to test H1, H2, and H3 paths.'
            }
        ]
    },
    'theory-of-planned-behavior-tpb': {
        slug: 'theory-of-planned-behavior-tpb', category: 'Behavioral Research',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Chìa khóa giải mã Ý định',
        title_en: 'Theory of Planned Behavior (TPB): Decoding Intentions',
        expert_tip_vi: 'Biến "Nhận thức kiểm soát hành vi" (PBC) thường có tác động trực tiếp đến cả Ý định và Hành vi thực tế. Đừng quên kiểm định cung tác động này trong mô hình SEM của bạn.',
        expert_tip_en: 'Perceived Behavioral Control (PBC) often has a direct impact on both Intention and Actual Behavior. Ensure you test this direct path in your SEM model.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Bản chất của Thuyết Hành vi Dự định (Ajzen, 1991)', 
                h2_en: '1. The Essence of TPB',
                content_vi: 'Thuyết Hành vi Dự định (TPB) là một trong những lý thuyết tâm lý xã hội được trích dẫn nhiều nhất để dự đoán hành vi của con người. TPB cho rằng hành vi không xảy ra ngẫu nhiên mà là kết quả của một quy trình lập kế hoạch dựa trên Ý định (Intention).',
                content_en: 'The Theory of Planned Behavior (TPB) is one of the most cited social psychological theories for predicting human behavior. TPB posits that behavior is not random but the result of a deliberate planning process based on Intention.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình TPB Masterclass', 
                h2_en: '2. TPB Model Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 2: Cấu trúc các nhân tố trong Thuyết Hành vi Dự định (TPB)</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 2: Factor Structure in the Theory of Planned Behavior (TPB)</p></div>'
            },
            {
                h2_vi: '3. Ba tiền tố quyết định Ý định', 
                h2_en: '3. The Three Antecedents of Intention',
                content_vi: 'Ý định hành vi được quyết định bởi:\n\n- **Thái độ (Attitude):** Đánh giá tích cực hoặc tiêu cực của cá nhân về việc thực hiện hành vi.\n- **Chuẩn chủ quan (Subjective Norm):** Áp lực xã hội cảm nhận được từ những người quan trọng xung quanh (gia đình, bạn bè, đồng nghiệp).\n- **Nhận thức kiểm soát hành vi (PBC):** Mức độ dễ hay khó cảm nhận được khi thực hiện hành vi, dựa trên các nguồn lực và rào cản.',
                content_en: 'Behavioral intention is determined by:\n\n- **Attitude:** An individual\'s positive or negative evaluation of performing the behavior.\n- **Subjective Norm:** The perceived social pressure from significant others (family, friends, colleagues).\n- **Perceived Behavioral Control (PBC):** The perceived ease or difficulty of performing the behavior, based on resources and obstacles.'
            },
            {
                h2_vi: '4. Ứng dụng trong Kinh doanh và Marketing', 
                h2_en: '4. Business and Marketing Applications',
                content_vi: 'TPB cực kỳ hữu ích để nghiên cứu:\n- Ý định mua sắm thực phẩm hữu cơ (Organic Food).\n- Ý định khởi nghiệp của sinh viên.\n- Ý định sử dụng dịch vụ ngân hàng trực tuyến.\n- Hành vi tuân thủ quy định môi trường của doanh nghiệp.',
                content_en: 'TPB is extremely useful for studying:\n- Organic food purchase intentions.\n- Students\' entrepreneurial intentions.\n- Online banking usage intentions.\n- Corporate environmental compliance behavior.'
            }
        ]
    },
    'servqual-service-quality-model': {
        slug: 'servqual-service-quality-model', category: 'Marketing Research',
        title_vi: 'Mô hình SERVQUAL: Tiêu chuẩn vàng đo lường Chất lượng Dịch vụ',
        title_en: 'SERVQUAL: The Gold Standard for Measuring Service Quality',
        expert_tip_vi: 'Sử dụng phương pháp đo lường "Khoảng cách" (Gap Analysis) giữa Kỳ vọng và Cảm nhận để xác định chính xác điểm cần cải thiện.',
        expert_tip_en: 'Use the Gap Analysis method between Expectations and Perceptions to pinpoint exact areas for improvement.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Khung lý thuyết RATER', 
                h2_en: '1. The RATER Framework',
                content_vi: 'SERVQUAL là mô hình được Parasuraman và cộng sự phát triển để đo lường chất lượng dịch vụ thông qua 5 khía cạnh cốt lõi (RATER): Tin cậy, Đáp ứng, Năng lực phục vụ, Đồng cảm và Phương tiện hữu hình.',
                content_en: 'SERVQUAL is a model developed by Parasuraman et al. to measure service quality through 5 core dimensions (RATER): Reliability, Responsiveness, Assurance, Empathy, and Tangibles.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình SERVQUAL Masterclass', 
                h2_en: '2. SERVQUAL Model Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/servqual_model.png" alt="SERVQUAL Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 3: 5 thành phần quyết định Chất lượng Dịch vụ</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/servqual_model.png" alt="SERVQUAL Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 3: 5 Dimensions of Service Quality</p></div>'
            }
        ]
    },
    'utaut-technology-adoption': {
        slug: 'utaut-technology-adoption', category: 'Research Models',
        title_vi: 'Thuyết Hợp nhất Chấp nhận Công nghệ (UTAUT)',
        title_en: 'UTAUT: Unified Technology Acceptance',
        expert_tip_vi: 'UTAUT đặc biệt mạnh mẽ khi nghiên cứu trong môi trường tổ chức, nơi việc sử dụng công nghệ có thể là bắt buộc hoặc tự nguyện.',
        expert_tip_en: 'UTAUT is particularly powerful for organizational research where technology use can be mandatory or voluntary.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sự hợp nhất của 8 lý thuyết lớn', 
                h2_en: '1. Unification of 8 Major Theories',
                content_vi: 'Venkatesh và cộng sự (2003) đã hợp nhất 8 mô hình trước đó để tạo ra UTAUT, giúp giải thích tới 70% sự biến thiên của Ý định sử dụng.',
                content_en: 'Venkatesh et al. (2003) unified 8 previous models to create UTAUT, explaining up to 70% of the variance in usage intention.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình UTAUT Masterclass', 
                h2_en: '2. UTAUT Model Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 4: Các nhân tố quyết định và Biến điều tiết trong UTAUT</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 4: Core Determinants and Moderators in UTAUT</p></div>'
            }
        ]
    },
    'porter-five-forces-analysis': {
        slug: 'porter-five-forces-analysis', category: 'Market Strategy',
        title_vi: 'Mô hình 5 Áp lực Cạnh tranh (Michael Porter)',
        title_en: 'Porter\'s Five Forces Analysis',
        expert_tip_vi: 'Đừng chỉ liệt kê các áp lực, hãy phân tích sự tương tác giữa chúng để tìm ra "đại dương xanh" cho doanh nghiệp.',
        expert_tip_en: 'Don\'t just list the forces; analyze their interactions to find a "blue ocean" for your business.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Phân tích Cấu trúc Ngành', 
                h2_en: '1. Industry Structure Analysis',
                content_vi: 'Michael Porter giúp chúng ta hiểu rằng lợi nhuận không chỉ phụ thuộc vào đối thủ trực tiếp mà còn từ 4 lực lượng khác xung quanh.',
                content_en: 'Michael Porter helps us understand that profitability depends not only on direct competitors but also on 4 other surrounding forces.'
            },
            {
                h2_vi: '2. Sơ đồ 5 Áp lực Masterclass', 
                h2_en: '2. Five Forces Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/porter_5_forces.png" alt="Porter Forces" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 5: Khung phân tích sức hấp dẫn của ngành</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/porter_5_forces.png" alt="Porter Forces" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 5: Industry Attractiveness Analysis Framework</p></div>'
            }
        ]
    },
    'vrio-framework-strategy': {
        slug: 'vrio-framework-strategy', category: 'Market Strategy',
        title_vi: 'Khung VRIO: Đánh giá Nguồn lực nội tại',
        title_en: 'VRIO Framework: Assessing Internal Resources',
        expert_tip_vi: 'Một nguồn lực "Quý" và "Hiếm" nhưng dễ bị "Bắt chước" sẽ chỉ mang lại lợi thế tạm thời.',
        expert_tip_en: 'A "Valuable" and "Rare" resource that is easy to "Imitate" will only provide a temporary advantage.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ VRIO Masterclass', 
                h2_en: '1. VRIO Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 6: Chuỗi câu hỏi xác định Lợi thế cạnh tranh bền vững</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 6: Decision Sequence for Sustainable Competitive Advantage</p></div>'
            }
        ]
    },
    'expectation-confirmation-theory-ect': {
        slug: 'expectation-confirmation-theory-ect', category: 'Marketing Research',
        title_vi: 'Thuyết Kỳ vọng - Xác nhận (ECT)',
        title_en: 'Expectation-Confirmation Theory (ECT)',
        expert_tip_vi: 'Chìa khóa của sự hài lòng không phải là sản phẩm tốt, mà là sản phẩm tốt hơn kỳ vọng ban đầu.',
        expert_tip_en: 'The key to satisfaction is not just a good product, but a product that exceeds initial expectations.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ ECT Masterclass', 
                h2_en: '1. ECT Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 7: Quy trình hình thành Sự hài lòng và Ý định tiếp tục sử dụng</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 7: Satisfaction and Continuance Intention Formation Process</p></div>'
            }
        ]
    },
    'sor-model-marketing-behavior': {
        slug: 'sor-model-marketing-behavior', category: 'Behavioral Research',
        title_vi: 'Mô hình S-O-R: Kích thích - Cơ thể - Phản hồi',
        title_en: 'S-O-R Model: Stimulus-Organism-Response',
        expert_tip_vi: 'Trong môi trường online, các yếu tố như giao diện web (Stimulus) tác động đến cảm xúc (Organism) và dẫn đến hành vi mua ngẫu hứng (Response).',
        expert_tip_en: 'In online environments, web interface (Stimulus) impacts emotions (Organism) leading to impulse buying (Response).',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ S-O-R Masterclass', 
                h2_en: '1. S-O-R Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/sor_model.png" alt="SOR Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 8: Luồng tác động từ môi trường đến hành vi</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/sor_model.png" alt="SOR Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 8: Behavioral Impact Flow from Environment</p></div>'
            }
        ]
    },
    'perceived-value-marketing-strategy': {
        slug: 'perceived-value-marketing-strategy', category: 'Marketing Research',
        title_vi: 'Mô hình Giá trị Cảm nhận (Perceived Value)',
        title_en: 'Perceived Value in Marketing Strategy',
        expert_tip_vi: 'Giá trị cảm nhận là sự cân bằng giữa lợi ích (Get) và chi phí (Give). Hãy tập trung tối ưu hóa cả hai.',
        expert_tip_en: 'Perceived value is a balance between benefits (Get) and costs (Give). Focus on optimizing both.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ Giá trị Cảm nhận Masterclass', 
                h2_en: '1. Perceived Value Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/perceived_value.png" alt="Perceived Value" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 9: Các khía cạnh cấu thành Giá trị trong mắt khách hàng</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/perceived_value.png" alt="Perceived Value" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 9: Dimensions of Customer Perceived Value</p></div>'
            }
        ]
    },
    'tce-transaction-cost-economics-strategy': {
        slug: 'tce-transaction-cost-economics-strategy', category: 'Advanced Research',
        title_vi: 'Kinh tế học Chi phí Giao dịch (TCE)',
        title_en: 'Transaction Cost Economics (TCE)',
        expert_tip_vi: 'Tính đặc thù của tài sản (Asset Specificity) là yếu tố quan trọng nhất khiến doanh nghiệp chọn "Tự làm" thay vì "Thuê ngoài".',
        expert_tip_en: 'Asset Specificity is the most critical factor driving firms to choose "Make" over "Buy".',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ TCE Masterclass', 
                h2_en: '1. TCE Masterclass Diagram', 
                is_html: true,
                content_vi: '<div class="my-12 text-center"><img src="/images/knowledge/tce_model.png" alt="TCE Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Hình 10: Sự đánh đổi giữa chi phí sản xuất và chi phí quản trị</p></div>',
                content_en: '<div class="my-12 text-center"><img src="/images/knowledge/tce_model.png" alt="TCE Model" class="rounded-[3rem] shadow-4xl border border-slate-100 w-full hover:scale-[1.02] transition-transform duration-700" /><p class="mt-6 text-sm text-slate-400 italic font-medium">Figure 10: Trade-off between Production and Governance Costs</p></div>'
            }
        ]
    }
    // ... other fallbacks can be moved here
};

export const DEFAULT_ARTICLE = {
    slug: 'unknown', category: 'Academy Content', title_vi: 'Đang tải nội dung...', title_en: 'Loading Content...',
    expert_tip_vi: 'Đang tải...', expert_tip_en: 'Loading...', author: 'ncsStat', updated_at: new Date().toISOString(),
    content_structure: [{ h2_vi: 'Đang tải...', h2_en: 'Loading...', content_vi: 'Nội dung đang được hệ thống nạp từ thư viện tri thức...', content_en: 'Please wait while content is loading...' }]
};
