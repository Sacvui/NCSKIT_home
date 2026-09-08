import { createClient } from '@supabase/supabase-js'
import { getAcademyResources } from './lib/services/academy'

const SUPABASE_URL = "https://xfftxehejtmxcoftkkmo.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnR4ZWhlanRteGNvZnRra21vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk3MTY2OCwiZXhwIjoyMDg0NTQ3NjY4fQ.C8nIHqDdaZGfz4mX7eYK5Or_0gyVydXXX4jum8E_ITU"

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seed() {
    console.log("Fetching fallback data...")
    // This will hit the fallback logic since we commented out the DB return
    const res = await getAcademyResources()
    
    if (res.source !== 'fallback') {
        console.error("Expected fallback source, got", res.source)
    }
    
    const itemsToInsert = res.data.map(item => {
        return {
            slug: item.slug,
            type: item.type,
            title_vi: item.title_vi,
            title_en: item.title_en,
            description_vi: item.description_vi,
            description_en: item.description_en,
            content_vi: item.content_vi,
            content_en: item.content_en,
            category: item.category,
            tags: item.tags,
            author: item.author,
            year: item.year,
            citation: item.citation,
            meta_data: item.meta_data,
            // Only insert id if your table uses 'slug' as primary key or something else.
            // If Supabase uses UUID for 'id' and 'slug' as a unique constraint, omit 'id'.
            // Let's assume slug is unique, we can use upsert on slug.
        }
    })
    
    console.log("Found " + itemsToInsert.length + " items to upsert.")
    
    const { data, error } = await supabase
        .from('academy_resources')
        .upsert(itemsToInsert, { onConflict: 'slug' })
        .select()
        
    if (error) {
        console.error("Upsert failed:", error)
    } else {
        console.log("Successfully upserted " + (data ? data.length : 0) + " records into Supabase!")
    }
}

seed()
