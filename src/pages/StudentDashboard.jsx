import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';

const BOTTOM_NAV = [
  { to: '/directory', icon: '🏫', label: 'School' },
  { to: '/syllabus', icon: '📄', label: 'Syllabus' },
  { to: '/dashboard', icon: null, label: 'Home' },
  { to: '/study', icon: '🤖', label: 'AI Tools' },
  { to: '/chat', icon: '👤', label: 'Profile' },
];

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { school } = useSchool();
  const navigate = useNavigate();
  const [chatMsg, setChatMsg] = useState('');

  const primaryColor = school?.colors?.primary || '#1b3a6b';
  const lightBg = school?.colors?.light || '#d6e3f7';

  const recentCourse = school?.sampleCourses?.[0] || { code: 'BIO 101', name: 'Biology', professor: 'Prof. Chen' };

  const points = user?.points || 75;
  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            S
          </div>
          <span className="font-bold text-gray-900">Stemara</span>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold"
          >
            {firstName.charAt(0)}
          </button>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Welcome back, {firstName}</h1>
        {school && (
          <p className="text-sm text-gray-500 mt-0.5">{school.shortName} · {school.modality}</p>
        )}
      </div>

      {/* Credits bar */}
      <div className="px-5 py-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl px-5 py-4 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${school?.colors?.dark || '#0d2040'})` }}
        >
          <div>
            <div className="text-white/70 text-xs font-medium">Stemara Points</div>
            <div className="text-white text-2xl font-black">{points} pts</div>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ backgroundColor: school?.colors?.accent || '#c9a227', color: primaryColor }}
          >
            + Earn More
          </button>
        </motion.div>
      </div>

      {/* Main grid */}
      <div className="px-5 grid grid-cols-2 gap-3 mt-1">
        {/* Recent course */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="text-xs font-bold text-gray-500 mb-3">Recent</div>
          <div
            className="w-12 h-14 rounded-xl flex items-center justify-center text-2xl mb-3"
            style={{ backgroundColor: lightBg }}
          >
            📚
          </div>
          <div className="font-black text-gray-900 text-sm leading-tight mb-3">
            {recentCourse.code}<br />{recentCourse.name.split(' ').slice(0, 2).join(' ')}
          </div>
          <Link to="/study">
            <button
              className="w-full py-2 rounded-xl text-xs font-bold text-white mb-2 transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Continue Review
            </button>
          </Link>
          <div className="text-xs text-gray-400 text-center mb-2">Get 25 points instantly</div>
          <Link to="/syllabus">
            <button
              className="w-full py-2 rounded-xl text-xs font-bold border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Upload Syllabus
            </button>
          </Link>
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="text-xs font-bold text-gray-500 mb-2">Your Plan</div>
          <div className="font-black text-gray-900 text-sm mb-3">
            {user?.plan === 'premium' ? 'Premium' : 'Free Tier'}
          </div>
          <ul className="text-xs text-gray-600 space-y-1.5 mb-4">
            <li className="flex items-center gap-1">
              <span style={{ color: primaryColor }}>•</span>
              {user?.plan === 'premium' ? '3 syllabi left' : 'Unlimited syllabi'}
            </li>
            <li className="flex items-center gap-1">
              <span style={{ color: primaryColor }}>•</span>
              AI chat access
            </li>
            <li className="flex items-center gap-1">
              <span style={{ color: primaryColor }}>•</span>
              {school?.shortName} resources
            </li>
          </ul>
          <button
            className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {user?.plan === 'premium' ? 'Manage Plan' : 'Upgrade'}
          </button>
        </motion.div>

        {/* AI Study Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="text-xs font-bold text-gray-500 mb-3">AI Study Hub</div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: '🃏', label: 'Flashcard' },
              { icon: '❓', label: 'Quizzes' },
              { icon: '📅', label: 'Planner' },
            ].map((tool) => (
              <Link to="/study" key={tool.label}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: lightBg }}
                  >
                    {tool.icon}
                  </div>
                  <span className="text-xs text-gray-500">{tool.label}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/study">
            <button
              className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Launch AI Tutor
            </button>
          </Link>
        </motion.div>

        {/* Campus Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-gray-500">Campus Chat</div>
            <Link to="/chat">
              <span className="text-gray-400 text-sm">→</span>
            </Link>
          </div>
          <div className="flex items-start gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              S
            </div>
            <div
              className="flex-1 rounded-xl rounded-tl-none p-2 text-xs text-gray-700"
              style={{ backgroundColor: lightBg }}
            >
              Hi! I'm your Stemara AI. Ask me anything about your {school?.shortName || 'school'} courses!
            </div>
          </div>
          <div
            className="inline-block text-xs px-2 py-1 rounded-full font-medium mb-3"
            style={{ backgroundColor: lightBg, color: primaryColor }}
          >
            Focus: {recentCourse.code}
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              On
            </button>
            <button className="flex-1 py-1.5 rounded-lg text-xs font-bold text-gray-400 bg-gray-100">
              Off
            </button>
          </div>
        </motion.div>
      </div>

      {/* Recent AI Tutor */}
      <div className="px-5 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              AI
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Recent</div>
              <div className="font-bold text-sm text-gray-900">Stemara AI Tutor</div>
              <div className="text-xs text-gray-400">Personal study assistant</div>
            </div>
          </div>
          <div
            className="w-10 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: lightBg }}
          >
            📘
          </div>
        </motion.div>
      </div>

      {/* Chat input */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-5">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3 px-4 py-3">
          <span className="text-gray-400">💬</span>
          <input
            type="text"
            placeholder={`Ask about your ${recentCourse.code} course...`}
            value={chatMsg}
            onChange={(e) => setChatMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && chatMsg.trim()) {
                navigate('/chat');
              }
            }}
            className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
          />
          <button className="text-gray-400 hover:text-gray-600 transition-colors">🎤</button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center justify-around px-4 py-2">
          {BOTTOM_NAV.map((item) =>
            item.label === 'Home' ? (
              <Link
                key={item.label}
                to={item.to}
                className="flex flex-col items-center -mt-4"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  🏠
                </div>
              </Link>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="flex flex-col items-center gap-1 py-1"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs text-gray-500">{item.label}</span>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
