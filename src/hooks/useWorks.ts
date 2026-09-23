import { useEffect, useState } from 'react';
import { listPublishedMakeupWorks } from '@/lib/queries/makeupWorks';
import { listPublishedCrochetWorks } from '@/lib/queries/crochetWorks';
import type { Discipline } from '@/types/work';
import type { MakeupWork } from '@/types/work';
import type { CrochetWork } from '@/types/work';

// Public-facing hook: fetches published works for whichever discipline is
// active on the Portfolio page toggle, refetching when either changes.
export function useWorks(discipline: Discipline, tag?: string) {
  const [works, setWorks] = useState<(MakeupWork | CrochetWork)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetcher =
      discipline === 'makeup' ? listPublishedMakeupWorks : listPublishedCrochetWorks;

    fetcher(tag)
      .then((data) => {
        if (!cancelled) setWorks(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load works');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [discipline, tag]);

  return { works, loading, error };
}
