-- ==========================================
-- Migration: Fix Database Schema & Security
-- Date: 2026-03-29
-- ==========================================

-- 1. Thêm các cột metadata còn thiếu vào bảng profiles
-- Việc này khắc phục lỗi không lưu được thông tin học thuật của User
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS academic_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS research_field TEXT;


-- 2. Khắc phục cảnh báo bảo mật hàm handle_new_user()
-- (Cố định search_path để ngăn chặn phân quyền chéo, SQL injection)
ALTER FUNCTION public.handle_new_user() SET search_path = public;


-- 3. Cập nhật lại RLS cho bảng feedback
-- Báo lỗi "Always True": ((auth.uid() = user_id) OR (auth.role() = 'authenticated'::text))
-- cho phép bất kỳ ai có tài khoản insert feedback dưới danh nghĩa người khác!
-- Giải pháp: Ép chặt UID khớp với ID đang tạo request.
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.feedback;
CREATE POLICY "Authenticated users can insert feedback" 
ON public.feedback FOR INSERT 
WITH CHECK (auth.uid() = user_id);


-- 4. Vá lỗ hổng bảo mật nghiêm trọng (Token Injection) ở bảng token_transactions
-- Báo cáo nhầm lẫn rằng các bảng không có Policy. Tuy nhiên kiểm tra kỹ pg_policies 
-- phát hiện có Policy "System can insert transactions" với rule: (auth.uid() = user_id)
-- ĐÂY LÀ LỖ HỔNG LỚN: Nó cho phép bất kỳ Client nào tự tạo giao dịch cộng điểm/token (!) 
-- Giải pháp: XÓA policy này khỏi public/authenticated. Chỉ Service_Role hoặc Backend 
-- tự động bypass RLS mới được thêm giao dịch Token.
DROP POLICY IF EXISTS "System can insert transactions" ON public.token_transactions;
