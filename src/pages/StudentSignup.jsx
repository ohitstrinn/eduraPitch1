import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSchool } from '../contexts/SchoolContext';
import { SCHOOL_LIST, MAJORS } from '../data/schools';
import PreSignupModal from '../components/PreSignupModal';

export default function StudentSignup() {
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  const { activeSchool, selectSchool } = useSchool();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', school: activeSchool?.id || '', major: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bgStyle = activeSchool
    ? { background: `linear-gradient(135deg, ${activeSchool.colors.gradientFrom}, ${activeSchool.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  const selectedSchool = SCHOOL_LIST.find(s => s.id === form.school) || activeSchool;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.school) { setError('Please select your school.'); return; }
    if (!form.major) { setError('Please select your major or track.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    if (form.school !== activeSchool?.id) selectSchool(form.school);
    loginStudent({ name: form.name, email: form.email, school: form.school, major: form.major });
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white" style={bgStyle}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 font-black text-2xl">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black">S</div>
          Stemara
        </button>
        <div>
          <div className="text-5xl mb-4">{selectedSchool?.emoji || '📚'}</div>
          <h2 className="text-3xl font-black mb-3">
            {selectedSchool ? `Join ${selectedSchool.shortName} students on Stemara.` : 'Create your account.'}
          </h2>
          <p className="text-white/80 text-lg mb-6">
            {selectedSchool?.pitch || 'Stemara adapts to your institution, major, and schedule.'}
          </p>
          {selectedSchool && (
            <div className="space-y-2">
              {selectedSchool.keyMessages.map((msg, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-xs">✓</span>
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-white/40 text-xs">© 2025 Stemara · Built in New Hampshire</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-sm"
              style={{ background: selectedSchool?.colors.primary || '#1a1a2e' }}>S</div>
            <span className="font-black text-xl text-gray-900">Stemara</span>
          </button>

          <h1 className="text-2xl font-black text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-6">
            Already have one?{' '}
            <Link to="/login" className="font-semibold hover:underline"
              style={{ color: selectedSchool?.colors.primary || '#1a1a2e' }}>
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="First Last"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">School email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@school.edu"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Your school</label>
              <div className="grid grid-cols-2 gap-2">
                {SCHOOL_LIST.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, school: s.id })); selectSchool(s.id); }}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                      form.school === s.id ? 'border-transparent' : 'border-gray-200'
                    }`}
                    style={form.school === s.id
                      ? { background: s.colors.bg, borderColor: s.colors.primary }
                      : {}}
                  >
                    <span>{s.emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{s.shortName}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Major or track</label>
              <div className="grid grid-cols-2 gap-2">
                {MAJORS.slice(0, 6).map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, major: m.value }))}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                      form.major === m.value ? 'border-transparent' : 'border-gray-200'
                    }`}
                    style={form.major === m.value && selectedSchool
                      ? { background: selectedSchool.colors.bg, borderColor: selectedSchool.colors.primary }
                      : form.major === m.value ? { background: '#eff6ff', borderColor: '#3b82f6' } : {}}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="text-xs font-semibold text-gray-900">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
              style={selectedSchool
                ? { background: `linear-gradient(135deg, ${selectedSchool.colors.gradientFrom}, ${selectedSchool.colors.gradientTo})` }
                : { background: '#1a1a2e' }}
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm font-medium hover:underline"
              style={{ color: selectedSchool?.colors.primary || '#1a1a2e' }}
            >
              Just want to try it? → Join early access
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <PreSignupModal
          school={selectedSchool}
          onComplete={() => { setShowModal(false); navigate('/login'); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
