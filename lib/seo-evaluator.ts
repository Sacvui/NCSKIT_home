/**
 * Content SEO & Academic Evaluator for ncsStat
 * Evaluates statistical content for search visibility (SEO) and academic authority.
 */

export interface SEOEvaluation {
  score: number; // 0-100
  academicScore: number; // 0-100
  readabilityScore: number; // 0-100
  checks: {
    id: string;
    label_vi: string;
    label_en: string;
    status: 'pass' | 'warning' | 'fail';
    message_vi: string;
    message_en: string;
  }[];
  keywords: {
    term: string;
    count: number;
    found: boolean;
  }[];
}

interface ArticleData {
  title_vi: string;
  title_en: string;
  content_structure: { h2_vi: string; h2_en: string; content_vi: string; content_en: string }[];
  expert_tip_vi: string;
  expert_tip_en: string;
  thresholds?: string;
}

const TARGET_KEYWORDS = [
  'Cronbach\'s Alpha', 'P-value', 'Tin cậy nội tại', 'Nhân tố', 'Hồi quy', 'Đa cộng tuyến', 
  'Significant', 'Hypothesis', 'Correlation', 'APA Standard', 'Mô hình SEM'
];

export function evaluateContent(article: ArticleData, locale: 'vi' | 'en' = 'vi'): SEOEvaluation {
  const isVi = locale === 'vi';
  const checks: SEOEvaluation['checks'] = [];
  const contentText = article.content_structure.map(s => isVi ? s.content_vi : s.content_en).join(' ');
  const titleText = isVi ? article.title_vi : article.title_en;
  const wordCount = contentText.split(/\s+/).length;

  let score = 0;
  let academicScore = 0;

  // 1. Title Length check
  if (titleText.length > 50) {
    checks.push({
      id: 'titleLength',
      label_vi: 'Độ dài tiêu đề', label_en: 'Title Length',
      status: 'pass',
      message_vi: 'Tiêu đề đủ dài để bao phủ từ khóa.', message_en: 'Title is descriptive enough.'
    });
    score += 15;
  } else {
    checks.push({
      id: 'titleLength',
      label_vi: 'Độ dài tiêu đề', label_en: 'Title Length',
      status: 'warning',
      message_vi: 'Tiêu đề hơi ngắn, nên thêm từ khóa như "Hướng dẫn phân tích".', message_en: 'Title is short, consider adding "Analysis Guide".'
    });
    score += 5;
  }

  // 2. Word count check
  if (wordCount > 600) {
    checks.push({
      id: 'wordCount',
      label_vi: 'Độ sâu nội dung', label_en: 'Content Depth',
      status: 'pass',
      message_vi: `Bài viết có ${wordCount} từ (Rất tốt cho SEO Authority).`, message_en: `Article has ${wordCount} words (Great for SEO Authority).`
    });
    score += 25;
  } else if (wordCount > 300) {
    checks.push({
      id: 'wordCount',
      label_vi: 'Độ sâu nội dung', label_en: 'Content Depth',
      status: 'warning',
      message_vi: `Bài viết chỉ có ${wordCount} từ (Nên đạt > 600 từ).`, message_en: `Article has ${wordCount} words (Target > 600 words).`
    });
    score += 10;
  } else {
    checks.push({
      id: 'wordCount',
      label_vi: 'Độ sâu nội dung', label_en: 'Content Depth',
      status: 'fail',
      message_vi: 'Nội dung quá ngắn để Google xếp hạng cao.', message_en: 'Content too thin for Google ranking.'
    });
  }

  // 3. Heading Structure
  if (article.content_structure.length >= 3) {
    checks.push({
      id: 'headings',
      label_vi: 'Cấu trúc thẻ H2', label_en: 'H2 Structure',
      status: 'pass',
      message_vi: 'Có ít nhất 3 phần nội dung rõ ràng.', message_en: 'At least 3 clear sections found.'
    });
    score += 20;
  } else {
    checks.push({
      id: 'headings',
      label_vi: 'Cấu trúc thẻ H2', label_en: 'H2 Structure',
      status: 'warning',
      message_vi: 'Nên chia nhỏ bài viết thành nhiều đề mục H2 hơn.', message_en: 'Consider adding more H2 subheadings.'
    });
    score += 5;
  }

  // 4. Expert Tips & Thresholds (Academic)
  if (article.expert_tip_vi.length > 20) {
    checks.push({
      id: 'expertTip',
      label_vi: 'Mẹo từ Chuyên gia', label_en: 'Expert Insights',
      status: 'pass',
      message_vi: 'Có nhận định độc quyền từ ncsStat.', message_en: 'Exclusive ncsStat insights included.'
    });
    academicScore += 40;
  } else {
    checks.push({
      id: 'expertTip',
      label_vi: 'Mẹo từ Chuyên gia', label_en: 'Expert Insights',
      status: 'fail',
      message_vi: 'Thiếu lời khuyên thực tế từ chuyên gia.', message_en: 'Missing practical expert advice.'
    });
  }

  if (article.thresholds && article.thresholds.length > 3) {
    checks.push({
      id: 'thresholds',
      label_vi: 'Ngưỡng học thuật', label_en: 'Academic Thresholds',
      status: 'pass',
      message_vi: 'Đã cung cấp tiêu chuẩn so sánh (Cut-off values).', message_en: 'Standard cut-off values provided.'
    });
    academicScore += 40;
  } else {
    checks.push({
      id: 'thresholds',
      label_vi: 'Ngưỡng học thuật', label_en: 'Academic Thresholds',
      status: 'warning',
      message_vi: 'Nên thêm các ngưỡng như r > .3, alpha > .7.', message_en: 'Add thresholds like r > .3, alpha > .7.'
    });
    academicScore += 10;
  }

  // 5. Keyword presence
  const keywordsFound = TARGET_KEYWORDS.filter(kw => 
    contentText.toLowerCase().includes(kw.toLowerCase()) || 
    titleText.toLowerCase().includes(kw.toLowerCase())
  );
  
  if (keywordsFound.length >= 4) {
    score += 20;
    academicScore += 20;
  }

  return {
    score: Math.min(100, score + (keywordsFound.length * 2)),
    academicScore: Math.min(100, academicScore),
    readabilityScore: 85, // Default for now
    checks,
    keywords: TARGET_KEYWORDS.map(kw => ({
      term: kw,
      count: contentText.split(kw).length - 1,
      found: contentText.toLowerCase().includes(kw.toLowerCase())
    }))
  };
}
