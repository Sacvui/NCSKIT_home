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
        title_vi: 'Mô hình TAM Masterclass: Phân tích sâu và Case Study thực tế',
        title_en: 'TAM Model Masterclass: Deep Analysis and Practical Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Chấp nhận Ngân hàng số (Digital Banking)', 
                h2_en: '3. Practical Case Study: Digital Banking Adoption',
                content_vi: '**Tên đề tài:** "Nghiên cứu các nhân tố ảnh hưởng đến ý định sử dụng ứng dụng Ngân hàng số của thế hệ Gen Z tại Việt Nam".\n\n**Cách áp dụng TAM:**\n- **Hữu ích (PU):** Người dùng thấy ứng dụng giúp chuyển tiền nhanh, thanh toán hóa đơn 24/7 mà không cần ra quầy.\n- **Dễ sử dụng (PEOU):** Giao diện app đơn giản, đăng nhập bằng FaceID nhanh chóng, dễ tìm kiếm tính năng.\n- **Biến mở rộng (Trust):** Vì liên quan đến tiền bạc, tác giả thường thêm biến "Sự tin tưởng" để tăng tính thuyết phục.\n\n**Kết quả kỳ vọng:** PEOU sẽ tác động mạnh đến PU, và cả hai cùng thúc đẩy Ý định sử dụng app của người trẻ.',
                content_en: '**Research Title:** "Factors affecting Digital Banking adoption among Gen Z in Vietnam".\n\n**TAM Mapping:**\n- **PU:** 24/7 bill payments, instant transfers without visiting branches.\n- **PEOU:** Intuitive interface, FaceID login, easy feature navigation.\n- **Extension (Trust):** Given the financial context, "Trust" is often added to increase theoretical robustness.\n\n**Expected Outcome:** PEOU strongly impacts PU, and both drive the usage intention of the youth.'
            },
            {
                h2_vi: '4. Chi tiết Thang đo (Measurement Scales)', 
                h2_en: '4. Measurement Scales Details',
                content_vi: 'Dưới đây là các câu hỏi Likert thường dùng (Davis, 1989):\n\n**Hữu ích cảm nhận (PU):**\n1. Sử dụng Digital Banking giúp tôi quản lý tài chính hiệu quả hơn.\n2. Sử dụng Digital Banking giúp tôi tiết kiệm thời gian giao dịch.\n\n**Dễ sử dụng cảm nhận (PEOU):**\n1. Tôi không gặp khó khăn khi học cách sử dụng ứng dụng này.\n2. Các thao tác trên ứng dụng rất rõ ràng và dễ hiểu.\n\n#Mô hình nghiên cứu #TAM #ncsStat',
                content_en: 'Standard Likert items:\n\n**PU:**\n1. Using Digital Banking helps me manage finances more effectively.\n2. Using Digital Banking saves me transaction time.\n\n**PEOU:**\n1. I have no difficulty learning to use this app.\n2. Operating the app is clear and understandable.\n\n#ResearchModel #TAM #ncsStat'
            }
        ]
    },
    'theory-of-planned-behavior-tpb': {
        slug: 'theory-of-planned-behavior-tpb', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Case Study Tiêu dùng xanh',
        title_en: 'Theory of Planned Behavior (TPB): Green Consumption Case',
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
                h2_vi: '3. Case Study Thị phạm: Ý định mua xe máy điện', 
                h2_en: '3. Practical Case Study: Electric Motorbike Purchase Intention',
                content_vi: '**Tên đề tài:** "Phân tích ý định mua xe máy điện của người dân tại các đô thị lớn: Ứng dụng thuyết TPB".\n\n**Cách áp dụng TPB:**\n- **Thái độ (ATT):** Người dân tin rằng dùng xe điện là bảo vệ môi trường, hiện đại và tiết kiệm xăng.\n- **Chuẩn chủ quan (SN):** Bạn bè, đồng nghiệp và truyền thông đang khuyến khích lối sống xanh.\n- **Nhận thức kiểm soát (PBC):** Sự sẵn có của các trạm sạc và giá thành xe có phù hợp túi tiền hay không.\n\n**Kết quả kỳ vọng:** Cả 3 nhân tố đều tác động thuận chiều đến ý định mua xe, trong đó PBC thường là rào cản lớn nhất.',
                content_en: '**Research Title:** "Analyzing electric motorbike purchase intention in major cities: A TPB approach".\n\n**TPB Mapping:**\n- **Attitude:** Belief that EVs are eco-friendly, modern, and cost-effective.\n- **Subjective Norm:** Peer and media encouragement of green living.\n- **PBC:** Availability of charging stations and affordability.\n\n**Expected Outcome:** All 3 factors impact intention, with PBC often being the primary barrier.'
            },
            {
                h2_vi: '4. Chi tiết Thang đo & Hashtag', 
                h2_en: '4. Measurement Scales & Hashtag',
                content_vi: '**Thái độ (ATT):** Mua xe điện là một quyết định sáng suốt.\n**Chuẩn chủ quan (SN):** Những người xung quanh ủng hộ tôi mua xe điện.\n**Nhận thức kiểm soát (PBC):** Tôi có đủ khả năng tài chính để sở hữu xe điện.\n\n#Mô hình nghiên cứu #TPB #ncsStat',
                content_en: '**ATT:** Buying an EV is a wise decision.\n**SN:** People around me support my EV purchase.\n**PBC:** I have the financial means to afford an EV.\n\n#ResearchModel #TPB #ncsStat'
            }
        ]
    },
    'servqual-service-quality-model': {
        slug: 'servqual-service-quality-model', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình SERVQUAL: Case Study Chất lượng Bệnh viện',
        title_en: 'SERVQUAL: Hospital Quality Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Chất lượng dịch vụ Y tế', 
                h2_en: '3. Practical Case Study: Healthcare Service Quality',
                content_vi: '**Đề tài:** "Đánh giá chất lượng dịch vụ khám chữa bệnh tại Bệnh viện X".\n\n**Ứng dụng RATER:**\n- **Hữu hình:** Cơ sở vật chất hiện đại.\n- **Tin cậy:** Chẩn đoán chính xác.\n- **Đáp ứng:** Hỗ trợ bệnh nhân nhanh.\n- **Năng lực phục vụ:** Bác sĩ tay nghề cao.\n- **Đồng cảm:** Thái độ ân cần.\n\n#Mô hình nghiên cứu #SERVQUAL #ncsStat',
                content_en: '**Title:** "Evaluating healthcare service quality at Hospital X".\n\n**RATER Application:**\n- **Tangibles:** Modern facilities.\n- **Reliability:** Accurate diagnosis.\n- **Responsiveness:** Fast patient support.\n- **Assurance:** Highly skilled doctors.\n- **Empathy:** Caring attitude.\n\n#ResearchModel #SERVQUAL #ncsStat'
            }
        ]
    },
    'utaut-technology-adoption': {
        slug: 'utaut-technology-adoption', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết UTAUT: Case Study Chấp nhận E-Learning',
        title_en: 'UTAUT: E-Learning Adoption Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Hệ thống học tập trực tuyến (E-Learning)', 
                h2_en: '3. Practical Case Study: E-Learning Adoption',
                content_vi: '**Đề tài:** "Nhân tố ảnh hưởng đến việc chấp nhận hệ thống học tập trực tuyến của sinh viên".\n\n**Ứng dụng UTAUT:**\n- **Kỳ vọng hiệu quả:** Sinh viên tin rằng E-learning giúp học tập tốt hơn.\n- **Kỳ vọng nỗ lực:** Hệ thống dễ dùng.\n- **Ảnh hưởng xã hội:** Thầy cô khuyến khích dùng.\n- **Điều kiện thuận lợi:** Có máy tính và Internet.\n\n#Mô hình nghiên cứu #UTAUT #ncsStat',
                content_en: '**Title:** "Factors affecting students\' acceptance of e-learning".\n\n**UTAUT Application:**\n- **Performance Expectancy:** Better learning outcomes.\n- **Effort Expectancy:** Ease of use.\n- **Social Influence:** Professor encouragement.\n- **Facilitating Conditions:** Hardware and internet access.\n\n#ResearchModel #UTAUT #ncsStat'
            }
        ]
    },
    'porter-five-forces-analysis': {
        slug: 'porter-five-forces-analysis', category: 'Mô hình nghiên cứu',
        title_vi: '5 Áp lực Cạnh tranh của Porter: Case Study Ngành F&B',
        title_en: 'Porter\'s Five Forces: F&B Industry Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Thị trường Chuỗi cà phê', 
                h2_en: '3. Practical Case Study: Coffee Chain Market',
                content_vi: '**Phân tích mô hình:**\n- **Đối thủ trực tiếp:** Highlands vs Phúc Long vs Starbucks.\n- **Nhà cung cấp:** Các nông trại cà phê tại Đắk Lắk.\n- **Sản phẩm thay thế:** Trà sữa, đồ uống đóng chai.\n\n#Mô hình nghiên cứu #Porter #ncsStat',
                content_en: '**Analysis:**\n- **Direct Competitors:** Highlands vs Phuc Long vs Starbucks.\n- **Suppliers:** Coffee farms in Dak Lak.\n- **Substitutes:** Milk tea, bottled drinks.\n\n#ResearchModel #Porter #ncsStat'
            }
        ]
    },
    'vrio-framework-strategy': {
        slug: 'vrio-framework-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Khung VRIO: Case Study Lợi thế của Apple',
        title_en: 'VRIO Framework: Apple\'s Advantage Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Hệ sinh thái Apple', 
                h2_en: '3. Practical Case Study: Apple Ecosystem',
                content_vi: '**Phân tích:**\n- **V:** Hệ điều hành iOS bảo mật cao.\n- **R:** Thiết kế độc bản.\n- **I:** Khó bắt chước sự đồng bộ iPhone, Mac.\n- **O:** Apple tổ chức tối ưu chuỗi cung ứng.\n\n#Mô hình nghiên cứu #VRIO #ncsStat',
                content_en: '**Analysis:**\n- **V:** Secure iOS.\n- **R:** Unique design.\n- **I:** Hard to replicate ecosystem.\n- **O:** Optimized supply chain.\n\n#ResearchModel #VRIO #ncsStat'
            }
        ]
    },
    'expectation-confirmation-theory-ect': {
        slug: 'expectation-confirmation-theory-ect', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết ECT: Case Study Mua sắm Thương mại điện tử',
        title_en: 'ECT: E-commerce Shopping Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Mua sắm trên Shopee/Lazada', 
                h2_en: '3. Practical Case Study: Shopee/Lazada Shopping',
                content_vi: '**Tình huống:**\n- **Kỳ vọng:** Giao nhanh, hàng tốt.\n- **Trải nghiệm:** Đúng hạn, đóng gói kỹ.\n- **Xác nhận:** Trải nghiệm khớp mong đợi.\n- **Hài lòng:** Đánh giá 5 sao.\n- **Ý định:** Sẽ mua tiếp.\n\n#Mô hình nghiên cứu #ECT #ncsStat',
                content_en: '**Scenario:**\n- **Expectation:** Fast delivery, quality goods.\n- **Performance:** On-time, well-packaged.\n- **Confirmation:** Matches expectation.\n- **Satisfaction:** 5-star rating.\n- **Continuance:** Will repurchase.\n\n#ResearchModel #ECT #ncsStat'
            }
        ]
    },
    'sor-model-marketing-behavior': {
        slug: 'sor-model-marketing-behavior', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình S-O-R: Case Study Livestream bán hàng',
        title_en: 'S-O-R Model: Live-stream Selling Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Mua hàng qua TikTok Live', 
                h2_en: '3. Practical Case Study: TikTok Live Shopping',
                content_vi: '**Phân tích:**\n- **S:** KOL lôi cuốn, voucher gấp.\n- **O:** Cảm thấy hưng phấn (FOMO).\n- **R:** Nhấn mua ngay (Impulse buying).\n\n#Mô hình nghiên cứu #SOR #ncsStat',
                content_en: '**Analysis:**\n- **S:** Engaging KOL, urgent vouchers.\n- **O:** Excitement (FOMO).\n- **R:** Impulse buying.\n\n#ResearchModel #SOR #ncsStat'
            }
        ]
    },
    'perceived-value-marketing-strategy': {
        slug: 'perceived-value-marketing-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Giá trị Cảm nhận: Case Study Xe hơi hạng sang',
        title_en: 'Perceived Value: Luxury Car Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Mercedes-Benz', 
                h2_en: '3. Practical Case Study: Mercedes-Benz',
                content_vi: '**Phân tích giá trị:**\n- **Chức năng:** Động cơ mạnh, nội thất sang.\n- **Cảm xúc:** Niềm tự hào.\n- **Xã hội:** Khẳng định đẳng cấp.\n\n#Mô hình nghiên cứu #GiáTrịCảmNhận #ncsStat',
                content_en: '**Analysis:**\n- **Functional:** Strong engine, luxury interior.\n- **Emotional:** Pride.\n- **Social:** Status affirmation.\n\n#ResearchModel #PerceivedValue #ncsStat'
            }
        ]
    },
    'tce-transaction-cost-economics-strategy': {
        slug: 'tce-transaction-cost-economics-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Kinh tế học Chi phí Giao dịch (TCE): Case Study Grab',
        title_en: 'Transaction Cost Economics (TCE): Grab Case Study',
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
                h2_vi: '3. Case Study Thị phạm: Grab mua lại Uber SEA', 
                h2_en: '3. Practical Case Study: Grab acquiring Uber SEA',
                content_vi: '**Phân tích:** Việc sát nhập giúp giảm chi phí giao dịch từ cạnh tranh, tối ưu hóa mạng lưới tài xế hiện có (Asset Specificity).\n\n#Mô hình nghiên cứu #TCE #ncsStat',
                content_en: '**Analysis:** Merger minimized transaction costs, optimized driver networks (Asset Specificity).\n\n#ResearchModel #TCE #ncsStat'
            }
        ]
    }
};

export const DEFAULT_ARTICLE = {
    slug: 'unknown', category: 'Academy Content', title_vi: 'Đang tải nội dung...', title_en: 'Loading Content...',
    expert_tip_vi: 'Đang tải...', expert_tip_en: 'Loading...', author: 'ncsStat', updated_at: new Date().toISOString(),
    content_structure: [{ h2_vi: 'Đang tải...', h2_en: 'Loading...', content_vi: 'Nội dung đang được hệ thống nạp từ thư viện tri thức...', content_en: 'Please wait while content is loading...' }]
};
