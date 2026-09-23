import { supabase } from '@/lib/supabase';
import type { MakeupWork } from '@/types/work';

// ---- public reads (RLS restricts these to status = 'published' for anon users) ----

export async function listPublishedMakeupWorks(tag?: string): Promise<MakeupWork[]> {
  let query = supabase
    .from('makeup_works')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false });

  if (tag) query = query.contains('tags', [tag]);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listFeaturedMakeupWorks(): Promise<MakeupWork[]> {
  const { data, error } = await supabase
    .from('makeup_works')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMakeupWork(id: string): Promise<MakeupWork | null> {
  const { data, error } = await supabase.from('makeup_works').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null; // no row found
    throw error;
  }
  return data;
}

// ---- admin reads/writes (RLS's is_admin() policy only allows these once logged in) ----

export async function listAllMakeupWorksAdmin(): Promise<MakeupWork[]> {
  const { data, error } = await supabase
    .from('makeup_works')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMakeupWork(
  work: Omit<MakeupWork, 'id' | 'created_at' | 'updated_at'>
): Promise<MakeupWork> {
  const { data, error } = await supabase.from('makeup_works').insert(work).select().single();
  if (error) throw error;
  return data;
}

export async function updateMakeupWork(
  id: string,
  changes: Partial<Omit<MakeupWork, 'id' | 'created_at' | 'updated_at'>>
): Promise<MakeupWork> {
  const { data, error } = await supabase
    .from('makeup_works')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMakeupWork(id: string): Promise<void> {
  const { error } = await supabase.from('makeup_works').delete().eq('id', id);
  if (error) throw error;
}

export async function setMakeupWorkFeatured(id: string, featured: boolean): Promise<void> {
  const { error } = await supabase.from('makeup_works').update({ featured }).eq('id', id);
  if (error) throw error;
}
