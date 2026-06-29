import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOLS, SCHOOL_LIST } from '../data/schools';

const PITCH_SLIDES = {
  overview: [
    {
      id: 'title',
      type: 'title',
      headline: 'Stemara',
      sub: 'The adaptive study platform built for your school.',
      body: 'Not one-size-fits-all. Built for New Hampshire students — at UNH, SNHU, MCC, and NCC.',
      icon: '📚',
    },
    {
      id: 'problem',
      type: 'problem',
      headline: 'The Problem',
      sub: 'Generic study tools fail students.',
      bullets: [
        'Students waste hours decoding syllabi instead of studying',
        'No tool knows what "your school" actually means for your study experience',
        'First-gen and working students fall behind without structure',
        'Every school has different needs — one app can\'t serve them all',
      ],
    },
    {
      id: 'solution',
      type: 'solution',
      headline: 'The Solution',
      sub: 'Stemara builds your study plan from your syllabus, at your school.',
      bullets: [
        '📄 Paste or upload any syllabus — get a structured plan in seconds',
        '🎓 School-specific personalization for UNH, SNHU, MCC, and NCC',
        '🧠 Adaptive recommendations that respond to your major and pace',
        '💬 An AI study chat that knows your courses, not just the internet',
      ],
    },
    {
      id: 'market',
      type: 'market',
      headline: 'The Market',
      sub: 'NH is the wedge. The US is the opportunity.',
      stats: [
        { value: '200K+', label: 'SNHU students alone', sub: 'Mostly online, mostly working adults' },
        { value: '~22K', label: 'UNH + MCC + NCC', sub: 'In-person NH student base' },
        { value: '$20B+', label: 'EdTech TAM', sub: 'US higher education software market' },
        { value: 'Day 1', label: 'NH-first', sub: 'Founder is from NH, knows these schools' },
      ],
    },
    {
      id: 'why',
      type: 'why',
      headline: 'Why Personalization Wins',
      sub: 'MCC and SNHU are not the same school. Their students are not the same. Their tools shouldn\'t be either.',
      comparisons: [
        { a: 'Generic EdTech', b: 'Stemara' },
        { a: 'Same onboarding for all schools', b: 'School-specific messaging + branding' },
        { a: 'No knowledge of your syllabus', b: 'Parses your exact syllabus instantly' },
        { a: 'Built for 18-year-olds at big schools', b: 'Built for working adults, first-gen, transfer students' },
        { a: 'Founder has no relationship', b: 'NH-based founder with direct school access' },
      ],
    },
    {
      id: 'traction',
      type: 'traction',
      headline: 'Early Traction',
      sub: 'Pre-launch. Already building signal.',
      metrics: [
        { value: '15+', label: 'Early Interest Submissions', icon: '📝' },
        { value: '4', label: 'School Modes Built', icon: '🏫' },
        { value: '6', label: 'Student Signups', icon: '👤' },
        { value: '100%', label: 'NH-focused', icon: '📍' },
      ],
    },
    {
      id: 'ask',
      type: 'ask',
      headline: 'The Ask',
      sub: 'We\'re looking for school partners, early adopters, and feedback.',
      points: [
        'Partner with Stemara to bring adaptive study tools to your students',
        'Pilot with one department or class section this semester',
        'Connect us with your student success or academic affairs office',
        'Help us build the most personalized study platform in New Hampshire',
      ],
    },
  ],
};

