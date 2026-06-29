import { useState } from "react";
import { useApp } from "../context/AppContext";
import { SCHOOLS, MAJORS, INTEREST_LEVELS } from "../data/schools";
import { saveTestingInterest } from "../data/mockStore";

export default function PreSignupModal({ onClose, onSuccess }) {
  const { school } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    school: school?.id || "",
    major: "",
    interest: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    saveTestingInterest(form);
    setSubmitted(true);
    setTimeout(() => {
      onSuccess?.(form);
    }, 1800);
  }

  const primary = school?.colors?.primary || "#0F172A";
  const secondary = school?.colors?.secondary || "#F59E0B";

  if (submitted) {
    return (
      <ModalShell onClose={onClose}>
        <div className="text-center py-8 px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: secondary }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: primary }}>You're on the list!</h3>
          <p className="text-gray-600 text-sm">We'll reach out with early access. Thanks for your interest in Stemara.</p>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="px-6 pb-6">
        <div className="flex items-center gap-1 mb-5">
          {[1, 2].map(n => (
            <div key={n} className="h-1 flex-1 rounded-full transition-all"
              style={{ backgroundColor: step >= n ? primary : "#E2E8F0" }} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: primary }}>Join Early Access</h3>
              <p className="text-sm text-gray-500 mt-1">Get early access to Stemara — personalized AI study support built for your school.</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": primary }}
                required
              />
              <input
                type="email"
                placeholder="Your school email"
                value={form.email}
                onChange={e => update("email", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                required
              />
            </div>
            <button
              onClick={() => form.name && form.email && setStep(2)}
              className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
              style={{ backgroundColor: primary }}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold" style={{ color: primary }}>Tell us about you</h3>
              <p className="text-sm text-gray-500 mt-1">Help us personalize your Stemara experience.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Your School</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(SCHOOLS).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => update("school", s.id)}
                    className={`text-xs py-2 px-2 rounded-lg border-2 font-medium transition-all ${form.school === s.id ? "text-white" : "bg-white text-gray-600 border-gray-200"}`}
                    style={form.school === s.id ? { backgroundColor: s.colors.primary, borderColor: s.colors.primary } : {}}
                  >
                    {s.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Your Major / Track</label>
              <div className="flex flex-wrap gap-2">
                {MAJORS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => update("major", m)}
                    className={`text-xs py-1.5 px-3 rounded-full border font-medium transition-all ${form.major === m ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200"}`}
                    style={form.major === m ? { backgroundColor: primary } : {}}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Interest Level</label>
              <div className="space-y-2">
                {INTEREST_LEVELS.map(i => (
                  <button
                    key={i.value}
                    type="button"
                    onClick={() => update("interest", i.value)}
                    className={`w-full text-left text-sm py-2 px-3 rounded-lg border transition-all ${form.interest === i.value ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200"}`}
                    style={form.interest === i.value ? { backgroundColor: primary } : {}}
                  >
                    {i.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                Back
              </button>
              <button
                type="submit"
                disabled={!form.school || !form.major || !form.interest}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ backgroundColor: primary }}
              >
                Join Waitlist
              </button>
            </div>
          </form>
        )}
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4"
      onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <span className="font-bold text-gray-800 text-sm">Stemara Early Access</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
