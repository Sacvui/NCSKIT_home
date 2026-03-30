// i18n translations for ncsStat
// Supports Vietnamese (vi) and English (en)

export type Locale = 'vi' | 'en';

export const translations = {
    vi: {
        // Header
        nav: {
            analyze: 'Thống kê & Phân tích',
            analyze1: 'Phân tích Sơ bộ & Đo lường',
            analyze2: 'Mô hình Cấu trúc & Giả thuyết',
            research_model: 'Thang đo & Mô hình',
            docs: 'Tài liệu hướng dẫn',
            theory: 'Lý thuyết Thống kê',
            casestudy: 'Kịch bản Nghiên cứu',
            userguide: 'Hướng dẫn Sử dụng',
            profile: 'Hồ sơ',
            login: 'Đăng nhập',
            logout: 'Đăng xuất'
        },
        // Status labels
        status: {
            available: 'Sẵn sàng',
            coming: 'Sắp ra mắt'
        },
        // Beta warning
        beta: {
            warning: 'Hệ thống đang trong giai đoạn thử nghiệm (Beta). Vui lòng kiểm tra lại kết quả trước khi sử dụng cho các công bố chính thức.',
            learnMore: 'Xem miễn trừ trách nhiệm'
        },
        // Hero Section
        hero: {
            badge: 'V1.2.0: Beta Version',
            title: 'Giải pháp Thống kê',
            subtitle: 'Chuẩn khoa học cho Nghiên cứu sinh',
            description: 'Nền tảng phân tích dữ liệu chuyên sâu, tích hợp R-Engine mạnh mẽ và Trợ lý AI. Chính xác tuyệt đối, bảo mật tối đa, không cần cài đặt.',
            cta: 'Bắt đầu Nghiên cứu',
            learn: 'Quy trình hoạt động'
        },
        // PLS-SEM Banner (New)
        plssem: {
            badge: 'BETA WORKFLOW',
            title: 'Tiến trình PLS-SEM',
            description: 'Quy trình phân tích chuyên nghiệp: Làm sạch - Kiểm định - Mô hình - Đào sâu',
            cta: 'Thử ngay',
            methods: {
                omega: "McDonald's Omega",
                htmt: 'Ma trận HTMT',
                bootstrap: 'Bootstrapping',
                ipma: 'Phân tích IPMA'
            }
        },
        // Workflow (New)
        workflow: {
            title: 'Quy trình 4 Bước Tiêu chuẩn',
            step1: {
                title: 'Tải dữ liệu',
                desc: 'Hỗ trợ định dạng Excel/CSV. Hệ thống tự động kiểm tra cấu trúc.'
            },
            step2: {
                title: 'Kiểm tra & Làm sạch',
                desc: 'Tự động phát hiện giá trị lỗi, outlier và đánh giá chất lượng dữ liệu trước khi xử lý.'
            },
            step3: {
                title: 'Chọn kiểm định',
                desc: 'Menu phân tích trực quan, đầy đủ các phương pháp từ EFA, CFA đến mô hình SEM.'
            },
            step4: {
                title: 'Nhận báo cáo',
                desc: 'Kết quả chi tiết chuẩn APA, biểu đồ chuyên nghiệp và được AI giải thích ý nghĩa.'
            }
        },
        // Features
        features: {
            speed: {
                title: 'Hiệu suất Vượt trội',
                desc: 'Vận hành trực tiếp trên trình duyệt với công nghệ WebAssembly tiên tiến. Tốc độ xử lý nhanh chóng, ổn định.'
            },
            ai: {
                title: 'Trợ lý Nghiên cứu AI',
                desc: 'Tự động phân tích và diễn giải kết quả số liệu. Phát hiện vấn đề và đề xuất giải pháp tối ưu cho bài nghiên cứu.'
            },
            security: {
                title: 'Bảo mật Cấp cao',
                desc: 'Kiến trúc Zero-Knowledge. Dữ liệu được xử lý cục bộ 100% tại thiết bị người dùng (Client-side), đảm bảo sự riêng tư tuyệt đối.'
            }
        },
        // Methods
        methods: {
            title: 'Hệ thống Phương pháp Phân tích',
            subtitle: 'Bộ công cụ toàn diện hỗ trợ đầy đủ các kiểm định thống kê cho Luận văn và Luận án Tiến sĩ.',
            reliability: 'Độ tin cậy thang đo',
            efa: 'Phân tích nhân tố EFA',
            cfa: 'Mô hình đo lường CFA',
            sem: 'Mô hình cấu trúc SEM',
            regression: 'Phân tích Hồi quy',
            comparison: 'Kiểm định so sánh',
            correlation: 'Phân tích Tương quan',
            nonparam: 'Phi tham số'
        },
        // Methods Guide Page
        methods_guide_page: {
            title: 'Hướng Dẫn Phương Pháp Thống Kê',
            desc: 'Tài liệu chi tiết về cách thực hiện và giải thích kết quả cho từng phương pháp phân tích trên hệ thống ncsStat.'
        },
        // Docs Overview Page
        docs_overview: {
            title: 'Trung tâm Hướng dẫn & Tài liệu',
            subtitle: 'Khám phá kiến thức thống kê, quy trình nghiên cứu chuẩn và hướng dẫn vận hành hệ thống ncsStat.',
            theory_desc: 'Hiểu về p-value, Cronbach Alpha và cách đọc kết quả chuẩn khoa học.',
            casestudy_desc: 'Quy trình 5 bước thực hiện một bài nghiên cứu định lượng chuẩn công bố.',
            userguide_desc: 'Hướng dẫn chi tiết cách sử dụng các tính năng phân tích trên ncsStat.',
            cta: 'Khám phá ngay',
            why_title: 'Tại sao tài liệu này quan trọng?',
            reason1_title: 'Đảm bảo tính khoa học',
            reason1_desc: 'Giúp bạn hiểu bản chất của các con số thay vì chỉ chạy tính toán một cách máy móc.',
            reason2_title: 'Chuẩn hóa quy trình',
            reason2_desc: 'Cung cấp luồng xử lý chuẩn từ khâu làm sạch đến khâu báo cáo, hạn chế sai sót trong Luận văn/ Luận án.'
        },
        // Docs Specific Labels
        docs_theory_labels: {
            sig95: 'Ý nghĩa 95%',
            sig99: 'Ý nghĩa 99%',
            sig999: 'Ý nghĩa 99.9%',
            predictive_accuracy: 'Độ chính xác dự báo',
            effect_size: 'Kích thước tác động',
            predictive_relevance: 'Năng lực dự báo',
            mediation_analysis: 'Phân tích trung gian',
            bootstrapping_info: 'Bootstrapping (5000 lần lặp)'
        },
        docs_casestudy_labels: {
            mean_sd: 'Trung bình & Độ lệch chuẩn',
            freq_table: 'Bảng tần số',
            demo_plot: 'Đồ thị nhân khẩu học',
            hypothesis_example: 'H1: Hữu ích -> Ý định',
            result_stat: 'Beta = 0.45; p < 0.001'
        },
        docs_userguide_labels: {
            selecting_title: 'Cách chọn biến',
            selecting_desc: 'Giữ phím Shift hoặc Ctrl để chọn nhiều biến cùng lúc trong các bảng menu.',
            apa_title: 'Kết quả chuẩn APA',
            apa_desc: 'Hệ thống tự động định dạng bảng biểu và biểu đồ theo đúng chuẩn APA mới nhất.',
            support_title: 'Hỗ trợ 24/7',
            support_desc: 'Tham gia cộng đồng ncsStat để được giải đáp các thắc mắc về phương pháp xử lý.',
            procedure_title: 'Quy trình thực hiện',
            output_title: 'Đầu ra tiêu chuẩn'
        },
        // Footer
        footer: {
            terms: 'Điều khoản sử dụng',
            privacy: 'Chính sách bảo mật',
            docs: 'Tài liệu hướng dẫn',
            status: 'Trạng thái hệ thống',
            operational: 'Đang hoạt động tốt',
            resources: 'Resources',
            system: 'System',
            disclaimer: 'Disclaimer (Beta)',
            aboutTitle: 'About ncsStat Project',
            aboutDesc: 'ncsStat is a specialized platform supporting data processing for Doctoral candidates. We focus on the accuracy of R algorithms and user interface convenience. The system is currently in Beta and is continuously improved based on feedback from the scientific community. Our goal is to accompany you on the path to conquering international publications.'
        },
        // Analyze Page
        analyze: {
            steps: {
                upload: 'Dữ liệu',
                profile: 'Kiểm tra',
                analyze: 'Phân tích',
                results: 'Kết quả'
            },
            upload: {
                title: 'Tải lên dữ liệu nghiên cứu',
                desc: 'Hỗ trợ định dạng chuẩn .csv, .xlsx và .xls',
                dropzone: 'Kéo thả file vào đây hoặc click để chọn file',
                orClick: 'hoặc click để chọn file (CSV, Excel)',
                processing: 'Đang xử lý...',
                sampleData: 'Dùng thử dữ liệu mẫu (N=300)',
                testData: 'Test SEM/CFA (N=500, 8 constructs)',
                errorEmpty: 'File trống hoặc không hợp lệ',
                errorFormat: 'Chỉ hỗ trợ file .csv, .xlsx, .xls',
                errorRead: 'Lỗi đọc file',
                errorSample: 'Không tìm thấy file mẫu'
            },
            profile: {
                title: 'Báo cáo chất lượng dữ liệu',
                desc: 'Kiểm tra và xác nhận dữ liệu trước khi phân tích',
                proceed: 'Tiếp tục phân tích',
                summary: {
                    rows: 'Tổng số dòng',
                    cols: 'Số cột',
                    issues: 'Vấn đề phát hiện'
                },
                issues: {
                    title: 'Vấn Đề Chất Lượng Dữ Liệu',
                    allData: 'Toàn bộ dữ liệu',
                    countLabel: 'giá trị/dòng'
                },
                table: {
                    title: 'Thống Kê Từng Cột',
                    colName: 'Tên cột',
                    type: 'Loại',
                    missing: 'Thiếu',
                    mean: 'Mean',
                    sd: 'SD',
                    min: 'Min',
                    max: 'Max'
                }
            },
            selector: {
                title: 'Chọn phương pháp phân tích',
                desc: 'Chọn phương pháp phù hợp với mục tiêu nghiên cứu'
            },
            results: {
                title: 'Kết quả phân tích',
                back: 'Phân tích khác',
                exportPdf: 'Xuất PDF',
                exportWord: 'Xuất Word',
                newAnalysis: 'Tải file mới'
            },
            common: {
                back: 'Quay lại',
                continue: 'Tiếp tục',
                processing: 'Đang xử lý...',
                analyzing: 'Đang phân tích...',
                security: 'Dữ liệu được xử lý cục bộ 100% (Client-side), đảm bảo bảo mật tuyệt đối.'
            }
        },
        // PLS-SEM Workflow Pages
        pls_workflow: {
            title: 'Tiến trình PLS-SEM',
            security: 'Bảo mật dữ liệu nghiên cứu: 100% Client-side.',
            phases: {
                phase1: {
                    title: 'Sơ chế & Độ tin cậy',
                    desc: 'Làm sạch dữ liệu và kiểm tra độ tin cậy thang đo (The Foundation)'
                },
                phase2: {
                    title: 'Kiểm định thang đo',
                    desc: 'Đánh giá giá trị hội tụ và phân biệt (Measurement Validation)'
                },
                phase3: {
                    title: 'Mô hình cấu trúc',
                    desc: 'Kiểm định giả thuyết và các tác động (Structural Model)'
                },
                phase4: {
                    title: 'Phân tích nâng cao',
                    desc: 'Đào sâu kết quả nghiên cứu (Advanced Analysis)'
                }
            }
        },
        // Results Tables (Bilingual)
        tables: {
            variable: 'Biến (Variable)',
            mean: 'Trung bình (Mean)',
            sd: 'Độ lệch chuẩn (SD)',
            min: 'Nhỏ nhất (Min)',
            max: 'Lớn nhất (Max)',
            skew: 'Độ lệch (Skewness)',
            kurtosis: 'Độ nhọn (Kurtosis)',
            n: 'Cỡ mẫu (N)',
            sig: 'Mức ý nghĩa (Sig.)',
            model: 'Mô hình (Model)',
            coefficients: 'Hệ số hồi quy (Coefficients)',
            summary: 'Tóm tắt mô hình (Model Summary)',
            anova: 'Phân tích phương sai (ANOVA)',
            correlations: 'Ma trận tương quan (Correlations)',
            reliability: 'Thống kê độ tin cậy (Reliability Statistics)',
            itemTotal: 'Thống kê biến tổng (Item-Total Statistics)',
            alpha: "Cronbach's Alpha",
            standardized: 'Chuẩn hóa (Standardized)',
            unstandardized: 'Chưa chuẩn hóa (Unstandardized)',
            tolerance: 'Dung sai (Tolerance)',
            vif: 'Hệ hệ VIF',
            source: 'Nguồn biến thiên (Source)'
        },
        // Scale Hub
        scales: {
            title: 'Thư viện Thang đo Chuẩn hóa',
            subtitle: 'Kho lưu trữ các bộ câu hỏi nghiên cứu đã được kiểm định và dịch thuật chuẩn xác.',
            searchPlaceholder: 'Tìm kiếm bộ thang đo (Ví dụ: TAM, SERVQUAL...)',
            categories: 'Chuyên ngành',
            economics: 'Kinh tế',
            marketing: 'Marketing',
            hr: 'Nhân sự',
            logistics: 'Logistics & SCM',
            mis: 'MIS & Kỹ thuật số',
            accounting: 'Kế toán & Kiểm toán',
            innovation: 'Đổi mới & Chiến lược',
            tourism: 'Du lịch & Khách sạn',
            'modern (2020+)': 'Nghiên cứu Hiện đại (2020+)',
            author: 'Tác giả',
            year: 'Năm',
            items: 'Số câu hỏi',
            citation: 'Trích dẫn',
            viewItems: 'Xem chi tiết câu hỏi',
            exportTemplate: 'Xuất File mẫu Excel',
            comingSoon: 'Sắp ra mắt',
            advisor: {
                title: 'Trình Cố vấn Nghiên cứu',
                subtitle: 'Để hệ thống gợi ý lý thuyết phù hợp cho bạn:',
                q1: 'Mục tiêu nghiên cứu của bạn là gì?',
                q2: 'Đối tượng bạn muốn tác động là ai?',
                opt1: 'Đo lường sự chấp nhận/hành vi mới',
                opt2: 'Đánh giá chất lượng/hiệu quả dịch vụ',
                opt3: 'Phân tích nhân sự/tổ chức/lãnh đạo',
                opt4: 'Hệ thống/Quản trị Logistics & MIS',
                modern: 'Nghiên cứu Hiện đại (AI/Digital/Hybrid)',
                resultText: 'Dựa trên mục tiêu của bạn, chúng tôi đề xuất:',
                loginRequired: 'Vui lòng đăng nhập để xem chi tiết câu hỏi'
            }
        },
        // Docs Page
        docs: {
            tabs: {
                theory: 'Lý thuyết Thống kê',
                casestudy: 'Kịch bản Nghiên cứu',
                userguide: 'Hướng dẫn Sử dụng'
            },
            theory: {
                title: 'Nền tảng Thống kê và Giải thích Kết quả',
                subtitle: 'Phân tích sâu các khái niệm then chốt nhằm hỗ trợ diễn giải dữ liệu khoa học.'
            },
            casestudy: {
                title: 'Quy trình Nghiên cứu và Công bố Quốc tế',
                subtitle: 'Hướng dẫn phối hợp các phương pháp phân tích để hoàn thiện bài nghiên cứu chuẩn APA.'
            },
            userguide: {
                title: 'Hướng dẫn Vận hành Hệ thống ncsStat',
                subtitle: 'Các bước thao tác chi tiết cho từng tính năng phân tích và xử lý dữ liệu.'
            },
            casestudy_content: {
                model_badge: 'Mô hình Kinh tế',
                scenario_title: 'Kịch bản: Các yếu tố ảnh hưởng đến Ý định sử dụng Ngân hàng số',
                scenario_desc: 'Nghiên cứu này vận dụng mô hình chấp nhận công nghệ (TAM) kết hợp với các yếu tố Niềm tin và Rủi ro cảm nhận để giải thích hành vi người tiêu dùng trong lĩnh vực tài chính tại Việt Nam.',
                stats: {
                    sample: '320 Mẫu định lượng',
                    scale: 'Thang đo Likert 5 điểm',
                    analysis: 'Phân tích PLS-SEM'
                },
                phase1: {
                    title: 'Giai đoạn 1: Sơ chế và Thống kê mô tả',
                    desc: 'Kiểm tra ngoại lệ (Outliers) và sự thiếu hụt dữ liệu (Missing Values). Trình bày cơ mẫu về độ tuổi, thu nhập và trình độ học vấn.',
                    report_label: 'Chỉ số báo cáo chính:'
                },
                phase2: {
                    title: 'Giai đoạn 2: Đánh giá độ tin cậy và Kiểm định hội tụ',
                    desc: "Chạy Cronbach's Alpha và C.R cho từng nhân tố (Cảm nhận hữu ích, Rủi ro...). Kiểm tra hệ số tải ngoài (Outer Loadings) để đảm bảo các biến quan sát đo lường đúng khái niệm.",
                    pass: 'Đạt yêu cầu:',
                    note: 'Lưu ý loại biến:',
                    note_desc: 'Loại bỏ các item có hệ số tải < 0.40 hoặc ảnh hưởng xấu đến AVE.'
                },
                phase3: {
                    title: 'Giai đoạn 3: Kiểm định tính phân biệt (HTMT)',
                    desc: 'Chứng minh các khái niệm nghiên cứu không bị chồng lấn. Sử dụng ma trận HTMT (Heterotrait-Monotrait Ratio).',
                    example: '"Chỉ số HTMT giữa Cảm nhận rủi ro và Ý định sử dụng đạt 0.76 (dưới ngưỡng 0.85), khẳng định tính phân biệt giữa hai khái niệm này."'
                },
                phase4: {
                    title: 'Giai đoạn 4: Kiểm định Giả thuyết và Phân tích Cấu trúc',
                    desc: 'Phân tích Path Coefficients thông qua kỹ thuật Bootstrapping (5000 lần lặp). Kiểm tra R-square để đánh giá mức độ giải thích của mô hình.',
                    hypothesis: 'Kỳ vọng kết quả (Hypothesis):',
                    supported: 'Chấp nhận giả thuyết (Supported)',
                    explanation_power: 'Năng lực giải thích:',
                    explanation_desc: 'Biến thiên của Ý định sử dụng được giải thích bởi mô hình.'
                },
                tips: {
                    title: 'Hướng dẫn trình bày trong Luận văn / Bài báo',
                    tip1: 'Trình bày kết quả đánh giá mô hình đo lường trước (Độ tin cậy, Giá trị hội tụ, Giá trị phân biệt), sau đó mới trình bày kết quả mô hình cấu trúc.',
                    tip2: 'Sử dụng đồ thị Path Diagram xuất ra từ hệ thống ncsStat để minh họa trực quan các hệ số tác động và mức ý nghĩa.',
                    tip3: 'Đối với các biến trung gian, hãy báo cáo cụ thể Tác động trực tiếp (Direct Effect), Tác động gián tiếp (Indirect Effect) và Tổng tác động (Total Effect).'
                }
            },
            theory_content: {
                measurement_title: '1. Đánh giá Mô hình đo lường (Measurement Model)',
                reliability_title: 'Độ tin cậy nhất quán nội tại',
                reliability_desc: "Sử dụng hệ số Cronbach's Alpha và C.R (Composite Reliability). Trong các nghiên cứu hiện đại, C.R được ưu tiên vì không bị ảnh hưởng bởi số lượng câu hỏi.",
                convergent_title: 'Giá trị hội tụ (AVE)',
                convergent_desc: 'AVE (Average Variance Extracted) đo lường mức độ biến thiên mà nhân tố giải thích được từ các biến quan sát. AVE thấp cho thấy các câu hỏi chưa phản ánh tốt nhân tố.',
                threshold: 'Ngưỡng chấp nhận:',
                discriminant_title: 'Giá trị phân biệt (Discriminant Validity)',
                htmt_title: 'Chỉ số HTMT (Heterotrait-Monotrait)',
                htmt_desc: 'Tiêu chuẩn nghiêm ngặt nhất hiện nay. Đo lường tỷ lệ tương quan giữa các nhân tố so với tương quan nội bộ.',
                htmt_threshold: 'Đạt: HTMT < 0.85 hoặc 0.90',
                fornell_title: 'Fornell-Larcker Criterion',
                fornell_desc: 'Căn bậc hai của AVE của mỗi nhân tố phải lớn hơn tương quan giữa nhân tố đó với bất kỳ nhân tố nào khác.',
                structural_title: '2. Đánh giá Mô hình cấu trúc (Structural Model)',
                rsquare_title: 'R-Square (R²)',
                rsquare_desc: 'Đo lường năng lực giải thích của mô hình. Trong khoa học xã hội, R² trên 0.26 được coi là mức ảnh hưởng lớn.',
                fsquare_title: 'f-Square (f²)',
                fsquare_desc: 'Kích thước tác động. Giúp xác định vai trò của từng biến độc lập trong việc đóng góp vào R² của biến phụ thuộc.',
                qsquare_title: 'Q-Square (Q²)',
                qsquare_desc: 'Khả năng dự báo ngoài mẫu (Predictive Relevance). Được tính toán thông qua kỹ thuật Blindfolding.',
                mediation_title: 'Tác động Gián tiếp và Trung gian',
                mediation_desc: 'Hệ thống ncsStat hỗ trợ kiểm định trung gian thông qua phương pháp Bootstrapping. Để kết luận về biến trung gian, cần kiểm tra khoảng tin cậy (Confidence Interval). Nếu khoảng tin cậy không chứa giá trị 0, tác động trung gian có ý nghĩa thống kê.',
                sig_title: 'Mức ý nghĩa thống kê (Sig.)',
                sig_desc: 'p-value xác định xác suất của một phát hiện đạt được là do ngẫu nhiên. Trong nghiên cứu kinh tế - xã hội, ngưỡng phổ biến là 5%.',
                beta_title: 'Hệ số Beta (Path Coefficients)',
                beta_desc: 'Biểu thị mức độ thay đổi của biến phụ thuộc khi biến độc lập thay đổi một đơn vị. Beta có thể đạt giá trị dương (+) hoặc âm (-).',
                beta_pos: 'Beta dương: Tác động cùng chiều (A tăng dẫn đến B tăng).',
                beta_neg: 'Beta âm: Tác động ngược chiều (A tăng dẫn đến B giảm).',
                beta_std: 'Beta chuẩn hóa: Dùng để so sánh cường độ tác động giữa các biến khác đơn vị đo.',
                cta_title: 'Kiến thức là nền tảng của công bố',
                cta_desc: 'Việc hiểu sâu các chỉ số trên không chỉ giúp bài nghiên cứu của bạn vượt qua vòng thẩm định mà còn khẳng định uy tín khoa học của nhà nghiên cứu.',
                cta_button: 'Xem Kịch bản Nghiên cứu'
            },
            methods_guide: {
                title: 'Hướng dẫn Phương pháp Thống kê',
                select: 'Chọn một phương pháp để xem hướng dẫn chi tiết',
                cta: 'Thực hiện ngay',
                descriptive: {
                    name: 'Thống Kê Mô Tả',
                    desc: 'Tóm tắt đặc điểm dữ liệu (Mean, SD, Skewness...)',
                    purpose: 'Tóm tắt các đặc điểm cơ bản của dữ liệu như Trung bình, Trung vị, Độ lệch chuẩn, Min, Max, Skewness, Kurtosis.',
                    stepTitle: 'Cách thực hiện:',
                    whenToUse: 'Luôn thực hiện đầu tiên để kiểm tra phân phối và các giá trị bất thường.',
                    steps: [
                        'Chọn menu Descriptive.',
                        'Chọn các biến định lượng cần tính toán.',
                        'Nhấn nút Chạy Phân Tích.'
                    ],
                    output: ['Trung bình, SD, Min, Max', 'Skewness & Kurtosis']
                },
                cronbach: {
                    name: "Cronbach's Alpha",
                    desc: 'Kiểm định độ tin cậy thang đo',
                    purpose: 'Đánh giá mức độ chặt chẽ mà các các mục hỏi (items) trong thang đo tương quan với nhau (Internal Consistency).',
                    stepTitle: 'Cách thực hiện:',
                    whenToUse: 'Kiểm tra chất lượng thang đo trước khi phân tích nhân tố.',
                    steps: [
                        "Chọn menu Cronbach's Alpha.",
                        'Chọn tất cả các biến quan sát thuộc cùng một nhân tố.',
                        'Nhấn nút Chạy Phân Tích.'
                    ],
                    note: "Kết quả sẽ hiển thị hệ số Cronbach's Alpha tổng và bảng Cronbach's Alpha if Item Deleted giúp bạn loại biến rác.",
                    output: ['Hệ số Alpha', 'Cronbach Alpha if item deleted']
                },
                efa: {
                    name: 'Phân tích EFA',
                    desc: 'Phân tích nhân tố khám phá',
                    purpose: 'Rút gọn một tập hợp nhiều biến quan sát thành một số ít các nhân tố có ý nghĩa.',
                    stepTitle: 'Cách thực hiện:',
                    whenToUse: 'Khám phá cấu trúc của thang đo hoặc rút gọn dữ liệu.',
                    steps: [
                        'Chọn menu EFA.',
                        'Chọn tất cả các biến quan sát trong mô hình.',
                        'Điều chỉnh (nếu cần): Số nhân tố, Phép quay.',
                        'Nhấn nút Chạy EFA.'
                    ],
                    output: ['KMO & Bartlett', 'Ma trận xoay nhân tố']
                },
                ttest: {
                    name: 'Kiểm định T-Test',
                    desc: 'So sánh trung bình 2 nhóm',
                    purpose: 'So sánh xem có sự khác biệt có ý nghĩa thống kê về giá trị trung bình giữa hai nhóm độc lập hay không.',
                    stepTitle: 'Cách thực hiện:',
                    steps: [
                        'Chọn menu T-Test.',
                        'Chọn biến phân nhóm (Ví dụ: Giới tính).',
                        'Chọn biến cần so sánh (Ví dụ: Thu nhập).',
                        'Nhấn nút Chạy T-Test.'
                    ]
                },
                anova: {
                    name: 'Kiểm định ANOVA',
                    desc: 'So sánh 3 nhóm trở lên',
                    purpose: 'Kiểm định sự khác biệt về trung bình giữa 3 nhóm trở lên (One-Way ANOVA).',
                    stepTitle: 'Cách thực hiện:',
                    steps: [
                        'Chọn menu ANOVA.',
                        'Chọn biến phân nhóm (Factor) có từ 3 giá trị trở lên (Ví dụ: Học vấn).',
                        'Chọn biến phụ thuộc (Dependent).',
                        'Nhấn nút Chạy ANOVA.'
                    ]
                },
                correlation: {
                    name: 'Phân tích Tương Quan',
                    desc: 'Pearson Correlation',
                    purpose: 'Đánh giá mối quan hệ tuyến tính giữa hai biến định lượng.',
                    stepTitle: 'Cách thực hiện:',
                    steps: [
                        'Chọn menu Correlation.',
                        'Chọn các biến cần xem xét tương quan.',
                        'Nhấn nút Chạy Phân Tích.'
                    ]
                },
                regression: {
                    name: 'Phân tích Hồi Quy',
                    desc: 'Linear Regression',
                    purpose: 'Đánh giá tác động của một hoặc nhiều biến độc lập lên một biến phụ thuộc.',
                    stepTitle: 'Cách thực hiện:',
                    whenToUse: 'Kiểm tra mối quan hệ nhân quả trong mô hình nghiên cứu.',
                    steps: [
                        'Chọn menu Regression.',
                        'Chọn biến phụ thuộc (Y).',
                        'Chọn các biến độc lập (X).',
                        'Nhấn nút Chạy Hồi Quy.'
                    ],
                    note: 'Hệ thống sẽ tự động tính toán R-bình phương, hệ số Beta và kiểm tra đa cộng tuyến (VIF).',
                    output: ['R-Square (R2)', 'Hệ số Beta']
                },
                chisq: {
                    name: 'Kiểm định Chi-Square',
                    desc: 'Kiểm định biến định danh',
                    purpose: 'Kiểm tra mối liên hệ giữa hai biến định danh (Categorical Variables).',
                    stepTitle: 'Cách thực hiện:',
                    steps: [
                        'Chọn menu Chi-Square.',
                        'Chọn biến Hàng (Row Variable) và biến Cột (Column Variable).',
                        'Nhấn nút Chạy Kiểm Định.'
                    ]
                },
                nonparam: {
                    name: 'Kiểm định Phi tham số',
                    desc: 'Mann-Whitney / Kruskal-Wallis',
                    purpose: 'So sánh trung bình hạng khi dữ liệu không phân phối chuẩn (Thay thế cho T-Test/ANOVA).',
                    stepTitle: 'Cách thực hiện:',
                    steps: [
                        'Chọn menu Non-parametric.',
                        'Chọn các biến số cần so sánh và biến phân nhóm.',
                        'Nhấn nút Chạy Kiểm Định.'
                    ]
                }
            }
        },
    },
    en: {
        // Header
        nav: {
            analyze: 'Statistics & Analysis',
            analyze1: 'Preliminary & Measurement Analysis',
            analyze2: 'Structural & Hypothesis Analysis',
            research_model: 'Scales & Models',
            docs: 'Documentation',
            theory: 'Statistical Theory',
            casestudy: 'Research Scenarios',
            userguide: 'User Guide',
            profile: 'Profile',
            login: 'Login',
            logout: 'Logout'
        },
        // Status labels
        status: {
            available: 'Available',
            coming: 'Coming Soon'
        },
        // Beta warning
        beta: {
            warning: 'System is in Beta testing phase. Please verify results before using for official publications.',
            learnMore: 'View disclaimer'
        },
        // Hero Section
        hero: {
            badge: 'V1.2.0: Beta Version',
            title: 'Advanced Statistics',
            subtitle: 'Scientific Standard for Researchers',
            description: 'Professional data analysis platform powered by R-Engine and AI Assistant. Absolute accuracy, maximum security, zero installation.',
            cta: 'Start Researching',
            learn: 'How it works'
        },
        // PLS-SEM Banner (New)
        plssem: {
            badge: 'BETA WORKFLOW',
            title: 'PLS-SEM Workflow',
            description: 'Professional analysis workflow: Clean - Test - Model - Insights',
            cta: 'Try Now',
            methods: {
                omega: "McDonald's Omega",
                htmt: 'HTMT Matrix',
                bootstrap: 'Bootstrapping',
                ipma: 'IPMA Analysis'
            }
        },
        // Workflow (New)
        workflow: {
            title: 'Standard 4-Step Process',
            step1: {
                title: 'Import Data',
                desc: 'Support Excel/CSV formats. Automatic data structure validation.'
            },
            step2: {
                title: 'Review & Clean',
                desc: 'Auto-detect missing values, outliers, and assess data quality before processing.'
            },
            step3: {
                title: 'Select Analysis',
                desc: 'Intuitive menu covering all methods from EFA, CFA to complex SEM models.'
            },
            step4: {
                title: 'Get Report',
                desc: 'Detailed APA-standard results, professional charts, and AI-powered interpretation.'
            }
        },
        // Features
        features: {
            speed: {
                title: 'High Performance',
                desc: 'Runs directly in-browser via advanced WebAssembly technology. Fast, stable, and efficient processing.'
            },
            ai: {
                title: 'AI Research Assistant',
                desc: 'Automated analysis and interpretation of statistical results. Identifies issues and proposes optimal solutions.'
            },
            security: {
                title: 'High-Level Security',
                desc: 'Zero-Knowledge architecture. Data is processed 100% locally on your device (Client-side), ensuring absolute privacy.'
            }
        },
        // Methods
        methods: {
            title: 'Analysis Methodology System',
            subtitle: 'Comprehensive toolkit supporting all statistical tests for Theses and Dissertations.',
            reliability: 'Scale Reliability',
            efa: 'Exploratory EFA',
            cfa: 'Confirmatory CFA',
            sem: 'Structural SEM',
            regression: 'Regression Analysis',
            comparison: 'Hypothesis Testing',
            correlation: 'Correlation Analysis',
            nonparam: 'Non-parametric Tests'
        },
        // Methods Guide Page
        methods_guide_page: {
            title: 'Statistical Methods Guide',
            desc: 'Detailed documentation on procedures and results interpretation for each analysis method on the ncsStat system.'
        },
        // Docs Overview Page
        docs_overview: {
            title: 'Guidance & Documentation Center',
            subtitle: 'Explore statistical knowledge, standard research workflows, and ncsStat system operation guides.',
            theory_desc: 'Understand p-value, Cronbach Alpha, and how to interpret scientific results.',
            casestudy_desc: 'A 5-step process for conducting a publication-ready quantitative research paper.',
            userguide_desc: 'Detailed instructions on how to use all ncsStat analysis features.',
            cta: 'Explore now',
            why_title: 'Why is this documentation important?',
            reason1_title: 'Ensure Scientific Accuracy',
            reason1_desc: 'Helps you understand the nature of numbers rather than just running calculations mechanically.',
            reason2_title: 'Standardize Workflow',
            reason2_desc: 'Provides a standard processing flow from cleaning to reporting, reducing errors in Thesis/Dissertations.'
        },
        // Docs Specific Labels
        docs_theory_labels: {
            sig95: '95% Significance',
            sig99: '99% Significance',
            sig999: '99.9% Significance',
            predictive_accuracy: 'Predictive Accuracy',
            effect_size: 'Effect Size',
            predictive_relevance: 'Predictive Relevance',
            mediation_analysis: 'Mediation Analysis',
            bootstrapping_info: 'Bootstrapping (5000 samples)'
        },
        docs_casestudy_labels: {
            mean_sd: 'Mean & S.D',
            freq_table: 'Frequency Table',
            demo_plot: 'Demographics Plot',
            hypothesis_example: 'H1: Usefulness -> Intention',
            result_stat: 'Beta = 0.45; p < 0.001'
        },
        docs_userguide_labels: {
            selecting_title: 'Selecting Variables',
            selecting_desc: 'Hold Shift or Ctrl to select multiple variables at once in menu tables.',
            apa_title: 'APA Reporting',
            apa_desc: 'The system automatically formats tables and charts according to the latest APA standards.',
            support_title: 'Support',
            support_desc: 'Join the ncsStat community to have your data processing questions answered.',
            procedure_title: 'Operating Procedure',
            output_title: 'Standard Output'
        },
        // Footer
        footer: {
            terms: 'Terms of Service',
            privacy: 'Privacy Policy',
            docs: 'Documentation',
            status: 'System Status',
            operational: 'Operational',
            resources: 'Resources',
            system: 'System',
            disclaimer: 'Disclaimer (Beta)',
            aboutTitle: 'About ncsStat Project',
            aboutDesc: 'ncsStat is a specialized platform supporting data processing for Doctoral candidates. We focus on the accuracy of R algorithms and user interface convenience. The system is currently in Beta and is continuously improved based on feedback from the scientific community. Our goal is to accompany you on the path to conquering international publications.'
        },
        // Analyze Page
        analyze: {
            steps: {
                upload: 'Data Import',
                profile: 'Review',
                analyze: 'Analysis',
                results: 'Reporting'
            },
            upload: {
                title: 'Import your dataset',
                desc: 'Supports standard .csv, .xlsx and .xls formats',
                dropzone: 'Drag & drop your file here, or click to select',
                orClick: 'or click to select file (CSV, Excel)',
                processing: 'Processing...',
                sampleData: 'Try sample data (N=300)',
                testData: 'Test SEM/CFA (N=500, 8 constructs)',
                errorEmpty: 'File is empty or invalid',
                errorFormat: 'Only .csv, .xlsx, .xls supported',
                errorRead: 'Error reading file',
                errorSample: 'Sample file not found'
            },
            profile: {
                title: 'Data Quality Report',
                desc: 'Verify and confirm data before proceeding to analysis',
                proceed: 'Proceed to Analysis',
                summary: {
                    rows: 'Total Rows',
                    cols: 'Columns',
                    issues: 'Issues Detected'
                },
                issues: {
                    title: 'Data Quality Issues',
                    allData: 'All data',
                    countLabel: 'values/rows'
                },
                table: {
                    title: 'Column Statistics',
                    colName: 'Column Name',
                    type: 'Type',
                    missing: 'Missing',
                    mean: 'Mean',
                    sd: 'SD',
                    min: 'Min',
                    max: 'Max'
                }
            },
            selector: {
                title: 'Select Analysis Method',
                desc: 'Choose the most appropriate method for your research objectives'
            },
            results: {
                title: 'Analysis Results',
                back: 'Other Analysis',
                exportPdf: 'Export PDF',
                exportWord: 'Export Word',
                newAnalysis: 'New Analysis'
            },
            common: {
                back: 'Back',
                continue: 'Continue',
                processing: 'Processing...',
                analyzing: 'Analyzing...',
                security: 'Data processed 100% locally (Client-side), ensuring absolute privacy.'
            }
        },
        // PLS-SEM Workflow Pages
        pls_workflow: {
            title: 'PLS-SEM Workflow',
            security: 'Data Privacy: 100% Client-side processing.',
            phases: {
                phase1: {
                    title: 'Pre-processing & Reliability',
                    desc: 'Data cleaning and scale reliability assessment (The Foundation)'
                },
                phase2: {
                    title: 'Measurement Validation',
                    desc: 'Convergent and discriminant validity assessment (Measurement Model)'
                },
                phase3: {
                    title: 'Structural Model',
                    desc: 'Hypothesis testing and path analysis (Structural Model)'
                },
                phase4: {
                    title: 'Advanced Analysis',
                    desc: 'Deep dive into research findings (Advanced Analysis)'
                }
            }
        },
        // Results Tables (Bilingual)
        tables: {
            variable: 'Variable',
            mean: 'Mean',
            sd: 'SD',
            min: 'Min',
            max: 'Max',
            skew: 'Skewness',
            kurtosis: 'Kurtosis',
            n: 'N',
            sig: 'Sig.',
            model: 'Model',
            coefficients: 'Coefficients',
            summary: 'Model Summary',
            anova: 'ANOVA',
            correlations: 'Correlations',
            reliability: 'Reliability Statistics',
            itemTotal: 'Item-Total Statistics',
            alpha: "Cronbach's Alpha",
            standardized: 'Standardized',
            unstandardized: 'Unstandardized',
            tolerance: 'Tolerance',
            vif: 'VIF',
            source: 'Source'
        },
        // Scale Hub
        scales: {
            title: 'Standardized Scale Hub',
            subtitle: 'Repository of validated and accurately translated research constructs.',
            searchPlaceholder: 'Search scales (e.g., TAM, SERVQUAL...)',
            categories: 'Categories',
            economics: 'Economics',
            marketing: 'Marketing',
            hr: 'Human Resources',
            logistics: 'Logistics & SCM',
            mis: 'MIS & Digital',
            accounting: 'Accounting & Finance',
            innovation: 'Innovation & Strategy',
            tourism: 'Tourism & Hospitality',
            'modern (2020+)': 'Modern Research (2020+)',
            author: 'Author',
            year: 'Year',
            items: 'Items',
            citation: 'Citation',
            viewItems: 'View Scale Items',
            exportTemplate: 'Export Excel Template',
            comingSoon: 'Coming Soon',
            advisor: {
                title: 'Research Advisor',
                subtitle: 'Let the system suggest a theory for you:',
                q1: 'What is your research objective?',
                q2: 'Who is your target focus?',
                opt1: 'Measuring acceptance / new behavior',
                opt2: 'Evaluating service quality / performance',
                opt3: 'Analyzing HR / Organization / Leadership',
                opt4: 'Logistics Systems & MIS Management',
                modern: 'Modern Research (AI/Digital/Hybrid)',
                resultText: 'Based on your goal, we recommend:',
                loginRequired: 'Please login to view scale items'
            }
        },
        // Docs Page
        docs: {
            tabs: {
                theory: 'Statistical Theory',
                casestudy: 'Research Scenarios',
                userguide: 'User Guide'
            },
            theory: {
                title: 'Statistical Foundations and Interpretation',
                subtitle: 'In-depth analysis of key concepts to support scientific data interpretation.'
            },
            casestudy: {
                title: 'Research Workflow and International Publication',
                subtitle: 'Guidance on coordinating analysis methods to complete an APA-standard research paper.'
            },
            userguide: {
                title: 'ncsStat System Operation Guide',
                subtitle: 'Detailed operational steps for each analysis and data processing feature.'
            },
            casestudy_content: {
                model_badge: 'Economics Model',
                scenario_title: 'Scenario: Factors influencing Digital Banking Intention',
                scenario_desc: 'This study applies the Technology Acceptance Model (TAM) combined with Trust and Perceived Risk factors to explain consumer behavior in the Vietnamese financial sector.',
                stats: {
                    sample: '320 Quantitative Sample',
                    scale: '5-point Likert Scale',
                    analysis: 'PLS-SEM Analysis'
                },
                phase1: {
                    title: 'Phase 1: Pre-processing & Descriptive Statistics',
                    desc: 'Checking for outliers and missing values. Presenting sample demographics across age, income, and education levels.',
                    report_label: 'Key reporting indicators:'
                },
                phase2: {
                    title: 'Phase 2: Reliability & Convergent Validity',
                    desc: "Running Cronbach's Alpha and C.R for each factor. Checking Outer Loadings to ensure observed variables accurately measure concepts.",
                    pass: 'Requirements:',
                    note: 'Item removal notes:',
                    note_desc: 'Remove items with loadings < 0.40 or those negatively impacting AVE.'
                },
                phase3: {
                    title: 'Phase 3: Discriminant Validity (HTMT)',
                    desc: 'Proving that research constructs do not overlap using the Heterotrait-Monotrait Ratio (HTMT) matrix.',
                    example: '"The HTMT index between Perceived Risk and Usage Intention reached 0.76 (below the 0.85 threshold), confirming discriminant validity."'
                },
                phase4: {
                    title: 'Phase 4: Hypothesis Testing & Structural Analysis',
                    desc: 'Analyzing Path Coefficients via Bootstrapping (5000 iterations). Checking R-square to evaluate model explanatory power.',
                    hypothesis: 'Expected Results (Hypothesis):',
                    supported: 'Supported',
                    explanation_power: 'Explanatory Power:',
                    explanation_desc: 'Variance of Usage Intention explained by the model.'
                },
                tips: {
                    title: 'Guidelines for Thesis / Journal Presentation',
                    tip1: 'Report measurement model results first (Reliability, Convergent, Discriminant validity), then report structural model results.',
                    tip2: 'Use Path Diagrams exported from ncsStat to visually illustrate effect coefficients and significance levels.',
                    tip3: 'For mediating variables, specifically report Direct Effect, Indirect Effect, and Total Effect.'
                }
            },
            theory_content: {
                measurement_title: '1. Measurement Model Evaluation',
                reliability_title: 'Internal Consistency Reliability',
                reliability_desc: "Using Cronbach's Alpha and C.R (Composite Reliability). In modern research, C.R is preferred as it is not affected by the number of items.",
                convergent_title: 'Convergent Validity (AVE)',
                convergent_desc: 'AVE (Average Variance Extracted) measures the percentage of variance explained by a factor from its indicators. Low AVE indicates indicators do not reflect the factor well.',
                threshold: 'Threshold:',
                discriminant_title: 'Discriminant Validity',
                htmt_title: 'HTMT Index (Heterotrait-Monotrait)',
                htmt_desc: 'The most rigorous current standard. Measures the ratio of between-trait correlations to within-trait correlations.',
                htmt_threshold: 'Pass: HTMT < 0.85 or 0.90',
                fornell_title: 'Fornell-Larcker Criterion',
                fornell_desc: "The square root of each factor's AVE must be greater than its correlations with any other factor.",
                structural_title: '2. Structural Model Evaluation',
                rsquare_title: 'R-Square (R²)',
                rsquare_desc: 'Measures the explanatory power of the model. In social sciences, an R² above 0.26 is considered a large effect.',
                fsquare_title: 'f-Square (f²)',
                fsquare_desc: 'Effect size. Helps determine the role of each independent variable in contributing to the R² of the dependent variable.',
                qsquare_title: 'Q-Square (Q²)',
                qsquare_desc: 'Predictive relevance out-of-sample. Calculated via the Blindfolding technique.',
                mediation_title: 'Indirect & Mediating Effects',
                mediation_desc: 'ncsStat supports mediation testing via the Bootstrapping method. To conclude on mediation, one must check the Confidence Interval. If it does not contain zero, the mediation effect is statistically significant.',
                sig_title: 'Statistical Significance (Sig.)',
                sig_desc: 'p-value determines the probability that a finding was obtained by chance. In social sciences, the common threshold is 5%.',
                beta_title: 'Beta Coefficients (Path Coefficients)',
                beta_desc: 'Indicates the amount of change in the dependent variable when an independent variable changes by one unit. Beta can be positive (+) or negative (-).',
                beta_pos: 'Positive Beta: Same direction impact (A increases leads to B increases).',
                beta_neg: 'Negative Beta: Inverse direction impact (A increases leads to B decreases).',
                beta_std: 'Standardized Beta: Used to compare the strength of impact between variables with different units of measurement.',
                cta_title: 'Knowledge is the Foundation of Publication',
                cta_desc: 'A deep understanding of these indicators helps your research pass through peer review and affirms your scientific credibility.',
                cta_button: 'See Research Scenarios'
            },
            methods_guide: {
                title: 'Statistical Methods Guide',
                select: 'Select a method to view detailed instructions',
                cta: 'Execute Now',
                descriptive: {
                    name: 'Descriptive Statistics',
                    desc: 'Summarize data characteristics (Mean, SD, Skewness...)',
                    purpose: 'Summarizes basic characteristics of data such as Mean, Median, Standard Deviation, Min, Max, Skewness, Kurtosis.',
                    stepTitle: 'How to perform:',
                    whenToUse: 'Always run first to check distributions and find anomalies.',
                    steps: [
                        'Select the Descriptive menu.',
                        'Select numeric variables for calculation.',
                        'Click the Run Analysis button.'
                    ],
                    output: ['Mean, SD, Min, Max', 'Skewness & Kurtosis']
                },
                cronbach: {
                    name: "Cronbach's Alpha",
                    desc: 'Scale reliability testing',
                    purpose: 'Evaluates the internal consistency of scale items (how closely related they are).',
                    stepTitle: 'How to perform:',
                    whenToUse: 'Validate scale quality before factor analysis.',
                    steps: [
                        "Select the Cronbach's Alpha menu.",
                        'Select all indicators belonging to the same construct.',
                        'Click the Run Analysis button.'
                    ],
                    note: "Results will show the overall Cronbach's Alpha and the 'Item-Total Statistics' table to help identify problematic items.",
                    output: ['Alpha coefficient', 'Alpha if item deleted']
                },
                efa: {
                    name: 'EFA Analysis',
                    desc: 'Exploratory Factor Analysis',
                    purpose: 'Reduces a large set of variables into a smaller number of meaningful factors.',
                    stepTitle: 'How to perform:',
                    whenToUse: 'Discover scale structure or reduce data dimensionality.',
                    steps: [
                        'Select the EFA menu.',
                        'Select all relevant observation variables.',
                        'Adjust settings if needed: Extraction, Rotation.',
                        'Click the Run EFA button.'
                    ],
                    output: ['KMO & Bartlett', 'Rotated factor matrix']
                },
                ttest: {
                    name: 'T-Test',
                    desc: 'Compare means of 2 groups',
                    purpose: 'Tests whether there is a statistically significant difference between the means of two independent groups.',
                    stepTitle: 'How to perform:',
                    steps: [
                        'Select the T-Test menu.',
                        'Select the grouping variable (e.g., Gender).',
                        'Select the test variable (e.g., Income).',
                        'Click the Run T-Test button.'
                    ]
                },
                anova: {
                    name: 'ANOVA Test',
                    desc: 'Compare means of 3+ groups',
                    purpose: 'Tests differences in means across three or more groups (One-Way ANOVA).',
                    stepTitle: 'How to perform:',
                    steps: [
                        'Select the ANOVA menu.',
                        'Select the grouping Factor variable (e.g., Education).',
                        'Select the Dependent variable.',
                        'Click the Run ANOVA button.'
                    ]
                },
                correlation: {
                    name: 'Correlation Analysis',
                    desc: 'Pearson Correlation',
                    purpose: 'Evaluates linear relationships between two quantitative variables.',
                    stepTitle: 'How to perform:',
                    steps: [
                        'Select the Correlation menu.',
                        'Select variables for correlation analysis.',
                        'Click the Run Analysis button.'
                    ]
                },
                regression: {
                    name: 'Regression Analysis',
                    desc: 'Linear Regression',
                    purpose: 'Evaluates the impact of one or more independent variables on a dependent variable.',
                    stepTitle: 'How to perform:',
                    whenToUse: 'Testing causal hypotheses.',
                    steps: [
                        'Select the Regression menu.',
                        'Select the Dependent variable (Y).',
                        'Select Independent variables (X).',
                        'Click the Run Regression button.'
                    ],
                    note: 'The system automatically calculates R-squared, Beta coefficients, and checks for multicollinearity (VIF).',
                    output: ['R-Square', 'Beta coefficients']
                },
                chisq: {
                    name: 'Chi-Square Test',
                    desc: 'Test for categorical variables',
                    purpose: 'Examines the association between two categorical variables.',
                    stepTitle: 'How to perform:',
                    steps: [
                        'Select the Chi-Square menu.',
                        'Select Row and Column variables.',
                        'Click the Run Test button.'
                    ]
                },
                nonparam: {
                    name: 'Non-parametric Tests',
                    desc: 'Mann-Whitney / Kruskal-Wallis',
                    purpose: 'Compares ranks when data is not normally distributed (Alternative to T-Test/ANOVA).',
                    stepTitle: 'How to perform:',
                    steps: [
                        'Select the Non-parametric menu.',
                        'Select test variables and the grouping variable.',
                        'Click the Run Test button.'
                    ]
                }
            }
        }
    }
} as const;

// Helper to get translation
export function t(locale: Locale, key: string): string {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

// Default locale
export const defaultLocale: Locale = 'vi';

// Get locale from localStorage or default
export function getStoredLocale(): Locale {
    if (typeof window === 'undefined') return defaultLocale;
    const stored = localStorage.getItem('ncsStat_locale');
    return (stored === 'en' || stored === 'vi') ? stored : defaultLocale;
}

// Save locale to localStorage
export function setStoredLocale(locale: Locale): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ncsStat_locale', locale);
}
