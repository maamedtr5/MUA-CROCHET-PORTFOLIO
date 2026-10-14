import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listAllMakeupWorksAdmin, deleteMakeupWork, updateMakeupWork,
} from '@/lib/queries/makeupWorks';
import {
  listAllCrochetWorksAdmin, deleteCrochetWork, updateCrochetWork,
} from '@/lib/queries/crochetWorks';
import { deleteStoredImages } from '@/lib/storage';
import type { Discipline } from '@/types/work';

interface Row {
  id: string;
  discipline: Discipline;
  title: string;
  cover: string | null;
  images: string[];
  status: string;
  featured: boolean;
  updated_at: string;
}

// The dashboard's home: every post (both disciplines, drafts included) with
// edit / publish / feature / delete — this is where she manages her photos.
export default function WorksList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [makeup, crochet] = await Promise.all([listAllMakeupWorksAdmin(), listAllCrochetWorksAdmin()]);
      const toRow = (w: (typeof makeup)[number] | (typeof crochet)[number], discipline: Discipline): Row => ({
        id: w.id, discipline, title: w.title, cover: w.images[0] ?? null, images: w.images,
        status: w.status, featured: w.featured, updated_at: w.updated_at,
      });
      setRows(
        [...makeup.map((w) => toRow(w, 'makeup')), ...crochet.map((w) => toRow(w, 'crochet'))]
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function change(row: Row, changes: { status?: 'draft' | 'published'; featured?: boolean }) {
    setBusyId(row.id);
    try {
      if (row.discipline === 'makeup') await updateMakeupWork(row.id, changes);
      else await updateCrochetWork(row.id, changes);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete "${row.title}" and its photos? This can't be undone.`)) return;
    setBusyId(row.id);
    try {
      if (row.discipline === 'makeup') await deleteMakeupWork(row.id);
      else await deleteCrochetWork(row.id);
      await deleteStoredImages(row.images);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.4rem', margin: '0 0 16px' }}>Your work</h2>
      {error && <p style={{ color: 'var(--rust-bold)', fontSize: '0.88rem' }}>{error}</p>}
      <div className="table-scroll" style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Photo', 'Title', 'Type', 'Status', 'Featured', ''].map((h) => (
                <th key={h} style={{ textAlign: 'left', fontSize: '0.76rem', color: 'var(--bark-soft)', fontWeight: 700, padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.discipline}-${r.id}`} style={{ opacity: busyId === r.id ? 0.5 : 1 }}>
                <td style={cell}>
                  {r.cover
                    ? <img src={r.cover} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                    : <div style={{ width: 56, height: 56, borderRadius: 6, background: 'var(--sage-soft)' }} />}
                </td>
                <td style={cell}>{r.title}</td>
                <td style={cell}>{r.discipline === 'makeup' ? 'Makeup' : 'Crochet'}</td>
                <td style={cell}>
                  <button type="button" disabled={busyId === r.id} onClick={() => change(r, { status: r.status === 'published' ? 'draft' : 'published' })} style={pill(r.status === 'published')} title="Click to toggle">
                    {r.status === 'published' ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td style={cell}>
                  <input type="checkbox" checked={r.featured} disabled={busyId === r.id} onChange={(e) => change(r, { featured: e.target.checked })} aria-label="Featured on homepage" />
                </td>
                <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                  <Link to={`/admin/${r.discipline}/${r.id}/edit`} style={{ color: 'var(--olive-deep)', fontWeight: 600, fontSize: '0.85rem', marginRight: 14 }}>Edit</Link>
                  <button type="button" onClick={() => remove(r)} disabled={busyId === r.id} style={{ border: 'none', background: 'none', color: 'var(--rust-bold)', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td style={cell} colSpan={6}>No posts yet — use “New makeup post” or “New crochet post”.</td></tr>
            )}
            {loading && <tr><td style={cell} colSpan={6}>Loading…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cell: React.CSSProperties = { padding: '12px 18px', borderBottom: '1px solid var(--line)', fontSize: '0.92rem', verticalAlign: 'middle' };
const pill = (on: boolean): React.CSSProperties => ({
  fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
  background: on ? 'rgba(75,107,52,0.14)' : 'rgba(138,122,100,0.18)', color: on ? '#4B6B34' : 'var(--bark)',
});
