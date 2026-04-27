import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth.api';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const storedUser = sessionStorage.getItem('user');
    
    if (token && storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            // Normalize: ensure role, first_name, last_name are always at top-level
            if (!parsed.role && parsed.user_metadata?.role) {
              parsed.role = parsed.user_metadata.role;
            }
            if (!parsed.first_name && parsed.user_metadata?.first_name) {
              parsed.first_name = parsed.user_metadata.first_name;
            }
            if (!parsed.last_name && parsed.user_metadata?.last_name) {
              parsed.last_name = parsed.user_metadata.last_name;
            }
            setUser(parsed);
        } catch (err) {
            console.error("Corrupted session data:", err);
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('auth_token');
        }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    sessionStorage.setItem('auth_token', res.data.session.access_token);
    sessionStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res;
  };

  const register = async (data) => {
    return await apiRegister(data);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut(); // terminate Supabase session
    } catch (err) {
      console.warn('Supabase signOut error (non-critical):', err);
    }
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    setUser(null);
    // Use replace so the back button doesn't return to the protected page
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
