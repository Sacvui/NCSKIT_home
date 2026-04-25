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
        slug: 'technology-acceptance-model-tam', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình TAM Masterclass: Phân tích sâu và Thang đo chuẩn',
        title_en: 'TAM Model Masterclass: Deep Analysis and Standard Scales',
        expert_tip_vi: 'Để bài báo TAM đạt chuẩn Scopus Q1, hãy tích hợp thêm biến "Personal Innovativeness" hoặc các biến điều tiết như Age/Gender để tăng tính mới học thuật.',
        expert_tip_en: 'To reach Q1 journals with TAM, integrate "Personal Innovativeness" or moderators like Age/Gender to enhance theoretical novelty.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Tổng quan về TAM (Davis, 1989)', 
                h2_en: '1. TAM Overview',
                content_vi: 'Mô hình Chấp nhận Công nghệ (TAM) giải thích cách người dùng tiến tới việc chấp nhận và sử dụng một công nghệ mới. Nó dựa trên triết lý rằng niềm tin của cá nhân quyết định thái độ, thái độ quyết định ý định, và ý định dẫn đến hành vi thực tế.',
                content_en: 'The Technology Acceptance Model (TAM) explains how users come to accept and use a new technology. It is based on the philosophy that individual beliefs determine attitudes, attitudes determine intentions, and intentions lead to actual behavior.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Chi tiết Thang đo (Measurement Scales)', 
                h2_en: '3. Measurement Scales Details',
                content_vi: 'Dưới đây là các câu hỏi Likert 5 hoặc 7 điểm thường được dùng (Davis, 1989):\n\n**Hữu ích cảm nhận (PU):**\n1. Sử dụng [Hệ thống] giúp tôi hoàn thành công việc nhanh hơn.\n2. Sử dụng [Hệ thống] cải thiện kết quả công việc của tôi.\n3. Sử dụng [Hệ thống] giúp tôi dễ dàng thực hiện công việc hơn.\n4. Tôi thấy [Hệ thống] rất hữu ích cho công việc của mình.\n\n**Dễ sử dụng cảm nhận (PEOU):**\n1. Việc học cách sử dụng [Hệ thống] đối với tôi rất dễ dàng.\n2. Tôi thấy dễ dàng để [Hệ thống] thực hiện những gì tôi muốn.\n3. Tương tác với [Hệ thống] rất rõ ràng và dễ hiểu.\n4. Tôi thấy [Hệ thống] rất dễ sử dụng.',
                content_en: 'Standard Likert items used for measurement (Davis, 1989):\n\n**Perceived Usefulness (PU):**\n1. Using [System] enables me to accomplish tasks more quickly.\n2. Using [System] improves my job performance.\n3. Using [System] makes it easier to do my job.\n4. I find [System] useful in my job.\n\n**Perceived Ease of Use (PEOU):**\n1. Learning to operate [System] is easy for me.\n2. I find it easy to get [System] to do what I want it to do.\n3. My interaction with [System] is clear and understandable.\n4. I find [System] easy to use.'
            },
            {
                h2_vi: '4. Kết luận', h2_en: '4. Conclusion',
                content_vi: 'TAM vẫn là một mô hình mạnh mẽ nhờ tính đơn giản và khả năng dự báo cao. Tuy nhiên, trong kỷ nguyên AI, các nhà nghiên cứu thường kết hợp TAM với các yếu tố như Sự tin tưởng (Trust) hoặc Rủi ro cảm nhận (Perceived Risk).\n\n#Mô hình nghiên cứu #TAM #ncsStat',
                content_en: 'TAM remains powerful due to its simplicity and high predictive validity. In the AI era, researchers often integrate Trust or Perceived Risk.\n\n#ResearchModel #TAM #ncsStat'
            }
        ]
    },
    'theory-of-planned-behavior-tpb': {
        slug: 'theory-of-planned-behavior-tpb', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Phân tích sâu và Thang đo',
        title_en: 'Theory of Planned Behavior (TPB): Deep Analysis and Scales',
        expert_tip_vi: 'Biến "Nhận thức kiểm soát hành vi" (PBC) thường có tác động trực tiếp đến cả Ý định và Hành vi thực tế. Hãy chú ý kiểm định mối quan hệ này.',
        expert_tip_en: 'PBC often has a direct impact on both Intention and Behavior. Ensure you test this path.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Khung lý thuyết của Ajzen (1991)', 
                h2_en: '1. Ajzen\'s Theoretical Framework',
                content_vi: 'TPB được phát triển từ Thuyết Hành động Hợp lý (TRA). Nó nhấn mạnh rằng ý định thực hiện hành vi phụ thuộc vào ba yếu tố: Thái độ, Chuẩn chủ quan và Nhận thức kiểm soát.',
                content_en: 'TPB evolved from TRA, emphasizing that behavioral intention depends on Attitude, Subjective Norm, and PBC.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Chi tiết Thang đo (Measurement Scales)', 
                h2_en: '3. Measurement Scales Details',
                content_vi: '**Thái độ (ATT):**\n1. Việc thực hiện [Hành vi] là một ý tưởng tốt.\n2. Tôi thấy [Hành vi] rất có lợi.\n3. Tôi có cái nhìn tích cực về [Hành vi].\n\n**Chuẩn chủ quan (SN):**\n1. Những người quan trọng với tôi nghĩ rằng tôi nên thực hiện [Hành vi].\n2. Gia đình và bạn bè ủng hộ tôi thực hiện [Hành vi].\n\n**Nhận thức kiểm soát (PBC):**\n1. Tôi có đủ nguồn lực để thực hiện [Hành vi].\n2. Việc thực hiện [Hành vi] hoàn toàn nằm trong tầm kiểm soát của tôi.',
                content_en: '**Attitude (ATT):**\n1. Performing [Behavior] is a good idea.\n2. I find [Behavior] beneficial.\n3. I have a positive view of [Behavior].\n\n**Subjective Norm (SN):**\n1. People important to me think I should perform [Behavior].\n2. Family and friends support my performing [Behavior].\n\n**PBC:**\n1. I have the resources to perform [Behavior].\n2. Performing [Behavior] is entirely under my control.'
            },
            {
                h2_vi: '4. Kết luận', h2_en: '4. Conclusion',
                content_vi: 'TPB là "vũ khí" sắc bén cho các nghiên cứu về tâm lý và tiêu dùng.\n\n#Mô hình nghiên cứu #TPB #ncsStat',
                content_en: 'TPB is a sharp tool for psychological and consumer research.\n\n#ResearchModel #TPB #ncsStat'
            }
        ]
    },
    'servqual-service-quality-model': {
        slug: 'servqual-service-quality-model', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình SERVQUAL: Thang đo RATER chi tiết',
        title_en: 'SERVQUAL: Detailed RATER Scale',
        expert_tip_vi: 'Phân tích Gap 5 (giữa kỳ vọng và cảm nhận của khách hàng) là phần quan trọng nhất trong báo cáo SERVQUAL.',
        expert_tip_en: 'Analyzing Gap 5 is the most critical part of a SERVQUAL report.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Khung lý thuyết RATER', h2_en: '1. RATER Framework',
                content_vi: 'SERVQUAL đo lường chất lượng qua 5 khía cạnh: Reliability (Tin cậy), Responsiveness (Đáp ứng), Assurance (Năng lực phục vụ), Empathy (Đồng cảm) và Tangibles (Hữu hình).',
                content_en: 'SERVQUAL measures quality via Reliability, Responsiveness, Assurance, Empathy, and Tangibles.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/servqual_model.png" alt="SERVQUAL Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/servqual_model.png" alt="SERVQUAL Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #SERVQUAL #ncsStat',
                content_en: '#ResearchModel #SERVQUAL #ncsStat'
            }
        ]
    },
    'utaut-technology-adoption': {
        slug: 'utaut-technology-adoption', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết UTAUT: Hợp nhất và các Biến điều tiết',
        title_en: 'UTAUT: Unification and Moderators',
        expert_tip_vi: 'Đừng quên đưa các biến điều tiết như Age, Gender vào mô hình để tăng tính thuyết phục cho bài báo.',
        expert_tip_en: 'Include moderators like Age and Gender to enhance your paper\'s persuasiveness.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Tại sao lại là UTAUT?', h2_en: '1. Why UTAUT?',
                content_vi: 'UTAUT hợp nhất 8 mô hình lớn. Nó sử dụng 4 nhân tố chính: Kỳ vọng hiệu quả, Kỳ vọng nỗ lực, Ảnh hưởng xã hội và Các điều kiện thuận lợi.',
                content_en: 'UTAUT unifies 8 models using Performance Expectancy, Effort Expectancy, Social Influence, and Facilitating Conditions.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #UTAUT #ncsStat',
                content_en: '#ResearchModel #UTAUT #ncsStat'
            }
        ]
    },
    'porter-five-forces-analysis': {
        slug: 'porter-five-forces-analysis', category: 'Mô hình nghiên cứu',
        title_vi: '5 Áp lực Cạnh tranh của Porter: Phân tích chiến lược',
        title_en: 'Porter\'s Five Forces: Strategic Analysis',
        expert_tip_vi: 'Áp lực từ sản phẩm thay thế thường bị các doanh nghiệp bỏ qua cho đến khi quá muộn.',
        expert_tip_en: 'Threat of substitutes is often ignored until it\'s too late.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Phân tích Cấu trúc Ngành', h2_en: '1. Industry Structure',
                content_vi: 'Michael Porter xác định 5 lực lượng: Đối thủ cạnh tranh, Người mua, Nhà cung cấp, Người mới gia nhập và Sản phẩm thay thế.',
                content_en: 'Michael Porter identifies 5 forces: Competitors, Buyers, Suppliers, New Entrants, and Substitutes.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/porter_5_forces.png" alt="Porter Forces" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/porter_5_forces.png" alt="Porter Forces" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #Porter #ncsStat',
                content_en: '#ResearchModel #Porter #ncsStat'
            }
        ]
    },
    'vrio-framework-strategy': {
        slug: 'vrio-framework-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Khung VRIO: Chuỗi giá trị và Lợi thế cạnh tranh',
        title_en: 'VRIO Framework: Value Chain and Competitive Advantage',
        expert_tip_vi: 'Yếu tố "O" (Organization) là then chốt để khai thác tối đa các nguồn lực V-R-I.',
        expert_tip_en: 'The "O" (Organization) is key to fully exploiting V-R-I resources.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Lý thuyết RBV', h2_en: '1. RBV Theory',
                content_vi: 'VRIO giúp doanh nghiệp đánh giá liệu nguồn lực của mình có tạo ra lợi thế bền vững hay không dựa trên: Value, Rarity, Inimitability, Organization.',
                content_en: 'VRIO assesses if resources create sustainable advantage based on Value, Rarity, Inimitability, and Organization.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #VRIO #ncsStat',
                content_en: '#ResearchModel #VRIO #ncsStat'
            }
        ]
    },
    'expectation-confirmation-theory-ect': {
        slug: 'expectation-confirmation-theory-ect', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết ECT: Cơ chế của Sự hài lòng khách hàng',
        title_en: 'ECT: Mechanisms of Customer Satisfaction',
        expert_tip_vi: 'Xác nhận (Confirmation) là biến trung gian quan trọng nhất trong mô hình này.',
        expert_tip_en: 'Confirmation is the most important mediator in this model.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Quy trình tâm lý', h2_en: '1. Psychological Process',
                content_vi: 'ECT giải thích quy trình: Kỳ vọng -> Trải nghiệm thực tế -> Xác nhận -> Hài lòng -> Ý định tiếp tục.',
                content_en: 'ECT explains: Expectation -> Performance -> Confirmation -> Satisfaction -> Continuance.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #ECT #ncsStat',
                content_en: '#ResearchModel #ECT #ncsStat'
            }
        ]
    },
    'sor-model-marketing-behavior': {
        slug: 'sor-model-marketing-behavior', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình S-O-R: Ứng dụng trong Bán lẻ và E-commerce',
        title_en: 'S-O-R Model: Applications in Retail and E-commerce',
        expert_tip_vi: 'Biến Organism thường bao gồm cả hai khía cạnh: Cảm xúc (Affect) và Nhận thức (Cognition).',
        expert_tip_en: 'Organism typically includes both Affect and Cognition.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Cấu trúc mô hình', h2_en: '1. Model Structure',
                content_vi: 'Stimulus (Kích thích) -> Organism (Cơ thể/Tâm lý) -> Response (Phản hồi/Hành vi).',
                content_en: 'Stimulus -> Organism -> Response.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/sor_model.png" alt="SOR Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/sor_model.png" alt="SOR Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #SOR #ncsStat',
                content_en: '#ResearchModel #SOR #ncsStat'
            }
        ]
    },
    'perceived-value-marketing-strategy': {
        slug: 'perceived-value-marketing-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Giá trị Cảm nhận: Đa chiều và Đơn chiều',
        title_en: 'Perceived Value: Multi-dimensional vs Uni-dimensional',
        expert_tip_vi: 'Hãy sử dụng thang đo đa chiều (Functional, Social, Emotional) để bài báo có chiều sâu hơn.',
        expert_tip_en: 'Use multi-dimensional scales (Functional, Social, Emotional) for more depth.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Định nghĩa', h2_en: '1. Definition',
                content_vi: 'Giá trị cảm nhận là sự đánh giá tổng thể của người tiêu dùng về tiện ích của sản phẩm dựa trên nhận thức về những gì nhận được và những gì bỏ ra.',
                content_en: 'Perceived value is the consumer\'s overall assessment of the utility of a product based on perceptions of what is received and what is given.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/perceived_value.png" alt="Perceived Value" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/perceived_value.png" alt="Perceived Value" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #GiáTrịCảmNhận #ncsStat',
                content_en: '#ResearchModel #PerceivedValue #ncsStat'
            }
        ]
    },
    'tce-transaction-cost-economics-strategy': {
        slug: 'tce-transaction-cost-economics-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Kinh tế học Chi phí Giao dịch (TCE): Ranh giới của Doanh nghiệp',
        title_en: 'Transaction Cost Economics (TCE): Firm Boundaries',
        expert_tip_vi: 'TCE đặc biệt hữu ích cho các bài nghiên cứu về Sáp nhập (M&A) hoặc Chuỗi cung ứng toàn cầu.',
        expert_tip_en: 'TCE is useful for M&A or Global Supply Chain research.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Lý thuyết của Williamson', h2_en: '1. Williamson\'s Theory',
                content_vi: 'TCE tập trung vào cách các giao dịch được tổ chức để giảm thiểu chi phí phát sinh từ sự không chắc chắn và tính đặc thù.',
                content_en: 'TCE focuses on how transactions are organized to minimize costs from uncertainty and specificity.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình', h2_en: '2. Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/tce_model.png" alt="TCE Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/tce_model.png" alt="TCE Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Hashtag', h2_en: '3. Hashtag',
                content_vi: '#Mô hình nghiên cứu #TCE #ncsStat',
                content_en: '#ResearchModel #TCE #ncsStat'
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
