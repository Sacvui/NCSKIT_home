-- NCSStat Expert Article: ANOVA
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'anova-analysis-of-variance', 
    'Difference Analysis', 
    'ANOVA: PhÃ¢n tÃ­ch phÆ°Æ¡ng sai vÃ  So sÃ¡nh Ä‘a nhÃ³m', 
    'ANOVA: Analysis of Variance and Multi-group Comparison', 
    'Náº¿u káº¿t quáº£ Anova cÃ³ Ã½ nghÄ©a (Sig < 0.05), báº¡n báº¯t buá»™c pháº£i cháº¡y Post-hoc (nhÆ° Tukey hoáº·c Scheffe) Ä‘á»ƒ biáº¿t chÃ­nh xÃ¡c nhÃ³m nÃ o khÃ¡c nhÃ³m nÃ o.', 
    'If ANOVA is significant (Sig < 0.05), you must run Post-hoc tests (Tukey/Scheffe) to identify specific group differences.', 
    $$[
        {"h2_vi":"1. Khi nÃ o thÃ¬ dÃ¹ng ANOVA thay vÃ¬ T-Test?","h2_en":"1. ANOVA vs. T-Test","content_vi":"DÃ¹ng T-test khi so sÃ¡nh 2 nhÃ³m (Nam/Ná»¯). DÃ¹ng ANOVA khi báº¡n cÃ³ tá»« 3 nhÃ³m trá»Ÿ lÃªn (Vd: SV nÄƒm 1, nÄƒm 2, nÄƒm 3, nÄƒm 4).","content_en":"Use T-Test for 2 groups; use ANOVA for 3 or more groups (e.g., Year 1, 2, 3, 4 students)."},
        {"h2_vi":"2. Giáº£ Ä‘á»‹nh vá» tÃ­nh Ä‘á»“ng nháº¥t phÆ°Æ¡ng sai","h2_en":"2. Homogeneity of Variance","content_vi":"Kiá»ƒm Ä‘á»‹nh Levene pháº£i cÃ³ Sig > 0.05. Náº¿u khÃ´ng, báº¡n pháº£i sá»­ dá»¥ng káº¿t quáº£ Welch ANOVA thay vÃ¬ ANOVA thÃ´ng thÆ°á»ng.","content_en":"Levene''s test must have Sig > 0.05. If violated, use Welch ANOVA results instead of standard ANOVA."},
        {"h2_vi":"3. Äá»c káº¿t quáº£ Post-hoc trÃªn ncsStat","h2_en":"3. Interpreting Post-hoc on ncsStat","content_vi":"Há»‡ thá»‘ng sáº½ tá»± Ä‘á»™ng so sÃ¡nh tá»«ng cáº·p nhÃ³m vÃ  Ä‘Ã¡nh dáº¥u cÃ¡c cáº·p cÃ³ sá»± khÃ¡c biá»‡t Ã½ nghÄ©a, giÃºp báº¡n nháº­n Ä‘á»‹nh chÃ­nh xÃ¡c bá»‘i cáº£nh nghiÃªn cá»©u.","content_en":"ncsStat automatically pairs groups and highlights significant differences for precise contextual interpretation."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: CFA
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'cfa-confirmatory-factor-analysis', 
    'Advanced Statistics', 
    'PhÃ¢n tÃ­ch CFA: Kháº³ng Ä‘á»‹nh sá»©c máº¡nh thang Ä‘o vÃ  GiÃ¡ trá»‹ há»™i tá»¥', 
    'Confirmatory Factor Analysis (CFA): Validity and Reliability', 
    'Äá»«ng hoáº£ng sá»£ khi RMSEA > 0.08. HÃ£y thá»­ kiá»ƒm tra Modification Indices (MI) Ä‘á»ƒ tÃ¬m ra cÃ¡c cáº·p sai sá»‘ tÆ°Æ¡ng quan tiá»m nÄƒng, tá»« Ä‘Ã³ tá»‘i Æ°u hÃ³a Model Fit cho bÃ i nghiÃªn cá»©u cá»§a báº¡n.', 
    'Expert Hack: Don''t panic if RMSEA > 0.08. Inspect Modification Indices (MI) to identify error covariances and optimize your Model Fit for publication.', 
    $$[
        {"h2_vi":"1. CFA vs EFA: Tá»« khÃ¡m phÃ¡ Ä‘áº¿n kháº³ng Ä‘á»‹nh sá»©c máº¡nh","h2_en":"1. EFA vs. CFA: From Discovery to Confidence","content_vi":"Náº¿u EFA lÃ  cuá»™c dáº¡o chÆ¡i Ä‘á»ƒ tÃ¬m kiáº¿m cáº¥u trÃºc nhÃ¢n tá»‘, thÃ¬ **CFA (Confirmatory Factor Analysis)** chÃ­nh lÃ  'lá»i tuyÃªn kháº¿' khoa há»c. Báº¡n khÃ´ng cÃ²n Ä‘i tÃ¬m ná»¯a, mÃ  báº¡n Ä‘ang dÃ¹ng dá»¯ liá»‡u Ä‘á»ƒ kháº³ng Ä‘á»‹nh ráº±ng: 'Thang Ä‘o nÃ y tuyá»‡t Ä‘á»‘i chuáº©n theo lÃ½ thuyáº¿t gá»‘c'. ÄÃ¢y lÃ  bÆ°á»›c Ä‘á»‡m khÃ´ng thá»ƒ thiáº¿u trÆ°á»›c khi bÆ°á»›c vÃ o tháº¿ giá»›i cá»§a #SEM. #NCStat #StructuralEquationModeling","content_en":"While EFA is an exploratory journey, CFA is a scientific confirmation. You're leveraging data to prove your scale aligns perfectly with established theory. It's the mandatory gateway to the world of #SEM. #Psychometrics"},
        {"h2_vi":"2. Giáº£i mÃ£ bá»™ chá»‰ sá»‘ Model Fit: Khi nÃ o mÃ´ hÃ¬nh 'Äáº¹p'?","h2_en":"2. Decoding Model Fit: The Scopus Standard","content_vi":"Má»™t mÃ´ hÃ¬nh Ä‘Æ°á»£c Reviewer quá»‘c táº¿ cháº¥p nháº­n thÆ°á»ng pháº£i vÆ°á»£t qua bá»™ 'tá»© trá»¥': \n- **CFI & TLI** >= 0.90.\n- **RMSEA** <= 0.08.\n- **Chi-square/df** < 3.\nNáº¿u mÃ´ hÃ¬nh cá»§a báº¡n 'xáº¥u', ncsStat sáº½ gá»£i Ã½ cÃ¡c Ä‘Æ°á»ng dáº«n cáº§n Ä‘iá»u chá»‰nh Ä‘á»ƒ tá»‘i Æ°u hÃ³a bá»™ chá»‰ sá»‘ nÃ y mÃ  khÃ´ng lÃ m máº¥t Ä‘i Ã½ nghÄ©a lÃ½ thuyáº¿t. #ModelFit #StatHacks","content_en":"International reviewers look for the 'Big Four': CFI & TLI >= 0.90, RMSEA <= 0.08, and Chi-square/df < 3. If your model fails, ncsStat suggests paths to optimize indices without compromising theoretical integrity. #Amos #Lisrel"},
        {"h2_vi":"3. GiÃ¡ trá»‹ há»™i tá»¥ (AVE) vÃ  Tin cáº­y tá»•ng há»£p (CR)","h2_en":"3. Validity Gold Standards: AVE & CR","content_vi":"Äá»™ tin cáº­y Cronbach's Alpha lÃ  chÆ°a Ä‘á»§. Trong CFA, báº¡n cáº§n **CR > 0.7** vÃ  **AVE > 0.5**. ÄÃ¢y lÃ  chá»©ng chá»‰ cho tháº¥y cÃ¡c cÃ¢u há»i cá»§a báº¡n Ä‘ang Ä‘o lÆ°á»ng cá»±c ká»³ táº­p trung vÃ o má»¥c tiÃªu nghiÃªn cá»©u. Náº¿u AVE tháº¥p, hÃ£y kiá»ƒm tra láº¡i há»‡ sá»‘ táº£i (Factor Loading) cá»§a tá»«ng biáº¿n, nhá»¯ng biáº¿n < 0.5 chÃ­nh lÃ  thá»§ pháº¡m cáº§n 'trÃ¬nh diá»‡n'. #Validity #ReliabilityAnalysis","content_en":"Alpha isn't enough for high-impact research. You need CR > 0.7 and AVE > 0.5. These are the certificates of focus. If AVE drops, hunt down variables with Factor Loadings < 0.5â€”they are the culprits weakening your construct. #DataScience"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: Descriptive Statistics
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'descriptive-statistics-normality', 
    'Preliminary Analysis', 
    'Thá»‘ng kÃª mÃ´ táº£ vÃ  Kiá»ƒm Ä‘á»‹nh phÃ¢n phá»‘i chuáº©n', 
    'Descriptive Statistics and Normality Testing', 
    'Äá»«ng bá» qua Skewness vÃ  Kurtosis. Náº¿u dá»¯ liá»‡u quÃ¡ lá»‡ch, cÃ¡c phÃ©p kiá»ƒm Ä‘á»‹nh tham sá»‘ (nhÆ° T-test, ANOVA) sáº½ máº¥t giÃ¡ trá»‹.', 
    'Monitor Skewness and Kurtosis. Extreme deviations invalidate parametric tests like T-Tests and ANOVA.', 
    $$[
        {"h2_vi":"1. CÃ¡c chá»‰ sá»‘ Ä‘o lÆ°á»ng trung tÃ¢m","h2_en":"1. Measures of Central Tendency","content_vi":"Mean (Trung bÃ¬nh), Median (Trung vá»‹), vÃ  Mode (Yáº¿u vá»‹). Mean lÃ  chá»‰ sá»‘ nháº¡y cáº£m nháº¥t vá»›i giÃ¡ trá»‹ ngoáº¡i lai (outliers).","content_en":"Mean, Median, and Mode. Remember that Mean is highly sensitive to outliers."},
        {"h2_vi":"2. Äo lÆ°á»ng sá»± phÃ¢n tÃ¡n","h2_en":"2. Measures of Dispersion","content_vi":"Äá»™ lá»‡ch chuáº©n (Standard Deviation) vÃ  PhÆ°Æ¡ng sai (Variance) cho biáº¿t dá»¯ liá»‡u cá»§a báº¡n táº­p trung hay phÃ¢n tÃ¡n rá»™ng ra khá»i Ä‘iá»ƒm trung bÃ¬nh.","content_en":"Standard Deviation and Variance indicate how concentrated or spread out the data is from the mean."},
        {"h2_vi":"3. Kiá»ƒm Ä‘á»‹nh PhÃ¢n phá»‘i chuáº©n","h2_en":"3. Normality Testing","content_vi":"Sá»­ dá»¥ng biá»ƒu Ä‘á»“ Histogram hoáº·c kiá»ƒm Ä‘á»‹nh Shapiro-Wilk/Kolmogorov-Smirnov trÃªn ncsStat Ä‘á»ƒ xÃ¡c Ä‘á»‹nh dá»¯ liá»‡u cÃ³ chuáº©n hay khÃ´ng trÆ°á»›c khi cháº¡y cÃ¡c phÃ©p phÃ¢n tÃ­ch báº­c cao.","content_en":"Use Histograms or Shapiro-Wilk/Kolmogorov-Smirnov tests on ncsStat to verify normality before high-level analysis."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: Sampling
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'sampling-methods-sample-size', 
    'Research Methodology', 
    'XÃ¡c Ä‘á»‹nh kÃ­ch thÆ°á»›c máº«u vÃ  PhÆ°Æ¡ng phÃ¡p chá»n máº«u tá»‘i Æ°u', 
    'Determining Sample Size and Optimal Sampling Methods', 
    'Äá»‘i vá»›i SEM, kÃ­ch thÆ°á»›c máº«u tá»‘i thiá»ƒu nÃªn gáº¥p 5-10 láº§n sá»‘ biáº¿n quan sÃ¡t. Äá»«ng quÃªn tÃ­nh Ä‘áº¿n tá»· lá»‡ phiáº¿u khÃ´ng há»£p lá»‡.', 
    'For SEM, sample size should be 5-10 times the number of items. Account for potential invalid survey responses.', 
    $$[
        {"h2_vi":"1. CÃ¡c phÆ°Æ¡ng phÃ¡p chá»n máº«u","h2_en":"1. Sampling Methods","content_vi":"- Chá»n máº«u ngáº«u nhiÃªn Ä‘Æ¡n giáº£n.\n- Chá»n máº«u thuáº­n tiá»‡n (phá»• biáº¿n trong nghiÃªn cá»©u sinh viÃªn).\n- Chá»n máº«u quáº£ cáº§u tuyáº¿t (Snowball sampling).","content_en":"- Simple Random Sampling.\n- Convenience Sampling (common for students).\n- Snowball Sampling."},
        {"h2_vi":"2. CÃ´ng thá»©c tÃ­nh KÃ­ch thÆ°á»›c máº«u (N)","h2_en":"2. Sample Size Formulas","content_vi":"Sá»­ dá»¥ng cÃ´ng thá»©c Yamane, Slovin cho cÃ¡c nghiÃªn cá»©u mÃ´ táº£ hoáº·c quy táº¯c '5:1' (Hair) cho cÃ¡c mÃ´ hÃ¬nh nhÃ¢n tá»‘ (EFA/CFA).","content_en":"Use Yamane/Slovin for descriptive studies, or the '5:1' rule (Hair) for factor-based models (EFA/CFA)."},
        {"h2_vi":"3. Táº§m quan trá»ng cá»§a Máº«u Ä‘áº¡i diá»‡n","h2_en":"3. Representative Sampling Importance","content_vi":"Má»™t táº­p máº«u lá»›n khÃ´ng quan trá»ng báº±ng má»™t táº­p máº«u cÃ³ tÃ­nh Ä‘áº¡i diá»‡n cao. ncsStat giÃºp báº¡n phÃ¢n tÃ­ch sai sá»‘ máº«u Ä‘á»ƒ Ä‘áº£m báº£o tÃ­nh khÃ¡ch quan.","content_en":"Representativeness outweighs size. ncsStat helps analyze sampling error to ensure objective findings."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: SEM
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'sem-structural-equation-modeling', 
    'Advanced Statistics', 
    'MÃ´ hÃ¬nh SEM: Äá»‰nh cao cá»§a PhÃ¢n tÃ­ch Cáº¥u trÃºc vÃ  Biáº¿n trung gian', 
    'Structural Equation Modeling (SEM): The Peak of Data Analysis', 
    'Äá»«ng chá»‰ dá»«ng láº¡i á»Ÿ tÃ¡c Ä‘á»™ng trá»±c tiáº¿p. SEM cho phÃ©p báº¡n khÃ¡m phÃ¡ cÃ¡c hiá»‡u á»©ng giÃ¡n tiáº¿p (Mediation) cá»±c ká»³ tinh táº¿. HÃ£y luÃ´n sá»­ dá»¥ng Bootstrapping (5000 máº«u) Ä‘á»ƒ bÃ¡o cÃ¡o cÃ³ trá»ng lÆ°á»£ng khoa há»c cao nháº¥t.', 
    'Insight: Focus on Indirect Effects (Mediation). SEM allows for nuanced path analysis. Always employ Bootstrapping (5k samples) for top-tier journal submission standards.', 
    $$[
        {"h2_vi":"1. Quyá»n nÄƒng cá»§a SEM: Khi há»“i quy truyá»n thá»‘ng trá»Ÿ nÃªn nhá» bÃ©","h2_en":"1. The Power of SEM Over OLS","content_vi":"Táº¡i sao cÃ¡c táº¡p chÃ­ Q1 luÃ´n yÃªu cáº§u **SEM (Structural Equation Modeling)**? VÃ¬ khÃ¡c vá»›i há»“i quy OLS, SEM xá»­ lÃ½ Ä‘Æ°á»£c cÃ¡c sai sá»‘ Ä‘o lÆ°á»ng (measurement error) vÃ  cho phÃ©p kiá»ƒm Ä‘á»‹nh Ä‘á»“ng thá»i hÃ ng chá»¥c giáº£ thuyáº¿t trong má»™t sÆ¡ Ä‘á»“ máº¡ng lÆ°á»›i phá»©c táº¡p. Náº¿u mÃ´ hÃ¬nh cá»§a báº¡n cÃ³ dáº¡ng A -> B -> C, SEM lÃ  'vÅ© khÃ­' duy nháº¥t Ä‘á»ƒ Ä‘o lÆ°á»ng trá»n váº¹n sá»©c máº¡nh nÃ y. #StatModeling #Amos #SmartPLS","content_en":"Why do Q1 journals demand SEM? Unlike OLS, SEM accounts for measurement errors and tests dozens of hypotheses simultaneously within a complex network. For paths like A -> B -> C, SEM is the definitive weapon. #QuantitativeAnalysis #AdvancedStats"},
        {"h2_vi":"2. Chiáº¿n lÆ°á»£c 2 bÆ°á»›c: Tá»« Äo lÆ°á»ng Ä‘áº¿n Cáº¥u trÃºc","h2_en":"2. The Two-Step Strategy: Measurement to Structural","content_vi":"Má»™t sai láº§m phá»• biáº¿n lÃ  nháº£y tháº³ng vÃ o cháº¡y mÃ´ hÃ¬nh cáº¥u trÃºc. Quy trÃ¬nh 'chuáº©n hÃ³a' báº¯t buá»™c pháº£i lÃ : \n1. **MÃ´ hÃ¬nh Ä‘o lÆ°á»ng (CFA):** Kiá»ƒm tra xem cÃ¡c biáº¿n quan sÃ¡t cÃ³ Ä‘o lÆ°á»ng Ä‘Ãºng nhÃ¢n tá»‘ khÃ´ng.\n2. **MÃ´ hÃ¬nh cáº¥u trÃºc:** Kiá»ƒm tra cÃ¡c mÅ©i tÃªn tÃ¡c Ä‘á»™ng. ncsStat giÃºp báº¡n thá»±c hiá»‡n quy trÃ¬nh nÃ y cá»±c ká»³ trá»±c quan vá»›i biá»ƒu Ä‘á»“ Path Diagram tá»± Ä‘á»™ng. #PathAnalysis #ResearchDesign","content_en":"A common rookie mistake is skipping straight to the structural model. The 'gold standard' workflow is: 1. CFA to ensure measurement integrity. 2. Structural path testing for hypotheses. ncsStat automates this with intuitive, publication-ready Path Diagrams. #AcademicFramework"},
        {"h2_vi":"3. Kiá»ƒm Ä‘á»‹nh Trung gian (Mediation) vÃ  Hiá»‡u á»©ng Tá»•ng thá»ƒ","h2_en":"3. Mastering Mediation and Total Effects","content_vi":"Äiá»ƒm háº¥p dáº«n nháº¥t cá»§a SEM lÃ  kháº£ nÄƒng bÃ³c tÃ¡ch hiá»‡u á»©ng GiÃ¡n tiáº¿p. CÃ¢u há»i khÃ´ng chá»‰ lÃ  'A cÃ³ tÃ¡c Ä‘á»™ng tá»›i C khÃ´ng?', mÃ  lÃ  'A tÃ¡c Ä‘á»™ng tá»›i C THÃ”NG QUA B nhÆ° tháº¿ nÃ o?'. Vá»›i tÃ­nh nÄƒng **Bootstrapping** tÃ­ch há»£p, ncsStat sáº½ cung cáº¥p cho báº¡n khoáº£ng tin cáº­y (Confidence Interval) Ä‘á»ƒ kháº³ng Ä‘á»‹nh biáº¿n trung gian cÃ³ Ã½ nghÄ©a thá»‘ng kÃª hay khÃ´ng. #Mediation #Bootstrapping #NCStat","content_en":"The most captivating feature of SEM is isolating Indirect Effects. It's not just 'Does A affect C?', but 'How does A affect C THROUGH B?'. ncsStat's integrated Bootstrapping provides the necessary Confidence Intervals to validate mediation significance. #StatisticalInsights"}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: SERVQUAL
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'servqual-service-quality', 
    'Service Management', 
    'MÃ´ hÃ¬nh SERVQUAL: Äo lÆ°á»ng cháº¥t lÆ°á»£ng dá»‹ch vá»¥ chuyÃªn sÃ¢u', 
    'SERVQUAL Model: Measuring Service Quality Professionally', 
    'HÃ£y Ä‘o lÆ°á»ng khoáº£ng cÃ¡ch giá»¯a Ká»³ vá»ng vÃ  Cáº£m nháº­n. Náº¿u cáº£m nháº­n < ká»³ vá»ng, doanh nghiá»‡p cá»§a báº¡n Ä‘ang gáº·p váº¥n Ä‘á» nghiÃªm trá»ng.', 
    'Gap analysis between Expectations and Perceptions is key. If Perception < Expectation, service quality is failing.', 
    $$[
        {"h2_vi":"1. 5 KÃ­ch thÆ°á»›c cá»§a Cháº¥t lÆ°á»£ng dá»‹ch vá»¥","h2_en":"1. The 5 Dimensions of Service Quality","content_vi":"- Tin cáº­y (Reliability).\n- ÄÃ¡p á»©ng (Responsiveness).\n- NÄƒng lá»±c phá»¥c vá»¥ (Assurance).\n- Äá»“ng cáº£m (Empathy).\n- Há»¯u hÃ¬nh (Tangibles).","content_en":"- Reliability.\n- Responsiveness.\n- Assurance.\n- Empathy.\n- Tangibles."},
        {"h2_vi":"2. CÃ¡ch thiáº¿t káº¿ báº£ng há»i SERVQUAL","h2_en":"2. Designing SERVQUAL Survey","content_vi":"ThÆ°á»ng sá»­ dá»¥ng thang Ä‘o Likert 5 hoáº·c 7 Ä‘iá»ƒm vá»›i cÃ¡c bá»™ cÃ¢u há»i kÃ©p cho cáº£ ká»³ vá»ng vÃ  tráº£i nghiá»‡m thá»±c táº¿.","content_en":"Uses 5 or 7-point Likert scales with paired questions for both expectations and actual experiences."},
        {"h2_vi":"3. PhÃ¢n tÃ­ch káº¿t quáº£ trÃªn ncsStat","h2_en":"3. Analyzing Results on ncsStat","content_vi":"Sá»­ dá»¥ng thá»‘ng kÃª mÃ´ táº£ Ä‘á»ƒ tÃ¬m ra cÃ¡c 'khoáº£ng cÃ¡ch' (gaps) lá»›n nháº¥t trong 5 kÃ­ch thÆ°á»›c Ä‘á»ƒ Æ°u tiÃªn cáº£i thiá»‡n.","content_en":"Use descriptive statistics to identify the largest gaps across the 5 dimensions to prioritize improvements."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: TAM
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'technology-acceptance-model-tam', 
    'Research Models', 
    'MÃ´ hÃ¬nh TAM: HÆ°á»›ng dáº«n á»©ng dá»¥ng vÃ  PhÃ¢n tÃ­ch chuyÃªn sÃ¢u', 
    'Technology Acceptance Model (TAM): Implementation Guide', 
    'Äá»«ng chá»‰ dÃ¹ng PU vÃ  PEOU thuáº§n tÃºy. HÃ£y tÃ­ch há»£p thÃªm Niá»m tin (Trust) hoáº·c TÃ­nh di Ä‘á»™ng (Mobility) Ä‘á»ƒ tÄƒng tÃ­nh má»›i cho bÃ i bÃ¡o.', 
    'Beyond PU/PEOU, integrate Trust or Mobility to enhance research novelty for Scopus publication.', 
    $$[
        {"h2_vi":"1. Tá»•ng quan vá» MÃ´ hÃ¬nh TAM (Davis, 1989)","h2_en":"1. Overview of TAM","content_vi":"TAM lÃ  mÃ´ hÃ¬nh phá»• biáº¿n nháº¥t Ä‘á»ƒ giáº£i thÃ­ch hÃ nh vi cháº¥p nháº­n cÃ´ng nghá»‡. NÃ³ táº­p trung vÃ o hai yáº¿u tá»‘ chÃ­nh: Sá»± há»¯u Ã­ch cáº£m nháº­n (PU) vÃ  Sá»± dá»… sá»­ dá»¥ng cáº£m nháº­n (PEOU).","content_en":"TAM explains technology adoption through two pillars: Perceived Usefulness (PU) and Perceived Ease of Use (PEOU)."},
        {"h2_vi":"2. PhÃ¢n tÃ­ch chi tiáº¿t cÃ¡c biáº¿n quan sÃ¡t","h2_en":"2. Item Analysis","content_vi":"- PU: Má»©c Ä‘á»™ ngÆ°á»i dÃ¹ng tin ráº±ng cÃ´ng nghá»‡ giÃºp tÄƒng hiá»‡u quáº£ cÃ´ng viá»‡c.\n- PEOU: Má»©c Ä‘á»™ ngÆ°á»i dÃ¹ng cáº£m tháº¥y viá»‡c sá»­ dá»¥ng cÃ´ng nghá»‡ lÃ  khÃ´ng tá»‘n nhiá»u ná»— lá»±c.","content_en":"- PU: Efficiency gains.\n- PEOU: Effortlessness of use."},
        {"h2_vi":"3. Quy trÃ¬nh cháº¡y trÃªn ncsStat","h2_en":"3. ncsStat Workflow","content_vi":"Cháº¡y Cronbach's Alpha -> EFA -> Há»“i quy hoáº·c SEM Ä‘á»ƒ kiá»ƒm Ä‘á»‹nh cÃ¡c giáº£ thuyáº¿t ná»‘i tá»« PEOU sang PU vÃ  tá»« cáº£ hai sang Ã Ä‘á»‹nh sá»­ dá»¥ng.","content_en":"Run Alpha -> EFA -> Regression/SEM to test paths from PEOU to PU and Intention."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: TPB
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'theory-of-planned-behavior-tpb', 
    'Behavioral Research', 
    'Thuyáº¿t HÃ nh vi Dá»± Ä‘á»‹nh (TPB): ChÃ¬a khÃ³a vÃ ng giáº£i mÃ£ Ã Ä‘á»‹nh', 
    'Theory of Planned Behavior (TPB): Golden Key to Intentions', 
    'HÃ£y chÃº Ã½ Ä‘áº¿n khoáº£ng cÃ¡ch giá»¯a Ã Ä‘á»‹nh vÃ  HÃ nh vi. ÄÆ°a biáº¿n PBC vÃ o nhÆ° má»™t biáº¿n Ä‘iá»u tiáº¿t sáº½ lÃ m bÃ i nghiÃªn cá»©u sÃ¢u sáº¯c hÆ¡n.', 
    'Focus on the Intention-Behavior gap. Use PBC as a moderator for deeper insights.', 
    $$[
        {"h2_vi":"1. Nguá»“n gá»‘c tá»« TRA Ä‘áº¿n TPB","h2_en":"1. Evolution from TRA to TPB","content_vi":"Icek Ajzen (1991) Ä‘Ã£ phÃ¡t triá»ƒn TPB báº±ng cÃ¡ch thÃªm vÃ o biáº¿n Kiá»ƒm soÃ¡t hÃ nh vi cáº£m nháº­n (PBC) Ä‘á»ƒ giáº£i thÃ­ch cÃ¡c hÃ nh vi mÃ  cÃ¡ nhÃ¢n khÃ´ng hoÃ n toÃ n tá»± chá»§ Ä‘Æ°á»£c.","content_en":"Ajzen (1991) added PBC to TRA to account for behaviors not fully under volitional control."},
        {"h2_vi":"2. Ba trá»¥ cá»™t cá»§a Ã Ä‘á»‹nh","h2_en":"2. Three Pillars of Intention","content_vi":"- ThÃ¡i Ä‘á»™ (Attitude): ÄÃ¡nh giÃ¡ tá»‘t/xáº¥u.\n- Chuáº©n chá»§ quan (Subjective Norm): Ãp lá»±c xÃ£ há»™i.\n- PBC: Niá»m tin vÃ o kháº£ nÄƒng thá»±c hiá»‡n.","content_en":"- Attitude: Evaluation.\n- Subjective Norm: Social pressure.\n- PBC: Ability belief."},
        {"h2_vi":"3. á»¨ng dá»¥ng thá»±c tiá»…n trÃªn ncsStat","h2_en":"3. ncsStat Application","content_vi":"Sá»­ dá»¥ng phÃ¢n tÃ­ch há»“i quy Ä‘a biáº¿n Ä‘á»ƒ Ä‘o lÆ°á»ng má»©c Ä‘á»™ tÃ¡c Ä‘á»™ng cá»§a 3 nhÃ¢n tá»‘ nÃ y lÃªn Ã Ä‘á»‹nh hÃ nh vi. ChÃº Ã½ hiá»‡n tÆ°á»£ng Ä‘a cá»™ng tuyáº¿n.","content_en":"Use multiple regression to measure impacts on Intention. Monitor VIF carefully."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: T-Test
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    't-test-independent-paired', 
    'Difference Analysis', 
    'Kiá»ƒm Ä‘á»‹nh T-Test: So sÃ¡nh trung bÃ¬nh hai nhÃ³m Ä‘á»™c láº­p vÃ  phá»¥ thuá»™c', 
    'T-Test: Comparing Means for Independent and Paired Samples', 
    'ChÃº Ã½ kiá»ƒm Ä‘á»‹nh Levene. Náº¿u phÆ°Æ¡ng sai khÃ´ng Ä‘á»“ng nháº¥t, hÃ£y Ä‘á»c dÃ²ng "Equal variances not assumed".', 
    'Watch Levene''s test. If variances are unequal, use the "Equal variances not assumed" results.', 
    $$[
        {"h2_vi":"1. Independent Samples T-Test","h2_en":"1. Independent Samples T-Test","content_vi":"DÃ¹ng Ä‘á»ƒ so sÃ¡nh sá»± khÃ¡c biá»‡t vá» trung bÃ¬nh cá»§a 2 nhÃ³m riÃªng biá»‡t (Vd: Sá»± hÃ i lÃ²ng cá»§a khÃ¡ch hÃ ng Miá»n Báº¯c vs Miá»n Nam).","content_en":"Compares mean differences between two distinct groups (e.g., satisfaction in North vs. South regions)."},
        {"h2_vi":"2. Paired Samples T-Test","h2_en":"2. Paired Samples T-Test","content_vi":"DÃ¹ng Ä‘á»ƒ so sÃ¡nh cÃ¹ng má»™t nhÃ³m trÆ°á»›c vÃ  sau má»™t tÃ¡c Ä‘á»™ng (Vd: Äiá»ƒm sá»‘ trÆ°á»›c vÃ  sau khi há»c khÃ³a há»c ncsStat).","content_en":"Compares the same group before and after an intervention (e.g., test scores pre- and post-ncsStat training)."},
        {"h2_vi":"3. TrÃ¬nh bÃ y káº¿t quáº£ theo APA 7","h2_en":"3. APA 7 Reporting","content_vi":"LuÃ´n bÃ¡o cÃ¡o giÃ¡ trá»‹ t, df vÃ  p. VÃ­ dá»¥: (t(58) = 2.45, p < .05). ncsStat há»— trá»£ káº¿t xuáº¥t cÃ¢u nháº­n Ä‘á»‹nh nÃ y tá»± Ä‘á»™ng.","content_en":"Always report t, df, and p values. ncsStat provides automated APA narrative generation."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

-- NCSStat Expert Article: UTAUT
INSERT INTO "public"."knowledge_articles" ("slug", "category", "title_vi", "title_en", "expert_tip_vi", "expert_tip_en", "content_structure") 
VALUES (
    'utaut-model-guide', 
    'Research Models', 
    'MÃ´ hÃ¬nh UTAUT: Sá»± thá»‘ng nháº¥t cÃ¡c lÃ½ thuyáº¿t cháº¥p nháº­n cÃ´ng nghá»‡', 
    'UTAUT Model: The Unified Theory of Acceptance and Use of Technology', 
    'UTAUT cÃ³ kháº£ nÄƒng giáº£i thÃ­ch tá»›i 70% phÆ°Æ¡ng sai cá»§a Ã½ Ä‘á»‹nh. Äá»«ng quÃªn sá»­ dá»¥ng cÃ¡c biáº¿n Ä‘iá»u tiáº¿t nhÆ° Tuá»•i, Giá»›i tÃ­nh, Kinh nghiá»‡m.', 
    'UTAUT explains up to 70% of variance. Always include moderators like Age, Gender, and Experience for high-impact results.', 
    $$[
        {"h2_vi":"1. Táº¡i sao UTAUT láº¡i máº¡nh máº½ hÆ¡n TAM?","h2_en":"1. Why UTAUT outshines TAM?","content_vi":"Venkatesh (2003) Ä‘Ã£ tá»•ng há»£p 8 lÃ½ thuyáº¿t khÃ¡c nhau Ä‘á»ƒ táº¡o ra UTAUT. NÃ³ bao quÃ¡t hÆ¡n vÃ  cÃ³ Ä‘á»™ dá»± bÃ¡o cao hÆ¡n háº³n cÃ¡c mÃ´ hÃ¬nh Ä‘Æ¡n láº».","content_en":"Venkatesh (2003) synthesized 8 theories into UTAUT, offering superior predictive power compared to individual models."},
        {"h2_vi":"2. 4 NhÃ¢n tá»‘ cá»‘t lÃµi cá»§a UTAUT","h2_en":"2. The 4 Core Determinants","content_vi":"1. Ká»³ vá»ng hiá»‡u quáº£ (Performance Expectancy).\n2. Ká»³ vá»ng ná»— lá»±c (Effort Expectancy).\n3. áº¢nh hÆ°á»Ÿng xÃ£ há»™i (Social Influence).\n4. Äiá»u kiá»‡n thuáº­n lá»£i (Facilitating Conditions).","content_en":"1. Performance Expectancy.\n2. Effort Expectancy.\n3. Social Influence.\n4. Facilitating Conditions."},
        {"h2_vi":"3. PhÃ¢n tÃ­ch Ä‘iá»u tiáº¿t trÃªn ncsStat","h2_en":"3. Moderation Analysis on ncsStat","content_vi":"Sá»­ dá»¥ng tÃ­nh nÄƒng so sÃ¡nh Ä‘a nhÃ³m (Multi-group analysis) hoáº·c há»“i quy biáº¿n Ä‘iá»u tiáº¿t Ä‘á»ƒ kiá»ƒm chá»©ng sá»± khÃ¡c biá»‡t theo giá»›i tÃ­nh hoáº·c kinh nghiá»‡m.","content_en":"Use Multi-group analysis or moderated regression to verify differences across gender or experience categories."}
    ]$$
) ON CONFLICT (slug) DO UPDATE SET title_vi = EXCLUDED.title_vi, content_structure = EXCLUDED.content_structure;

