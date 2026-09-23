interface TagFilterProps {
  tags: string[];
  active?: string;
  onSelect: (tag: string | undefined) => void;
}

export default function TagFilter({ tags, active, onSelect }: TagFilterProps) {
  const chipStyle = (isActive: boolean): React.CSSProperties => ({
    fontFamily: 'var(--sans)',
    fontSize: '0.82rem',
    fontWeight: 700,
    background: isActive ? 'var(--olive-bold)' : 'var(--sage-soft)',
    color: isActive ? 'var(--daiquiri)' : 'var(--olive-deep)',
    padding: '7px 16px',
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
  });

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 40 }}>
      <button style={chipStyle(!active)} onClick={() => onSelect(undefined)}>
        All
      </button>
      {tags.map((tag) => (
        <button key={tag} style={chipStyle(active === tag)} onClick={() => onSelect(tag)}>
          {tag}
        </button>
      ))}
    </div>
  );
}
