import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSchool } from '../contexts/SchoolContext';
import { SCHOOLS } from '../data/schools';

const DEMO_CREDENTIALS = [
  { email: 'emma@unh.edu', password: 'stemara', school: 'unh', name: 'Emma Wilson', major: 'stem' },
  { email: 'marcus@snhu.edu', password: 'stemara', school: 'snhu', name: 'Marcus Davis', major: 'business' },
  { email: 'jaylen@mccnh.edu', password: 'stemara', school: 'mcc', name: 'Jaylen Foster', major: 'humanities' },
  { email: 'sofia@nashuacc.edu', password: 'stemara', school: 'ncc', name: 'Sofia Rodriguez', major: 'health' },
];

export default function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  const { activeSchool, selectSchool } = useSchool();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bgStyle = activeSchool
    ? { background: `linear-gradient(135deg, ${activeSchool.colors.gradientFrom}, ${activeSchool.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 500));

    const match = DEMO_CREDENTIALS.find(
      c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
    );

    if (match) {
      if (match.school !== activeSchool?.id) selectSchool(match.school);
      loginStudent({ name: match.name, email: match.email, school: match.school, major: match.major });
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try a demo account below.');
    }
    setLoading(false);
  };

  const handleDemoLogin = (demo) => {
    if (demo.school !== activeSchool?.id) selectSchool(demo.school);
    loginStudent({ name: demo.name, email: demo.email, school: demo.school, major: demo.major });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white" style={bgStyle}>
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-black text-2xl">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black">S</div>
            Stemara
          </button>
        </div>
        <div>
          {activeSchool ? (
            <>
              <div className="text-5xl mb-4">{activeSchool.emoji}</div>
              <h2 className="text-3xl font-black mb-3">Welcome back, {activeSchool.shortName} student.</h2>
              <p className="text-white/80 text-lg mb-6">{activeSchool.pitch}</p>
              <div className="space-y-2">
                {activeSchool.keyMessages.map((msg, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                    <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</span>
                    {msg}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-3xl font-black mb-3">Study smarter. Built for your school.</h2>
              <p className="text-white/80 text-lg">Stemara adapts to your institution, your major, and your schedule.</p>
            </>
          )}
        </div>
        <p className="text-white/40 text-xs">© 2025 Stemara · Built in New Hampshire</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{ background: activeSchool?.colors.primary || '#1a1a2e' }}>S</div>
            <span className="font-black text-xl text-gray-900">Stemara</span>
          </button>

          <h1 className="text-2xl font-black text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: activeSchool?.colors.primary || '#1a1a2e' }}>
              Create one
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">School email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-sm text-gray-900"
                style={{ '--tw-ring-color': activeSchool?.colors.primary || '#1a1a2e' }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-sm text-gray-900"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
              style={activeSchool ? { background: `linear-gradient(135deg, ${activeSchool.colors.gradientFrom}, ${activeSchool.colors.gradientTo})` } : { background: '#1a1a2e' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </motion.button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Demo accounts (click to log in)</p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((demo) => {
                const s = SCHOOLS[demo.school];
                return (
                  <button
                    key={demo.email}
                    onClick={() => handleDemoLogin(demo)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 text-left transition-all hover:bg-gray-50"
                  >
                    <span className="text-xl">{s?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">{demo.name}</div>
                      <div className="text-xs text-gray-400">{demo.email}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: s?.colors.badgeBg, color: s?.colors.badgeText }}>
                      {s?.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
