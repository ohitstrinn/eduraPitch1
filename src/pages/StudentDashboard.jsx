import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSchool } from '../contexts/SchoolContext';
import { MAJORS } from '../data/schools';

const MOCK_COURSES = {
  unh: [
    { code: 'BIO 401', name: 'Molecular Cell Biology', credits: 4, progress: 65, upcoming: 'Lab Report due Oct 12' },
    { code: 'CHEM 303', name: 'Organic Chemistry II', credits: 3, progress: 40, upcoming: 'Problem Set 5 due Oct 9' },
    { code: 'PSYC 401', name: 'Research Methods', credits: 3, progress: 80, upcoming: 'Data Analysis draft Oct 15' },
  ],
  snhu: [
    { code: 'BUS 301', name: 'Operations Management', credits: 3, progress: 50, upcoming: 'Module 4 Quiz due Oct 11' },
    { code: 'MKT 210', name: 'Principles of Marketing', credits: 3, progress: 70, upcoming: 'Discussion post due Oct 8' },
    { code: 'ACC 201', name: 'Financial Accounting', credits: 3, progress: 30, upcoming: 'Week 6 assignment due Oct 14' },
  ],
  mcc: [
    { code: 'ENG 101', name: 'College Writing', credits: 3, progress: 55, upcoming: 'Essay 2 draft due Oct 10' },
    { code: 'BIO 110', name: 'Intro to Biology', credits: 4, progress: 45, upcoming: 'Lab practical Oct 13' },
    { code: 'PSY 101', name: 'General Psychology', credits: 3, progress: 75, upcoming: 'Chapter 7 quiz Oct 9' },
  ],
  ncc: [
    { code: 'HLT 201', name: 'Clinical Practice I', credits: 4, progress: 60, upcoming: 'Competency check Oct 11' },
    { code: 'BIO 202', name: 'Human Anatomy', credits: 4, progress: 35, upcoming: 'Midterm Oct 14' },
    { code: 'COM 101', name: 'Communication Skills', credits: 3, progress: 80, upcoming: 'Presentation Oct 8' },
  ],
};

const QUICK_ACTIONS = [
  { icon: '📄', label: 'Upload Syllabus', path: '/syllabus', desc: 'Parse a new course' },
  { icon: '🧠', label: 'Study Plan', path: '/recommendations', desc: 'Personalized recommendations' },
  { icon: '💬', label: 'Study Chat', path: '/chat', desc: 'Ask anything about your courses' },
  { icon: '📚', label: 'Library', path: '/library', desc: 'Find your textbooks' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeSchool } = useSchool();
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const school = activeSchool;
  const courses = MOCK_COURSES[school?.id] || MOCK_COURSES.unh;
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const major = MAJORS.find(m => m.value === user?.major);

  const bgStyle = school
    ? { background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  const totalProgress = Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="text-white p-6 pb-16" style={bgStyle}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center font-black text-sm">S</div>
              <span className="font-black text-lg">Stemara</span>
              {school && (
                <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full ml-1">{school.shortName}</span>
              )}
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-xs text-white/60 hover:text-white/90 transition-colors"
            >
              Sign out
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-white/70 text-sm mb-1">{greeting},</p>
            <h1 className="text-3xl font-black mb-1">{firstName} 👋</h1>
            {school && (
              <p className="text-white/70 text-sm">
                {school.emoji} {school.name} · {major?.label || 'Student'}
              </p>
            )}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-5 grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Courses', value: courses.length },
              { label: 'Avg Progress', value: `${totalProgress}%` },
              { label: 'Upcoming', value: courses.filter(c => c.upcoming).length },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="font-black text-xl">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-10">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-lg p-5 mb-5"
        >
          <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50 text-left transition-all"
              >
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{action.label}</div>
                  <div className="text-xs text-gray-400">{action.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Your Courses</h2>
            <button onClick={() => navigate('/student')}
              className="text-xs font-medium hover:underline"
              style={{ color: school?.colors.primary || '#1a1a2e' }}>
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {courses.map((course, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full mr-2"
                      style={{ background: school?.colors.badgeBg || '#dbeafe', color: school?.colors.badgeText || '#1e3a8a' }}>
                      {course.code}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{course.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(to right, ${school?.colors.gradientFrom || '#003C8A'}, ${school?.colors.gradientTo || '#1A5CB0'})` }}
                  />
                </div>
                {course.upcoming && (
                  <p className="text-xs text-gray-400 mt-1">⏰ {course.upcoming}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* School Story */}
        {school && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="rounded-2xl p-5 mb-5 border"
            style={{ background: school.colors.bg, borderColor: school.colors.border }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{school.emoji}</span>
              <div>
                <h3 className="font-bold text-sm mb-1" style={{ color: school.colors.primary }}>
                  {school.shortName} Study Tip
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: school.colors.text }}>
                  {school.demoStory}
                </p>
                <button
                  onClick={() => navigate('/syllabus')}
                  className="mt-3 text-xs font-bold px-4 py-2 rounded-lg text-white transition-all"
                  style={{ background: school.colors.buttonBg }}
                >
                  Upload Your Syllabus →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* More features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5"
        >
          <h2 className="font-bold text-gray-800 mb-4">More Features</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🃏', label: 'Games', path: '/gamification' },
              { icon: '📖', label: 'Hub', path: '/student' },
              { icon: '📦', label: 'Book Trade', path: '/book-trading' },
            ].map((f, i) => (
              <button
                key={i}
                onClick={() => navigate(f.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{f.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{f.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
