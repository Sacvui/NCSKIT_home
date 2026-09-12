const fs = require('fs');

let content = fs.readFileSync('lib/constants/articles-fallback.ts', 'utf-8');

// Helper to generate a massive, deep academic HTML structure
const createDeepInsight = (title, overview, constructs, application, limitations) => {
    let constructsHtml = constructs.map(c => `<li class="p-4 border-b border-slate-100"><strong class="text-indigo-900">${c.name}:</strong> ${c.desc}</li>`).join('');
    
    return `
            <div class="space-y-12 text-slate-700 leading-relaxed font-medium">
                <div class="bg-indigo-50/50 p-10 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <h3 class="text-3xl font-black text-indigo-950 mb-6 tracking-tight">1. Bản chất mô hình (The Core Essence)</h3>
                    <p class="text-lg text-slate-800 leading-loose">${overview}</p>
                </div>
                
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm">2</span> 
                        Phân rã các thành tố (Key Constructs)
                    </h3>
                    <div class="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-md shadow-slate-100/50">
                        <ul class="space-y-2 text-base bg-slate-50 rounded-3xl overflow-hidden">
                            ${constructsHtml}
                        </ul>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                        <h3 class="text-xl font-black text-emerald-950 mb-4 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Ứng dụng thực tiễn
                        </h3>
                        <p class="text-emerald-900 leading-relaxed">${application}</p>
                    </div>
                    
                    <div class="bg-rose-50/50 p-8 rounded-3xl border border-rose-100">
                        <h3 class="text-xl font-black text-rose-950 mb-4 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-rose-500"></span> Hạn chế học thuật
                        </h3>
                        <p class="text-rose-900 leading-relaxed">${limitations}</p>
                    </div>
                </div>

                <div class="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl mt-12 relative overflow-hidden group">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl group-hover:bg-indigo-500/50 transition-colors"></div>
                    <h3 class="text-xl font-black mb-4">Góc nhìn chuyên gia</h3>
                    <p class="text-slate-300 leading-relaxed mb-6">Mô hình này không chỉ là một khung lý thuyết khô khan, mà là một lăng kính sắc bén giúp nhà nghiên cứu giải mã những hành vi phức tạp của con người và tổ chức trong môi trường đầy biến động. Khi áp dụng, hãy nhớ kết hợp kiểm định sự khác biệt (Multi-Group Analysis) để tăng độ sâu của bài báo.</p>
                    <div class="pt-6 border-t border-white/10 flex items-center justify-between">
                        <span class="text-slate-400 text-sm italic">Bài viết được nghiên cứu và tổng hợp độc quyền bởi</span>
                        <strong class="text-white font-black tracking-widest uppercase bg-white/10 px-4 py-2 rounded-xl">Lê Phúc Hải</strong>
                    </div>
                </div>
            </div>`;
};

