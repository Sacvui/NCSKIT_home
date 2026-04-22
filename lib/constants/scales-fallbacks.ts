/**
 * NCSStat Scales Fallback Repository
 * These are research-grade scales that ensure the library is never empty 
 * even if database connectivity is intermittent or for legacy support.
 */

export const STATIC_SCALES = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name_vi: 'Chất lượng Dịch vụ (SERVQUAL)',
        name_en: 'Service Quality (SERVQUAL)',
        author: 'Parasuraman et al.',
        year: 1988,
        citation: 'Parasuraman, A., Zeithaml, V. A., & Berry, L. L. (1988). SERVQUAL: A multiple-item scale for measuring consumer perceptions of service quality.',
        description_vi: 'Mô hình kinh điển đo lường chất lượng dịch vụ qua 5 khía cạnh (Tin cậy, Đáp ứng, Năng lực phục vụ, Đồng cảm, Phương tiện hữu hình).',
        description_en: 'The premier multi-dimensional scale for measuring service quality across Reliability, Responsiveness, Assurance, Empathy, and Tangibles.',
        category: ['Marketing'],
        scale_items: [
            { code: 'TAN1', text_vi: 'Doanh nghiệp có trang thiết bị hiện đại.', text_en: 'The company has modern-looking equipment.' },
            { code: 'TAN2', text_vi: 'Cơ sở vật chất của doanh nghiệp trông bắt mắt.', text_en: 'The physical facilities are visually appealing.' },
            { code: 'REL1', text_vi: 'Khi doanh nghiệp hứa làm điều gì đó vào thời gian nào đó, họ sẽ thực hiện.', text_en: 'When the company promises to do something by a certain time, it does so.' },
            { code: 'RES1', text_vi: 'Nhân viên phục vụ bạn nhanh chóng.', text_en: 'Employees give you prompt service.' },
            { code: 'ASS1', text_vi: 'Hành vi của nhân viên tạo niềm tin cho khách hàng.', text_en: 'The behavior of employees instills confidence in customers.' },
            { code: 'EMP1', text_vi: 'Doanh nghiệp dành cho bạn sự quan tâm cá nhân.', text_en: 'The company gives you individual attention.' }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name_vi: 'Sự Hài lòng trong Công việc',
        name_en: 'Job Satisfaction',
        author: 'Spector',
        year: 1985,
        citation: 'Spector, P. E. (1985). Measurement of human service staff satisfaction: Development of the Job Satisfaction Survey.',
        description_vi: 'Đo lường mức độ thỏa mãn của nhân viên đối với các khía cạnh công việc như lương bổng, thăng tiến, sự giám sát và đồng nghiệp.',
        description_en: 'Measures employee satisfaction across facets such as pay, promotion, supervision, and co-workers.',
        category: ['HR'],
        scale_items: [
            { code: 'SAT1', text_vi: 'Tôi cảm thấy mình được trả lương xứng đáng cho công việc đang làm.', text_en: 'I feel I am being paid a fair amount for the work I do.' },
            { code: 'SAT2', text_vi: 'Có rất ít cơ hội thăng tiến trong công việc của tôi.', text_en: 'There is really too little chance for promotion on my job.' },
            { code: 'SAT3', text_vi: 'Cấp trên của tôi là người khá công tâm.', text_en: 'My supervisor is quite fair in his/her treatment of me.' }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name_vi: 'Lòng Trung thành của Khách hàng',
        name_en: 'Customer Loyalty',
        author: 'Zeithaml et al.',
        year: 1996,
        citation: 'Zeithaml, V. A., Berry, L. L., & Parasuraman, A. (1996). The behavioral consequences of service quality. Journal of Marketing.',
        description_vi: 'Đo lường ý định hành vi của khách hàng như giới thiệu cho người khác (WoM) và ý định quay lại.',
        description_en: 'Measures behavioral intentions such as positive word-of-mouth and repurchase intentions.',
        category: ['Marketing'],
        scale_items: [
            { code: 'LOY1', text_vi: 'Tôi sẽ nói những điều tích cực về doanh nghiệp này với người khác.', text_en: 'I will say positive things about this company to other people.' },
            { code: 'LOY2', text_vi: 'Tôi sẽ giới thiệu doanh nghiệp này cho bất kỳ ai cần lời khuyên.', text_en: 'I will recommend this company to anyone who seeks my advice.' },
            { code: 'LOY3', text_vi: 'Tôi xem doanh nghiệp này là lựa chọn hàng đầu của mình.', text_en: 'I consider this company my first choice for service.' }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name_vi: 'Cân bằng Công việc - Cuộc sống',
        name_en: 'Work-Life Balance',
        author: 'Hayman',
        year: 2005,
        citation: 'Hayman, J. R. (2005). Psychometric assessment of an instrument designed to measure work life balance. Research and Practice in Human Resource Management.',
        description_vi: 'Đánh giá sự cân bằng giữa yêu cầu công việc và đời sống cá nhân của nhân viên.',
        description_en: 'Assesses the balance between work demands and personal life of employees.',
        category: ['HR'],
        scale_items: [
            { code: 'WLB1', text_vi: 'Công việc của tôi khiến tôi khó duy trì loại đời sống cá nhân mà tôi mong muốn.', text_en: 'My personal life suffers because of my work.' },
            { code: 'WLB2', text_vi: 'Tôi thường quá mệt mỏi sau khi đi làm về để thực hiện các công việc gia đình.', text_en: 'I am often too tired after work to participate in family activities.' },
            { code: 'WLB3', text_vi: 'Công việc của tôi làm tiêu tốn thời gian mà tôi muốn dành cho gia đình hoặc bạn bè.', text_en: 'My job takes up time that I would like to spend with family or friends.' }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name_vi: 'Động lực Nội tại (Intrinsic Motivation)',
        name_en: 'Intrinsic Motivation',
        author: 'Amabile et al.',
        year: 1994,
        citation: 'Amabile, T. M., Hill, K. G., Hennessey, B. A., & Tighe, E. M. (1994). The Work Preference Inventory: Assessing intrinsic and extrinsic motivation.',
        description_vi: 'Đo lường mức độ cá nhân thực hiện công việc vì sự hứng thú, thách thức và thỏa mãn nội tại.',
        description_en: 'Measures the degree to which individuals perform tasks for inherent interest, challenge, and satisfaction.',
        category: ['HR', 'Psychology'],
        scale_items: [
            { code: 'MOT1', text_vi: 'Tôi tận hưởng việc giải quyết những vấn đề mới và khó khăn trong công việc.', text_en: 'I enjoy tackling problems that are completely new to me.' },
            { code: 'MOT2', text_vi: 'Tôi muốn công việc của mình cung cấp cho mình nhiều cơ hội để học hỏi.', text_en: 'I want my work to provide me with many opportunities for learning.' },
            { code: 'MOT3', text_vi: 'Sự hài lòng khi hoàn thành một công việc khó khăn là phần thưởng lớn nhất đối với tôi.', text_en: 'The satisfaction of completing a difficult task is its own reward for me.' }
        ]
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name_vi: 'Niềm tin vào Tổ chức (Organizational Trust)',
        name_en: 'Organizational Trust',
        author: 'McAllister',
        year: 1995,
        citation: 'McAllister, D. J. (1995). Affect- and cognition-based trust as foundations for interpersonal cooperation in organizations. Academy of Management Journal.',
        description_vi: 'Đo lường niềm tin dựa trên nhận thức và cảm xúc của nhân viên đối với tổ chức và đồng nghiệp.',
        description_en: 'Measures cognition-based and affect-based trust within organizations.',
        category: ['HR'],
        scale_items: [
            { code: 'TRU1', text_vi: 'Chúng tôi có thể tin tưởng rằng mỗi người trong tổ chức sẽ làm tốt công việc của mình.', text_en: 'We can all freely share our ideas, feelings, and hopes with one another.' },
            { code: 'TRU2', text_vi: 'Tôi có thể dựa vào đồng nghiệp của mình khi gặp khó khăn trong công việc.', text_en: 'I can rely on my colleagues when I face challenges at work.' },
            { code: 'TRU3', text_vi: 'Hầu hết mọi người trong tổ chức này đều hành động một cách chính trực.', text_en: 'Most people in this organization act with integrity.' }
        ]
    }
];
