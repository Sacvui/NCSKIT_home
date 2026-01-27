# HỆ THỐNG NCSSTAT: Đánh giá Toàn Diện & Lộ trình Phát triển

Tài liệu này đánh giá hiện trạng hệ thống, chỉ ra các điểm "chưa ổn thỏa" (Pain Points) và đề xuất hướng phát triển chiến lược để đưa sản phẩm đạt chuẩn "Expert Pro".

## 1. Đánh giá Hiện Trạng & Những điểm "Chưa Ổn" (Critical Gaps)

### 🔴 Nhóm Tính năng Phân tích (Core Analysis) - MỨC ĐỘ: NGHIÊM TRỌNG
Hiện tại, hệ thống hứa hẹn nhiều nhưng chưa cung cấp đủ ("Over-promise, under-deliver").
*   **Vấn đề:** Các nút chức năng **Logistic Regression, Cluster Analysis, SEM, Mediation, Moderation** đã có trên giao diện nhưng chỉ là **"Hàng giả" (Stubs)**. Khi bấm vào sẽ không chạy hoặc trả về kết quả rỗng.
*   **Rủi ro:** User (nhà nghiên cứu) sẽ đánh giá thấp độ tin cậy của tool ngay lập tức.
*   **Giải pháp:** Phải implement các thuật toán này ngay, ưu tiên Logistic Regression và Cluster Analysis. Với SEM/Mediation, nếu quá phức tạp trên WebR, cần có giải pháp thay thế (hoặc ẩn nút đi).

### 🟡 Nhóm Trải nghiệm Dữ liệu (UX Persistence) - MỨC ĐỘ: CAO
*   **Vấn đề:** Dữ liệu hoàn toàn **Biến mất khi Refresh**. Nếu User đang chạy EFA dở dang (mất 15p custom biến) mà lỡ tay reload trang -> MẤT HẾT.
*   **Nguyên nhân:** Đang dùng `React State` trong RAM. Chưa lưu vào `IndexedDB` hay Database.
*   **Giải pháp:** Cần cơ chế "Auto-Save Workspace" xuống Browser Storage (như Google Docs).

### 🟡 Nhóm Báo cáo & Xuất bản (Reporting) - MỨC ĐỘ: TRUNG BÌNH
*   **Vấn đề:** Chức năng Export (ví dụ Word/PDF) chưa mạnh mẽ và chuẩn hóa APA.
*   **Giải pháp:** Tích hợp thư viện `docx` để xuất báo cáo kèm bảng biểu APA chuẩn.

### 🟢 Nhóm Hiệu năng (Performance)
*   **Vấn đề:** WebR load lần đầu khá lâu (vài chục MB). Profiler chạy trên Main Thread gây đơ UI.
*   **Giải pháp:** Dùng Service Worker để cache WebR và Web Worker cho xử lý dữ liệu nặng.

---

## 2. Hướng Phát triển & Lộ trình (Development Roadmap)

### Giai đoạn 1: Fix "Hàng Giả" & Ổn định (Tuần tới)
Mục tiêu: Những gì nhìn thấy được phải dùng được.
1.  **Implement Logistic Regression**: Đây là nhu cầu cực cao trong Y học/Kinh tế. (Độ khó: Dễ - dùng `glm` trong R).
2.  **Implement Cluster Analysis**: Dùng K-means (`kmeans` trong R).
3.  **Ẩn tạm hoặc cảnh báo Beta** cho SEM/Mediation nếu chưa làm kịp.

### Giai đoạn 2: Trải nghiệm "Không lo mất dữ liệu" (Tháng tới)
Mục tiêu: Biến tool thành không gian làm việc thực thụ.
1.  **Workspace Management**: Tạo bảng `projects` trong Supabase.
2.  **Auto-Save**: Lưu state (biến đã chọn, kết quả đã chạy) vào LocalStorage/IndexedDB mỗi 30 giây.
3.  **History**: Cho phép xem lại các kết quả phân tích cũ ("Hồi nãy mình chạy Cronbach alpha ra bao nhiêu nhỉ?").

### Giai đoạn 3: AI Assistant & Expert Report (Quý tới)
Mục tiêu: Cạnh tranh với SPSS/Amos.
1.  **AI Interpret AI**: Nâng cấp AI để đọc kết quả R và viết đoạn văn mẫu ("Kết quả cho thấy... p < 0.05...").
2.  **APA Report Generator**: Xuất file Word format chuẩn APA 7th.

## 3. Kết luận
Hệ thống Core (WebR + Auth) đã tốt. Tuy nhiên, lớp **Tính năng (Features)** đang bị "thủng" nhiều chỗ quan trọng. Cần tập trung lấp đầy các feature còn thiếu trước khi mở rộng thêm.
