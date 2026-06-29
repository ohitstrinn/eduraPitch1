import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('stemara_user');
    const storedType = localStorage.getItem('stemara_user_type');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setUserType(storedType);
    }
    setLoading(false);
  }, []);

  const login = (userData, type) => {
    localStorage.setItem('stemara_user', JSON.stringify(userData));
    localStorage.setItem('stemara_user_type', type);
    setUser(userData);
    setUserType(type);
  };

  const logout = () => {
    localStorage.removeItem('stemara_user');
    localStorage.removeItem('stemara_user_type');
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ user, userType, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
