import { supabase } from '@/lib/supabase';
import type { SiteContent, SiteContentSection } from '@/types/content';

export async function getSiteContent(section: SiteContentSection): Promise<SiteContent | null> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('section', section)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function listAllSiteContent(): Promise<SiteContent[]> {
  const { data, error } = await supabase.from('site_content').select('*');
  if (error) throw error;
  return data ?? [];
}

export async function updateSiteContent(
  section: SiteContentSection,
  changes: Partial<Pick<SiteContent, 'heading' | 'body' | 'image'>>
): Promise<SiteContent> {
  const { data, error } = await supabase
    .from('site_content')
    .update(changes)
    .eq('section', section)
    .select()
    .single();
  if (error) throw error;
  return data;
}
