import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Contexts
import { useAuth } from "./contexts/AuthContext";
import { useSchool } from "./contexts/SchoolContext";

// New Stemara pages
import Landing from "./pages/Landing";
import StudentLogin from "./pages/StudentLogin";
import StudentSignup from "./pages/StudentSignup";
import StudentDashboard from "./pages/StudentDashboard";
import SyllabusUpload from "./pages/SyllabusUpload";
import StudyRecommendations from "./pages/StudyRecommendations";
import ChatPage from "./pages/ChatPage";
import FounderLogin from "./pages/FounderLogin";
import FounderDashboard from "./pages/FounderDashboard";
import SchoolProfile from "./pages/SchoolProfile";
import PitchDeck from "./pages/PitchDeck";
import DemoMode from "./pages/DemoMode";

// Existing Edura pages (preserved)
import BookTrading from "./pages/BookTrading";
import AIStudyTools from "./pages/AIStudyTools";
import Library from "./pages/Library";
import StudentHub from "./pages/StudentHub";
import DeliverySimulator from "./pages/DeliverySimulator";
import Gamification from "./pages/Gamification";
import Subscription from "./pages/Subscription";
import FacultyDashboard from "./pages/FacultyDashboard";
import InstitutionHub from "./pages/InstitutionHub";

// Navigation
import StemBottomNav from "./components/StemBottomNav";

// Public routes — no auth needed
const PUBLIC_PATHS = ['/', '/login', '/signup', '/founder', '/demo', '/pitch'];

export default function App() {
  const location = useLocation();
  const { user, isFounder } = useAuth();
  const { activeSchool } = useSchool();

  const isStudent = !!user;
  const isPublic = PUBLIC_PATHS.some(p => location.pathname === p || location.pathname.startsWith('/school/') || location.pathname.startsWith('/pitch/'));
  const isChat = location.pathname === '/chat';

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isChat ? '' : 'pb-16'}`}>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/signup" element={<StudentSignup />} />
        <Route path="/school/:id" element={<SchoolProfile />} />
        <Route path="/pitch" element={<PitchDeck />} />
        <Route path="/pitch/:school" element={<PitchDeck />} />
        <Route path="/demo" element={<DemoMode />} />
        <Route path="/subscription" element={<Subscription />} />

        {/* ── Founder ── */}
        <Route path="/founder" element={<FounderLogin />} />
        <Route path="/founder/dashboard" element={isFounder ? <FounderDashboard /> : <Navigate to="/founder" />} />

        {/* ── Student (protected) ── */}
        <Route path="/dashboard" element={isStudent ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/syllabus" element={isStudent ? <SyllabusUpload /> : <Navigate to="/login" />} />
        <Route path="/recommendations" element={isStudent ? <StudyRecommendations /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isStudent ? <ChatPage /> : <Navigate to="/login" />} />

        {/* ── Preserved Edura pages ── */}
        <Route path="/book-trading" element={isStudent ? <BookTrading /> : <Navigate to="/login" />} />
        <Route path="/study-tools" element={isStudent ? <AIStudyTools /> : <Navigate to="/login" />} />
        <Route path="/library" element={isStudent ? <Library /> : <Navigate to="/login" />} />
        <Route path="/student" element={isStudent ? <StudentHub /> : <Navigate to="/login" />} />
        <Route path="/delivery" element={isStudent ? <DeliverySimulator /> : <Navigate to="/login" />} />
        <Route path="/gamification" element={isStudent ? <Gamification /> : <Navigate to="/login" />} />
        <Route path="/institution" element={<InstitutionHub />} />
        <Route path="/educator" element={<FacultyDashboard />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Student bottom nav — shown on protected student routes, not on chat (full-screen) */}
      {isStudent && !isPublic && !isChat && location.pathname !== '/founder/dashboard' && (
        <StemBottomNav school={activeSchool} />
      )}
    </div>
  );
}
