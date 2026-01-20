# Hướng Dẫn Cập Nhật Blog NCSKIT

## Tổng Quan

Blog của NCSKIT sử dụng **MDX format** (Markdown với JSX support) để quản lý nội dung. Tất cả các bài viết được lưu trong thư mục `content/blog/`.

## Cách Thêm Bài Viết Mới

### Bước 1: Tạo File Mới

1. Copy template:
   ```bash
   cp content/blog/_TEMPLATE.mdx content/blog/ten-bai-viet-cua-ban.mdx
   ```

2. Hoặc tạo file mới trong `content/blog/` với tên file là slug (không dấu, dùng dấu gạch ngang)

### Bước 2: Điền Frontmatter

Mở file và điền thông tin ở phần frontmatter (phần YAML ở đầu file):

```yaml
---
title: "Tiêu Đề Bài Viết"
slug: "ten-bai-viet-cua-ban"  # Phải trùng với tên file
summary: "Tóm tắt ngắn gọn về bài viết"
seoDescription: "Mô tả chi tiết cho SEO (150-160 ký tự)"
group: economic  # hoặc "scientific"
groupLabel: "Economic Knowledge Group"
category: blog-marketing  # blog-marketing | blog-governance | blog-lab | blog-writing
categoryLabel: "Marketing Psychology"
tags:
  - Tag1
  - Tag2
date: "2025-01-15"  # Định dạng YYYY-MM-DD
cover: "/assets/NCSKIT.png"  # Đường dẫn đến hình ảnh
authors:
  - "Tên Tác Giả"
---
```

### Bước 3: Viết Nội Dung

Sử dụng Markdown syntax để viết nội dung:

- **Headers:** `#`, `##`, `###`
- **Bold:** `**text**`
- **Italic:** `*text*`
- **Lists:** `- item` hoặc `1. item`
- **Links:** `[text](url)`
- **Images:** `![alt](path)`
- **Code blocks:** \`\`\`language\ncode\n\`\`\`

### Bước 4: Lưu và Kiểm Tra

1. Lưu file
2. Chạy dev server: `npm run dev`
3. Truy cập: `http://localhost:9090/blog`
4. Tìm bài viết của bạn trong danh sách

## Cách Chỉnh Sửa Bài Viết Cũ

1. Mở file trong `content/blog/ten-bai-viet.mdx`
2. Chỉnh sửa nội dung hoặc frontmatter
3. Lưu file - blog sẽ tự động cập nhật

## Các Category Có Sẵn

### Economic Knowledge Group

- **blog-marketing** - Marketing Psychology
- **blog-governance** - Governance & Policy

### Scientific Research Group

- **blog-lab** - Phòng Lab "Chạy Số"
- **blog-writing** - Academic Writing

## Ví Dụ Cấu Trúc

```markdown
---
title: "Tiêu Đề"
slug: "slug-bai-viet"
summary: "Tóm tắt"
seoDescription: "Mô tả SEO"
group: scientific
category: blog-lab
tags:
  - SEM
  - Research
date: "2025-01-15"
---

## Phần 1

Nội dung phần 1...

### Phần con

Nội dung phần con...

## Phần 2

Nội dung phần 2...
```

## Tính Năng Đặc Biệt

### Math Equations (LaTeX)

**Inline:** `$E = mc^2$` → $E = mc^2$

**Block:**
```latex
$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$
```

### Code Blocks

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

### Tables

| Cột 1 | Cột 2 |
|-------|-------|
| Dữ liệu 1 | Dữ liệu 2 |

## Tips

1. **Slug:** Nên dùng tiếng Anh, không dấu, dùng dấu gạch ngang
2. **Date:** Dùng format YYYY-MM-DD
3. **Tags:** Dùng tags nhất quán giữa các bài viết liên quan
4. **Images:** Lưu trong `public/assets/` hoặc `public/blog/`
5. **Preview:** Luôn kiểm tra trên localhost trước khi commit

## File Tham Khảo

- Template: `content/blog/_TEMPLATE.mdx`
- Hướng dẫn chi tiết: `content/blog/README.md`
- Ví dụ bài viết:
  - `content/blog/sem-blueprint-for-vn-labs.mdx`
  - `content/blog/fomo-economics-playbook.mdx`

## Troubleshooting

**Bài viết không hiện?**
- Kiểm tra tên file có khớp với slug không
- Kiểm tra frontmatter có đúng format YAML không
- Kiểm tra date có đúng format không

**Lỗi syntax?**
- Validate YAML frontmatter
- Kiểm tra các dấu ngoặc trong Markdown
- Đảm bảo code blocks được đóng đúng cách

