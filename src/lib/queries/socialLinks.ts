import { supabase } from '@/lib/supabase';
import type { SocialLink } from '@/types/content';

export async function listSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createSocialLink(
  link: Omit<SocialLink, 'id'>
): Promise<SocialLink> {
  const { data, error } = await supabase.from('social_links').insert(link).select().single();
  if (error) throw error;
  return data;
}

export async function updateSocialLink(
  id: string,
  changes: Partial<Omit<SocialLink, 'id'>>
): Promise<SocialLink> {
  const { data, error } = await supabase
    .from('social_links')
    .update(changes)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSocialLink(id: string): Promise<void> {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  if (error) throw error;
}
