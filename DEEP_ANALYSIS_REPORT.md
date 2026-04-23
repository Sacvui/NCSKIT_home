# BÁO CÁO PHÂN TÍCH KỸ THUẬT CẤU TRÚC XỬ LÝ AI SERVICE (OLLAMA FALLBACK SYSTEM)

| **Thông tin chung** | |
| :--- | :--- |
| **Ngày báo cáo:** | 24/05/2024 |
| **Mã dự án:** | AI Service Gateway (Internal) |
| **Ngôn ngữ:** | Dart / JavaScript (Node.js) - *Giả định dựa trên cú pháp* |
| **Đối tượng:** | Hệ thống định tuyến AI (LLM Router) |
| **Chủ đề:** | Phân tích cơ chế dự phòng, quản lý lỗi và độ tin cậy |

---

## 1. TÓM TẮT VÀ MỤC TIÊU

### 1.1. Mục tiêu
Báo cáo này nhằm phân tích chi tiết đoạn mã xử lý logic gọi API cho mô hình ngôn ngữ lớn (LLM) sử dụng hạ tầng Ollama (local) làm ưu tiên, với cơ chế dự phòng chuyển tiếp sang Gemini (cloud). Mã nguồn được thiết kế để đảm bảo **High Availability (HA)** cho người dùng cuối bằng cách tự động chuyển sang dịch vụ thay thế khi hạ tầng chính gặp sự cố.

### 1.2. Vai trò chính
*   **Primary:** Gọi API Ollama (Local Model Server).
*   **Secondary:** Fallback sang API Gemini (Google Cloud).
*   **Mechanism:** Xử lý ngoại lệ, xác thực JSON, và quản lý thời gian chờ.

---

## 2. PHÂN TÍCH LUỒNG XỬ LÝ (FLOW ANALYSIS)

Dưới đây là phân tích logic dựa trên đoạn mã được cung cấp:

### 2.1. Kiểm tra trạng thái HTTP (Status Code Check)
*   **Logic:** `if (!response.ok)`
*   **Phân tích:**
    *   Kiểm tra mã trạng thái phản hồi từ Ollama.
    *   **Trường hợp 1 (Ok):** Nếu `response.ok === true`, hệ thống sẽ tiếp tục xử lý `await response.json()`.
    *   **Trường hợp 2 (Error):** Nếu mã trạng thái bất thường (ví dụ: 404, 500, 502), hệ thống ngay lập tức ghi log cảnh báo (`logger.warn`) và trả về `null`.
    *   **Hành động của `null`:** Việc trả về `null` là tín hiệu kích hoạt cơ chế fallback sang Gemini (dựa trên ngữ cảnh gọi hàm của hàm cha).

### 2.2. Xác thực Định dạng Dữ liệu (JSON Validation)
*   **Logic:** `await response.json()` -> `data?.message?.content`
*   **Phân tích:**
    *   Hệ thống chuyển đổi phản hồi thành đối tượng JSON.
    *   Kiểm tra cấu trúc: `data` phải tồn tại -> `message` phải tồn tại -> `content` phải có giá trị không rỗng.
    *   **Rủi ro:** Sử dụng toán tử Optional Chaining (`?.`) có thể dẫn đến việc bỏ qua lỗi parsing nếu API trả về JSON format sai nhưng không phải error code chuẩn (ví dụ: trả về `null` hoặc string).
    *   **Xử lý lỗi:** Nếu nội dung là `null` hoặc rỗng, hệ thống cũng sẽ chuyển sang fallback.

