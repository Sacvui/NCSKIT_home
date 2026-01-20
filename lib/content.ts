export type Locale = "en" | "vi";

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export type StatusCard = {
  title: string;
  summary: string;
  effort: string;
  tag: string;
};

export type StatusColumn = {
  id: "in-progress" | "ready";
  label: string;
  cards: StatusCard[];
};

export type HeroMetric = {
  value: string;
  label: string;
};

export type Feature = {
  title: string;
  description: string;
  bullets: string[];
};

export type ArchitectureTab = {
  id: "frontend" | "backend" | "data" | "flow";
  label: string;
  title: string;
  description: string;
  bullets: string[];
};

export type WorkflowStep = {
  title: string;
  description: string;
};

export type ApiHighlight = {
  title: string;
  detail: string;
};

export type ChangelogEntry = {
  version: string;
  date: string;
  summary: string;
};

export type ResourceCard = {
  title: string;
  description: string;
  href: string;
  label: string;
  download?: boolean;
};

export type BlogGroup = "economic" | "scientific";

export type BlogSubCategory = {
  title: string;
  description: string;
  anchor: string;
};

export type BlogCategory = {
  title: string;
  slug: string;
  anchor: string;
  description: string;
  excerpt: string;
  featured: string[];
  group: BlogGroup;
  children?: BlogSubCategory[];
};

export type AutoPhase = {
  title: string;
  subtitle: string;
  description: string;
  outputs: string[];
};

export type TechRequirement = {
  title: string;
  details: string[];
};

export type MarketingCard = {
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type TeamMember = {
  name: string;
  role: string;
  subtitle?: string;
  responsibilities?: string[];
  expertise?: string[];
  image?: string;
  isLead?: boolean;
};

export type CoreTeam = {
  eyebrow: string;
  title: string;
  description: string;
  members: TeamMember[];
  otherMembers: {
    role: string;
    count: number;
  }[];
};

export type SiteCopy = {
  nav: NavItem[];
  headerCtas: { readme: string; release: string };
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    primaryCta: string;
    secondaryCta: string;
    tags: string[];
    announcementLabel: string;
    announcementDescription: string;
    metrics: HeroMetric[];
  };
  status: {
    eyebrow: string;
    title: string;
    description: string;
    columns: StatusColumn[];
    terminalTitle: string;
    terminalLog: string;
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    list: Feature[];
  };
  architecture: {
    eyebrow: string;
    title: string;
    description: string;
    tabs: ArchitectureTab[];
    techStackTitle: string;
    techStack: { label: string; value: string }[];
    imageAlt: string;
  };
  workflow: {
    eyebrow: string;
    title: string;
    description: string;
    steps: WorkflowStep[];
    apiTitle: string;
    apiCta: string;
    apiHighlights: ApiHighlight[];
  };
  changelog: {
    eyebrow: string;
    title: string;
    description: string;
    entries: ChangelogEntry[];
  };
  marketing: {
    eyebrow: string;
    title: string;
    description: string;
    cards: MarketingCard[];
  };
  blog: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    groups: Record<
      BlogGroup,
      {
        label: string;
        description: string;
      }
    >;
    categories: BlogCategory[];
    tagsLabel: string;
    tags: string[];
  };
  automation: {
    eyebrow: string;
    title: string;
    description: string;
    phases: AutoPhase[];
  };
  techRequirements: {
    eyebrow: string;
    title: string;
    description: string;
    items: TechRequirement[];
  };
  resources: {
    eyebrow: string;
    title: string;
    cards: ResourceCard[];
  };
  release: {
    eyebrow: string;
    title: string;
    description: string;
    checklist: string[];
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    emailLabel: string;
    email: string;
    websiteLabel: string;
    website: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      needLabel: string;
      needPlaceholder: string;
      submit: string;
    };
  };
  footer: {
    text: string;
    note: string;
    links: { label: string; href: string }[];
  };
  language: {
    label: string;
    en: string;
    vi: string;
  };
  coreTeam: CoreTeam;
};

const navResearchChildren: Record<Locale, NavChild[]> = {
  en: [
    { label: "Research Lab", href: "/blog#blog-lab" },
    { label: "Knowledge Atlas", href: "/blog" },
    { label: "Research design", href: "/blog#blog-lab" },
    { label: "Data cleaning", href: "/blog#blog-lab" },
    { label: "Hypothesis testing", href: "/blog#blog-lab" },
    { label: "Advanced SEM / PLS", href: "/blog#blog-lab" },
  ],
  vi: [
    { label: "Phòng Lab Chạy Số", href: "/blog#blog-lab" },
    { label: "Góc nhìn Kinh tế", href: "/blog#blog-economics" },
    { label: "Kỹ năng Viết & Công bố", href: "/blog#blog-writing" },
  ],
};

const navFeaturesChildren: Record<Locale, NavChild[]> = {
  en: [
    { label: "Core Modules", href: "/features" },
    { label: "Architecture", href: "/architecture" },
    { label: "Workflow", href: "/workflow" },
    { label: "Automation", href: "/workflow#automation" },
  ],
  vi: [
    { label: "Phân hệ cốt lõi", href: "/features" },
    { label: "Quy trình nghiên cứu", href: "/workflow" },
  ],
};

const navResourcesChildren: Record<Locale, NavChild[]> = {
  en: [
    { label: "Documentation", href: "/resources" },
    { label: "Release Notes", href: "/releases" },
    { label: "Project README", href: "/docs/README.md" },
    { label: "Architecture", href: "/docs/ARCHITECTURE.md" },
  ],
  vi: [
    { label: "Hướng dẫn sử dụng", href: "/resources" },
  ],
};

const knowledgeNavChildren: Record<Locale, NavChild[]> = {
  en: [
    { label: "Marketing & Playbooks", href: "/blog#blog-marketing" },
    { label: "Street Economics", href: "/blog#blog-economics" },
    { label: "Research Lab Articles", href: "/blog#blog-lab" },
    { label: "Writing & Publication", href: "/blog#blog-writing" },
    { label: "Resource Vault", href: "/blog#blog-vault" },
  ],
  vi: [
    { label: "Marketing & Chiêu trò", href: "/blog#blog-marketing" },
    { label: "Kinh tế vỉa hè", href: "/blog#blog-economics" },
    { label: 'Phòng Lab "Chạy số"', href: "/blog#blog-lab" },
    { label: "Bút chiến học thuật", href: "/blog#blog-writing" },
    { label: "Kho đồ chơi nghiên cứu", href: "/blog#blog-vault" },
  ],
};

const blogTags = [
  "SPSS",
  "SmartPLS",
  "GenZ",
  "Crypto",
  "KPI",
  "Capstone",
  "Thesis",
  "Econometrics",
];

