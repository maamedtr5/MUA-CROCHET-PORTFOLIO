import { useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setError(error);
  }

  return (
    <div className="login-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ fontFamily: 'var(--script)', fontSize: '2.2rem', marginBottom: 6 }}>
            Adorn
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--bark-soft)', marginBottom: 36 }}>
            Studio dashboard
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--bark)', marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--bark)', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--rust-bold)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn btn-fill" style={{ width: '100%' }}>
            {submitting ? 'Logging in…' : 'Log in'}
          </button>

          <p style={{ marginTop: 28, fontSize: '0.78rem', color: 'var(--bark-soft)', textAlign: 'center' }}>
            This page isn't linked anywhere on the public site — access it directly by URL.
          </p>
        </form>
      </div>
      <div
        className="login-visual"
        style={{
          background:
            'repeating-linear-gradient(100deg, #6B6B2E 0px, #6B6B2E 7px, #57571F 7px, #57571F 14px)',
        }}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--sans)',
  fontSize: '0.95rem',
  border: '1px solid var(--line)',
  borderRadius: 6,
  padding: '12px 14px',
  background: 'var(--panel)',
  color: 'var(--ink)',
  outline: 'none',
};
