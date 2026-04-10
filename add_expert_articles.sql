-- =========================================================================
-- NCSKIT 2026 - LONG-FORM EXPERT ARTICLES (FIXED JSON SYNTAX)
-- Use Dollar-Quoting ($$ ... $$) for safe SQL insertion
-- =========================================================================

INSERT INTO "public"."knowledge_articles" ("id", "slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") VALUES 
(
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 
    'technology-acceptance-model-tam', 
    'Research Models', 
    'Mô hình Chấp nhận Công nghệ (TAM): Hướng dẫn Chuyên sâu từ A-Z', 
    'Technology Acceptance Model (TAM): The Ultimate Guide', 
    'Đừng chỉ dừng lại ở mô hình gốc năm 1989. Để đạt chuẩn Scopus/ISI, bạn nên tích hợp TAM với các yếu tố như Trust (Niềm tin), Perceived Risk (Rủi ro cảm nhận) hoặc Mobility (Tính di động).', 
    'Move beyond the 1989 original. For Scopus/ISI standards, integrate TAM with Trust, Perceived Risk, or context-specific factors like Mobility.', 
    $$[
        {"h2_vi":"1. Nguồn gốc và Tầm quan trọng của TAM","h2_en":"1. Origins and Importance of TAM","content_vi":"Mô hình Chấp nhận Công nghệ (TAM) được Fred Davis đề xuất vào năm 1989, dựa trên Thuyết Hành động Hợp lý (TRA). Trải qua hơn 30 năm, TAM vẫn là 'ngôn ngữ chung' của các nhà nghiên cứu trong lĩnh vực Hệ thống thông tin (MIS) và Quản trị kinh doanh khi muốn tìm hiểu tại sao một công nghệ mới lại được đón nhận hoặc bị từ chối.","content_en":"The Technology Acceptance Model (TAM) was proposed by Fred Davis in 1989. Over 30 years later, it remains the 'common language' for seekers in MIS and Business Management wanting to understand tech adoption."},
        {"h2_vi":"2. Hai thành phần cốt lõi: PU và PEOU","h2_en":"2. The Two Core Components: PU and PEOU","content_vi":"- Cảm nhận sự hữu ích (Perceived Usefulness - PU): Là mức độ mà người dùng tin rằng việc sử dụng hệ thống sẽ giúp họ tăng hiệu suất làm việc. Nếu PU thấp, mọi chiến dịch marketing đều vô nghĩa.\n- Cảm nhận sự dễ dùng (Perceived Ease of Use - PEOU): Là mức độ mà người dùng tin rằng việc sử dụng hệ thống sẽ không tốn quá nhiều nỗ lực. PEOU thường tác động tích cực lên PU: cái gì dễ dùng thì người ta mới thấy nó hữu ích.","content_en":"- Perceived Usefulness (PU): The degree to which a user believes tech improves performance.\n- Perceived Ease of Use (PEOU): The degree to which a user believes tech requires minimal effort. PEOU often impacts PU: ease leads to usefulness."},
        {"h2_vi":"3. Sự tiến hóa của mô hình: TAM2, TAM3 và UTAUT","h2_en":"3. Evolution: TAM2, TAM3, and UTAUT","content_vi":"Venkatesh và Davis đã nâng cấp mô hình lên TAM2 (2000) bằng cách thêm các yếu tố xã hội như Chuẩn chủ quan và Hình ảnh. Sau đó, TAM3 (2008) tập trung sâu hơn vào các yếu tố quyết định PEOU như Tính tự tin (Self-efficacy). Cuối cùng là UTAUT (2003) - một sự tổng hợp khổng lồ của 8 lý thuyết khác nhau, giúp dự báo hành vi với độ chính xác lên tới 70%.","content_en":"TAM evolved into TAM2 (adding social factors like Subjective Norms) and TAM3 (focusing on PEOU determinants). Finally, UTAUT (2003) integrated 8 theories, achieving 70% predictive accuracy."},
        {"h2_vi":"4. Cách thiết kế thang đo và chạy mô hình trên ncsStat","h2_en":"4. Measurement and Analysis on ncsStat","content_vi":"Để chạy TAM chuẩn, bạn cần dùng thang đo Likert 5 hoặc 7 điểm. ncsStat gợi ý quy trình: 1. Kiểm định Cronbach Alpha (>0.7); 2. Phân tích nhân tố khám phá EFA; 3. Chạy hồi quy đa biến hoặc SEM để kiểm định các giả thuyết: PEOU -> PU, PU -> Ý định sử dụng (BI), PEOU -> BI.","content_en":"Use 5-7 point Likert scales. ncsStat workflow: 1. Cronbach Alpha (>0.7); 2. EFA; 3. Regression or SEM for hypotheses: PEOU to PU, PU to BI, PEOU to BI."}
    ]$$
),
(
    'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 
    'theory-of-planned-behavior-tpb', 
    'Behavioral Research', 
    'Thuyết Hành vi Dự định (TPB): Chìa khóa vàng giải mã Ý định',
    'Theory of Planned Behavior (TPB): The Golden Key to Intention', 
    'Hãy chú ý đến khoảng cách giữa Ý định (Intention) và Hành vi thực tế (Behavior). Nhiều nghiên cứu cho thấy Ý định rất cao nhưng Hành vi lại thấp. Đừng quên đưa biến PBC vào như một biến điều tiết.', 
    'Pay attention to the Intention-Behavior gap. Use Perceived Behavioral Control (PBC) as a moderator to deepen your analysis.', 
    $$[
        {"h2_vi":"1. Từ TRA đến TPB: Bước ngoặt của Icek Ajzen","h2_en":"1. From TRA to TPB: Icek Ajzen's Turning Point","content_vi":"Ban đầu, Thuyết Hành động Hợp lý (TRA) chỉ tập trung vào Thái độ và Chuẩn chủ quan. Tuy nhiên, Ajzen nhận ra rằng con người không luôn có quyền kiểm soát hoàn toàn hành vi của mình (Vd: muốn mua iPhone nhưng không đủ tiền). Do đó, ông đã thêm biến PBC vào năm 1991 để tạo ra TPB.","content_en":"Initially, TRA focused on Attitude and Subjective Norms. Ajzen realized humans lack total control over behaviors (e.g., wanting an iPhone but lacking funds), so he added Perceived Behavioral Control (PBC) in 1991."},
        {"h2_vi":"2. Ba chân kiềng của Ý định hành vi","h2_en":"2. The Three Components of Intention","content_vi":"- Thái độ (Attitude): Đánh giá tích cực hay tiêu cực về hành vi.\n- Chuẩn chủ quan (Subjective Norm): Áp lực từ những người xung quanh (gia đình, bạn bè, đồng nghiệp).\n- Kiểm soát hành vi cảm nhận (PBC): Niềm tin vào khả năng thực hiện hành vi của bản thân mình.","content_en":"- Attitude: Positive or negative evaluation.\n- Subjective Norm: Pressure from social circles.\n- PBC: Self-belief in the ability to perform the behavior."},
        {"h2_vi":"3. Ứng dụng trong Marketing và Tâm lý học","h2_en":"3. Applications in Marketing and Psychology","content_vi":"TPB được dùng để giải thích hầu hết mọi hành vi: Từ việc khách hàng chọn mua thực phẩm hữu cơ, sinh viên quyết định khởi nghiệp, đến cả việc người dân tuân thủ quy định đeo khẩu trang. Trong phân tích trên ncsStat, TPB thường được sử dụng như một khung lý thuyết nền vững chắc.","content_en":"TPB explains diverse behaviors: Buying organic food, student entrepreneurship, or compliance with health regulations. ncsStat users often use TPB as a robust framework."},
        {"h2_vi":"4. Phân tích Mediation (Biến trung gian) trong TPB","h2_en":"4. Mediation Analysis in TPB","content_vi":"Một xu hướng hiện đại là nghiên cứu cách các biến nhân khẩu học hoặc các yếu tố ngoại vi tác động đến Ý định THÔNG QUA ba nhân tố của TPB. ncsStat hỗ trợ bạn chạy kiểm định Sobel hoặc Bootstrapping để xác định chính xác hiệu ứng trung gian này.","content_en":"A modern trend is researching how external factors impact Intention VIA TPB components. ncsStat supports Sobel and Bootstrapping tests to identify these mediation effects."}
    ]$$
),
(
    'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 
    'signaling-theory-research', 
    'Market Strategy', 
    'Lý thuyết Tín hiệu (Signaling Theory): Khi Hành động thay cho lời nói', 
    'Signaling Theory: Actions Speak Louder Than Words', 
    'Khi làm về Signaling, hãy phân rõ ai là Người phát tín hiệu (Sender) và ai là Người nhận (Receiver). Một tín hiệu không có chi phí (free signal) thường bị coi là cheap talk và không có giá trị.', 
    'Clarify the Sender and Receiver. A free signal is often dismissed as cheap talk and holds no value for investors or search engines.', 
    $$[
        {"h2_vi":"1. Michael Spence và Giải Nobel Kinh tế","h2_en":"1. Michael Spence and the Nobel Prize","content_vi":"Signaling Theory ra đời từ nghiên cứu về thị trường lao động của Michael Spence (1973). Tại sao bằng cấp lại quan trọng ngay cả khi kiến thức trong trường không dùng tới? Vì tấm bằng là một tín hiệu cực kỳ tốn kém về thời gian và trí tuệ, báo hiệu cho nhà tuyển dụng rằng ứng viên là người có năng lực.","content_en":"Born from Michael Spence's 1973 labor market research. Degrees matter because they are a costly signal of time and intelligence, signaling competence to employers."},
        {"h2_vi":"2. Cơ chế hoạt động: Sender - Signal - Receiver","h2_en":"2. Mechanism: Sender - Signal - Receiver","content_vi":"Trong thị trường bất đối xứng thông tin, người bán biết rõ chất lượng sản phẩm hơn người mua. Để thuyết phục, người bán phải phát đi các tín hiệu (Vd: Bảo hành 10 năm, chứng chỉ chất lượng ISO, hoặc đánh giá 5 sao từ chuyên gia). Nếu tín hiệu đủ mạnh, người nhận (Receiver) sẽ thay đổi nhận thức.","content_en":"In asymmetric markets, sellers know quality better than buyers. To persuade, sellers must send signals (e.g., 10-year warranties, ISO certificates, expert reviews). Strong signals change receiver perceptions."},
        {"h2_vi":"3. Tại sao nội dung này lại quan trọng cho Marketing hiện đại?","h2_en":"3. Why It Matters for Modern Marketing","content_vi":"Trong kỷ nguyên số, Lòng tin là mặt hàng xa xỉ. Thương hiệu mạnh chính là một hệ thống tín hiệu phức tạp giúp giảm rủi ro cảm nhận của khách hàng. ncsStat giúp bạn đo lường mức độ tác động của các tín hiệu (như CSR, Thương hiệu cá nhân) đến hành vi trung thành.","content_en":"In the digital age, Trust is luxury. Strong branding is a complex signal system reducing perceived risk. ncsStat helps measure signal impacts (like CSR, Personal Branding) on loyalty."},
        {"h2_vi":"4. Cách kiểm định Lý thuyết Tín hiệu trên nền tảng ncsStat","h2_en":"4. Testing Signaling Theory on ncsStat","content_vi":"Bạn có thể sử dụng phương pháp Thực nghiệm hoặc khảo sát bảng hỏi. Với ncsStat, bạn dễ dàng so sánh sự khác biệt giữa các nhóm (T-test, ANOVA) để thấy rõ sức mạnh của việc có và không có tín hiệu ảnh hưởng thế nào đến Ý định mua/tin tưởng.","content_en":"Use experimental designs or surveys. With ncsStat, compare groups (T-test, ANOVA) to see how signals affect purchase intent and trust."}
    ]$$
)
ON CONFLICT (slug) DO UPDATE SET 
    title_vi = EXCLUDED.title_vi,
    title_en = EXCLUDED.title_en,
    expert_tip_vi = EXCLUDED.expert_tip_vi,
    expert_tip_en = EXCLUDED.expert_tip_en,
    content_structure = EXCLUDED.content_structure;
