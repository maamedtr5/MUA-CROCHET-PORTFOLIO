import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Wraps every /admin/* page. Not linked from public nav (see project notes) —
// this is what actually enforces the gate: no session, no dashboard, full stop.
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="wrap" style={{ padding: '80px 0' }}>Loading…</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
