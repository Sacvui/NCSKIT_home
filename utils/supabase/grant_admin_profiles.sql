-- Bổ sung quyền cho Admin quản lý Profiles (Token/Giao dịch)
-- Hướng dẫn: Copy nội dung file này và chạy trong Supabase SQL Editor

-- 1. Cho phép Admin xem toàn bộ Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Cho phép Admin cập nhật (cộng/trừ token) toàn bộ Profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Đảm bảo có trigger để không lỗi
NOTIFY pgrst, 'reload schema';
