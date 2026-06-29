import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, School, Brain, Download, Filter, Search, ExternalLink, Eye, Star } from "lucide-react";
import { SCHOOLS, MAJORS, INTEREST_LEVELS } from "../data/schools";
import { getStoredSignups, getStoredTestingInterest } from "../data/mockData";
import { useNavigate } from "react-router-dom";

const SCHOOL_COLORS = { unh: "#003087", snhu: "#5C2D91", mcc: "#1A3A6B", ncc: "#1B4F8A" };

function StatCard({ label, value, icon, trend, color }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            +{trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </motion.div>
  );
}

function SchoolBadge({ schoolId }) {
  const school = SCHOOLS[schoolId];
  if (!school) return <span className="text-xs text-gray-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: school.colors.primary }}>
      {school.shortName}
    </span>
  );
}

function InterestBadge({ level }) {
  const item = INTEREST_LEVELS.find(i => i.id === level);
  const colors = {
    very_interested: "bg-green-100 text-green-700",
    interested: "bg-blue-100 text-blue-700",
    curious: "bg-yellow-100 text-yellow-700",
    skeptical: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${colors[level] || "bg-gray-100 text-gray-600"}`}>
      {item?.emoji} {item?.label || level}
    </span>
  );
}

export default function FounderDashboard() {
  const signups = useMemo(() => getStoredSignups(), []);
  const testing = useMemo(() => getStoredTestingInterest(), []);
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [majorFilter, setMajorFilter] = useState("");

  // Stats
  const bySchool = Object.keys(SCHOOLS).reduce((acc, id) => {
    acc[id] = signups.filter(s => s.school === id).length;
    return acc;
  }, {});

  const byInterest = {
    very_interested: testing.filter(t => t.interest === "very_interested").length,
    interested: testing.filter(t => t.interest === "interested").length,
    curious: testing.filter(t => t.interest === "curious").length,
    skeptical: testing.filter(t => t.interest === "skeptical").length,
  };

  const hotLeads = testing.filter(t => t.interest === "very_interested");

  const filterSignups = useMemo(() => {
    return signups.filter(s => {
      const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase());
      const matchSchool = !schoolFilter || s.school === schoolFilter;
      const matchMajor = !majorFilter || s.major === majorFilter;
      return matchSearch && matchSchool && matchMajor;
    });
  }, [signups, search, schoolFilter, majorFilter]);

  const filterTesting = useMemo(() => {
    return testing.filter(t => {
      const matchSearch = !search || t.email?.toLowerCase().includes(search.toLowerCase());
      const matchSchool = !schoolFilter || t.school === schoolFilter;
      return matchSearch && matchSchool;
    });
  }, [testing, search, schoolFilter]);

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "signups", label: `Signups (${signups.length})` },
    { id: "testing", label: `Testing Interest (${testing.length})` },
    { id: "hot", label: `Hot Leads (${hotLeads.length}) 🔥` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0f0f1a] text-white px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">Stemara · Founder Dashboard</p>
            <h1 className="text-2xl font-black">Product Insights</h1>
            <p className="text-white/50 text-sm mt-1">All schools · All time</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/demo")} className="flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/15 px-3 py-2 rounded-xl transition-colors">
              <Eye size={14} /> Demo Mode
            </button>
            <button onClick={() => navigate("/pitch")} className="flex items-center gap-1.5 text-xs font-medium bg-purple-500/20 hover:bg-purple-500/30 px-3 py-2 rounded-xl transition-colors text-purple-300">
              <Star size={14} /> Pitch Deck
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Top stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Total Signups" value={signups.length} icon={<Users size={18} />} trend="12" color="#4F46E5" />
              <StatCard label="Testing Interest" value={testing.length} icon={<TrendingUp size={18} />} trend="8" color="#7C3AED" />
              <StatCard label="Schools Active" value="4" icon={<School size={18} />} color="#059669" />
              <StatCard label="Hot Leads" value={hotLeads.length} icon={<Brain size={18} />} trend="3" color="#DC2626" />
            </div>

            {/* School breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-5">Signups by School</h2>
              <div className="space-y-3">
                {Object.entries(bySchool).map(([id, count]) => {
                  const school = SCHOOLS[id];
                  const pct = Math.round((count / Math.max(signups.length, 1)) * 100);
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <div className="w-16 text-xs font-bold" style={{ color: school.colors.primary }}>{school.shortName}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: school.colors.primary }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <div className="text-xs font-semibold text-gray-600 w-8 text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interest breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-5">Interest Level Distribution</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INTEREST_LEVELS.map(level => {
                  const count = byInterest[level.id] || 0;
                  const pct = Math.round((count / Math.max(testing.length, 1)) * 100);
                  return (
                    <div key={level.id} className="text-center p-3 rounded-xl bg-gray-50">
                      <p className="text-2xl mb-1">{level.emoji}</p>
                      <p className="text-xl font-black text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500 leading-tight mt-0.5">{level.label}</p>
                      <p className="text-xs font-semibold text-indigo-500 mt-1">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Major breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">Top Majors (Signups)</h2>
              <div className="flex flex-wrap gap-2">
                {MAJORS.map(m => {
                  const count = signups.filter(s => s.major === m.id).length;
                  if (count === 0) return null;
                  return (
                    <span key={m.id} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700">
                      {m.icon} {m.label} <span className="bg-indigo-200 text-indigo-800 rounded-full px-1.5 text-xs font-bold">{count}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* SIGNUPS TAB */}
        {tab === "signups" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
              <select value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                <option value="">All Schools</option>
                {Object.values(SCHOOLS).map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
              </select>
              <select value={majorFilter} onChange={e => setMajorFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                <option value="">All Majors</option>
                {MAJORS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {filterSignups.map(s => {
                  const majorObj = MAJORS.find(m => m.id === s.major);
                  return (
                    <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: SCHOOL_COLORS[s.school] || "#4F46E5" }}>
                        {s.name?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <SchoolBadge schoolId={s.school} />
                        {majorObj && <span className="text-xs text-gray-500">{majorObj.emoji} {majorObj.label}</span>}
                      </div>
                      <p className="text-xs text-gray-400 hidden sm:block flex-shrink-0">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                  );
                })}
                {filterSignups.length === 0 && (
                  <p className="text-center text-gray-400 py-8 text-sm">No signups match your filters.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TESTING INTEREST TAB */}
        {tab === "testing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400" />
              </div>
              <select value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white">
                <option value="">All Schools</option>
                {Object.values(SCHOOLS).map(s => <option key={s.id} value={s.id}>{s.shortName}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {filterTesting.map(t => {
                  const majorObj = MAJORS.find(m => m.id === t.major);
                  return (
                    <div key={t.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{t.email}</p>
                        {t.note && <p className="text-xs text-gray-500 mt-0.5 italic">"{t.note}"</p>}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                        <SchoolBadge schoolId={t.school} />
                        {majorObj && <span className="text-xs text-gray-400">{majorObj.emoji}</span>}
                        <InterestBadge level={t.interest} />
                      </div>
                    </div>
                  );
                })}
                {filterTesting.length === 0 && (
                  <p className="text-center text-gray-400 py-8 text-sm">No entries match your filters.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* HOT LEADS TAB */}
        {tab === "hot" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
              🔥 These users said <strong>"Definitely want to try it"</strong> — highest conversion potential. Reach out first.
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {hotLeads.map(t => {
                  const majorObj = MAJORS.find(m => m.id === t.major);
                  const school = SCHOOLS[t.school];
                  return (
                    <div key={t.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: school?.colors?.primary || "#4F46E5" }}>
                        {t.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{t.email}</p>
                        {t.note && <p className="text-xs text-gray-500 mt-0.5 italic">"{t.note}"</p>}
                        <div className="flex items-center gap-2 mt-1.5">
                          {school && <span className="text-xs text-white font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: school.colors.primary }}>{school.shortName}</span>}
                          {majorObj && <span className="text-xs text-gray-500">{majorObj.icon} {majorObj.label}</span>}
                        </div>
                      </div>
                      <a href={`mailto:${t.email}`} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex-shrink-0">
                        <ExternalLink size={12} /> Email
                      </a>
                    </div>
                  );
                })}
                {hotLeads.length === 0 && (
                  <p className="text-center text-gray-400 py-8 text-sm">No hot leads yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
