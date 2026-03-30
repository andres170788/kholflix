import { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kholflix_token');
    const savedUser = localStorage.getItem('kholflix_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verify token is still valid
      api.get('/auth/me').then(res => {
        setUser(res.data);
        localStorage.setItem('kholflix_user', JSON.stringify(res.data));
      }).catch(() => {
        localStorage.removeItem('kholflix_token');
        localStorage.removeItem('kholflix_user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('kholflix_token', res.data.token);
    localStorage.setItem('kholflix_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (username, email, password, display_name) => {
    const res = await api.post('/auth/register', { username, email, password, display_name });
    localStorage.setItem('kholflix_token', res.data.token);
    localStorage.setItem('kholflix_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('kholflix_token');
    localStorage.removeItem('kholflix_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