function getSchoolSlides(school) {
  if (!school) return PITCH_SLIDES.overview;
  return [
    {
      id: 'title',
      type: 'school-title',
      headline: `Stemara × ${school.name}`,
      sub: school.tagline,
      body: school.pitch,
      icon: school.emoji,
      school,
    },
    {
      id: 'students',
      type: 'school-students',
      headline: `Who We're Building For at ${school.shortName}`,
      sub: school.demoStory,
      stats: [
        { value: school.stats[Object.keys(school.stats)[0]], label: Object.keys(school.stats)[0].replace(/([A-Z])/g, ' $1').trim() },
        { value: school.stats[Object.keys(school.stats)[1]], label: Object.keys(school.stats)[1].replace(/([A-Z])/g, ' $1').trim() },
        { value: school.enrollment, label: 'Enrolled Students' },
      ],
      school,
    },
    {
      id: 'value',
      type: 'school-value',
      headline: `What Stemara Delivers for ${school.shortName}`,
      bullets: school.valueProps,
      keyMessages: school.keyMessages,
      school,
    },
    {
      id: 'fit',
      type: 'school-fit',
      headline: `Why ${school.shortName} Is Different`,
      sub: `${school.type} · ${school.modality} · ${school.location}`,
      body: `Stemara is not generic EdTech. The ${school.shortName} version is built around the specific academic model, student profile, and cultural context of ${school.name}.`,
      school,
    },
    {
      id: 'cta',
      type: 'school-cta',
      headline: `Partner with Stemara at ${school.shortName}`,
      sub: 'We\'re ready to pilot this semester.',
      points: [
        `Connect us with ${school.shortName} student success or advising`,
        'Pilot with one course section or department',
        'Get branded Stemara experience for your students',
        'Free for early partner schools in Year 1',
      ],
      school,
    },
  ];
}

