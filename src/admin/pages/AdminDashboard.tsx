import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { listAllMakeupWorksAdmin } from '@/lib/queries/makeupWorks';
import { listAllCrochetWorksAdmin } from '@/lib/queries/crochetWorks';
import { listContactSubmissionsAdmin } from '@/lib/queries/contactSubmissions';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/makeup/new', label: 'New makeup post' },
  { to: '/admin/crochet/new', label: 'New crochet post' },
  { to: '/admin/content', label: 'Site content' },
  { to: '/admin/submissions', label: 'Submissions' },
];

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [counts, setCounts] = useState({ published: 0, drafts: 0, submissions: 0 });

  useEffect(() => {
    Promise.all([listAllMakeupWorksAdmin(), listAllCrochetWorksAdmin(), listContactSubmissionsAdmin()])
      .then(([makeup, crochet, submissions]) => {
        const all = [...makeup, ...crochet];
        setCounts({
          published: all.filter((w) => w.status === 'published').length,
          drafts: all.filter((w) => w.status === 'draft').length,
          submissions: submissions.length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" style={{ background: 'var(--panel)', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--script)', fontSize: '1.7rem', marginBottom: 36 }}>Adorn</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                fontSize: '0.92rem', fontWeight: 600, textDecoration: 'none',
                color: isActive ? 'var(--olive-deep)' : 'var(--bark)',
                background: isActive ? 'var(--sage-soft)' : 'transparent',
                padding: '11px 14px', borderRadius: 6,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => signOut()} className="admin-logout" style={{ background: 'none', border: 'none', color: 'var(--bark-soft)', fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', marginTop: 20 }}>
          Log out
        </button>
      </aside>

      <main className="admin-main">
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '2rem', margin: '0 0 4px' }}>Welcome back</h1>
          <p style={{ color: 'var(--bark-soft)', fontSize: '0.9rem', margin: 0 }}>Here's what's happening across your site.</p>
        </div>

        <div className="admin-stats-grid">
          <StatCard num={counts.published} label="Published works" />
          <StatCard num={counts.drafts} label="Drafts" />
          <StatCard num={counts.submissions} label="Submissions" />
        </div>

        {/* Nested admin pages (New Post, Site Content, Submissions) render here */}
        <Outlet />
      </main>
    </div>
  );
}

function StatCard({ num, label }: { num: number; label: string }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 10, padding: 20 }}>
      <div style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '2.1rem', marginBottom: 4 }}>{num}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--bark-soft)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}
