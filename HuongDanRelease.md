# Hướng Dẫn Phát Hành (Release Guide) - Hệ sinh thái ncsKit

Tài liệu này hướng dẫn chi tiết quy trình cập nhật và phát hành (Deploy) phiên bản mới cho các dự án trong hệ sinh thái ncsKit (bao gồm `ncsstat.ncskit.org` và `ncskit.org`).

---

## 1. Quy Trình Cập Nhật Source Code Lên Vercel

### Cách 1: Đẩy qua Git (Khuyên dùng)
Đây là cách tiêu chuẩn, an toàn nhất và giúp bạn theo dõi được lịch sử các phiên bản. Nếu Vercel đã được liên kết với Github của bạn, mọi thao tác Push lên nhánh `main` sẽ tự động kích hoạt Vercel xây dựng (build) lại dự án.

**Các bước thực hiện:**
1. Mở Terminal / PowerShell.
2. Di chuyển vào thư mục dự án: `cd d:\SE_Project\ncskt\ncskit_home`
3. Thêm các file đã chỉnh sửa: `git add .`
4. Tạo gói cập nhật: `git commit -m "Mô tả ngắn gọn nội dung bạn vừa sửa"`
5. Đẩy lên Github: `git push origin main`

Ngay sau khi lệnh Push thành công, bạn có thể mở giao diện web của Vercel (phần Deployments) để xem tiến trình tự động.

### Cách 2: Ép Cập Nhật Trực Tiếp bằng Vercel CLI
Dùng trong trường hợp Github bị lỗi chứng chỉ (Permission denied) hoặc bạn muốn đẩy code lên thẳng Vercel bỏ qua Github.

**Các bước thực hiện:**
1. Mở Terminal / PowerShell.
2. Di chuyển vào thư mục dự án: `cd d:\SE_Project\ncskt\ncskit_home`
3. Đăng nhập Vercel (Chỉ cần làm 1 lần nếu chưa đăng nhập): `npx vercel login`
4. Đẩy code lên môi trường Production (Chính thức): `npx vercel --prod`
5. Ấn phím `Y` / `Enter` cho các câu hỏi xác nhận nếu có. Chờ khoảng 2 phút, Vercel sẽ trả về đường link báo thành công (✓ Ready).

---

## 2. Quy Trình Cập Nhật Supabase (Cơ sở dữ liệu & Auth)

Bất cứ khi nào bạn thay đổi cấu trúc bảng (Schema), thêm/sửa Row Level Security (RLS) hoặc cấu hình Auth, bạn cần chú ý các quy tắc sau:

### 2.1. Cập nhật Biến Môi Trường (Environment Variables)
- **Local (Trên máy tính):** Mọi cấu hình kết nối Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) phải được lưu trong file `.env.local`.
- **Production (Trên Vercel):** Phải đảm bảo Vercel cũng có các biến này. Truy cập: `Vercel Dashboard` > `Settings` > `Environment Variables` để đối chiếu và cập nhật nếu có thay đổi.

### 2.2. Kiểm Tra Lại Cấu Hình Domain Trong Supabase Auth
- Khi bạn chuyển tên miền chính (VD: từ `stat.ncskit.org` sang `ncsstat.ncskit.org` hoặc thêm `login.ncskit.org`), bạn phải vào `Supabase Dashboard` > `Authentication` > `URL Configuration`.
- Đảm bảo tên miền mới đã được thêm vào mục **Site URL** và **Redirect URLs**. Nếu không, luồng đăng nhập Google / Github sẽ bị lỗi hoặc không thể tạo Cookie.

---

## 3. Danh Sách Kiểm Tra Trước Khi Release (Pre-Release Checklist)

Trước khi thực hiện `npx vercel --prod` hoặc `git push`, hãy kiểm tra nhanh:
- [ ] Không có file chứa `process.env` chứa khóa bí mật (Secret Key) nào bị rò rỉ ra Client Component (các file có `'use client'`).
- [ ] Đã chạy thử lệnh `npm run build` trên máy tính và không báo lỗi.
- [ ] Đã chắc chắn luồng Đăng nhập (Auth) redirect đúng về tên miền hiện tại (Tránh lỗi vòng lặp PKCE).

## 4. Xử Lý Khi Có Sự Cố (Rollback)

Nếu bản cập nhật mới đẩy lên Vercel bị lỗi nghiêm trọng (sập web, trắng trang):
1. Đăng nhập vào trang quản trị Vercel.
2. Vào dự án của bạn > Chuyển sang tab **Deployments**.
3. Chọn bản Release cũ (trước đó) hoạt động tốt.
4. Bấm vào nút dấu 3 chấm (`...`) > Chọn **Promote to Production** hoặc **Rollback**. Hệ thống sẽ lập tức quay xe về phiên bản an toàn trong vòng 5 giây mà không cần build lại.
