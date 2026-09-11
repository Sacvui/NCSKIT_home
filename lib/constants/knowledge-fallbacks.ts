export const FALLBACK_ARTICLES: Record<string, any> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha', category: 'Scale Reliability',
        title_vi: 'Cronbach\'s Alpha: Đánh giá tính nhất quán nội tại Masterclass',
        title_en: 'Cronbach\'s Alpha: Internal Consistency Masterclass',
        expert_tip_vi: 'Hãy luôn kiểm tra cột "Cronbach\'s Alpha if Item Deleted". Nếu xóa một câu mà Alpha tăng mạnh, câu đó chính là "kẻ phá bĩnh" thang đo của bạn.',
        expert_tip_en: 'Look beyond the global Alpha. Check "Alpha if Item Deleted"—if removing an item spikes the score, that item is undermining your scale.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Bản chất thực sự của Cronbach\'s Alpha',
                h2_en: '1. The True Nature of Cronbach\'s Alpha',
                content_vi: `Khi thiết kế một bảng hỏi đo lường khái niệm trừu tượng (ví dụ: "Áp lực công việc"), bạn không thể hỏi thẳng một câu duy nhất vì nó quá rủi ro và thiếu tính đại diện. Thay vào đó, bạn phải dùng 3 đến 5 câu hỏi (items) xoay quanh vấn đề đó. Vấn đề nảy sinh là: Làm sao chứng minh 5 câu hỏi này thực sự đang đo lường cùng một thứ chứ không phải đang "ông nói gà, bà nói vịt"?

Hệ số Cronbach\'s Alpha giải quyết chính xác câu hỏi này. Nó đánh giá mức độ tương quan lẫn nhau (inter-item correlation) của các biến quan sát. Nếu đáp viên trả lời một cách có hệ thống (ví dụ: điểm cao ở câu 1 thì cũng có xu hướng cho điểm cao ở câu 2 và 3), thì Alpha sẽ tiến về 1. Ngược lại, nếu các câu trả lời mâu thuẫn lộn xộn, hệ số này sẽ tụt dốc thê thảm.`,
                content_en: `When measuring an abstract concept (e.g., "Job Stress"), using a single question is risky and lacks representativeness. Instead, you use 3 to 5 items revolving around the construct. The problem is: How do you prove these 5 items are actually measuring the same underlying concept and not just random noise?

Cronbach\'s Alpha solves exactly this. It assesses the average inter-item correlation among your indicators. If respondents answer consistently (e.g., scoring high on item 1 tends to mean scoring high on items 2 and 3), Alpha approaches 1. If answers are wildly contradictory, the coefficient drops significantly.`
            },
            {
                h2_vi: '2. Các mốc "sinh tử" của hệ số Alpha',
                h2_en: '2. Critical Thresholds for Alpha',
                content_vi: `Không có một quy luật cứng nhắc nào áp dụng cho mọi trường hợp, nhưng giới học thuật thường thống nhất các ngưỡng an toàn sau để tránh bị phản biện hội đồng bắt bẻ:
- **Dưới 0.60:** Thang đo gần như "bỏ đi" nếu đây là nghiên cứu định lượng chính quy. Tuy nhiên, nếu bạn đang nghiên cứu thám hiểm (exploratory) hoặc test một thang đo hoàn toàn mới tự xây dựng, mức 0.60 đôi khi vẫn được châm chước.
- **Từ 0.60 đến 0.70:** Chấp nhận được, đặc biệt hữu ích trong các bối cảnh nghiên cứu mới hoặc mẫu có đặc thù riêng biệt (Hair et al., 2014).
- **Từ 0.70 đến 0.80:** Rất tốt. Đây là ngưỡng kỳ vọng của hầu hết các bài báo khoa học.
- **Từ 0.80 đến 0.95:** Tuyệt vời. Thang đo cực kỳ chặt chẽ.
- **Trên 0.95:** Hãy cẩn thận! Nhiều người tưởng điểm càng cao càng tốt, nhưng vượt qua 0.95 thường là dấu hiệu của hiện tượng "dư thừa" (redundancy). Tức là bạn đang hỏi đi hỏi lại một ý duy nhất bằng các từ ngữ khác nhau khiến đáp viên lặp lại câu trả lời như một cái máy. Lời khuyên là hãy cắt giảm bớt câu hỏi để tối ưu hóa thời gian làm khảo sát.`,
                content_en: `While there\'s no absolute rule, academia generally agrees on these safety thresholds to survive peer review:
- **Below 0.60:** Unacceptable for mature research. However, in strictly exploratory studies or when testing a newly developed scale, 0.60 can occasionally be justified.
- **0.60 to 0.70:** Acceptable, particularly useful in novel research contexts or unique sample characteristics (Hair et al., 2014).
- **0.70 to 0.80:** Good. The expected threshold for most scientific papers.
- **0.80 to 0.95:** Excellent. The scale is highly cohesive.
- **Above 0.95:** Beware! Many think higher is better, but exceeding 0.95 often signals redundancy. It means you are essentially asking the exact same question with slightly different wording. You should trim redundant items to reduce survey fatigue.`
            },
            {
                h2_vi: '3. "Bí kíp" xử lý khi Alpha quá thấp',
                h2_en: '3. What to do when Alpha is too low?',
                content_vi: `Đây là tình huống thực tế mà 80% sinh viên gặp phải khi chạy dữ liệu thực: Alpha tụt xuống 0.5. Đừng vội hoảng loạn xóa bỏ toàn bộ biến. Hãy mở ngay bảng **Item-Total Statistics** trong SPSS hoặc công cụ phân tích của bạn.

Tìm cột có tên **Cronbach\'s Alpha if Item Deleted** (Alpha nếu xóa biến này). Cột này chính là "kính lúp" giúp bạn phát hiện kẻ phá bĩnh. Nếu bạn thấy việc xóa đi câu hỏi số 2 (V2) làm Alpha của cả nhóm tăng vọt từ 0.55 lên 0.75, thì đừng ngần ngại loại bỏ câu V2 đó khỏi mô hình ngay lập tức. Nguyên nhân phổ biến thường do câu hỏi V2 bị dịch sai nghĩa, câu từ gây hiểu lầm, hoặc đơn giản là nó thuộc về một khái niệm khác (cần chạy EFA để kiểm chứng).

Một chỉ số khác cần soi kỹ là **Corrected Item-Total Correlation** (Tương quan biến tổng). Nếu chỉ số này bé hơn 0.3, câu hỏi đó cũng đang "lạc quẻ" và cần được cân nhắc loại bỏ.


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `This is a real-world scenario most students face: Alpha drops to 0.5. Don\'t panic and delete the whole construct. Immediately check the **Item-Total Statistics** table.

Look at the **Cronbach\'s Alpha if Item Deleted** column. This acts as a magnifying glass to spot the troublemaker. If deleting item 2 (V2) spikes your overall Alpha from 0.55 to 0.75, eliminate V2 from your model without hesitation. Common causes include poor translation, ambiguous phrasing, or the item inadvertently capturing a different concept entirely.

Another critical metric is the **Corrected Item-Total Correlation**. If this falls below 0.3, the item is poorly correlated with the rest of the scale and is a prime candidate for deletion.


*Researched and compiled by **Le Phuc Hai**.*`
            }
        ]
    },
    'what-is-a-research-model': {
        slug: 'what-is-a-research-model', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình Nghiên cứu (Research Model) là gì?',
        title_en: 'What is a Research Model?',
        expert_tip_vi: 'Mô hình nghiên cứu chính là bản đồ định vị của đề tài. Một mô hình tốt không chỉ cần rõ ràng mà còn phải có tính kế thừa từ các lý thuyết nền tảng (Base Theory).',
        expert_tip_en: 'A research model is the map of your study. A good model must be clear and derived from strong foundational theories.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Hiểu đúng về Mô hình Nghiên cứu (Research Model)', 
                h2_en: '1. Properly Understanding Research Models',
                content_vi: `Mô hình nghiên cứu không phải là một bức tranh vẽ tùy hứng. Nó là bản đồ tư duy chiến lược của toàn bộ công trình nghiên cứu, đóng vai trò "xương sống" định hình cách bạn thu thập và phân tích dữ liệu.

Một mô hình chuẩn mực giúp hội đồng phản biện chỉ cần nhìn vào sơ đồ là biết ngay bạn đang muốn chứng minh điều gì. Nó là sự chắt lọc từ hàng chục, thậm chí hàng trăm bài báo tổng quan tài liệu (Literature Review) để đúc kết lại thành những mũi tên có định hướng. Nếu mô hình sai, mọi kỹ thuật chạy dữ liệu siêu việt phía sau (như SEM, Machine Learning) đều trở nên vô nghĩa.`,
                content_en: `A research model is not an arbitrary drawing. It is the strategic mental map of your entire research project, serving as the "backbone" that shapes how you collect and analyze data.

A standardized model allows reviewers to instantly grasp what you intend to prove just by glancing at the diagram. It is the distillation of dozens or hundreds of literature reviews into directed arrows. If the model is flawed, all advanced data techniques applied later (like SEM) become completely meaningless.`
            },
            {
                h2_vi: '2. Giải phẫu các thành phần cốt lõi', 
                h2_en: '2. Anatomy of Core Components',
                content_vi: `Mô hình được cấu thành từ các hộp (biến số/khái niệm) và các mũi tên (giả thuyết). Đừng nhầm lẫn vai trò của chúng:

**Biến độc lập (Independent Variable - IV):** Đóng vai trò là "nguyên nhân". Đây là những yếu tố đầu vào mà bạn tin rằng nó sẽ tạo ra sự thay đổi. (Ví dụ: Chất lượng sản phẩm, Giá cả).
**Biến phụ thuộc (Dependent Variable - DV):** Đóng vai trò là "kết quả". Đây là hệ quả cuối cùng mà bạn muốn dự đoán hoặc giải thích. (Ví dụ: Sự hài lòng của khách hàng).
**Biến trung gian (Mediator):** Đây là yếu tố thường bị hiểu sai nhất. Biến trung gian là "chiếc cầu nối" giải thích cơ chế TẠI SAO biến độc lập lại tác động đến biến phụ thuộc. (Ví dụ: Chất lượng dịch vụ -> NIỀM TIN -> Lòng trung thành. Khách hàng trung thành không chỉ vì dịch vụ tốt, mà vì dịch vụ tốt tạo ra niềm tin).
**Biến điều tiết (Moderator):** Đây là yếu tố làm thay đổi "cường độ" hoặc "chiều hướng" của mối quan hệ. (Ví dụ: Giới tính, Độ tuổi. Thu nhập tác động đến quyết định mua xe hơi, nhưng ở người trẻ, mức độ tác động này mãnh liệt hơn so với người lớn tuổi).`,
                content_en: `Models consist of boxes (variables/constructs) and arrows (hypotheses). Never confuse their distinct roles:

**Independent Variable (IV):** Acts as the "cause." These are input factors you believe trigger change.
**Dependent Variable (DV):** Acts as the "effect." The ultimate outcome you aim to predict or explain.
**Mediator:** The most misunderstood factor. It is the "bridge" explaining the mechanism of WHY the IV affects the DV. (e.g., Service Quality -> TRUST -> Loyalty).
**Moderator:** The factor that alters the "strength" or "direction" of a relationship. (e.g., Income affects Car Purchases, but the magnitude is stronger for younger buyers than older ones).`
            },
            {
                h2_vi: '3. Cách vẽ mô hình không bị bắt bẻ', 
                h2_en: '3. How to build a bulletproof model',
                content_vi: `Nhiều bạn sinh viên hay mắc lỗi tự nghĩ ra các biến và nối mũi tên theo trực giác cá nhân. Xin khẳng định: Hội đồng sẽ lập tức bác bỏ! Mọi nét vẽ trong mô hình đều phải có căn cứ (Reference) rõ ràng.

Quy trình chuẩn bao gồm:
- **Dựa vào Lý thuyết nền (Base Theory):** Bạn định dùng lăng kính nào để soi rọi vấn đề? Nếu nghiên cứu về công nghệ, hãy gọi tên TAM, UTAUT. Nếu nghiên cứu hành vi tâm lý, hãy dùng TPB, TRA.
- **Kế thừa các nghiên cứu trước:** Chứng minh rằng mũi tên từ A -> B đã từng được học giả X (2020) và Y (2022) kiểm chứng thành công ở các bối cảnh khác.
- **Tạo ra Khoảng trống (Research Gap):** Khác biệt của bạn là gì? Thêm một biến trung gian mới, kiểm định một biến điều tiết mới (như tác động của Gen Z), hoặc áp dụng lý thuyết cũ vào một thị trường ngách hoàn toàn chưa ai làm.


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `Students often make the mistake of inventing variables and connecting them based on personal intuition. Reviewers will instantly reject this! Every single arrow must have a clear academic reference.

The bulletproof process involves:
- **Anchor on a Base Theory:** Which lens are you using? For tech, use TAM/UTAUT. For behavior, use TPB.
- **Inherit from Literature:** Prove that the A -> B arrow has been validated by Scholar X (2020) in other contexts.
- **Establish a Research Gap:** What\'s your unique contribution? Add a new mediator, test a novel moderator (like Gen Z), or apply a classic theory to a completely uncharted niche market.


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #Methodology #ncsStat`
            }
        ]
    },
    'technology-acceptance-model-tam': {
        slug: 'technology-acceptance-model-tam', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình TAM Masterclass: Phân tích sâu và Case Study thực tế',
        title_en: 'TAM Model Masterclass: Deep Analysis and Practical Case Study',
        expert_tip_vi: 'Để bài báo TAM đạt chuẩn Scopus Q1, hãy tích hợp thêm biến "Personal Innovativeness" hoặc các biến điều tiết như Age/Gender để tăng tính mới học thuật.',
        expert_tip_en: 'To reach Q1 journals with TAM, integrate "Personal Innovativeness" or moderators like Age/Gender to enhance theoretical novelty.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Sức sống mãnh liệt của TAM (Davis, 1989)', 
                h2_en: '1. The Enduring Power of TAM',
                content_vi: `Ra đời từ năm 1989 bởi Fred Davis, Mô hình Chấp nhận Công nghệ (TAM) đến nay vẫn là "vị vua không ngai" trong lĩnh vực nghiên cứu hành vi hệ thống thông tin. Sức mạnh của TAM nằm ở sự tinh gọn tối đa: thay vì nhồi nhét hàng tá biến số phức tạp, TAM chỉ dùng đúng 2 biến cốt lõi để dự đoán xem con người có dùng công nghệ hay không:
- **Hữu ích cảm nhận (Perceived Usefulness - PU):** "Cái này có giúp tôi làm việc nhanh hơn, tốt hơn không?"
- **Dễ sử dụng cảm nhận (Perceived Ease of Use - PEOU):** "Cái này có bắt tôi phải suy nghĩ mệt óc hay tốn thời gian học cách dùng không?"

Triết lý sâu xa của TAM là: Con người về bản chất là thực dụng và lười biếng. Chúng ta chỉ dùng một công nghệ mới khi nó mang lại lợi ích rõ rệt (PU) và không đòi hỏi sự nỗ lực làm quen quá lớn (PEOU).`,
                content_en: `Introduced by Fred Davis in 1989, the Technology Acceptance Model (TAM) remains the "uncrowned king" of information systems research. Its power lies in extreme parsimony: instead of dozens of variables, TAM uses just two core constructs to predict tech adoption:
- **Perceived Usefulness (PU):** "Will this help me work faster and better?"
- **Perceived Ease of Use (PEOU):** "Will this force me to overthink or spend hours learning how to use it?"

The profound philosophy of TAM is that humans are inherently pragmatic and effort-averse. We only adopt technology if it offers clear benefits (PU) without demanding excessive learning curves (PEOU).`
            },
            {
                h2_vi: '2. Sơ đồ Mô hình Cơ bản', h2_en: '2. Basic Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/tam_model.png" alt="TAM Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Phân tích Case Study: Chatbot AI trong Y tế', 
                h2_en: '3. Case Study Analysis: AI Chatbot in Healthcare',
                content_vi: `**Đề tài:** "Nghiên cứu các yếu tố ảnh hưởng đến ý định sử dụng hệ thống tư vấn sức khỏe bằng AI Chatbot của người cao tuổi".

**Cách xử lý khéo léo với TAM:**
- Khác với giới trẻ, người cao tuổi rất sợ công nghệ. Do đó, biến **PEOU** (Dễ sử dụng) phải được thiết kế câu hỏi xoay quanh: "Giao diện chữ to", "Hỗ trợ điều khiển bằng giọng nói tiếng Việt". Mối quan hệ từ PEOU tác động lên PU trong bối cảnh này thường mạnh hơn so với tập mẫu trẻ tuổi.
- **Biến mở rộng bắt buộc phải có:** Nếu bạn nộp bài TAM nguyên thủy cho các tạp chí uy tín hiện nay, 90% sẽ bị từ chối vì "thiếu tính mới". Hãy tích hợp thêm các biến từ lý thuyết khác. Trong lĩnh vực y tế, hãy ghép thêm biến **Perceived Risk (Rủi ro cảm nhận)** hoặc **Trust (Niềm tin)**. Lý do: Dù app có dễ dùng đến mấy, nếu AI chẩn đoán sai bệnh, họ sẽ không bao giờ dùng.
- Do đó, mô hình nâng cấp sẽ là sự đối đầu giữa Lợi ích (PU, PEOU) và Trở ngại (Risk), quyết định trực tiếp đến Ý định sử dụng (Intention).`,
                content_en: `**Research Title:** "Factors influencing the intention to use AI Chatbot health consultation systems among the elderly".

**Clever TAM Application:**
- Unlike youth, the elderly fear complex tech. Thus, **PEOU** items must focus on "large fonts" or "native voice command support." The path from PEOU to PU is often significantly stronger here than in younger demographics.
- **Mandatory Extension:** Submitting a vanilla TAM to top-tier journals today guarantees a 90% rejection rate for "lack of novelty." Integrate constructs from other theories. For healthcare, add **Perceived Risk** or **Trust**. Why? Even if the app is flawless, misdiagnosis fears override utility.
- The upgraded model becomes a tug-of-war between Benefits (PU, PEOU) and Inhibitors (Risk), ultimately predicting Intention.`
            },
            {
                h2_vi: '4. Cấu trúc câu hỏi thực chiến', 
                h2_en: '4. Practical Questionnaire Structure',
                content_vi: `Các chỉ báo (items) sau đây đã được chuẩn hóa, bạn chỉ cần thay đổi "tên hệ thống" cho phù hợp:

**Hữu ích cảm nhận (PU):**
- PU1: Hệ thống [Tên] giúp tôi hoàn thành công việc nhanh chóng hơn.
- PU2: Tôi thấy hệ thống [Tên] rất hữu ích trong cuộc sống hàng ngày.
- PU3: Việc sử dụng hệ thống [Tên] làm tăng hiệu suất của tôi.

**Dễ sử dụng cảm nhận (PEOU):**
- PEOU1: Tôi thấy việc thao tác trên hệ thống [Tên] rất rõ ràng và dễ hiểu.
- PEOU2: Tôi không cần mất nhiều thời gian hay công sức để học cách dùng.
- PEOU3: Tôi dễ dàng nhớ cách sử dụng hệ thống cho những lần sau.


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `These indicators are highly standardized; simply replace the "[System Name]":

**Perceived Usefulness (PU):**
- PU1: Using [System Name] enables me to accomplish tasks more quickly.
- PU2: I find [System Name] useful in my daily life.
- PU3: Using [System Name] enhances my effectiveness.

**Perceived Ease of Use (PEOU):**
- PEOU1: My interaction with [System Name] is clear and understandable.
- PEOU2: It does not require a lot of mental effort to learn.
- PEOU3: I find it easy to remember how to perform tasks.


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #TAM #ncsStat`
            }
        ]
    },
    'theory-of-planned-behavior-tpb': {
        slug: 'theory-of-planned-behavior-tpb', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết Hành vi Dự định (TPB): Case Study Tiêu dùng xanh',
        title_en: 'Theory of Planned Behavior (TPB): Green Consumption Case',
        expert_tip_vi: 'Biến "Nhận thức kiểm soát hành vi" (PBC) thường có tác động trực tiếp đến cả Ý định và Hành vi thực tế. Hãy chú ý kiểm định mối quan hệ này.',
        expert_tip_en: 'PBC often has a direct impact on both Intention and Behavior. Ensure you test this path.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Tại sao Thái độ không phải là tất cả? Sự ra đời của TPB', 
                h2_en: '1. Why Attitude Isn\'t Everything: The Birth of TPB',
                content_vi: `Trước khi TPB (Theory of Planned Behavior - Thuyết hành vi dự định) ra đời, các nhà nghiên cứu thường tin rằng: "Cứ thích (Thái độ tốt) là sẽ mua/làm". Nhưng thực tế khắc nghiệt hơn nhiều: Rất nhiều người thích xe Porsche (Thái độ cực kỳ tích cực), nhưng doanh số Porsche không hề tương đương với số người thích nó. Tại sao?

Icek Ajzen (1991) đã giải quyết bài toán này bằng cách nâng cấp TRA thành TPB, thêm vào hai chốt chặn quan trọng:
1. **Chuẩn chủ quan (Subjective Norm - SN):** Sức ép từ xã hội, gia đình, bạn bè. Bạn muốn xăm mình, nhưng sợ bố mẹ từ mặt -> Ý định bị dập tắt.
2. **Nhận thức kiểm soát hành vi (Perceived Behavioral Control - PBC):** Sự đánh giá về năng lực, nguồn lực, tiền bạc, thời gian của chính mình. Thích xe Porsche (Thái độ), bạn bè cổ vũ (SN), nhưng... không có tiền (PBC) -> Ý định bằng không.`,
                content_en: `Before TPB (Theory of Planned Behavior), researchers believed: "If you like it (Positive Attitude), you will do/buy it." But reality is harsh: Millions love Porsche cars (Positive Attitude), yet Porsche\'s sales don\'t reflect that number. Why?

Icek Ajzen (1991) solved this by upgrading TRA into TPB, adding two critical gatekeepers:
1. **Subjective Norm (SN):** Social pressure from family and peers. You want a tattoo, but fear parental rejection -> Intention dies.
2. **Perceived Behavioral Control (PBC):** The self-assessment of one\'s capabilities, resources, money, and time. You love Porsche (Attitude), friends cheer you on (SN), but... you\'re broke (PBC) -> Zero intention.`
            },
            {
                h2_vi: '2. Sơ đồ Mô hình Ajzen', h2_en: '2. Ajzen Model Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/tpb_model.png" alt="TPB Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Phân tích thực tế: Vì sao người tiêu dùng tẩy chay bao bì nhựa giả tạo?', 
                h2_en: '3. Practical Analysis: Why consumers fake their green habits?',
                content_vi: `**Đề tài:** "Nghiên cứu ý định mua sắm các sản phẩm bao bì thân thiện môi trường của nhân viên văn phòng".

**Phân tích dưới lăng kính TPB:**
Đây là nơi xảy ra hiện tượng **Attitude-Behavior Gap** (Khoảng trống Thái độ - Hành vi) kinh điển nhất. Khi làm khảo sát, 99% nhân viên văn phòng sẽ đánh giá cao việc bảo vệ môi trường (Thái độ cao ngất ngưởng). Tuy nhiên, biến số thực sự quyết định hành vi ở đây lại là **PBC (Nhận thức kiểm soát)**.

Nếu các cửa hàng tiện lợi không bán sản phẩm xanh (thiếu tính sẵn có) hoặc giá sản phẩm sinh học đắt gấp 3 lần (rào cản tài chính), thì PBC sẽ rất thấp, triệt tiêu mọi thái độ tốt đẹp.

*Mẹo nghiên cứu (Insight):* Khi chạy dữ liệu SPSS/SmartPLS cho các đề tài về tiêu dùng xanh, từ thiện, xã hội... hãy cẩn trọng với biến Thái độ. Thường biến này sẽ bị "thiên kiến mong muốn xã hội" (Social Desirability Bias) làm cho kết quả trung bình (Mean) cao ảo, nhưng hệ số hồi quy (tác động lên ý định) lại yếu hơn nhiều so với biến PBC.`,
                content_en: `**Research Title:** "Office workers\' intention to purchase eco-friendly packaged products".

**TPB Lens Analysis:**
This is the classic battleground of the **Attitude-Behavior Gap**. In surveys, 99% of workers praise environmental protection (sky-high Attitude). However, the real behavior-driver here is **PBC**.

If convenience stores don\'t stock green products (lack of availability) or bio-products cost 3x more (financial barrier), PBC crashes, nullifying all positive attitudes.

*Research Insight:* When running PLS-SEM/SPSS for green consumption or social causes, beware of the Attitude construct. It is heavily inflated by "Social Desirability Bias" (making the Mean artificially high), yet its actual regression weight (impact on intention) is often significantly weaker than PBC.`
            },
            {
                h2_vi: '4. Khung câu hỏi định lượng mẫu', 
                h2_en: '4. Sample Quantitative Framework',
                content_vi: `Thiết kế bảng hỏi theo thang đo Likert 5 điểm:

**Thái độ (ATT):**
- Mua [Sản phẩm X] là một quyết định sáng suốt và đúng đắn.
- Tôi cảm thấy vui vẻ, tích cực khi sử dụng [Sản phẩm X].

**Chuẩn chủ quan (SN):**
- Gia đình và bạn bè thân thiết khuyên tôi nên dùng [Sản phẩm X].
- Những người tôi tôn trọng có xu hướng ủng hộ tôi chọn [Sản phẩm X].

**Nhận thức kiểm soát hành vi (PBC):**
- Tôi hoàn toàn có đủ khả năng tài chính để mua [Sản phẩm X].
- Việc tìm kiếm và mua [Sản phẩm X] đối với tôi rất dễ dàng, thuận tiện.


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `Design using a 5-point Likert scale:

**Attitude (ATT):**
- Buying [Product X] is a wise and correct decision.
- I feel positive and happy when using [Product X].

**Subjective Norm (SN):**
- My family and close friends recommend using [Product X].
- People I respect tend to support my choice of [Product X].

**Perceived Behavioral Control (PBC):**
- I am entirely financially capable of affording [Product X].
- Finding and purchasing [Product X] is extremely easy and convenient for me.


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #TPB #ncsStat`
            }
        ]
    },
    'servqual-service-quality-model': {
        slug: 'servqual-service-quality-model', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình SERVQUAL: Case Study Chất lượng Bệnh viện',
        title_en: 'SERVQUAL: Hospital Quality Case Study',
        expert_tip_vi: 'Phân tích Gap 5 (giữa kỳ vọng và cảm nhận của khách hàng) là phần quan trọng nhất trong báo cáo SERVQUAL.',
        expert_tip_en: 'Analyzing Gap 5 is the most critical part of a SERVQUAL report.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Cốt lõi của SERVQUAL: Đo lường bằng 5 Khoảng cách (Gap)', 
                h2_en: '1. The Core of SERVQUAL: Measuring via 5 Gaps',
                content_vi: `Khi nói đến chất lượng dịch vụ, chúng ta không thể cân đo đong đếm nó như một bó rau hay một chiếc điện thoại. Parasuraman và các cộng sự (1988) đã làm một cuộc cách mạng khi định lượng hóa thứ vô hình này qua mô hình SERVQUAL. Nguyên lý cốt lõi rất đơn giản: Chất lượng dịch vụ = Mức độ cảm nhận thực tế (Perceptions) trừ đi Mức độ kỳ vọng ban đầu (Expectations).

Trong 5 khoảng cách (Gaps) của mô hình, **Gap 5** là yếu tố quan trọng nhất mà 90% sinh viên và nhà nghiên cứu sử dụng làm biến phụ thuộc. Nó đo lường sự chênh lệch giữa những gì khách hàng mong đợi trước khi sử dụng dịch vụ và những gì họ thực sự trải nghiệm sau đó. Nếu Trải nghiệm < Kỳ vọng, chất lượng dịch vụ bị đánh giá tồi, và ngược lại.`,
                content_en: `When it comes to service quality, we cannot measure it as easily as physical goods. Parasuraman et al. (1988) revolutionized the field by quantifying this intangible asset through the SERVQUAL model. The core principle is straightforward: Service Quality = Actual Perceptions minus Initial Expectations.

Among the 5 Gaps in the model, **Gap 5** is the most critical, used as the primary dependent variable by 90% of researchers. It measures the discrepancy between what customers expect before using a service and what they actually experience. If Experience < Expectation, service quality is rated poorly, and vice versa.`
            },
            {
                h2_vi: '2. Khung RATER: 5 Lăng kính đánh giá', 
                h2_en: '2. The RATER Framework: 5 Assessment Lenses',
                content_vi: `Làm sao để biết khách hàng đang kỳ vọng gì? SERVQUAL bóc tách dịch vụ qua 5 lăng kính (RATER):
- **Reliability (Tin cậy):** Khả năng thực hiện dịch vụ chính xác ngay từ lần đầu tiên. (Ví dụ: Chuyển khoản ngân hàng báo thành công thì tiền phải tới đúng tài khoản).
- **Assurance (Năng lực phục vụ/Đảm bảo):** Kiến thức, thái độ lịch sự của nhân viên khiến khách hàng cảm thấy an tâm. (Ví dụ: Bác sĩ giải thích bệnh án rành mạch).
- **Tangibles (Hữu hình):** Bề ngoài của cơ sở vật chất, trang thiết bị, đồng phục nhân viên.
- **Empathy (Đồng cảm):** Sự quan tâm chăm sóc mang tính cá nhân hóa. (Ví dụ: Nhớ tên khách quen, hỏi thăm sức khỏe).
- **Responsiveness (Đáp ứng):** Sự sẵn sàng và nhanh chóng giúp đỡ khách hàng khi có sự cố.`,
                content_en: `How do we know what customers expect? SERVQUAL breaks down services through 5 lenses (RATER):
- **Reliability:** The ability to perform the promised service dependably and accurately. (e.g., Bank transfers arrive exactly as stated).
- **Assurance:** The knowledge and courtesy of employees conveying trust and confidence. (e.g., A doctor explaining a diagnosis clearly).
- **Tangibles:** The appearance of physical facilities, equipment, and personnel.
- **Empathy:** Caring, individualized attention provided to customers.
- **Responsiveness:** The willingness to help customers and provide prompt service.`
            },
            {
                h2_vi: '3. Phân tích Case Study: Sai lầm phổ biến khi dùng SERVQUAL', 
                h2_en: '3. Case Study: Common Mistakes using SERVQUAL',
                content_vi: `**Đề tài:** "Đánh giá chất lượng dịch vụ khám chữa bệnh tại Bệnh viện X".

*Mẹo nghiên cứu thực chiến:* Rất nhiều người lấy nguyên xi bộ thang đo 22 câu hỏi chuẩn của SERVQUAL áp dụng vào mọi bối cảnh. Đây là một sai lầm chết người! Bối cảnh y tế khác hoàn toàn bối cảnh khách sạn.

Trong y tế, người bệnh không rành chuyên môn, nên họ rất khó đánh giá **Reliability (Tin cậy)** theo kiểu "Bác sĩ mổ có đúng kỹ thuật không?". Thay vào đó, họ sẽ đánh giá chất lượng y tế thông qua **Empathy (Đồng cảm)** (Bác sĩ có ân cần không?) và **Tangibles (Hữu hình)** (Phòng bệnh có sạch sẽ, máy móc có hiện đại không?). Do đó, khi chạy hồi quy, bạn sẽ thường thấy biến Hữu hình và Đồng cảm tác động cực mạnh lên Sự hài lòng, trong khi Tin cậy đôi khi bị loại bỏ khỏi mô hình (p-value > 0.05). Hãy linh hoạt điều chỉnh câu hỏi cho phù hợp bối cảnh!


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `**Title:** "Evaluating healthcare service quality at Hospital X".

*Practical Research Insight:* Many blindly apply the original 22-item SERVQUAL scale to every context. This is a fatal flaw! Healthcare is entirely different from hospitality.

In healthcare, patients lack medical expertise, making it hard to evaluate technical **Reliability** ("Did the surgeon use the right technique?"). Instead, they judge quality via **Empathy** ("Was the doctor caring?") and **Tangibles** ("Is the room clean? Are machines modern?"). Consequently, in regression analysis, Tangibles and Empathy often have a massive impact on Satisfaction, while Reliability might get rejected (p-value > 0.05). Always adapt items to your specific context!


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #SERVQUAL #ncsStat`
            }
        ]
    },
    'utaut-technology-adoption': {
        slug: 'utaut-technology-adoption', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết UTAUT: Case Study Chấp nhận E-Learning',
        title_en: 'UTAUT: E-Learning Adoption Case Study',
        expert_tip_vi: 'Đừng quên đưa các biến điều tiết như Age, Gender vào mô hình để tăng tính thuyết phục cho bài báo.',
        expert_tip_en: 'Include moderators like Age and Gender to enhance your paper\'s persuasiveness.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. UTAUT: Kẻ thách thức ngôi vương của TAM', 
                h2_en: '1. UTAUT: The Challenger to TAM\'s Throne',
                content_vi: `Nhiều thập kỷ qua, giới học giả đã quá mệt mỏi với sự đơn điệu của TAM. Venkatesh và các cộng sự (2003) quyết định gom tất cả 8 mô hình lớn nhất về công nghệ (bao gồm cả TAM, TPB, IDT...) lại với nhau để tạo ra "Siêu mô hình" mang tên UTAUT (Unified Theory of Acceptance and Use of Technology). 

Nghiên cứu gốc chứng minh UTAUT có khả năng giải thích tới 70% phương sai của ý định sử dụng công nghệ, đánh bại hoàn toàn mức 40% của TAM. Thay vì 2 biến đơn giản, UTAUT sử dụng 4 trụ cột:
- **Kỳ vọng hiệu quả (Performance Expectancy - PE):** Tương tự biến PU của TAM.
- **Kỳ vọng nỗ lực (Effort Expectancy - EE):** Tương tự biến PEOU của TAM.
- **Ảnh hưởng xã hội (Social Influence - SI):** Mọi người xung quanh có khuyên dùng không? (Tương tự TPB).
- **Điều kiện thuận lợi (Facilitating Conditions - FC):** Có sẵn máy móc, wifi, sự hỗ trợ kỹ thuật không?`,
                content_en: `For decades, scholars grew tired of TAM\'s simplicity. Venkatesh et al. (2003) decided to consolidate 8 major technology acceptance models (including TAM, TPB, IDT) into a "Super Model" named UTAUT.

The original study proved UTAUT explains up to 70% of the variance in usage intention, crushing TAM\'s 40%. Instead of 2 simple variables, UTAUT uses 4 pillars:
- **Performance Expectancy (PE):** Similar to TAM\'s PU.
- **Effort Expectancy (EE):** Similar to TAM\'s PEOU.
- **Social Influence (SI):** Do peers recommend it? (Similar to TPB).
- **Facilitating Conditions (FC):** Are hardware, internet, and tech support available?`
            },
            {
                h2_vi: '2. Sơ đồ Mô hình Siêu việt', h2_en: '2. The Unified Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/utaut_model.png" alt="UTAUT Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Phân tích thực tế: Học E-Learning thời COVID-19', 
                h2_en: '3. Practical Analysis: E-Learning during COVID-19',
                content_vi: `**Đề tài:** "Yếu tố ảnh hưởng đến việc chấp nhận E-learning của sinh viên".

*Insight thiết kế mô hình:* Khác biệt lớn nhất làm nên đẳng cấp của UTAUT chính là sự xuất hiện của các **Biến điều tiết (Moderators)**: Giới tính, Độ tuổi, Kinh nghiệm và Sự tự nguyện. 

Khi chạy E-learning, bạn sẽ thấy biến **Ảnh hưởng xã hội (SI)** (lời khuyên từ thầy cô, nhà trường bắt buộc) tác động mạnh hơn rất nhiều ở giai đoạn đầu áp dụng. Đồng thời, biến **Kỳ vọng nỗ lực (EE)** sẽ tác động mạnh ở phái nữ và người lớn tuổi hơn so với thanh niên. Nếu bạn bỏ qua các biến điều tiết này, bài báo UTAUT của bạn sẽ bị đánh giá là hời hợt.

Ngoài ra, lưu ý quan trọng: Biến **Điều kiện thuận lợi (FC)** không tác động đến Ý định (Intention), mà nó phóng thẳng mũi tên tác động trực tiếp lên Hành vi thực tế (Use Behavior). Đừng vẽ nhầm sơ đồ phần này!


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `**Title:** "Factors affecting students\' acceptance of e-learning".

*Model Design Insight:* The biggest differentiator elevating UTAUT is the inclusion of **Moderators**: Gender, Age, Experience, and Voluntariness of Use.

In e-learning, **Social Influence (SI)** (professor mandates) has a much stronger impact in the early adoption stages. Meanwhile, **Effort Expectancy (EE)** is typically more salient for older demographics and females compared to tech-savvy youths. Ignoring these moderators makes an UTAUT paper look superficial.

Also, a crucial note: **Facilitating Conditions (FC)** does NOT directly impact Intention; its arrow shoots straight into Actual Use Behavior. Do not draw this path incorrectly!


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #UTAUT #ncsStat`
            }
        ]
    },
    'porter-five-forces-analysis': {
        slug: 'porter-five-forces-analysis', category: 'Mô hình nghiên cứu',
        title_vi: '5 Áp lực Cạnh tranh của Porter: Case Study Ngành F&B',
        title_en: 'Porter\'s Five Forces: F&B Industry Case Study',
        expert_tip_vi: 'Áp lực từ sản phẩm thay thế thường bị các doanh nghiệp bỏ qua cho đến khi quá muộn.',
        expert_tip_en: 'Threat of substitutes is often ignored until it\'s too late.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Không chỉ là Lý thuyết, đó là Chiến lược Sinh tồn', 
                h2_en: '1. Not Just Theory, It\'s a Survival Strategy',
                content_vi: `Mô hình 5 Áp lực cạnh tranh (Five Forces) của Michael Porter (1979) không phải là một mô hình phân tích định lượng với các biến số và mũi tên nhân quả thông thường. Nó là một bộ khung phân tích vĩ mô (Macro-analysis framework) dành riêng cho quản trị chiến lược. Công dụng chính của nó là để xem xét liệu ngành nghề bạn đang muốn đâm đầu vào có thực sự "hái ra tiền" (Attractiveness) hay không, hay chỉ là một cái "bẫy chuột".

Porter cho rằng lợi nhuận của doanh nghiệp không chỉ bị bòn rút bởi Đối thủ trực tiếp, mà còn bị giằng xé bởi 4 thế lực khác: Quyền lực của người mua, Quyền lực của nhà cung cấp, Đe dọa từ người mới, và Đe dọa từ sản phẩm thay thế.`,
                content_en: `Michael Porter\'s Five Forces (1979) is not a standard quantitative model with typical causal arrows. It is a macro-analysis framework specifically tailored for strategic management. Its main purpose is to determine whether the industry you\'re entering is genuinely profitable (Attractive) or just a "rat trap."

Porter argues that corporate profits are not only eroded by Direct Competitors but are also squeezed by 4 other entities: Buyer Power, Supplier Power, Threat of New Entrants, and Threat of Substitutes.`
            },
            {
                h2_vi: '2. Sơ đồ 5 Thế lực', h2_en: '2. The 5 Forces Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/porter_5_forces.png" alt="Porter Forces" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/porter_5_forces.png" alt="Porter Forces" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Phân tích thực tế: Vì sao làm chuỗi Cà phê dễ "chết"?', 
                h2_en: '3. Practical Analysis: Why is running a coffee chain deadly?',
                content_vi: `**Bối cảnh:** Bạn định mở một chuỗi cà phê phong cách Gen Z để cạnh tranh.

*Góc nhìn của chuyên gia:* Hãy áp dụng Porter để thấy "máu chảy" trong ngành này.
- **Rào cản gia nhập (New Entrants):** Cực kỳ thấp. Ai có vài trăm triệu cũng có thể mở quán. Đe dọa cao!
- **Sản phẩm thay thế (Substitutes):** Trà sữa, Kombucha, nước tăng lực, thậm chí là các quán nhậu. Khách hàng có hàng vạn lựa chọn khác ngoài cà phê. Đe dọa cao!
- **Quyền lực Người mua (Buyers):** Khách hàng có quyền "quay xe" sang quán đối diện chỉ vì quán bạn bật nhạc không hợp gu. Chi phí chuyển đổi (Switching cost) bằng không. Đe dọa cao!

*Bài học:* Nếu phân tích Porter đúng, bạn sẽ thấy ngành F&B là một đại dương đỏ. Nếu viết bài nghiên cứu hoặc luận văn, thay vì dùng khảo sát Likert, bạn phải thu thập dữ liệu thứ cấp (báo cáo tài chính, thị phần) hoặc phỏng vấn chuyên sâu (Qualitative) để làm nổi bật 5 yếu tố này.


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `**Context:** You plan to open a Gen Z-style coffee chain.

*Expert Perspective:* Apply Porter to see the "bloodbath" in this industry.
- **New Entrants:** Extremely low barriers. Anyone with capital can open a shop. High threat!
- **Substitutes:** Milk tea, energy drinks, or even bars. Customers have thousands of alternatives. High threat!
- **Buyer Power:** Customers can switch to the shop across the street simply because they dislike your music playlist. The switching cost is zero. High threat!

*Lesson:* Proper Porter analysis reveals F&B as a hyper-competitive red ocean. When writing a thesis, instead of Likert surveys, you must gather secondary data (financials, market share) or conduct in-depth interviews (Qualitative) to highlight these 5 forces.


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #Porter #ncsStat`
            }
        ]
    },
    'vrio-framework-strategy': {
        slug: 'vrio-framework-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Khung VRIO: Case Study Lợi thế của Apple',
        title_en: 'VRIO Framework: Apple\'s Advantage Case Study',
        expert_tip_vi: 'Yếu tố "O" (Organization) là then chốt để khai thác tối đa các nguồn lực V-R-I.',
        expert_tip_en: 'The "O" (Organization) is key to fully exploiting V-R-I resources.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. VRIO: Tìm kiếm "Thanh gươm báu" của doanh nghiệp', 
                h2_en: '1. VRIO: Finding the Corporate "Excalibur"',
                content_vi: `Khác với Porter tập trung vào bên ngoài (Thị trường, Đối thủ), Khung phân tích VRIO của Jay Barney (1991) lại hướng mũi nhọn vào bên trong nội bộ doanh nghiệp. Nó thuộc trường phái Nguồn lực cơ sở (Resource-Based View - RBV). Cốt lõi của VRIO là trả lời câu hỏi: "Doanh nghiệp bạn có tài sản hay năng lực gì đặc biệt để đánh bại đối thủ không?".

Một nguồn lực chỉ trở thành Lợi thế cạnh tranh bền vững (Sustained Competitive Advantage) khi nó vượt qua trót lọt 4 cửa ải khắt khe:
- **Value (Có giá trị):** Nguồn lực đó có giúp tăng doanh thu hoặc giảm chi phí không?
- **Rarity (Hiếm):** Đối thủ có sở hữu nó không?
- **Inimitability (Khó bắt chước):** Đối thủ có dễ dàng sao chép nó không? (Bằng tiền hoặc công nghệ).
- **Organization (Tổ chức):** Công ty có đủ quy trình và nhân sự để khai thác tối đa nguồn lực đó không?`,
                content_en: `Unlike Porter, which focuses externally (Markets, Competitors), Jay Barney\'s VRIO framework (1991) turns the spotlight inward. It roots in the Resource-Based View (RBV). VRIO essentially asks: "Does your firm possess any unique assets or capabilities to crush rivals?"

A resource only yields a Sustained Competitive Advantage if it survives 4 rigorous filters:
- **Value:** Does it exploit opportunities to increase revenue or reduce costs?
- **Rarity:** Do competitors lack it?
- **Inimitability:** Is it difficult or costly for rivals to copy? (Due to historical conditions or causal ambiguity).
- **Organization:** Is the firm structured with policies and processes to fully exploit it?`
            },
            {
                h2_vi: '2. Ma trận VRIO Thực chiến', h2_en: '2. The VRIO Matrix', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/vrio_framework.png" alt="VRIO Framework" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Phân tích thực tế: Vì sao Apple luôn định giá trên trời?', 
                h2_en: '3. Practical Analysis: Why does Apple charge premium prices?',
                content_vi: `**Bối cảnh:** Đánh giá lợi thế cạnh tranh của Apple.

*Phân tích bóc tách:* Hãy thử áp dụng VRIO cho hệ sinh thái iOS của Apple.
- **Value:** Rất có giá trị, mượt mà, bảo mật cao (Pass).
- **Rarity:** Chỉ duy nhất Apple sở hữu, Samsung hay Xiaomi dùng chung Android (Pass).
- **Inimitability:** Google hay Microsoft có thể đổ tỷ đô để bắt chước, nhưng trải nghiệm người dùng tích lũy hàng chục năm của iOS là cực kỳ tốn kém và mạo hiểm để sao chép (Pass).
- **Organization:** Apple có hệ thống đồng bộ hóa hoàn hảo (iCloud, Mac, iPad) để trói chân người dùng, khiến họ không thể thoát ra (Pass).

*Insight luận văn:* Đừng bao giờ mang những thứ như "Thái độ phục vụ tốt" hay "Mặt bằng đẹp" để phân loại là lợi thế cạnh tranh bền vững trong VRIO. Thái độ phục vụ có thể sao chép được qua đào tạo (Không Inimitable). Mặt bằng đẹp có thể bị đối thủ mua đứt bằng tiền. Chỉ những thứ mang tính hệ thống, văn hóa, hoặc bằng sáng chế độc quyền mới vượt qua được cửa ải VRIO.


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `**Context:** Evaluating Apple\'s competitive advantage.

*Breakdown:* Let\'s apply VRIO to Apple\'s iOS ecosystem.
- **Value:** Highly valuable, smooth, secure (Pass).
- **Rarity:** Exclusive to Apple; Samsung/Xiaomi share Android (Pass).
- **Inimitability:** Google could spend billions, but copying decades of refined UI/UX and causal ambiguity is extremely risky and costly (Pass).
- **Organization:** Apple flawlessly synchronizes its products (iCloud, Mac, iPad) locking users in (Pass).

*Thesis Insight:* Never label "good customer service" or "prime location" as a sustained advantage in VRIO. Service can be copied via training (Fails Inimitable). Prime locations can be bought with capital. Only systemic capabilities, deep-rooted culture, or exclusive patents truly survive the VRIO gauntlet.


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #VRIO #ncsStat`
            }
        ]
    },
    'expectation-confirmation-theory-ect': {
        slug: 'expectation-confirmation-theory-ect', category: 'Mô hình nghiên cứu',
        title_vi: 'Thuyết ECT: Case Study Mua sắm Thương mại điện tử',
        title_en: 'ECT: E-commerce Shopping Case Study',
        expert_tip_vi: 'Xác nhận (Confirmation) là biến trung gian quan trọng nhất trong mô hình này.',
        expert_tip_en: 'Confirmation is the most important mediator in this model.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Tâm lý học đằng sau sự thất vọng: ECT', 
                h2_en: '1. The Psychology behind Disappointment: ECT',
                content_vi: `Thuyết Kỳ vọng Xác nhận (Expectation-Confirmation Theory - ECT) của Oliver (1980) là kim chỉ nam cho các nghiên cứu về Hậu mua hàng (Post-purchase behavior). Trong khi TAM hay TPB tập trung vào việc "Làm sao để khách hàng mua lần đầu?", ECT lại giải quyết bài toán khó hơn: "Làm sao để họ quay lại mua lần hai?".

ECT dựa trên tâm lý so sánh rất con người: Trước khi mua, chúng ta tạo ra một sự Kỳ vọng (Expectation). Sau khi dùng, chúng ta có một Trải nghiệm thực tế (Performance). Nếu Trải nghiệm vượt quá Kỳ vọng, ta gọi đó là Xác nhận tích cực (Positive Confirmation) -> Hài lòng -> Mua tiếp. Ngược lại, nếu Trải nghiệm lèo tèo nhưng quảng cáo thì tung hô lên tận mây xanh, đó là Xác nhận tiêu cực (Negative Confirmation) -> Thất vọng -> Chửi bới trên mạng.`,
                content_en: `Oliver\'s Expectation-Confirmation Theory (ECT, 1980) is the holy grail for Post-purchase behavior research. While TAM or TPB focus on "How to get them to buy the first time?", ECT tackles the harder question: "How to get them to return?".

ECT is built on human comparative psychology: Before purchasing, we form an Expectation. After usage, we gain a Perceived Performance. If Performance exceeds Expectation, we achieve Positive Confirmation -> Satisfaction -> Repurchase. Conversely, if the experience is poor but heavily hyped, it results in Negative Confirmation -> Dissatisfaction -> Online ranting.`
            },
            {
                h2_vi: '2. Sơ đồ Chuỗi Phản ứng Tâm lý', h2_en: '2. Psychological Reaction Chain Diagram', is_html: true,
                content_vi: '<div class="my-12"><img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[2rem] shadow-xl w-full" /></div>',
                content_en: '<div class="my-12"><img src="/images/knowledge/ect_model.png" alt="ECT Model" class="rounded-[2rem] shadow-xl w-full" /></div>'
            },
            {
                h2_vi: '3. Phân tích thực tế: Vì sao TikTok Shop gây nghiện?', 
                h2_en: '3. Practical Analysis: Why is TikTok Shop addictive?',
                content_vi: `**Bối cảnh:** Mua sắm qua livestream trên TikTok Shop.

*Góc nhìn chuyên gia:* Điểm mù mà nhiều sinh viên mắc phải khi chạy mô hình ECT là bỏ qua mối quan hệ trực tiếp từ **Kỳ vọng** lên **Sự hài lòng**. Tâm lý học chứng minh rằng, những người ban đầu có kỳ vọng càng cao, thì tiêu chuẩn để làm họ hài lòng càng khắt khe.

Khi KOL trên livestream hứa hẹn "kem dưỡng trắng da thần tốc", khách hàng có Kỳ vọng rất cao. Nhưng khi nhận hàng, sản phẩm chỉ ở mức bình thường (Trải nghiệm thấp). Khối chênh lệch này tạo ra Sự bất mãn (Disconfirmation). Để chạy dữ liệu tốt phần này, thang đo của bạn phải khai thác được cảm giác "bị lừa dối" hoặc "vượt ngoài mong đợi" của đáp viên, chứ không chỉ hỏi chung chung là "bạn có thích không".


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `**Context:** Livestream shopping on TikTok Shop.

*Expert Perspective:* A common blind spot for students using ECT is ignoring the direct path from **Expectation** to **Satisfaction**. Psychology proves that people with initially higher expectations have significantly stricter standards to be satisfied.

When a KOL hypes a "miracle whitening cream," Expectation skyrockets. If the actual product is just average (low Performance), this massive gap causes severe Disconfirmation. To run robust data here, your questionnaire must capture the feeling of being "deceived" or "pleasantly surprised," not just generic "do you like it" questions.


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #ECT #ncsStat`
            }
        ]
    },
    'sor-model-marketing-behavior': {
        slug: 'sor-model-marketing-behavior', category: 'Mô hình nghiên cứu',
        title_vi: 'Mô hình S-O-R: Case Study Livestream bán hàng',
        title_en: 'S-O-R Model: Live-stream Selling Case Study',
        expert_tip_vi: 'Biến Organism thường bao gồm cả hai khía cạnh: Cảm xúc (Affect) và Nhận thức (Cognition).',
        expert_tip_en: 'Organism typically includes both Affect and Cognition.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
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
                content_vi: '**Phân tích:**\n- **S:** KOL lôi cuốn, voucher gấp.\n- **O:** Cảm thấy hưng phấn (FOMO).\n- **R:** Nhấn mua ngay (Impulse buying).\n\n\n*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*\n#Mô hình nghiên cứu #SOR #ncsStat',
                content_en: '**Analysis:**\n- **S:** Engaging KOL, urgent vouchers.\n- **O:** Excitement (FOMO).\n- **R:** Impulse buying.\n\n\n*Researched and compiled by **Le Phuc Hai**.*\n#ResearchModel #SOR #ncsStat'
            }
        ]
    },
    'perceived-value-marketing-strategy': {
        slug: 'perceived-value-marketing-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Giá trị Cảm nhận: Case Study Xe hơi hạng sang',
        title_en: 'Perceived Value: Luxury Car Case Study',
        expert_tip_vi: 'Hãy sử dụng thang đo đa chiều (Functional, Social, Emotional) để bài báo có chiều sâu hơn.',
        expert_tip_en: 'Use multi-dimensional scales (Functional, Social, Emotional) for more depth.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
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
                content_vi: '**Phân tích giá trị:**\n- **Chức năng:** Động cơ mạnh, nội thất sang.\n- **Cảm xúc:** Niềm tự hào.\n- **Xã hội:** Khẳng định đẳng cấp.\n\n\n*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*\n#Mô hình nghiên cứu #GiáTrịCảmNhận #ncsStat',
                content_en: '**Analysis:**\n- **Functional:** Strong engine, luxury interior.\n- **Emotional:** Pride.\n- **Social:** Status affirmation.\n\n\n*Researched and compiled by **Le Phuc Hai**.*\n#ResearchModel #PerceivedValue #ncsStat'
            }
        ]
    },
    'tce-transaction-cost-economics-strategy': {
        slug: 'tce-transaction-cost-economics-strategy', category: 'Mô hình nghiên cứu',
        title_vi: 'Kinh tế học Chi phí Giao dịch (TCE): Case Study Grab',
        title_en: 'Transaction Cost Economics (TCE): Grab Case Study',
        expert_tip_vi: 'TCE đặc biệt hữu ích cho các bài nghiên cứu về Sáp nhập (M&A) hoặc Chuỗi cung ứng toàn cầu.',
        expert_tip_en: 'TCE is useful for M&A or Global Supply Chain research.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
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
                content_vi: '**Phân tích:** Việc sát nhập giúp giảm chi phí giao dịch từ cạnh tranh, tối ưu hóa mạng lưới tài xế hiện có (Asset Specificity).\n\n\n*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*\n#Mô hình nghiên cứu #TCE #ncsStat',
                content_en: '**Analysis:** Merger minimized transaction costs, optimized driver networks (Asset Specificity).\n\n\n*Researched and compiled by **Le Phuc Hai**.*\n#ResearchModel #TCE #ncsStat'
            }
        ]
    }
