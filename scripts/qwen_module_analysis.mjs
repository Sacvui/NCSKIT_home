import fs from 'fs';
import http from 'http';

async function runModuleAnalysis(moduleName, files) {
    console.log(`Analyzing Module: ${moduleName}...`);
    let coreCode = '';
    for (const file of files) {
        if (fs.existsSync(file)) {
            coreCode += `\n--- FILE: ${file} ---\n` + fs.readFileSync(file, 'utf8').substring(0, 5000);
        }
    }

    const prompt = `
Bạn là một chuyên gia kiến trúc phần mềm. Hãy đánh giá CHUYÊN SÂU (DEEP ANALYSIS) về phân hệ [${moduleName}] của dự án NCSKit dựa trên mã nguồn bên dưới.

Tập trung vào:
1. Kiến trúc & Hiệu suất.
2. Các rủi ro tiềm ẩn.
3. Đề xuất cải tiến cụ thể.

MÃ NGUỒN PHÂN HỆ:
${coreCode}

TRẢ LỜI BẰNG TIẾNG VIỆT.
`;

    const postData = JSON.stringify({
        model: 'qwen3.5:9b',
        prompt: prompt,
        stream: true
    });

    const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            let buffer = '';
            res.on('data', (chunk) => {
                buffer += chunk.toString();
                let lines = buffer.split('\n');
                buffer = lines.pop();

                for (let line of lines) {
                    if (line.trim() === '') continue;
                    try {
                        const json = JSON.parse(line);
                        if (json.response) {
                            fs.appendFileSync('DEEP_ANALYSIS_REPORT.md', json.response);
                            process.stdout.write(json.response);
                        }
                    } catch (e) {}
                }
            });

            res.on('end', () => {
                fs.appendFileSync('DEEP_ANALYSIS_REPORT.md', '\n\n---\n\n');
                console.log(`\nModule ${moduleName} analysis complete.`);
                resolve();
            });
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    fs.writeFileSync('DEEP_ANALYSIS_REPORT.md', '# NCSKit Deep Analysis Report by Qwen AI\n\n');
    
    await runModuleAnalysis('WebR Analysis Engine', [
        'lib/webr/core.ts',
        'lib/webr-wrapper.ts',
        'lib/webr/package-loader.ts'
    ]);

    await runModuleAnalysis('Cite Check & Academic Integrity', [
        'app/cite-check/page.tsx'
    ]);

    console.log("All modules analyzed!");
}

main();
