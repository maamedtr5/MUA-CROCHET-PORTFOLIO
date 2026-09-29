import type { Database } from './supabase';

export type SiteContent = Database['public']['Tables']['site_content']['Row'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];
export type ContactFormConfig = Database['public']['Tables']['contact_form_config']['Row'];
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

export type SiteContentSection = 'homepage_intro' | 'about' | 'contact_info';
export type ContactFormField = {
  key: string;
  label: string;
  type: string;
  required: boolean;
};