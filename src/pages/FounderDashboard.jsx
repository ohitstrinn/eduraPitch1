import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/storage';
import { SCHOOLS, MAJORS, INTEREST_LEVELS } from '../data/schools';

const SCHOOL_COLORS = {
  unh: { bg: '#EBF1FF', text: '#003C8A', accent: '#003C8A' },
  snhu: { bg: '#FFF0E8', text: '#D94F00', accent: '#D94F00' },
  mcc: { bg: '#E8F7EF', text: '#005C3E', accent: '#005C3E' },
  ncc: { bg: '#E8F1FC', text: '#1A3F6F', accent: '#1A3F6F' },
};

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

export default function FounderDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterSchool, setFilterSchool] = useState('all');
  const [filterInterest, setFilterInterest] = useState('all');

  const submissions = storage.getSubmissions();
  const signups = storage.getSignups();

  // Analytics
  const schoolCounts = Object.keys(SCHOOLS).reduce((acc, id) => ({
    ...acc,
    [id]: submissions.filter(s => s.school === id).length,
  }), {});

  const majorCounts = MAJORS.reduce((acc, m) => ({
    ...acc,
    [m.value]: submissions.filter(s => s.major === m.value).length,
  }), {});

  const interestCounts = {
    very: submissions.filter(s => s.interest === 'very').length,
    somewhat: submissions.filter(s => s.interest === 'somewhat').length,
    curious: submissions.filter(s => s.interest === 'curious').length,
  };

  const maxSchoolCount = Math.max(...Object.values(schoolCounts), 1);

  const filtered = submissions
    .filter(s => filterSchool === 'all' || s.school === filterSchool)
    .filter(s => filterInterest === 'all' || s.interest === filterInterest)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const topMajor = Object.entries(majorCounts).sort((a, b) => b[1] - a[1])[0];
  const topSchool = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-gray-900">S</div>
              <span className="font-black text-white text-lg">Stemara</span>
            </div>
            <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold rounded-full">
              Founder Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/demo')}
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800">
              Demo Mode
            </button>
            <button onClick={() => navigate('/pitch')}
              className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800">
              Pitch Deck
            </button>
            <button onClick={() => { logout(); navigate('/'); }}
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Interest Submissions', value: submissions.length, icon: '📝', color: 'from-blue-600 to-blue-500' },
            { label: 'Account Signups', value: signups.length, icon: '👤', color: 'from-green-600 to-green-500' },
            { label: 'Highly Interested', value: interestCounts.very, icon: '🔥', color: 'from-orange-600 to-orange-500' },
            { label: 'Schools Active', value: Object.values(schoolCounts).filter(c => c > 0).length, icon: '🏫', color: 'from-purple-600 to-purple-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-5 bg-gradient-to-br ${stat.color}`}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black">
                <AnimatedNumber value={stat.value} />
              </div>
              <div className="text-white/80 text-xs mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6 border border-gray-800">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'submissions', label: '📝 Submissions' },
            { id: 'schools', label: '🏫 By School' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* School Interest Breakdown */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="font-bold text-white mb-4">Interest by School</h3>
              <div className="space-y-3">
                {Object.entries(SCHOOLS).map(([id, school]) => {
                  const count = schoolCounts[id];
                  const pct = Math.round((count / Math.max(submissions.length, 1)) * 100);
                  const isTop = id === topSchool?.[0];
                  return (
                    <div key={id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-300">
                          {school.emoji} {school.shortName}
                          {isTop && <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">Top</span>}
                        </span>
                        <span className="text-white font-bold">{count} <span className="text-gray-500 text-xs font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxSchoolCount) * 100}%` }}
                          transition={{ duration: 0.7, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(to right, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interest Levels */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="font-bold text-white mb-4">Interest Level Distribution</h3>
              <div className="space-y-4">
                {INTEREST_LEVELS.map(level => {
                  const count = interestCounts[level.value];
                  const pct = Math.round((count / Math.max(submissions.length, 1)) * 100);
                  return (
                    <div key={level.value} className="flex items-center gap-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{level.label}</span>
                          <span className="text-white font-bold">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7 }}
                            className={`h-full rounded-full ${level.value === 'very' ? 'bg-orange-500' : level.value === 'somewhat' ? 'bg-blue-500' : 'bg-gray-500'}`}
                          />
                        </div>
                      </div>
                      <span className="text-gray-500 text-xs w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Major Distribution */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 md:col-span-2">
              <h3 className="font-bold text-white mb-4">Major / Track Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MAJORS.map(m => {
                  const count = majorCounts[m.value];
                  const isTop = m.value === topMajor?.[0];
                  return (
                    <div key={m.value} className={`p-3 rounded-xl border ${isTop ? 'border-yellow-500/40 bg-yellow-500/10' : 'border-gray-800 bg-gray-800/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{m.emoji}</span>
                        {isTop && <span className="text-xs text-yellow-400">Top</span>}
                      </div>
                      <div className="text-2xl font-black text-white">{count}</div>
                      <div className="text-xs text-gray-400">{m.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 md:col-span-2">
              <h3 className="font-bold text-white mb-4">🔑 Founder Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    icon: '🏆',
                    title: 'Strongest School',
                    value: topSchool ? SCHOOLS[topSchool[0]]?.name : 'N/A',
                    sub: `${topSchool?.[1] || 0} submissions — prioritize this school for outreach`,
                  },
                  {
                    icon: '🔥',
                    title: 'High-Intent Rate',
                    value: `${Math.round((interestCounts.very / Math.max(submissions.length, 1)) * 100)}%`,
                    sub: `${interestCounts.very} students marked "Very Interested"`,
                  },
                  {
                    icon: '📚',
                    title: 'Top Major Track',
                    value: topMajor ? MAJORS.find(m => m.value === topMajor[0])?.label : 'N/A',
                    sub: `${topMajor?.[1] || 0} students — tailor onboarding for this track`,
                  },
                ].map((insight, i) => (
                  <div key={i} className="p-4 bg-gray-800 rounded-xl">
                    <div className="text-2xl mb-2">{insight.icon}</div>
                    <div className="text-xs text-gray-500 mb-0.5">{insight.title}</div>
                    <div className="font-bold text-white text-sm mb-1">{insight.value}</div>
                    <div className="text-xs text-gray-400">{insight.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <select
                value={filterSchool}
                onChange={e => setFilterSchool(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none"
              >
                <option value="all">All Schools</option>
                {Object.entries(SCHOOLS).map(([id, s]) => (
                  <option key={id} value={id}>{s.emoji} {s.shortName}</option>
                ))}
              </select>
              <select
                value={filterInterest}
                onChange={e => setFilterInterest(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white focus:outline-none"
              >
                <option value="all">All Interest Levels</option>
                {INTEREST_LEVELS.map(l => (
                  <option key={l.value} value={l.value}>{l.emoji} {l.label}</option>
                ))}
              </select>
              <span className="px-4 py-2 text-gray-500 text-sm self-center">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {filtered.map((sub, i) => {
                const school = SCHOOLS[sub.school];
                const major = MAJORS.find(m => m.value === sub.major);
                const interestLevel = INTEREST_LEVELS.find(l => l.value === sub.interest);
                const sc = SCHOOL_COLORS[sub.school] || SCHOOL_COLORS.unh;
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${school?.colors.gradientFrom}, ${school?.colors.gradientTo})` }}>
                          {sub.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{sub.name}</p>
                          <p className="text-xs text-gray-500">{sub.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: sc.bg, color: sc.text }}>
                          {school?.emoji} {school?.shortName}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-300 rounded-full">
                          {major?.emoji} {major?.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          sub.interest === 'very' ? 'bg-orange-900/50 text-orange-400' :
                          sub.interest === 'somewhat' ? 'bg-blue-900/50 text-blue-400' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {interestLevel?.emoji} {interestLevel?.label}
                        </span>
                      </div>
                    </div>
                    {sub.note && (
                      <div className="mt-3 pl-12">
                        <p className="text-sm text-gray-400 italic">"{sub.note}"</p>
                      </div>
                    )}
                    <div className="mt-2 pl-12 flex items-center gap-3">
                      <span className="text-xs text-gray-600">
                        {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'schools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(SCHOOLS).map(([id, school]) => {
              const schoolSubs = submissions.filter(s => s.school === id);
              const highIntent = schoolSubs.filter(s => s.interest === 'very').length;
              const majorBreakdown = MAJORS.map(m => ({
                ...m,
                count: schoolSubs.filter(s => s.major === m.value).length,
              })).filter(m => m.count > 0).sort((a, b) => b.count - a.count);

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 text-white" style={{ background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{school.emoji}</span>
                        <div>
                          <h3 className="font-bold">{school.shortName}</h3>
                          <p className="text-white/70 text-xs">{school.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black">{schoolSubs.length}</div>
                        <div className="text-white/70 text-xs">submissions</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-gray-800 rounded-xl text-center">
                        <div className="font-black text-white">{highIntent}</div>
                        <div className="text-gray-500 text-xs">High intent</div>
                      </div>
                      <div className="p-2 bg-gray-800 rounded-xl text-center">
                        <div className="font-black text-white">
                          {highIntent > 0 ? `${Math.round((highIntent / schoolSubs.length) * 100)}%` : '0%'}
                        </div>
                        <div className="text-gray-500 text-xs">🔥 rate</div>
                      </div>
                    </div>
                    {majorBreakdown.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Top majors</p>
                        <div className="flex flex-wrap gap-1">
                          {majorBreakdown.slice(0, 4).map(m => (
                            <span key={m.value} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-lg">
                              {m.emoji} {m.label} ({m.count})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => { setActiveTab('submissions'); setFilterSchool(id); }}
                      className="w-full py-2 text-xs font-medium text-gray-400 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      View all {school.shortName} submissions →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
