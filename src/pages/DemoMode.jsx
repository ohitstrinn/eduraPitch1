import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOL_LIST, SCHOOLS } from '../data/schools';
import { useSchool } from '../contexts/SchoolContext';

const DEMO_SCREENS = [
  { id: 'landing', label: 'Landing Page', icon: '🏠', desc: 'School selector & hero' },
  { id: 'dashboard', label: 'Student Dashboard', icon: '📊', desc: 'Personalized per school' },
  { id: 'syllabus', label: 'Syllabus Upload', icon: '📄', desc: 'Parse & structured plan' },
  { id: 'chat', label: 'Study Chat', icon: '💬', desc: 'School-aware AI responses' },
  { id: 'recommendations', label: 'Study Plan', icon: '🧠', desc: 'Weekly recommendations' },
];

function SchoolPreview({ school }) {
  const accentStyle = { background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` };

  return (
    <motion.div
      key={school.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden shadow-xl border border-gray-200"
    >
      {/* Mock phone frame */}
      <div className="bg-gray-900 px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 mx-3 bg-gray-800 rounded-full h-5 flex items-center px-3">
          <span className="text-gray-400 text-xs">stemara.app / {school.id}</span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Dashboard preview */}
      <div className="bg-gray-50">
        {/* Header */}
        <div className="p-5 pb-10" style={accentStyle}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center font-black text-xs text-white">S</div>
              <span className="text-white font-black text-sm">Stemara</span>
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full text-white">{school.shortName}</span>
            </div>
          </div>
          <p className="text-white/70 text-xs mb-1">Good morning,</p>
          <h2 className="text-white font-black text-xl mb-1">{school.id === 'unh' ? 'Emma' : school.id === 'snhu' ? 'Marcus' : school.id === 'mcc' ? 'Jaylen' : 'Sofia'} 👋</h2>
          <p className="text-white/70 text-xs">{school.emoji} {school.name}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[{ v: 3, l: 'Courses' }, { v: '60%', l: 'Progress' }, { v: 3, l: 'Due soon' }].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-white font-black text-sm">{s.v}</div>
                <div className="text-white/60 text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards preview */}
        <div className="px-4 -mt-6 space-y-3 pb-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[['📄', 'Upload Syllabus'], ['🧠', 'Study Plan'], ['💬', 'Chat'], ['📚', 'Library']].map(([icon, label], i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50">
                  <span className="text-lg">{icon}</span>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Your Courses</h3>
            <div className="space-y-3">
              {[
                { name: school.id === 'unh' ? 'BIO 401' : school.id === 'snhu' ? 'BUS 301' : school.id === 'mcc' ? 'ENG 101' : 'HLT 201', pct: 65 },
                { name: school.id === 'unh' ? 'CHEM 303' : school.id === 'snhu' ? 'MKT 210' : school.id === 'mcc' ? 'BIO 110' : 'BIO 202', pct: 40 },
              ].map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{c.name}</span>
                    <span className="text-gray-500">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${c.pct}%`, background: `linear-gradient(to right, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School story card */}
          <div className="rounded-xl p-4 border" style={{ background: school.colors.bg, borderColor: school.colors.border }}>
            <div className="flex items-start gap-2">
              <span className="text-xl">{school.emoji}</span>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: school.colors.primary }}>{school.shortName} Tip</p>
                <p className="text-xs leading-relaxed" style={{ color: school.colors.text }}>{school.tagline}</p>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg text-white"
                  style={{ background: school.colors.buttonBg }}>
                  Upload Syllabus →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DemoMode() {
  const navigate = useNavigate();
  const { selectSchool } = useSchool();
  const [activeSchoolId, setActiveSchoolId] = useState('unh');

  const activeSchool = SCHOOLS[activeSchoolId];

  const accentStyle = { background: `linear-gradient(135deg, ${activeSchool.colors.gradientFrom}, ${activeSchool.colors.gradientTo})` };

  const handleLaunchSchool = (id) => {
    selectSchool(id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-black text-white">S</div>
              <span className="font-black text-white text-lg">Stemara</span>
            </button>
            <span className="text-gray-600">·</span>
            <span className="text-gray-400 text-sm font-medium">Internal Demo Mode</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/pitch')}
              className="text-sm text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 rounded-lg transition-colors">
              Pitch Deck
            </button>
            <button onClick={() => navigate('/founder')}
              className="text-sm text-gray-400 hover:text-white px-3 py-1.5 bg-gray-800 rounded-lg transition-colors">
              Founder Login
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 border border-yellow-300 text-yellow-700 text-xs font-semibold rounded-full mb-4">
            🎬 Demo Mode
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">
            See Stemara from every school's perspective.
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Each school has its own visual identity, messaging, and experience. This is what personalization looks like.
          </p>
        </div>

        {/* School selector tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {SCHOOL_LIST.map(school => (
            <button
              key={school.id}
              onClick={() => setActiveSchoolId(school.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                activeSchoolId === school.id ? 'border-transparent text-white shadow-lg' : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
              }`}
              style={activeSchoolId === school.id ? accentStyle : {}}
            >
              <span className="text-lg">{school.emoji}</span>
              <span>{school.shortName}</span>
            </button>
          ))}
        </div>

        {/* Two-column: preview + details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* School preview */}
          <div className="max-w-sm mx-auto w-full">
            <AnimatePresence mode="wait">
              <SchoolPreview key={activeSchoolId} school={activeSchool} />
            </AnimatePresence>
          </div>

          {/* School details */}
          <div className="space-y-5">
            <motion.div
              key={activeSchoolId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* School Identity */}
              <div className="rounded-2xl p-6 text-white mb-4" style={accentStyle}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{activeSchool.emoji}</span>
                  <div>
                    <h2 className="font-black text-xl">{activeSchool.name}</h2>
                    <p className="text-white/70 text-sm">{activeSchool.type} · {activeSchool.location}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm italic mb-3">{activeSchool.tagline}</p>
                <p className="text-white/90 text-sm leading-relaxed">{activeSchool.pitch}</p>
              </div>

              {/* Value Props */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                <h3 className="font-bold text-gray-800 mb-3">What Stemara delivers for {activeSchool.shortName}</h3>
                <div className="space-y-2">
                  {activeSchool.valueProps.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold" style={{ color: activeSchool.colors.primary }}>✓</span>
                      <p className="text-sm text-gray-700">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Story */}
              <div className="rounded-2xl p-5 border mb-4"
                style={{ background: activeSchool.colors.bg, borderColor: activeSchool.colors.border }}>
                <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: activeSchool.colors.primary }}>
                  Student Story
                </p>
                <p className="text-sm leading-relaxed" style={{ color: activeSchool.colors.text }}>
                  {activeSchool.demoStory}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleLaunchSchool(activeSchoolId)}
                  className="flex-1 py-3 text-white font-bold rounded-xl text-sm transition-all"
                  style={accentStyle}
                >
                  Launch {activeSchool.shortName} Experience →
                </button>
                <button
                  onClick={() => navigate(`/pitch/${activeSchoolId}`)}
                  className="px-5 py-3 border-2 font-medium rounded-xl text-sm transition-all"
                  style={{ borderColor: activeSchool.colors.primary, color: activeSchool.colors.primary }}
                >
                  Pitch Deck
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* All schools comparison */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Compare all four schools</h2>
            <p className="text-gray-500">Same platform. Different schools. Different experience.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SCHOOL_LIST.map(school => (
              <motion.div
                key={school.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all"
                onClick={() => setActiveSchoolId(school.id)}
              >
                <div className="p-4 text-white text-center" style={{ background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }}>
                  <div className="text-3xl mb-2">{school.emoji}</div>
                  <div className="font-black">{school.shortName}</div>
                  <div className="text-white/70 text-xs">{school.type}</div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-xs text-gray-500 italic text-center">{school.tagline}</p>
                  <div className="mt-2 flex flex-wrap gap-1 justify-center">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: school.colors.badgeBg, color: school.colors.badgeText }}>
                      {school.enrollment.split(' ')[0]} students
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
