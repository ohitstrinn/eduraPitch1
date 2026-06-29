import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolProvider } from './context/SchoolContext';

import Landing from './pages/Landing';
import StudentLogin from './pages/StudentLogin';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import SyllabusUpload from './pages/SyllabusUpload';
import StudyRecommendations from './pages/StudyRecommendations';
import ChatFeature from './pages/ChatFeature';
import FounderDashboard from './pages/FounderDashboard';
import SchoolDirectory from './pages/SchoolDirectory';
import PitchDeck from './pages/PitchDeck';
import DemoMode from './pages/DemoMode';

function ProtectedRoute({ children, allowedType }) {
  const { user, userType, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedType && userType !== allowedType) {
    return <Navigate to={userType === 'founder' ? '/founder/dashboard' : '/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pitch" element={<PitchDeck />} />
      <Route path="/demo" element={<DemoMode />} />

      {/* Student routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedType="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/syllabus"
        element={
          <ProtectedRoute allowedType="student">
            <SyllabusUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study"
        element={
          <ProtectedRoute allowedType="student">
            <StudyRecommendations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute allowedType="student">
            <ChatFeature />
          </ProtectedRoute>
        }
      />
      <Route
        path="/directory"
        element={
          <ProtectedRoute allowedType="student">
            <SchoolDirectory />
          </ProtectedRoute>
        }
      />

      {/* Founder routes */}
      <Route
        path="/founder/dashboard"
        element={
          <ProtectedRoute allowedType="founder">
            <FounderDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </SchoolProvider>
  );
}