### 2.3. Quản lý Lỗi Bắt (Catch Block)
*   **Logic:** `catch (error: unknown)`
*   **Phân tích:**
    *   Bắt tất cả các lỗi không bắt được trong khối `try`.
    *   **Xử lý Timeout:** Kiểm tra `error instanceof Error` hoặc cụ thể hơn là `AbortError` (lỗi do `clearTimeout`).
    *   **Xử lý AbortError:** Nếu lỗi do `AbortError`, hệ thống ghi log thời gian chờ (`time`) để debug hiệu năng mạng hoặc server quá tải.
    *   **Xử lý Lỗi Khác:** Các lỗi hệ thống hoặc API (Rate limit, Network unreachable) cũng được ghi log và trả về `null` để fallback.
    *   **Quan trọng:** `clearTimeout(timeoutId)` được gọi trước khi ghi log để ngăn chặn các tác vụ không cần thiết trong bộ nhớ hoặc event loop.

---

## 3. CƠ CHẾ DỰ PHÒNG (FALLBACK MECHANISM)

### 3.1. Cấu trúc 2 Lớp (Dual Layer)
*   **Lớp 1 (Primary):** **Ollama**.
    *   *Ưu điểm:* Dữ liệu không qua internet (Private), tiết kiệm chi phí API, bảo mật cao.
    *   *Nhược điểm:* Phụ thuộc vào tài nguyên máy chủ (CPU/GPU/RAM) cục bộ, dễ bị latency cao nếu mô hình lớn.
*   **Lớp 2 (Secondary):** **Gemini**.
    *   *Ưu điểm:* Ổn định, tốc độ cao (Google Cloud), xử lý các trường hợp phức tạp mà mô hình local không làm được.
    *   *Nhược điểm:* Phụ thuộc mạng internet, chi phí API.

### 3.2. Chiến lược Fallback
Hệ thống sử dụng chiến lược **"Fail-fast to Fallback"**. Khi Ollama thất bại (Network, Model Load Fail, Timeout), hệ thống không chờ người dùng mà chuyển ngay sang Gemini.
*   **Lưu ý:** Việc trả về `null` từ hàm này cho hàm gọi là hàm "orchestrator" sẽ nhận biết rằng Ollama đã thất bại và tự động khởi động logic gọi Gemini.

---

## 4. QUẢN LÝ LỖI VÀ LOGGING

### 4.1. Độ tin cậy của Log
*   **Logger.warn:** Được sử dụng cho mọi lỗi.
    *   *Lý do:* Đây là lỗi vận hành bình thường trong kiến trúc microservices/ai-gateway. Lỗi không phải là lỗi nghiêm trọng (Fatal) mà là lỗi dự kiến (Expected Fail).
    *   *Nội dung log:* Bao gồm tên API (Ollama/Gemini), trạng thái lỗi, thời gian thực hiện, và thời gian chờ.
*   **Impact:** Giúp vận hành (SRE) xác định ngay khi Ollama bị lỗi (ví dụ: Ollama crash hoặc RAM không đủ) từ dashboard giám sát.

### 4.2. Xử lý Timeout
*   **Logic:** `if (error instanceof Error)` trong catch block.
*   **Chi tiết:** Nếu `AbortError` được catch, thời gian chờ (`time`) được ghi lại.
*   **Ý nghĩa:** Cho phép tính toán **P99 Latency** của Ollama. Nếu thời gian chờ quá cao, có thể cần tăng cấu hình model hoặc tối ưu hóa prompt.

### 4.3. Vấn đề về Memory & GC
*   Việc `clearTimeout(timeoutId)` là **bắt buộc**. Nếu không, `timeoutId` sẽ vẫn giữ trong bộ nhớ và event loop (đặc biệt với Node.js hoặc Dart VM), gây rò rỉ memory theo thời gian khi hệ thống gặp nhiều lỗi liên tục.

---

## 5. ĐÁNH GIÁ VÀ ĐỀ XUẤT CẢI TIẾN

### 5.1. Điểm mạnh của đoạn mã
1.  **Robust:** Xử lý cả lỗi HTTP status code, lỗi JSON parsing và lỗi hệ thống (Network).
2.  **User Friendly:** Không để người dùng chờ đợi vô tận khi Ollama bị lỗi; chuyển sang Gemini ngay lập tức.
3.  **Audit Trail:** Log đầy đủ giúp phân tích lỗi trong tương lai.

