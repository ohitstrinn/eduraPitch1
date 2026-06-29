import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_LIST } from '../data/schools';

export default function StudentLogin() {
  const { login } = useAuth();
  const { school, selectSchool } = useSchool();
  const navigate = useNavigate();
  const [tab, setTab] = useState('student'); // 'student' | 'founder'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const primaryColor = school?.colors?.primary || '#1b3a6b';
  const lightBg = school?.colors?.light || '#e8f4fd';

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));

    // Demo credentials + any student with school email pattern
    const isDemoStudent =
      (email === 'student@stemara.com' && password === 'demo') ||
      (email === 'ohitstrin' && password === 'Edura01!') ||
      (email.includes('@') && password.length >= 4);

    if (isDemoStudent) {
      const userData = {
        name: email.split('@')[0].split('.').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Student',
        email,
        school: school?.id || 'unh',
        major: 'STEM',
        points: 75,
        plan: 'free',
        joinedAt: new Date().toISOString(),
      };
      login(userData, 'student');
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try student@stemara.com / demo');
    }
    setLoading(false);
  };

  const handleFounderLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));

    if (
      (email === 'founder@stemara.com' && password === 'founder2025') ||
      (email === 'ohitstrinnn@icloud.com' && password === 'founder2025')
    ) {
      login({ name: 'Founder', email, role: 'founder' }, 'founder');
      navigate('/founder/dashboard');
    } else {
      setError('Founder credentials: founder@stemara.com / founder2025');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: school?.colors?.bg || '#f8fafc' }}>
      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between w-2/5 p-12"
        style={{ backgroundColor: primaryColor }}
      >
        <Link to="/" className="text-2xl font-black text-white tracking-tight">Stemara</Link>
        <div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Welcome back.<br />Ready to study?
          </h2>
          {school && (
            <div className="mt-6 bg-white/10 rounded-2xl p-5">
              <div className="text-white/70 text-sm font-medium mb-1">You're signing into</div>
              <div className="text-white text-xl font-black">{school.name}</div>
              <div className="text-white/70 text-sm mt-1">{school.tagline}</div>
            </div>
          )}
        </div>
        <div className="text-white/50 text-sm">
          © 2025 Stemara · Built for NH students
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="md:hidden block text-2xl font-black mb-8" style={{ color: primaryColor }}>
            Stemara
          </Link>

          {/* School selector */}
          {!school && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select your school first</label>
              <div className="grid grid-cols-2 gap-2">
                {SCHOOL_LIST.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectSchool(s.id)}
                    className="p-3 rounded-xl border-2 border-gray-200 hover:border-current text-left transition-all"
                    style={{ '--tw-border-opacity': 1 }}
                  >
                    <div className="text-lg">{s.emoji}</div>
                    <div className="font-semibold text-sm text-gray-900">{s.shortName}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            {['student', 'founder'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                {t === 'student' ? 'Student' : 'Founder'}
              </button>
            ))}
          </div>

          {tab === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  placeholder="your@email.edu or student@stemara.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  style={{ focusBorderColor: primaryColor }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Password (try: demo)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold" style={{ color: primaryColor }}>
                  Create one
                </Link>
              </p>
              <div
                className="text-xs text-center p-3 rounded-xl"
                style={{ backgroundColor: lightBg, color: primaryColor }}
              >
                Demo: student@stemara.com / demo
              </div>
            </form>
          ) : (
            <form onSubmit={handleFounderLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Founder email</label>
                <input
                  type="email"
                  placeholder="founder@stemara.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Founder password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#1a1a2e' }}
              >
                {loading ? 'Signing in...' : 'Founder sign in'}
              </button>
              <div className="text-xs text-center p-3 rounded-xl bg-gray-100 text-gray-600">
                Demo: founder@stemara.com / founder2025
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
