const fs = require('fs');

let content = fs.readFileSync('lib/constants/articles-fallback.ts', 'utf-8');

// Helper to generate a neutral, professional academic HTML structure
const createDeepInsight = (title, overview, constructs, application, limitations) => {
    let constructsHtml = constructs.map(c => `<li class="p-4 border-b border-slate-100"><strong class="text-indigo-900">${c.name}:</strong> ${c.desc}</li>`).join('');
    
    return `
            <div class="space-y-12 text-slate-700 leading-relaxed font-medium">
                <div class="bg-indigo-50/50 p-10 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <h3 class="text-3xl font-black text-indigo-950 mb-6 tracking-tight">1. Khái quát mô hình (Overview)</h3>
                    <p class="text-lg text-slate-800 leading-loose">${overview}</p>
                </div>
                
                <div>
                    <h3 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <span class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm">2</span> 
                        Các biến quan sát (Key Constructs)
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
                            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Phạm vi ứng dụng
                        </h3>
                        <p class="text-emerald-900 leading-relaxed">${application}</p>
                    </div>
                    
                    <div class="bg-rose-50/50 p-8 rounded-3xl border border-rose-100">
                        <h3 class="text-xl font-black text-rose-950 mb-4 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-rose-500"></span> Điểm hạn chế
                        </h3>
                        <p class="text-rose-900 leading-relaxed">${limitations}</p>
                    </div>
                </div>

                <div class="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl mt-12 relative overflow-hidden group">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl group-hover:bg-indigo-500/50 transition-colors"></div>
                    <h3 class="text-xl font-black mb-4">Lưu ý khi áp dụng</h3>
                    <p class="text-slate-300 leading-relaxed mb-6">Mô hình cung cấp một khung lý thuyết cơ bản để đánh giá hành vi. Tuy nhiên, khi áp dụng vào các bối cảnh nghiên cứu cụ thể, nhà nghiên cứu cần xem xét các yếu tố kiểm soát (nhân khẩu học, đặc tính ngành) để đảm bảo độ tin cậy và giá trị nội dung của kết quả phân tích.</p>
                    <div class="pt-6 border-t border-white/10 flex items-center justify-between">
                        <span class="text-slate-400 text-sm italic">By</span>
                        <strong class="text-white font-black tracking-widest uppercase bg-white/10 px-4 py-2 rounded-xl">Lê Phúc Hải</strong>
                    </div>
                </div>
            </div>`;
};

