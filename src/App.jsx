import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Subscription from "./pages/Subscription";
import BookTrading from "./pages/BookTrading";
import AIStudyTools from "./pages/AIStudyTools";
import Library from "./pages/Library";
import InstitutionHub from "./pages/InstitutionHub";
import StudentHub from "./pages/StudentHub";
import DeliverySimulator from "./pages/DeliverySimulator";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import Gamification from "./pages/Gamification";

import BottomNav from "./components/BottomNav";
import EducatorNav from "./components/EducatorNav";

export default function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userType");
    setIsLoggedIn(!!storedUser);
    setUserType(storedUser);
  }, [location]);

  const isStudent = userType === "student";
  const isEducator = userType === "educator";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subscription" element={<Subscription />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={isStudent ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/book-trading" element={isStudent ? <BookTrading /> : <Navigate to="/" />} />
        <Route path="/study-tools" element={isStudent ? <AIStudyTools /> : <Navigate to="/" />} />
        <Route path="/library" element={isStudent ? <Library /> : <Navigate to="/" />} />
        <Route path="/student" element={isStudent ? <StudentHub /> : <Navigate to="/" />} />
        <Route path="/delivery" element={isStudent ? <DeliverySimulator /> : <Navigate to="/" />} />
        <Route path="/gamification" element={isStudent ? <Gamification /> : <Navigate to="/" />} />

        {/* Educator Routes */}
        <Route path="/institution" element={isEducator ? <InstitutionHub /> : <Navigate to="/" />} />
        <Route path="/educator" element={isEducator ? <FacultyDashboard /> : <Navigate to="/" />} />
      </Routes>

      {/* Bottom Navs */}
      {isLoggedIn && location.pathname !== "/" && location.pathname !== "/login" && (
        userType === "student" ? <BottomNav /> : <EducatorNav />
      )}
    </div>
  );
}
