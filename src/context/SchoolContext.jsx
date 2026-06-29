import { createContext, useContext, useState, useEffect } from "react";
import { SCHOOLS } from "../data/schools";

const SchoolContext = createContext(null);

export function SchoolProvider({ children }) {
  const [schoolId, setSchoolId] = useState(() => {
    return localStorage.getItem("stemara_school") || null;
  });

  const school = schoolId ? SCHOOLS[schoolId] : null;

  const selectSchool = (id) => {
    setSchoolId(id);
    localStorage.setItem("stemara_school", id);
  };

  const clearSchool = () => {
    setSchoolId(null);
    localStorage.removeItem("stemara_school");
  };

  // Apply school theme CSS variables to document root
  useEffect(() => {
    if (school) {
      document.documentElement.style.setProperty("--school-primary", school.colors.primary);
      document.documentElement.style.setProperty("--school-secondary", school.colors.secondary);
      document.documentElement.style.setProperty("--school-bg", school.colors.bg);
    } else {
      document.documentElement.style.setProperty("--school-primary", "#1a1a2e");
      document.documentElement.style.setProperty("--school-secondary", "#6366f1");
      document.documentElement.style.setProperty("--school-bg", "#f8fafc");
    }
  }, [school]);

  return (
    <SchoolContext.Provider value={{ schoolId, school, selectSchool, clearSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error("useSchool must be used within SchoolProvider");
  return ctx;
}
