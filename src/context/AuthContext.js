import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try { return stored ? JSON.parse(stored) : null; } catch { return null; }
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const isAuthenticated = !!(token && user);

  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);       // throws on error
    setToken(res.data.token);
    setUser(res.data.user);
    window.dispatchEvent(new Event('auth:updated'));
    return res;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await registerUser(name, email, password); // throws on error
    setToken(res.data.token);
    setUser(res.data.user);
    window.dispatchEvent(new Event('auth:updated'));
    return res;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('auth:updated'));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
