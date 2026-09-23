// Hand-written to match supabase/migrations/0001_initial_schema.sql.
// Once the project is linked, replace this with the real generated file via:
//   npx supabase gen types typescript --project-id <ref> > src/types/supabase.ts

export type WorkStatus = 'draft' | 'published';
export type CrochetAvailability = 'made_to_order' | 'one_of_one' | 'sold';

export interface Database {
  public: {
    Tables: {
      makeup_works: {
        Row: {
          id: string;
          title: string;
          event_type: string | null;
          images: string[];
          description: string | null;
          tags: string[];
          date: string | null;
          featured: boolean;
          status: WorkStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['makeup_works']['Row']> & {
          title: string;
        };
        Update: Partial<Database['public']['Tables']['makeup_works']['Row']>;
      };
      crochet_works: {
        Row: {
          id: string;
          title: string;
          images: string[];
          description: string | null;
          materials: string | null;
          size: string | null;
          availability: CrochetAvailability | null;
          price_note: string | null;
          tags: string[];
          date: string | null;
          featured: boolean;
          status: WorkStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['crochet_works']['Row']> & {
          title: string;
        };
        Update: Partial<Database['public']['Tables']['crochet_works']['Row']>;
      };
      site_content: {
        Row: {
          section: string;
          heading: string | null;
          body: string | null;
          image: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['site_content']['Row']> & {
          section: string;
        };
        Update: Partial<Database['public']['Tables']['site_content']['Row']>;
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          url: string;
          display_order: number;
        };
        Insert: Partial<Database['public']['Tables']['social_links']['Row']> & {
          platform: string;
          url: string;
        };
        Update: Partial<Database['public']['Tables']['social_links']['Row']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          extra_fields: Record<string, unknown>;
          created_at: string;
          emailed_ok: boolean;
        };
        Insert: Partial<Database['public']['Tables']['contact_submissions']['Row']> & {
          name: string;
          email: string;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Row']>;
      };
      contact_form_config: {
        Row: {
          id: number;
          fields: Array<{ key: string; label: string; type: string; required: boolean }>;
        };
        Insert: Partial<Database['public']['Tables']['contact_form_config']['Row']>;
        Update: Partial<Database['public']['Tables']['contact_form_config']['Row']>;
      };
    };
  };
}
