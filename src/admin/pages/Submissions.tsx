import { useEffect, useState } from 'react';
import { listContactSubmissionsAdmin, deleteContactSubmission } from '@/lib/queries/contactSubmissions';
import type { ContactSubmission } from '@/types/content';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  function refresh() {
    listContactSubmissionsAdmin().then(setSubmissions);
  }

  useEffect(refresh, []);

  async function remove(id: string) {
    await deleteContactSubmission(id);
    refresh();
  }

  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['From', 'Message', 'Sent', 'Emailed?', ''].map((h) => (
              <th key={h} style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--bark-soft)', fontWeight: 700, padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td style={cellStyle}>{s.name}<br /><span style={{ color: 'var(--bark-soft)', fontSize: '0.82rem' }}>{s.email}</span></td>
              <td style={{ ...cellStyle, maxWidth: 360 }}>{s.message}</td>
              <td style={cellStyle}>{new Date(s.created_at).toLocaleDateString()}</td>
              <td style={cellStyle}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: s.emailed_ok ? 'rgba(75,107,52,0.14)' : 'rgba(123,44,6,0.14)', color: s.emailed_ok ? '#4B6B34' : 'var(--rust-bold)' }}>
                  {s.emailed_ok ? 'Sent' : 'Failed'}
                </span>
              </td>
              <td style={cellStyle}>
                <button type="button" onClick={() => remove(s.id)} style={{ border: 'none', background: 'none', color: 'var(--rust-bold)', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
              </td>
            </tr>
          ))}
          {submissions.length === 0 && (
            <tr><td style={cellStyle} colSpan={5}>No submissions yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle: React.CSSProperties = { padding: '14px 18px', borderBottom: '1px solid var(--line)', fontSize: '0.92rem' };
