import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/queries/siteContent';
import type { SiteContent } from '@/types/content';

export default function About() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    getSiteContent('about').then(setContent).catch(() => setContent(null));
  }, []);

  return (
    <section className="wrap" style={{ padding: '100px 32px', display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 64, alignItems: 'center' }}>
      {content?.image ? (
        <img src={content.image} alt="" style={{ aspectRatio: '4/5', objectFit: 'cover', borderRadius: 2 }} />
      ) : (
        <div style={{ aspectRatio: '4/5', background: 'var(--sage-soft)', borderRadius: 2 }} />
      )}
      <div>
        <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 'clamp(1.8rem,3vw,2.4rem)', margin: '0 0 24px', lineHeight: 1.15 }}>
          {content?.heading ?? 'The artist'}
        </h2>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.18rem', lineHeight: 1.85, color: 'var(--bark)', maxWidth: '52ch' }}>
          {content?.body ?? 'Bio goes here — editable from the admin dashboard.'}
        </p>
      </div>
    </section>
  );
}
