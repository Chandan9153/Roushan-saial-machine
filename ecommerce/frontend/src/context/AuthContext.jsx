import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('roushan_token');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then((res) => setUser(res.data.data))
      .catch(() => { localStorage.removeItem('roushan_token'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await authApi.login({ email, password });
    localStorage.setItem('roushan_token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data.data.user;
  }

  async function register(data) {
    const res = await authApi.register(data);
    localStorage.setItem('roushan_token', res.data.data.token);
    setUser(res.data.data.user);
    return res.data.data.user;
  }

  function logout() {
    localStorage.removeItem('roushan_token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
