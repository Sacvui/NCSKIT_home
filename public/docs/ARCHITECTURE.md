# 🏗 Kiến trúc Hệ thống NCSKIT

Tài liệu này mô tả cách NCSKIT được xây dựng trên nền tảng VS Code (Code OSS) và cách các thành phần tương tác với nhau.

## 1. High-Level Architecture (Kiến trúc tổng quan)

Hệ thống hoạt động theo mô hình **Client-Server cục bộ (Local Client-Server)**, được đóng gói trong một ứng dụng Desktop bằng Electron.

```mermaid
graph TD
    A[Electron Frontend (VS Code Core)] -->|IPC / JSON-RPC| B[Python Backend Service]
    
    subgraph Frontend [Giao diện Người dùng]
        A1[Workbench Layout]
        A2[Webview Panels (ReactJS)]
        A3[Monaco Editor]
    end
    
    subgraph Backend [Xử lý Logic & AI]
        B1[FastAPI Server]
        B2[Data Processing (Pandas/Scipy)]
        B3[AI Engine (LangChain + Local LLM)]
        B4[Document Compiler (Pandoc)]
    end
    
    subgraph Data [File System]
        D1[Project Config (.json)]
        D2[Raw Data (.csv/.xlsx)]
        D3[Assets (.png, .bib)]
    end
    
    B --> D1 & D2 & D3
    A --> D1 & D2 & D3
```

## 2. Chi tiết các tầng (Layers)

### A. Tầng Frontend (VS Code Extension API + Webview)
Chúng ta không sửa đổi quá sâu vào Core C++ của VS Code mà sử dụng cơ chế Custom Editor API và Webview.
*   **UI Framework:** ReactJS (được nhúng trong Webview).
*   **Libraries:**
    *   `react-data-grid`: Hiển thị bảng dữ liệu.
    *   `mxgraph` (Draw.io core): Vẽ mô hình.
    *   `survey-creator-react`: Thiết kế bảng hỏi.
    *   `plotly.js`: Vẽ biểu đồ.
*   **Nhiệm vụ:** Hiển thị giao diện No-code, bắt sự kiện click của user và gửi lệnh xuống Backend.

### B. Tầng Backend (Python Sidecar)
Một tiến trình Python chạy ngầm (Child Process) được khởi động cùng lúc với IDE.
*   **Framework:** FastAPI (hoặc Flask).
*   **Nhiệm vụ:**
    *   **Thống kê:** Dùng `pandas`, `scipy`, `statsmodels` để chạy T-test, Regression.
    *   **AI:** Dùng `langchain` kết nối với OpenAI API hoặc Ollama (Local LLM).
    *   **Vector DB:** Dùng `chromadb` để lưu index của các file PDF tài liệu tham khảo.
    *   **Export:** Dùng `pypandoc` để ghép nội dung thành file Word/PDF.

### C. Tầng Dữ liệu (File Structure)
Mỗi dự án là một thư mục vật lý. Cấu trúc thư mục chuẩn:
```
My_Thesis_Project/
├── project.json          # "Bộ não" của dự án (Lưu trạng thái các bước)
├── assets/               # Chứa ảnh mô hình, logo trường
├── data/                 # Chứa data.csv, data_cleaned.csv
├── literature/           # Chứa file PDF bài báo + file .bib
├── notebooks/            # (Ẩn) Các file .ipynb sinh ra tự động để chạy code
└── output/               # Chứa bài báo final
```

## 3. Luồng dữ liệu (Data Flow) - Ví dụ: Chức năng "Phân tích Tương quan"

1.  **User Action:** User kéo thả 2 biến `Time` và `Score` vào ô "Correlation" trên giao diện React (Frontend).
2.  **Request:** Frontend gửi JSON qua localhost: `POST /analyze/correlation {var1: "Time", var2: "Score"}`.
3.  **Processing (Backend):**
    *   Python đọc file `data.csv`.
    *   Tính hệ số Pearson `r` và `P-value`.
    *   Vẽ biểu đồ Scatter plot -> Lưu thành `chart_corr.png`.
    *   Gọi AI: "Viết nhận xét cho r=0.8, p<0.001" -> Nhận text.
4.  **Response:** Backend trả về JSON: `{r: 0.8, p: 0.001, image_path: "assets/chart_corr.png", text: "Tương quan mạnh..."}`.
5.  **Display:** Frontend hiển thị kết quả lên màn hình.

