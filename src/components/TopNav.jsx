import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StemaraLogo from "./StemaraLogo";
import SchoolBadge from "./SchoolBadge";
import { useState } from "react";

export default function TopNav() {
  const { userType, logout, school, demoMode, toggleDemo } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const isStudent = userType === "student";
  const isFounder = userType === "founder";

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm"
      style={{ backgroundColor: school?.colors?.primary || "#0F172A" }}
    >
      <Link to={isStudent ? "/dashboard" : isFounder ? "/founder/dashboard" : "/"}>
        <StemaraLogo size="md" white />
      </Link>

      <div className="flex items-center gap-3">
        {school && <SchoolBadge size="sm" />}
        {demoMode && (
          <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full">
            DEMO
          </span>
        )}

        {isFounder && (
          <button
            onClick={() => toggleDemo(!demoMode)}
            className="text-xs text-white/70 border border-white/30 px-2 py-0.5 rounded hover:bg-white/10"
          >
            {demoMode ? "Exit Demo" : "Demo Mode"}
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-1.5 rounded hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg py-1 z-50">
              {isStudent && (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                  <Link to="/syllabus" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Syllabus Upload</Link>
                  <Link to="/study" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Study Plan</Link>
                  <Link to="/chat" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">AI Chat</Link>
                </>
              )}
              {isFounder && (
                <>
                  <Link to="/founder/dashboard" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                  <Link to="/pitch" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pitch Deck</Link>
                  <Link to="/demo" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">School Demos</Link>
                  <Link to="/directory" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">School Directory</Link>
                </>
              )}
              {(isStudent || isFounder) && (
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t mt-1">
                  Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
