import { useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMakeupWork, getMakeupWork, updateMakeupWork } from '@/lib/queries/makeupWorks';
import ImageUploader from '@/admin/components/ImageUploader';
import TagInput from '@/admin/components/TagInput';
import { useEffect } from 'react';
import type { WorkStatus } from '@/types/supabase';

// Handles both "New Makeup Post" and editing an existing one (via an :id param).
export default function NewMakeupPost() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getMakeupWork(id).then((work) => {
      if (!work) return;
      setTitle(work.title);
      setEventType(work.event_type ?? '');
      setDescription(work.description ?? '');
      setImages(work.images);
      setTags(work.tags);
      setDate(work.date ?? '');
      setFeatured(work.featured);
    });
  }, [id]);

  async function save(status: WorkStatus, e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title,
      event_type: eventType || null,
      description: description || null,
      images,
      tags,
      date: date || null,
      featured,
      status,
    };
    try {
      if (id) {
        await updateMakeupWork(id, payload);
      } else {
        await createMakeupWork(payload);
      }
      navigate('/admin');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-panel">
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.4rem', margin: '0 0 24px' }}>
        {id ? 'Edit makeup post' : 'New makeup post'}
      </h2>

      <div className="admin-form-grid">
        <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bridal glam, Adjoa" style={inputStyle} /></Field>
        <Field label="Event type"><input value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="e.g. bridal, editorial, glam" style={inputStyle} /></Field>

        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Images"><ImageUploader images={images} onChange={setImages} /></Field>
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Description">
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes on the look, products used, the story behind it" style={inputStyle} />
          </Field>
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Tags"><TagInput tags={tags} onChange={setTags} /></Field>
        </div>

        <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} /></Field>
        <Field label="Feature on homepage?">
          <select value={featured ? 'yes' : 'no'} onChange={(e) => setFeatured(e.target.value === 'yes')} style={inputStyle}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
        <button type="button" disabled={saving} onClick={(e) => save('draft', e as unknown as FormEvent)} className="btn btn-line">
          Save as draft
        </button>
        <button type="button" disabled={saving} onClick={(e) => save('published', e as unknown as FormEvent)} className="btn btn-fill">
          Publish
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--bark)', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', fontFamily: 'var(--sans)', fontSize: '0.92rem',
  border: '1px solid var(--line)', borderRadius: 6, padding: '10px 12px',
  background: 'var(--parchment)', color: 'var(--ink)', outline: 'none',
};
