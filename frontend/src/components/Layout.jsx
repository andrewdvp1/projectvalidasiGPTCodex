import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 p-4 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-semibold">Sistem Validasi Dokumen</h1>
          <div className="flex items-center gap-3 text-sm">
            <span>{user?.name} ({user?.role})</span>
            <Link className="rounded bg-slate-700 px-3 py-1" to="/dashboard">Dashboard</Link>
            <Link className="rounded bg-slate-700 px-3 py-1" to="/upload">Upload</Link>
            <button className="rounded bg-rose-600 px-3 py-1" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
