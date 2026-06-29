import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOL_LIST, SCHOOLS } from '../data/schools';
import { useSchool } from '../context/SchoolContext';

const DECK_SLIDES = {
  unh: [
    {
      type: 'cover',
      title: 'Stemara for UNH',
      subtitle: 'The research-first university companion',
      body: 'Built specifically for University of New Hampshire students navigating complex research programs, multi-professor syllabi, and academic milestones.',
    },
    {
      type: 'problem',
      title: 'The Problem at UNH',
      points: [
        'UNH students juggle 4–6 courses with dense syllabi from different professors',
        'Research-heavy programs require structured, long-term planning tools',
        'Existing tools are generic — not built for UNH\'s course catalog',
        'Students report spending more time organizing than actually studying',
      ],
    },
    {
      type: 'solution',
      title: 'Stemara Solves This',
      points: [
        'Parses any UNH professor\'s syllabus instantly with AI',
        'Builds a personalized week-by-week study plan',
        'Adapts to UNH research cycles and academic calendar',
        'AI tutor knows your specific courses and major',
      ],
    },
    {
      type: 'value',
      title: 'Why UNH Students Choose Stemara',
      body: 'Not a generic study app. A UNH-first academic companion that understands what it means to be a Wildcat — from freshman orientation to senior thesis.',
    },
    {
      type: 'cta',
      title: 'Partner with Stemara',
      body: 'We\'re seeking early partnerships with UNH departments and student organizations to pilot Stemara in Spring 2026.',
    },
  ],
  snhu: [
    {
      type: 'cover',
      title: 'Stemara for SNHU',
      subtitle: 'The async learner\'s academic companion',
      body: 'Built for SNHU\'s online-first model — helping 170,000+ learners stay on track without losing the flexibility that makes SNHU unique.',
    },
    {
      type: 'problem',
      title: 'The Problem for SNHU Students',
      points: [
        'Online students lack real-time support when they get stuck',
        'Async structure creates isolation and higher dropout risk',
        'Competency-based programs are hard to track without custom tools',
        'Students learn on their phone at 2am — existing tools don\'t work that way',
      ],
    },
    {
      type: 'solution',
      title: 'Stemara for Async Learners',
      points: [
        'AI tutor available 24/7 — no office hours required',
        'Self-paced milestone tracking for competency-based programs',
        'Mobile-first design built for learning anywhere, anytime',
        'Personalized to SNHU\'s online course catalog',
      ],
    },
    {
      type: 'value',
      title: 'Scale With SNHU\'s Model',
      body: 'SNHU serves 170,000+ students with a flexible, online-first model. Stemara is the only study companion built to match that scale and flexibility.',
    },
    {
      type: 'cta',
      title: 'The Opportunity',
      body: 'At SNHU\'s scale, even a 10% adoption rate means 17,000 students with personalized academic support. This is a partnership worth building.',
    },
  ],
  mcc: [
    {
      type: 'cover',
      title: 'Stemara for MCC',
      subtitle: 'Equity-first academic support for every student',
      body: 'Stemara believes every student deserves access to personalized academic support — regardless of background, income, or experience.',
    },
    {
      type: 'problem',
      title: 'The Problem at MCC',
      points: [
        'First-generation students lack access to expensive private tutoring',
        'Working adults have no time for traditional office hours',
        'Affordability barriers prevent students from getting the help they need',
        'Generic tools don\'t understand community college life',
      ],
    },
    {
      type: 'solution',
      title: 'Stemara\'s Equity Model',
      points: [
        'Free-tier access for all community college students',
        'Works around work schedules and family obligations',
        'First-gen support baked into the onboarding experience',
        'Local NH job market guidance built-in',
      ],
    },
    {
      type: 'value',
      title: 'Why MCC + Stemara',
      body: 'MCC\'s mission is accessibility and transformation. Stemara\'s mission is the same. Together, we can give every Manchester student the academic support they deserve.',
    },
    {
      type: 'cta',
      title: 'Start a Pilot',
      body: 'We\'re offering MCC a free pilot program to prove the value of personalized academic support for community college students.',
    },
  ],
  ncc: [
    {
      type: 'cover',
      title: 'Stemara for NCC',
      subtitle: 'The local-first career launcher for NH students',
      body: 'Nashua students want practical outcomes. Stemara connects their coursework directly to Nashua\'s growing tech, healthcare, and business job market.',
    },
    {
      type: 'problem',
      title: 'The Gap at NCC',
      points: [
        'Students don\'t see the connection between classes and local jobs',
        'Career guidance is under-resourced at community colleges',
        'Practical programs need outcome-focused, not theory-focused tools',
        'Small campus means fewer peer study resources',
      ],
    },
    {
      type: 'solution',
      title: 'Stemara\'s Local-First Approach',
      points: [
        'Local employer partnerships surfaced in-app during coursework',
        'Career milestone tracking tied to Nashua job market demand',
        'Community study group matching for small-campus culture',
        'Practical program support — not just liberal arts',
      ],
    },
    {
      type: 'value',
      title: 'Nashua\'s Tech Corridor is Hiring',
      body: 'Nashua is home to BAE Systems, Oracle, and a growing startup scene. Stemara helps NCC students become the top candidates for those jobs — starting in their first semester.',
    },
    {
      type: 'cta',
      title: 'Build Together',
      body: 'We want NCC to be our flagship community-college partner in southern NH — co-building a model that other community colleges can replicate.',
    },
  ],
};

