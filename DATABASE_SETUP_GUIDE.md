# 🗄️ Database Setup Guide - ncsStat2

## 📋 Overview

Hướng dẫn setup database đầy đủ cho dự án ncsStat2 trên Supabase.

**Project:** ncsstat.ncskit.org  
**Supabase Project ID:** qshimpxmirkyfenhklfh  
**Database:** PostgreSQL 15

---

## 🚀 Quick Setup (5 phút)

### Bước 1: Mở Supabase SQL Editor

1. Truy cập: https://supabase.com/dashboard/project/qshimpxmirkyfenhklfh/sql/new
2. Click **"New query"**

### Bước 2: Copy & Run Setup Script

1. Mở file: `DATABASE_SETUP_COMPLETE.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor
4. Click **"Run"** (hoặc Ctrl+Enter)
5. Đợi ~10-15 giây để script chạy xong

### Bước 3: Promote User to Admin

Sau khi script chạy xong, promote user của bạn lên admin:

```sql
-- Thay your-email@example.com bằng email của bạn
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Bước 4: Verify Setup

Chạy các query sau để kiểm tra:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check system config
SELECT * FROM public.system_config;

-- Check your admin status
SELECT id, email, role, tokens 
FROM public.profiles 
WHERE email = 'your-email@example.com';
```

---

## 📊 Database Schema Overview

### Core Tables

#### 1. **profiles** - User Profiles
```sql
- id (UUID, PK)
- email, full_name, display_name, avatar_url
- role (user/admin/researcher)
- tokens, total_earned, total_spent
- referral_code, referred_by_code, referral_count
- orcid_id, provider
- academic_level, research_field, organization
- created_at, updated_at, last_active
```

#### 2. **projects** - Research Projects
```sql
- id (UUID, PK)
- user_id (FK → profiles)
- name, description, analysis_type
- data (JSONB), results (JSONB)
- status (draft/active/archived)
- is_private (boolean)
- created_at, updated_at
```

#### 3. **feedback** - User Feedback
```sql
- id (UUID, PK)
- user_id (FK → profiles, UNIQUE)
- content, rating (1-5)
- created_at
```

#### 4. **system_config** - System Configuration
```sql
- key (TEXT, PK)
- value (JSONB)
- description
- updated_at, updated_by
```

### Activity Tracking Tables

#### 5. **user_sessions** - Login/Logout Tracking
```sql
- id (UUID, PK)
- user_id (FK → profiles)
- login_at, logout_at, duration_minutes
- ip_address, user_agent
- created_at
```

#### 6. **user_activity** - Feature Usage Tracking
```sql
- id (UUID, PK)
- user_id (FK → profiles)
- action_type (login/logout/analysis/export/page_view)
- action_details (JSONB)
- session_id
- created_at, duration_seconds
```

#### 7. **token_transactions** - Credit History
```sql
- id (UUID, PK)
- user_id (FK → profiles)
- amount (INTEGER, +/-)
- type (signup_bonus/earn_invite/spend_analysis/etc.)
- description, related_id
- balance_after
- created_at
```

#### 8. **invitations** - Referral Tracking
```sql
- id (UUID, PK)
- inviter_id (FK → profiles)
- invitee_email, invite_code (UNIQUE)
- status (pending/accepted/expired)
- tokens_rewarded
- created_at, accepted_at, invitee_id
```

---

## 🔐 Row Level Security (RLS)

Tất cả tables đều có RLS enabled với các policies:

### Profiles
- ✅ Everyone can view all profiles (public)
- ✅ Users can update own profile
- ✅ Users can insert own profile

### Projects
- ✅ Users can CRUD own projects only
- ❌ Cannot view other users' projects

### Feedback
- ✅ Users can insert/view own feedback
- ✅ Admins can view all feedback

### System Config
- ✅ Everyone can read config
- ✅ Only admins can update/insert config

### Activity Tables
- ✅ Users can view/insert own data
- ✅ Admins can view all data

---

## 🔧 Database Functions

### 1. `handle_new_user()`
Tự động tạo profile khi user đăng ký qua Supabase Auth.

**Trigger:** `on_auth_user_created` (AFTER INSERT on auth.users)

### 2. `generate_referral_code()`
Tự động tạo referral code unique cho mỗi user.

**Format:** `NCS-XXXXXXXX` (8 ký tự random)

**Trigger:** `on_profile_created` (BEFORE INSERT on profiles)

### 3. `record_token_transaction()`
Ghi nhận transaction và cập nhật balance.

**Usage:**
```sql
SELECT public.record_token_transaction(
    'user-uuid',
    -500,  -- amount (negative = spend)
    'spend_analysis',
    'Cronbach Alpha Analysis',
    'analysis-uuid'
);
```

### 4. `log_activity()`
Ghi log hoạt động của user.

**Usage:**
```sql
SELECT public.log_activity(
    'user-uuid',
    'analysis',
    '{"type": "cronbach", "items": 10}'::jsonb,
    'session-id'
);
```

---

## 📈 Performance Indexes

Script đã tạo 20+ indexes cho performance:

### Profiles Indexes
- `idx_profiles_email`
- `idx_profiles_orcid_id`
- `idx_profiles_referral_code`
- `idx_profiles_referred_by_code`
- `idx_profiles_role`
- `idx_profiles_last_active`

### Projects Indexes
- `idx_projects_user_id`
- `idx_projects_status`
- `idx_projects_created_at`
- `idx_projects_updated_at`

### Activity Indexes
- `idx_user_sessions_user_id`
- `idx_user_sessions_login_at`
- `idx_user_activity_user_id`
- `idx_user_activity_action_type`
- `idx_user_activity_created_at`
- `idx_user_activity_session_id`
- `idx_token_transactions_user_id`
- `idx_token_transactions_created_at`
- `idx_invitations_inviter_id`
- `idx_invitations_invite_code`
- `idx_invitations_status`

---

## ⚙️ System Configuration

### Default Values

#### 1. Default NCS Balance
```json
{
  "key": "default_ncs_balance",
  "value": 100000,
  "description": "Default NCS credits for new users"
}
```

#### 2. Analysis Costs
```json
{
  "key": "analysis_costs",
  "value": {
    "descriptive": 100,
    "cronbach": 500,
    "omega": 600,
    "correlation": 300,
    "ttest": 400,
    "ttest-indep": 400,
    "ttest-paired": 400,
    "anova": 600,
    "efa": 1000,
    "cfa": 2000,
    "sem": 3000,
    "regression": 800,
    "moderation": 1200,
    "mediation": 1500,
    "logistic": 900,
    "chisquare": 400,
    "mann-whitney": 400,
    "cluster": 800,
    "ai_explain": 1500,
    "export_pdf": 200
  }
}
```

#### 3. Referral Rewards
```json
{
  "key": "referral_rewards",
  "value": {
    "inviter_bonus": 5000,
    "invitee_bonus": 2000
  }
}
```

### Update Configuration

```sql
-- Update default balance
UPDATE public.system_config 
SET value = '150000'::jsonb 
WHERE key = 'default_ncs_balance';

