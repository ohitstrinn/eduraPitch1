import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../lib/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isFounder, setIsFounder] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.init();
    const storedUser = storage.getUser();
    const founderSession = storage.isFounderLoggedIn();
    setUser(storedUser);
    setIsFounder(founderSession);
    setLoading(false);
  }, []);

  const loginStudent = (userData) => {
    storage.setUser(userData);
    storage.addSignup(userData);
    setUser(userData);
  };

  const loginFounder = () => {
    storage.setFounderSession();
    setIsFounder(true);
  };

  const logout = () => {
    storage.clearUser();
    storage.clearFounderSession();
    setUser(null);
    setIsFounder(false);
  };

  return (
    <AuthContext.Provider value={{ user, isFounder, loading, loginStudent, loginFounder, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
