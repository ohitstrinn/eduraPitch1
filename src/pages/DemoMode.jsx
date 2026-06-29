import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, Eye, BookOpen, Brain, MessageCircle, Upload, Star, ArrowRight } from "lucide-react";
import { SCHOOLS, SCHOOL_LIST } from "../data/schools";
import { useSchool } from "../context/SchoolContext";
import { useNavigate } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";

function SchoolPreviewCard({ school, active, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(school.id)}
      className={`relative text-left p-5 rounded-2xl border-2 transition-all w-full ${
        active ? "border-white/40" : "border-white/10 hover:border-white/25"
      }`}
      style={{ backgroundColor: active ? `${school.colors.primary}40` : "rgba(255,255,255,0.05)" }}
    >
      {active && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-white rounded-full" />
        </div>
      )}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold mb-3"
        style={{ backgroundColor: school.colors.primary }}>
        {school.shortName.slice(0, 2)}
      </div>
      <p className="font-bold text-white text-sm">{school.shortName}</p>
      <p className="text-white/50 text-xs mt-0.5">{school.type}</p>
      <div className="mt-3 flex gap-1">
        {[school.colors.primary, school.colors.secondary].map((c, i) => (
          <div key={i} className="w-5 h-2 rounded-full" style={{ backgroundColor: c }} />
        ))}
      </div>
    </motion.button>
  );
}

function DemoScreen({ school, screenId }) {
  const screens = {
    landing: <LandingPreview school={school} />,
    dashboard: <DashboardPreview school={school} />,
    syllabus: <SyllabusPreview school={school} />,
    chat: <ChatPreview school={school} />,
  };
  return screens[screenId] || screens.landing;
}

