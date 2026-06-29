import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2, ArrowRight } from "lucide-react";
import { SCHOOLS, SCHOOL_LIST } from "../data/schools";
import { useNavigate } from "react-router-dom";
import StemaraLogo from "../components/StemaraLogo";

function Slide({ slide, school }) {
  const c = school.colors;
  const Component = SLIDE_COMPONENTS[slide.type];
  return (
    <div className="w-full h-full flex flex-col"
      style={{ background: `linear-gradient(135deg, ${c.primary} 0%, ${c.primary}99 100%)` }}>
      <Component slide={slide} school={school} />
    </div>
  );
}

function TitleSlide({ slide, school }) {
  const c = school.colors;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
        <StemaraLogo className="h-12 mb-8" color="#ffffff" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="inline-block bg-white/15 rounded-full px-4 py-1.5 text-white/80 text-sm font-medium mb-5">
          {school.shortName} · {school.type}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{slide.headline}</h1>
        <p className="text-white/70 text-lg max-w-lg">{slide.subhead}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-10 w-16 h-1 rounded-full" style={{ backgroundColor: c.secondary }} />
    </div>
  );
}

function ProblemSlide({ slide, school }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-3">The Problem</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">{slide.headline}</h2>
      </motion.div>
      <div className="space-y-3">
        {slide.points.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * (i + 1) }}
            className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
            <span className="text-2xl flex-shrink-0">{p.icon}</span>
            <div>
              <p className="font-bold text-white text-sm">{p.title}</p>
              <p className="text-white/60 text-sm mt-0.5">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SolutionSlide({ slide, school }) {
  const c = school.colors;
  return (
    <div className="flex flex-col justify-center h-full px-8 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-3">The Solution</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{slide.headline}</h2>
        <p className="text-white/70 mb-6">{slide.subhead}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {slide.features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * (i + 1) }}
            className="bg-white/10 rounded-xl p-4">
            <p className="text-xl mb-2">{f.icon}</p>
            <p className="font-bold text-white text-sm">{f.title}</p>
            <p className="text-white/60 text-xs mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TractionSlide({ slide, school }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-3">Traction</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">{slide.headline}</h2>
      </motion.div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {slide.stats.map((s, i) => (
          <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 * (i + 1) }}
            className="bg-white/10 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-white">{s.value}</p>
            <p className="text-white/60 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
      {slide.quote && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-white/10 rounded-xl p-4 italic">
          <p className="text-white/80 text-sm">"{slide.quote.text}"</p>
          <p className="text-white/50 text-xs mt-1.5">— {slide.quote.author}</p>
        </motion.div>
      )}
    </div>
  );
}

function CTASlide({ slide, school }) {
  const c = school.colors;
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-6"
        style={{ backgroundColor: c.secondary }}>
        🚀
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-3xl font-black text-white mb-4">{slide.headline}</motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="text-white/70 text-lg max-w-md mb-8">{slide.subhead}</motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="space-y-2 text-white/60 text-sm">
        {slide.asks.map((a, i) => (
          <div key={i} className="flex items-center gap-2 justify-center">
            <ArrowRight size={14} style={{ color: c.secondary }} />
            <span>{a}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const SLIDE_COMPONENTS = { title: TitleSlide, problem: ProblemSlide, solution: SolutionSlide, traction: TractionSlide, cta: CTASlide };

function buildDeck(school) {
  return [
    {
      type: "title",
      headline: `${school.tagline}`,
      subhead: `A personalized AI study platform built specifically for ${school.shortName} students.`,
    },
    {
      type: "problem",
      headline: `${school.shortName} students are underserved by generic tools.`,
      points: [
        { icon: "😤", title: "Generic apps don't know your school", desc: `They don't know ${school.shortName}'s ${school.programs[0]} or your specific course requirements.` },
        { icon: "⏰", title: `${school.shortName} students are busy`, desc: `${school.enrollment} students can't afford to waste time on tools that don't get their context.` },
        { icon: "💸", title: "Expensive or inaccessible", desc: "Most AI study tools are $20+/month with no student-focused features." },
      ],
    },
    {
      type: "solution",
      headline: "Stemara is built for your school.",
      subhead: `Every feature personalized for ${school.shortName}'s programs, schedule, and students.`,
      features: [
        { icon: "🎯", title: "School-Specific AI", desc: `Trained on ${school.shortName} course structures and program requirements.` },
        { icon: "📄", title: "Syllabus Parsing", desc: "Upload any syllabus, get instant study plans and key dates." },
        { icon: "🧠", title: "Adaptive Tutoring", desc: "AI that adjusts to your pace, major, and learning style." },
        { icon: "📊", title: "Progress Tracking", desc: "Visual dashboards showing readiness and study streaks." },
      ],
    },
    {
      type: "traction",
      headline: "Early signals are strong.",
      stats: [
        { value: "12+", label: `${school.shortName} beta signups` },
        { value: "73%", label: "Want to try it" },
        { value: "4.8/5", label: "Demo satisfaction" },
      ],
      quote: { text: "This is exactly what I've been missing — something that actually knows my school.", author: `Early beta student, ${school.shortName}` },
    },
    {
      type: "cta",
      headline: `Partner with Stemara at ${school.shortName}.`,
      subhead: `We're looking to launch a pilot with ${school.shortName} this semester.`,
      asks: [
        `Connect us with ${school.shortName} student success team`,
        "Pilot with 50 students per program",
        "Co-develop school-specific features",
        "Explore institutional licensing",
      ],
    },
  ];
}

export default function PitchDeck() {
  const [schoolId, setSchoolId] = useState("unh");
  const [slideIdx, setSlideIdx] = useState(0);
  const navigate = useNavigate();

  const school = SCHOOLS[schoolId];
  const slides = buildDeck(school);

  const prev = () => setSlideIdx(i => Math.max(0, i - 1));
  const next = () => setSlideIdx(i => Math.min(slides.length - 1, i + 1));

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
        <StemaraLogo className="h-7" color="#ffffff" />
        <div className="flex gap-1">
          {SCHOOL_LIST.map(s => (
            <button
              key={s.id}
              onClick={() => { setSchoolId(s.id); setSlideIdx(0); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                schoolId === s.id ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
              style={schoolId === s.id ? { backgroundColor: s.colors.primary } : {}}
            >
              {s.shortName}
            </button>
          ))}
        </div>
        <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white/70 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${schoolId}-${slideIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Slide slide={slides[slideIdx]} school={school} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-4 py-4 border-t border-white/10">
        <button onClick={prev} disabled={slideIdx === 0}
          className="p-2.5 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{ backgroundColor: i === slideIdx ? school.colors.secondary : "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>
        <button onClick={next} disabled={slideIdx === slides.length - 1}
          className="p-2.5 rounded-xl bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slide label */}
      <div className="text-center pb-3">
        <p className="text-white/30 text-xs">
          Slide {slideIdx + 1} of {slides.length} · {school.name}
        </p>
      </div>
    </div>
  );
}
