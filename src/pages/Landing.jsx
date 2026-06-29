import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchool } from '../contexts/SchoolContext';
import { SCHOOL_LIST } from '../data/schools';
import PreSignupModal from '../components/PreSignupModal';

const FEATURES = [
  { icon: '📄', title: 'Syllabus Parsing', desc: 'Drop any syllabus and get a structured study plan in seconds.' },
  { icon: '🧠', title: 'Adaptive Study AI', desc: 'Recommendations that adapt to your major, school, and pace.' },
  { icon: '💬', title: 'Study Chat', desc: 'Ask anything about your courses — get answers, not search results.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'See your deadlines, milestones, and study streaks at a glance.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { activeSchool, selectSchool } = useSchool();
  const [hoveredSchool, setHoveredSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDone, setModalDone] = useState(false);

  const displaySchool = hoveredSchool || activeSchool;

  const handleSchoolSelect = (id) => {
    selectSchool(id);
  };

  const handleGetStarted = () => {
    if (!activeSchool) {
      document.getElementById('school-selector')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setShowModal(true);
  };

  const handleModalComplete = () => {
    setShowModal(false);
    setModalDone(true);
  };

  const bgStyle = displaySchool
    ? { background: `linear-gradient(135deg, ${displaySchool.colors.gradientFrom}, ${displaySchool.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <motion.div
        className="relative overflow-hidden text-white"
        style={bgStyle}
        animate={bgStyle}
        transition={{ duration: 0.6 }}
      >
        {/* Nav */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-lg">S</div>
            <span className="font-black text-2xl tracking-tight">Stemara</span>
            {displaySchool && (
              <motion.span
                key={displaySchool.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-2 text-xs px-2 py-0.5 bg-white/20 rounded-full font-medium"
              >
                × {displaySchool.shortName}
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-white/80 hover:text-white transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/pitch')}
              className="text-sm px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
            >
              Pitch Deck
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <AnimatePresence mode="wait">
            {displaySchool ? (
              <motion.div
                key={displaySchool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-5xl mb-4">{displaySchool.emoji}</div>
                <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
                  Built for {displaySchool.shortName} students.
                </h1>
                <p className="text-xl text-white/80 max-w-2xl mx-auto mb-2">
                  {displaySchool.pitch}
                </p>
                <p className="text-sm text-white/60 italic mb-8">{displaySchool.tagline}</p>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-5xl mb-4">📚</div>
                <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
                  Study smarter.<br />Built for <em>your</em> school.
                </h1>
                <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                  Stemara is the adaptive study platform that personalizes to your school, your major, and your schedule. Not one-size-fits-all — yours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all"
              style={displaySchool ? { color: displaySchool.colors.primary } : {}}
            >
              {modalDone ? '✓ You\'re on the list!' : activeSchool ? `Get Started with ${activeSchool.shortName}` : 'Get Early Access'}
            </motion.button>
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 border-2 border-white/40 text-white font-medium rounded-xl text-lg hover:bg-white/10 transition-all"
            >
              Live Demo →
            </button>
          </div>

          {displaySchool && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex flex-wrap justify-center gap-2"
            >
              {displaySchool.keyMessages.map((msg, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-white/15 rounded-full text-white/90">
                  ✓ {msg}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 0 0 30L0 60Z" fill="white"/>
          </svg>
        </div>
      </motion.div>

      {/* School Selector */}
      <div id="school-selector" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Choose your school</h2>
          <p className="text-gray-500 text-lg">Stemara adapts to your institution — different messaging, different tools, different experience.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SCHOOL_LIST.map((school) => {
            const isSelected = activeSchool?.id === school.id;
            return (
              <motion.div
                key={school.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onHoverStart={() => setHoveredSchool(school)}
                onHoverEnd={() => setHoveredSchool(null)}
                onClick={() => handleSchoolSelect(school.id)}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                  isSelected
                    ? 'border-transparent shadow-xl'
                    : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
                style={isSelected
                  ? { background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})`, color: 'white' }
                  : { background: school.colors.bg }
                }
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`text-4xl ${isSelected ? '' : ''}`}>{school.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : ''
                      }`}
                        style={!isSelected ? { background: school.colors.badgeBg, color: school.colors.badgeText } : {}}
                      >
                        {school.shortName}
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>{school.type}</span>
                    </div>
                    <h3 className={`font-bold text-lg leading-tight mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {school.name}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                      {school.tagline}
                    </p>
                    <div className={`mt-3 flex flex-wrap gap-1`}>
                      {school.keyMessages.slice(0, 2).map((msg, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/15 text-white/90' : ''}`}
                          style={!isSelected ? { background: school.colors.cardBg, color: school.colors.text } : {}}
                        >
                          {msg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {activeSchool && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm mb-4">You selected <strong>{activeSchool.name}</strong></p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 text-white font-bold rounded-xl text-base shadow-md hover:shadow-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${activeSchool.colors.gradientFrom}, ${activeSchool.colors.gradientTo})` }}
              >
                {modalDone ? '✓ You\'re on the list — Sign In' : 'Test the App (Early Access)'}
              </button>
              <button
                onClick={() => navigate(`/school/${activeSchool.id}`)}
                className="px-8 py-3 border-2 font-medium rounded-xl text-base transition-all"
                style={{ borderColor: activeSchool.colors.primary, color: activeSchool.colors.primary }}
              >
                View {activeSchool.shortName} Profile →
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Everything a student needs. Nothing they don't.</h2>
            <p className="text-gray-500 text-lg">Core features that make the difference — personalized to your school from day one.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof / Stats */}
      <div className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '4', label: 'NH Schools', sub: 'UNH · SNHU · MCC · NCC' },
            { n: '200+', label: 'Early Signups', sub: 'Students on the waitlist' },
            { n: '8', label: 'Major Tracks', sub: 'STEM to Humanities' },
            { n: '100%', label: 'School-Specific', sub: 'No generic tools here' },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-gray-50">
              <div className="text-4xl font-black text-gray-900 mb-1">{stat.n}</div>
              <div className="font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* School CTA Strip */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">
            Tailored for New Hampshire students
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {SCHOOL_LIST.map((school) => (
              <button
                key={school.id}
                onClick={() => { handleSchoolSelect(school.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all"
              >
                <span>{school.emoji}</span>
                <span>{school.shortName}</span>
              </button>
            ))}
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Ready to study smarter?</h2>
          <button
            onClick={handleGetStarted}
            className="px-10 py-4 bg-white text-gray-900 font-bold rounded-xl text-lg hover:bg-gray-100 transition-all"
          >
            Get Early Access →
          </button>
          <p className="text-gray-500 text-xs mt-4">No commitment. Cancel anytime. Built by a student, for students.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-black">S</span>
            </div>
            <span className="font-bold text-gray-900">Stemara</span>
            <span className="text-gray-400 text-sm">· Adaptive study, built for your school</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <button onClick={() => navigate('/pitch')} className="hover:text-gray-600 transition-colors">Pitch Deck</button>
            <button onClick={() => navigate('/demo')} className="hover:text-gray-600 transition-colors">Demo</button>
            <button onClick={() => navigate('/founder')} className="hover:text-gray-600 transition-colors">Founder Login</button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showModal && (
          <PreSignupModal
            school={activeSchool}
            onComplete={handleModalComplete}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
