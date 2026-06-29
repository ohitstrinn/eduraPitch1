import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Brain, MessageCircle, Upload, TrendingUp,
  Clock, Target, Star, ChevronRight, Zap, Calendar, Award
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSchool } from "../context/SchoolContext";
import { MAJORS } from "../data/schools";
import ChatWidget from "../components/ChatWidget";

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <TrendingUp size={14} className="text-green-400" />
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </motion.div>
  );
}

function QuickAction({ to, icon, label, desc, color }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 cursor-pointer transition-all"
      >
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 text-white"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
          {icon}
        </div>
        <p className="font-bold text-gray-900 text-sm mb-1">{label}</p>
        <p className="text-xs text-gray-500 leading-tight">{desc}</p>
        <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color }}>
          Open <ChevronRight size={12} />
        </div>
      </motion.div>
    </Link>
  );
}

const RECENT_ACTIVITY = [
  { icon: "📄", text: "Uploaded BIOL 401 syllabus", time: "2h ago", type: "upload" },
  { icon: "🧠", text: "Completed study session: Organic Chem", time: "Yesterday", type: "study" },
  { icon: "✅", text: "Finished Week 2 study plan", time: "2 days ago", type: "complete" },
  { icon: "💬", text: "AI chat: Explained mitosis", time: "3 days ago", type: "chat" },
];

const UPCOMING = [
  { course: "BIOL 401 Midterm", date: "July 8", daysLeft: 9, urgency: "medium" },
  { course: "CHEM 202 Lab Report", date: "July 3", daysLeft: 4, urgency: "high" },
  { course: "ENG 301 Essay Draft", date: "July 15", daysLeft: 16, urgency: "low" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { school } = useSchool();

  const primaryColor = school?.colors?.primary || "#4F46E5";
  const accentColor = school?.colors?.secondary || "#8B5CF6";
  const bgColor = school?.colors?.bg || "#F8FAFC";

  const majorObj = MAJORS.find(m => m.id === user?.major);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const actions = [
    { to: "/syllabus", icon: <Upload size={20} />, label: "Upload Syllabus", desc: "Parse and analyze any course syllabus instantly", color: primaryColor },
    { to: "/recommendations", icon: <Brain size={20} />, label: "Study Plan", desc: "Get your personalized weekly study recommendations", color: "#8B5CF6" },
    { to: "/chat", icon: <MessageCircle size={20} />, label: "AI Tutor", desc: "Ask anything, get instant explanations and practice", color: "#059669" },
    { to: "/directory", icon: <BookOpen size={20} />, label: "Course Library", desc: "Browse school-specific programs and resources", color: accentColor },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      {/* Hero header */}
      <div className="text-white pb-8 pt-6 px-4 sm:px-6"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)` }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium mb-1">{greeting},</p>
              <h1 className="text-2xl font-black">{user?.name || "Student"}</h1>
              <div className="flex items-center gap-2 mt-2">
                {school && (
                  <span className="text-xs font-medium bg-white/15 rounded-full px-2.5 py-1">{school.shortName}</span>
                )}
                {majorObj && (
                  <span className="text-xs font-medium bg-white/15 rounded-full px-2.5 py-1">{majorObj.icon} {majorObj.label}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <Award size={22} />
              </div>
              <p className="text-xs text-white/50 mt-1">Level 3</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Study Hours", value: "14.5", icon: <Clock size={14} /> },
              { label: "Streak", value: "7 days", icon: <Zap size={14} /> },
              { label: "Courses Active", value: "4", icon: <BookOpen size={14} /> },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-lg font-black">{stat.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* Upcoming deadlines */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={18} style={{ color: primaryColor }} /> Upcoming Deadlines
            </h2>
            <Link to="/recommendations" className="text-xs font-medium hover:underline" style={{ color: primaryColor }}>View all</Link>
          </div>
          <div className="space-y-2.5">
            {UPCOMING.map(item => (
              <div key={item.course} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className={`w-2 h-10 rounded-full flex-shrink-0 ${
                  item.urgency === "high" ? "bg-red-400" :
                  item.urgency === "medium" ? "bg-yellow-400" : "bg-green-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{item.course}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    item.urgency === "high" ? "bg-red-100 text-red-600" :
                    item.urgency === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-600"
                  }`}>
                    {item.daysLeft}d left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {actions.map(a => <QuickAction key={a.to} {...a} />)}
          </div>
        </section>

        {/* School context CTA */}
        {school && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}AA)` }}
          >
            <div className="absolute right-0 top-0 w-32 h-32 opacity-10"
              style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)` }} />
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">{school.shortName} Spotlight</p>
            <p className="font-bold text-lg leading-tight mb-3">{school.tagline}</p>
            <p className="text-white/70 text-sm leading-relaxed mb-4">{school.pitch.slice(0, 120)}...</p>
            <Link to="/directory" className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl transition-colors">
              Explore {school.shortName} programs <ChevronRight size={14} />
            </Link>
          </motion.section>
        )}

        {/* Recent activity */}
        <section>
          <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Progress rings */}
        <section>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target size={18} style={{ color: primaryColor }} /> Weekly Goals
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Study sessions" value="6/10" icon={<BookOpen size={16} />} color={primaryColor} />
            <StatCard label="Quiz score avg" value="82%" icon={<Star size={16} />} color="#8B5CF6" />
            <StatCard label="Flashcards reviewed" value="143" icon={<Brain size={16} />} color="#059669" />
            <StatCard label="Reading time" value="3.2h" icon={<Clock size={16} />} color={accentColor} />
          </div>
        </section>
      </div>

      <ChatWidget />
    </div>
  );
}
