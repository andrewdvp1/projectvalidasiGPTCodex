import { createContext, useContext, useMemo, useState } from 'react';
import client, { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await client.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await client.post('/auth/logout');
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
