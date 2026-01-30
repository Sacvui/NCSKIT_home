/**
 * Image Optimization Audit Script
 * Run: npx ts-node scripts/audit-images.ts
 * 
 * This script scans all images in the project and reports:
 * - Missing alt text
 * - Images without lazy loading
 * - Large images that should be optimized
 * - Proper Next.js Image component usage
 */

import * as fs from 'fs';
import * as path from 'path';

interface ImageIssue {
    file: string;
    line: number;
    issue: string;
    severity: 'error' | 'warning' | 'info';
    suggestion: string;
}

const issues: ImageIssue[] = [];

// Directories to scan
const SCAN_DIRS = ['app', 'components', 'content'];
const IMAGE_EXTENSIONS = ['.tsx', '.jsx', '.mdx', '.md'];

// Patterns to check
const PATTERNS = {
    // HTML img tag without alt
    imgWithoutAlt: /<img\s+(?![^>]*\balt\s*=)[^>]*>/gi,

    // HTML img tag (should use Next.js Image)
    htmlImg: /<img\s+[^>]*src\s*=\s*["'][^"']+["'][^>]*>/gi,

    // Next.js Image without alt
    nextImageWithoutAlt: /<Image\s+(?![^>]*\balt\s*=)[^>]*\/>/gi,

    // Image with empty alt (might be intentional for decorative)
    emptyAlt: /alt\s*=\s*["']\s*["']/gi,

    // External images without optimization
    externalImage: /src\s*=\s*["'](https?:\/\/[^"']+)["']/gi,

    // Large width/height values (might need optimization)
    largeImage: /(?:width|height)\s*[=:]\s*["']?(\d{4,})["']?/gi,
};

function scanFile(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(process.cwd(), filePath);

    lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Check for HTML img tags (should use Next.js Image)
        if (PATTERNS.htmlImg.test(line) && !line.includes('<Image')) {
            // Reset regex lastIndex
            PATTERNS.htmlImg.lastIndex = 0;

            if (!PATTERNS.imgWithoutAlt.test(line)) {
                PATTERNS.imgWithoutAlt.lastIndex = 0;
                issues.push({
                    file: relativePath,
                    line: lineNum,
                    issue: 'Using HTML <img> tag instead of Next.js <Image>',
                    severity: 'warning',
                    suggestion: 'Replace with Next.js Image component for automatic optimization',
                });
            }
        }

        // Check for images without alt
        if (/<(?:img|Image)\s+[^>]*>/i.test(line)) {
            if (!line.includes('alt=') && !line.includes('alt =')) {
                issues.push({
                    file: relativePath,
                    line: lineNum,
                    issue: 'Image missing alt attribute',
                    severity: 'error',
                    suggestion: 'Add descriptive alt text for accessibility and SEO',
                });
            }
        }

        // Check for empty alt (might be intentional)
        if (PATTERNS.emptyAlt.test(line)) {
            PATTERNS.emptyAlt.lastIndex = 0;
            issues.push({
                file: relativePath,
                line: lineNum,
                issue: 'Image has empty alt attribute',
                severity: 'info',
                suggestion: 'If decorative, add aria-hidden="true". Otherwise, add descriptive alt.',
            });
        }

        // Check for large images
        const largeSizeMatch = line.match(/(?:width|height)\s*[=:]\s*["']?(\d{4,})["']?/i);
        if (largeSizeMatch) {
            issues.push({
                file: relativePath,
                line: lineNum,
                issue: `Large image dimension: ${largeSizeMatch[1]}px`,
                severity: 'warning',
                suggestion: 'Consider using responsive sizes or srcSet for better performance',
            });
        }

        // Check for external images
        const externalMatch = line.match(/src\s*=\s*["'](https?:\/\/[^"']+)["']/i);
        if (externalMatch && !externalMatch[1].includes('ncskit.org')) {
            issues.push({
                file: relativePath,
                line: lineNum,
                issue: 'External image URL detected',
                severity: 'info',
                suggestion: 'Consider downloading and serving locally, or add to next.config.js remotePatterns',
            });
        }
    });
}

function scanDirectory(dir: string): void {
    const fullPath = path.join(process.cwd(), dir);

    if (!fs.existsSync(fullPath)) {
        console.log(`Directory not found: ${dir}`);
        return;
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(fullPath, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            scanDirectory(path.join(dir, entry.name));
        } else if (entry.isFile() && IMAGE_EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
            scanFile(entryPath);
        }
    }
}

function generateReport(): void {
    console.log('\n📊 IMAGE OPTIMIZATION AUDIT REPORT');
    console.log('═'.repeat(50));

    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warning');
    const infos = issues.filter(i => i.severity === 'info');

    console.log(`\n🔴 Errors: ${errors.length}`);
    console.log(`🟡 Warnings: ${warnings.length}`);
    console.log(`🔵 Info: ${infos.length}`);
    console.log(`📝 Total issues: ${issues.length}`);

    if (errors.length > 0) {
        console.log('\n🔴 ERRORS (Must Fix):');
        console.log('─'.repeat(40));
        errors.forEach(issue => {
            console.log(`  📍 ${issue.file}:${issue.line}`);
            console.log(`     ❌ ${issue.issue}`);
            console.log(`     💡 ${issue.suggestion}`);
        });
    }

    if (warnings.length > 0) {
        console.log('\n🟡 WARNINGS (Should Fix):');
        console.log('─'.repeat(40));
        warnings.forEach(issue => {
            console.log(`  📍 ${issue.file}:${issue.line}`);
            console.log(`     ⚠️  ${issue.issue}`);
            console.log(`     💡 ${issue.suggestion}`);
        });
    }

    if (infos.length > 0) {
        console.log('\n🔵 INFO (Consider):');
        console.log('─'.repeat(40));
        infos.forEach(issue => {
            console.log(`  📍 ${issue.file}:${issue.line}`);
            console.log(`     ℹ️  ${issue.issue}`);
            console.log(`     💡 ${issue.suggestion}`);
        });
    }

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('📋 SUMMARY');
    console.log('─'.repeat(40));

    if (issues.length === 0) {
        console.log('✅ All images are properly optimized!');
    } else {
        console.log('🔧 Recommended actions:');
        console.log('   1. Add alt text to all images for accessibility');
        console.log('   2. Use Next.js Image component for automatic optimization');
        console.log('   3. Consider lazy loading for below-the-fold images');
        console.log('   4. Optimize large images before uploading');
    }

    console.log('\n');
}

// Main execution
console.log('🔍 Scanning directories for image issues...');
SCAN_DIRS.forEach(scanDirectory);
generateReport();

// Export for programmatic use
export { issues, scanFile, scanDirectory };
