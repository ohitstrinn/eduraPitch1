import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const [userType, setUserType] = useState("student");

  useEffect(() => {
    const stored = localStorage.getItem("userType");
    if (stored) setUserType(stored);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-2 flex justify-between text-sm shadow-md z-50">
      <Link to="/">🏠 Home</Link>
      <Link to="/book-trading">📖 Trade</Link>
      <Link to="/study-tools">🧠 Study</Link>
      <Link to="/library">🏛️ Library</Link>
      {userType === "student" && <Link to="/gamification">🎮 Games</Link>}
      <Link to={userType === "educator" ? "/educator" : "/student"}>
        🎓 {userType === "educator" ? "Institution Hub" : "Student Hub"}
      </Link>
    </nav>
  );
}
