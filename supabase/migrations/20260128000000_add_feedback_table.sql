-- Create Feedback Table
create table if not exists public.user_feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  type text not null check (type in ('bug', 'idea', 'other')),
  message text not null,
  page_url text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_feedback enable row level security;

-- Policy: Anyone can insert feedback
create policy "Anyone can insert feedback"
  on public.user_feedback for insert
  with check (true);

-- Policy: Only admins can view feedback (assuming admin role or similar, for now let's say users can see their own)
create policy "Users can see their own feedback"
  on public.user_feedback for select
  using (auth.uid() = user_id);
