import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMakeupWork } from '@/lib/queries/makeupWorks';
import { getCrochetWork } from '@/lib/queries/crochetWorks';
import type { MakeupWork, CrochetWork, Discipline } from '@/types/work';

export default function WorkDetail() {
  const { discipline, id } = useParams<{ discipline: Discipline; id: string }>();
  const [work, setWork] = useState<MakeupWork | CrochetWork | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || !discipline) return;
    const fetcher = discipline === 'makeup' ? getMakeupWork : getCrochetWork;
    fetcher(id).then((w) => (w ? setWork(w) : setNotFound(true)));
  }, [discipline, id]);

  if (notFound) {
    return (
      <div className="wrap" style={{ padding: '100px 32px' }}>
        <p>That piece couldn't be found. <Link to="/portfolio">Back to Portfolio</Link></p>
      </div>
    );
  }

  if (!work) return null;

  const isMakeup = discipline === 'makeup';
  const meta = isMakeup ? (work as MakeupWork).event_type : (work as CrochetWork).materials;

  return (
    <article className="wrap" style={{ padding: '80px 32px' }}>
      <Link to="/portfolio" style={{ fontSize: '0.85rem', color: 'var(--bark-soft)', textDecoration: 'none' }}>
        ← Back to Portfolio
      </Link>

      <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 'clamp(2rem,4vw,3rem)', margin: '24px 0 12px' }}>
        {work.title}
      </h1>
      {meta && <p style={{ color: 'var(--bark-soft)', marginBottom: 32 }}>{meta}</p>}

      <div style={{ display: 'grid', gap: 20, marginBottom: 40 }}>
        {work.images.length > 0 ? (
          work.images.map((src, i) => (
            <img key={i} src={src} alt={`${work.title} ${i + 1}`} style={{ width: '100%', borderRadius: 2 }} />
          ))
        ) : (
          <div style={{ aspectRatio: '16/9', background: 'var(--sage-soft)', borderRadius: 2 }} />
        )}
      </div>

      {work.description && (
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--bark)', maxWidth: '65ch' }}>
          {work.description}
        </p>
      )}

      {!isMakeup && (
        <dl style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 24, fontSize: '0.9rem', color: 'var(--bark)' }}>
          {(work as CrochetWork).size && <div><dt style={{ fontWeight: 700 }}>Size</dt><dd>{(work as CrochetWork).size}</dd></div>}
          {(work as CrochetWork).availability && <div><dt style={{ fontWeight: 700 }}>Availability</dt><dd>{(work as CrochetWork).availability}</dd></div>}
          {(work as CrochetWork).price_note && <div><dt style={{ fontWeight: 700 }}>Pricing</dt><dd>{(work as CrochetWork).price_note}</dd></div>}
        </dl>
      )}

      {work.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 32 }}>
          {work.tags.map((t) => (
            <span key={t} style={{ fontSize: '0.82rem', fontWeight: 700, background: 'var(--olive-bold)', color: 'var(--daiquiri)', padding: '7px 16px', borderRadius: 999 }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