function LandingPreview({ school }) {
  const c = school.colors;
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-8 rounded-xl"
      style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.primary}99)` }}>
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold mb-4">{school.shortName.slice(0, 2)}</div>
      <h2 className="text-xl font-black text-white leading-tight mb-3">{school.tagline}</h2>
      <p className="text-white/60 text-xs leading-relaxed mb-5 max-w-xs">{school.pitch.slice(0, 100)}...</p>
      <div className="flex gap-2">
        <div className="px-4 py-2 rounded-xl text-white text-xs font-semibold" style={{ backgroundColor: c.secondary }}>
          Get Started →
        </div>
        <div className="px-4 py-2 rounded-xl text-white/70 text-xs border border-white/20">Join Waitlist</div>
      </div>
    </div>
  );
}

function DashboardPreview({ school }) {
  const c = school.colors;
  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden" style={{ backgroundColor: c.bg }}>
      <div className="px-4 pt-4 pb-5 text-white" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.primary}BB)` }}>
        <p className="text-white/60 text-xs">Good morning,</p>
        <p className="font-black text-base">{school.demoUser.name}</p>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full">{school.shortName}</span>
        </div>
      </div>
      <div className="p-3 space-y-2 flex-1">
        <div className="bg-white rounded-xl p-3 border border-gray-100">
          <p className="text-xs font-bold text-gray-900 mb-0.5">Upcoming: BIOL 401 Midterm</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: c.primary }} />
            </div>
            <span className="text-xs text-gray-400">9d</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["14.5h", "7d 🔥", "82%"].map((v, i) => (
            <div key={i} className="bg-white rounded-xl p-2 text-center border border-gray-100">
              <p className="font-black text-xs text-gray-900">{v}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["📄 Syllabus", "🧠 Study Plan", "💬 AI Chat", "📚 Library"].map(label => (
            <div key={label} className="bg-white rounded-xl p-2.5 text-xs font-semibold text-gray-700 border border-gray-100">{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SyllabusPreview({ school }) {
  const c = school.colors;
  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden" style={{ backgroundColor: c.bg }}>
      <div className="px-4 py-3 text-white text-sm font-bold" style={{ backgroundColor: c.primary }}>Syllabus Upload</div>
      <div className="p-3 space-y-2 flex-1">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-white">
          <Upload size={20} className="mx-auto mb-2" style={{ color: c.primary }} />
          <p className="text-xs font-semibold text-gray-700">Drop your syllabus here</p>
          <p className="text-xs text-gray-400 mt-0.5">PDF, DOCX, TXT</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-green-200 border-l-4" style={{ borderLeftColor: c.primary }}>
          <p className="text-xs font-bold text-gray-900">BIOL 401: Cell Biology</p>
          <p className="text-xs text-gray-500">Dr. Mitchell · 4 credits · Fall 2025</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {["Cell Biology", "DNA", "Protein Synthesis"].map(t => (
              <span key={t} className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${c.primary}15`, color: c.primary }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPreview({ school }) {
  const c = school.colors;
  return (
    <div className="h-full flex flex-col rounded-xl overflow-hidden border border-gray-200">
      <div className="px-3 py-2 text-white flex items-center gap-2" style={{ backgroundColor: c.primary }}>
        <div className="w-6 h-6 bg-white/20 rounded-full" />
        <div>
          <p className="text-xs font-bold">Stemara AI · {school.shortName}</p>
          <p className="text-xs opacity-60">Always on</p>
        </div>
      </div>
      <div className="flex-1 p-3 bg-gray-50 space-y-2 overflow-hidden">
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex-shrink-0" />
          <div className="bg-white rounded-xl rounded-tl-sm p-2 text-xs text-gray-700 max-w-[80%] shadow-sm">
            Hi! I'm your {school.shortName} study assistant. What are you working on?
          </div>
        </div>
        <div className="flex gap-1.5 flex-row-reverse">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="text-white rounded-xl rounded-tr-sm p-2 text-xs max-w-[80%]" style={{ backgroundColor: c.primary }}>
            Can you help me understand DNA replication?
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex-shrink-0" />
          <div className="bg-white rounded-xl rounded-tl-sm p-2 text-xs text-gray-700 max-w-[80%] shadow-sm">
            Of course! DNA replication involves...
          </div>
        </div>
      </div>
      <div className="p-2 bg-white border-t flex gap-2">
        <div className="flex-1 h-7 bg-gray-100 rounded-lg text-xs flex items-center px-2 text-gray-400">Ask anything...</div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.primary }}>
          <ArrowRight size={12} className="text-white" />
        </div>
      </div>
    </div>
  );
}

const SCREENS = [
  { id: "landing", label: "Landing", icon: <Eye size={14} /> },
  { id: "dashboard", label: "Dashboard", icon: <Star size={14} /> },
  { id: "syllabus", label: "Syllabus", icon: <Upload size={14} /> },
  { id: "chat", label: "AI Chat", icon: <MessageCircle size={14} /> },
];

export default function DemoMode() {
  const [activeSchool, setActiveSchool] = useState("unh");
  const [activeScreen, setActiveScreen] = useState("landing");
  const { selectSchool } = useSchool();
  const navigate = useNavigate();

  const school = SCHOOLS[activeSchool];

  const handleLaunchLive = () => {
    selectSchool(activeSchool);
    const routeMap = { landing: "/", dashboard: "/dashboard", syllabus: "/syllabus", chat: "/chat" };
    navigate(routeMap[activeScreen] || "/");
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] pb-10">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider font-medium">Stemara · Internal Demo</p>
            <h1 className="text-xl font-black text-white mt-0.5">Demo Mode</h1>
          </div>
          <button onClick={() => navigate("/founder/dashboard")} className="text-white/40 hover:text-white/70 text-sm transition-colors">
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: controls */}
          <div className="space-y-5">
            {/* School selector */}
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">School Mode</p>
              <div className="grid grid-cols-2 gap-2">
                {SCHOOL_LIST.map(s => (
                  <SchoolPreviewCard key={s.id} school={s} active={activeSchool === s.id} onSelect={setActiveSchool} />
                ))}
              </div>
            </div>

            {/* Screen selector */}
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Screen</p>
              <div className="space-y-1.5">
                {SCREENS.map(s => (
                  <button key={s.id} onClick={() => setActiveScreen(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeScreen === s.id ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}>
                    {s.icon} {s.label}
                    {activeScreen === s.id && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch button */}
            <button
              onClick={handleLaunchLive}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all"
              style={{ background: `linear-gradient(135deg, ${school.colors.primary}, ${school.colors.primary}AA)` }}
            >
              <Play size={15} /> Launch Live {school.shortName} Demo
            </button>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/50 text-xs font-medium">
                Previewing: <span className="text-white">{SCREENS.find(s => s.id === activeScreen)?.label}</span> for <span className="text-white">{school.shortName}</span>
              </p>
              <div className="flex gap-1">
                {["#FF5F57", "#FEBC2E", "#28C840"].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-1 border border-white/10 shadow-2xl">
              <div className="bg-white/5 rounded-xl h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeSchool}-${activeScreen}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full p-3"
                  >
                    <DemoScreen school={school} screenId={activeScreen} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* School info strip */}
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-white/80 text-sm font-semibold mb-1">{school.name}</p>
              <p className="text-white/50 text-xs leading-relaxed">{school.pitch.slice(0, 150)}...</p>
              <div className="flex gap-2 mt-3">
                {school.valueProps.slice(0, 2).map(vp => (
                  <span key={vp} className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-lg leading-tight">{vp.slice(0, 40)}...</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
