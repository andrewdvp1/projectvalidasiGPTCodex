import { useEffect, useState } from 'react';
import client from '../api/client';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const statusColor = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);

  const loadDocuments = async () => {
    const { data } = await client.get('/documents');
    setDocuments(data.data ?? []);
  };

  const loadStats = async () => {
    if (user?.role !== 'admin') return;
    const { data } = await client.get('/admin/dashboard');
    setStats(data);
  };

  const validateDoc = async (id, status) => {
    await client.post(`/documents/${id}/validate`, {
      status,
      validator_notes: status === 'rejected' ? 'Dokumen belum sesuai format.' : 'Dokumen valid.',
    });
    loadDocuments();
  };

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, []);

  return (
    <Layout>
      {stats && (
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-white p-4 shadow">
              <p className="text-xs uppercase text-slate-500">{key.replace('_', ' ')}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Daftar Dokumen</h2>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{doc.title}</h3>
                  <p className="text-sm text-slate-500">Pemilik: {doc.user?.name}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[doc.status]}`}>
                  {doc.status}
                </span>
              </div>
              {doc.validator_notes && (
                <p className="mt-2 text-sm text-slate-700">Catatan: {doc.validator_notes}</p>
              )}
              {(user?.role === 'validator' || user?.role === 'admin') && doc.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={() => validateDoc(doc.id, 'approved')}>Approve</button>
                  <button className="rounded bg-rose-600 px-3 py-1 text-white" onClick={() => validateDoc(doc.id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
