import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import StemaraLogo from "./StemaraLogo";
import { useAuth } from "../context/AuthContext";
import { useSchool } from "../context/SchoolContext";

export default function Navbar() {
  const { user, isFounder, logout } = useAuth();
  const { school } = useSchool();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryColor = school?.colors?.primary || "#4F46E5";
  const isLanding = location.pathname === "/" || location.pathname === "/landing";

  const studentLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/syllabus", label: "Syllabus" },
    { to: "/recommendations", label: "Study Plan" },
    { to: "/chat", label: "AI Chat" },
  ];

  const founderLinks = [
    { to: "/founder/dashboard", label: "Dashboard" },
    { to: "/demo", label: "Demo Mode" },
    { to: "/pitch", label: "Pitch Deck" },
    { to: "/directory", label: "School Data" },
  ];

  const navLinks = isFounder ? founderLinks : (user ? studentLinks : []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-md"
      style={{ backgroundColor: `${primaryColor}F2` }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <StemaraLogo className="h-8" color="#ffffff" />
          </Link>

          {/* School badge */}
          {school && (
            <div className="hidden sm:flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <span className="text-white text-xs font-medium">{school.shortName}</span>
            </div>
          )}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-white/80 text-sm">
                  <User size={14} />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  Sign in
                </Link>
                <Link to="/signup" className="bg-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors"
                  style={{ color: primaryColor }}>
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-white/80 hover:text-white text-sm">Sign in</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-white text-sm font-semibold">Get Started →</Link>
              </>
            )}
            {user && (
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-white/70 hover:text-white text-sm">Sign out</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