// Data dictionary for replacing content
const deepData = {
    'sor-model-marketing-behavior': {
        overview: "Mô hình S-O-R (Stimulus - Organism - Response), do Mehrabian và Russell (1974) khởi xướng trong lĩnh vực tâm lý học môi trường, là một trong những khung lý thuyết có tầm ảnh hưởng lớn nhất trong nghiên cứu hành vi người tiêu dùng hiện đại. S-O-R khẳng định rằng con người không phản ứng trực tiếp một cách máy móc với các kích thích từ môi trường, mà các kích thích này sẽ thẩm thấu qua 'lăng kính' nội tâm (cảm xúc và nhận thức) trước khi biến thành hành động. Trong kỷ nguyên thương mại điện tử, S-O-R chính là chìa khóa để giải mã tại sao một giao diện website đẹp lại khiến khách hàng 'chốt đơn' bốc đồng.",
        constructs: [
            { name: "Stimulus (Kích thích - S)", desc: "Là các yếu tố tác động từ môi trường bên ngoài. Trong ngữ cảnh hiện đại, nó có thể là: Giao diện website (Website Design), Khuyến mãi chớp nhoáng (Flash Sales), Âm nhạc tại cửa hàng, hoặc Tương tác của Reviewer trên TikTok." },
            { name: "Organism (Cơ thể / Nội tâm - O)", desc: "Trạng thái cảm xúc (Pleasure - Arousal - Dominance) hoặc nhận thức (Trust, Perceived Value) của cá nhân sau khi tiếp nhận kích thích. Đây là hộp đen (black box) chuyển hóa thông tin." },
            { name: "Response (Phản hồi - R)", desc: "Hành vi cuối cùng của người dùng, thường chia làm hai hướng: Tiếp cận (Approach - Ví dụ: Mua hàng, ở lại website, quay lại lần sau) hoặc Né tránh (Avoidance - Thoát trang, đánh giá 1 sao)." }
        ],
        application: "S-O-R cực kỳ phù hợp cho các đề tài luận văn thạc sĩ/tiến sĩ về <strong>Hành vi mua bốc đồng (Impulse Buying Behavior)</strong> trên các nền tảng Livestream, Shopee, TikTok Shop. Bằng cách dùng thiết kế giao diện hoặc độ uy tín của KOC làm biến 'S', trạng thái Flow (Dòng chảy tâm lý) làm biến 'O', người nghiên cứu có thể xây dựng các mô hình PLS-SEM cực kỳ phức tạp và có tính ứng dụng cao.",
        limitations: "S-O-R thường bị chỉ trích là quá 'tuyến tính' (Linear). Nó giả định S dẫn đến O, và O dẫn đến R một cách một chiều, bỏ qua các vòng lặp phản hồi (Feedback loops) khi hành vi (R) quay ngược lại làm thay đổi nhận thức (O). Hơn nữa, việc đo lường trạng thái cảm xúc (O) qua thang đo Likert đôi khi không phản ánh đúng phản xạ sinh học thời gian thực."
    },
    'technology-acceptance-model-tam': {
        overview: "Mô hình Chấp nhận Công nghệ (TAM) do Fred Davis (1989) đề xuất, là một tượng đài bất tử trong nghiên cứu Hệ thống thông tin (IS). TAM giải quyết một câu hỏi kinh điển của giới công nghệ: 'Tại sao các công ty đầu tư hàng triệu đô la vào phần mềm mới, nhưng nhân viên lại từ chối sử dụng chúng?'. Kế thừa từ Thuyết Hành động Hợp lý (TRA), TAM tối giản hóa các rào cản tâm lý bằng cách chứng minh rằng, ý định sử dụng bất kỳ công nghệ nào cũng bị chi phối bởi hai biến số cốt lõi: Sự hữu ích và Sự dễ sử dụng.",
        constructs: [
            { name: "Perceived Usefulness (Nhận thức sự hữu ích - PU)", desc: "Mức độ một cá nhân tin rằng việc sử dụng một công nghệ sẽ giúp họ nâng cao hiệu suất công việc. Đây là biến dự báo mạnh mẽ nhất trong mô hình." },
            { name: "Perceived Ease of Use (Nhận thức sự dễ sử dụng - PEOU)", desc: "Mức độ một người tin rằng việc sử dụng công nghệ không đòi hỏi sự nỗ lực về trí tuệ hay thể chất. Nếu một phần mềm quá phức tạp, PEOU thấp sẽ giết chết hệ thống dù nó có Hữu ích đến đâu." },
            { name: "Behavioral Intention (Ý định hành vi - BI)", desc: "Sự sẵn sàng của cá nhân trong việc sử dụng hệ thống trong tương lai, là tiền đề trực tiếp dẫn đến hành vi sử dụng thực tế (Actual Use)." }
        ],
        application: "TAM là lựa chọn số một cho các đề tài nghiên cứu về sự chấp nhận của người dùng đối với các công nghệ mới nổi: Trí tuệ nhân tạo (ChatGPT), Ví điện tử, Fintech, Hệ thống e-Learning, hoặc Hồ sơ bệnh án điện tử (EMR) trong y tế. Việc bổ sung thêm biến 'Sự tin tưởng' (Trust) vào TAM sẽ tạo ra các mô hình nghiên cứu rất mạnh cho mảng Tài chính.",
        limitations: "TAM bị giới hạn bởi tính 'tự nguyện' (Voluntary). Khi công nghệ bị ép buộc sử dụng (Ví dụ: hệ thống ERP của công ty), TAM không còn giải thích tốt hành vi. Ngoài ra, TAM bỏ qua các yếu tố xã hội (Ảnh hưởng từ đồng nghiệp, sếp) - lỗ hổng này sau đó đã được khắc phục bởi TAM2 và UTAUT."
    },
    'theory-of-planned-behavior-tpb': {
        overview: "Thuyết Hành vi Dự định (Theory of Planned Behavior - TPB) do Icek Ajzen (1991) phát triển, là phiên bản nâng cấp hoàn hảo của Thuyết Hành động Hợp lý (TRA). TPB ra đời để giải quyết bài toán: 'Ngay cả khi tôi có thái độ tốt và mọi người đều ủng hộ, tại sao tôi vẫn không thực hiện hành vi?'. Câu trả lời nằm ở khả năng kiểm soát thực tế. Khung lý thuyết này đã trở thành 'kim chỉ nam' trong các nghiên cứu về tâm lý học hành vi, tiêu dùng xanh, và sức khỏe cộng đồng.",
        constructs: [
            { name: "Attitude toward behavior (Thái độ đối với hành vi - ATT)", desc: "Đánh giá tổng thể mang tính tích cực hoặc tiêu cực của một cá nhân về việc thực hiện hành vi (Ví dụ: 'Tôi thấy việc ăn chay là rất tốt cho sức khỏe')." },
            { name: "Subjective Norm (Chuẩn mực chủ quan - SN)", desc: "Áp lực xã hội mà cá nhân cảm nhận được về việc có nên thực hiện hành vi hay không (Ví dụ: 'Gia đình và bạn bè rất muốn tôi giảm cân')." },
            { name: "Perceived Behavioral Control (Nhận thức kiểm soát hành vi - PBC)", desc: "Đóng góp vĩ đại nhất của Ajzen. Nó phản ánh nhận thức của cá nhân về việc hành vi đó dễ hay khó thực hiện, bị cản trở bởi thời gian, tiền bạc, hay kỹ năng (Ví dụ: 'Tôi muốn mua xe điện nhưng trạm sạc quá ít')." }
        ],
        application: "TPB thống trị tuyệt đối trong các mảng nghiên cứu về Hành vi Tiêu dùng xanh (Mua thực phẩm hữu cơ, mỹ phẩm thuần chay), Hành vi khởi nghiệp của sinh viên, hoặc Hành vi tuân thủ y tế. Đặc biệt khi nghiên cứu Gen Z, biến Subjective Norm thường kết hợp rất tốt với các yếu tố FOMO (Fear of Missing Out).",
        limitations: "TPB quá tập trung vào tính toán lý trí (Rational calculations) mà bỏ qua yếu tố cảm xúc (Emotions) và thói quen vô thức (Habits). Hơn nữa, khoảng cách giữa Ý định (Intention) và Hành vi thực tế (Actual Behavior) - hay còn gọi là Intention-Behavior Gap - vẫn là một điểm mù lớn mà TPB chưa giải quyết trọn vẹn."
    },
    'servqual-service-quality-model': {
        overview: "Mô hình SERVQUAL (Service Quality), ra mắt bởi Parasuraman, Zeithaml và Berry (1988), là một cột mốc lịch sử làm thay đổi vĩnh viễn cách các doanh nghiệp đo lường chất lượng dịch vụ. Trước SERVQUAL, chất lượng dịch vụ là một khái niệm trừu tượng không thể đo lường. SERVQUAL đã lượng hóa nó bằng mô hình Khoảng cách (Gap Model), định nghĩa Chất lượng = Sự khác biệt giữa Kỳ vọng của khách hàng (Expectations) và Cảm nhận thực tế của họ sau khi trải nghiệm (Perceptions).",
        constructs: [
            { name: "Tangibles (Phương tiện hữu hình)", desc: "Vẻ ngoài của cơ sở vật chất, trang thiết bị, đồng phục nhân viên và tài liệu truyền thông (Ví dụ: Không gian sang trọng của một phòng khám nha khoa)." },
            { name: "Reliability (Sự tin cậy)", desc: "Khả năng cung cấp dịch vụ đúng như đã hứa một cách chính xác và nhất quán ngay từ lần đầu tiên (Biến này thường có trọng số quan trọng nhất)." },
            { name: "Responsiveness (Sự đáp ứng)", desc: "Sự sẵn sàng giúp đỡ khách hàng và cung cấp dịch vụ một cách nhanh chóng (Ví dụ: Tốc độ phản hồi tin nhắn của tổng đài)." },
            { name: "Assurance (Sự đảm bảo)", desc: "Kiến thức, phong thái lịch sự của nhân viên và khả năng truyền tải sự tin tưởng, an tâm cho khách hàng." },
            { name: "Empathy (Sự đồng cảm)", desc: "Sự quan tâm, chăm sóc cá nhân hóa mà doanh nghiệp dành cho từng khách hàng (Ví dụ: Nhớ tên khách quen, hiểu rõ sở thích của họ)." }
        ],
        application: "SERVQUAL là tiêu chuẩn vàng (Gold Standard) cho các luận văn khối Kinh tế - Quản trị liên quan đến đánh giá sự hài lòng của khách hàng trong ngành Ngân hàng, Khách sạn, Du lịch, Hàng không, và Bệnh viện tư nhân. Việc chạy phân tích hồi quy từ 5 thang đo này lên biến 'Sự Hài Lòng' luôn mang lại R-squared rất cao.",
        limitations: "Việc đo lường cả 2 bộ câu hỏi (Kỳ vọng trước khi trải nghiệm và Cảm nhận sau khi trải nghiệm) trong cùng một bảng khảo sát thường khiến đáp viên bị bối rối và mệt mỏi, dẫn đến sai số (Survey Fatigue). Đây là lý do mô hình SERVPERF (chỉ đo lường Cảm nhận thực tế) sau này ra đời để thay thế và khắc phục nhược điểm này."
    },
    'utaut-technology-adoption': {
        overview: "Thuyết Hợp nhất Chấp nhận Công nghệ (UTAUT), được Venkatesh et al. (2003) xây dựng bằng cách hợp nhất và tổng hợp từ 8 mô hình lý thuyết lớn trước đó (bao gồm cả TAM và TPB). UTAUT ra đời để chấm dứt sự phân mảnh trong nghiên cứu Hệ thống thông tin, tạo ra một 'Đại thống nhất thuyết' có sức mạnh dự báo (R-squared) lên tới 70% đối với ý định sử dụng công nghệ của con người.",
        constructs: [
            { name: "Performance Expectancy (Kỳ vọng hiệu năng - PE)", desc: "Giống với PU của TAM, mức độ người dùng tin rằng hệ thống giúp họ đạt được thành tích tốt hơn trong công việc." },
            { name: "Effort Expectancy (Kỳ vọng nỗ lực - EE)", desc: "Tương đương PEOU của TAM, đánh giá mức độ dễ dàng khi sử dụng hệ thống." },
            { name: "Social Influence (Ảnh hưởng xã hội - SI)", desc: "Mức độ một người tin rằng những người quan trọng khác (sếp, bạn bè) nghĩ họ NÊN sử dụng hệ thống." },
            { name: "Facilitating Conditions (Điều kiện thuận lợi - FC)", desc: "Niềm tin về cơ sở hạ tầng tổ chức và kỹ thuật có sẵn để hỗ trợ sử dụng hệ thống (Ví dụ: 'Tôi có đủ internet tốc độ cao và máy tính mạnh để chạy phần mềm')." }
        ],
        application: "UTAUT là sự thay thế bắt buộc cho TAM trong các đề tài nghiên cứu công nghệ quy mô doanh nghiệp (ERP, CRM, Intranet) hoặc các công nghệ mang tính bắt buộc. Sự hiện diện của biến Điều kiện thuận lợi (FC) giúp các nhà quản trị nhận ra rằng: Đào tạo và hỗ trợ kỹ thuật đóng vai trò quyết định.",
        limitations: "UTAUT gốc thường quá khô khan và mang nặng tính công sở (Organizational Context). Nó thiếu các yếu tố chi phối hành vi của người tiêu dùng cá nhân (Hedonic motivations, Price value). Venkatesh sau đó phải tung ra UTAUT2 vào năm 2012 để sửa chữa khuyết điểm này, tập trung vào thị trường tiêu dùng đại chúng (Consumer Context)."
    },
    'porter-five-forces-analysis': {
        overview: "Mô hình 5 Áp lực Cạnh tranh (Five Forces) của Michael Porter (1979) không chỉ là một lý thuyết học thuật, mà là 'kinh thánh' của mọi chiến lược gia. Thay vì chỉ nhìn vào đối thủ cạnh tranh trực tiếp, Porter định nghĩa lại cấu trúc của một ngành công nghiệp. Mức độ sinh lời của một ngành không phụ thuộc vào sản phẩm, mà phụ thuộc hoàn toàn vào cấu trúc của 5 áp lực này.",
        constructs: [
            { name: "Threat of New Entrants (Nguy cơ từ đối thủ mới tiềm ẩn)", desc: "Rào cản gia nhập ngành (Vốn, tính kinh tế theo quy mô, độc quyền công nghệ). Nếu rào cản thấp, ngành sẽ nhanh chóng bị xâu xé." },
            { name: "Bargaining Power of Suppliers (Quyền lực thương lượng của nhà cung cấp)", desc: "Khi nhà cung cấp độc quyền hoặc chi phí chuyển đổi cao, họ có quyền ép giá và siết chặt biên lợi nhuận của bạn." },
            { name: "Bargaining Power of Buyers (Quyền lực thương lượng của khách hàng)", desc: "Khách hàng có nhiều lựa chọn, mua số lượng lớn hoặc nhạy cảm về giá sẽ đẩy doanh nghiệp vào thế bị động." },
            { name: "Threat of Substitutes (Nguy cơ từ sản phẩm thay thế)", desc: "Kẻ thù thực sự thường không đến từ cùng ngành. (Ví dụ: Kẻ giết chết taxi truyền thống là ứng dụng công nghệ, kẻ giết máy ảnh kỹ thuật số là smartphone)." },
            { name: "Industry Rivalry (Cạnh tranh nội bộ ngành)", desc: "Cường độ cạnh tranh giữa các tay chơi hiện tại (Gây ra các cuộc chiến giá cả đẫm máu)." }
        ],
        application: "Là nền tảng bắt buộc trong mọi bài luận văn Thạc sĩ Quản trị Kinh doanh (MBA) khi Phân tích Môi trường vĩ mô và vi mô. Porter's Five Forces kết hợp với PESTEL sẽ cho ra bức tranh hoàn chỉnh để doanh nghiệp quyết định có nên rót vốn vào một thị trường mới hay không.",
        limitations: "Mô hình mang tính chất 'Tĩnh' (Static) trong một thế giới 'Động' (Dynamic). Nó không đánh giá được sự trỗi dậy của các siêu nền tảng số (Platform Economics) hay các hệ sinh thái cộng sinh (Business Ecosystems) nơi mà đối thủ có thể đồng thời là đối tác."
    },
    'vrio-framework-strategy': {
        overview: "Khung phân tích VRIO, phát triển từ Quan điểm Dựa trên Nguồn lực (Resource-Based View - RBV) của Jay Barney (1991), là công cụ kiểm toán chiến lược nội bộ mạnh mẽ nhất. Trong khi Porter nhìn ra bên ngoài thị trường, VRIO nhìn vào trong doanh nghiệp để trả lời câu hỏi: 'Tại sao công ty A lại liên tục chiến thắng công ty B dù cùng một thị trường?'. Câu trả lời: Sự vượt trội đến từ các nguồn lực và năng lực cốt lõi thỏa mãn 4 tiêu chí khắt khe.",
        constructs: [
            { name: "Value (Giá trị - V)", desc: "Nguồn lực có giúp công ty khai thác cơ hội hoặc vô hiệu hóa mối đe dọa không? Nếu không, nó là lợi thế bất lợi (Competitive Disadvantage)." },
            { name: "Rarity (Tính Khan hiếm - R)", desc: "Có bao nhiêu đối thủ sở hữu nguồn lực này? Nếu ai cũng có, đó chỉ là sự cân bằng cạnh tranh (Competitive Parity)." },
            { name: "Imitability (Khó bắt chước - I)", desc: "Đối thủ có tốn quá nhiều tiền và thời gian để sao chép nó không? (Ví dụ: Văn hóa doanh nghiệp, Bằng sáng chế độc quyền). Nếu dễ sao chép, lợi thế chỉ là Tạm thời (Temporary)." },
            { name: "Organization (Tổ chức - O)", desc: "Doanh nghiệp có đủ hệ thống quản trị, quy trình và văn hóa để vắt kiệt giá trị từ 3 yếu tố trên không? Thỏa mãn cả 4, doanh nghiệp đạt được Lợi thế Cạnh tranh Bền vững (Sustainable Competitive Advantage)." }
        ],
        application: "Thường xuyên được ứng dụng trong các bài nghiên cứu về Chiến lược cấp doanh nghiệp, Quản trị tri thức (Knowledge Management), và phân tích năng lực lõi của các kỳ lân công nghệ (Apple, Tesla). VRIO đặc biệt hữu hiệu khi kết hợp với phân tích Chuỗi giá trị (Value Chain).",
        limitations: "Khá khó để đo lường định lượng (Quantitative) do bản chất của VRIO rất trừu tượng. Ngoài ra, trong các ngành công nghệ biến đổi nhanh, một nguồn lực hôm nay đạt chuẩn VRIO có thể trở thành 'Gánh nặng cốt lõi' (Core Rigidities) vào ngày mai."
    },
    'expectation-confirmation-theory-ect': {
        overview: "Thuyết Kỳ vọng - Xác nhận (Expectation-Confirmation Theory - ECT) do Oliver (1980) tiên phong, là nền tảng tối cao để giải mã Hiện tượng Hài lòng của khách hàng và Ý định tiếp tục sử dụng (Continuance Intention). Mô hình giải thích rằng sự hài lòng không đơn thuần sinh ra từ chất lượng sản phẩm, mà sinh ra từ một quá trình so sánh tâm lý: Mức độ hiệu năng thực tế vượt qua hay nằm dưới sự kỳ vọng ban đầu.",
        constructs: [
            { name: "Expectation (Kỳ vọng)", desc: "Những mong đợi ban đầu của người dùng về sản phẩm/dịch vụ trước khi trải nghiệm (Hình thành qua quảng cáo, truyền miệng)." },
            { name: "Perceived Performance (Hiệu năng Cảm nhận)", desc: "Đánh giá thực tế của người dùng sau khi sử dụng sản phẩm." },
            { name: "Confirmation (Sự xác nhận)", desc: "Cốt lõi của ECT. Nếu Hiệu năng > Kỳ vọng = Positive Disconfirmation (Khách hàng thỏa mãn). Nếu Hiệu năng < Kỳ vọng = Negative Disconfirmation (Khách hàng thất vọng)." },
            { name: "Satisfaction (Sự hài lòng)", desc: "Kết quả trực tiếp của sự Xác nhận. Quyết định khách hàng có quay lại hay không." }
        ],
        application: "ECT là bộ khung vô giá cho các nghiên cứu về Lòng trung thành của khách hàng (Customer Loyalty), Tái mua hàng (Repurchase Intention), hoặc Hủy đăng ký dịch vụ (Churn Rate) trong các mô hình Kinh doanh Đăng ký (SaaS, Netflix, Spotify). ECT-IT của Bhattacherjee (2001) là biến thể cực kỳ phổ biến trong IS research.",
        limitations: "ECT tập trung quá nhiều vào khâu 'Sau khi mua hàng' (Post-purchase), làm mờ nhạt đi các yếu tố ảnh hưởng trực tiếp tại thời điểm quyết định (Point-of-sales). Nó giả định con người luôn ghi nhớ chính xác kỳ vọng ban đầu của mình, điều thường bị thiên kiến bộ nhớ (Memory bias) làm sai lệch."
    },
    'perceived-value-marketing-strategy': {
        overview: "Mô hình Giá trị Cảm nhận (Perceived Value) là hòn đá tảng trong lý thuyết Marketing hiện đại. Định nghĩa nổi tiếng nhất từ Zeithaml (1988) cho rằng: 'Giá trị cảm nhận là sự đánh giá tổng thể của người tiêu dùng về tiện ích của một sản phẩm, dựa trên nhận thức về những gì họ Nhận được (Get) và những gì họ phải Cho đi (Give)'. Khách hàng không mua sản phẩm, họ mua Giá trị.",
        constructs: [
            { name: "Functional Value (Giá trị công năng)", desc: "Chất lượng vật lý, hiệu suất, và độ bền của sản phẩm. (Ví dụ: Xe ô tô chạy êm, tiết kiệm xăng)." },
            { name: "Emotional Value (Giá trị cảm xúc)", desc: "Sự thích thú, vui vẻ, hoặc cảm giác an tâm khi sử dụng sản phẩm (Ví dụ: Mua bảo hiểm nhân thọ)." },
            { name: "Social Value (Giá trị xã hội)", desc: "Sự gia tăng vị thế, hình ảnh bản thân trong mắt người khác khi sở hữu sản phẩm (Ví dụ: Túi xách Hermes, đồng hồ Rolex)." },
            { name: "Epistemic/Conditional Value (Giá trị tri thức/hoàn cảnh)", desc: "Sự tò mò, khao khát cái mới (Tri thức) hoặc giá trị phát sinh do một hoàn cảnh đặc thù (Mua ô che mưa khi trời bão)." }
        ],
        application: "Luôn là biến trung gian (Mediator) quyền lực nhất trong các bài nghiên cứu về Marketing Xanh (Green Marketing), Sản phẩm Xa xỉ (Luxury Brands), và Chăm sóc sức khỏe (Healthcare). Việc đo lường Perceived Value (PERVAL) của Sweeney & Soutar (2001) bằng PLS-SEM cho phép các nhãn hàng tìm ra đâu là thứ khách hàng sẵn sàng 'rút ví'.",
        limitations: "Rất khó để tách bạch hoàn toàn các loại Giá trị, do chúng thường tương quan mạnh với nhau (Multicollinearity). Hơn nữa, Giá trị cảm nhận rất chủ quan và dễ biến động tùy thuộc vào túi tiền và tâm trạng tức thời của người mua."
    },
    'tce-transaction-cost-economics-strategy': {
        overview: "Kinh tế học Chi phí Giao dịch (Transaction Cost Economics - TCE) của Oliver Williamson (người đoạt giải Nobel) là học thuyết nền tảng giải thích sự tồn tại của ranh giới doanh nghiệp. Tại sao công ty lại tự sản xuất (Make) thay vì mua ngoài (Buy)? TCE khẳng định: Các giao dịch trên thị trường không bao giờ miễn phí. Khi chi phí tìm kiếm, đàm phán, và kiểm soát đối tác (Transaction Costs) lớn hơn chi phí tự vận hành nội bộ, doanh nghiệp sẽ chọn cách tự làm.",
        constructs: [
            { name: "Bounded Rationality (Tính hợp lý bị giới hạn)", desc: "Con người không thể biết trước mọi rủi ro trong tương lai khi ký hợp đồng. Họ luôn có điểm mù." },
            { name: "Opportunism (Chủ nghĩa cơ hội)", desc: "Đối tác kinh doanh có xu hướng trục lợi, nói dối, hoặc phá vỡ cam kết khi có cơ hội (Ví dụ: Nhà cung cấp bất ngờ tăng giá ép bạn)." },
            { name: "Asset Specificity (Tính đặc thù của tài sản)", desc: "Tài sản (máy móc, kỹ năng) được đầu tư riêng cho một giao dịch, và mất giá trị nếu dùng cho việc khác. Đây là nguyên nhân lớn nhất đẩy chi phí giao dịch lên cao." },
            { name: "Uncertainty & Frequency (Tính bất định và Tần suất)", desc: "Giao dịch diễn ra càng thường xuyên, môi trường càng rủi ro, thì chi phí giao dịch càng lớn." }
        ],
        application: "TCE là lý thuyết tối cao trong các nghiên cứu về Chuỗi cung ứng (Supply Chain Management), Thuê ngoài (Outsourcing), Nhượng quyền thương mại (Franchising), và Sáp nhập mua lại (M&A). Bất kỳ luận văn Quản lý Chuỗi cung ứng nào đo lường 'Sự phụ thuộc vào đối tác' (Supplier Dependence) đều phải trích dẫn TCE.",
        limitations: "TCE có góc nhìn khá bi quan về bản tính con người (Chủ nghĩa cơ hội). Nó bỏ qua hoàn toàn các yếu tố tích cực như Sự tin tưởng (Trust) hay Mạng lưới xã hội (Social Networks) có thể làm giảm chi phí giao dịch một cách tự nhiên mà không cần đến hợp đồng pháp lý cứng nhắc."
    }
};

