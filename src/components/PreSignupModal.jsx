import { useState } from 'react';
import { motion } from 'framer-motion';
import { MAJORS, INTEREST_LEVELS, SCHOOL_LIST } from '../data/schools';
import { storage } from '../lib/storage';
import { useSchool } from '../contexts/SchoolContext';

export default function PreSignupModal({ school, onComplete, onClose }) {
  const { selectSchool } = useSchool();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    school: school?.id || '',
    major: '',
    interest: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 4;

  const selectedSchool = SCHOOL_LIST.find(s => s.id === form.school) || school;

  const accentStyle = selectedSchool
    ? { background: `linear-gradient(135deg, ${selectedSchool.colors.gradientFrom}, ${selectedSchool.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  const canProceed = () => {
    if (step === 1) return form.name.trim().length > 0 && form.email.includes('@');
    if (step === 2) return !!form.school;
    if (step === 3) return !!form.major;
    if (step === 4) return !!form.interest;
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    storage.addSubmission(form);
    if (form.school) selectSchool(form.school);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">You're on the list!</h2>
          <p className="text-gray-500 mb-2">
            Hey <strong>{form.name.split(' ')[0]}</strong> — thanks for signing up for early access to Stemara
            {selectedSchool ? ` at ${selectedSchool.shortName}` : ''}.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            We'll reach out to <strong>{form.email}</strong> when your school's version is ready.
          </p>
          <div className="p-3 rounded-xl mb-6"
            style={{ background: selectedSchool?.colors.bg || '#f0f4ff' }}>
            <p className="text-sm font-medium" style={{ color: selectedSchool?.colors.primary || '#003C8A' }}>
              🔥 Interest level: <strong>{INTEREST_LEVELS.find(l => l.value === form.interest)?.label}</strong>
            </p>
          </div>
          <button
            onClick={onComplete}
            className="w-full py-3 text-white font-bold rounded-xl transition-all"
            style={accentStyle}
          >
            Continue to App →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 text-white" style={accentStyle}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium opacity-80">Early Access · Step {step} of {totalSteps}</span>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-sm hover:bg-white/30 transition-colors">
              ✕
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-black">
              {step === 1 && 'Tell us about yourself'}
              {step === 2 && 'Which school do you attend?'}
              {step === 3 && 'What\'s your major or track?'}
              {step === 4 && 'How interested are you?'}
            </h2>
            <p className="text-sm opacity-75 mt-1">
              {step === 1 && 'We\'ll only use this to notify you when Stemara launches at your school.'}
              {step === 2 && 'Stemara is built differently for each institution.'}
              {step === 3 && 'Your major shapes your personalized experience.'}
              {step === 4 && 'Helps us prioritize features and outreach.'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatedStep step={step} current={1}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Your name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="First Last"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">School email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@school.edu"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-sm"
                />
              </div>
            </div>
          </AnimatedStep>

          <AnimatedStep step={step} current={2}>
            <div className="grid grid-cols-1 gap-3">
              {SCHOOL_LIST.map(s => (
                <button
                  key={s.id}
                  onClick={() => setForm(f => ({ ...f, school: s.id }))}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    form.school === s.id ? 'border-transparent' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={form.school === s.id
                    ? { background: s.colors.bg, borderColor: s.colors.primary }
                    : {}
                  }
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.location} · {s.type}</div>
                  </div>
                  {form.school === s.id && (
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: s.colors.badgeBg, color: s.colors.badgeText }}>
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </AnimatedStep>

          <AnimatedStep step={step} current={3}>
            <div className="grid grid-cols-2 gap-3">
              {MAJORS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setForm(f => ({ ...f, major: m.value }))}
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 text-center transition-all ${
                    form.major === m.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={form.major === m.value && selectedSchool
                    ? { borderColor: selectedSchool.colors.primary, background: selectedSchool.colors.bg }
                    : {}}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="font-semibold text-gray-900 text-sm">{m.label}</span>
                  <span className="text-xs text-gray-400 leading-tight">{m.desc}</span>
                </button>
              ))}
            </div>
          </AnimatedStep>

          <AnimatedStep step={step} current={4}>
            <div className="space-y-3">
              {INTEREST_LEVELS.map(level => (
                <button
                  key={level.value}
                  onClick={() => setForm(f => ({ ...f, interest: level.value }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    form.interest === level.value ? 'border-transparent' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={form.interest === level.value && selectedSchool
                    ? { background: selectedSchool.colors.bg, borderColor: selectedSchool.colors.primary }
                    : form.interest === level.value ? { background: '#eff6ff', borderColor: '#3b82f6' } : {}}
                >
                  <span className="text-3xl">{level.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-500">{level.desc}</div>
                  </div>
                </button>
              ))}
              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">Any notes? (optional)</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="What would you use Stemara for most?"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 resize-none"
                />
              </div>
            </div>
          </AnimatedStep>

          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 py-3 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={canProceed() ? accentStyle : { background: '#d1d5db' }}
            >
              {step === totalSteps ? '🚀 Join Early Access' : 'Continue →'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AnimatedStep({ step, current, children }) {
  if (step !== current) return null;
  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
