# 🎓 NCSKIT IDE

> **Biến ý tưởng thành bài báo khoa học. Không cần lập trình.**

NCSKIT là một môi trường nghiên cứu tích hợp (Research IDE) mã nguồn mở, được xây dựng dựa trên lõi VS Code. Khác với các công cụ lập trình truyền thống, NCSKIT ẩn đi các dòng code phức tạp, cung cấp giao diện kéo-thả (No-code) giúp sinh viên, giảng viên và nhà khoa học thực hiện quy trình nghiên cứu từ A đến Z: Từ lên ý tưởng, thu thập dữ liệu, phân tích thống kê đến xuất bản bài báo chuẩn format.

![NCSKIT Logo](image/logo.png)

## ✨ Tại sao chọn NCSKIT?

Nhà nghiên cứu hiện nay đang bị "ngập" trong quá nhiều công cụ rời rạc: Word, Excel, SPSS, EndNote, Draw.io... NCSKIT giải quyết sự phân mảnh này bằng cách đưa tất cả vào một nơi:

*   **Quy trình chuẩn hóa:** Hỗ trợ Flow cho nghiên cứu Định lượng, Định tính và Tổng quan tài liệu.
*   **Trợ lý AI (RAG):** Chat với tài liệu PDF, tự động tóm tắt và gợi ý ý tưởng.
*   **Phân tích tự động:** Kéo thả file Excel -> Nhận về biểu đồ và kết quả kiểm định (T-test, ANOVA...) kèm văn bản nhận xét.
*   **Mọi thứ là File:** Dữ liệu lưu trữ cục bộ, an toàn tuyệt đối, dễ dàng sao lưu.

## 🚀 Tính năng chính (Key Modules)

### 1. 💡 Ideation Lab (Phòng ý tưởng)
*   Chatbot AI đóng vai trò người hướng dẫn (Supervisor).
*   Kiểm tra trùng lặp đề tài qua API Scholar/ArXiv.
*   Xây dựng khung lý thuyết và giả thuyết nghiên cứu.

### 2. 🎨 Design Studio (Xưởng thiết kế)
*   **Model Designer:** Tích hợp **Draw.io** để vẽ mô hình nghiên cứu (SEM, Flowchart).
*   **Survey Builder:** Tích hợp **SurveyJS** để tạo bảng hỏi và xuất ra Google Forms/PDF.

### 3. 📊 Data & Analysis Hub (Trung tâm dữ liệu)
*   **Smart Grid:** Xem và làm sạch dữ liệu (như Excel).
*   **Auto-Stats:** Chọn biến -> Hệ thống tự chọn phép kiểm định phù hợp.
*   **Auto-Viz:** Tự động vẽ biểu đồ chuẩn APA (đen trắng, không lưới) bằng Plotly.

### 4. 📝 Writing & Publishing (Soạn thảo & Xuất bản)
*   Trình soạn thảo Markdown/LaTeX với chế độ xem trước (Live Preview).
*   **Citation Manager:** Quản lý trích dẫn tự động (thay thế Zotero).
*   **Compiler:** Xuất ra file Word (.docx) hoặc PDF theo Template của trường đại học/tạp chí chỉ với 1 cú click.

## 🛠 Cài đặt (Installation)

### Yêu cầu hệ thống
*   OS: Windows, macOS, hoặc Linux.
*   RAM: Tối thiểu 8GB (để chạy AI local).