export default function PitchDeck() {
  const { school } = useSchool();
  const [activeSchool, setActiveSchool] = useState(school?.id || 'unh');
  const [slide, setSlide] = useState(0);
  const [mode, setMode] = useState('select'); // 'select' | 'present'

  const currentSchool = SCHOOLS[activeSchool];
  const slides = DECK_SLIDES[activeSchool] || [];

  const primaryColor = currentSchool?.colors?.primary || '#1b3a6b';

  const handleStart = (id) => {
    setActiveSchool(id);
    setSlide(0);
    setMode('present');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white font-black text-xl">Stemara</Link>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400 text-sm">Pitch Deck Mode</span>
        </div>
        <div className="flex items-center gap-3">
          {mode === 'present' && (
            <button
              onClick={() => setMode('select')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← All decks
            </button>
          )}
          <Link to="/demo" className="text-sm text-gray-400 hover:text-white transition-colors">
            Demo mode
          </Link>
        </div>
      </div>

      {mode === 'select' && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-white mb-3">School-Specific Pitch Decks</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Stemara is not one-size-fits-all. Each school gets a different pitch because each school has different students, needs, and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {SCHOOL_LIST.map((s) => (
              <motion.div
                key={s.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className="rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => handleStart(s.id)}
              >
                <div
                  className="h-40 flex items-center justify-center text-5xl"
                  style={{ background: `linear-gradient(135deg, ${s.colors.primary}, ${s.colors.dark || s.colors.primary})` }}
                >
                  {s.emoji}
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-b-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-black text-white text-xl">{s.shortName}</div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: s.colors.primary }}
                    >
                      {s.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{s.name}</div>
                  <div className="text-sm font-semibold italic mb-4" style={{ color: s.colors.primary }}>
                    "{s.pitchAngle}"
                  </div>
                  <div className="space-y-1 mb-4">
                    {s.pitchPoints.slice(0, 2).map((p) => (
                      <div key={p} className="text-xs text-gray-500 flex items-start gap-1">
                        <span style={{ color: s.colors.primary }}>•</span>
                        {p}
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                    style={{ backgroundColor: s.colors.primary }}
                  >
                    Present {s.shortName} deck →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Why different decks */}
          <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-black text-white mb-3">Why different decks for each school?</h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
              UNH is a research university. SNHU is an online-first institution with 170K students. MCC and NCC are community colleges with equity-focused missions. These are not the same customer. A pitch that works for UNH won't resonate with MCC. Stemara's core value is personalization — and that starts with how we talk to each institution.
            </p>
          </div>
        </div>
      )}

      {mode === 'present' && slides.length > 0 && (
        <div className="flex flex-col h-[calc(100vh-65px)]">
          {/* School indicator */}
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3 text-white">
              <span>{currentSchool.emoji}</span>
              <span className="font-semibold">{currentSchool.shortName} · {currentSchool.name}</span>
            </div>
            <div className="text-white/70 text-sm">
              {slide + 1} / {slides.length}
            </div>
          </div>

          {/* Slide */}
          <div className="flex-1 flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl"
              >
                <SlideContent slide={slides[slide]} school={currentSchool} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSlide((s) => Math.max(0, s - 1))}
              disabled={slide === 0}
              className="px-6 py-2.5 rounded-xl border border-gray-700 text-white text-sm font-semibold disabled:opacity-30 hover:bg-gray-800 transition-colors"
            >
              ← Previous
            </button>

            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{ backgroundColor: i === slide ? primaryColor : '#4b5563' }}
                />
              ))}
            </div>

            {slide < slides.length - 1 ? (
              <button
                onClick={() => setSlide((s) => s + 1)}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setMode('select')}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-bold bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                All decks
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SlideContent({ slide, school }) {
  const primaryColor = school?.colors?.primary || '#1b3a6b';
  const lightBg = school?.colors?.light || '#d6e3f7';

  if (slide.type === 'cover') {
    return (
      <div className="text-center">
        <div className="text-8xl mb-6">{school.emoji}</div>
        <h1 className="text-5xl font-black text-white mb-4">{slide.title}</h1>
        <div
          className="text-xl font-semibold mb-6 px-6 py-2 rounded-full inline-block"
          style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
        >
          {slide.subtitle}
        </div>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">{slide.body}</p>
      </div>
    );
  }

  if (slide.type === 'problem' || slide.type === 'solution') {
    return (
      <div>
        <h2 className="text-4xl font-black text-white mb-8">{slide.title}</h2>
        <div className="space-y-4">
          {slide.points.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-5"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {i + 1}
              </div>
              <p className="text-white text-lg">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'value') {
    return (
      <div className="text-center">
        <h2 className="text-4xl font-black text-white mb-8">{slide.title}</h2>
        <div
          className="rounded-3xl p-10 text-2xl font-semibold leading-relaxed"
          style={{ background: `linear-gradient(135deg, ${school.colors.primary}, ${school.colors.dark || school.colors.primary})`, color: '#fff' }}
        >
          "{slide.body}"
        </div>
      </div>
    );
  }

  if (slide.type === 'cta') {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">🤝</div>
        <h2 className="text-4xl font-black text-white mb-6">{slide.title}</h2>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8">{slide.body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <button
              className="px-8 py-4 rounded-2xl text-white text-lg font-bold transition-all hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              Start a pilot
            </button>
          </Link>
          <Link to="/">
            <button className="px-8 py-4 rounded-2xl text-white text-lg font-bold border border-gray-700 hover:bg-gray-800 transition-colors">
              Learn more
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
