import { createContext, useContext, useState, useEffect } from 'react';
import { SCHOOLS } from '../data/schools';

const SchoolContext = createContext(null);

export function SchoolProvider({ children }) {
  const [schoolId, setSchoolId] = useState(null);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('stemara_school');
    if (stored && SCHOOLS[stored]) {
      setSchoolId(stored);
      setSchool(SCHOOLS[stored]);
    }
  }, []);

  const selectSchool = (id) => {
    if (SCHOOLS[id]) {
      localStorage.setItem('stemara_school', id);
      setSchoolId(id);
      setSchool(SCHOOLS[id]);
    }
  };

  const clearSchool = () => {
    localStorage.removeItem('stemara_school');
    setSchoolId(null);
    setSchool(null);
  };

  return (
    <SchoolContext.Provider value={{ schoolId, school, selectSchool, clearSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used within SchoolProvider');
  return ctx;
}