// Objective, neutral academic dictionary
const deepData = {
    'sor-model-marketing-behavior': {
        overview: "Mô hình S-O-R (Stimulus - Organism - Response), được Mehrabian và Russell (1974) phát triển, là một khung lý thuyết trong tâm lý học môi trường nhằm giải thích tác động của môi trường vật lý đến hành vi con người. Mô hình cho rằng các yếu tố môi trường (kích thích) không trực tiếp dẫn đến hành vi, mà thông qua các trạng thái nhận thức và cảm xúc nội tại (cơ thể). Trong nghiên cứu kinh doanh hiện đại, S-O-R thường được sử dụng để phân tích tác động của môi trường bán lẻ hoặc thiết kế giao diện điện tử đến quyết định mua sắm.",
        constructs: [
            { name: "Stimulus (Kích thích - S)", desc: "Các yếu tố vật lý hoặc thông tin từ môi trường bên ngoài mà cá nhân tiếp nhận, chẳng hạn như bố cục cửa hàng, thiết kế giao diện website, hoặc các chương trình khuyến mãi." },
            { name: "Organism (Cơ thể / Nội tâm - O)", desc: "Các phản ứng tâm lý nội tại của người tiêu dùng, bao gồm phản ứng nhận thức (ví dụ: đánh giá rủi ro, sự tin cậy) và phản ứng cảm xúc (hưng phấn, thư giãn) sau khi tiếp nhận kích thích." },
            { name: "Response (Phản hồi - R)", desc: "Hành vi cuối cùng của người tiêu dùng, thường được phân loại thành hành vi tiếp cận (ở lại lâu hơn, quyết định mua) hoặc hành vi né tránh (rời khỏi không gian vật lý hoặc kỹ thuật số)." }
        ],
        application: "Mô hình S-O-R thường được áp dụng trong các nghiên cứu về thương mại điện tử, hành vi mua sắm bốc đồng (impulse buying), và trải nghiệm khách hàng. Các nhà nghiên cứu có thể sử dụng cấu trúc PLS-SEM để đánh giá mức độ trung gian của biến Organism trong mối quan hệ giữa Stimulus và Response.",
        limitations: "Mô hình có xu hướng đơn giản hóa quá trình nhận thức của con người thành một chuỗi tuyến tính (S dẫn đến O, và O dẫn đến R). Nó thường gặp hạn chế trong việc giải thích các vòng lặp phản hồi, nơi hành vi có thể tác động ngược lại nhận thức, hoặc trong các quyết định mua sắm có mức độ liên kết cao (high-involvement)."
    },
    'technology-acceptance-model-tam': {
        overview: "Mô hình Chấp nhận Công nghệ (TAM), do Davis (1989) đề xuất, là một công cụ lý thuyết phổ biến nhằm dự báo và giải thích hành vi chấp nhận hệ thống thông tin của người dùng. Dựa trên Thuyết Hành động Hợp lý (TRA), TAM thu hẹp trọng tâm vào hai yếu tố chính quyết định thái độ và ý định sử dụng công nghệ mới: sự hữu ích cảm nhận và sự dễ sử dụng cảm nhận.",
        constructs: [
            { name: "Perceived Usefulness (Sự hữu ích cảm nhận - PU)", desc: "Mức độ người dùng tin rằng việc áp dụng một hệ thống hoặc công nghệ cụ thể sẽ giúp họ cải thiện hiệu suất công việc hoặc cuộc sống cá nhân." },
            { name: "Perceived Ease of Use (Sự dễ sử dụng cảm nhận - PEOU)", desc: "Đánh giá chủ quan của người dùng về mức độ nỗ lực cần thiết để học và sử dụng công nghệ đó." },
            { name: "Behavioral Intention (Ý định hành vi - BI)", desc: "Khuynh hướng chủ quan của người dùng trong việc sử dụng hoặc tiếp tục sử dụng công nghệ, được xem là tiền đề trực tiếp của hành vi sử dụng thực tế." }
        ],
        application: "TAM thường được ứng dụng để đánh giá mức độ sẵn sàng chấp nhận các công nghệ mới, như ứng dụng y tế điện tử, hệ thống e-learning, ví điện tử, và các phần mềm quản trị doanh nghiệp.",
        limitations: "TAM chủ yếu giải thích hành vi sử dụng mang tính tự nguyện và cá nhân. Mô hình này không tính đến các yếu tố áp lực xã hội (chuẩn mực chủ quan) hoặc các điều kiện hỗ trợ cơ sở hạ tầng, điều đã được khắc phục ở các mô hình sau như UTAUT."
    },
    'theory-of-planned-behavior-tpb': {
        overview: "Thuyết Hành vi Dự định (Theory of Planned Behavior - TPB), do Ajzen (1991) phát triển, là phần mở rộng của Thuyết Hành động Hợp lý (TRA). Bằng cách bổ sung thêm biến số 'Nhận thức kiểm soát hành vi', TPB giải thích các hành vi mà cá nhân không hoàn toàn có quyền kiểm soát theo ý chí, từ đó cải thiện độ chính xác trong việc dự báo ý định và hành vi thực tế.",
        constructs: [
            { name: "Attitude (Thái độ đối với hành vi)", desc: "Mức độ cá nhân có đánh giá tích cực hoặc tiêu cực về việc thực hiện một hành vi cụ thể." },
            { name: "Subjective Norm (Chuẩn mực chủ quan)", desc: "Nhận thức về áp lực xã hội (từ gia đình, bạn bè, đồng nghiệp) đối với việc thực hiện hay không thực hiện hành vi." },
            { name: "Perceived Behavioral Control (Nhận thức kiểm soát hành vi)", desc: "Đánh giá của cá nhân về mức độ dễ dàng hay khó khăn trong việc thực hiện hành vi, dựa trên các nguồn lực và cơ hội sẵn có." }
        ],
        application: "TPB được ứng dụng rộng rãi trong các nghiên cứu về tiêu dùng bền vững, hành vi tuân thủ quy định y tế, và quyết định khởi nghiệp, nơi hành vi bị chi phối bởi các giới hạn khách quan (thời gian, tiền bạc).",
        limitations: "Mô hình tập trung chủ yếu vào quá trình ra quyết định mang tính lý trí, dẫn đến việc thiếu sót trong việc giải thích các hành vi xuất phát từ thói quen vô thức hoặc cảm xúc nhất thời."
    },
    'servqual-service-quality-model': {
        overview: "Mô hình SERVQUAL, do Parasuraman, Zeithaml và Berry (1988) phát triển, là một công cụ đo lường đa biến nhằm đánh giá chất lượng dịch vụ. Mô hình xác định chất lượng dịch vụ là hàm số của sự chênh lệch (gap) giữa kỳ vọng của khách hàng trước khi sử dụng và nhận thức của họ về hiệu năng dịch vụ thực tế.",
        constructs: [
            { name: "Tangibles (Phương tiện hữu hình)", desc: "Đánh giá về cơ sở vật chất, trang thiết bị, ngoại hình nhân viên và các tài liệu truyền thông liên quan đến dịch vụ." },
            { name: "Reliability (Sự tin cậy)", desc: "Khả năng thực hiện dịch vụ đã cam kết một cách chính xác và nhất quán." },
            { name: "Responsiveness (Sự đáp ứng)", desc: "Mức độ sẵn lòng giúp đỡ khách hàng và cung cấp dịch vụ một cách kịp thời." },
            { name: "Assurance (Sự đảm bảo)", desc: "Kiến thức, kỹ năng của nhân viên và khả năng tạo dựng niềm tin cho khách hàng." },
            { name: "Empathy (Sự đồng cảm)", desc: "Mức độ quan tâm và khả năng chăm sóc cá nhân hóa mà tổ chức dành cho khách hàng." }
        ],
        application: "SERVQUAL được sử dụng trong đánh giá chất lượng dịch vụ ở các lĩnh vực như ngân hàng, y tế, giáo dục và khách sạn. Việc phân tích hệ số beta của 5 biến này giúp xác định yếu tố nào đóng góp lớn nhất vào sự hài lòng.",
        limitations: "Việc thu thập dữ liệu yêu cầu đáp viên đánh giá cả hai trạng thái (Kỳ vọng và Cảm nhận) có thể gây nhầm lẫn và tăng độ dài bảng hỏi, dễ dẫn đến sai số phản hồi. Nhiều nghiên cứu ưu tiên mô hình SERVPERF (chỉ đo lường cảm nhận) vì tính tinh gọn."
    },
    'utaut-technology-adoption': {
        overview: "Thuyết Hợp nhất Chấp nhận Công nghệ (UTAUT) do Venkatesh và cộng sự (2003) xây dựng thông qua việc tích hợp 8 mô hình lý thuyết trước đó. UTAUT cung cấp một khung phân tích toàn diện nhằm giải thích ý định sử dụng và hành vi sử dụng thực tế hệ thống thông tin, với khả năng giải thích phương sai thường đạt mức cao trong thực nghiệm.",
        constructs: [
            { name: "Performance Expectancy (Kỳ vọng hiệu năng)", desc: "Mức độ cá nhân tin rằng việc sử dụng hệ thống sẽ hỗ trợ họ đạt được kết quả tốt hơn trong công việc." },
            { name: "Effort Expectancy (Kỳ vọng nỗ lực)", desc: "Mức độ dễ dàng liên quan đến việc sử dụng hệ thống." },
            { name: "Social Influence (Ảnh hưởng xã hội)", desc: "Nhận thức của cá nhân về việc những người quan trọng xung quanh tin rằng họ nên sử dụng hệ thống mới." },
            { name: "Facilitating Conditions (Điều kiện thuận lợi)", desc: "Mức độ cá nhân tin rằng tổ chức và hạ tầng kỹ thuật hiện tại đủ khả năng hỗ trợ việc sử dụng hệ thống." }
        ],
        application: "UTAUT phù hợp cho các nghiên cứu về việc triển khai hệ thống thông tin quy mô tổ chức (ERP, CRM) hoặc môi trường công sở, nơi hành vi sử dụng đôi khi mang tính bắt buộc.",
        limitations: "Phiên bản UTAUT gốc thiên về bối cảnh tổ chức (organizational context). Để giải thích hành vi công nghệ mang tính tiêu dùng cá nhân, các nhà nghiên cứu thường phải sử dụng phiên bản UTAUT2 bổ sung biến động lực giải trí và giá trị chi phí."
    },
    'porter-five-forces-analysis': {
        overview: "Mô hình 5 Áp lực Cạnh tranh của Michael Porter (1979) là khung lý thuyết phân tích cấu trúc của một ngành kinh tế. Mô hình định đề rằng mức độ hấp dẫn và khả năng sinh lời dài hạn của một ngành không chỉ phụ thuộc vào các đối thủ hiện hữu mà còn bị chi phối bởi bốn áp lực bên ngoài.",
        constructs: [
            { name: "Threat of New Entrants (Đe dọa từ đối thủ mới tiềm ẩn)", desc: "Xác suất xuất hiện các đối thủ mới, thường bị chi phối bởi các rào cản gia nhập như yêu cầu vốn, bản quyền hoặc lợi thế quy mô." },
            { name: "Bargaining Power of Suppliers (Quyền lực thương lượng của nhà cung cấp)", desc: "Mức độ kiểm soát của nhà cung cấp đối với giá cả đầu vào, liên quan đến tính tập trung của nhà cung cấp hoặc chi phí chuyển đổi." },
            { name: "Bargaining Power of Buyers (Quyền lực thương lượng của khách hàng)", desc: "Khả năng khách hàng tạo áp lực giảm giá, tùy thuộc vào số lượng người mua, quy mô đơn hàng hoặc tính tiêu chuẩn hóa của sản phẩm." },
            { name: "Threat of Substitutes (Đe dọa từ sản phẩm thay thế)", desc: "Sự hiện diện của các sản phẩm hoặc dịch vụ bên ngoài ngành có khả năng đáp ứng cùng một nhu cầu của khách hàng." },
            { name: "Industry Rivalry (Cạnh tranh nội bộ ngành)", desc: "Mức độ cạnh tranh giữa các doanh nghiệp hiện tại, đo lường qua số lượng đối thủ và tốc độ tăng trưởng của ngành." }
        ],
        application: "Mô hình thường được sử dụng trong các nghiên cứu phân tích môi trường kinh doanh và hoạch định chiến lược doanh nghiệp trước khi quyết định thâm nhập thị trường mới.",
        limitations: "Mô hình mang tính tĩnh (static) và có phần hạn chế trong việc phân tích các thị trường kỹ thuật số hiện đại, nơi hệ sinh thái kinh doanh vận hành theo tính chất nền tảng đa cực (platform economics)."
    },
    'vrio-framework-strategy': {
        overview: "Khung VRIO, phát triển từ Quan điểm Dựa trên Nguồn lực (Resource-Based View) của Barney (1991), tập trung vào phân tích nội bộ doanh nghiệp. Khung lý thuyết này đánh giá mức độ tiềm năng của các nguồn lực và năng lực cốt lõi nhằm xác định liệu chúng có khả năng tạo ra lợi thế cạnh tranh bền vững hay không.",
        constructs: [
            { name: "Value (Tính giá trị)", desc: "Khả năng của nguồn lực trong việc giúp tổ chức khai thác cơ hội kinh doanh hoặc vô hiệu hóa các mối đe dọa từ môi trường bên ngoài." },
            { name: "Rarity (Tính khan hiếm)", desc: "Mức độ phổ biến của nguồn lực trên thị trường. Nếu một nguồn lực giá trị bị sở hữu bởi nhiều bên, nó chỉ đem lại sự cân bằng cạnh tranh." },
            { name: "Imitability (Tính khó bắt chước)", desc: "Mức độ khó khăn hoặc chi phí mà đối thủ cạnh tranh phải đối mặt nếu muốn sao chép hoặc phát triển nguồn lực tương đương." },
            { name: "Organization (Khả năng tổ chức)", desc: "Sự sẵn sàng của hệ thống quản lý, quy trình và văn hóa doanh nghiệp nhằm khai thác tối đa tiềm năng của nguồn lực." }
        ],
        application: "VRIO được sử dụng phổ biến trong các nghiên cứu về quản trị chiến lược nội bộ, phân tích lợi thế khác biệt của tài sản vô hình (ví dụ: văn hóa doanh nghiệp, bằng sáng chế).",
        limitations: "Định nghĩa về nguồn lực khá trừu tượng, dẫn đến khó khăn trong việc đo lường định lượng. Hơn nữa, môi trường công nghệ thay đổi nhanh chóng có thể làm giảm tính 'khó bắt chước' của các nguồn lực truyền thống."
    },
    'expectation-confirmation-theory-ect': {
        overview: "Thuyết Kỳ vọng - Xác nhận (Expectation-Confirmation Theory - ECT) do Oliver (1980) đề xuất, là một khung lý thuyết giải thích sự hình thành sự hài lòng của người tiêu dùng và ý định tái mua hàng. ECT nhấn mạnh vai trò của quá trình so sánh nhận thức sau khi tiêu dùng sản phẩm/dịch vụ.",
        constructs: [
            { name: "Expectation (Kỳ vọng)", desc: "Mức độ mong đợi của cá nhân về hiệu năng của sản phẩm hoặc dịch vụ trước khi trực tiếp sử dụng." },
            { name: "Perceived Performance (Hiệu năng cảm nhận)", desc: "Đánh giá chủ quan của người tiêu dùng về hiệu suất thực tế của sản phẩm/dịch vụ trong hoặc sau quá trình sử dụng." },
            { name: "Confirmation (Sự xác nhận)", desc: "Khoảng cách giữa hiệu năng cảm nhận và kỳ vọng ban đầu. Xác nhận tích cực xảy ra khi hiệu năng vượt kỳ vọng." },
            { name: "Satisfaction (Sự hài lòng)", desc: "Trạng thái cảm xúc hoặc đánh giá tổng thể phát sinh từ quá trình xác nhận, đóng vai trò quyết định ý định hành vi trong tương lai." }
        ],
        application: "ECT thường được sử dụng trong các nghiên cứu về lòng trung thành khách hàng, ý định duy trì sử dụng (continuance intention) đối với phần mềm dịch vụ (SaaS) và các ứng dụng thương mại điện tử.",
        limitations: "Mô hình ít xem xét các yếu tố biến động về kỳ vọng theo thời gian. Sự đo lường phụ thuộc vào trí nhớ hồi tố (retrospective memory), có thể gây ra sai lệch trong việc khách hàng tái hiện lại kỳ vọng ban đầu của họ."
    },
    'perceived-value-marketing-strategy': {
        overview: "Mô hình Giá trị Cảm nhận (Perceived Value) là một lý thuyết nền tảng trong marketing. Theo Zeithaml (1988), giá trị cảm nhận là đánh giá tổng thể của người tiêu dùng về tiện ích của sản phẩm dựa trên nhận thức về sự cân đối giữa những gì họ nhận được (lợi ích) và những gì họ phải đánh đổi (chi phí).",
        constructs: [
            { name: "Functional Value (Giá trị công năng)", desc: "Tiện ích nhận được từ chất lượng thực tế, hiệu suất và độ tin cậy của sản phẩm." },
            { name: "Emotional Value (Giá trị cảm xúc)", desc: "Lợi ích tâm lý và cảm xúc phát sinh trong quá trình tiêu dùng." },
            { name: "Social Value (Giá trị xã hội)", desc: "Tiện ích liên quan đến sự gia tăng hình ảnh bản thân hoặc vị thế trong một nhóm xã hội nhất định khi sử dụng sản phẩm." },
            { name: "Epistemic/Conditional Value (Giá trị tri thức/hoàn cảnh)", desc: "Tiện ích xuất phát từ sự mới mẻ của sản phẩm hoặc tính phù hợp trong một hoàn cảnh đặc thù." }
        ],
        application: "Giá trị cảm nhận thường đóng vai trò là biến trung gian trong các mô hình nghiên cứu giải thích ý định mua sản phẩm xanh (green products), hàng hóa xa xỉ, hoặc dịch vụ có mức độ tùy chỉnh cao.",
        limitations: "Các chiều kích của giá trị thường tương quan chặt chẽ với nhau, có thể gây ra hiện tượng đa cộng tuyến trong phân tích hồi quy. Ngoài ra, giá trị cảm nhận mang tính cá nhân cao, gây khó khăn cho việc khái quát hóa kết quả."
    },
    'tce-transaction-cost-economics-strategy': {
        overview: "Kinh tế học Chi phí Giao dịch (TCE) là lý thuyết tổ chức nhằm giải thích các quyết định biên giới của doanh nghiệp (tự làm hay thuê ngoài). TCE cho rằng các giao dịch kinh tế luôn đi kèm với những chi phí ma sát (tìm kiếm, đàm phán, thực thi) và doanh nghiệp sẽ lựa chọn hình thức quản trị (thị trường hoặc nội bộ) nhằm tối thiểu hóa các chi phí này.",
        constructs: [
            { name: "Bounded Rationality (Tính hợp lý giới hạn)", desc: "Giả định rằng con người có giới hạn về nhận thức và thông tin, không thể lường trước mọi tình huống trong một hợp đồng." },
            { name: "Opportunism (Chủ nghĩa cơ hội)", desc: "Hành vi tìm kiếm lợi ích cá nhân bằng các biện pháp không minh bạch hoặc vi phạm cam kết." },
            { name: "Asset Specificity (Tính đặc thù của tài sản)", desc: "Mức độ một khoản đầu tư hoặc kỹ năng chỉ có giá trị cao trong một giao dịch cụ thể, và mất giá trị khi chuyển đổi sang mục đích khác." },
            { name: "Uncertainty & Frequency (Tính bất định và Tần suất)", desc: "Sự thay đổi của môi trường giao dịch và số lần giao dịch lặp lại giữa các bên." }
        ],
        application: "TCE là cơ sở lý thuyết chuẩn mực trong các nghiên cứu quản trị chuỗi cung ứng, sáp nhập và mua lại (M&A), và quan hệ đối tác B2B (Business-to-Business).",
        limitations: "TCE có xu hướng nhấn mạnh quá mức vào các khía cạnh tiêu cực (chủ nghĩa cơ hội) mà ít chú trọng đến vai trò của sự tin tưởng (trust) và các chuẩn mực xã hội trong việc duy trì quan hệ hợp tác."
    }
};

