import { useEffect, useState, FormEvent } from 'react';
import { getContactFormConfig, submitContactForm } from '@/lib/queries/contactSubmissions';
import type { ContactFormConfig } from '@/types/content';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--sans)',
  fontSize: '0.95rem',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--line)',
  padding: '10px 2px',
  color: 'var(--ink)',
  outline: 'none',
};

// Renders whatever fields are configured in contact_form_config.fields — this
// is what lets the artist add/remove/reorder fields from the admin dashboard
// without a developer touching this component again.
export default function ContactForm() {
  const [config, setConfig] = useState<ContactFormConfig | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  useEffect(() => {
    getContactFormConfig().then(setConfig).catch(() => setConfig(null));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    const { name, email, message, ...extra } = values;
    const result = await submitContactForm({
      name: name ?? '',
      email: email ?? '',
      message: message ?? '',
      extra_fields: extra,
    });
    setStatus(result.ok ? 'sent' : 'error');
  }

  if (!config) return null;

  if (status === 'sent') {
    return <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem' }}>Thanks — message sent. She'll get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {config.fields.map((field) => (
        <div key={field.key} style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--bark)', marginBottom: 8 }}>
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              rows={4}
              required={field.required}
              style={fieldStyle}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            />
          ) : (
            <input
              type={field.type}
              required={field.required}
              style={fieldStyle}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            />
          )}
        </div>
      ))}
      {status === 'error' && (
        <p style={{ color: 'var(--rust-bold)', fontSize: '0.85rem', marginBottom: 16 }}>
          Something went wrong sending that — please try again.
        </p>
      )}
      <button type="submit" className="btn btn-fill" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
