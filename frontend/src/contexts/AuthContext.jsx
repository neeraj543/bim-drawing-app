import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      fetch(`${apiBase}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      })
        .then(res => {
          if (res.ok) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else if (res.status === 401 || res.status === 403) {
            // Token is expired or invalid — force re-login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else {
            // Other server error — keep session, let page-level requests handle it
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        })
        .catch(() => {
          // Network error — backend may not be running yet, keep session
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({
      username: authData.username,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role
    }));
    setToken(authData.token);
    setUser({
      username: authData.username,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