### Tải về (Release)
Truy cập [Releases Page](#) để tải bộ cài đặt `.exe` hoặc `.dmg` mới nhất.

### Dành cho Developer (Build from source)
```bash
# 1. Clone dự án
git clone https://github.com/username/scholarflow.git

# 2. Cài đặt dependencies (Node.js & Python)
cd scholarflow
npm install
pip install -r requirements.txt

# 3. Chạy môi trường dev
npm run watch
```

## 🤝 Đóng góp
Dự án này là Open Source. Chúng tôi hoan nghênh mọi đóng góp về tính năng, sửa lỗi và thêm các Template báo cáo mới.

## 📜 Giấy phép
MIT License.

## ℹ️ About NCSKIT & Author

- **Tác giả:** Hải Rong Chơi – Nghiên cứu sinh tiến sĩ ngành Kinh tế, người sáng lập nền tảng NCSKIT.
- **Website:** [lehai.edu.vn](https://lehai.edu.vn) · **Email:** hello@lehai.edu.vn
- **Sứ mệnh:** Chuẩn hóa toàn bộ hành trình nghiên cứu (Ideation → Design → Analysis → Publishing) bằng giao diện No-code thân thiện.
- **Nhận diện thương hiệu:** Logo/biểu tượng được lưu tại `assets/` và `image/`, đồng bộ vào VS Code bằng `apply-branding.ps1`.

> Trong IDE, mở `Ctrl+Shift+P → NCSKIT: About & Credits` để xem trang giới thiệu, logo và thông tin tác giả trực tiếp.

## 🔁 Research Workflows & Checklist

- Khi tạo project, `project.json` lưu workflow (`quantitative`, `qualitative`, `mixed`, `literature`). Có thể đổi bằng command palette `NCSKIT: Select Research Flow`.
- Analysis Hub hiển thị **checklist theo workflow** (Data Health, Reliability, Regression, …). Mỗi phép phân tích chạy thành công sẽ tự đánh dấu ✅ và lưu lại vào `project.json`.
- Các flow định tính / tổng quan tài liệu vẫn liệt kê checklist thủ công giúp người dùng theo dõi tiến độ (coding, thematic analysis, PRISMA...).

## 🔧 Trạng thái hiện tại (MVP)

Phiên bản VS Code OSS hiện tại đã hiện thực trọn bộ dịch vụ FastAPI trong `backend/server.py`:

| Module | Endpoint | Chức năng | Ghi chú |
| --- | --- | --- | --- |
| **Analysis Hub** | `POST /api/analysis/upload` | Nhận CSV/XLSX, sinh metadata cột (kiểu dữ liệu, missing, sample values) + preview 100 dòng | Khớp với yêu cầu Smart Grid trong webview React |
|  | `POST /api/analysis/data-health` | Trả báo cáo missing, zero variance, thống kê nhanh cho từng cột được chọn | Giúp tái tạo bước “Data health” trong backup |
|  | `POST /api/analysis/descriptive` | Thống kê mô tả (mean, std, skew, kurtosis) + categorical summary | Sẵn sàng ghi lại vào tài liệu kết quả |
|  | `POST /api/analysis/analyze/correlation` | Ma trận tương quan Pearson/Spearman/Kendall + ma trận p-value | Tự động bỏ dòng thiếu và đổi kiểu số |
|  | `POST /api/analysis/analyze/t-test` | T-test độc lập với tùy chọn equal variance | Trả t-statistic, p-value, mean diff, kích thước mẫu mỗi nhóm |
|  | `POST /api/analysis/analyze/anova` | One-way ANOVA cho biến nhóm bất kỳ | Trả F, p và thống kê mô tả từng group |
|  | `POST /api/analysis/analyze/regression` | Hồi quy OLS (đa biến, có/không intercept) | Xuất hệ số, p-value, R², bảng ANOVA summary |
|  | `POST /api/analysis/analyze/cronbach` | Cronbach’s alpha cho danh sách biến Likert | Hoàn thiện bước Reliability trong flow cũ |
| **Ideation Lab** | `POST /api/chat/completion` | API mock cho chatbot AI, dùng để kiểm thử UI và flow lệnh | Sẵn sàng gắn LangChain/OpenAI/Ollama |
| **Publishing Center** | `POST /api/publishing/export` | Nhận nội dung Markdown và format đầu ra (`docx/pdf`), gọi `pandoc` để xuất file | Nếu thiếu Pandoc, API trả thông báo hướng dẫn cài đặt |

Các panel React (trong `src/panels/*`) giao tiếp với backend thông qua message từ VS Code extension (`src/extension.ts`). Bất kỳ thay đổi nào ở API cần được phản ánh ở lớp frontend tương ứng.

> Mỗi lần upload, backend gán một `datasetId` và lưu DataFrame vào bộ nhớ. Các endpoint phân tích có thể nhận `datasetId` (mặc định) hoặc inline `data` (nếu cần tiling). Frontend VS Code đã được cập nhật để tự động gửi `datasetId` sau khi upload.

### Liên kết với mã nguồn cũ (`NCSKIT_app_backup`)

Thư mục `NCSKIT_app_backup/` chứa prototype cũ (Tauri + R backend). Từ bản sao này chúng ta kế thừa:

- **Luồng Analyze**: `docs/q1q2-flow.md` và `r-analytics/` mô tả toàn bộ pipeline Data health → Descriptive → Reliability → Modeling. Các endpoint mới (data-health, descriptive, t-test, ANOVA, regression, Cronbach) được chuyển hóa từ flow này sang Python.
- **Mẫu giao diện**: `frontend/src/AnalysisPanel.tsx` cung cấp ý tưởng bố cục bảng kết quả, chart preview và flow Wizard.
- **R-side engine**: `r-analytics` minh họa cách gọi plumber API để chạy phép thống kê phức tạp; có thể dần chuyển logic này sang Python hoặc giữ nguyên R nếu cần.

> ✅ Mục tiêu ngắn hạn: hoàn thiện chuỗi Analyze → Interpret → Export dựa trên flow trong `NCSKIT_app_backup`, đồng thời giữ UI/UX đồng nhất trong VS Code.

## ▶️ Quickstart cho developer

1. Cài Node.js v22.20.0 và Python 3.11+.
2. Cài dependencies:
   ```bash
   npm install
   cd backend && pip install -r requirements.txt
   ```
3. Chạy backend:
   ```bash
    cd backend
    uvicorn server:app --reload --port 3004
   ```
4. Trong root, chạy `npm run watch` để hot-reload extension (hoặc dùng `build-ide.ps1` để tạo bản chạy thử).
5. Mở VS Code → `Run Extension` để kiểm tra các panel Ideation/Analysis/Design/Publishing.

## 🏭 Build NCSKIT IDE (standalone fork)

1. `npm install`
2. Tạo Python runtime nhúng (chạy một lần, cần Python 3.11 sẵn trên máy build): `pwsh ./tools/setup-python.ps1` (script sẽ tạo `runtime/python` và cài `backend/requirements.txt` bên trong).
3. `npm run compile`
4. `.\apply-branding.ps1`
5. `.\build-ide.ps1` (hoặc `build-full-ide.ps1`) để tạo bản VS Code OSS đã fork.
6. Chạy `LAUNCH_IDE.bat` hoặc copy `vscode_oss\NCSKIT.exe` cho người dùng cuối.
7. Build installer Windows: cài [Inno Setup 6](https://jrsoftware.org/isdl.php) → `.\installer\build-installer.ps1`. Script sẽ:
   - Đảm bảo runtime Python + backend được copy vào extension (`extensions/ncskit/{backend,runtime}`).
   - Chạy branding.
   - Đóng gói thành `installer\Output\NCSKIT_IDE_<version>.exe`.

⚠️ Người dùng cuối **không cần** cài Python/Node riêng: installer chứa runtime Python đã đóng gói sẵn; backend FastAPI chạy trực tiếp bằng executable nội bộ.

> Bản build sử dụng `vscode_oss/resources/app/product.json` đã chỉnh sửa: tắt Marketplace, telemetry, thay đổi license/url và nhận diện thương hiệu → người dùng chỉ thấy “NCSKIT IDE”, không cần cài extension thủ công.
