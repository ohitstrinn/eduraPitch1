import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SCHOOLS, SCHOOL_LIST } from '../data/schools';
import { useSchool } from '../contexts/SchoolContext';
import { useState } from 'react';
import PreSignupModal from '../components/PreSignupModal';

export default function SchoolProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectSchool } = useSchool();
  const [showModal, setShowModal] = useState(false);

  const school = SCHOOLS[id];

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">School not found</h2>
          <button onClick={() => navigate('/')} className="text-blue-600 font-medium hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const accentStyle = { background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` };

  const handleStart = () => {
    selectSchool(id);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="text-white" style={accentStyle}>
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-black text-xl">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center font-black text-sm">S</div>
            Stemara
          </button>
          <div className="flex gap-3">
            {SCHOOL_LIST.filter(s => s.id !== id).map(s => (
              <button key={s.id} onClick={() => navigate(`/school/${s.id}`)}
                className="text-xs px-3 py-1.5 bg-white/15 rounded-lg font-medium hover:bg-white/25 transition-colors">
                {s.emoji} {s.shortName}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-6xl mb-4">{school.emoji}</div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm px-3 py-1 bg-white/20 rounded-full font-medium">{school.type}</span>
              <span className="text-sm text-white/70">{school.location}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">{school.name}</h1>
            <p className="text-xl text-white/80 mb-6 max-w-2xl">{school.pitch}</p>
            <p className="text-sm text-white/60 italic mb-8">{school.tagline}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleStart}
                className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all"
                style={{ color: school.colors.primary }}>
                Get Early Access for {school.shortName} →
              </button>
              <button onClick={() => navigate(`/pitch/${id}`)}
                className="px-8 py-3 border-2 border-white/40 text-white font-medium rounded-xl hover:bg-white/10 transition-all">
                View Pitch Deck
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            {Object.entries(school.stats).map(([key, value], i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl font-black text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Messages */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-5">Why Stemara for {school.shortName}?</h2>
            <div className="space-y-4">
              {school.valueProps.map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: school.colors.bg }}>
                  <span className="font-black mt-0.5" style={{ color: school.colors.primary }}>✓</span>
                  <p className="text-sm font-medium" style={{ color: school.colors.text }}>{v}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-5">Programs We Support</h2>
            <div className="flex flex-wrap gap-2">
              {school.programs.map((prog, i) => (
                <motion.span
                  key={prog}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm px-3 py-1.5 rounded-xl font-medium border"
                  style={{ background: school.colors.bg, color: school.colors.text, borderColor: school.colors.border }}
                >
                  {prog}
                </motion.span>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-2xl border"
              style={{ background: school.colors.cardBg, borderColor: school.colors.border }}>
              <h3 className="font-bold mb-2" style={{ color: school.colors.primary }}>Modality</h3>
              <p className="text-sm" style={{ color: school.colors.text }}>{school.modality}</p>
              <h3 className="font-bold mt-4 mb-2" style={{ color: school.colors.primary }}>Founded</h3>
              <p className="text-sm" style={{ color: school.colors.text }}>{school.founded}</p>
              <h3 className="font-bold mt-4 mb-2" style={{ color: school.colors.primary }}>Location</h3>
              <p className="text-sm" style={{ color: school.colors.text }}>{school.location}</p>
            </div>
          </div>
        </div>

        {/* Student Story */}
        <div className="mt-10 rounded-2xl p-8 border"
          style={{ background: school.colors.bg, borderColor: school.colors.border }}>
          <h2 className="text-2xl font-black mb-2" style={{ color: school.colors.primary }}>
            What it looks like in practice
          </h2>
          <p className="text-base leading-relaxed" style={{ color: school.colors.text }}>
            {school.demoStory}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">
            Ready to bring Stemara to {school.shortName}?
          </h2>
          <p className="text-gray-500 mb-6">Early access is free for partner schools in Year 1.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleStart}
              className="px-10 py-4 text-white font-bold rounded-xl text-lg shadow-md hover:shadow-lg transition-all"
              style={accentStyle}>
              Get Started →
            </button>
            <button onClick={() => navigate('/demo')}
              className="px-10 py-4 border-2 font-medium rounded-xl text-lg transition-all"
              style={{ borderColor: school.colors.primary, color: school.colors.primary }}>
              View Demo
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <PreSignupModal
          school={school}
          onComplete={() => { setShowModal(false); navigate('/login'); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
