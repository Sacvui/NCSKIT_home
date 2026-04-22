export const FALLBACK_ARTICLES: Record<string, any> = {
    'cronbach-alpha': {
        slug: 'cronbach-alpha', category: 'Scale Reliability',
        title_vi: 'Cronbach\'s Alpha: Đánh giá tính nhất quán nội tại Masterclass',
        title_en: 'Cronbach\'s Alpha: Internal Consistency Masterclass',
        expert_tip_vi: 'Hãy luôn kiểm tra cột "Cronbach\'s Alpha if Item Deleted". Nếu xóa một câu mà Alpha tăng mạnh, câu đó chính là "kẻ phá bĩnh" thang đo của bạn.',
        expert_tip_en: 'Look beyond the global Alpha. Check "Alpha if Item Deleted"—if removing an item spikes the score, that item is undermining your scale.',
        author: 'ncsStat Academic Team', updated_at: new Date().toISOString(),
        content_structure: [
            {
                h2_vi: '1. Cronbach\'s Alpha là gì? Tại sao phải "nhất quán"?',
                h2_en: '1. What is Cronbach\'s Alpha? The Need for Consistency',
                content_vi: `Hãy tưởng tượng bạn đang đo lường sự "Hoài nghi xanh" (Green Skepticism) của người tiêu dùng bằng 5 câu hỏi. Nếu một người trả lời "Rất đồng ý" ở câu 1 nhưng lại "Rất không đồng ý" ở câu 2 (trong khi cả hai cùng đo một nội dung), thì thang đo của bạn đang có vấn đề. Cronbach's Alpha chính là thước đo xem các câu hỏi đó có "về cùng một đội" hay không.`,
                content_en: `Imagine measuring "Green Skepticism" with 5 items. If a respondent strongly agrees with item 1 but strongly disagrees with item 2, your scale is flawed. Cronbach's Alpha tests if your items belong to the same "team."`
            }
        ]
    }
    // ... other fallbacks can be moved here
};

export const DEFAULT_ARTICLE = {
    slug: 'unknown', category: 'Academy Content', title_vi: 'Đang tải nội dung...', title_en: 'Loading Content...',
    expert_tip_vi: 'Đang tải...', expert_tip_en: 'Loading...', author: 'ncsStat', updated_at: new Date().toISOString(),
    content_structure: [{ h2_vi: 'Đang tải...', h2_en: 'Loading...', content_vi: 'Nội dung đang được hệ thống nạp từ thư viện tri thức...', content_en: 'Please wait while content is loading...' }]
};
