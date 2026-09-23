import { supabase } from '@/lib/supabase';
import type { ContactFormConfig, ContactSubmission } from '@/types/content';

// ---- public: form config drives the dynamic Contact page fields ----

export async function getContactFormConfig(): Promise<ContactFormConfig | null> {
  const { data, error } = await supabase
    .from('contact_form_config')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function updateContactFormConfig(
  fields: ContactFormConfig['fields']
): Promise<ContactFormConfig> {
  const { data, error } = await supabase
    .from('contact_form_config')
    .update({ fields })
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- public: submitting the form goes through the Edge Function, not a direct
// table insert — see supabase/functions/send-contact-email. The function writes
// the row (using the service role key, bypassing RLS) and emails the artist via
// Resend, then returns success/fail to the form. ----

export interface ContactSubmitPayload {
  name: string;
  email: string;
  message: string;
  extra_fields?: Record<string, unknown>;
}

export async function submitContactForm(
  payload: ContactSubmitPayload
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke('send-contact-email', {
    body: payload,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, ...(data as object) };
}

// ---- admin: read-only log of submissions ----

export async function listContactSubmissionsAdmin(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
  if (error) throw error;
}
