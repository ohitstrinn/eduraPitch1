import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const FOUNDER_EMAIL = 'founder@stemara.app';
const FOUNDER_PASSWORD = 'Stemara2025!';

export default function FounderLogin() {
  const navigate = useNavigate();
  const { loginFounder } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 700));
    if (email === FOUNDER_EMAIL && password === FOUNDER_PASSWORD) {
      loginFounder();
      navigate('/founder/dashboard');
    } else {
      setError('Invalid founder credentials.');
    }
    setLoading(false);
  };

  const handleDemo = () => {
    loginFounder();
    navigate('/founder/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-3xl p-8 border border-gray-800"
        >
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-black text-white">S</div>
            <span className="font-black text-xl text-white">Stemara</span>
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              <span className="text-yellow-400 text-xs font-semibold">Founder Access</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Founder Dashboard</h1>
            <p className="text-gray-400 text-sm">Protected access to student data, testing interest, and school analytics.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Founder email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="founder@stemara.app"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-400 text-sm bg-red-900/20 border border-red-800 px-4 py-3 rounded-xl">
                {error}
              </motion.p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard →'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <button
              onClick={handleDemo}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all text-sm border border-gray-700"
            >
              Demo Mode (skip auth) →
            </button>
            <p className="text-gray-600 text-xs text-center mt-3">
              Credentials: founder@stemara.app / Stemara2025!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
