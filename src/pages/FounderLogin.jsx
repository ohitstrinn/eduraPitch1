import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StemaraLogo from "../components/StemaraLogo";

const FOUNDER_CREDS = {
  email: "founder@stemara.app",
  password: "Stemara2025!",
};

export default function FounderLogin() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (form.email === FOUNDER_CREDS.email && form.password === FOUNDER_CREDS.password) {
        login("founder", { name: "Founder", email: form.email });
        navigate("/founder/dashboard");
      } else {
        setError("Invalid founder credentials.");
      }
    }, 600);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <StemaraLogo size="lg" white />
            <p className="text-gray-400 text-sm mt-2">Founder & Admin Access</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Protected Access</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="founder@stemara.app"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-xs bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-gray-950 text-sm bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 transition"
              >
                {loading ? "Verifying…" : "Access Founder Dashboard →"}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                Demo credentials:<br />
                <span className="text-gray-300 font-mono">founder@stemara.app</span> /{" "}
                <span className="text-gray-300 font-mono">Stemara2025!</span>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            <Link to="/" className="text-gray-400 hover:text-white">← Back to Stemara</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
