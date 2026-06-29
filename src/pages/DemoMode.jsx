import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOL_LIST } from '../data/schools';
import { useSchool } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';

export default function DemoMode() {
  const { selectSchool } = useSchool();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeSchool, setActiveSchool] = useState(null);
  const [launching, setLaunching] = useState(false);

  const handleLaunchDemo = async (schoolId) => {
    const school = SCHOOL_LIST.find((s) => s.id === schoolId);
    if (!school) return;
    setLaunching(schoolId);
    await new Promise((r) => setTimeout(r, 800));

    selectSchool(schoolId);
    login(
      {
        name: 'Demo Student',
        email: `demo@${school.website}`,
        school: schoolId,
        major: 'STEM',
        points: 75,
        plan: 'free',
        isDemo: true,
      },
      'student'
    );
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white font-black text-xl">Stemara</Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Demo Mode</span>
          <Link to="/pitch" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pitch decks
          </Link>
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Real login
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white text-sm font-semibold mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Demo mode — no signup required
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-4">
            Experience Stemara<br />
            as a real student
          </h1>
          <p className="text-gray-400 text-xl max-w-xl mx-auto">
            Pick a school below and instantly see the personalized Stemara experience for that campus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {SCHOOL_LIST.map((school) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: SCHOOL_LIST.indexOf(school) * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-3xl overflow-hidden cursor-pointer transition-all ${
                activeSchool === school.id ? 'ring-4' : ''
              }`}
              style={{ '--tw-ring-color': school.colors.primary }}
              onClick={() => setActiveSchool(activeSchool === school.id ? null : school.id)}
            >
              {/* School hero */}
              <div
                className="h-48 flex flex-col items-center justify-center p-6"
                style={{
                  background: `linear-gradient(135deg, ${school.colors.primary}, ${school.colors.dark || school.colors.primary})`,
                }}
              >
                <div className="text-6xl mb-3">{school.emoji}</div>
                <div className="text-white font-black text-2xl">{school.shortName}</div>
                <div className="text-white/70 text-sm">{school.type}</div>
              </div>

              <div className="bg-gray-900 border-x border-b border-gray-800 p-5">
                <div className="font-black text-white text-lg mb-1">{school.name}</div>
                <div className="text-gray-400 text-sm mb-3">{school.location} · {school.studentCount} students</div>
                <div className="italic text-sm mb-4" style={{ color: school.colors.primary }}>
                  "{school.tagline}"
                </div>

                <AnimatePresence>
                  {activeSchool === school.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="space-y-2 mb-4">
                        {school.valueProps.map((vp) => (
                          <div key={vp} className="flex items-start gap-2 text-xs text-gray-400">
                            <span style={{ color: school.colors.primary }}>✓</span>
                            {vp}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchDemo(school.id);
                  }}
                  disabled={launching === school.id}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: school.colors.primary }}
                >
                  {launching === school.id ? 'Launching...' : `Demo ${school.shortName} experience →`}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* What the demo shows */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h3 className="text-xl font-black text-white mb-6 text-center">What you'll see in each demo</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'School-specific theme', desc: 'Colors, tone, and branding adapted for each campus' },
              { icon: '📄', title: 'Syllabus parsing', desc: 'Upload a syllabus and watch it get parsed into a study plan' },
              { icon: '🤖', title: 'AI study chat', desc: 'Chat with a school-aware AI tutor on your courses' },
              { icon: '📊', title: 'Student dashboard', desc: 'Full dashboard matching the Stemara mockup design' },
              { icon: '🏫', title: 'School directory', desc: 'Programs, courses, and campus-specific guidance' },
              { icon: '🎯', title: 'Pitch deck mode', desc: 'Presentation slides tailored for each school partnership' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-bold text-white text-sm mb-1">{feature.title}</div>
                <div className="text-xs text-gray-500">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
