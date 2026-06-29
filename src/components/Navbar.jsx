import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';

export default function Navbar() {
  const { user, userType, logout } = useAuth();
  const { school } = useSchool();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const primaryColor = school?.colors?.primary || '#1b3a6b';

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/syllabus', label: 'Syllabus' },
    { to: '/study', label: 'Study Plan' },
    { to: '/chat', label: 'AI Chat' },
    { to: '/directory', label: 'My School' },
  ];

  const founderLinks = [
    { to: '/founder/dashboard', label: 'Dashboard' },
  ];

  const links = userType === 'student' ? studentLinks : userType === 'founder' ? founderLinks : [];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to={user ? (userType === 'founder' ? '/founder/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight" style={{ color: primaryColor }}>
            Stemara
          </span>
          {school && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {school.shortName}
            </span>
          )}
        </Link>

        {links.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={location.pathname === link.to ? { backgroundColor: primaryColor } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:block">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-1.5 rounded-lg text-white font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
