import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { SCHOOLS, SCHOOL_LIST, MAJORS, INTEREST_LEVELS } from "../data/schools";
import { saveTestingInterest } from "../data/mockData";

const STEPS = ["school", "major", "interest", "contact", "done"];

export default function PreSignupModal({ onClose, onSignup }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ school: "", major: "", interest: "", email: "" });
  const [emailError, setEmailError] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (STEPS[step] === "contact") {
      if (!data.email.trim() || !data.email.includes("@")) {
        setEmailError("Please enter a valid email address.");
        return;
      }
      setEmailError("");
      saveTestingInterest({
        email: data.email,
        school: data.school,
        major: data.major,
        interest: data.interest,
      });
    }
    setStep(s => s + 1);
  };

  const canNext = () => {
    if (STEPS[step] === "school") return !!data.school;
    if (STEPS[step] === "major") return !!data.major;
    if (STEPS[step] === "interest") return !!data.interest;
    if (STEPS[step] === "contact") return !!data.email;
    return true;
  };

  const schoolObj = SCHOOLS[data.school];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5">
              {step === 0 && "Which school do you attend?"}
              {step === 1 && "What's your area of study?"}
              {step === 2 && "How interested are you?"}
              {step === 3 && "Where should we send updates?"}
              {step === 4 && "You're in! 🎉"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-4 min-h-[280px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="school" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-3">
                {SCHOOL_LIST.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setData(d => ({ ...d, school: s.id }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      data.school === s.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: s.colors.primary }}>
                      {s.shortName.slice(0, 2)}
                    </div>
                    <p className="font-semibold text-sm text-gray-900">{s.shortName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-tight">{s.type}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="major" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-3 gap-2">
                {MAJORS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setData(d => ({ ...d, major: m.id }))}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      data.major === m.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{m.label}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="interest" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                {INTEREST_LEVELS.map(i => (
                  <button
                    key={i.id}
                    onClick={() => setData(d => ({ ...d, interest: i.id }))}
                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                      data.interest === i.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{i.emoji}</span>
                    <span className="font-medium text-gray-800">{i.label}</span>
                    {data.interest === i.id && <CheckCircle size={18} className="ml-auto text-indigo-500" />}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {schoolObj && (
                  <div className="p-3 rounded-xl text-sm font-medium text-white"
                    style={{ background: `linear-gradient(135deg, ${schoolObj.colors.primary}, ${schoolObj.colors.primary}dd)` }}>
                    Great! We'll send you {schoolObj.shortName}-specific updates.
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => { setData(d => ({ ...d, email: e.target.value })); setEmailError(""); }}
                    placeholder="you@school.edu"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-gray-900 transition-colors"
                    autoFocus
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
                <p className="text-xs text-gray-400">We respect your inbox. No spam, just meaningful updates when Stemara launches at your school.</p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
                >
                  <CheckCircle size={40} className="text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-gray-500 mb-2">
                  We'll reach out to <strong>{data.email}</strong> with early access for {schoolObj?.shortName || "your school"}.
                </p>
                <p className="text-sm text-gray-400">In the meantime, explore what Stemara can do.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step < STEPS.length - 1 && (
          <div className="px-6 pb-6 flex items-center justify-between">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-40 hover:opacity-90 transition-all shadow-sm"
            >
              {step === 3 ? "Submit" : "Continue"} <ChevronRight size={16} />
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={() => { onSignup?.(); onClose(); }}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all"
            >
              Create My Account
            </button>
            <button onClick={onClose} className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
              Later
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