const defaultOverview = "Đây là phiên bản nâng cấp tự động dành cho các bài kịch bản ứng dụng (Scenario/Tutorial). Trong nghiên cứu định lượng, việc hiểu lý thuyết là chưa đủ, mà khả năng vận dụng công cụ vào xử lý dữ liệu mới là kỹ năng then chốt giúp bạn chinh phục các báo cáo chuẩn Q1/Q2 quốc tế.";
const defaultConstructs = [
    { name: "Quy trình thiết lập (Setup Process)", desc: "Xác định rõ mô hình, làm sạch dữ liệu, và kiểm tra các giả định tiên quyết (Normality, Outliers) trước khi đưa vào phân tích." },
    { name: "Thực thi kiểm định (Execution)", desc: "Tiến hành chạy thuật toán trên phần mềm (WebR/SmartPLS/SPSS), tinh chỉnh mô hình đo lường và cấu trúc." },
    { name: "Trích xuất Insight (Interpretation)", desc: "Quy chuẩn hóa toàn bộ các con số P-value, T-stat, R-squared thành văn bản giải thích chuẩn mực học thuật." }
];

// Read ALL slugs from the script and update their content if they exist in deepData or assign default.
const articleRegex = /slug:\s*'([^']+)'/g;
let match;
const slugs = [];
while ((match = articleRegex.exec(content)) !== null) {
    slugs.push(match[1]);
}

