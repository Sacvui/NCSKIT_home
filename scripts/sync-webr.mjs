import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../node_modules/webr/dist');
const TARGET_DIR = path.join(__dirname, '../public/webr_core_v3');

const FILES_TO_SYNC = [
    'R.js',
    'R.wasm',
    'webr-worker.js',
    'libRblas.so',
    'libRlapack.so'
];

async function syncWebR() {
    console.log('🚀 Bắt đầu đồng bộ thư viện WebR...');

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error('❌ Lỗi: Không tìm thấy node_modules/webr. Hãy chạy npm install trước.');
        process.exit(1);
    }

    if (!fs.existsSync(TARGET_DIR)) {
        console.log(`📁 Tạo thư mục đích: ${TARGET_DIR}`);
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    for (const file of FILES_TO_SYNC) {
        const srcPath = path.join(SOURCE_DIR, file);
        const destPath = path.join(TARGET_DIR, file);

        if (fs.existsSync(srcPath)) {
            console.log(`✅ Đang sao chép: ${file}`);
            fs.copyFileSync(srcPath, destPath);
        } else {
            console.warn(`⚠️ Cảnh báo: Không tìm thấy file nguồn ${file}`);
        }
    }

    // Đồng bộ các thư mục con (vfs, webR)
    const subDirs = ['vfs', 'webR'];
    for (const dir of subDirs) {
        const srcDir = path.join(SOURCE_DIR, dir);
        const destDir = path.join(TARGET_DIR, dir);
        if (fs.existsSync(srcDir)) {
            console.log(`✅ Đang đồng bộ thư mục: ${dir}`);
            fs.cpSync(srcDir, destDir, { recursive: true });
        }
    }

    console.log('\n✨ Chúc mừng! WebR v3 đã được đồng bộ chuẩn hóa.');
    console.log('🔗 Path: /public/webr_core_v3/');
}

syncWebR().catch(err => {
    console.error('❌ Lỗi trong quá trình đồng bộ:', err);
});
