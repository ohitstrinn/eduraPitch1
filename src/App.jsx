import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useSchool } from "./context/SchoolContext";

import Landing from "./pages/Landing";
import StudentAuth from "./pages/StudentAuth";
import StudentDashboard from "./pages/StudentDashboard";
import SyllabusUpload from "./pages/SyllabusUpload";
import StudyRecommendations from "./pages/StudyRecommendations";
import ChatPage from "./pages/ChatPage";
import FounderLogin from "./pages/FounderLogin";
import FounderDashboard from "./pages/FounderDashboard";
import SchoolDirectory from "./pages/SchoolDirectory";
import PitchDeck from "./pages/PitchDeck";
import DemoMode from "./pages/DemoMode";
import Navbar from "./components/Navbar";

function ProtectedStudent({ children }) {
  const { isStudent } = useAuth();
  return isStudent ? children : <Navigate to="/login" replace />;
}

function ProtectedFounder({ children }) {
  const { isFounder } = useAuth();
  return isFounder ? children : <Navigate to="/founder/login" replace />;
}

const NO_NAV_ROUTES = ["/", "/login", "/signup", "/founder/login", "/pitch"];

export default function App() {
  const location = useLocation();
  const { user } = useAuth();
  const showNav = user && !NO_NAV_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar />}
      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<StudentAuth mode="login" />} />
          <Route path="/signup" element={<StudentAuth mode="signup" />} />

          {/* Founder */}
          <Route path="/founder/login" element={<FounderLogin />} />
          <Route path="/founder/dashboard" element={<ProtectedFounder><FounderDashboard /></ProtectedFounder>} />
          <Route path="/demo" element={<ProtectedFounder><DemoMode /></ProtectedFounder>} />
          <Route path="/pitch" element={<PitchDeck />} />

          {/* Student */}
          <Route path="/dashboard" element={<ProtectedStudent><StudentDashboard /></ProtectedStudent>} />
          <Route path="/syllabus" element={<ProtectedStudent><SyllabusUpload /></ProtectedStudent>} />
          <Route path="/recommendations" element={<ProtectedStudent><StudyRecommendations /></ProtectedStudent>} />
          <Route path="/chat" element={<ProtectedStudent><ChatPage /></ProtectedStudent>} />
          <Route path="/directory" element={<ProtectedStudent><SchoolDirectory /></ProtectedStudent>} />

          {/* Legacy redirects */}
          <Route path="/study-tools" element={<Navigate to="/recommendations" replace />} />
          <Route path="/institution" element={<Navigate to="/founder/login" replace />} />
          <Route path="/educator" element={<Navigate to="/founder/login" replace />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