export const translations: Record<Locale, SiteCopy> = {
  en: {
    nav: [
      {
        label: "Features",
        href: "/features",
        children: navFeaturesChildren.en,
      },
      {
        label: "Knowledge",
        href: "/blog",
        children: navResearchChildren.en,
      },
      {
        label: "About",
        href: "/resources",
        children: navResourcesChildren.en,
      },
    ],
    headerCtas: {
      readme: "Project README",
      release: "Login",
    },
    hero: {
      eyebrow: "Whitepaper-aligned · ncskit.org",
      title: "Empowering Research for All Levels",
      lede:
        "NCSKIT IDE is a community-driven Research OS designed to automate the scientific workflow. Whether you're a beginner needing guidance or an expert seeking efficiency, we empower the Economics community to deliver professional, high-impact results.",
      primaryCta: "Download architecture brief",
      secondaryCta: "Review core modules",
      tags: ["No-Code Research Hub", "APA / ISI compliant", "Local & Secure"],
      announcementLabel: "Mission",
      announcementDescription:
        "Standardise and automate the entire research journey so scholars can focus on knowledge—not tooling.",
      metrics: [
        { value: "4 modules", label: "Ideation · Design · Analysis · Publishing" },
        { value: "9-step", label: "Quantitative flow baked in" },
        { value: "100% local", label: "Data residency & privacy" },
      ],
    },
    status: {
      eyebrow: "Mission control",
      title: "Value for every researcher.",
      description:
        "From guiding novices to standard outputs to accelerating expert workflows.",
      terminalTitle: "Field log",
      columns: [
        {
          id: "in-progress",
          label: "For Beginners",
          cards: [
            {
              title: "Guided Learning",
              summary: "Step-by-step guidance to produce standard research outputs without prior experience.",
              effort: "High Impact",
              tag: "Students",
            },
            {
              title: "Standardization",
              summary: "Automated templates ensure your thesis or capstone meets academic standards instantly.",
              effort: "High Quality",
              tag: "Novice",
            },
          ],
        },
        {
          id: "ready",
          label: "For Experts",
          cards: [
            {
              title: "Accelerated Workflow",
              summary: "Skip the tedious setup. Automate data cleaning and analysis to focus on insights.",
              effort: "Time Saver",
              tag: "PhD/Faculty",
            },
            {
              title: "Enhanced Quality",
              summary: "Advanced tools for deep analysis and ISI/Scopus compliant reporting.",
              effort: "Top Tier",
              tag: "Expert",
            },
          ],
        },
      ],
      terminalLog: `$ ncskit mission --whitepaper
→ Ideation Lab syncing AI assistant + literature builder
→ Design Studio finalising survey + model templates
→ Analysis Hub bundling Smart Grid, Auto-Stats, Auto-Viz
→ Publishing Center polishing 1-click DOCX/PDF exports
🎉  All modules aligned with ncskit.org release brief`,
    },
    features: {
      eyebrow: "Core modules",
      title: "The four pillars from the whitepaper.",
      description:
        "Each module mirrors the product brief: Ideation Lab, Design Studio, Analysis Hub, Publishing Center.",
      list: [
        {
          title: "Ideation Lab",
          description:
            "AI Research Assistant (RAG) summarises PDFs, builds literature reviews, and suggests hypotheses for any topic.",
          bullets: [
            "Chatbot tuned for academic prompts",
            "Auto literature synthesis & theory maps",
            "Hypothesis Builder leveraging historical data",
          ],
        },
        {
          title: "Design Studio",
          description:
            "Draw.io-powered model designer plus Survey Builder helps you turn ideas into SEM diagrams and ready-to-send questionnaires.",
          bullets: [
            "Drag-and-drop model designer (SEM/CFA)",
            "Survey Builder comparable to Qualtrics",
            "Flowcharts & research workflows in one view",
          ],
        },
        {
          title: "Analysis Hub",
          description:
            "Smart Grid + Auto-Stats bring data science to non-coders: T-test, ANOVA, Regression, Cronbach, EFA/CFA/SEM, and APA-grade charts.",
          bullets: [
            "Excel-like data cleaning with Smart Grid",
            "Auto-Stats selects the right test instantly",
            "Auto-Viz + AI interpretation for Results/Discussion",
          ],
        },
        {
          title: "Publishing Center",
          description:
            "Smart Editor, Citation Manager, and one-click exports produce DOCX/PDF manuscripts aligned with university or journal templates.",
          bullets: [
            "Markdown/LaTeX editor with live preview",
            "Citation Manager replacing EndNote/Zotero",
            "One-click APA/Scopus-ready exports",
          ],
        },
      ],
    },
    architecture: {
      eyebrow: "Scientific stack",
      title: "R & Python libraries choreographed for evidence-based publishing.",
      description:
        "NCSKIT is not a coding IDE. It is a collection of reproducible scripts, bilingual templates, and compliance playbooks.",
      tabs: [
        {
          id: "frontend",
          label: "Research canvas",
          title: "Evidence console",
          description: "Dashboards summarise progress across data, writing, and journal requirements.",
          bullets: [
            "Structured playbooks for theory, method, ethics",
            "Reference snippets for APA/PRISMA/CONSORT",
            "Exportable checklists for committees",
          ],
        },
        {
          id: "backend",
          label: "Python engine",
          title: "Python evidence engine",
          description: "pandas, statsmodels, scikit-learn, prophet cover descriptive to forecasting workloads.",
          bullets: [
            "Automated data-health checks",
            "Model registries for regression, SEM-lite, causal loops",
            "Notebook snapshots for reproducibility",
          ],
        },
        {
          id: "data",
          label: "R toolchain",
          title: "R methodology suite",
          description: "tidyverse, lavaan, psych, semTools, SmartPLS bridges for theory-driven studies.",
          bullets: [
            "Likert scaling & reliability macros",
            "lavaan syntax scaffolds with bilingual comments",
            "SmartPLS hand-off packages",
          ],
        },
        {
          id: "flow",
          label: "Publishing flow",
          title: "Upload → Peer-review loop",
          description: "Each phase is documented with evidence trails and bilingual summaries.",
          bullets: [
            "Dataset lineage & anonymisation logs",
            "AI drafting aid with human checkpoints",
            "Response matrices mapped to reviewer IDs",
          ],
        },
      ],
      techStackTitle: "Core toolchain",
      techStack: [
        { label: "Languages", value: "R (tidyverse, lavaan) · Python (pandas, scikit-learn)" },
        { label: "Stat suites", value: "SPSS bridge · SmartPLS sync · JASP hand-offs" },
        { label: "Visualisation", value: "ggplot2 · seaborn · Plotly" },
        { label: "Writing", value: "Quarto · LaTeX · APA 7th templates" },
        { label: "Workflow", value: "PRISMA · CONSORT · EQUATOR checklists" },
        { label: "Automation", value: "LangChain interpreters · Bilingual glossary" },
      ],
      imageAlt: "NCSKIT research console preview",
    },
    workflow: {
      eyebrow: "Research flows",
      title: "Quantitative, qualitative, and review pipelines — prebuilt.",
      description:
        "The whitepaper outlines three ready-to-use workflows so every team follows a proven path.",
      steps: [
        {
          title: "Quantitative Flow (9 bước)",
          description:
            "Data Health → Descriptive → Assumption tests → Reliability (Cronbach/EFA) → Correlation → Group comparisons → Regression/Modeling → Multivariate (PCA/SEM) → Export & reporting.",
        },
        {
          title: "Qualitative Flow",
          description:
            "Transcription → Coding (Open/Axial) → Thematic analysis → Validation (member checking) → Export insight deck.",
        },
        {
          title: "Systematic Review Flow",
          description:
            "Search strategy → PRISMA screening → Quality assessment → Narrative or meta-analysis synthesis → Export structured review.",
        },
      ],
      apiTitle: "Value propositions",
      apiCta: "Download checklist",
      apiHighlights: [
        {
          title: "No-Code 100%",
          detail: "All analytics accessible without writing Python/R; AI interprets the output.",
        },
        {
          title: "All-in-One & Local",
          detail: "Replace Word, Excel, SPSS, EndNote with one desktop app storing files on-device.",
        },
        {
          title: "Standardised Deliverables",
          detail: "APA/PRISMA compliant templates plus bilingual narratives for ISI/Scopus reviewers.",
        },
      ],
    },
    changelog: {
      eyebrow: "Field notes",
      title: "Milestones as ncskit.org matures.",
      description: "Every release sharpens the path from Vietnamese data to international recognition.",
      entries: [
        {
          version: "2.1",
          date: "Nov 21, 2025",
          summary: "Bilingual ethics templates and structured data rooms for Scopus submissions.",
        },
        {
          version: "2.0",
          date: "Oct 29, 2025",
          summary: "Launched SEO-ready blog hub and SmartPLS hand-off scripts.",
        },
        {
          version: "1.7",
          date: "Sep 29, 2025",
          summary: "Introduced reviewer-response generator and APA automation.",
        },
        {
          version: "1.6",
          date: "Sep 12, 2025",
          summary: "Released R/Python reproducibility starter kits for quantitative studies.",
        },
      ],
    },
    marketing: {
      eyebrow: "Go-to-market",
      title: "Positioning the research OS for students, labs, and partners.",
      description:
        "This hub centralises messaging so community managers, ambassadors, and partners can communicate consistently.",
      cards: [
        {
          title: "Narrative & Differentiators",
          description:
            "Explain why NCSKIT matters now: a Vietnamese-built research OS that removes tool chaos and accelerates international publications.",
          bullets: [
            "All-in-one: ideation, data, writing, publishing",
            "Bilingual by design for local + global audiences",
            "Collaboration-ready for labs, universities, and ministries",
          ],
          ctaLabel: "Copy value props",
          ctaHref: "#hero",
        },
        {
          title: "Audience Playbooks",
          description: "Tailored storyboards for students, faculty, research offices, and corporate R&D teams.",
          bullets: [
            "Students: from topic validation to defence-ready manuscripts",
            "Faculty: manage cohorts, enforce methodology, speed up reviews",
            "Enterprise: compress market studies with governed data rooms",
          ],
          ctaLabel: "Download messaging sheet",
          ctaHref: "/docs/WHITEPAPER.md",
        },
        {
          title: "Campaign & SEO hooks",
          description: "Starter angles for events, webinars, and content marketing that resonate with the ecosystem.",
          bullets: [
            "“From thesis to journal in 90 days” workshop series",
            "Partnership stories with Vietnamese universities",
            "Technical deep dives on R/Python + SmartPLS automation",
          ],
          ctaLabel: "View campaign ideas",
          ctaHref: "/blog",
        },
      ],
    },
    blog: {
      eyebrow: "Knowledge atlas",
      title: "Blog categories to boost SEO & community learning.",
      description:
        "Two layers: accessible economics for traffic, and technical research content for authority.",
      ctaLabel: "Open full blog",
      groups: {
        economic: {
          label: "Economic Knowledge Group",
          description:
            "High-volume keywords around marketing psychology, management, and street economics that pull in the broader audience.",
        },
        scientific: {
          label: "Scientific Research Group",
          description:
            "Deep-dive lab notes, methodology explainers, and academic writing guides that build authority with reviewers.",
        },
      },
      categories: [
        {
          title: "Marketing & Những Cú Lừa",
          slug: "/marketing-thuc-chien",
          anchor: "blog-marketing",
          description: "Behavioral economics meets street-smart branding tactics.",
          excerpt: "Decode FOMO, anchoring, and seeding tricks through Vietnamese case studies.",
          featured: ["4P/7P remix", "Decoy effect", "Seeding scandals"],
          group: "economic",
        },
        {
          title: "Quản Trị & Drama Công Sở",
          slug: "/quan-tri-nhan-su",
          anchor: "blog-management",
          description: "Leadership and HRM frameworks translated for real offices.",
          excerpt: "Maslow, Herzberg, KPI vs OKR explained with humor but backed by theory.",
          featured: ["Maslow reality check", "X-Y theory with Gen Z teams", "KPI vs OKR"],
          group: "economic",
        },
        {
          title: "Kinh Tế Vỉa Hè",
          slug: "/kinh-te-hoc-doi-song",
          anchor: "blog-economics",
          description: "Macro & micro economics retold via phở bowls, gas prices, and gold shops.",
          excerpt: "Google loves the silo, readers love the analogies.",
          featured: ["Inflation & bánh mì", "Fuel surcharges", "Opportunity cost of love"],
          group: "economic",
        },
        {
          title: 'Phòng Lab "Chạy Số"',
          slug: "/phuong-phap-nghien-cuu",
          anchor: "blog-lab",
          description: "Turn fear of numbers into joy with step-by-step research methods.",
          excerpt: "Split into four sub-categories for sampling, cleaning, testing, and SEM.",
          featured: ["Sampling cheat-sheets", "Cronbach & EFA macros", "SmartPLS pipelines"],
          group: "scientific",
          children: [
            {
              title: "Research design",
              description: "Sampling, questionnaires, Likert scales, conceptual models.",
              anchor: "blog-lab-design",
            },
            {
              title: "Data processing (SPSS/Excel)",
              description: "Cleaning, descriptive stats, Cronbach’s Alpha, EFA.",
              anchor: "blog-lab-data",
            },
            {
              title: "Hypothesis testing",
              description: "Pearson correlation, regression, T-test, ANOVA.",
              anchor: "blog-lab-hypothesis",
            },
            {
              title: "Advanced SEM / SmartPLS",
              description: "Reserved for deeper dives in future releases.",
              anchor: "blog-lab-advanced",
            },
          ],
        },
        {
          title: "Bút Chiến Học Thuật",
          slug: "/viet-va-cong-bo-quoc-te",
          anchor: "blog-writing",
          description: "Academic writing, citation mastery, and peer-review diplomacy.",
          excerpt: "From paraphrasing to answering reviewers, with bilingual examples.",
          featured: ["Paraphrase without plagiarism", "APA 7th survival kit", "Reviewer reply scripts"],
          group: "scientific",
        },
        {
          title: 'Kho "Đồ Chơi" nghiên cứu',
          slug: "/tai-nguyen-nghien-cuu",
          anchor: "blog-vault",
          description: "Download hub for datasets, slide decks, thesis templates, and book notes.",
          excerpt: "A backlink magnet and sharing hub for the community.",
          featured: ["Sample datasets", "Capstone slide decks", "Word thesis templates"],
          group: "scientific",
        },
      ],
      tagsLabel: "Popular tags",
      tags: blogTags,
    },
    automation: {
      eyebrow: "Automated zero-to-hero flow",
      title: "Six phases to generate an ISI/Scopus-ready manuscript.",
      description:
        "User delivers the soul (idea + data); the system delivers the body (structure + analysis + text).",
      phases: [
        {
          title: "Phase 0 · Ideation & Consulting",
          subtitle: "Brainstorming → Framework → Variable blueprint",
          description:
            "AI suggests topics, research questions, objectives, theories (TAM, UTAUT, SERVQUAL, TPB), and variable sets. Selections are saved to project_config.json / SQLite.",
          outputs: [
            "Shortlist of 3–5 research titles",
            "Research questions & objectives",
            "Chosen theoretical model + customised variables",
          ],
        },
        {
          title: "Phase 1 · Visual Modeling",
          subtitle: "Auto-drafted diagrams with Draw.io integration",
          description:
            "System auto-builds the model; user refines layout, arrows, and declares IV/DV/Mediator/Moderator roles. Relationships sync back to the blueprint.",
          outputs: [
            "Updated Draw.io XML",
            "Relationship map (A → B, polarity)",
          ],
        },
        {
          title: "Phase 2 · The Scholar",
          subtitle: "Literature-driven writing",
          description:
            "Semantic Scholar/ArXiv search generates Background, Gap, variable definitions, and hypothesis narratives.",
          outputs: [
            "sections/01_introduction.md",
            "sections/02_literature_review.md",
          ],
        },
        {
          title: "Phase 3 · The Analyst",
          subtitle: "Data mapping → Measurement → Structural analysis",
          description:
            "User uploads data and maps columns to variables. System handles cleaning, Cronbach/EFA/CFA, SEM/Regression, APA visuals, and writes Methodology/Results.",
          outputs: [
            "sections/03_methodology.md",
            "sections/04_results.md",
          ],
        },
        {
          title: "Phase 4 · The Author",
          subtitle: "Discussion & implications",
          description:
            "AI compares empirical results with hypotheses, cites supporting/contradicting studies, and drafts implications tailored to the context.",
          outputs: ["sections/05_discussion.md"],
        },
        {
          title: "Phase 5 · Final Assembly",
          subtitle: "Merge · Format · Export",
          description:
            "All sections merge into the selected journal template (Word/PDF) with bibliography and appendices.",
          outputs: ["Camera-ready DOCX/PDF"],
        },
      ],
    },
    techRequirements: {
      eyebrow: "Technical requirements",
      title: "What we build next based on the whitepaper",
      description:
        "Each requirement unlocks the automated flow above.",
      items: [
        {
          title: "Ideation Wizard UI",
          details: [
            "Multi-step wizard for Phase 0 input",
            "Topic → Theory → Variable customisation → Confirmation",
            "Persists state per project",
          ],
        },
        {
          title: "Model storage",
          details: [
            "JSON/SQLite schema for `variables` & `relationships`",
            "Versioning per project with sync to Draw.io",
          ],
        },
        {
          title: "Two-way Draw.io integration",
          details: [
            "Parse Draw.io XML to capture arrows and roles",
            "Push updates back when AI auto-drafts or cleans up",
          ],
        },
      ],
    },
    resources: {
      eyebrow: "Resource vault",
      title: "Official documents for ncskit.org",
      cards: [
        {
          title: "ARCHITECTURE.md",
          description: "Operating model, R/Python stack, and publishing workflow diagrams.",
          href: "/docs/ARCHITECTURE.md",
          label: "Download",
          download: true,
        },
        {
          title: "README.md",
          description: "Overview, contribution guidelines, and release steps.",
          href: "/docs/README.md",
          label: "Download",
          download: true,
        },
        {
          title: "Brand assets",
          description: "Transparent logos, icons, and favicon for ncskit.org.",
          href: "/assets/logo.png",
          label: "Logo PNG",
        },
        {
          title: "Whitepaper & Marketing Brief",
          description: "Full product narrative that powers this website.",
          href: "/docs/WHITEPAPER.md",
          label: "Download",
          download: true,
        },
      ],
    },
    release: {
      eyebrow: "Release checklist",
      title: "ncskit.org official whitepaper site",
      description: "Every section now reflects the product whitepaper and marketing brief.",
      checklist: [
        "Tagline & mission mirrored from the whitepaper",
        "Core modules + research flows documented end-to-end",
        "USP & technical specs embedded across sections",
        "Downloads include README, ARCHITECTURE, WHITEPAPER",
      ],
      primaryCta: "Download installer",
      primaryHref: "https://drive.google.com/file/d/PLACEHOLDER/view?usp=sharing",
      secondaryCta: "Talk to the team",
      secondaryHref: "#contact",
    },
    contact: {
      eyebrow: "About the founder",
      title: "NCSKIT · Hải Rong Chơi",
      description:
        "Created by Hải Rong Chơi (Vietnam) to standardise research workflows for students, faculty, and analysts.",
      emailLabel: "Email",
      email: "support@ncskit.org",
      websiteLabel: "Official site",
      website: "https://ncskit.org",
      form: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        needLabel: "How can we help?",
        needPlaceholder: "Tell us about your research or publication goal",
        submit: "Send request",
      },
    },
    footer: {
      text: "© {year} NCSKIT · ncskit.org official website",
      note: "Crafted in Vietnam by Hải Rong Chơi · Empowering international publications.",
      links: [
        { label: "Home", href: "#hero" },
        { label: "Knowledge Hub", href: "/blog" },
        { label: "Contact", href: "#contact" },
      ],
    },
    language: {
      label: "Language",
      en: "EN",
      vi: "VI",
    },
    coreTeam: {
      eyebrow: "Our Team",
      title: "Meet the researchers and developers behind NCSKIT",
      description: "A multidisciplinary team of PhD candidates, data scientists, and engineers.",
      members: [
        {
          name: "Hải Rong Chơi",
          role: "Lead Developer & Research Scientist",
          subtitle: "PhD Candidate in Business Administration",
          image: "/images/team/hailp.jpg",
          isLead: true,
          responsibilities: [
            "System Architecture & Core Development",
            "Statistical Analysis Methodologies",
            "Research Design & Validation",
            "AI Analysis Tools Development",
            "Scientific Accuracy Assurance"
          ],
          expertise: ["Statistical Analysis", "SEM & Factor Analysis", "Research Methods", "Full-Stack Development", "Business Administration"]
        },
        {
          name: "Tín Nguyễn",
          role: "Head of Data & Research Operations",
          subtitle: "Master in Tourism & Hospitality Management",
          image: "/images/team/tin-nguyen.png",
          isLead: true,
          responsibilities: [
            "Research Data Strategy & Management",
            "Quantitative Analysis Supervision",
            "Data Quality Assurance & Validation",
            "Research Operations Optimization",
            "Academic Resource Curation"
          ],
          expertise: ["Data Mining", "Quantitative Analysis", "Research Operations", "Tourism Management", "Data Quality"]
        },
        {
          name: "Châu Carmen Nguyễn",
          role: "Strategic Partnerships & Scientific Lead",
          subtitle: "PhD Candidate in Business Administration",
          image: "/images/team/chau-carmen.png",
          isLead: true,
          responsibilities: [
            "Academic Partnership Development",
            "Scientific Research Strategy",
            "Community Engagement & Outreach",
            "Research Impact Assessment",
            "Strategic Planning"
          ],
          expertise: ["Strategic Management", "Academic Partnerships", "Scientific Writing", "Business Administration", "Leadership"]
        },
        {
          name: "Dr. Sarah Chen",
          role: "AI Research Lead",
          subtitle: "PhD in Computer Science (NLP)",
          image: "/images/team/sarah-chen.png",
          isLead: false,
          responsibilities: [
            "NLP Model Fine-tuning for Academic Text",
            "RAG System Optimization",
            "AI Ethics & Bias Mitigation",
            "Automated Literature Review System",
            "Semantic Search Implementation"
          ],
          expertise: ["Natural Language Processing", "Large Language Models", "AI Ethics", "Research Automation", "Machine Learning", "Python"]
        },
        {
          name: "Michael Ross",
          role: "Data Infrastructure Architect",
          subtitle: "Senior Data Engineer",
          image: "/images/team/michael-ross.png",
          isLead: false,
          responsibilities: [
            "Scalable Data Pipeline Design",
            "Cloud Infrastructure Management",
            "Data Security & Privacy Compliance",
            "Real-time Analytics Engine",
            "Database Optimization"
          ],
          expertise: ["Big Data Architecture", "Cloud Computing", "Data Security", "Scalable Systems", "PostgreSQL", "System Design"]
        },
        {
          name: "Elena Volkov",
          role: "UX/UI Research Lead",
          subtitle: "MSc in Human-Computer Interaction",
          image: "/images/team/elena-volkov.png",
          isLead: false,
          responsibilities: [
            "User Research & Usability Testing",
            "Interface Design & Prototyping",
            "Accessibility Standards Compliance",
            "User Journey Mapping",
            "Information Architecture"
          ],
          expertise: ["User Research", "Interaction Design", "Usability Testing", "Accessibility", "Figma", "User Psychology"]
        }
      ],
      otherMembers: []
    },
  },
  vi: {
    nav: [
      {
        label: "Tính năng",
        href: "/features",
        children: navFeaturesChildren.vi,
      },
      {
        label: "Kiến thức",
        href: "/blog",
        children: navResearchChildren.vi,
      },
      {
        label: "Về NCSKIT",
        href: "/resources",
        children: navResourcesChildren.vi,
      },
    ],
    headerCtas: {
      readme: "Tải README",
      release: "Đăng nhập",
    },
    hero: {
      eyebrow: "Whitepaper-aligned · ncskit.org",
      title: "NCSKIT - Giá trị thực cho mọi cấp độ nghiên cứu",
      lede:
        "NCSKIT IDE, được phát triển bởi Hải Rong Chơi, tự động hóa quy trình nghiên cứu khoa học. Dìu dắt người mới để ra bài chuẩn chỉnh, giúp chuyên gia rút ngắn thời gian và nâng cao chất lượng. Đóng góp thiết thực cho cộng đồng khoa học, đặc biệt là ngành Kinh tế.",
      primaryCta: "Tải bản giới thiệu",
      secondaryCta: "Xem các phân hệ",
      tags: ["Nền tảng nghiên cứu No-Code", "Chuẩn APA / ISI", "Bảo mật & Cục bộ"],
      announcementLabel: "Sứ mệnh",
      announcementDescription:
        "Chuẩn hoá và tự động hoá toàn bộ hành trình nghiên cứu để học giả tập trung vào tri thức—không phải công cụ.",
      metrics: [
        { value: "4 phân hệ", label: "Ý tưởng · Thiết kế · Phân tích · Công bố" },
        { value: "9 bước", label: "Quy trình định lượng tích hợp sẵn" },
        { value: "100% cục bộ", label: "Dữ liệu lưu trữ trên máy của bạn" },
      ],
    },
    status: {
      eyebrow: "Trung tâm điều hành",
      title: "Giải pháp cho mọi nhà nghiên cứu",
      description:
        "Từ sinh viên làm khóa luận đến giáo sư công bố quốc tế, NCSKIT tối ưu hóa mọi bước đi.",
      terminalTitle: "Nhật ký thực địa",
      columns: [
        {
          id: "in-progress",
          label: "Cho Người Mới",
          cards: [
            {
              title: "Dìu dắt từng bước",
              summary: "Hướng dẫn chi tiết để tạo ra sản phẩm nghiên cứu chuẩn chỉnh mà không cần kinh nghiệm.",
              effort: "Hiệu quả cao",
              tag: "Sinh viên",
            },
            {
              title: "Chuẩn hóa quy trình",
              summary: "Các mẫu tự động đảm bảo luận văn hoặc đồ án đạt chuẩn học thuật ngay lập tức.",
              effort: "Chất lượng",
              tag: "Người mới",
            },
          ],
        },
        {
          id: "ready",
          label: "Cho Chuyên Gia",
          cards: [
            {
              title: "Tốc độ & Hiệu quả",
              summary: "Bỏ qua các bước thiết lập nhàm chán. Tự động hóa làm sạch và phân tích dữ liệu.",
              effort: "Tiết kiệm thời gian",
              tag: "NCS/Giảng viên",
            },
            {
              title: "Nâng cao chất lượng",
              summary: "Công cụ chuyên sâu cho phân tích phức tạp và báo cáo chuẩn ISI/Scopus.",
              effort: "Đẳng cấp",
              tag: "Chuyên gia",
            },
          ],
        },
      ],
      terminalLog: `$ ncskit mission --whitepaper
→ Ideation Lab: Đồng bộ trợ lý AI + xây dựng tổng quan tài liệu
→ Design Studio: Hoàn thiện khảo sát + mẫu mô hình
→ Analysis Hub: Gói gọn Smart Grid, Auto-Stats, Auto-Viz
→ Publishing Center: Trau chuốt xuất bản DOCX/PDF 1 cú click
🎉  Tất cả phân hệ đã sẵn sàng theo bản tóm tắt phát hành ncskit.org`,
    },
    features: {
      eyebrow: "Phân hệ cốt lõi",
      title: "4 module giống hệt whitepaper.",
      description:
        "Ideation Lab, Design Studio, Analysis Hub, Publishing Center tạo thành chuỗi All-in-One.",
      list: [
        {
          title: "Ideation Lab",
          description:
            "AI Research Assistant (RAG) tóm tắt PDF, tổng hợp literature và gợi ý giả thuyết nghiên cứu.",
          bullets: [
            "Chatbot học thuật",
            "Auto literature review & khung lý thuyết",
            "Hypothesis Builder dựa trên dữ liệu lịch sử",
          ],
        },
        {
          title: "Design Studio",
          description:
            "Model Designer (Draw.io) + Survey Builder giúp biến ý tưởng thành mô hình và bảng hỏi.",
          bullets: [
            "Vẽ SEM/CFA/Flowchart chuẩn đẹp",
            "Survey Builder tương tự Qualtrics",
            "Template quy trình nghiên cứu rõ ràng",
          ],
        },
        {
          title: "Analysis Hub",
          description:
            "Smart Grid, Auto-Stats, Auto-Viz mang sức mạnh thống kê (T-test, ANOVA, Regression, Cronbach, EFA/CFA/SEM) tới người không chuyên.",
          bullets: [
            "Làm sạch dữ liệu như Excel",
            "Auto chọn phép kiểm định + viết diễn giải",
            "Biểu đồ chuẩn APA và báo cáo tự động",
          ],
        },
        {
          title: "Publishing Center",
          description:
            "Smart Editor + Citation Manager + One-click Export tạo DOCX/PDF đúng template trường/tạp chí.",
          bullets: [
            "Markdown/LaTeX preview realtime",
            "Quản lý trích dẫn thay EndNote/Zotero",
            "Xuất bản thảo chuẩn APA/Scopus",
          ],
        },
      ],
    },
    architecture: {
      eyebrow: "Kiến trúc khoa học",
      title: "Tập trung thư viện R & Python cho hành trình công bố.",
      description:
        "Không bàn về IDE lập trình, chỉ nói về workflow nghiên cứu, thư viện thống kê và chứng cứ.",
      tabs: [
        {
          id: "frontend",
          label: "Research canvas",
          title: "Bảng điều khiển minh chứng",
          description: "Dashboard song ngữ theo dõi dữ liệu, writing, yêu cầu tạp chí.",
          bullets: [
            "Playbook PRISMA/CONSORT",
            "Snippet APA 7th, checklist IRB",
            "Xuất nhanh tiến độ cho hội đồng",
          ],
        },
        {
          id: "backend",
          label: "Python engine",
          title: "Python Evidence Engine",
          description: "pandas, statsmodels, scikit-learn, prophet phục vụ thống kê & dự báo.",
          bullets: [
            "Đánh giá chất lượng dữ liệu",
            "Kho model regression, SEM-lite",
            "Notebook lưu vết kiểm toán",
          ],
        },
        {
          id: "data",
          label: "R toolchain",
          title: "Bộ thư viện R",
          description: "tidyverse, lavaan, psych, semTools, SmartPLS bridge cho định lượng nâng cao.",
          bullets: [
            "Thang đo Likert, reliability, EFA",
            "lavaan template chú thích song ngữ",
            "SmartPLS package dành cho reviewer",
          ],
        },
        {
          id: "flow",
          label: "Publishing flow",
          title: "Chu trình Upload → Peer review",
          description: "Ghi lại toàn bộ hành trình từ mẫu khảo sát tới phản hồi reviewer.",
          bullets: [
            "Log nguồn dữ liệu & ẩn danh",
            "AI viết nháp có kiểm duyệt",
            "Ma trận trả lời reviewer",
          ],
        },
      ],
      techStackTitle: "Hệ công cụ chính",
      techStack: [
        { label: "Ngôn ngữ", value: "R (tidyverse, lavaan) · Python (pandas, scikit-learn)" },
        { label: "Thống kê", value: "SPSS bridge · SmartPLS sync · JASP" },
        { label: "Trực quan", value: "ggplot2 · seaborn · Plotly" },
        { label: "Soạn thảo", value: "Quarto · LaTeX · Template APA" },
        { label: "Workflow", value: "PRISMA · CONSORT · EQUATOR" },
        { label: "Automation", value: "LangChain interpreters · Bilingual glossary" },
      ],
      imageAlt: "NCSKIT Research Console",
    },
    workflow: {
      eyebrow: "Research flows",
      title: "Flow dựng sẵn trong whitepaper.",
      description:
        "Mỗi flow được lưu trong project.json để người dùng tick tiến độ.",
      steps: [
        {
          title: "Flow Định lượng (9 bước)",
          description:
            "Data Health → Descriptive → Assumption → Cronbach/EFA → Correlation → T-test/ANOVA → Regression → Multivariate (PCA/SEM) → Export.",
        },
        {
          title: "Flow Định tính",
          description:
            "Transcription → Coding → Thematic analysis → Member checking → Export insight.",
        },
        {
          title: "Flow Tổng quan tài liệu",
          description:
            "Search strategy → PRISMA screening → Quality assessment → Synthesis → Export review.",
        },
      ],
      apiTitle: "USP theo whitepaper",
      apiCta: "Tải checklist",
      apiHighlights: [
        {
          title: "No-code 100%",
          detail: "Không cần viết Python/R vẫn chạy thống kê nâng cao.",
        },
        {
          title: "All-in-One & Local",
          detail: "Thay Word, Excel, SPSS, EndNote bằng 1 app, dữ liệu an toàn trên máy.",
        },
        {
          title: "Chuẩn hoá đầu ra",
          detail: "APA, PRISMA, citation song ngữ, đáp ứng tiêu chuẩn ISI/Scopus.",
        },
      ],
    },
    changelog: {
      eyebrow: "Field notes",
      title: "Mốc phát triển của ncskit.org",
      description: "Mỗi bản cập nhật giúp nhà nghiên cứu Việt Nam tiến gần hơn chuẩn quốc tế.",
      entries: [
        {
          version: "2.1",
          date: "21/11/2025",
          summary: "Cập nhật template đạo đức song ngữ + data room cho hồ sơ Scopus.",
        },
        {
          version: "2.0",
          date: "29/10/2025",
          summary: "Ra mắt blog SEO + script SmartPLS hand-off.",
        },
        {
          version: "1.7",
          date: "29/09/2025",
          summary: "Thêm trình tạo phản hồi reviewer và tự động APA 7th.",
        },
        {
          version: "1.6",
          date: "12/09/2025",
          summary: "Phát hành bộ notebook R/Python cho nghiên cứu định lượng.",
        },
      ],
    },
    marketing: {
      eyebrow: "Chiến dịch Marketing",
      title: "Truyền thông cho cộng đồng học thuật & đối tác.",
      description:
        "Cung cấp thông điệp thống nhất cho sinh viên, giảng viên, phòng R&D và doanh nghiệp.",
      cards: [
        {
          title: "Thông điệp & khác biệt",
          description:
            "Nhấn mạnh NCSKIT là Research OS do người Việt xây dựng, giải quyết sự rời rạc công cụ và đẩy nhanh công bố quốc tế.",
          bullets: [
            "All-in-one: Ideation → Publishing",
            "Song ngữ EN/VN cho mọi touchpoint",
            "Sẵn sàng cho phòng Lab, trường đại học, bộ ngành",
          ],
          ctaLabel: "Xem key message",
          ctaHref: "#hero",
        },
        {
          title: "Playbook từng nhóm",
          description:
            "Khung kể chuyện dành cho sinh viên, giảng viên, phòng quản lý khoa học, doanh nghiệp.",
          bullets: [
            "Sinh viên: từ chọn đề tài tới bảo vệ khoá luận",
            "Giảng viên: quản lý cohort, chuẩn hoá phương pháp",
            "Doanh nghiệp: rút ngắn nghiên cứu thị trường có kiểm soát",
          ],
          ctaLabel: "Tải messaging sheet",
          ctaHref: "/docs/WHITEPAPER.md",
        },
        {
          title: "Ý tưởng chiến dịch & SEO",
          description: "Gợi ý sự kiện, webinar, content pillar để thu hút cộng đồng.",
          bullets: [
            "Workshop “Từ ý tưởng tới bài ISI trong 90 ngày”",
            "Case study với các trường đại học tại Việt Nam",
            "Chuỗi bài kỹ thuật về R/Python + SmartPLS",
          ],
          ctaLabel: "Khám phá ý tưởng",
          ctaHref: "/blog",
        },
      ],
    },
    blog: {
      eyebrow: "Bản đồ tri thức",
      title: "Sitemap hai tầng chuẩn SEO nhưng vẫn “lầy” đúng chất.",
      description:
        "Nhóm Kiến Thức Kinh Tế hút traffic đại chúng, Nhóm Nghiên Cứu Học Thuật tạo authority, Kho Tài Nguyên hút backlink.",
      ctaLabel: "Truy cập blog",
      groups: {
        economic: {
          label: "Nhóm Kiến Thức Kinh Tế",
          description:
            "Những topic marketing, quản trị, kinh tế đời sống giúp giữ traffic ổn định và dễ viral.",
        },
        scientific: {
          label: "Nhóm Nghiên Cứu Học Thuật",
          description:
            "Phòng Lab, Academic Writing, Kho tài nguyên dùng để xây dựng trust với reviewer và Google Scholar.",
        },
      },
      categories: [
        {
          title: "Marketing & Những Cú Lừa",
          slug: "/marketing-thuc-chien",
          anchor: "blog-marketing",
          description: "Giải mã chiêu trò marketing, branding, digital qua lăng kính tâm lý hành vi.",
          excerpt: "FOMO, chim mồi, seeding – kể lại bằng ví dụ Việt Nam để người đọc share mạnh.",
          featured: ["4P/7P phiên bản Việt", "Hiệu ứng chim mồi", "Chiến thuật seeding"],
          group: "economic",
        },
        {
          title: "Quản trị & Drama công sở",
          slug: "/quan-tri-nhan-su",
          anchor: "blog-management",
          description: "Ứng dụng HRM, leadership vào xử lý sếp, quản lý nhân viên, sinh tồn nơi công sở.",
          excerpt: "Maslow, Herzberg, KPI/OKR được chuyển thành câu chuyện dí dỏm nhưng chuẩn mực.",
          featured: ["Tháp Maslow", "Thuyết X-Y & Gen Z", "KPI vs OKR"],
          group: "economic",
        },
        {
          title: "Kinh tế vỉa hè",
          slug: "/kinh-te-hoc-doi-song",
          anchor: "blog-economics",
          description: "Khái niệm vĩ mô/vi mô khó nhằn được giải thích bằng bát phở, tiền xăng, giá vàng.",
          excerpt: "Google bot dễ crawl, người đọc dễ hiểu, tăng dwell time.",
          featured: ["Lạm phát & bát phở", "Cung cầu chợ Bến Thành", "Chi phí cơ hội chuyện tình"],
          group: "economic",
        },
        {
          title: 'Phòng Lab "Chạy Số"',
          slug: "/phuong-phap-nghien-cuu",
          anchor: "blog-lab",
          description: "Hướng dẫn A-Z nghiên cứu định lượng/định tính, biến nỗi sợ số liệu thành niềm vui.",
          excerpt: "Chia thành 4 nhánh để Google hiểu cấu trúc silo, người đọc theo đúng kỹ năng cần học.",
          featured: ["Thiết kế nghiên cứu", "Cronbach & EFA", "SmartPLS pipeline"],
          group: "scientific",
          children: [
            {
              title: "Thiết kế nghiên cứu",
              description: "Chọn mẫu, bảng hỏi, thang đo Likert, mô hình khái niệm.",
              anchor: "blog-lab",
            },
            {
              title: "Xử lý dữ liệu (SPSS/Excel)",
              description: "Làm sạch dữ liệu, thống kê mô tả, Cronbach, EFA.",
              anchor: "blog-lab",
            },
            {
              title: "Kiểm định giả thuyết",
              description: "Tương quan Pearson, hồi quy, T-test, ANOVA.",
              anchor: "blog-lab",
            },
            {
              title: "Nâng cao (SEM/SmartPLS)",
              description: "Dự kiến triển khai giai đoạn sau.",
              anchor: "blog-lab",
            },
          ],
        },
        {
          title: "Bút chiến học thuật",
          slug: "/viet-va-cong-bo-quoc-te",
          anchor: "blog-writing",
          description: "Academic Writing, trích dẫn, quy trình nộp bài báo/hội thảo.",
          excerpt: "Từ paraphrasing tránh đạo văn tới trả lời reviewer.",
          featured: ["APA 7th", "Mendeley/Zotero", "Peer-review response"],
          group: "scientific",
        },
        {
          title: 'Kho "Đồ chơi" nghiên cứu',
          slug: "/tai-nguyen-nghien-cuu",
          anchor: "blog-vault",
          description: "Dataset mẫu, template slide, Word luận văn, ebook kinh tế.",
          excerpt: "Nam châm hút backlink và chia sẻ cộng đồng.",
          featured: ["Dataset .sav/.xlsx", "Template slide bảo vệ", "Word luận văn chuẩn"],
          group: "scientific",
        },
      ],
      tagsLabel: "Tag nổi bật",
      tags: blogTags,
    },
    automation: {
      eyebrow: "Flow tự động Zero-to-Hero",
      title: "6 phase tạo bài báo ISI/Scopus chỉ với vài thao tác.",
      description:
        "Người dùng cung cấp “Linh hồn” (Ý tưởng + Dữ liệu), hệ thống cung cấp “Thân thể” (Cấu trúc + Phân tích + Nội dung).",
      phases: [
        {
          title: "Phase 0 · Ideation & Consulting",
          subtitle: "Chọn đề tài → Lý thuyết → Blueprint biến",
          description:
            "AI gợi ý đề tài, câu hỏi, mục tiêu, mô hình (TAM, UTAUT, SERVQUAL, TPB…) và danh sách biến. Kết quả lưu vào project_config.json/SQLite.",
          outputs: [
            "Danh sách 3–5 đề tài + câu hỏi nghiên cứu",
            "Mục tiêu nghiên cứu",
            "Mô hình lý thuyết + biến tuỳ chỉnh",
          ],
        },
        {
          title: "Phase 1 · Visual Modeling",
          subtitle: "Vẽ sơ đồ tự động với Draw.io",
          description:
            "Hệ thống dựng sơ đồ, người dùng chỉnh layout, mũi tên, gán vai trò IV/DV/Mediator/Moderator. Quan hệ được sync ngược về blueprint.",
          outputs: [
            "XML Draw.io cập nhật",
            "Danh sách quan hệ (A → B, Positive/Negative)",
          ],
        },
        {
          title: "Phase 2 · The Scholar",
          subtitle: "Viết nền tảng học thuật",
          description:
            "Semantic Scholar/ArXiv được query theo keyword, sinh phần Introduction, Literature Review, Hypothesis Development.",
          outputs: [
            "sections/01_introduction.md",
            "sections/02_literature_review.md",
          ],
        },
        {
          title: "Phase 3 · The Analyst",
          subtitle: "Mapping dữ liệu → Measurement → Structural",
          description:
            "Người dùng upload Excel/CSV, kéo cột vào biến; hệ thống tự cleaning, Cronbach/EFA/CFA, SEM/Regression, biểu đồ APA và viết Methodology/Results.",
          outputs: [
            "sections/03_methodology.md",
            "sections/04_results.md",
          ],
        },
        {
          title: "Phase 4 · The Author",
          subtitle: "Discussion & Implication",
          description:
            "AI đối chiếu kết quả với giả thuyết, trích dẫn nghiên cứu liên quan và viết hàm ý theo bối cảnh (banking, marketing, v.v.).",
          outputs: ["sections/05_discussion.md"],
        },
        {
          title: "Phase 5 · Final Assembly",
          subtitle: "Ghép nội dung · Apply template · Xuất bản",
          description:
            "Toàn bộ sections được ghép và xuất DOCX/PDF theo template trường/tạp chí.",
          outputs: ["Bản Word/PDF camera-ready"],
        },
      ],
    },
    techRequirements: {
      eyebrow: "Yêu cầu kỹ thuật",
      title: "Những hạng mục sẽ build tiếp",
      description:
        "Đáp ứng flow tự động trong whitepaper.",
      items: [
        {
          title: "Ideation Wizard UI",
          details: [
            "Giao diện wizard nhiều bước cho Phase 0",
            "Nhập Topic → Theory → Biến → Xác nhận",
            "Lưu trạng thái theo từng project",
          ],
        },
        {
          title: "Model storage",
          details: [
            "Schema JSON/SQLite cho `variables` và `relationships`",
            "Đồng bộ 2 chiều với Draw.io",
          ],
        },
        {
          title: "Tích hợp Draw.io 2 chiều",
          details: [
            "Đọc XML để hiểu mũi tên/quan hệ user vẽ",
            "Push ngược khi AI tự động vẽ/chỉnh sửa",
          ],
        },
      ],
    },
    resources: {
      eyebrow: "Kho tài liệu",
      title: "Tài liệu chính thức của ncskit.org",
      cards: [
        {
          title: "ARCHITECTURE.md",
          description: "Mô hình vận hành nghiên cứu, thư viện R/Python, flow công bố.",
          href: "/docs/ARCHITECTURE.md",
          label: "Tải về",
          download: true,
        },
        {
          title: "README.md",
          description: "Tổng quan dự án, hướng dẫn đóng góp, bước release.",
          href: "/docs/README.md",
          label: "Tải về",
          download: true,
        },
        {
          title: "Brand assets",
          description: "Logo PNG nền trong, icon, favicon chuẩn ncskit.org.",
          href: "/assets/logo.png",
          label: "Logo PNG",
        },
        {
          title: "Whitepaper & Marketing Brief",
          description: "Tài liệu chuẩn hoá nội dung website và deck.",
          href: "/docs/WHITEPAPER.md",
          label: "Tải về",
          download: true,
        },
      ],
    },
    release: {
      eyebrow: "Checklist phát hành",
      title: "Trang whitepaper chính thức ncskit.org",
      description: "Toàn bộ copy đã được chuẩn hoá theo Product Whitepaper & Marketing Brief.",
      checklist: [
        "Tagline + sứ mệnh trích từ whitepaper",
        "4 module + flow nghiên cứu mô tả đầy đủ",
        "USP & thông số kỹ thuật xuất hiện xuyên suốt",
        "README / ARCHITECTURE / WHITEPAPER đều tải được",
      ],
      primaryCta: "Tải bộ cài đặt",
      primaryHref: "https://drive.google.com/file/d/PLACEHOLDER/view?usp=sharing",
      secondaryCta: "Liên hệ đội ngũ",
      secondaryHref: "#contact",
    },
    contact: {
      eyebrow: "Về tác giả",
      title: "NCSKIT · Hải Rong Chơi",
      description:
        "Được tạo bởi Nghiên cứu sinh ngành Quản lý nhằm chuẩn hoá quy trình nghiên cứu tại Việt Nam theo chuẩn ISI/Scopus.",
      emailLabel: "Email",
      email: "support@ncskit.org",
      websiteLabel: "Website chính thức",
      website: "https://ncskit.org",
      form: {
        nameLabel: "Tên",
        namePlaceholder: "Tên của bạn",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        needLabel: "Nhu cầu",
        needPlaceholder: "Bạn cần hỗ trợ về phần nào của quy trình nghiên cứu?",
        submit: "Gửi yêu cầu",
      },
    },
    footer: {
      text: "© {year} NCSKIT · Website chính thức ncskit.org",
      note: "Thực hiện tại Việt Nam bởi Hải Rong Chơi · Đồng hành cùng cộng đồng nghiên cứu.",
      links: [
        { label: "Trang chủ", href: "#hero" },
        { label: "Blog & Kiến thức", href: "/blog" },
        { label: "Liên hệ", href: "#contact" },
      ],
    },
    language: {
      label: "Ngôn ngữ",
      en: "EN",
      vi: "VI",
    },
    coreTeam: {
      eyebrow: "Đội ngũ",
      title: "Gặp gỡ các nhà nghiên cứu và lập trình viên đằng sau NCSKIT",
      description: "Một đội ngũ đa ngành gồm các nghiên cứu sinh, nhà khoa học dữ liệu và kỹ sư.",
      members: [
        {
          name: "Hải Rong Chơi",
          role: "Lead Developer & Research Scientist",
          subtitle: "Nghiên cứu sinh Quản trị Kinh doanh",
          image: "/images/team/hailp.jpg",
          isLead: true,
          responsibilities: [
            "Phát triển kiến trúc hệ thống và lập trình",
            "Triển khai phương pháp phân tích thống kê",
            "Thiết kế và kiểm định phương pháp nghiên cứu",
            "Phát triển công cụ phân tích AI",
            "Đảm bảo tính chính xác khoa học và chất lượng"
          ],
          expertise: ["Phân tích thống kê", "SEM & Phân tích nhân tố", "Phương pháp nghiên cứu", "Full-Stack Development", "Nghiên cứu sinh", "Quản trị Kinh doanh"]
        },
        {
          name: "Tín Nguyễn",
          role: "Head of Data & Research Operations",
          subtitle: "Thạc sĩ Quản trị Du lịch & Khách sạn",
          image: "/images/team/tin-nguyen.png",
          isLead: true,
          responsibilities: [
            "Chiến lược và Quản lý Dữ liệu Nghiên cứu",
            "Giám sát Phân tích Định lượng",
            "Đảm bảo Chất lượng Dữ liệu & Kiểm định",
            "Tối ưu hóa Quy trình Vận hành Nghiên cứu",
            "Quản lý Tài nguyên Học thuật"
          ],
          expertise: ["Khai phá dữ liệu", "Phân tích định lượng", "Vận hành nghiên cứu", "Quản trị Du lịch", "Chất lượng dữ liệu"]
        },
        {
          name: "Châu Carmen Nguyễn",
          role: "Strategic Partnerships & Scientific Lead",
          subtitle: "Nghiên cứu sinh Quản trị Kinh doanh",
          image: "/images/team/chau-carmen.png",
          isLead: true,
          responsibilities: [
            "Phát triển Đối tác Học thuật",
            "Chiến lược Nghiên cứu Khoa học",
            "Kết nối Cộng đồng & Mở rộng Mạng lưới",
            "Đánh giá Tác động Nghiên cứu",
            "Hoạch định Chiến lược"
          ],
          expertise: ["Quản trị chiến lược", "Hợp tác học thuật", "Viết bài khoa học", "Quản trị kinh doanh", "Lãnh đạo"]
        },
        {
          name: "Dr. Sarah Chen",
          role: "AI Research Lead",
          subtitle: "Tiến sĩ Khoa học Máy tính (NLP)",
          image: "/images/team/sarah-chen.png",
          isLead: false,
          responsibilities: [
            "Tinh chỉnh mô hình NLP cho văn bản học thuật",
            "Tối ưu hóa hệ thống RAG",
            "Đạo đức AI & Giảm thiểu thiên kiến",
            "Hệ thống tổng quan tài liệu tự động",
            "Triển khai tìm kiếm ngữ nghĩa"
          ],
          expertise: ["Xử lý ngôn ngữ tự nhiên", "Mô hình ngôn ngữ lớn", "Đạo đức AI", "Tự động hóa nghiên cứu", "Machine Learning", "Python"]
        },
        {
          name: "Michael Ross",
          role: "Data Infrastructure Architect",
          subtitle: "Kỹ sư Dữ liệu Cấp cao",
          image: "/images/team/michael-ross.png",
          isLead: false,
          responsibilities: [
            "Thiết kế đường ống dữ liệu mở rộng",
            "Quản lý hạ tầng đám mây",
            "Tuân thủ bảo mật & quyền riêng tư dữ liệu",
            "Công cụ phân tích thời gian thực",
            "Tối ưu hóa cơ sở dữ liệu"
          ],
          expertise: ["Kiến trúc Big Data", "Điện toán đám mây", "Bảo mật dữ liệu", "Hệ thống mở rộng", "PostgreSQL", "Thiết kế hệ thống"]
        },
        {
          name: "Elena Volkov",
          role: "UX/UI Research Lead",
          subtitle: "Thạc sĩ Tương tác Người-Máy",
          image: "/images/team/elena-volkov.png",
          isLead: false,
          responsibilities: [
            "Nghiên cứu người dùng & Kiểm thử khả năng sử dụng",
            "Thiết kế giao diện & Tạo mẫu",
            "Tuân thủ tiêu chuẩn khả năng tiếp cận",
            "Bản đồ hành trình người dùng",
            "Kiến trúc thông tin"
          ],
          expertise: ["Nghiên cứu người dùng", "Thiết kế tương tác", "Kiểm thử khả năng sử dụng", "Khả năng tiếp cận", "Figma", "Tâm lý học người dùng"]
        }
      ],
      otherMembers: []
    },
  },
};

export function getCopy(locale: Locale): SiteCopy {
  return translations[locale];
}

