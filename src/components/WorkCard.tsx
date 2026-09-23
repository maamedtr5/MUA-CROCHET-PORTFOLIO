import { Link } from 'react-router-dom';
import type { Discipline } from '@/types/work';

interface WorkCardProps {
  id: string;
  discipline: Discipline;
  title: string;
  coverImage: string | null;
  subtitle?: string | null;
  aspect?: string; // e.g. '4/5', '16/9'
}

// Large-image-first, per the approved direction: the photo IS the card, with
// just enough overlay to identify it — no separate caption block underneath.
export default function WorkCard({ id, discipline, title, coverImage, subtitle, aspect = '4/5' }: WorkCardProps) {
  return (
    <Link
      to={`/portfolio/${discipline}/${id}`}
      style={{
        position: 'relative',
        display: 'block',
        aspectRatio: aspect,
        overflow: 'hidden',
        borderRadius: 2,
        textDecoration: 'none',
        background: 'var(--sage-soft)',
      }}
    >
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(20,15,10,0.65), transparent 55%)',
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24, color: 'var(--parchment)' }}>
        <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.3rem' }}>
          {title}
        </h3>
        {subtitle ? (
          <span style={{ fontSize: '0.8rem', opacity: 0.85, letterSpacing: '0.02em' }}>{subtitle}</span>
        ) : null}
      </div>
    </Link>
  );
}
