# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: autopilot.spec.ts >> Auto-Pilot Analysis Luồng (PLS-SEM) >> Nên chạy báo cáo Auto-Pilot đầy đủ mà không gặp lỗi
- Location: tests\e2e\autopilot.spec.ts:5:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/analyze", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | test.describe('Auto-Pilot Analysis Luồng (PLS-SEM)', () => {
  5  |     test('Nên chạy báo cáo Auto-Pilot đầy đủ mà không gặp lỗi', async ({ page }) => {
  6  |         // 1. Tải trang analyze
> 7  |         await page.goto('/analyze');
     |                    ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  8  |         
  9  |         // 2. Tải file CSV
  10 |         const filePath = path.join(__dirname, 'test_data.csv');
  11 |         await page.setInputFiles('input[type="file"]', filePath);
  12 |         
  13 |         // 3. Đợi dữ liệu được load thành công và hiển thị các tab
  14 |         // Kiểm tra chữ "Hồ sơ dữ liệu"
  15 |         await expect(page.locator('text=Hồ sơ dữ liệu')).toBeVisible({ timeout: 10000 });
  16 |         
  17 |         // 4. Click chuyển sang tab Auto-Pilot
  18 |         await page.click('text=Auto Pilot');
  19 |         
  20 |         // 5. Chọn kịch bản "Kiểm định mô hình PLS-SEM" (Preset đầu tiên thường là PLS-SEM)
  21 |         // Dựa vào text hiển thị trong preset
  22 |         await page.click('text=Kiểm định Mô hình PLS-SEM');
  23 |         
  24 |         // 6. Kiểm tra giao diện Cấu hình Mô hình xuất hiện
  25 |         await expect(page.locator('text=Thiết lập Giả thuyết (Đường dẫn)')).toBeVisible();
  26 | 
  27 |         // (AutoPilot mặc định tự động group biến có chung tiền tố và auto link IV -> DV)
  28 |         // Nên nếu file test_data.csv có ATT, SN -> group, paths đã được auto-gen!
  29 | 
  30 |         // 7. Click nút "Bắt đầu Phân tích Toàn diện"
  31 |         await page.click('button:has-text("Bắt đầu Phân tích Toàn diện")');
  32 | 
  33 |         // 8. Đợi WebR chạy xong toàn bộ tiến trình.
  34 |         // Giao diện sẽ báo "Đang phân tích tự động..." và tiến trình tăng dần.
  35 |         // Chúng ta đợi popup tiến trình biến mất hoặc text Toast success
  36 |         // Hoặc check bảng kết quả render ra
  37 |         
  38 |         // Timeout 60s cho việc tải WebR và chạy Model
  39 |         await expect(page.locator('text=Chạy Auto Pilot thành công!')).toBeVisible({ timeout: 60000 });
  40 |         
  41 |         // 9. Kiểm tra xem màn hình kết quả (Results) đã hiển thị đúng kết quả Auto-Pilot chưa
  42 |         // Thường có text "BÁO CÁO PHÂN TÍCH TỰ ĐỘNG ĐA BƯỚC" hoặc kết quả Cronbach
  43 |         await expect(page.locator('text=Cronbach\'s Alpha')).first().toBeVisible();
  44 |         await expect(page.locator('text=Báo cáo Auto Pilot Tổng Hợp')).toBeVisible();
  45 | 
  46 |         // 10. Check if the new CMB and HTMT tests are rendered
  47 |         await expect(page.locator('text=Discriminant Validity (HTMT Matrix)')).toBeVisible();
  48 |         await expect(page.locator('text=Full Collinearity VIF (CMB Check)')).toBeVisible();
  49 |         await expect(page.locator('text=Harman\'s Single Factor Test (CMB)')).toBeVisible();
  50 |     });
  51 | });
  52 | 
```