-- ====================================================================
-- TỐI ƯU CƠ SỞ DỮ LIỆU (Database Optimization) - ncsStat
-- Hướng dẫn: Copy toàn bộ nội dung file này và chạy trên Supabase SQL Editor
-- ====================================================================

-- 1. TỐI ƯU HIỆU SUẤT TRUY VẤN (Performance)
-- Bảng projects thường xuyên được query theo user_id qua RLS.
-- Tạo Index này giúp ngăn chặn việc quét toàn bộ bảng (Seq Scan) mỗi lần user đăng nhập.
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);

-- 2. CHUẨN BỊ LƯU TRỮ FILE DỮ LIỆU LỚN (Supabase Storage)
-- Thay vì nhồi nhét file CSV vào JSONB làm phình to DB, ta tạo Bucket chuyên dụng để lưu file
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'datasets', 
    'datasets', 
    false, -- Private bucket (Bảo mật dữ liệu nghiên cứu)
    52428800, -- 50MB limit per file
    ARRAY['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
ON CONFLICT (id) DO UPDATE SET 
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. BẢO MẬT STORAGE (RLS Policies cho Buckets)
-- Cho phép người dùng upload file dữ liệu của họ
CREATE POLICY "Users can upload their own datasets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'datasets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Cho phép người dùng đọc dữ liệu của chính họ
CREATE POLICY "Users can view their own datasets"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'datasets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Cho phép người dùng xóa dữ liệu của chính họ
CREATE POLICY "Users can delete their own datasets"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'datasets' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. BỔ SUNG CỘT CHO BẢNG PROJECTS
-- Thêm cột dataset_url để chứa link thay vì chứa cục data to đùng
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS dataset_url TEXT,
ADD COLUMN IF NOT EXISTS dataset_filename TEXT;

-- Đổi tên cột data cũ thành metadata để chứa các config nhẹ nhàng thay vì raw data
-- (Lưu ý: Không đổi tên cột nếu nó sẽ làm hỏng code hiện tại, chúng ta giữ nguyên cột data và chỉ thêm cột url)

-- Gửi tín hiệu để API Supabase cập nhật cấu trúc mới
NOTIFY pgrst, 'reload schema';
