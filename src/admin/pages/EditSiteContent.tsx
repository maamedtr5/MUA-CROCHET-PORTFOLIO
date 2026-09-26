import { useEffect, useState } from 'react';
import { getSiteContent, updateSiteContent } from '@/lib/queries/siteContent';
import { listSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '@/lib/queries/socialLinks';
import { getContactFormConfig, updateContactFormConfig } from '@/lib/queries/contactSubmissions';
import ImageUploader from '@/admin/components/ImageUploader';
import type { SiteContentSection, SocialLink } from '@/types/content';

const SECTIONS: { key: SiteContentSection; label: string }[] = [
  { key: 'homepage_intro', label: 'Homepage intro' },
  { key: 'about', label: 'About' },
  { key: 'contact_info', label: 'Contact info' },
];

export default function EditSiteContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {SECTIONS.map((s) => (
        <SiteContentEditor key={s.key} section={s.key} label={s.label} />
      ))}
      <SocialLinksEditor />
      <ContactFieldsEditor />
    </div>
  );
}

function SiteContentEditor({ section, label }: { section: SiteContentSection; label: string }) {
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteContent(section).then((c) => {
      if (!c) return;
      setHeading(c.heading ?? '');
      setBody(c.body ?? '');
      setImage(c.image);
    });
  }, [section]);

  async function save() {
    setSaving(true);
    setSaved(false);
    await updateSiteContent(section, { heading, body, image });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="admin-panel" style={panelStyle}>
      <h2 style={headingStyle}>{label}</h2>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Heading</label>
        <input value={heading} onChange={(e) => setHeading(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Body</label>
        <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Image (optional)</label>
        <ImageUploader images={image ? [image] : []} onChange={(imgs) => setImage(imgs[imgs.length - 1] ?? null)} />
      </div>
      <button type="button" onClick={save} disabled={saving} className="btn btn-fill">
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
      </button>
    </div>
  );
}

function SocialLinksEditor() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');

  function refresh() {
    listSocialLinks().then(setLinks);
  }

  useEffect(refresh, []);

  async function add() {
    if (!platform || !url) return;
    await createSocialLink({ platform, url, display_order: links.length });
    setPlatform('');
    setUrl('');
    refresh();
  }

  async function remove(id: string) {
    await deleteSocialLink(id);
    refresh();
  }

  return (
    <div className="admin-panel" style={panelStyle}>
      <h2 style={headingStyle}>Social links</h2>
      {links.map((l) => (
        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
          <span>{l.platform} — {l.url}</span>
          <button type="button" onClick={() => remove(l.id)} style={{ border: 'none', background: 'none', color: 'var(--rust-bold)', cursor: 'pointer' }}>Remove</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <input placeholder="Platform (e.g. instagram)" value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} style={{ ...inputStyle, flex: 2 }} />
        <button type="button" onClick={add} className="btn btn-line">Add</button>
      </div>
    </div>
  );
}

function ContactFieldsEditor() {
  const [fields, setFields] = useState<{ key: string; label: string; type: string; required: boolean }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getContactFormConfig().then((c) => c && setFields(c.fields));
  }, []);

  function updateField(i: number, changes: Partial<(typeof fields)[number]>) {
    setFields((f) => f.map((field, idx) => (idx === i ? { ...field, ...changes } : field)));
  }

  function addField() {
    setFields((f) => [...f, { key: `field_${f.length}`, label: '', type: 'text', required: false }]);
  }

  function removeField(i: number) {
    setFields((f) => f.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    await updateContactFormConfig(fields);
    setSaving(false);
  }

  return (
    <div className="admin-panel" style={panelStyle}>
      <h2 style={headingStyle}>Contact form fields</h2>
      {fields.map((f, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} placeholder="Label" style={{ ...inputStyle, flex: 2 }} />
          <select value={f.type} onChange={(e) => updateField(i, { type: e.target.value })} style={{ ...inputStyle, flex: 1 }}>
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="tel">Phone</option>
            <option value="textarea">Long text</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
            <input type="checkbox" checked={f.required} onChange={(e) => updateField(i, { required: e.target.checked })} />
            Required
          </label>
          <button type="button" onClick={() => removeField(i)} style={{ border: 'none', background: 'none', color: 'var(--rust-bold)', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button type="button" onClick={addField} className="btn btn-line">+ Add field</button>
        <button type="button" onClick={save} disabled={saving} className="btn btn-fill">{saving ? 'Saving…' : 'Save fields'}</button>
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = { background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 10 };
const headingStyle: React.CSSProperties = { fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.3rem', margin: '0 0 20px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--bark)', marginBottom: 7 };
const inputStyle: React.CSSProperties = {
  width: '100%', fontFamily: 'var(--sans)', fontSize: '0.92rem',
  border: '1px solid var(--line)', borderRadius: 6, padding: '10px 12px',
  background: 'var(--parchment)', color: 'var(--ink)', outline: 'none',
};
