import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_LIST } from '../data/schools';
import { MAJORS } from '../data/mockData';

export default function Signup() {
  const { login } = useAuth();
  const { school, selectSchool } = useSchool();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    major: '',
    schoolId: school?.id || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const primaryColor = school?.colors?.primary || '#1b3a6b';

  const update = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSchoolPick = (id) => {
    selectSchool(id);
    update('schoolId', id);
  };

  const canNext = () => {
    if (step === 1) return form.schoolId;
    if (step === 2) return form.name.trim().length > 1 && form.email.includes('@') && form.password.length >= 6;
    if (step === 3) return !!form.major;
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const userData = {
      name: form.name,
      email: form.email,
      school: form.schoolId,
      major: form.major,
      points: 0,
      plan: 'free',
      joinedAt: new Date().toISOString(),
    };
    // Save to localStorage signups
    const existing = JSON.parse(localStorage.getItem('stemara_signups') || '[]');
    localStorage.setItem('stemara_signups', JSON.stringify([...existing, userData]));
    login(userData, 'student');
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: school?.colors?.bg || '#f8fafc' }}>
      {/* Left side */}
      <div
        className="hidden md:flex flex-col justify-between w-2/5 p-12"
        style={{ backgroundColor: primaryColor }}
      >
        <Link to="/" className="text-2xl font-black text-white tracking-tight">Stemara</Link>
        <div>
          <div className="text-5xl mb-6">🎓</div>
          <h2 className="text-3xl font-black text-white mb-3">
            {step === 1 && 'Pick your school.'}
            {step === 2 && 'Create your account.'}
            {step === 3 && 'Almost there!'}
          </h2>
          <p className="text-white/70">
            {step === 1 && 'Each school gets its own personalized Stemara experience.'}
            {step === 2 && 'Your account is yours — private, secure, and free to start.'}
            {step === 3 && 'Tell us your major so we can personalize your study plan.'}
          </p>
        </div>
        <div className="text-white/40 text-sm">Step {step} of 3</div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="md:hidden block text-2xl font-black mb-6" style={{ color: primaryColor }}>
            Stemara
          </Link>

          {/* Progress */}
          <div className="flex gap-1.5 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1.5 flex-1 rounded-full transition-all duration-500"
                style={{ backgroundColor: s <= step ? primaryColor : '#e5e7eb' }}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Choose your school</h2>
              <p className="text-gray-500 text-sm mb-6">We'll personalize everything for you.</p>
              <div className="grid grid-cols-2 gap-3">
                {SCHOOL_LIST.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSchoolPick(s.id)}
                    className="p-4 rounded-2xl border-2 text-left transition-all"
                    style={{
                      borderColor: form.schoolId === s.id ? s.colors.primary : '#e5e7eb',
                      backgroundColor: form.schoolId === s.id ? s.colors.bg : '#fff',
                    }}
                  >
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="font-black text-gray-900">{s.shortName}</div>
                    <div className="text-xs text-gray-500">{s.location}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Your account</h2>
              <p className="text-gray-500 text-sm mb-6">Free forever for students.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Full name</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">School email</label>
                  <input
                    type="email"
                    placeholder={`you@${school?.website || 'school.edu'}`}
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">What's your major?</h2>
              <p className="text-gray-500 text-sm mb-6">We'll tailor your study plan and recommendations.</p>
              <div className="space-y-2">
                {MAJORS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => update('major', m.label)}
                    className="w-full p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-all"
                    style={{
                      borderColor: form.major === m.label ? primaryColor : '#e5e7eb',
                      backgroundColor: form.major === m.label ? (school?.colors?.bg || '#f0f4f8') : '#fff',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: form.major === m.label ? primaryColor : '#d1d5db' }}
                    >
                      {m.label.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-4 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex-1 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-40 hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext() || loading}
                className="flex-1 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-40 hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold" style={{ color: primaryColor }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
