import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronRight, Clock, Target, Star, BookOpen, Zap, Check, Calendar, TrendingUp } from "lucide-react";
import { useSchool } from "../context/SchoolContext";
import { useAuth } from "../context/AuthContext";
import { MAJORS } from "../data/schools";
import ChatWidget from "../components/ChatWidget";

const WEEK_PLAN = [
  {
    day: "Mon", label: "Monday", sessions: [
      { subject: "BIOL 401", topic: "Cell Membrane Transport", duration: 60, type: "reading", priority: "high" },
      { subject: "CHEM 202", topic: "Organic Reactions Review", duration: 45, type: "practice", priority: "medium" },
    ]
  },
  {
    day: "Tue", label: "Tuesday", sessions: [
      { subject: "ENG 301", topic: "Close Reading Techniques", duration: 90, type: "writing", priority: "medium" },
    ]
  },
  {
    day: "Wed", label: "Wednesday", sessions: [
      { subject: "BIOL 401", topic: "DNA Replication Deep Dive", duration: 75, type: "video+notes", priority: "high" },
      { subject: "MATH 310", topic: "Problem Set 4", duration: 60, type: "practice", priority: "high" },
    ]
  },
  {
    day: "Thu", label: "Thursday", sessions: [
      { subject: "CHEM 202", topic: "Lab Report Drafting", duration: 120, type: "writing", priority: "urgent" },
    ]
  },
  {
    day: "Fri", label: "Friday", sessions: [
      { subject: "BIOL 401", topic: "Signal Transduction Practice Quiz", duration: 45, type: "quiz", priority: "medium" },
      { subject: "MATH 310", topic: "Review Chapter 8", duration: 45, type: "reading", priority: "low" },
    ]
  },
  {
    day: "Sat", label: "Saturday", sessions: [
      { subject: "Free Study", topic: "Catch-up + Flashcard Review", duration: 60, type: "review", priority: "low" },
    ]
  },
  {
    day: "Sun", label: "Sunday", sessions: []
  },
];

const RESOURCE_RECS = [
  { subject: "BIOL 401", resource: "Khan Academy: Cell Biology", type: "Video", match: 96 },
  { subject: "CHEM 202", resource: "Organic Chemistry as a Second Language (book)", type: "Book", match: 91 },
  { subject: "ENG 301", resource: "Purdue OWL: Literary Analysis", type: "Guide", match: 88 },
  { subject: "MATH 310", resource: "Paul's Online Math Notes", type: "Notes", match: 85 },
];

const PRIORITY_COLORS = {
  urgent: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
  high: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-400" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-400" },
  low: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-400" },
};

const TYPE_ICONS = {
  reading: <BookOpen size={14} />,
  practice: <Target size={14} />,
  writing: <Brain size={14} />,
  quiz: <Star size={14} />,
  "video+notes": <Zap size={14} />,
  review: <TrendingUp size={14} />,
};

export default function StudyRecommendations() {
  const { school } = useSchool();
  const { user } = useAuth();
  const [activeDay, setActiveDay] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(new Set());

  const primaryColor = school?.colors?.primary || "#4F46E5";
  const bgColor = school?.colors?.bg || "#F8FAFC";
  const majorObj = MAJORS.find(m => m.id === user?.major);

  const toggleSession = (key) => {
    setCompletedSessions(s => {
      const next = new Set(s);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalHours = WEEK_PLAN.reduce((sum, day) => sum + day.sessions.reduce((s, sess) => s + sess.duration, 0), 0) / 60;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <div className="text-white px-4 sm:px-6 pt-6 pb-8"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}BB)` }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black mb-1">Your Study Plan</h1>
          <p className="text-white/70 text-sm">
            Personalized for {user?.name || "you"}
            {majorObj ? ` · ${majorObj.icon} ${majorObj.label}` : ""}
            {school ? ` · ${school.shortName}` : ""}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-black">{totalHours.toFixed(1)}h</p>
              <p className="text-white/60 text-xs">This week</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-black">4</p>
              <p className="text-white/60 text-xs">Courses</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-black">{completedSessions.size}</p>
              <p className="text-white/60 text-xs">Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* AI insight banner */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${primaryColor}15` }}>
            <Brain size={18} style={{ color: primaryColor }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">AI Insight</p>
            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
              Your CHEM 202 lab report is due in 4 days — it's marked urgent. I've blocked 2 hours Thursday for drafting. Your Biology readiness score is 73%, so I've added an extra session Wednesday.
            </p>
          </div>
        </div>

        {/* Weekly calendar */}
        <section>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} style={{ color: primaryColor }} /> This Week
          </h2>

          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
            {WEEK_PLAN.map((day, i) => (
              <button
                key={day.day}
                onClick={() => setActiveDay(i)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-center transition-all ${
                  activeDay === i ? "text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
                style={activeDay === i ? { backgroundColor: primaryColor } : {}}
              >
                <p className="text-xs font-semibold">{day.day}</p>
                <p className={`text-xs mt-0.5 ${activeDay === i ? "text-white/70" : "text-gray-400"}`}>
                  {day.sessions.length > 0 ? `${day.sessions.length} session${day.sessions.length > 1 ? "s" : ""}` : "Rest"}
                </p>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {WEEK_PLAN[activeDay].sessions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <p className="text-2xl mb-2">😴</p>
                  <p className="font-semibold text-gray-700">Rest day</p>
                  <p className="text-sm text-gray-400 mt-1">Rest is part of the plan. You've earned it.</p>
                </div>
              ) : (
                WEEK_PLAN[activeDay].sessions.map((session, si) => {
                  const key = `${activeDay}-${si}`;
                  const done = completedSessions.has(key);
                  const p = PRIORITY_COLORS[session.priority];
                  return (
                    <motion.div
                      key={key}
                      layout
                      className={`bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 transition-all ${done ? "opacity-60" : ""}`}
                    >
                      <button
                        onClick={() => toggleSession(key)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          done ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {done && <Check size={12} className="text-white" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-bold text-gray-900 text-sm ${done ? "line-through" : ""}`}>{session.topic}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{session.subject}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${p.bg} ${p.text}`}>
                            {session.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={11} /> {session.duration}m
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            {TYPE_ICONS[session.type]} {session.type}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Resource recommendations */}
        <section>
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star size={18} style={{ color: primaryColor }} /> Recommended Resources
          </h2>
          <div className="space-y-2.5">
            {RESOURCE_RECS.map(r => (
              <div key={r.resource} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{r.resource}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.subject} · {r.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black" style={{ color: primaryColor }}>{r.match}%</p>
                  <p className="text-xs text-gray-400">match</p>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            ))}
          </div>
        </section>

        {/* School-specific tip */}
        {school && (
          <div className="p-4 rounded-2xl text-white text-sm"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}AA)` }}>
            <p className="font-semibold mb-1">{school.shortName} Study Tip</p>
            <p className="text-white/80 leading-relaxed">{school.valueProps[0]}</p>
          </div>
        )}
      </div>

      <ChatWidget />
    </div>
  );
}
