import fs from 'fs';
import http from 'http';

async function runDeepAnalysis() {
    console.log("Reading project context...");
    const structure = fs.readFileSync('project_structure.txt', 'utf8');
    const coreCode = fs.readFileSync('qwen_deep_context.txt', 'utf8');

    const prompt = `
Bạn là một chuyên gia kiến trúc phần mềm và chuyên gia thống kê học thuật. 
Hãy đọc kỹ cấu trúc dự án và mã nguồn lõi bên dưới, sau đó đưa ra đánh giá CHI TIẾT và CHUYÊN SÂU (DEEP ANALYSIS) cho từng phân hệ của dự án NCSKit.

Yêu cầu đánh giá không được hời hợt, tập trung vào:
1. Kiến trúc hệ thống: Cách WebR được bao bọc (wrapper) và xử lý bất đồng bộ.
2. Logic nghiệp vụ: Độ chính xác của phân hệ Cite Check (Regex, API Crossref, bóc tách metadata).
3. Khả năng mở rộng: Cách thiết kế các template phân tích (SEM, CFA, Mediation).
4. Điểm yếu tiềm ẩn: Các rủi ro về bộ nhớ (WASM), Race conditions hoặc bảo mật API.
5. Đề xuất nâng cấp: Các bước cụ thể để đưa hệ thống lên quy mô lớn hơn.

CẤU TRÚC DỰ ÁN:
${structure}

MÃ NGUỒN LÕI:
${coreCode}

HÃY TRẢ LỜI BẰNG TIẾNG VIỆT, TRÌNH BÀY DẠNG BÁO CÁO KỸ THUẬT CHUYÊN SÂU.
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

    console.log("Sending to Qwen Local AI (qwen3.5:9b) with Streaming...");
    const reportFile = fs.createWriteStream('DEEP_ANALYSIS_REPORT.md');

    const req = http.request(options, (res) => {
        let buffer = '';
        res.on('data', (chunk) => {
            buffer += chunk.toString();
            let lines = buffer.split('\n');
            buffer = lines.pop(); // Keep partial line in buffer

            for (let line of lines) {
                if (line.trim() === '') continue;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        reportFile.write(json.response);
                        process.stdout.write(json.response);
                    }
                } catch (e) {
                    console.error("Parse error on line:", line);
                }
            }
        });

        res.on('end', () => {
            reportFile.end();
            console.log("\nAnalysis complete! Report saved to DEEP_ANALYSIS_REPORT.md");
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
}

runDeepAnalysis();
