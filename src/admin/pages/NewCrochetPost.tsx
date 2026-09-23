import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCrochetWork, getCrochetWork, updateCrochetWork } from '@/lib/queries/crochetWorks';
import ImageUploader from '@/admin/components/ImageUploader';
import TagInput from '@/admin/components/TagInput';
import type { WorkStatus, CrochetAvailability } from '@/types/supabase';

export default function NewCrochetPost() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [materials, setMaterials] = useState('');
  const [size, setSize] = useState('');
  const [availability, setAvailability] = useState<CrochetAvailability>('made_to_order');
  const [priceNote, setPriceNote] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCrochetWork(id).then((work) => {
      if (!work) return;
      setTitle(work.title);
      setMaterials(work.materials ?? '');
      setSize(work.size ?? '');
      setAvailability(work.availability ?? 'made_to_order');
      setPriceNote(work.price_note ?? '');
      setDescription(work.description ?? '');
      setImages(work.images);
      setTags(work.tags);
      setDate(work.date ?? '');
      setFeatured(work.featured);
    });
  }, [id]);

  async function save(status: WorkStatus) {
    setSaving(true);
    const payload = {
      title,
      materials: materials || null,
      size: size || null,
      availability,
      price_note: priceNote || null,
      description: description || null,
      images,
      tags,
      date: date || null,
      featured,
      status,
    };
    try {
      if (id) {
        await updateCrochetWork(id, payload);
      } else {
        await createCrochetWork(payload);
      }
      navigate('/admin');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e: FormEvent) => e.preventDefault()} style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 10, padding: 32 }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.4rem', margin: '0 0 24px' }}>
        {id ? 'Edit crochet post' : 'New crochet post'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
        <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ridge-stitch tote" style={inputStyle} /></Field>
        <Field label="Materials"><input value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="e.g. cotton yarn, wood handles" style={inputStyle} /></Field>

        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Images"><ImageUploader images={images} onChange={setImages} /></Field>
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Description">
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes on the piece" style={inputStyle} />
          </Field>
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Tags"><TagInput tags={tags} onChange={setTags} /></Field>
        </div>

        <Field label="Size"><input value={size} onChange={(e) => setSize(e.target.value)} style={inputStyle} /></Field>
        <Field label="Availability">
          <select value={availability} onChange={(e) => setAvailability(e.target.value as CrochetAvailability)} style={inputStyle}>
            <option value="made_to_order">Made to order</option>
            <option value="one_of_one">One of one</option>
            <option value="sold">Sold</option>
          </select>
        </Field>
        <Field label="Price note"><input value={priceNote} onChange={(e) => setPriceNote(e.target.value)} placeholder="e.g. DM for pricing" style={inputStyle} /></Field>
        <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} /></Field>
        <Field label="Feature on homepage?">
          <select value={featured ? 'yes' : 'no'} onChange={(e) => setFeatured(e.target.value === 'yes')} style={inputStyle}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
        <button type="button" disabled={saving} onClick={() => save('draft')} className="btn btn-line">Save as draft</button>
        <button type="button" disabled={saving} onClick={() => save('published')} className="btn btn-fill">Publish</button>
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