let modifiedContent = content;

slugs.forEach(slug => {
    // skip non-article things if any
    const data = deepData[slug] || {
        overview: defaultOverview,
        constructs: defaultConstructs,
        application: "Quy trình này thường được ứng dụng để kiểm định giả thuyết nghiên cứu trong các mô hình cấu trúc phức tạp. Đảm bảo người nghiên cứu xuất ra các bảng biểu đúng format APA.",
        limitations: "Quy trình đòi hỏi sự chặt chẽ. Nếu dữ liệu đầu vào (Garbage In) không được làm sạch cẩn thận, toàn bộ kết quả phân tích sẽ mất ý nghĩa (Garbage Out)."
    };
    
    const htmlString = createDeepInsight(slug, data.overview, data.constructs, data.application, data.limitations);
    
    // We will use a regex to replace content_vi for each slug.
    // Assuming the structure is: slug: 'xyz', \n category: '...', \n icon_name: '...', \n title_vi: '...', \n title_en: '...', \n content_vi: `...`,
    // Wait, currently they might NOT have content_vi defined, OR they have it defined.
    // Let's just do a string replacement for the WHOLE OBJECT!
    // But modifying AST with regex is hard.
});

// Since Regex modification is risky, let me just rewrite the ENTIRE STATIC_ARTICLES array using string manipulation!
// Wait, I can just write a script that executes inside node, loads the original array, modifies the objects, and then writes it back as a string!

