import { useMemo, useState } from 'react';
import { useWorks } from '@/hooks/useWorks';
import WorkCard from '@/components/WorkCard';
import TagFilter from '@/components/TagFilter';
import type { Discipline } from '@/types/work';

export default function Portfolio() {
  const [discipline, setDiscipline] = useState<Discipline>('makeup');
  const [tag, setTag] = useState<string | undefined>(undefined);
  const { works, loading, error } = useWorks(discipline, tag);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    works.forEach((w) => w.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [works]);

  function switchDiscipline(next: Discipline) {
    setDiscipline(next);
    setTag(undefined);
  }

  return (
    <section className="wrap" style={{ padding: '100px 32px' }}>
      <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 22, marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 'clamp(1.9rem, 3.4vw, 2.7rem)', margin: 0 }}>
          Selected work
        </h1>
      </div>

      <div style={{ display: 'inline-flex', border: '1px solid var(--line)', borderRadius: 999, padding: 4, marginBottom: 20 }}>
        <button
          onClick={() => switchDiscipline('makeup')}
          style={toggleBtnStyle(discipline === 'makeup')}
        >
          Makeup
        </button>
        <button
          onClick={() => switchDiscipline('crochet')}
          style={toggleBtnStyle(discipline === 'crochet')}
        >
          Crochet
        </button>
      </div>

      {allTags.length > 0 && <TagFilter tags={allTags} active={tag} onSelect={setTag} />}

      {loading && <p style={{ marginTop: 40, color: 'var(--bark-soft)' }}>Loading…</p>}
      {error && <p style={{ marginTop: 40, color: 'var(--rust-bold)' }}>{error}</p>}

      {!loading && !error && works.length === 0 && (
        <p style={{ marginTop: 40, color: 'var(--bark-soft)' }}>No published work yet.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 40 }}>
        {works.map((work) => (
          <WorkCard
            key={work.id}
            id={work.id}
            discipline={discipline}
            title={work.title}
            coverImage={work.images[0] ?? null}
            subtitle={work.tags[0]}
          />
        ))}
      </div>
    </section>
  );
}

function toggleBtnStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: 'var(--sans)',
    fontWeight: 600,
    fontSize: '0.9rem',
    border: 'none',
    background: active ? 'var(--ink)' : 'transparent',
    color: active ? 'var(--parchment)' : 'var(--bark)',
    padding: '10px 24px',
    borderRadius: 999,
    cursor: 'pointer',
  };
}