-- Update analysis cost
UPDATE public.system_config 
SET value = jsonb_set(value, '{cronbach}', '600')
WHERE key = 'analysis_costs';
```

---

## 🧪 Testing Queries

### Test User Creation
```sql
-- Check if trigger creates profile automatically
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
```

### Test Referral Code Generation
```sql
-- Check referral codes
SELECT id, email, referral_code, referred_by_code 
FROM public.profiles 
WHERE referral_code IS NOT NULL;
```

### Test Token System
```sql
-- Record a test transaction
SELECT public.record_token_transaction(
    (SELECT id FROM public.profiles LIMIT 1),
    -500,
    'spend_analysis',
    'Test Cronbach Alpha',
    NULL
);

-- Check transaction history
SELECT * FROM public.token_transactions ORDER BY created_at DESC LIMIT 10;
```

### Test Activity Logging
```sql
-- Log a test activity
SELECT public.log_activity(
    (SELECT id FROM public.profiles LIMIT 1),
    'analysis',
    '{"type": "cronbach", "items": 10}'::jsonb,
    'test-session-123'
);

-- Check activity logs
SELECT * FROM public.user_activity ORDER BY created_at DESC LIMIT 10;
```

---

## 🔄 Migration from Old Schema

Nếu bạn đã có database cũ, chạy các migration sau:

### Add Missing Columns
```sql
-- Add ORCID support
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS orcid_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'google';

-- Add token system
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 100000,
ADD COLUMN IF NOT EXISTS total_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0;

-- Add referral system
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by_code TEXT,
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
```

### Backfill Data
```sql
-- Generate referral codes for existing users
UPDATE public.profiles 
SET referral_code = 'NCS-' || UPPER(substring(md5(random()::text || id::text) from 1 for 8))
WHERE referral_code IS NULL;

-- Set default tokens for existing users
UPDATE public.profiles 
SET tokens = 100000 
WHERE tokens IS NULL OR tokens = 0;
```

---

## 🐛 Troubleshooting

### Issue: "relation does not exist"

**Cause:** Table chưa được tạo

**Fix:** Run `DATABASE_SETUP_COMPLETE.sql` lại

### Issue: "permission denied for table"

**Cause:** RLS policies chưa được setup

**Fix:** Check policies:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Issue: "duplicate key value violates unique constraint"

**Cause:** Đang cố insert duplicate referral_code hoặc email

**Fix:** Check existing data:
```sql
SELECT referral_code, COUNT(*) 
FROM public.profiles 
GROUP BY referral_code 
HAVING COUNT(*) > 1;
```

### Issue: Function not found

**Cause:** Functions chưa được tạo

**Fix:** Run STEP 8 trong setup script

---

## 📞 Support

Nếu gặp vấn đề:

1. Check Supabase logs: Dashboard → Logs → Postgres Logs
2. Check RLS policies: Dashboard → Database → Policies
3. Verify tables exist: Dashboard → Table Editor
4. Test functions: Dashboard → SQL Editor

---

## 🎯 Next Steps

Sau khi setup database:

1. ✅ Promote user to admin
2. ✅ Configure Google OAuth
3. ✅ Configure ORCID OAuth (optional)
4. ✅ Test user registration
5. ✅ Test token system
6. ✅ Test referral system
7. ✅ Deploy to production

---

**Created:** January 26, 2026  
**Last Updated:** January 26, 2026  
**Version:** 1.0.0
