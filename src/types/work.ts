import type { Database } from './supabase';

export type MakeupWork = Database['public']['Tables']['makeup_works']['Row'];
export type CrochetWork = Database['public']['Tables']['crochet_works']['Row'];

export type Discipline = 'makeup' | 'crochet';

// A shared shape the public Portfolio/WorkDetail pages can render either
// discipline through, without branching UI code on every field.
export interface WorkSummary {
  id: string;
  discipline: Discipline;
  title: string;
  coverImage: string | null;
  tags: string[];
  featured: boolean;
}

export function toWorkSummary(
  work: MakeupWork | CrochetWork,
  discipline: Discipline
): WorkSummary {
  return {
    id: work.id,
    discipline,
    title: work.title,
    coverImage: work.images[0] ?? null,
    tags: work.tags,
    featured: work.featured,
  };
}
