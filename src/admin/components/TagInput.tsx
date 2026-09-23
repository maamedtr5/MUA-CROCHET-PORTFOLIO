import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function commit() {
    const value = draft.trim();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, border: '1px solid var(--line)', borderRadius: 6, padding: '10px 12px', background: 'var(--parchment)' }}>
      {tags.map((tag) => (
        <span key={tag} style={{ background: 'var(--sage-soft)', color: 'var(--olive-deep)', fontSize: '0.8rem', fontWeight: 600, padding: '5px 10px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}>
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder="add a tag…"
        style={{ border: 'none', background: 'transparent', flex: 1, minWidth: 120, padding: 5, outline: 'none' }}
      />
    </div>
  );
}
