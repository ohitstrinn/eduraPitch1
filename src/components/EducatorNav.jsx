import { Link } from "react-router-dom";

export default function EducatorNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-2 flex justify-between text-sm shadow-md">
      <Link to="/educator">🏫 Dashboard</Link>
      <Link to="/institution">📚 Institution Hub</Link>
      <span className="text-gray-400">🎓 LMS</span>
      <span className="text-gray-400">🤖 AI Tutors</span>
      <span className="text-gray-400">☎️ Support</span>
    </nav>
  );
}
