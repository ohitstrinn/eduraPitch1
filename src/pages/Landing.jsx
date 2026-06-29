import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOL_LIST } from '../data/schools';
import { useSchool } from '../context/SchoolContext';
import PreSignupModal from '../components/PreSignupModal';

export default function Landing() {
  const { selectSchool, school } = useSchool();
  const [showModal, setShowModal] = useState(false);
  const [hoveredSchool, setHoveredSchool] = useState(null);
  const navigate = useNavigate();

  const handleSchoolSelect = (id) => {
    selectSchool(id);
  };

  const activeSchool = hoveredSchool
    ? SCHOOL_LIST.find((s) => s.id === hoveredSchool)
    : school;

  const bgColor = activeSchool?.colors?.bg || '#f8fafc';
  const primaryColor = activeSchool?.colors?.primary || '#1b3a6b';

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-2xl font-black tracking-tight" style={{ color: primaryColor }}>
          Stemara
        </span>
        <div className="flex items-center gap-4">
          <Link to="/demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            See demo
          </Link>
          <Link to="/pitch" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Pitch deck
          </Link>
          <Link
            to="/login"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ backgroundColor: activeSchool?.colors?.light || '#e8f4fd', color: primaryColor }}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            Now live for NH students
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-tight mb-6">
            Study smarter.<br />
            <span style={{ color: primaryColor }}>
              {activeSchool ? activeSchool.tagline.split('.')[0] + '.' : 'Built for your school.'}
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            {activeSchool
              ? activeSchool.pitch
              : 'Stemara is the AI-powered study companion built specifically for your school — not a generic tool, but a personalized academic experience.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 rounded-2xl text-white text-lg font-bold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: primaryColor }}
            >
              Join early testing
            </button>
            <Link
              to={school ? '/login' : '#schools'}
              className="px-8 py-4 rounded-2xl border-2 text-lg font-bold transition-all hover:scale-105"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              {school ? 'Sign in to ' + school.shortName : 'Select your school'}
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center gap-12 mt-16 pt-8 border-t border-gray-200"
        >
          {[
            { value: '4', label: 'NH Schools' },
            { value: '8', label: 'Early testers' },
            { value: '100%', label: 'School-specific' },
            { value: 'Free', label: 'To try' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black" style={{ color: primaryColor }}>{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* School Selector */}
      <div id="schools" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Choose your school</h2>
          <p className="text-gray-600">Each version is built specifically for that school's students, programs, and culture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCHOOL_LIST.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredSchool(s.id)}
              onHoverEnd={() => setHoveredSchool(null)}
              onClick={() => handleSchoolSelect(s.id)}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                school?.id === s.id ? 'shadow-xl' : 'shadow-md hover:shadow-xl border-transparent'
              }`}
              style={{
                backgroundColor: '#ffffff',
                borderColor: school?.id === s.id ? s.colors.primary : 'transparent',
              }}
            >
              {school?.id === s.id && (
                <div
                  className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: s.colors.primary }}
                >
                  Selected
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: s.colors.light }}
                >
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-black text-xl text-gray-900">{s.shortName}</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: s.colors.primary }}
                    >
                      {s.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{s.name}</div>
                  <div className="text-sm text-gray-700 mt-2 italic">"{s.tagline}"</div>
                  <div className="mt-3">
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: s.colors.primary }}
                    >
                      {s.pitchAngle}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.valueProps.slice(0, 2).map((vp) => (
                        <span
                          key={vp}
                          className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ backgroundColor: s.colors.light, color: s.colors.primary }}
                        >
                          {vp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {school?.id === s.id && (
                <div className="mt-4 flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 py-2.5 rounded-xl text-center text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: s.colors.primary }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Sign in to {s.shortName}
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 py-2.5 rounded-xl text-center text-sm font-bold border-2 transition-all hover:bg-gray-50"
                    style={{ borderColor: s.colors.primary, color: s.colors.primary }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Create account
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature highlights */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">What makes Stemara different</h2>
          <p className="text-gray-600">Not a one-size-fits-all tool. Built for where you actually go to school.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '📄',
              title: 'Syllabus Parsing',
              desc: 'Upload your syllabus and Stemara builds your entire semester plan — deadlines, readings, and study sessions.',
            },
            {
              icon: '🤖',
              title: 'AI Study Chat',
              desc: 'Ask anything about your courses. Get personalized answers, not generic Wikipedia responses.',
            },
            {
              icon: '🎯',
              title: 'School-Specific',
              desc: 'UNH, SNHU, MCC, and NCC each get their own version — tailored messaging, programs, and support.',
            },
          ].map((feat) => (
            <div key={feat.title} className="bg-white rounded-2xl p-6 shadow-md">
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{feat.title}</h3>
              <p className="text-gray-600 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div
        className="py-20 text-center"
        style={{ backgroundColor: primaryColor }}
      >
        <h2 className="text-3xl font-black text-white mb-4">Ready to study smarter?</h2>
        <p className="text-white/80 mb-8 max-w-md mx-auto">
          Join students from UNH, SNHU, MCC, and NCC who are getting early access.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-white rounded-2xl text-lg font-bold shadow-lg transition-all hover:scale-105"
          style={{ color: primaryColor }}
        >
          Get early access — it's free
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <PreSignupModal
            onClose={() => setShowModal(false)}
            onSubmit={() => setTimeout(() => setShowModal(false), 2500)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
