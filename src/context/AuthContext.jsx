import { createContext, useContext, useState, useEffect } from "react";
import { saveSignup } from "../data/mockData";

const AuthContext = createContext(null);

const FOUNDER_PASSWORD = "stemara-founder-2025";

// Demo student accounts per school
const DEMO_ACCOUNTS = {
  "student@unh.edu": { password: "demo123", name: "Alex Thompson", school: "unh", major: "stem", type: "student" },
  "student@snhu.edu": { password: "demo123", name: "Jordan Rivera", school: "snhu", major: "business", type: "student" },
  "student@mccnh.edu": { password: "demo123", name: "Sam Nguyen", school: "mcc", major: "stem", type: "student" },
  "student@nashuacc.edu": { password: "demo123", name: "Maria Santos", school: "ncc", major: "health", type: "student" },
  // legacy account
  "ohitstrin": { password: "Edura01!", name: "Trin", school: "unh", major: "stem", type: "student" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("stemara_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginStudent = (emailOrUsername, password, schoolId) => {
    // Check demo accounts
    const demo = DEMO_ACCOUNTS[emailOrUsername];
    if (demo && demo.password === password) {
      const userData = { ...demo, email: emailOrUsername, type: "student" };
      setUser(userData);
      localStorage.setItem("stemara_user", JSON.stringify(userData));
      return { success: true, user: userData };
    }

    // Check localStorage-registered users
    try {
      const stored = localStorage.getItem("stemara_registered_users");
      const users = stored ? JSON.parse(stored) : [];
      const found = users.find(u => u.email === emailOrUsername && u.password === password);
      if (found) {
        const userData = { ...found, type: "student" };
        setUser(userData);
        localStorage.setItem("stemara_user", JSON.stringify(userData));
        return { success: true, user: userData };
      }
    } catch {}

    return { success: false, error: "Invalid email or password." };
  };

  const signupStudent = ({ name, email, password, school, major }) => {
    // Check if email already exists
    try {
      const stored = localStorage.getItem("stemara_registered_users");
      const users = stored ? JSON.parse(stored) : [];
      if (users.find(u => u.email === email)) {
        return { success: false, error: "An account with this email already exists." };
      }
      const newUser = { name, email, password, school, major, type: "student" };
      users.push(newUser);
      localStorage.setItem("stemara_registered_users", JSON.stringify(users));
      saveSignup({ name, email, school, major });
      setUser(newUser);
      localStorage.setItem("stemara_user", JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch {
      return { success: false, error: "Something went wrong. Please try again." };
    }
  };

  const loginFounder = (password) => {
    if (password === FOUNDER_PASSWORD) {
      const founderUser = { type: "founder", name: "Founder", email: "founder@stemara.app" };
      setUser(founderUser);
      localStorage.setItem("stemara_user", JSON.stringify(founderUser));
      return { success: true };
    }
    return { success: false, error: "Invalid founder password." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("stemara_user");
    // Keep school preference on logout
  };

  const isStudent = user?.type === "student";
  const isFounder = user?.type === "founder";

  return (
    <AuthContext.Provider value={{ user, isStudent, isFounder, loginStudent, signupStudent, loginFounder, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
