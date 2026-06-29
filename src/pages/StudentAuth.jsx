import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { SCHOOL_LIST, MAJORS } from "../data/schools";
import { useAuth } from "../context/AuthContext";
import { useSchool } from "../context/SchoolContext";
import StemaraLogo from "../components/StemaraLogo";

export default function StudentAuth({ mode = "login" }) {
  const navigate = useNavigate();
  const { loginStudent, signupStudent } = useAuth();
  const { school, selectSchool } = useSchool();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const primaryColor = school?.colors?.primary || "#4F46E5";
  const accentColor = school?.colors?.secondary || "#8B5CF6";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: school?.id || "",
    major: "",
  });

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 400));

    if (isLogin) {
      const result = loginStudent(form.email, form.password);
      if (result.success) {
        if (result.user.school) selectSchool(result.user.school);
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    } else {
      if (!form.name.trim()) { setError("Please enter your name."); setLoading(false); return; }
      if (!form.email.trim()) { setError("Please enter your email."); setLoading(false); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
      if (!form.school) { setError("Please select your school."); setLoading(false); return; }

      const result = signupStudent({
        name: form.name,
        email: form.email,
        password: form.password,
        school: form.school,
        major: form.major,
      });
      if (result.success) {
        selectSchool(form.school);
        navigate("/dashboard");
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const demoCredentials = school
    ? { email: school.demoUser.email, password: "demo123", hint: `Demo: ${school.demoUser.name}` }
    : { email: "student@unh.edu", password: "demo123", hint: "Demo: Alex (UNH)" };

  const fillDemo = () => {
    setForm(f => ({ ...f, email: demoCredentials.email, password: demoCredentials.password }));
    setError("");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}AA 60%, #0f0f1a 100%)` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <StemaraLogo className="h-10" color="#ffffff" />
          </Link>
          {school && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <span className="text-white/80 text-sm">{school.shortName}</span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                isLogin ? "text-gray-900 border-b-2" : "text-gray-400 hover:text-gray-600"
              }`}
              style={isLogin ? { borderColor: primaryColor } : {}}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                !isLogin ? "text-gray-900 border-b-2" : "text-gray-400 hover:text-gray-600"
              }`}
              style={!isLogin ? { borderColor: primaryColor } : {}}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your name"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type={isLogin ? "text" : "email"}
                    value={form.email}
                    onChange={set("email")}
                    placeholder={isLogin ? "Email or username" : "you@school.edu"}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder={isLogin ? "Your password" : "At least 6 characters"}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors pr-10"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your School</label>
                      <select
                        value={form.school}
                        onChange={e => { set("school")(e); selectSchool(e.target.value); }}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors bg-white"
                      >
                        <option value="">Select your school...</option>
                        {SCHOOL_LIST.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Area of Study <span className="text-gray-400">(optional)</span></label>
                      <select
                        value={form.major}
                        onChange={set("major")}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors bg-white"
                      >
                        <option value="">Select your major...</option>
                        {MAJORS.map(m => (
                          <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-70 hover:opacity-90 transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo shortcut */}
          {isLogin && (
            <div className="px-6 pb-5">
              <button
                onClick={fillDemo}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
              >
                <Sparkles size={12} />
                Try demo account: {demoCredentials.hint}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          By continuing, you agree to Stemara's Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
