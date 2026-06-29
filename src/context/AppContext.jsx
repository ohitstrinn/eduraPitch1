import { createContext, useContext, useState, useEffect } from "react";
import { SCHOOLS } from "../data/schools";
import { seedDemoData } from "../data/mockStore";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [school, setSchoolState] = useState(null);
  const [userType, setUserType] = useState(null);
  const [student, setStudent] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    seedDemoData();
    const storedSchool = localStorage.getItem("stemara_school");
    const storedUserType = localStorage.getItem("stemara_userType");
    const storedStudent = localStorage.getItem("stemara_student");
    const storedDemo = localStorage.getItem("stemara_demo");

    if (storedSchool && SCHOOLS[storedSchool]) setSchoolState(SCHOOLS[storedSchool]);
    if (storedUserType) setUserType(storedUserType);
    if (storedStudent) {
      try { setStudent(JSON.parse(storedStudent)); } catch {}
    }
    if (storedDemo === "true") setDemoMode(true);
  }, []);

  function setSchool(schoolId) {
    const s = SCHOOLS[schoolId];
    setSchoolState(s || null);
    if (s) localStorage.setItem("stemara_school", schoolId);
    else localStorage.removeItem("stemara_school");
  }

  function login(type, data = {}) {
    setUserType(type);
    localStorage.setItem("stemara_userType", type);
    if (type === "student" && data) {
      setStudent(data);
      localStorage.setItem("stemara_student", JSON.stringify(data));
    }
  }

  function logout() {
    setUserType(null);
    setStudent(null);
    localStorage.removeItem("stemara_userType");
    localStorage.removeItem("stemara_student");
  }

  function toggleDemo(on) {
    setDemoMode(on);
    localStorage.setItem("stemara_demo", on ? "true" : "false");
  }

  const theme = school?.colors || {
    primary: "#0F172A",
    secondary: "#F59E0B",
    accent: "#FFFFFF",
    bg: "#F8FAFC",
    text: "#0F172A",
    gradient: "from-[#0F172A] to-[#1E3A5F]",
    buttonBg: "bg-[#0F172A]",
    buttonHover: "hover:bg-[#1E293B]",
    badgeBg: "bg-[#F59E0B]",
    ring: "ring-[#0F172A]",
    border: "border-[#0F172A]",
  };

  return (
    <AppContext.Provider value={{
      school, setSchool,
      userType, login, logout,
      student,
      demoMode, toggleDemo,
      theme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
