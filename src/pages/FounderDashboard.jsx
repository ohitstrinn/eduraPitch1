import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { MOCK_SIGNUPS, MOCK_STATS } from '../data/mockData';
import { SCHOOLS } from '../data/schools';

const SCHOOL_COLORS = {
  unh: '#1b3a6b',
  snhu: '#e8530a',
  mcc: '#006633',
  ncc: '#5e35b1',
};

const INTEREST_COLORS = {
  high: '#16a34a',
  medium: '#d97706',
  low: '#6b7280',
};

export default function FounderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState('all');

  // Merge mock + real localStorage signups
  const [allSignups, setAllSignups] = useState([]);
  const [allInterests, setAllInterests] = useState([]);

  useEffect(() => {
    const realSignups = JSON.parse(localStorage.getItem('stemara_signups') || '[]');
    const realInterests = JSON.parse(localStorage.getItem('stemara_interests') || '[]');
    setAllSignups([...MOCK_SIGNUPS, ...realSignups]);
    setAllInterests(realInterests);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredSignups = filter === 'all' ? allSignups : allSignups.filter((s) => s.school === filter);

  const stats = {
    totalSignups: allSignups.length,
    totalInterests: allInterests.length,
    highInterest: allSignups.filter((s) => s.interestLevel === 'high').length + allInterests.filter((i) => i.interestLevel === 'high').length,
    bySchool: allSignups.reduce((acc, s) => { acc[s.school] = (acc[s.school] || 0) + 1; return acc; }, {}),
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-20 hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <div className="text-xl font-black text-white">Stemara</div>
          <div className="text-xs text-gray-500 mt-0.5">Founder Dashboard</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'signups', icon: '👥', label: 'Signups' },
            { id: 'interests', icon: '✨', label: 'Testing Interest' },
            { id: 'schools', icon: '🏫', label: 'Schools' },
            { id: 'pitch', icon: '🎯', label: 'Pitch Decks' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-black text-sm">
              F
            </div>
            <div>
              <div className="text-sm font-semibold">{user?.name || 'Founder'}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-gray-500 hover:text-white transition-colors px-2 py-1"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 p-6">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="text-xl font-black">Stemara · Founder</div>
          <button onClick={handleLogout} className="text-sm text-gray-400">Sign out</button>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4">
          {['overview', 'signups', 'interests', 'schools', 'pitch'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === t ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-3xl font-black mb-2">Overview</h1>
            <p className="text-gray-400 mb-8">Live data from Stemara early testing</p>

            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Signups', value: stats.totalSignups, icon: '👥', color: '#3b82f6' },
                { label: 'Testing Interests', value: stats.totalInterests + MOCK_STATS.totalSignups, icon: '✨', color: '#8b5cf6' },
                { label: 'High Interest', value: stats.highInterest, icon: '🔥', color: '#ef4444' },
                { label: 'Schools Reached', value: 4, icon: '🏫', color: '#10b981' },
              ].map((kpi) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
                >
                  <div className="text-2xl mb-2">{kpi.icon}</div>
                  <div className="text-3xl font-black" style={{ color: kpi.color }}>{kpi.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
                </motion.div>
              ))}
            </div>

            {/* School breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="font-black text-lg mb-4">Interest by school</h3>
              <div className="space-y-3">
                {Object.entries({ unh: 'UNH', snhu: 'SNHU', mcc: 'MCC', ncc: 'NCC' }).map(([id, label]) => {
                  const count = (stats.bySchool[id] || 0);
                  const total = stats.totalSignups || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-semibold">{label}</span>
                        <span className="text-gray-400">{count} signups</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          style={{ backgroundColor: SCHOOL_COLORS[id] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-black text-lg mb-4">Recent signups</h3>
              <div className="space-y-3">
                {allSignups.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: SCHOOL_COLORS[s.school] || '#4b5563' }}
                    >
                      {(s.name || s.email)?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{s.name || s.email}</div>
                      <div className="text-xs text-gray-500">{SCHOOLS[s.school]?.shortName} · {s.major}</div>
                    </div>
                    <div
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${INTEREST_COLORS[s.interestLevel] || '#6b7280'}20`,
                        color: INTEREST_COLORS[s.interestLevel] || '#6b7280',
                      }}
                    >
                      {s.interestLevel || 'signed up'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Signups table */}
        {activeTab === 'signups' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black">Student Signups</h1>
                <p className="text-gray-400">{allSignups.length} total accounts created</p>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white"
              >
                <option value="all">All schools</option>
                <option value="unh">UNH</option>
                <option value="snhu">SNHU</option>
                <option value="mcc">MCC</option>
                <option value="ncc">NCC</option>
              </select>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">School</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Major</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Interest</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tag</th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSignups.map((s, i) => (
                      <tr key={s.id || i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-sm">{s.name || 'Anonymous'}</div>
                            <div className="text-xs text-gray-500">{s.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: SCHOOL_COLORS[s.school] || '#4b5563' }}
                          >
                            {SCHOOLS[s.school]?.shortName || s.school?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{s.major || '—'}</td>
                        <td className="px-6 py-4">
                          <span
                            className="text-xs font-bold capitalize"
                            style={{ color: INTEREST_COLORS[s.interestLevel] || '#9ca3af' }}
                          >
                            {s.interestLevel || 'signed up'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {s.tag && (
                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
                              {s.tag}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {s.submittedAt || s.joinedAt
                            ? new Date(s.submittedAt || s.joinedAt).toLocaleDateString()
                            : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Testing interest */}
        {activeTab === 'interests' && (
          <div>
            <h1 className="text-3xl font-black mb-2">Testing Interest</h1>
            <p className="text-gray-400 mb-6">Pre-signup interest submissions from the landing page modal</p>

            {allInterests.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">✨</div>
                <div className="font-black text-xl mb-2">No submissions yet</div>
                <div className="text-gray-400 text-sm mb-4">
                  When students fill out the pre-signup testing modal on the landing page, their interest will appear here.
                </div>
                <Link to="/" className="text-blue-400 text-sm hover:underline">
                  Go to landing page →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {allInterests.map((interest, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{interest.name || 'Anonymous'}</div>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: SCHOOL_COLORS[interest.school] || '#4b5563' }}
                      >
                        {SCHOOLS[interest.school]?.shortName || interest.school?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{interest.email}</div>
                    <div className="flex flex-wrap gap-2">
                      {interest.major && (
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">{interest.major}</span>
                      )}
                      {interest.interestLevel && (
                        <span
                          className="text-xs font-bold px-2 py-1 rounded-lg capitalize"
                          style={{ color: INTEREST_COLORS[interest.interestLevel] || '#9ca3af', backgroundColor: `${INTEREST_COLORS[interest.interestLevel] || '#6b7280'}20` }}
                        >
                          {interest.interestLevel} interest
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schools */}
        {activeTab === 'schools' && (
          <div>
            <h1 className="text-3xl font-black mb-2">School Profiles</h1>
            <p className="text-gray-400 mb-6">Data profiles for each school partnership</p>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.values(SCHOOLS).map((s) => (
                <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: `${s.colors.primary}20` }}
                    >
                      {s.emoji}
                    </div>
                    <div>
                      <div className="font-black text-lg">{s.shortName}</div>
                      <div className="text-xs text-gray-400">{s.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.location} · {s.type}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-3 italic">"{s.tagline}"</div>
                  <div className="text-xs font-bold mb-2" style={{ color: s.colors.primary }}>
                    {s.pitchAngle}
                  </div>
                  <div className="space-y-1">
                    {s.valueProps.map((vp) => (
                      <div key={vp} className="text-xs text-gray-400 flex items-start gap-1">
                        <span style={{ color: s.colors.primary }}>•</span>
                        {vp}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                    <span>{s.studentCount} students</span>
                    <span>Founded {s.founded}</span>
                    <span>{s.website}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pitch decks */}
        {activeTab === 'pitch' && (
          <div>
            <h1 className="text-3xl font-black mb-2">Pitch Decks</h1>
            <p className="text-gray-400 mb-6">School-specific presentation materials</p>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.values(SCHOOLS).map((s) => (
                <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div
                    className="h-32 rounded-xl mb-4 flex items-center justify-center text-4xl"
                    style={{ background: `linear-gradient(135deg, ${s.colors.primary}, ${s.colors.dark || s.colors.primary})` }}
                  >
                    {s.emoji}
                  </div>
                  <div className="font-black text-lg mb-1">{s.shortName} Pitch</div>
                  <div className="text-xs text-gray-400 mb-3">{s.pitchAngle}</div>
                  <Link to="/pitch">
                    <button
                      className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                      style={{ backgroundColor: s.colors.primary }}
                    >
                      View pitch deck →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
