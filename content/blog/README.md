# Blog Content Guide

This directory contains all blog posts for the NCSKIT website. Blog posts are written in **MDX format** (Markdown with JSX support).

## Quick Start

### Adding a New Blog Post

1. **Copy the template:**
   ```bash
   cp content/blog/_TEMPLATE.mdx content/blog/your-post-slug.mdx
   ```

2. **Edit the frontmatter** (the YAML section at the top):
   - `title`: The main title of your post
   - `slug`: URL-friendly identifier (use hyphens, no spaces)
   - `summary`: One-sentence summary (shown in blog listings)
   - `seoDescription`: SEO meta description (150-160 characters)
   - `group`: Either `economic` or `scientific`
   - `category`: One of:
     - `blog-marketing` - Marketing Psychology
     - `blog-governance` - Governance & Policy
     - `blog-lab` - Phòng Lab "Chạy Số" (Scientific Research)
     - `blog-writing` - Academic Writing
   - `tags`: Array of relevant tags
   - `date`: Publication date (YYYY-MM-DD format)
   - `cover`: Path to cover image (default: `/assets/NCSKIT.png`)
   - `authors`: Array of author names

3. **Write your content** using Markdown syntax

4. **Save and commit** - The blog will automatically rebuild

## Frontmatter Reference

### Required Fields

- `title` - Post title
- `slug` - URL slug (should match filename without .mdx)
- `summary` - Brief summary
- `date` - Publication date (YYYY-MM-DD)
- `group` - Either `economic` or `scientific`
- `category` - One of the category slugs above

### Optional Fields

- `seoDescription` - Override auto-generated SEO description
- `readingTime` - Override auto-calculated reading time
- `updated` - Last update date (YYYY-MM-DD)
- `cover` - Cover image path
- `authors` - Array of author names
- `tags` - Array of tags

## Categories and Groups

### Groups

- **economic** - Economic Knowledge Group
  - Marketing Psychology
  - Governance & Policy
- **scientific** - Scientific Research Group
  - Phòng Lab "Chạy Số"
  - Academic Writing

### Categories

- `blog-marketing` - Marketing Psychology (Economic group)
- `blog-governance` - Governance & Policy (Economic group)
- `blog-lab` - Phòng Lab "Chạy Số" (Scientific group)
- `blog-writing` - Academic Writing (Scientific group)

## Markdown Features

### Supported Syntax

- Headers: `#`, `##`, `###`
- **Bold** and *italic* text
- Lists (ordered and unordered)
- Links and images
- Code blocks with syntax highlighting
- Tables
- Blockquotes

### Math Equations

Use LaTeX syntax:

**Inline math:** `$E = mc^2$` → $E = mc^2$

**Display math:**
```latex
$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$
```

### Code Blocks

Use fenced code blocks with language identifier:

\`\`\`python
def example():
    return "Hello, World!"
\`\`\`

## File Naming

- Use lowercase
- Use hyphens instead of spaces
- Match the `slug` field in frontmatter
- End with `.mdx`

**Example:** `content/blog/sem-blueprint-for-vn-labs.mdx`

## Best Practices

1. **Clear structure:** Use headers to organize content
2. **SEO-friendly:** Write descriptive summaries and titles
3. **Images:** Store images in `public/assets/` or `public/blog/`
4. **Links:** Use absolute paths for internal links (e.g., `/blog/other-post`)
5. **Tags:** Use consistent tags across related posts
6. **Date format:** Always use YYYY-MM-DD format

## Examples

See existing posts for reference:

- `sem-blueprint-for-vn-labs.mdx` - Scientific research post
- `fomo-economics-playbook.mdx` - Economic knowledge post
- `peer-review-response-kit.mdx` - Academic writing post

## Preview

After saving your `.mdx` file:

1. The blog will automatically rebuild (if running in dev mode)
2. Visit `http://localhost:9090/blog` to see all posts
3. Click on your post to preview it

## Troubleshooting

### Post not appearing?

- Check the filename matches the slug
- Verify the frontmatter is valid YAML
- Check the date is in the future (posts are sorted by date)
- Ensure the file is saved in `content/blog/` directory

### Syntax errors?

- Validate your YAML frontmatter
- Check for unmatched brackets in Markdown
- Ensure code blocks are properly closed

### Need help?

Check the template file `_TEMPLATE.mdx` for a complete example.

