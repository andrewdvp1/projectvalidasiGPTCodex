import { useState } from 'react';
import client from '../api/client';
import Layout from '../components/Layout';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    await client.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setMessage('Dokumen berhasil diupload dan menunggu validasi.');
    setTitle('');
    setFile(null);
  };

  return (
    <Layout>
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Upload Dokumen</h2>
        <form className="space-y-4" onSubmit={submit}>
          <input className="w-full rounded border p-2" placeholder="Judul dokumen" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="w-full rounded border p-2" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} required />
          <button className="rounded bg-blue-600 px-4 py-2 text-white">Kirim Dokumen</button>
        </form>
        {message && <p className="mt-4 rounded bg-emerald-100 p-3 text-emerald-700">{message}</p>}
      </div>
    </Layout>
  );
}
