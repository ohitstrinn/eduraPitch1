import { useState } from "react";
import { useApp } from "../context/AppContext";
import { SCHOOL_LIST, SCHOOLS } from "../data/schools";
import TopNav from "../components/TopNav";
import StemaraLogo from "../components/StemaraLogo";

const SLIDES = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "school", label: "School Fit" },
  { id: "traction", label: "Traction" },
  { id: "ask", label: "The Ask" },
];

export default function PitchDeck() {
  const { school, setSchool } = useApp();
  const [activeSchool, setActiveSchool] = useState(school?.id || "unh");
  const [slide, setSlide] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const s = SCHOOLS[activeSchool] || SCHOOL_LIST[0];
  const primary = s.colors.primary;
  const secondary = s.colors.secondary;

  function switchSchool(id) {
    setActiveSchool(id);
    setSlide(0);
    setSchool(id);
  }

  const slides = [
    // Intro
    <SlideShell key="intro" bg={primary}>
      <div className="text-center">
        <div className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-4">Introducing</div>
        <div className="text-6xl font-black text-white mb-2">Stemara</div>
        <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: secondary }} />
        <div className="text-xl text-white/90 font-semibold mb-2">{s.pitchAngle}</div>
        <div className="text-sm text-white/70 max-w-xs mx-auto leading-relaxed">{s.tagline}</div>
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
          style={{ backgroundColor: secondary, color: primary }}>
          {s.shortName} Edition
        </div>
      </div>
    </SlideShell>,

    // Problem
    <SlideShell key="problem" bg="#0F172A">
      <div>
        <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">The Problem</p>
        <h2 className="text-3xl font-black text-white mb-6 leading-tight">
          Students at {s.shortName} are underserved by generic study tools.
        </h2>
        <div className="space-y-3">
          {[
            "Syllabi are complex, inconsistent, and unstructured",
            "Study tools aren't built for specific schools or majors",
            "Students spend hours planning instead of learning",
            "No personalization = low engagement = poor outcomes",
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">✕</span>
              <span className="text-gray-300 text-sm leading-relaxed">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>,

    // Solution
    <SlideShell key="solution" bg="#0F172A">
      <div>
        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">The Solution</p>
        <h2 className="text-3xl font-black text-white mb-2 leading-tight">Stemara</h2>
        <p className="text-gray-400 text-sm mb-6">AI-powered, school-specific study support.</p>
        <div className="space-y-3">
          {[
            { icon: "📄", title: "Syllabus Parsing", desc: "Any syllabus → instant study roadmap" },
            { icon: "🤖", title: "AI Study Assistant", desc: "School-tuned chat for academic help" },
            { icon: "🎯", title: "Personalized Plans", desc: "Built around your major, schedule, goals" },
            { icon: "📊", title: "Progress Tracking", desc: "Stay on track across all courses" },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-bold text-sm text-white">{item.title}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>,

    // School Fit
    <SlideShell key="school" bg={primary}>
      <div>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Why {s.shortName}?</p>
        <h2 className="text-3xl font-black text-white mb-2 leading-tight">{s.pitchAngle}</h2>
        <p className="text-white/80 text-sm mb-6 leading-relaxed">{s.pitch}</p>
        <div className="space-y-2">
          {s.pitchPoints.map((pt, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-black mt-0.5" style={{ color: secondary }}>→</span>
              <span className="text-white/90 text-sm leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 p-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: secondary + "30", color: secondary }}>
          💡 {s.demoNote}
        </div>
      </div>
    </SlideShell>,

    // Traction
    <SlideShell key="traction" bg="#0F172A">
      <div>
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Traction</p>
        <h2 className="text-3xl font-black text-white mb-6">Early signals are strong.</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { value: "4", label: "NH Schools Targeted", sub: "UNH, SNHU, MCC, NCC" },
            { value: "6+", label: "Early Interest Signups", sub: "Pre-launch testing" },
            { value: "100%", label: "School Personalization", sub: "Unique per institution" },
            { value: "0", label: "Generic Tools", sub: "Purpose-built only" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-black mb-1" style={{ color: secondary }}>{stat.value}</div>
              <div className="text-xs font-bold text-white">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs leading-relaxed">
          Stemara is pre-launch with active testing interest from students at all four target schools.
          Founder has direct NH education relationships.
        </p>
      </div>
    </SlideShell>,

    // The Ask
    <SlideShell key="ask" bg={primary}>
      <div className="text-center">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Partnership Opportunity</p>
        <h2 className="text-4xl font-black text-white mb-3 leading-tight">
          Let's bring Stemara<br />to {s.shortName}.
        </h2>
        <p className="text-white/80 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          We're looking for one founding school partner to co-develop the {s.shortName} experience and help us shape the product roadmap.
        </p>
        <div className="space-y-3 max-w-xs mx-auto text-left mb-8">
          {[
            "Pilot access for 50–200 students",
            "School-branded AI study assistant",
            "Founder pricing & co-development role",
            "Direct feedback into product roadmap",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: secondary, color: primary }}>{i + 1}</span>
              <span className="text-white/90 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <div className="inline-block px-6 py-3 rounded-xl font-bold text-sm"
          style={{ backgroundColor: secondary, color: primary }}>
          Schedule a Meeting →
        </div>
      </div>
    </SlideShell>,
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {!fullscreen && <TopNav />}

      <div className={`${fullscreen ? "fixed inset-0 z-50 bg-gray-950" : "px-4 py-6 max-w-lg mx-auto"}`}>
        {/* School switcher */}
        {!fullscreen && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-black text-white">Pitch Deck</h1>
              <button onClick={() => setFullscreen(true)}
                className="text-xs text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-800">
                Fullscreen
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SCHOOL_LIST.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => switchSchool(sc.id)}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${activeSchool === sc.id ? "text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                  style={activeSchool === sc.id ? { backgroundColor: sc.colors.primary } : {}}
                >
                  {sc.shortName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Slide */}
        <div className={`${fullscreen ? "h-full flex flex-col" : ""}`}>
          {fullscreen && (
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <div className="flex gap-2 overflow-x-auto">
                {SCHOOL_LIST.map(sc => (
                  <button key={sc.id} onClick={() => switchSchool(sc.id)}
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={activeSchool === sc.id ? { backgroundColor: sc.colors.primary, color: "white" } : { backgroundColor: "#1F2937", color: "#9CA3AF" }}>
                    {sc.shortName}
                  </button>
                ))}
              </div>
              <button onClick={() => setFullscreen(false)} className="text-gray-400 text-sm px-3 py-1 border border-gray-700 rounded-lg">
                Exit
              </button>
            </div>
          )}

          <div className={`${fullscreen ? "flex-1" : "rounded-2xl overflow-hidden aspect-[4/3]"} relative`}>
            {slides[slide]}
          </div>

          {/* Navigation */}
          <div className={`flex items-center justify-between ${fullscreen ? "px-6 py-4 bg-gray-950" : "mt-4"}`}>
            <div className="flex gap-1.5">
              {SLIDES.map((sl, i) => (
                <button
                  key={sl.id}
                  onClick={() => setSlide(i)}
                  className={`transition-all rounded-full ${i === slide ? "w-6 h-2" : "w-2 h-2"}`}
                  style={{ backgroundColor: i === slide ? secondary : "#374151" }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSlide(s => Math.max(0, s - 1))}
                disabled={slide === 0}
                className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-30 hover:bg-gray-800"
              >
                ← Prev
              </button>
              <button
                onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))}
                disabled={slide === slides.length - 1}
                className="text-sm px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-30"
                style={{ backgroundColor: primary }}
              >
                Next →
              </button>
            </div>
          </div>

          <div className={`text-center text-xs text-gray-500 ${fullscreen ? "pb-4" : "mt-2"}`}>
            {SLIDES[slide].label} — {slide + 1} of {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideShell({ children, bg }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 overflow-y-auto"
      style={{ backgroundColor: bg, minHeight: "320px" }}>
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
