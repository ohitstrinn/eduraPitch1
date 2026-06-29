import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import SchoolBadge from "../components/SchoolBadge";

const QUICK_STATS = [
  { label: "Courses", value: "4", icon: "📚" },
  { label: "Tasks Due", value: "3", icon: "⏰" },
  { label: "Study Hours", value: "12", icon: "📈" },
  { label: "Streak", value: "5d", icon: "🔥" },
];

const UPCOMING = [
  { course: "BIO 201", task: "Lab Report Due", due: "Tomorrow", urgent: true },
  { course: "CS 101", task: "Chapter 4 Quiz", due: "In 3 days", urgent: false },
  { course: "ENG 110", task: "Essay Draft", due: "Next week", urgent: false },
];

export default function Dashboard() {
  const { school, student } = useApp();
  const navigate = useNavigate();

  const primary = school?.colors?.primary || "#0F172A";
  const secondary = school?.colors?.secondary || "#F59E0B";
  const bg = school?.colors?.bg || "#F8FAFC";

  const firstName = student?.name?.split(" ")[0] || "Student";

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <TopNav />

      <div className="px-5 py-6 max-w-md mx-auto space-y-6">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Good morning,</p>
            <h1 className="text-2xl font-black" style={{ color: primary }}>
              {firstName} 👋
            </h1>
            <div className="mt-1.5">
              {school ? <SchoolBadge size="sm" /> : (
                <button onClick={() => navigate("/")} className="text-xs text-gray-400 underline">
                  Select your school
                </button>
              )}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm"
            style={{ backgroundColor: primary }}>
            {firstName[0]}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          {QUICK_STATS.map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className="text-lg font-black" style={{ color: primary }}>{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* School Message */}
        {school && (
          <div className="rounded-2xl p-4 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${primary}, ${primary}CC)` }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 border-2 border-white translate-x-8 -translate-y-8" />
            <p className="text-xs text-white/70 mb-1 font-semibold uppercase tracking-wide">{school.shortName} Edition</p>
            <p className="font-bold text-sm leading-relaxed">{school.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {school.valueProps.slice(0, 2).map(v => (
                <span key={v} className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: secondary, color: primary }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: "/syllabus", icon: "📄", label: "Upload Syllabus", desc: "Parse any syllabus instantly" },
              { to: "/study", icon: "🎯", label: "Study Plan", desc: "Your personalized schedule" },
              { to: "/chat", icon: "🤖", label: "AI Assistant", desc: "Get help anytime" },
              { to: "/study", icon: "📊", label: "Progress", desc: "Track your courses" },
            ].map(card => (
              <Link
                key={card.to + card.label}
                to={card.to}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block"
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="font-bold text-sm text-gray-900">{card.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{card.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Coming Up</h2>
          <div className="space-y-2">
            {UPCOMING.map((item, i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: item.urgent ? "#EF4444" : primary }}>
                    {item.course.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.task}</div>
                    <div className="text-xs text-gray-400">{item.course}</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.urgent ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                  {item.due}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Teaser */}
        <div className="rounded-2xl p-5 text-center"
          style={{ backgroundColor: secondary + "20", borderColor: secondary }}>
          <div className="text-2xl mb-2">🤖</div>
          <p className="font-bold text-sm text-gray-900 mb-1">Need help studying?</p>
          <p className="text-xs text-gray-500 mb-3">
            Your AI assistant is ready — school-specific, always available.
          </p>
          <Link
            to="/chat"
            className="inline-block text-sm font-bold px-5 py-2 rounded-lg text-white"
            style={{ backgroundColor: primary }}
          >
            Open AI Chat →
          </Link>
        </div>
      </div>
    </div>
  );
}
