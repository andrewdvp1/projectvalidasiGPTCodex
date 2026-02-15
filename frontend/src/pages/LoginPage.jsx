import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await register(form);
    } else {
      await login(form.email, form.password);
    }
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">{isRegister ? 'Register' : 'Login'} Demo Sistem</h2>
      <form className="space-y-4" onSubmit={submit}>
        {isRegister && (
          <input className="w-full rounded border p-2" placeholder="Nama" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="w-full rounded border p-2" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {isRegister && (
          <input className="w-full rounded border p-2" placeholder="Konfirmasi Password" type="password" onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
        )}
        <button className="w-full rounded bg-blue-600 p-2 font-medium text-white">Masuk</button>
      </form>
      <button className="mt-4 text-sm text-blue-700" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Register'}
      </button>
    </div>
  );
}
