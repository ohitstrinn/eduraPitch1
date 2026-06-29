import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SyllabusUpload from "./pages/SyllabusUpload";
import StudyPlan from "./pages/StudyPlan";
import Chat from "./pages/Chat";
import FounderLogin from "./pages/FounderLogin";
import FounderDashboard from "./pages/FounderDashboard";
import PitchDeck from "./pages/PitchDeck";
import DemoMode from "./pages/DemoMode";
import SchoolDirectory from "./pages/SchoolDirectory";

function RequireAuth({ children, role }) {
  const { userType } = useApp();
  if (!userType) return <Navigate to="/login" replace />;
  if (role && userType !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/founder" element={<FounderLogin />} />

      {/* Student */}
      <Route path="/dashboard" element={<RequireAuth role="student"><Dashboard /></RequireAuth>} />
      <Route path="/syllabus" element={<RequireAuth role="student"><SyllabusUpload /></RequireAuth>} />
      <Route path="/study" element={<RequireAuth role="student"><StudyPlan /></RequireAuth>} />
      <Route path="/chat" element={<RequireAuth role="student"><Chat /></RequireAuth>} />

      {/* Founder */}
      <Route path="/founder/dashboard" element={<RequireAuth role="founder"><FounderDashboard /></RequireAuth>} />
      <Route path="/pitch" element={<RequireAuth role="founder"><PitchDeck /></RequireAuth>} />
      <Route path="/demo" element={<RequireAuth role="founder"><DemoMode /></RequireAuth>} />
      <Route path="/directory" element={<RequireAuth role="founder"><SchoolDirectory /></RequireAuth>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
