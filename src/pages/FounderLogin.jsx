import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StemaraLogo from "../components/StemaraLogo";

export default function FounderLogin() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginFounder } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = loginFounder(password);
    if (result.success) {
      navigate("/founder/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#0f0f1a]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/">
            <StemaraLogo className="h-10" color="#ffffff" />
          </Link>
          <p className="text-white/40 text-sm mt-3">Founder Access</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Lock size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Protected Area</p>
              <p className="text-white/40 text-xs">Founder dashboard access only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Founder Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter founder password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={!password.trim() || loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-all"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <> Access Dashboard <ArrowRight size={16} /> </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => setPassword("stemara-founder-2025")}
              className="w-full flex items-center justify-center gap-2 text-xs text-white/20 hover:text-white/40 transition-colors"
            >
              <Sparkles size={10} /> Demo: fill password
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-white/30 text-xs hover:text-white/50 transition-colors">
            ← Back to Stemara
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