const defaultOverview = "Đây là tài liệu hướng dẫn kỹ thuật áp dụng mô hình phân tích định lượng. Nội dung tập trung vào các bước chuẩn bị, xử lý dữ liệu thực nghiệm và diễn giải kết quả dựa trên các tiêu chuẩn thống kê.";
const defaultConstructs = [
    { name: "Quy trình thiết lập (Setup Phase)", desc: "Bước làm sạch dữ liệu, kiểm định các giả định phân phối chuẩn, và xử lý các giá trị ngoại lai (outliers)." },
    { name: "Thực thi phân tích (Execution Phase)", desc: "Chạy các thuật toán ước lượng trên phần mềm thống kê để đánh giá độ phù hợp của mô hình đo lường và cấu trúc." },
    { name: "Diễn giải kết quả (Interpretation)", desc: "Báo cáo các chỉ số thống kê (P-value, hệ số Beta, T-statistics) theo tiêu chuẩn định dạng hàn lâm (ví dụ: định dạng APA)." }
];

const articleRegex = /slug:\s*'([^']+)'/g;
let match;
const slugs = [];
while ((match = articleRegex.exec(content)) !== null) {
    slugs.push(match[1]);
}

const generateNewFile = () => {
    const { STATIC_ARTICLES } = require('./lib/constants/articles-fallback.ts');
    let output = "export const STATIC_ARTICLES = [\n";
    
    STATIC_ARTICLES.forEach(a => {
        const data = deepData[a.slug] || {
            overview: defaultOverview,
            constructs: defaultConstructs,
            application: "Quy trình phân tích này được ứng dụng rộng rãi trong việc kiểm định giả thuyết khoa học, giúp nhà nghiên cứu chứng minh tính hợp lệ của mô hình lý thuyết.",
            limitations: "Độ chính xác của kết quả phụ thuộc hoàn toàn vào chất lượng dữ liệu đầu vào và việc tuân thủ các giả định thống kê nghiêm ngặt của thuật toán."
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
    console.log("SUCCESSFULLY OVERWRITTEN articles-fallback.ts with neutral tone.");
};

generateNewFile();
