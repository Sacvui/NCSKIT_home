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
        title_vi: 'Mô hình Chấp nhận Công nghệ (TAM): Hướng dẫn Chuyên sâu',
        title_en: 'Technology Acceptance Model (TAM): The Ultimate Guide',
        expert_tip_vi: 'Để bài báo TAM đạt chuẩn Scopus Q1, hãy tích hợp thêm biến "Personal Innovativeness" hoặc các biến điều tiết như Age/Gender để tăng tính mới.',
        expert_tip_en: 'To reach Q1 journals with TAM, integrate "Personal Innovativeness" or moderators like Age/Gender to enhance theoretical novelty.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Nguồn gốc và Ý nghĩa', h2_en: '1. Origin and Significance',
                content_vi: 'Được Fred Davis giới thiệu năm 1989, TAM là mô hình nền tảng trong nghiên cứu hành vi người dùng đối với công nghệ thông tin.',
                content_en: 'Introduced by Fred Davis in 1989, TAM is a cornerstone model for studying user behavior toward information technology.'
            },
            {
                h2_vi: '2. Sơ đồ Mô hình TAM', h2_en: '2. TAM Model Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'theory-of-planned-behavior-tpb': {
        slug: 'theory-of-planned-behavior-tpb', category: 'Behavioral Research',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Giải mã Ý định',
        title_en: 'Theory of Planned Behavior (TPB): Decoding Intentions',
        expert_tip_vi: 'Biến "Nhận thức kiểm soát hành vi" (PBC) thường có tác động trực tiếp đến cả Ý định và Hành vi thực tế.',
        expert_tip_en: 'Perceived Behavioral Control (PBC) often has a direct impact on both Intention and Actual Behavior.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ Mô hình TPB', h2_en: '1. TPB Model Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            },
            {
                h2_vi: '2. Các thành phần chính', h2_en: '2. Key Constructs',
                content_vi: 'TPB bao gồm 3 tiền tố chính: Thái độ, Chuẩn chủ quan và Kiểm soát hành vi cảm nhận.',
                content_en: 'TPB consists of 3 main antecedents: Attitude, Subjective Norm, and Perceived Behavioral Control.'
            }
        ]
    },
    'servqual-service-quality-model': {
        slug: 'servqual-service-quality-model', category: 'Marketing Research',
        title_vi: 'Mô hình SERVQUAL: Đo lường Chất lượng Dịch vụ',
        title_en: 'SERVQUAL: Measuring Service Quality',
        expert_tip_vi: 'Sử dụng khoảng cách (Gaps) giữa kỳ vọng và thực tế để xác định điểm yếu của dịch vụ.',
        expert_tip_en: 'Use the gaps between expectations and reality to identify service weaknesses.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ SERVQUAL', h2_en: '1. SERVQUAL Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/servqual_model.png" alt="SERVQUAL Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/servqual_model.png" alt="SERVQUAL Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'utaut-technology-adoption': {
        slug: 'utaut-technology-adoption', category: 'Research Models',
        title_vi: 'Thuyết Hợp nhất Chấp nhận Công nghệ (UTAUT)',
        title_en: 'UTAUT: Unified Theory of Acceptance and Use of Technology',
        expert_tip_vi: 'UTAUT là sự lựa chọn mạnh mẽ nhất khi nghiên cứu về việc chấp nhận phần mềm trong doanh nghiệp.',
        expert_tip_en: 'UTAUT is the strongest choice when researching software adoption in corporate settings.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ UTAUT', h2_en: '1. UTAUT Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'porter-five-forces-analysis': {
        slug: 'porter-five-forces-analysis', category: 'Market Strategy',
        title_vi: 'Mô hình 5 Áp lực Cạnh tranh (Michael Porter)',
        title_en: 'Porter\'s Five Forces Analysis',
        expert_tip_vi: 'Hãy chú ý đến sức mạnh của các nhà cung cấp nếu bạn đang trong ngành sản xuất linh kiện.',
        expert_tip_en: 'Pay attention to supplier power if you are in the components manufacturing industry.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ 5 Áp lực', h2_en: '1. Five Forces Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/porter_5_forces.png" alt="Porter Five Forces" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/porter_5_forces.png" alt="Porter Five Forces" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'vrio-framework-strategy': {
        slug: 'vrio-framework-strategy', category: 'Market Strategy',
        title_vi: 'Khung VRIO: Đánh giá Nguồn lực nội tại',
        title_en: 'VRIO Framework: Assessing Internal Resources',
        expert_tip_vi: 'Một nguồn lực quý hiếm nhưng dễ bắt chước sẽ không tạo ra lợi thế bền vững.',
        expert_tip_en: 'A rare resource that is easy to imitate will not create sustainable advantage.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ VRIO', h2_en: '1. VRIO Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'expectation-confirmation-theory-ect': {
        slug: 'expectation-confirmation-theory-ect', category: 'Marketing Research',
        title_vi: 'Thuyết Kỳ vọng - Xác nhận (ECT)',
        title_en: 'Expectation-Confirmation Theory (ECT)',
        expert_tip_vi: 'Mô hình này giải thích tại sao khách hàng quay lại mua sắm lần thứ 2.',
        expert_tip_en: 'This model explains why customers return for a second purchase.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ ECT', h2_en: '1. ECT Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'sor-model-marketing-behavior': {
        slug: 'sor-model-marketing-behavior', category: 'Behavioral Research',
        title_vi: 'Mô hình S-O-R: Kích thích - Cơ thể - Phản hồi',
        title_en: 'S-O-R Model: Stimulus-Organism-Response',
        expert_tip_vi: 'Cảm xúc (Organism) là cầu nối quan trọng giữa không gian cửa hàng và hành vi mua.',
        expert_tip_en: 'Emotion (Organism) is a key bridge between store atmosphere and buying behavior.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ S-O-R', h2_en: '1. S-O-R Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/sor_model.png" alt="SOR Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/sor_model.png" alt="SOR Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'perceived-value-marketing-strategy': {
        slug: 'perceived-value-marketing-strategy', category: 'Marketing Research',
        title_vi: 'Mô hình Giá trị Cảm nhận (Perceived Value)',
        title_en: 'Perceived Value in Marketing Strategy',
        expert_tip_vi: 'Lợi ích càng cao, chi phí càng thấp thì giá trị cảm nhận càng tăng.',
        expert_tip_en: 'Higher benefits and lower costs lead to increased perceived value.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ Giá trị Cảm nhận', h2_en: '1. Perceived Value Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/perceived_value.png" alt="Perceived Value Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/perceived_value.png" alt="Perceived Value Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
            }
        ]
    },
    'tce-transaction-cost-economics-strategy': {
        slug: 'tce-transaction-cost-economics-strategy', category: 'Advanced Research',
        title_vi: 'Kinh tế học Chi phí Giao dịch (TCE)',
        title_en: 'Transaction Cost Economics (TCE)',
        expert_tip_vi: 'Tính đặc thù của tài sản là yếu tố quan trọng nhất đẩy chi phí giao dịch lên cao.',
        expert_tip_en: 'Asset specificity is the most important factor driving up transaction costs.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sơ đồ TCE', h2_en: '1. TCE Diagram', is_html: true,
                content_vi: '<img src="/images/knowledge/tce_model.png" alt="TCE Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />',
                content_en: '<img src="/images/knowledge/tce_model.png" alt="TCE Model" class="rounded-[2rem] shadow-2xl my-8 border border-slate-100 w-full" />'
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
