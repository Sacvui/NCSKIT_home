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
                h2_vi: '1. Sức sống mãnh liệt của TAM (Davis, 1989)', 
                h2_en: '1. The Enduring Power of TAM',
                content_vi: `Ra đời từ năm 1989 bởi Fred Davis, Mô hình Chấp nhận Công nghệ (TAM) đến nay vẫn là "vị vua không ngai" trong lĩnh vực nghiên cứu hành vi hệ thống thông tin. Sức mạnh của TAM nằm ở sự tinh gọn tối đa: thay vì nhồi nhét hàng tá biến số phức tạp, TAM chỉ dùng đúng 2 biến cốt lõi để dự đoán xem con người có dùng công nghệ hay không:
- **Hữu ích cảm nhận (Perceived Usefulness - PU):** "Cái này có giúp tôi làm việc nhanh hơn, tốt hơn không?"
- **Dễ sử dụng cảm nhận (Perceived Ease of Use - PEOU):** "Cái này có bắt tôi phải suy nghĩ mệt óc hay tốn thời gian học cách dùng không?"

Triết lý sâu xa của TAM là: Con người về bản chất là thực dụng và lười biếng. Chúng ta chỉ dùng một công nghệ mới khi nó mang lại lợi ích rõ rệt (PU) và không đòi hỏi sự nỗ lực làm quen quá lớn (PEOU).`,
                content_en: `Introduced by Fred Davis in 1989, the Technology Acceptance Model (TAM) remains the "uncrowned king" of information systems research.`
            },
            {
                h2_vi: '2. Phân tích Case Study: Chatbot AI trong Y tế', 
                h2_en: '2. Case Study Analysis: AI Chatbot in Healthcare',
                content_vi: `**Đề tài:** "Nghiên cứu các yếu tố ảnh hưởng đến ý định sử dụng hệ thống tư vấn sức khỏe bằng AI Chatbot của người cao tuổi".

**Cách xử lý khéo léo với TAM:**
- Khác với giới trẻ, người cao tuổi rất sợ công nghệ. Do đó, biến **PEOU** (Dễ sử dụng) phải được thiết kế câu hỏi xoay quanh: "Giao diện chữ to", "Hỗ trợ điều khiển bằng giọng nói tiếng Việt". Mối quan hệ từ PEOU tác động lên PU trong bối cảnh này thường mạnh hơn so với tập mẫu trẻ tuổi.
- **Biến mở rộng bắt buộc phải có:** Nếu bạn nộp bài TAM nguyên thủy cho các tạp chí uy tín hiện nay, 90% sẽ bị từ chối vì "thiếu tính mới". Hãy tích hợp thêm các biến từ lý thuyết khác. Trong lĩnh vực y tế, hãy ghép thêm biến **Perceived Risk (Rủi ro cảm nhận)** hoặc **Trust (Niềm tin)**. Lý do: Dù app có dễ dùng đến mấy, nếu AI chẩn đoán sai bệnh, họ sẽ không bao giờ dùng.

*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `*Researched and compiled by **Le Phuc Hai**.*`
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
                h2_vi: '1. Tại sao lại cần tới UTAUT2?', 
                h2_en: '1. Why UTAUT2?',
                content_vi: `Khi công nghệ dịch chuyển từ môi trường công sở (nơi nhân viên bị ÉP phải dùng phần mềm công ty) sang môi trường tiêu dùng cá nhân (nơi khách hàng TỰ DO lựa chọn tải app), các mô hình cũ như TAM hay UTAUT1 bắt đầu bộc lộ lỗ hổng.

Venkatesh (2012) đã tạo ra một "vụ nổ" trong giới học thuật khi công bố UTAUT2 bằng cách bổ sung 3 "vũ khí hạng nặng" để giải thích hành vi người tiêu dùng cá nhân:
- **Động lực hưởng thụ (Hedonic Motivation):** Khách hàng dùng app không chỉ vì nó hữu ích, mà vì nó... VUI. (Ví dụ: Lướt TikTok, chơi game).
- **Giá trị giá cả (Price Value):** Khách hàng tự bỏ tiền túi ra mua app, nên họ phải cân nhắc xem lợi ích có xứng đáng với số tiền bỏ ra không.
- **Thói quen (Habit):** Khi một hành vi được lặp đi lặp lại đủ nhiều, nó trở thành vô thức. Bạn mở Facebook mỗi sáng không phải vì bạn nghĩ nó hữu ích, mà vì đó là thói quen.`,
                content_en: `When technology shifted from the workplace to the consumer context, older models like TAM showed gaps. Venkatesh (2012) introduced UTAUT2 with 3 new variables: Hedonic Motivation, Price Value, and Habit.`
            },
            {
                h2_vi: '2. Bí kíp áp dụng UTAUT2 "bất bại"', 
                h2_en: '2. Foolproof UTAUT2 Application',
                content_vi: `UTAUT2 là một mô hình rất "nặng" (có tới 7 biến độc lập). Lời khuyên thực chiến cho các bạn làm luận văn:
- **Không nhất thiết phải lấy trọn bộ 7 biến:** Tùy vào bối cảnh, bạn có quyền cắt bỏ. Ví dụ, nếu bạn nghiên cứu app khai báo y tế (miễn phí), hãy mạnh dạn XÓA biến Price Value (Giá cả). 
- **Cẩn thận với biến Thói quen (Habit):** Nếu bạn nghiên cứu một công nghệ hoàn toàn MỚI mà người dùng chưa từng tiếp xúc (như Metaverse), thì không thể có "Thói quen" được. Việc cố tình nhét biến này vào sẽ khiến hội đồng phản biện đánh giá bạn không hiểu bản chất mô hình.

*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `*Researched and compiled by **Le Phuc Hai**.*`
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
        ],
        content_structure: [
            {
                h2_vi: '1. An toàn Tâm lý (Psychological Safety) là gì?', 
                h2_en: '1. What is Psychological Safety?',
                content_vi: `Thuật ngữ "An toàn Tâm lý" được Amy Edmondson (1999) định nghĩa là một niềm tin được chia sẻ trong tập thể rằng: "Nhóm của chúng ta là một môi trường an toàn để dám chấp nhận rủi ro trong quan hệ giữa các cá nhân".

Nói một cách dân dã: Đó là khi bạn dám giơ tay trong cuộc họp và nói "Tôi đã làm sai", hoặc "Ý tưởng của sếp có vẻ không khả thi", mà KHÔNG SỢ bị trừng phạt, bêu hiếu hay đánh giá thấp. Nó là nền tảng tối thượng của đổi mới sáng tạo (Innovation) và học tập tổ chức (Organizational Learning).`,
                content_en: `Psychological Safety, defined by Amy Edmondson (1999), is a shared belief that the team is safe for interpersonal risk-taking.`
            },
            {
                h2_vi: '2. Case Study: Project Aristotle của Google', 
                h2_en: "2. Case Study: Google's Project Aristotle",
                content_vi: `Năm 2012, Google khởi động Dự án Aristotle với ngân sách khổng lồ để tìm ra: "Điều gì tạo nên một đội nhóm hoàn hảo?". Họ đã phân tích IQ, kỹ năng code, bằng cấp, tính cách của hàng trăm nhóm. Kết quả? Không có bất kỳ mối tương quan nào!

Yếu tố DUY NHẤT phân biệt các nhóm xuất sắc nhất với phần còn lại chính là: **An toàn Tâm lý**. Ở những nhóm này, mọi thành viên đều được lên tiếng với thời lượng như nhau (Equality in distribution of conversational turn-taking) và họ có khả năng thấu cảm cao với cảm xúc của đồng nghiệp (High average social sensitivity).

*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `*Researched and compiled by **Le Phuc Hai**.*`
            }
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
        ],
        content_structure: [
            {
                h2_vi: '1. Cuộc lật đổ SERVQUAL vĩ đại', 
                h2_en: '1. The Great Overthrow of SERVQUAL',
                content_vi: `Suốt những năm 1980, SERVQUAL của Parasuraman thống trị tuyệt đối lĩnh vực dịch vụ bằng công thức: Chất lượng = Cảm nhận thực tế - Kỳ vọng (P - E). Nhưng đến năm 1992, Cronin và Taylor đã ném một "quả bom" vào giới hàn lâm khi tuyên bố: **"Đo lường Kỳ vọng là một sự phí phạm và sai lầm!"**

Họ lập luận rằng: Khi khách hàng đã bước ra khỏi cửa hàng, bộ não của họ tự động điều chỉnh lại kỳ vọng để khớp với những gì họ vừa trải nghiệm. Do đó, việc bắt họ điền vào bảng hỏi "Kỳ vọng của bạn TRƯỚC KHI sử dụng dịch vụ là gì?" là không chính xác và thừa thãi.
Họ đề xuất mô hình **SERVPERF (Service Performance)**: Chỉ cần đo lường **Cảm nhận thực tế (Performance)** là đủ! (Chất lượng = P).`,
                content_en: `Cronin and Taylor (1992) challenged SERVQUAL's (P-E) formula, arguing that measuring expectations is both redundant and flawed.`
            },
            {
                h2_vi: '2. Tại sao sinh viên lại cực kỳ "yêu thích" SERVPERF?', 
                h2_en: '2. Why students absolutely "love" SERVPERF?',
                content_vi: `Nếu làm luận văn bằng SERVQUAL, bạn sẽ phải ép khách hàng trả lời một bảng hỏi dài 44 câu (22 câu Kỳ vọng + 22 câu Cảm nhận). Khách hàng sẽ chán nản, đánh lụi, và kết quả chạy SPSS của bạn sẽ nát bét (Cronbach's Alpha thấp, EFA rớt biến lả tả).

Với SERVPERF, bạn **CẮT ĐÔI** số lượng câu hỏi, chỉ còn đúng 22 câu hỏi về Cảm nhận thực tế.
- Khách hàng điền nhanh hơn.
- Dữ liệu thu về "sạch" hơn, ít thiên kiến (bias).
- Kết quả chạy SPSS đẹp như tranh vẽ.

*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `*Researched and compiled by **Le Phuc Hai**.*`
            }
        ]
    }
];