const generateNewFile = () => {
    const { STATIC_ARTICLES } = require('./lib/constants/articles-fallback.ts');
    let output = "export const STATIC_ARTICLES = [\n";
    
    STATIC_ARTICLES.forEach(a => {
        const data = deepData[a.slug] || {
            overview: defaultOverview,
            constructs: defaultConstructs,
            application: "Quy trình này được dùng rộng rãi để xuất bảng biểu và đọc hiểu kết quả chạy máy. Khi thành thạo, bạn sẽ tiết kiệm hàng trăm giờ mò mẫm.",
            limitations: "Kết quả phần mềm chỉ là những con số. Việc thổi hồn và giải thích ý nghĩa của chúng hoàn toàn phụ thuộc vào tư duy của nhà nghiên cứu."
        };
        const html = createDeepInsight(a.slug, data.overview, data.constructs, data.application, data.limitations);
        
        output += `    {
        slug: '${a.slug}',
        category: ${JSON.stringify(a.category)},
        icon_name: '${a.icon_name}',
        title_vi: '${a.title_vi.replace(/'/g, "\\'")}',
        title_en: '${a.title_en.replace(/'/g, "\\'")}',
        content_vi: \`${html}\`,
        content_en: \`${html}\`
    },
`;
    });
    output += "];\n";
    fs.writeFileSync('./lib/constants/articles-fallback.ts', output, 'utf-8');
    console.log("SUCCESSFULLY OVERWRITTEN articles-fallback.ts");
};

generateNewFile();