### 5.2. Điểm cần cải thiện (Recommendations)
1.  **Metric Collection (Monitoring):**
    *   Thêm metric về số lần fallback cho Ollama sang Gemini.
    *   Giám sát thời gian phản hồi trung bình của Ollama.
    *   *Gợi ý:* Sử dụng Prometheus/OpenTelemetry để track số lỗi.
2.  **Configuration for Gemini:**
    *   Khi fallback sang Gemini, cần đảm bảo cấu hình tham số (temperature, max_tokens, model_name) tương tự Ollama để duy trì tính nhất quán của trải nghiệm người dùng.
    *   *Code:* `configForGemini(responseBody, request)` -> Truyền context từ Ollama sang Gemini.
3.  **Rate Limiting Protection:**
    *   Đảm bảo khi fallback sang Gemini, hệ thống không nên gọi quá nhiều request cùng lúc (thông qua fallback) làm quá tải API Cloud.
    *   *Gợi ý:* Thêm logic "Circuit Breaker" nếu số lần fallback vượt quá ngưỡng.
4.  **Error Message Standardization:**
    *   Thay vì trả về `null`, hãy trả về đối tượng lỗi chuẩn (ví dụ: `{ success: false, error: 'OLLAMA_FAILED', reason: 'NETWORK_ERROR', fallbackUsed: true }`) để các layer trên có thể xử lý chính xác hơn.

### 5.3. Kết luận
Mã nguồn này tuân thủ nguyên tắc **"Defense in Depth"** cho dịch vụ AI. Việc ưu tiên Ollama (local) và fallback sang Gemini (cloud) là giải pháp kinh tế và kỹ thuật tối ưu hiện nay. Sự ổn định của hệ thống phụ thuộc vào việc giám sát chặt chẽ Ollama và tối ưu hóa tài nguyên server chạy Ollama để giảm thiểu tỷ lệ fallback.thêm logic: Thử lại Ollama tối đa 3 lần với khoảng thời gian chờ tăng dần (Backoff) trước khi chuyển sang Gemini để tránh tràn tải (Thundering Herd) lên server Ollama khi vừa khởi động lại.

4.  **Bảo mật (Security Hardening):**
    *   Mã hóa các log nhạy cảm.
    *   Kiểm tra xem hàm `JSON.stringify` hoặc các hàm xử lý chuỗi khác có thể bị lỗi (XSS) nếu đầu vào không được sanitize trong các trường hợp edge-case.

5.  **Xử lý Lỗi Context:**
    *   Trong trường hợp fallback, cần đảm bảo rằng `history` hoặc `context` của cuộc hội thoại không bị mất mát. Đảm bảo rằng khi gọi lại API Gemini, các tham số đầu vào bao gồm đầy đủ lịch sử trò chuyện.

## 6. KẾT LUẬN (CONCLUSION)

Đoạn mã phân tích là một cơ chế bảo vệ quan trọng (Resilience Layer) trong kiến trúc hệ thống AI, đảm bảo tính liên tục của dịch vụ. Tuy nhiên, cách tiếp cận hiện tại mang tính chất "bỏ qua lỗi" (Pass-through logic) khi fallback, điều này tiềm ẩn rủi ro về trải nghiệm người dùng.

Việc cập nhật cơ chế này theo các khuyến nghị (nâng cấp lỗi, thêm retry logic, và chuẩn hóa log) sẽ giúp hệ thống **Ollama -> Gemini Orchestration** trở nên trưởng thành hơn, tuân thủ tốt các chuẩn mực DevOps và SRE (Site Reliability Engineering).

---
**Người phê duyệt:** [Tên Kỹ thuật viên]
**Duyệt:** [Chức vụ]