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
        description_vi: 'Mô hình nền tảng trong nghiên cứu Hệ thống thông tin (MIS), giải thích cách người dùng chấp nhận công nghệ qua Sự hữu ích cảm nhận (PU) và Sự dễ sử dụng cảm nhận (PEOU). [Insight: Độ tin cậy Alpha kỳ vọng > 0.80]',
        description_en: 'Foundational MIS model explaining technology acceptance via Perceived Usefulness (PU) and Perceived Ease of Use (PEOU).',
        category: ['MIS', 'Modern Research (2020+)'],
        tags: ['Technology', 'Acceptance', 'Davis 1989'],
        research_model: 'PU/PEOU -> Attitude -> Intention -> Use',
        scale_items: [
            { code: 'PU1', text_vi: 'Sử dụng hệ thống giúp tôi hoàn thành công việc nhanh hơn.', text_en: 'Using the system enables me to accomplish tasks more quickly.' },
            { code: 'PU2', text_vi: 'Sử dụng hệ thống giúp nâng cao hiệu suất làm việc của tôi.', text_en: 'Using the system improves my job performance.' },
            { code: 'PU3', text_vi: 'Sử dụng hệ thống giúp tôi làm việc hiệu quả hơn.', text_en: 'Using the system increases my productivity.' },
            { code: 'PEOU1', text_vi: 'Việc học cách sử dụng hệ thống đối với tôi rất dễ dàng.', text_en: 'Learning to operate the system would be easy for me.' },
            { code: 'PEOU2', text_vi: 'Tôi thấy hệ thống này rất dễ sử dụng.', text_en: 'I would find the system easy to use.' },
            { code: 'PEOU3', text_vi: 'Thao tác với hệ thống không đòi hỏi nhiều nỗ lực.', text_en: 'It is easy for me to become skillful at using the system.' }
        ],
        content_structure: [
            {
                h2_vi: 'Mô hình TAM là gì?',
                h2_en: 'What is TAM?',
                content_vi: 'Mô hình Chấp nhận Công nghệ (TAM - Technology Acceptance Model) được Davis giới thiệu năm 1989 là một trong những mô hình kinh điển và phổ biến nhất trong lĩnh vực Hệ thống Thông tin. Mô hình này giải thích lý do tại sao người dùng chấp nhận hoặc từ chối một công nghệ mới thông qua hai yếu tố chính: **Sự hữu ích cảm nhận (Perceived Usefulness)** và **Sự dễ sử dụng cảm nhận (Perceived Ease of Use)**.',
                content_en: 'The Technology Acceptance Model (TAM) introduced by Davis in 1989 is one of the most classic models in MIS. It explains why users accept or reject a new technology through two main factors: **Perceived Usefulness** and **Perceived Ease of Use**.'
            }
        ]
    },
    {
        id: 'utaut2-model-2012',
        name_vi: 'Chấp nhận Công nghệ Mở rộng (UTAUT2)',
        name_en: 'Extended UTAUT Model',
        author: 'Venkatesh et al.',
        year: 2012,
        citation: 'Venkatesh, V., Thong, J. Y., & Xu, X. (2012). Consumer acceptance and use of information technology. MIS Quarterly.',
        description_vi: 'Mô hình chuẩn mực cho nghiên cứu hành vi người tiêu dùng trong kỷ nguyên số, bổ sung Động lực hưởng thụ và Thói quen vào khung UTAUT gốc. [Insight: Phù hợp cho thương mại điện tử và ứng dụng di động]',
        description_en: 'Standard model for consumer behavior research, adding Hedonic Motivation and Habit to the original UTAUT framework.',
        category: ['MIS', 'Marketing'],
        tags: ['Consumer', 'Technology', 'UTAUT2'],
        research_model: 'Performance/Effort/Social/Facilitating/Hedonic/Price/Habit -> Intention',
        scale_items: [
            { code: 'HM1', text_vi: 'Sử dụng công nghệ này rất thú vị.', text_en: 'Using this technology is enjoyable.' },
            { code: 'HM2', text_vi: 'Tôi thấy vui khi sử dụng công nghệ này.', text_en: 'Using this technology is fun.' },
            { code: 'PV1', text_vi: 'Công nghệ này có giá trị tốt so với chi phí.', text_en: 'This technology is reasonably priced.' },
            { code: 'HT1', text_vi: 'Sử dụng công nghệ này đã trở thành thói quen của tôi.', text_en: 'The use of this technology has become a habit for me.' }
        ],
        content_structure: [
            {
                h2_vi: 'UTAUT2 mở rộng điều gì?',
                h2_en: 'What does UTAUT2 extend?',
                content_vi: 'Khác với UTAUT ban đầu tập trung vào môi trường doanh nghiệp (nơi nhân viên bị bắt buộc sử dụng hệ thống), UTAUT2 do Venkatesh và cộng sự phát triển năm 2012 tập trung vào **Người tiêu dùng cuối (Consumers)**.\n\nBa biến số cực kỳ quan trọng được bổ sung vào UTAUT2 là:\n- **Động lực hưởng thụ (Hedonic Motivation):** Cảm giác thích thú khi sử dụng công nghệ.\n- **Giá trị cảm nhận (Price Value):** Sự đánh đổi giữa lợi ích công nghệ mang lại so với chi phí bỏ ra.\n- **Thói quen (Habit):** Mức độ người dùng thực hiện hành vi một cách tự động vì đã quá quen thuộc.',
                content_en: 'Unlike the original UTAUT which focused on organizational contexts, UTAUT2 (Venkatesh et al., 2012) focuses on **Consumers**.\n\nThree critical variables were added:\n- **Hedonic Motivation:** The fun or pleasure derived from using a technology.\n- **Price Value:** The cognitive tradeoff between perceived benefits and cost.\n- **Habit:** The extent to which people tend to perform behaviors automatically.'
            }
        ]
    },
    {
        id: 'psych-safety-1999',
        name_vi: 'An toàn Tâm lý (Psychological Safety)',
        name_en: 'Psychological Safety Scale',
        author: 'Edmondson',
        year: 1999,
        citation: 'Edmondson, A. (1999). Psychological safety and learning behavior in work teams. Administrative Science Quarterly.',
        description_vi: 'Đo lường niềm tin rằng nhúm là nơi an toàn để chấp nhận rủi ro và chia sẻ ý kiến mà không sợ bị trừng phạt. [Insight: Biến trung gian quan trọng cho hiệu quả làm việc nhóm]',
        description_en: 'Measures the belief that the team is safe for risk-taking and sharing ideas without fear of punishment.',
        category: ['Psychology', 'HR'],
        tags: ['Teamwork', 'Safety', 'Edmondson'],
        research_model: 'Trust -> Psychological Safety -> Learning -> Performance',
        scale_items: [
            { code: 'PS1', text_vi: 'Nếu tôi mắc sai lầm trong nhóm này, nó thường được đem ra để chống lại tôi (R).', text_en: 'If you make a mistake on this team, it is often held against you (R).' },
            { code: 'PS2', text_vi: 'Các thành viên trong nhóm này có thể trao đổi về các vấn đề và khó khăn.', text_en: 'Members of this team are able to bring up problems and tough issues.' },
            { code: 'PS3', text_vi: 'Mọi người trong nhóm này đôi khi cố tình từ chối người khác vì sự khác biệt (R).', text_en: 'People on this team sometimes reject others for being different (R).' }
        ]
    },
    {
        id: 'servperf-1992',
        name_vi: 'Hiệu quả Dịch vụ (SERVPERF)',
        name_en: 'Service Performance (SERVPERF)',
        author: 'Cronin & Taylor',
        year: 1992,
        citation: 'Cronin, J. J., & Taylor, S. A. (1992). Measuring service quality: a reexamination and extension. Journal of Marketing.',
        description_vi: 'Đo lường chất lượng dịch vụ dựa trên cảm nhận hiệu quả thực tế, khắc phục nhược điểm của mô hình SERVQUAL. [Insight: Ưu tiên dùng trong các ngành dịch vụ năng động]',
        description_en: 'Measures service quality based on actual performance perceptions, improving upon the SERVQUAL model.',
        category: ['Marketing', 'Tourism & Hospitality'],
        tags: ['Service', 'Quality', 'SERVPERF'],
        research_model: 'Performance -> Service Quality -> Satisfaction',
        scale_items: [
            { code: 'SP1', text_vi: 'Nhân viên ở đây luôn sẵn lòng giúp đỡ khách hàng.', text_en: 'Employees are always willing to help customers.' },
            { code: 'SP2', text_vi: 'Dịch vụ được thực hiện đúng ngay từ lần đầu tiên.', text_en: 'Service is performed right the first time.' },
            { code: 'SP3', text_vi: 'Cơ sở vật chất của đơn vị rất thu hút.', text_en: 'The facilities are visually appealing.' }
        ]
    }
];
