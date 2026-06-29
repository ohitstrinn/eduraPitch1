import { createContext, useContext, useState, useEffect } from 'react';
import { SCHOOLS } from '../data/schools';
import { storage } from '../lib/storage';

const SchoolContext = createContext(null);

export function SchoolProvider({ children }) {
  const [activeSchool, setActiveSchool] = useState(null);

  useEffect(() => {
    const storedId = storage.getSchool();
    if (storedId && SCHOOLS[storedId]) {
      setActiveSchool(SCHOOLS[storedId]);
    }
  }, []);

  const selectSchool = (id) => {
    const school = SCHOOLS[id];
    if (school) {
      storage.setSchool(id);
      setActiveSchool(school);
    }
  };

  const clearSchool = () => {
    storage.clearSchool();
    setActiveSchool(null);
  };

  return (
    <SchoolContext.Provider value={{ activeSchool, selectSchool, clearSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

export const useSchool = () => useContext(SchoolContext);