## 4. Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ | Ghi chú |
| :--- | :--- | :--- |
| **App Core** | Electron / VS Code OSS | Nền tảng chính |
| **Language** | TypeScript (Frontend), Python (Backend) | Đa ngôn ngữ |
| **UI Library** | ReactJS, TailwindCSS | Giao diện trong Webview |
| **Database** | JSON Files (Metadata), ChromaDB (Vector) | Không dùng SQL |
| **AI LLM** | OpenAI API / Ollama | Tùy chọn Online/Offline |
| **Visualization** | Plotly / Matplotlib | Vẽ biểu đồ |
| **Document** | Pandoc / LaTeX | Xuất bản tài liệu |

---

## 5. Ảnh chụp hiện trạng (VS Code build)

| Layer | Thành phần | File chính | Ghi chú |
| --- | --- | --- | --- |
| Extension Host | Entry point | `src/extension.ts` | Khởi động backend, đăng ký 5 panel (Ideation, Design, Analysis, Publishing, About) |
| Webview Panels | React bundle | `src/panels/*.ts` → build sang `out/panels/*.js` | UI Ideation/Design/Analysis/Publishing + About (brand story) |
| Branding Assets | Logo/icon | `assets/`, `image/`, `apply-branding.ps1` | Đồng bộ vào VS Code build & About panel |
| Backend APIs | FastAPI routers | `backend/api/analysis.py`, `chat.py`, `publishing.py` | Đăng ký tại `backend/server.py` với prefix `/api/...` |
| Process Bridge | Child Process spawn | `src/extension.ts > startBackend` | Tìm `backend/server.py` và chạy bằng `python` |

### API Surface hiện tại

| Đường dẫn | Body | Output | Dùng ở module |
| --- | --- | --- | --- |
| `POST /api/analysis/upload` | File CSV/XLSX | Metadata cột + preview 100 dòng + summary numeric/all | Smart Grid / variable suggestions |
| `POST /api/analysis/data-health` | `{ data, include_columns? }` | Báo cáo missing, zero variance, min/max từng cột | Data health inspector |
| `POST /api/analysis/descriptive` | `{ data, variables[] }` | Numeric stats (mean, std, skew, kurtosis) + categorical mode | Descriptive panel |
| `POST /api/analysis/analyze/correlation` | `{ data, variables[], method }` | Ma trận tương quan + p-values | Auto-Stats |
| `POST /api/analysis/analyze/t-test` | `{ data, dependent_var, group_var }` | t-statistic, p-value, mean diff | Group comparison |
| `POST /api/analysis/analyze/anova` | `{ data, dependent_var, group_var }` | F, p và mô tả từng nhóm | One-way ANOVA |
| `POST /api/analysis/analyze/regression` | `{ data, dependent_var, independent_vars[] }` | OLS coefficients, R², ANOVA table | Modeling / hypothesis testing |
| `POST /api/analysis/analyze/cronbach` | `{ data, variables[] }` | Cronbach’s alpha + item stats | Reliability check |
| `POST /api/chat/completion` | `{ messages: [...] }` | `{ role, content }` | Ideation Lab / Chat Panel |
| `POST /api/publishing/export` | `{ content, format }` | `{ status, file | message }` | Publishing Panel |

> Các API này tái hiện đầy đủ flow “Upload → Data health → Descriptive → Reliability → Modeling → Export” được mô tả trong `NCSKIT_app_backup/docs/q1q2-flow.md`. Khi cần các phép nâng cao (EFA/CFA, clustering, topic modeling), có thể bổ sung router mới theo cùng pattern.

---

## 6. Tái sử dụng `NCSKIT_app_backup`

Thư mục `NCSKIT_app_backup/` chứa toàn bộ prototype Tauri + R engine. Việc hoàn thiện chức năng chính dự án dựa trên ba hướng:

1. **Luồng phân tích** – Chi tiết trong `docs/q1q2-flow.md` và `r-analytics/`. Các bước ingest, preprocessing, modeling, reporting ở R đã được chuyển một phần sang Python (upload, data health, descriptive, t-test, ANOVA, regression, Cronbach). Các module còn lại (EFA/CFA, clustering…) có thể tiếp tục port dựa trên cùng kiến trúc.
2. **UI/UX** – `frontend/src/AnalysisPanel.tsx` (bản React thuần) mô tả rõ layout bảng kết quả, biểu đồ, state machine. Các webview panel trong VS Code có thể reuse component logic này.
3. **Installer / Distribution** – `installer/` và `desktop/` trong backup cung cấp script đóng gói (InnoSetup, Tauri). Trên bản VS Code, các script PowerShell (`build-ide.ps1`, `apply-branding.ps1`) kế thừa ý tưởng tự động hóa tương tự.

Việc tài liệu hóa rõ ràng các module ở cả hai nhánh giúp team dễ dàng mapping “tính năng đã chạy ở backup” sang “tính năng đang build trên VS Code”.