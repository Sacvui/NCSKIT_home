/**
 * NCSStat Scales Fallback Repository
 * These are research-grade scales that ensure the library is never empty 
 * even if database connectivity is intermittent or for legacy support.
 */

export const STATIC_SCALES = [
    {
        id: 'tam-model-1989',
        name_vi: 'Mô hình Chấp nhận Công nghệ (TAM)',
        name_en: 'Technology Acceptance Model (TAM)',
        author: 'Davis',
        year: 1989,
        citation: 'Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly.',
        description_vi: 'Mô hình nền tảng trong nghiên cứu Hệ thống thông tin (MIS), giải thích cách người dùng chấp nhận và sử dụng công nghệ thông qua hai nhân tố chính: Sự hữu ích cảm nhận và Sự dễ sử dụng cảm nhận.',
        description_en: 'The foundational model in MIS research, explaining how users accept and use technology through two primary constructs: Perceived Usefulness and Perceived Ease of Use.',
        category: ['MIS', 'Modern Research (2020+)'],
        tags: ['Technology', 'Acceptance', 'Davis 1989'],
        research_model: 'Independent Variable (IV) / Mediator',
        scale_items: [
            { code: 'PU1', text_vi: 'Sử dụng hệ thống giúp tôi hoàn thành công việc nhanh hơn.', text_en: 'Using the system enables me to accomplish tasks more quickly.' },
            { code: 'PU2', text_vi: 'Sử dụng hệ thống giúp nâng cao hiệu suất làm việc của tôi.', text_en: 'Using the system improves my job performance.' },
            { code: 'PU3', text_vi: 'Sử dụng hệ thống giúp tôi làm việc hiệu quả hơn.', text_en: 'Using the system increases my productivity.' },
            { code: 'PEOU1', text_vi: 'Việc học cách sử dụng hệ thống đối với tôi rất dễ dàng.', text_en: 'Learning to operate the system would be easy for me.' },
            { code: 'PEOU2', text_vi: 'Tôi thấy hệ thống này rất dễ sử dụng.', text_en: 'I would find the system easy to use.' },
            { code: 'PEOU3', text_vi: 'Thao tác với hệ thống không đòi hỏi nhiều nỗ lực.', text_en: 'It is easy for me to become skillful at using the system.' }
        ]
    },
    {
        id: 'tpb-model-1991',
        name_vi: 'Thuyết Hành vi Dự định (TPB)',
        name_en: 'Theory of Planned Behavior (TPB)',
        author: 'Ajzen',
        year: 1991,
        citation: 'Ajzen, I. (1991). The theory of planned behavior. Organizational Behavior and Human Decision Processes.',
        description_vi: 'Mô hình tâm lý xã hội giải thích ý định hành vi thông qua Thái độ, Chuẩn chủ quan và Nhận thức kiểm soát hành vi.',
        description_en: 'A socio-psychological model explaining behavioral intention through Attitude, Subjective Norms, and Perceived Behavioral Control.',
        category: ['Psychology', 'Marketing'],
        tags: ['Behavior', 'Intention', 'Ajzen 1991'],
        research_model: 'Conceptual Framework',
        scale_items: [
            { code: 'ATT1', text_vi: 'Đối với tôi, thực hiện hành vi này là một ý kiến hay.', text_en: 'For me, performing this behavior is a good idea.' },
            { code: 'ATT2', text_vi: 'Tôi thấy việc thực hiện hành vi này rất có lợi.', text_en: 'I find performing this behavior to be beneficial.' },
            { code: 'SN1', text_vi: 'Hầu hết những người quan trọng đối với tôi nghĩ rằng tôi nên làm việc này.', text_en: 'Most people who are important to me think I should do this.' },
            { code: 'PBC1', text_vi: 'Tôi có toàn quyền quyết định việc thực hiện hành vi này.', text_en: 'I have complete control over performing this behavior.' },
            { code: 'PBC2', text_vi: 'Nếu muốn, tôi có thể thực hiện hành vi này một cách dễ dàng.', text_en: 'If I wanted to, I could perform this behavior easily.' }
        ]
    },
    {
        id: 'servqual-1988',
        name_vi: 'Chất lượng Dịch vụ (SERVQUAL)',
        name_en: 'Service Quality (SERVQUAL)',
        author: 'Parasuraman et al.',
        year: 1988,
        citation: 'Parasuraman, A., Zeithaml, V. A., & Berry, L. L. (1988). SERVQUAL: A multiple-item scale for measuring consumer perceptions of service quality.',
        description_vi: 'Thang đo đa hướng (5 thành phần) dùng để đo lường cảm nhận của khách hàng về chất lượng dịch vụ.',
        description_en: 'A multi-dimensional scale (5 dimensions) used to measure consumer perceptions of service quality.',
        category: ['Marketing', 'Tourism & Hospitality'],
        tags: ['Service', 'Quality', 'Marketing'],
        research_model: 'Independent Variable',
        scale_items: [
            { code: 'TAN1', text_vi: 'Doanh nghiệp có trang thiết bị hiện đại.', text_en: 'The company has modern-looking equipment.' },
            { code: 'REL1', text_vi: 'Khi doanh nghiệp hứa thực hiện điều gì đó vào thời gian nào đó, họ sẽ thực hiện.', text_en: 'When the company promises to do something by a certain time, it does so.' },
            { code: 'RES1', text_vi: 'Nhân viên phục vụ bạn nhanh chóng.', text_en: 'Employees give you prompt service.' },
            { code: 'ASS1', text_vi: 'Hành vi của nhân viên tạo niềm tin cho khách hàng.', text_en: 'The behavior of employees instills confidence in customers.' },
            { code: 'EMP1', text_vi: 'Doanh nghiệp dành cho bạn sự quan tâm cá nhân.', text_en: 'The company gives you individual attention.' }
        ]
    }
];
