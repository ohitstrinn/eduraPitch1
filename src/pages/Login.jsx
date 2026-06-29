import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { saveSignup } from "../data/mockStore";
import StemaraLogo from "../components/StemaraLogo";
import SchoolBadge from "../components/SchoolBadge";
import PreSignupModal from "../components/PreSignupModal";

export default function Login() {
  const { school, login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const primary = school?.colors?.primary || "#0F172A";
  const secondary = school?.colors?.secondary || "#F59E0B";
  const bg = school?.colors?.bg || "#F8FAFC";

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (form.email && form.password) {
        login("student", { name: form.name || form.email.split("@")[0], email: form.email, school: school?.id });
        navigate("/dashboard");
      } else {
        setError("Please fill in all fields.");
      }
    }, 700);
  }

  function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (form.name && form.email && form.password) {
        saveSignup({ name: form.name, email: form.email, school: school?.id || "unknown", role: "student" });
        login("student", { name: form.name, email: form.email, school: school?.id });
        navigate("/dashboard");
      } else {
        setError("Please fill in all fields.");
      }
    }, 700);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg }}>
      <div className="px-6 pt-8 pb-6 text-center" style={{ backgroundColor: primary }}>
        <StemaraLogo size="lg" white />
        {school && (
          <div className="mt-3">
            <SchoolBadge size="md" />
          </div>
        )}
        <p className="text-white/70 text-sm mt-2">
          {school ? school.tagline : "AI-powered study support"}
        </p>
      </div>

      <div className="flex-1 px-6 py-8 max-w-sm mx-auto w-full">
        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {["login", "signup"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${mode === m ? "text-white" : "text-gray-500 bg-white hover:bg-gray-50"}`}
              style={mode === m ? { backgroundColor: primary } : {}}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => update("name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white"
                style={{ "--tw-ring-color": primary + "40" }}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              placeholder={school ? `your@${school.shortName.toLowerCase()}.edu` : "you@school.edu"}
              value={form.email}
              onChange={e => update("email", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => update("password", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-white"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
            style={{ backgroundColor: primary }}
          >
            {loading ? "Loading…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:opacity-80"
          style={{ borderColor: primary, color: primary }}
        >
          Join Early Access Testing →
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Are you a founder or administrator?{" "}
          <Link to="/founder" className="font-semibold" style={{ color: primary }}>
            Founder login →
          </Link>
        </p>

        {!school && (
          <p className="text-center text-xs text-gray-400 mt-3">
            <Link to="/" className="underline">← Select your school</Link>
          </p>
        )}
      </div>

      {showModal && (
        <PreSignupModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); navigate("/dashboard"); }}
        />
      )}
    </div>
  );
}
