const fs = require('fs');
const file = 'd:/SE_Project/ncskt/ncskit_home/lib/constants/knowledge-fallbacks.ts';
let content = fs.readFileSync(file, 'utf8');

// Update author to Le Phuc Hai
content = content.replace(/author:\s*'[^']+'/g, "author: 'Le Phuc Hai'");

const seoTextVi = '\\n\\n*Bài viết được nghiên cứu và tổng hợp bởi **Lê Phúc Hải** (By Le Phuc Hai).*';
const seoTextEn = '\\n\\n*Researched and compiled by **Le Phuc Hai**.*';

// 1. For articles ending with hashtags, append before the hashtag block
content = content.replace(/(\\n#Mô hình nghiên cứu)/g, seoTextVi + '$1');
content = content.replace(/(\\n#ResearchModel)/g, seoTextEn + '$1');
// Catch other hashtag formats if any
content = content.replace(/(\\n#Thống kê)/g, seoTextVi + '$1');
content = content.replace(/(\\n#Statistics)/g, seoTextEn + '$1');
content = content.replace(/(\\n#Phân tích)/g, seoTextVi + '$1');
content = content.replace(/(\\n#Analysis)/g, seoTextEn + '$1');

// 2. For articles without hashtags (Cronbach's Alpha)
content = content.replace(/("về cùng một đội" hay không\.)/g, '$1' + seoTextVi);
content = content.replace(/(belong to the same "team\.")/g, '$1' + seoTextEn);

// 3. For 'what-is-a-research-model' which has no hashtag
content = content.replace(/(đóng góp khoa học\.)/g, '$1' + seoTextVi);
content = content.replace(/(scientific contribution\.)/g, '$1' + seoTextEn);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated fallbacks successfully.');