,
    'customer-satisfaction-index-csi': {
        slug: 'customer-satisfaction-index-csi', category: 'Mô hình nghiên cứu',
        title_vi: 'Chỉ số Hài lòng Khách hàng (CSI/ACSI): Đừng nhầm lẫn với SERVQUAL',
        title_en: 'Customer Satisfaction Index (CSI): Beyond Basic Service Quality',
        expert_tip_vi: 'Rất nhiều người gộp chung Chất lượng (Quality) và Giá trị (Value) làm một. Trong CSI, hai biến này rạch ròi: Đồ xịn chưa chắc đã đáng tiền!',
        expert_tip_en: 'Many confuse Quality and Value. In CSI, they are distinct: High quality does not guarantee high value for money!',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. ACSI/CSI là gì? Tại sao phải sinh ra thêm một mô hình nữa?', 
                h2_en: '1. What is ACSI/CSI? Why do we need another model?',
                content_vi: `Chắc hẳn bạn đang thắc mắc: Đã có SERVQUAL đo lường dịch vụ rồi, sao lại đẻ thêm cái Chỉ số hài lòng khách hàng (CSI - Customer Satisfaction Index) làm gì cho rắc rối?

Sự thật là SERVQUAL (của Parasuraman) tập trung hoàn toàn vào *Chất lượng dịch vụ* (dựa trên 5 khoảng cách GAP). Nhưng Claes Fornell (người tạo ra mô hình ACSI của Mỹ năm 1996) đã chỉ ra một sự thật phũ phàng: Khách hàng thấy dịch vụ tốt chưa chắc họ đã hài lòng. Tại sao? Vì còn dính đến **Giá tiền**.

CSI ra đời để giải quyết lỗ hổng đó. Mô hình ACSI kinh điển khẳng định Sự hài lòng (Satisfaction) là sự giao thoa của 3 yếu tố: Kỳ vọng trước khi mua (Expectations), Chất lượng cảm nhận được (Perceived Quality), và quan trọng nhất: Giá trị cảm nhận (Perceived Value - Tức là tỷ lệ giữa Chất lượng và Giá cả).`,
                content_en: `You might wonder: We already have SERVQUAL for service quality, why complicate things with the Customer Satisfaction Index (CSI)?

The truth is, SERVQUAL (by Parasuraman) focuses entirely on *Service Quality*. But Claes Fornell (who developed the American ACSI model in 1996) pointed out a harsh reality: Customers acknowledging good service doesn\'t guarantee satisfaction. Why? Because of **Price**.

CSI was born to plug this gap. The classic ACSI model asserts that Satisfaction is driven by 3 factors: Pre-purchase Expectations, Perceived Quality, and most importantly: Perceived Value (the Quality-to-Price ratio).`
            },
            {
                h2_vi: '2. Cấu trúc Mô hình ACSI Kinh điển', h2_en: '2. Classic ACSI Model Structure', is_html: true,
                content_vi: '<div class="my-12 flex justify-center"><div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center"><p class="text-indigo-800 font-medium">Kỳ vọng + Chất lượng + Giá trị -> Hài lòng -> (Khiếu nại) -> Lòng trung thành</p><p class="text-sm text-indigo-600 mt-2">Sơ đồ luồng nhân quả của ACSI</p></div></div>',
                content_en: '<div class="my-12 flex justify-center"><div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center"><p class="text-indigo-800 font-medium">Expectations + Quality + Value -> Satisfaction -> (Complaints) -> Loyalty</p><p class="text-sm text-indigo-600 mt-2">ACSI Causal Flow Diagram</p></div></div>'
            },
            {
                h2_vi: '3. "Đặc sản" của CSI: Biến Khiếu nại (Customer Complaints)', 
                h2_en: '3. The CSI Signature: The Complaints Variable',
                content_vi: `*Điểm ăn tiền (Insight) khi làm luận văn:* Một nét độc đáo cực kỳ thông minh của ACSI là nó đưa biến **Khiếu nại (Complaints)** vào làm hệ quả của Sự hài lòng, và là tiền đề của Lòng trung thành (Loyalty).

Nghe có vẻ vô lý, đúng không? Phàn nàn thì sao mà trung thành được?

Nhưng thực tế dữ liệu chứng minh: Mối quan hệ từ Khiếu nại đến Lòng trung thành có thể là *thuận chiều*. Nếu khách hàng không hài lòng, họ phàn nàn. NẾU doanh nghiệp xử lý khiếu nại đó quá tuyệt vời (đền bù xứng đáng, xin lỗi chân thành), mức độ trung thành của họ sau đó còn cao hơn cả những khách hàng chưa từng gặp sự cố (Đây gọi là Hiệu ứng Phục hồi dịch vụ - Service Recovery Paradox).

Khi chạy SmartPLS cho mô hình CSI, nếu bạn bóc tách được điều này, hội đồng bảo vệ sẽ đánh giá bài của bạn ở một đẳng cấp hoàn toàn khác so với những bài mô hình hài lòng rập khuôn thông thường.`,
                content_en: `*Thesis Insight:* A brilliant and unique feature of ACSI is positioning **Customer Complaints** as a consequence of Satisfaction and an antecedent to Loyalty.

Sounds illogical, right? How can complaining lead to loyalty?

Data proves otherwise: The path from Complaints to Loyalty can actually be *positive*. If dissatisfied customers complain, and the company resolves it spectacularly (generous compensation, sincere apology), their subsequent loyalty often surpasses that of customers who never had issues (This is the Service Recovery Paradox).

When running PLS-SEM on a CSI model, if you can empirically prove this paradox, your defense panel will rank your research on an entirely different echelon compared to cookie-cutter satisfaction models.`
            },
            {
                h2_vi: '4. Khung câu hỏi định lượng mẫu', 
                h2_en: '4. Sample Quantitative Framework',
                content_vi: `Thay vì hỏi "Bạn có hài lòng không" một cách nhạt nhẽo, CSI đo lường 3 biến số cho Satisfaction:

**Sự Hài lòng (Satisfaction):**
1. Đánh giá mức độ hài lòng tổng thể của anh/chị về [Sản phẩm]. (1: Rất thất vọng, 5: Rất hài lòng).
2. So với những kỳ vọng trước khi mua, [Sản phẩm] đạt được mức độ nào? (1: Rất kém so với kỳ vọng, 5: Vượt xa kỳ vọng).
3. Hãy tưởng tượng về một sản phẩm hoàn hảo lý tưởng, [Sản phẩm] này tiến gần đến mức nào? (1: Còn rất xa, 5: Cực kỳ gần).


*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*`,
                content_en: `Instead of blandly asking "Are you satisfied", CSI employs 3 nuanced indicators:

**Satisfaction (ACSI):**
1. Overall, how satisfied are you with [Product]? (1: Very dissatisfied, 5: Very satisfied).
2. To what extent has [Product] met your expectations? (1: Falls short, 5: Exceeds expectations).
3. Imagine an ideal product in this category. How close is [Product] to this ideal? (1: Very far, 5: Very close).


*Researched and compiled by **Le Phuc Hai**.*
#ResearchModel #CSI #ncsStat`
            }
        ]
    },
    'acsi-vs-ecsi': {
        slug: 'acsi-vs-ecsi', category: 'Mô hình nghiên cứu',
        title_vi: 'ACSI vs ECSI: Cuộc chiến đo lường sự hài lòng Âu - Mỹ',
        title_en: 'ACSI vs ECSI: The US-Europe Satisfaction War',
        expert_tip_vi: 'Nếu sản phẩm của bạn chưa ra mắt nhưng khách hàng đã "phát cuồng" (như Apple), hãy dùng ngay ECSI để đưa biến Hình ảnh thương hiệu vào mô hình.',
        expert_tip_en: 'If your product is highly anticipated before release, use ECSI to capture Corporate Image in your model.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Nguồn gốc cuộc chiến: Mỹ trọng thực tế, Âu trọng danh tiếng',
                h2_en: '1. The Origin: US Pragmatism vs European Prestige',
                content_vi: `Khi Claes Fornell ra mắt ACSI (Mỹ) năm 1996, ông cho rằng sự hài lòng được định đoạt bởi 3 yếu tố: Kỳ vọng (Expectation), Chất lượng (Quality) và Giá trị (Value). Tuy nhiên, các chuyên gia Châu Âu (tạo ra ECSI năm 1999) đã phản pháo: "Khoan đã, nếu tôi mua một chiếc Ferrari, dù tôi chưa ngồi lên xe lần nào, tôi đã thấy thỏa mãn rồi. Hình ảnh thương hiệu ở đâu?".

Đó là lý do ECSI ra đời, mang theo một biến số cực kỳ quyền lực: **Hình ảnh thương hiệu (Corporate Image)**. Nó khẳng định rằng, trong kỷ nguyên tiếp thị, người ta đôi khi mua danh tiếng trước khi mua sản phẩm.`,
                content_en: `When Fornell launched ACSI in 1996, he argued satisfaction comes from Expectations, Quality, and Value. European experts (who created ECSI in 1999) countered: "Wait, if I buy a Ferrari, I\'m satisfied before I even drive it. Where is Corporate Image?".

This birthed ECSI, introducing a powerful new construct: **Corporate Image**. It asserts that in the modern marketing era, people often buy reputation before they buy the actual product.`
            },
            {
                h2_vi: '2. "Vũ khí bí mật" của ECSI khi chạy dữ liệu',
                h2_en: '2. ECSI\'s "Secret Weapon" in Data Analysis',
                content_vi: `*Insight làm luận văn:* Khi bạn phân tích sự hài lòng của các ngành dịch vụ nhạy cảm như Ngân hàng, Bệnh viện, hay Giáo dục đại học, biến Chất lượng (Quality) đôi khi rất khó đánh giá (vì khách hàng không có chuyên môn). Thay vào đó, nếu bạn dùng ECSI, biến **Corporate Image** sẽ gánh toàn bộ mô hình.

Một ngân hàng có dính "phốt" thao túng trái phiếu (Corporate Image sụp đổ) thì dù giao dịch viên có cười tươi đến mấy (Quality cao), khách hàng vẫn sẽ bỏ đi. Do đó, chạy mô hình ECSI cho các thương hiệu lớn thường cho ra chỉ số R-square (độ giải thích) cao hơn hẳn ACSI truyền thống.`,
                content_en: `*Thesis Insight:* When analyzing trust-sensitive sectors like Banking or Healthcare, Quality is hard for laymen to evaluate. If you use ECSI, the **Corporate Image** variable will carry your entire model.

If a bank is caught in a bond scandal (Image crashes), no amount of smiling tellers (High Quality) will keep customers from fleeing. Thus, running ECSI for established brands often yields significantly higher R-square values than traditional ACSI.`
            }
        ]
    },
    'kano-model': {
        slug: 'kano-model', category: 'Quản trị Dịch vụ',
        title_vi: 'Mô hình KANO: Khi "Hài lòng" không có nghĩa là "Sung sướng"',
        title_en: 'Kano Model: When "Satisfaction" doesn\'t mean "Delight"',
        expert_tip_vi: 'Wifi ở quán cà phê là yếu tố "Must-be" (Bắt buộc). Có wifi mạnh khách không khen, nhưng mất wifi khách sẽ chửi. Đừng lấy nó làm điểm nhấn cạnh tranh!',
        expert_tip_en: 'Café WiFi is a "Must-be" factor. Strong WiFi won\'t earn praise, but no WiFi brings fury. Never use it as a competitive differentiator!',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Góc nhìn 3 chiều đập tan tư duy truyền thống',
                h2_en: '1. The 3D perspective shattering traditional thinking',
                content_vi: `CSI hay SERVQUAL đều có một tư duy tuyến tính: Làm càng tốt, khách càng vui. Nhưng Giáo sư Noriaki Kano (1984) đã chứng minh điều đó là sai lầm chết người trong thiết kế dịch vụ. Ông chia các thuộc tính sản phẩm thành 3 loại chính:

- **Must-be (Cơ bản/Bắt buộc):** Có thì khách không thèm khen (vì họ coi đó là hiển nhiên), nhưng KHÔNG CÓ thì khách sẽ giận dữ. (Ví dụ: Xe ô tô phải có vô lăng).
- **One-dimensional (Tuyến tính/Hiệu suất):** Càng nhiều càng tốt. (Ví dụ: Xe càng tiết kiệm xăng khách càng thích).
- **Attractive (Hấp dẫn/Sung sướng - Delight):** Khách không hề kỳ vọng có nó, nhưng nếu bạn làm được, khách sẽ vỡ òa sung sướng. (Ví dụ: Khách sạn bí mật tặng bánh kem đúng ngày sinh nhật khách).`,
                content_en: `CSI and SERVQUAL assume a linear relationship: Better execution equals higher satisfaction. Professor Noriaki Kano (1984) proved this is a fatal flaw. He categorized attributes into 3 types:

- **Must-be (Basic):** Fulfillment brings no praise (it\'s taken for granted), but absence causes fury. (e.g., A car must have a steering wheel).
- **One-dimensional (Performance):** The more, the better. (e.g., Better fuel economy = happier customer).
- **Attractive (Delighter):** Customers don\'t expect it, but providing it causes absolute delight. (e.g., A hotel surprising a guest with a birthday cake).`
            },
            {
                h2_vi: '2. Ứng dụng KANO để tạo Hàm ý quản trị (Managerial Implications)',
                h2_en: '2. Applying KANO for Managerial Implications',
                content_vi: `*Bí quyết ăn điểm:* Nếu luận văn của bạn kết luận: "Doanh nghiệp cần cải thiện wifi, nâng cao thái độ nhân viên, làm sạch toilet...", hội đồng sẽ ngáp ngủ vì nó quá sáo rỗng.

Hãy dùng lăng kính KANO để tư vấn chiến lược: "Doanh nghiệp KHÔNG CẦN đổ thêm tiền vào nâng cấp Wifi (vì nó là yếu tố Must-be, đầu tư thêm khách cũng không hài lòng hơn). Thay vào đó, hãy lấy số tiền đó đầu tư vào yếu tố Attractive (tặng thẻ tích điểm hoặc quà nhỏ cho bé đi kèm) để tạo ra sự Sung sướng (Delight), từ đó kích hoạt truyền miệng (Word of Mouth)". Đây mới thực sự là tầm nhìn của một chuyên gia!`,
                content_en: `*Scoring big in theses:* If you conclude: "The firm must improve WiFi, train staff, clean toilets...", reviewers will fall asleep.

Use Kano to consult strategically: "Do NOT pour more money into upgrading WiFi (it\'s a Must-be; infinite investment won\'t increase satisfaction). Instead, redirect that budget to an Attractive element (giving small gifts to accompanying children) to create Delight and trigger Word of Mouth". Now that is expert-level vision!`
            }
        ]
    },
    'acsi-vs-nps': {
        slug: 'acsi-vs-nps', category: 'Phân tích Dữ liệu',
        title_vi: 'ACSI vs NPS: Sự đối đầu giữa Hàn lâm và Thực chiến',
        title_en: 'ACSI vs NPS: Academia vs Pragmatism',
        expert_tip_vi: 'Hàn lâm thích ACSI vì có thể chạy hàng chục biến phức tạp để xuất bản báo bài. Doanh nghiệp thích NPS vì nó ra quyết định chỉ trong 1 nốt nhạc.',
        expert_tip_en: 'Academia loves ACSI for complex modeling to publish papers. Corporations love NPS for lightning-fast decision making.',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Tại sao các tập đoàn lớn ghét làm bảng hỏi 30 câu?',
                h2_en: '1. Why corporations hate 30-question surveys',
                content_vi: `Sinh viên khi làm luận văn thường mang nguyên mô hình CSI với 30 câu hỏi Likert đi khảo sát. Kết quả là gì? Đáp viên mệt mỏi, đánh bừa toàn 4 và 5. 

Fred Reichheld (2003) đã làm chấn động giới nghiên cứu thị trường khi giới thiệu Chỉ số Khách hàng Thiện cảm (Net Promoter Score - NPS). Ông vứt bỏ toàn bộ mô hình phức tạp và chỉ giữ lại đúng 1 câu hỏi duy nhất: *"Trên thang điểm 10, khả năng bạn giới thiệu sản phẩm này cho bạn bè/đồng nghiệp là bao nhiêu?"*`,
                content_en: `Students often deploy full CSI models with 30 Likert questions. The result? Survey fatigue and random answers of 4s and 5s.

Fred Reichheld (2003) shocked market research by introducing the Net Promoter Score (NPS). He discarded complex models in favor of one single question: *"On a scale of 0 to 10, how likely are you to recommend our product to a friend or colleague?"*`
            },
            {
                h2_vi: '2. Phân loại khách hàng: Sự tàn khốc của NPS',
                h2_en: '2. Customer Segmentation: The Brutality of NPS',
                content_vi: `Khác với điểm trung bình (Mean) êm đềm của CSI, NPS cực kỳ khắc nghiệt:
- **Điểm 9-10 (Promoters):** Những kẻ cuồng nhiệt, sẵn sàng marketing miễn phí cho bạn.
- **Điểm 7-8 (Passives):** Kẻ bàng quan. Họ hài lòng nhưng sẽ bỏ bạn theo đối thủ nếu bên kia giảm giá 10%. (NPS không thèm tính điểm những người này).
- **Điểm 0-6 (Detractors):** Kẻ hủy diệt. Họ sẽ lên mạng viết bài bóc phốt bạn.

*Công thức:* NPS = % Promoters - % Detractors.

*Insight:* Nếu bạn muốn công bố quốc tế (ISI/Scopus), bắt buộc phải dùng các mô hình SEM như ACSI. Nhưng nếu bạn làm báo cáo tư vấn thực tế cho doanh nghiệp (Consulting project), hãy đưa NPS vào. Ban giám đốc sẽ đánh giá bạn rất cao vì bạn hiểu "ngôn ngữ của dòng tiền".`,
                content_en: `Unlike the smooth Mean scores of CSI, NPS is notoriously strict:
- **Score 9-10 (Promoters):** Loyal enthusiasts who provide free marketing.
- **Score 7-8 (Passives):** Satisfied but unenthusiastic. They will jump ship for a 10% discount. (NPS ignores them).
- **Score 0-6 (Detractors):** Destroyers. They will write scathing online reviews.

*Formula:* NPS = % Promoters - % Detractors.

*Insight:* For academic publications (ISI/Scopus), structural models like ACSI are mandatory. But for corporate consulting projects, use NPS. The board of directors will highly value you for speaking the "language of cash flow".`
            }
        ]
    },
    'service-recovery-paradox': {
        slug: 'service-recovery-paradox', category: 'Tâm lý học Hành vi',
        title_vi: 'Nghịch lý Phục hồi Dịch vụ: Biến Khủng hoảng thành Lòng trung thành',
        title_en: 'Service Recovery Paradox: Turning Crises into Loyalty',
        expert_tip_vi: 'Đừng sợ khách hàng chửi. Khách hàng im lặng bỏ đi mới là án tử. Một lời xin lỗi xuất sắc có thể biến kẻ thù thành đại sứ thương hiệu!',
        expert_tip_en: 'Never fear a complaining customer. The silent depart is the real death sentence. A brilliant apology can turn an enemy into an ambassador!',
        author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Nghịch lý vô lý nhất trong kinh doanh',
                h2_en: '1. The most illogical paradox in business',
                content_vi: `Hãy tưởng tượng 2 khách hàng: Khách hàng A mua ly trà sữa, uống xong ra về (trải nghiệm bình thường). Khách hàng B mua ly trà sữa, phát hiện có con ruồi, nổi điên làm ầm ĩ. Quản lý lập tức ra xin lỗi, đổi ly mới bồi thường thêm 2 voucher miễn phí và tặng thẻ VIP.

Theo logic thông thường, khách A sẽ trung thành hơn. Nhưng Nghịch lý Phục hồi Dịch vụ (Service Recovery Paradox - McCollough & Bharadwaj, 1992) chứng minh bằng dữ liệu rằng: Sự trung thành của khách B sau sự cố Đột biến cao hơn khách A rất nhiều. Tại sao? Vì bộ não con người ghi nhớ cảm xúc sâu sắc nhất khi họ trải qua một "vực thẳm" (sự cố) và được kéo lên một "đỉnh cao" (sự đền bù vượt mong đợi).`,
                content_en: `Imagine 2 customers: A buys milk tea and leaves (normal experience). B buys milk tea, finds a fly, and explodes in anger. The manager immediately apologizes, replaces the drink, gives 2 free vouchers, and a VIP card.

Logic dictates A would be more loyal. But the Service Recovery Paradox (McCollough & Bharadwaj, 1992) proves empirically that B\'s loyalty spikes significantly higher than A\'s. Why? The human brain remembers emotions most vividly when plunging into an "abyss" (failure) and being pulled to a "peak" (beyond-expectation recovery).`
            },
            {
                h2_vi: '2. Khai thác mỏ vàng này trong luận văn',
                h2_en: '2. Mining this gold in your thesis',
                content_vi: `Rất hiếm sinh viên dám làm đề tài về "Phục hồi dịch vụ", phần lớn chỉ làm về "Chất lượng dịch vụ". Nếu bạn chọn đề tài này, bạn đã nằm ở top 5% xuất sắc nhất.

*Cấu trúc mô hình gợi ý:*
- Biến độc lập: Mức độ nghiêm trọng của sự cố (Severity), Tốc độ xử lý (Speed), Sự công bằng trong đền bù (Distributive Justice), Thái độ xin lỗi (Interactional Justice).
- Biến phụ thuộc: Lòng trung thành hậu sự cố (Post-recovery Loyalty), Truyền miệng tích cực (Positive WOM).

Bằng cách chứng minh các biến "Công bằng" (Justice) tác động mạnh hơn so với "Tiền đền bù", bạn sẽ chỉ ra cho doanh nghiệp thấy: Khách hàng đôi khi không cần tiền, họ cần một sự tôn trọng thực sự từ cái cúi đầu của người quản lý.`,
                content_en: `Very few students dare to research "Service Recovery", most default to "Service Quality". Choosing this puts you in the top 5%.

*Suggested Model Structure:*
- IVs: Failure Severity, Recovery Speed, Distributive Justice (compensation), Interactional Justice (apology attitude).
- DVs: Post-recovery Loyalty, Positive WOM.

By proving that "Justice" variables have a stronger impact than sheer "Compensation Amount", you show businesses a profound truth: Customers often don\'t want your money; they want genuine respect through a manager\'s sincere bow.`
            }
        ]
    },
};

export const DEFAULT_ARTICLE = {
    slug: 'unknown', category: 'Academy Content', title_vi: 'Đang tải nội dung...', title_en: 'Loading Content...',
    expert_tip_vi: 'Đang tải...', expert_tip_en: 'Loading...', author: 'Le Phuc Hai', updated_at: new Date().toISOString(),
    content_structure: [{ h2_vi: 'Đang tải...', h2_en: 'Loading...', content_vi: 'Nội dung đang được hệ thống nạp từ thư viện tri thức...', content_en: 'Please wait while content is loading...' }]
};
