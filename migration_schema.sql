create table public.knowledge_articles (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  category text not null,
  title_vi text not null,
  title_en text not null,
  expert_tip_vi text null,
  expert_tip_en text null,
  content_structure jsonb not null default '[]'::jsonb,
  constraint knowledge_articles_pkey primary key (id),
  constraint knowledge_articles_slug_key unique (slug)
) TABLESPACE pg_default;      

create table public.scales (
  id uuid not null default gen_random_uuid (),
  name_vi text not null,
  name_en text not null,
  author text null,
  year integer null,
  citation text null,
  description_vi text null,
  description_en text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  tags text[] null default '{}'::text[],
  research_model text null,
  category text[] null default '{}'::text[],
  constraint scales_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists scales_tags_idx on public.scales using gin (tags) TABLESPACE pg_default;    

create table public.scale_items (
  id uuid not null default gen_random_uuid (),
  scale_id uuid null,
  code text not null,
  text_vi text not null,
  text_en text not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint scale_items_pkey primary key (id),
  constraint scale_items_scale_id_fkey foreign KEY (scale_id) references scales (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists scale_items_scale_id_idx on public.scale_items using btree (scale_id) TABLESPACE pg_default;        

create table public.token_transactions (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  amount integer not null,
  type text not null,
  description text null,
  related_id uuid null,
  balance_after integer null,
  created_at timestamp with time zone null default now(),
  constraint token_transactions_pkey primary key (id),
  constraint token_transactions_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_token_transactions_user_id on public.token_transactions using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_token_transactions_type on public.token_transactions using btree (type) TABLESPACE pg_default;

create index IF not exists idx_token_transactions_user_type_date on public.token_transactions using btree (user_id, type, created_at desc) TABLESPACE pg_default;
