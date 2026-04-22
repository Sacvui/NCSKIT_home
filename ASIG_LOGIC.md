# ASIG (Academic Statistical Interpretation Generator) Logic Documentation

Hệ thống ASIG sử dụng cơ chế **Deterministic Rule Engine** (Hệ chuyên gia dựa trên luật định tính) để chuyển đổi kết quả từ R sang văn bản APA. Các ngưỡng (thresholds) được áp dụng dựa trên các giáo trình thống kê chuẩn (Hair et al., 2010; Cohen, 1988).

## 1. Reliability Analysis (Cronbach's Alpha / McDonald's Omega)

- **Ngưỡng tin cậy (α / ω):**
    - `>= 0.8`: Độ tin cậy rất tốt.
    - `0.7 - 0.8`: Độ tin cậy tốt (Đạt yêu cầu nghiên cứu).
    - `0.6 - 0.7`: Độ tin cậy chấp nhận được (Nghiên cứu khám phá).
    - `< 0.6`: Độ tin cậy thấp (Cảnh báo: Vi phạm tính nhất quán).
- **Loại bỏ biến (Corrected Item-Total Correlation):**
    - Nếu hệ số tương quan biến-tổng `< 0.3`, ASIG sẽ đưa ra cảnh báo yêu cầu xem xét loại bỏ biến quan sát đó.

## 2. Hypothesis Testing (t-test / ANOVA)

- **Ngữ cảnh kiểm định p-value:**
    - `p < .05`: Tuyên bố có ý nghĩa thống kê (Reject $H_0$).
    - `p >= .05`: Tuyên bố không có sự khác biệt (Fail to reject $H_0$).
- **Đồng nhất phương sai (Levene's Test):**
    - Nếu `p < .05`: Tự động kích hoạt thông báo sử dụng kết quả hiệu chỉnh (**Welch-Satterthwaite**).
- **Độ lớn ảnh hưởng (Effect Size):**
    - **Cohen's d:** Small (0.2), Medium (0.5), Large (0.8).
    - **Eta-squared ($\eta^2$):** Small (0.01), Medium (0.06), Large (0.14).

## 3. Structural Equation Modeling (SEM) Fit Indices

Dựa trên tiêu chuẩn của Hu & Bentler (1999):
- **CFI / TLI**: Tốt nếu `>= 0.95`, Chấp nhận được nếu `>= 0.90`.
- **RMSEA**: Tốt nếu `<= 0.06`, Chấp nhận được nếu `<= 0.08`.
- **SRMR**: Tốt nếu `<= 0.08`.

## 4. Regression Analysis

- **VIF (Multicollinearity):**
    - Nếu `VIF > 5` (hoặc `10` tùy cấu hình): Cảnh báo hiện tượng đa cộng tuyến.
- **R-Square:** Giải thích mức độ biến thiên dựa trên tỷ lệ % thực tế.

## 5. APA Formatting Logic

Hệ thống tự động loại bỏ số 0 đứng trước (leading zero) đối với các chỉ số không bao giờ vượt quá 1 (ví dụ: *p*, *r*, *alpha*) theo đúng quy chuẩn APA 7th Edition.

---
*Tài liệu này được cung cấp để hỗ trợ quá trình kiểm duyệt khoa học (Scientific Review) của JOSS.*
