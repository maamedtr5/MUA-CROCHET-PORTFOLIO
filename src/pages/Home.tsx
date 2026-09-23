import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSiteContent } from '@/lib/queries/siteContent';
import { listFeaturedMakeupWorks } from '@/lib/queries/makeupWorks';
import { listFeaturedCrochetWorks } from '@/lib/queries/crochetWorks';
import WorkCard from '@/components/WorkCard';
import type { SiteContent } from '@/types/content';
import type { WorkSummary } from '@/types/work';
import { toWorkSummary } from '@/types/work';

export default function Home() {
  const [intro, setIntro] = useState<SiteContent | null>(null);
  const [featured, setFeatured] = useState<WorkSummary[]>([]);

  useEffect(() => {
    getSiteContent('homepage_intro').then(setIntro).catch(() => setIntro(null));

    Promise.all([listFeaturedMakeupWorks(), listFeaturedCrochetWorks()])
      .then(([makeup, crochet]) => {
        const combined = [
          ...makeup.map((w) => toWorkSummary(w, 'makeup')),
          ...crochet.map((w) => toWorkSummary(w, 'crochet')),
        ];
        setFeatured(combined);
      })
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          minHeight: '70vh',
          alignItems: 'center',
          padding: '80px 32px',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 'clamp(2.6rem, 5.6vw, 4.6rem)', lineHeight: 1.02, margin: '0 0 28px' }}>
            {intro?.heading ?? 'Two crafts, one hand'}
          </h1>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.28rem', lineHeight: 1.65, color: 'var(--bark)', maxWidth: '46ch', margin: '0 0 34px' }}>
            {intro?.body ?? "Makeup that catches light the way it's meant to, and crochet built stitch by stitch to last."}
          </p>
          <Link to="/portfolio" className="btn btn-fill">View the work</Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="wrap" style={{ padding: '60px 32px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '2rem', marginBottom: 32 }}>Featured</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {featured.map((work) => (
              <WorkCard
                key={`${work.discipline}-${work.id}`}
                id={work.id}
                discipline={work.discipline}
                title={work.title}
                coverImage={work.coverImage}
                subtitle={work.discipline === 'makeup' ? 'Makeup' : 'Crochet'}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
