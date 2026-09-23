import { supabase } from '@/lib/supabase';
import type { CrochetWork } from '@/types/work';

// ---- public reads (RLS restricts these to status = 'published' for anon users) ----

export async function listPublishedCrochetWorks(tag?: string): Promise<CrochetWork[]> {
  let query = supabase
    .from('crochet_works')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false });

  if (tag) query = query.contains('tags', [tag]);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listFeaturedCrochetWorks(): Promise<CrochetWork[]> {
  const { data, error } = await supabase
    .from('crochet_works')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCrochetWork(id: string): Promise<CrochetWork | null> {
  const { data, error } = await supabase.from('crochet_works').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// ---- admin reads/writes ----

export async function listAllCrochetWorksAdmin(): Promise<CrochetWork[]> {
  const { data, error } = await supabase
    .from('crochet_works')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCrochetWork(
  work: Omit<CrochetWork, 'id' | 'created_at' | 'updated_at'>
): Promise<CrochetWork> {
  const { data, error } = await supabase.from('crochet_works').insert(work).select().single();
  if (error) throw error;
  return data;
}

export async function updateCrochetWork(
  id: string,
  changes: Partial<Omit<CrochetWork, 'id' | 'created_at' | 'updated_at'>>
): Promise<CrochetWork> {
  const { data, error } = await supabase
    .from('crochet_works')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCrochetWork(id: string): Promise<void> {
  const { error } = await supabase.from('crochet_works').delete().eq('id', id);
  if (error) throw error;
}

export async function setCrochetWorkFeatured(id: string, featured: boolean): Promise<void> {
  const { error } = await supabase.from('crochet_works').update({ featured }).eq('id', id);
  if (error) throw error;
}
