-- Migration: Create Knowledge Base Table for CMS
-- Description: Stores academic articles with full JSONB flexibility for multi-section content

CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    author TEXT DEFAULT 'ncsStat Editorial',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Translations & Localized Fields
    title_vi TEXT NOT NULL,
    title_en TEXT NOT NULL,
    excerpt_vi TEXT,
    excerpt_en TEXT,
    expert_tip_vi TEXT,
    expert_tip_en TEXT,
    
    -- Full Article Structure (Array of objects like [{h2_vi: '...', content_vi: '...'}] )
    content_structure JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Visuals
    icon_name TEXT DEFAULT 'Brain', -- Lucide icon name string
    read_time TEXT DEFAULT '15 min'
);

-- Enable RLS
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read
CREATE POLICY "Public articles are viewable by everyone" 
ON public.knowledge_articles FOR SELECT 
USING (true);

-- Policy: Only authenticated admins can insert/update/delete
-- Note: Replace 'your-admin-email@example.com' if needed or use a specific role
CREATE POLICY "Admins can manage articles" 
ON public.knowledge_articles FOR ALL 
USING (
    auth.jwt() ->> 'email' = 'sacvui@gmail.com' -- Hardcoded admin email or use a check for admin role
)
WITH CHECK (
    auth.jwt() ->> 'email' = 'sacvui@gmail.com'
);

-- Trigger for update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_knowledge_articles_updated_at
BEFORE UPDATE ON public.knowledge_articles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
