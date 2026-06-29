import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCHOOL_LIST } from '../data/schools';
import { MAJORS, INTEREST_LEVELS } from '../data/mockData';

export default function PreSignupModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    school: '',
    major: '',
    interestLevel: '',
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const entry = {
      ...formData,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      tag: 'testing-interest',
    };
    const existing = JSON.parse(localStorage.getItem('stemara_interests') || '[]');
    localStorage.setItem('stemara_interests', JSON.stringify([...existing, entry]));
    setSubmitted(true);
    onSubmit?.(entry);
  };

  const canAdvance = () => {
    if (step === 1) return !!formData.school;
    if (step === 2) return !!formData.major;
    if (step === 3) return !!formData.interestLevel;
    if (step === 4) return formData.name.trim().length > 1 && formData.email.includes('@');
    return false;
  };

  const selectedSchool = SCHOOL_LIST.find((s) => s.id === formData.school);

  if (submitted) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="text-center py-8 px-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h2>
          <p className="text-gray-600 mb-6">
            Thanks {formData.name}! We'll reach out about early access for{' '}
            <strong>{selectedSchool?.shortName}</strong> soon.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-white font-semibold text-lg transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: selectedSchool?.colors?.primary || '#1b3a6b' }}
          >
            Explore Stemara
          </button>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">✨</div>
          <h2 className="text-xl font-bold text-gray-900">Join early testing</h2>
          <p className="text-sm text-gray-500 mt-1">Takes 30 seconds. No commitment.</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  s <= step
                    ? (selectedSchool?.colors?.primary || '#1b3a6b')
                    : '#e5e7eb',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepPanel key="school">
              <StepLabel>Which school do you attend?</StepLabel>
              <div className="grid grid-cols-2 gap-3">
                {SCHOOL_LIST.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect('school', s.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.school === s.id ? 'border-current shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={formData.school === s.id ? { borderColor: s.colors.primary, backgroundColor: s.colors.bg } : {}}
                  >
                    <div className="text-xl mb-1">{s.emoji}</div>
                    <div className="font-semibold text-sm" style={formData.school === s.id ? { color: s.colors.primary } : {}}>
                      {s.shortName}
                    </div>
                    <div className="text-xs text-gray-500">{s.type}</div>
                  </button>
                ))}
              </div>
            </StepPanel>
          )}

          {step === 2 && (
            <StepPanel key="major">
              <StepLabel>What's your major or track?</StepLabel>
              <div className="space-y-2">
                {MAJORS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect('major', m.label)}
                    className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                      formData.major === m.label ? 'border-current' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={
                      formData.major === m.label
                        ? { borderColor: selectedSchool?.colors?.primary, backgroundColor: selectedSchool?.colors?.bg }
                        : {}
                    }
                  >
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{m.label}</div>
                      <div className="text-xs text-gray-500">{m.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </StepPanel>
          )}

          {step === 3 && (
            <StepPanel key="interest">
              <StepLabel>How interested are you in early access?</StepLabel>
              <div className="space-y-3">
                {INTEREST_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleSelect('interestLevel', level.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.interestLevel === level.id ? 'border-current shadow-sm' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={
                      formData.interestLevel === level.id
                        ? { borderColor: selectedSchool?.colors?.primary, backgroundColor: selectedSchool?.colors?.bg }
                        : {}
                    }
                  >
                    <div className="font-semibold text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-500">{level.description}</div>
                  </button>
                ))}
              </div>
            </StepPanel>
          )}

          {step === 4 && (
            <StepPanel key="contact">
              <StepLabel>Last step — how do we reach you?</StepLabel>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleSelect('name', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-current transition-colors"
                  style={{ focusBorderColor: selectedSchool?.colors?.primary }}
                />
                <input
                  type="email"
                  placeholder="School email (e.g. you@unh.edu)"
                  value={formData.email}
                  onChange={(e) => handleSelect('email', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-400">
                  No spam. Just early access updates for {selectedSchool?.name}.
                </p>
              </div>
            </StepPanel>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="flex-1 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{ backgroundColor: selectedSchool?.colors?.primary || '#1b3a6b' }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance()}
              className="flex-1 py-3 rounded-xl text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{ backgroundColor: selectedSchool?.colors?.primary || '#1b3a6b' }}
            >
              Join early access
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-10"
        >
          ×
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function StepPanel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function StepLabel({ children }) {
  return <h3 className="font-semibold text-gray-900 mb-3">{children}</h3>;
}