function Slide({ slide, school }) {
  const s = slide.school || school;
  const accentStyle = s
    ? { background: `linear-gradient(135deg, ${s.colors.gradientFrom}, ${s.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  if (slide.type === 'title' || slide.type === 'school-title') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-12" style={accentStyle}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="text-7xl mb-6">{slide.icon}</div>
          <h1 className="text-5xl font-black mb-4 leading-tight">{slide.headline}</h1>
          <p className="text-2xl text-white/80 mb-4">{slide.sub}</p>
          <p className="text-lg text-white/60 max-w-xl">{slide.body}</p>
        </motion.div>
      </div>
    );
  }

  if (slide.type === 'problem') {
    return (
      <div className="flex flex-col justify-center h-full px-16 bg-gray-950 text-white">
        <div className="text-6xl mb-4">😩</div>
        <h2 className="text-4xl font-black mb-2">{slide.headline}</h2>
        <p className="text-xl text-gray-400 mb-8">{slide.sub}</p>
        <div className="space-y-4">
          {slide.bullets.map((b, i) => (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3">
              <span className="text-red-500 font-bold mt-1">✕</span>
              <p className="text-xl text-gray-300">{b}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'solution' || slide.type === 'school-value') {
    return (
      <div className="flex flex-col justify-center h-full px-16 bg-white">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">{slide.headline}</h2>
        <p className="text-xl text-gray-500 mb-8">{slide.sub}</p>
        <div className="space-y-4">
          {(slide.bullets || slide.valueProps || []).map((b, i) => (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3">
              <span className="font-bold text-xl" style={{ color: s?.colors.primary || '#003C8A' }}>→</span>
              <p className="text-xl text-gray-800">{b}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'market' || slide.type === 'traction') {
    return (
      <div className="flex flex-col justify-center h-full px-16 bg-gray-50">
        <h2 className="text-4xl font-black text-gray-900 mb-2">{slide.headline}</h2>
        <p className="text-xl text-gray-500 mb-10">{slide.sub}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(slide.stats || slide.metrics || []).map((stat, i) => (
            <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl text-center shadow-sm bg-white border border-gray-100">
              {stat.icon && <div className="text-3xl mb-2">{stat.icon}</div>}
              <div className="text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="font-semibold text-gray-700 text-sm mb-0.5">{stat.label}</div>
              {stat.sub && <div className="text-xs text-gray-400">{stat.sub}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'why') {
    return (
      <div className="flex flex-col justify-center h-full px-16 bg-white">
        <h2 className="text-4xl font-black text-gray-900 mb-2">{slide.headline}</h2>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl">{slide.sub}</p>
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="grid grid-cols-2 bg-gray-100 text-center">
            {slide.comparisons[0] && <>
              <div className="py-3 font-bold text-red-600">{slide.comparisons[0].a}</div>
              <div className="py-3 font-bold text-green-700">{slide.comparisons[0].b}</div>
            </>}
          </div>
          {slide.comparisons.slice(1).map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
              className={`grid grid-cols-2 text-center ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="py-3 px-4 text-sm text-gray-500 border-r border-gray-100">✕ {c.a}</div>
              <div className="py-3 px-4 text-sm text-gray-800 font-medium">✓ {c.b}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'ask' || slide.type === 'school-cta') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-12" style={accentStyle}>
        <div className="text-6xl mb-4">🤝</div>
        <h2 className="text-4xl font-black mb-3">{slide.headline}</h2>
        <p className="text-xl text-white/80 mb-8 max-w-xl">{slide.sub}</p>
        <div className="space-y-3 text-left max-w-lg">
          {slide.points.map((p, i) => (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3">
              <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-white/90 text-lg">{p}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // school-students, school-fit
  return (
    <div className="flex flex-col justify-center h-full px-16"
      style={{ background: s?.colors.bg || '#f0f4ff' }}>
      <div className="text-5xl mb-4">{s?.emoji}</div>
      <h2 className="text-4xl font-black mb-2" style={{ color: s?.colors.primary || '#1e3a8a' }}>{slide.headline}</h2>
      <p className="text-lg mb-6" style={{ color: s?.colors.text || '#1e3a8a' }}>{slide.sub || slide.body}</p>
      {slide.stats && (
        <div className="flex gap-4 flex-wrap">
          {slide.stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl px-5 py-3 shadow-sm">
              <div className="text-2xl font-black" style={{ color: s?.colors.primary }}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PitchDeck() {
  const navigate = useNavigate();
  const { school: schoolId } = useParams();
  const school = schoolId ? SCHOOLS[schoolId] : null;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSchool, setSelectedSchool] = useState(schoolId || null);
  const [fullScreen, setFullScreen] = useState(false);

  const activeSchool = selectedSchool ? SCHOOLS[selectedSchool] : school;
  const slides = getSchoolSlides(activeSchool);

  const prev = () => setCurrentSlide(s => Math.max(0, s - 1));
  const next = () => setCurrentSlide(s => Math.min(slides.length - 1, s + 1));

  const accentStyle = activeSchool
    ? { background: `linear-gradient(135deg, ${activeSchool.colors.gradientFrom}, ${activeSchool.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-950 flex flex-col`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center font-black text-white text-sm">S</div>
          <span className="font-black text-white">Stemara</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">
            {currentSlide + 1} / {slides.length}
          </span>
          {/* School switcher */}
          <div className="flex gap-1 ml-3">
            <button
              onClick={() => { setSelectedSchool(null); setCurrentSlide(0); }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${!selectedSchool ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-white'}`}
            >
              Overview
            </button>
            {SCHOOL_LIST.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedSchool(s.id); setCurrentSlide(0); }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${selectedSchool === s.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                style={selectedSchool === s.id ? { background: s.colors.primary } : {}}
              >
                {s.emoji} {s.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setFullScreen(!fullScreen)}
            className="text-xs text-gray-500 hover:text-white px-3 py-1.5 bg-gray-800 rounded-lg transition-colors">
            {fullScreen ? 'Exit' : '⛶ Fullscreen'}
          </button>
          <button onClick={() => navigate('/demo')}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
            Demo →
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedSchool}-${currentSlide}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Slide slide={slides[currentSlide]} school={activeSchool} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-t border-gray-800">
        <button
          onClick={prev}
          disabled={currentSlide === 0}
          className="px-5 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium disabled:opacity-30 hover:bg-gray-700 transition-colors"
        >
          ← Prev
        </button>

        {/* Slide dots */}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'w-5' : 'bg-gray-700'}`}
              style={i === currentSlide ? { background: activeSchool?.colors.accent || '#c1a33b' } : {}}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={currentSlide === slides.length - 1}
          className="px-5 py-2 text-white rounded-xl text-sm font-bold disabled:opacity-30 hover:opacity-90 transition-opacity"
          style={accentStyle}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
