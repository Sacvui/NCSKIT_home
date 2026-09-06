-- ==========================================
-- ACADEMY RESOURCES (Unified Hub for Theories, Scales, and Methods)
-- ==========================================

-- 1. Create the unified table
CREATE TABLE IF NOT EXISTS public.academy_resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('theory', 'scale', 'method')),
    title_vi TEXT NOT NULL,
    title_en TEXT,
    description_vi TEXT,
    description_en TEXT,
    category TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    author TEXT,
    year INTEGER,
    citation TEXT,
    content_vi JSONB, -- For rich text content or markdown
    content_en JSONB,
    meta_data JSONB DEFAULT '{}'::jsonb, -- Store scale_items here as JSON array, or icon_name for methods
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.academy_resources ENABLE ROW LEVEL SECURITY;

-- 3. Create policies (Allow everyone to read)
CREATE POLICY "Allow public read access to academy_resources"
ON public.academy_resources FOR SELECT
USING (true);

-- Allow authenticated admins to insert/update (assumes authenticated role)
CREATE POLICY "Allow authenticated insert to academy_resources"
ON public.academy_resources FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update to academy_resources"
ON public.academy_resources FOR UPDATE
TO authenticated
USING (true);

-- 4. Create trigger to auto-update 'updated_at'
CREATE OR REPLACE FUNCTION update_academy_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_academy_resources_modtime ON public.academy_resources;
CREATE TRIGGER update_academy_resources_modtime
BEFORE UPDATE ON public.academy_resources
FOR EACH ROW
EXECUTE FUNCTION update_academy_updated_at_column();
