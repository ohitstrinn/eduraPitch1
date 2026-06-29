import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getSignups, getTestingInterest, clearStore, seedDemoData } from "../data/mockStore";
import { SCHOOLS } from "../data/schools";
import TopNav from "../components/TopNav";

const SCHOOL_LABELS = { unh: "UNH", snhu: "SNHU", mcc: "MCC", ncc: "NCC", unknown: "?" };
const INTEREST_LABELS = { ready: "🟢 Ready", curious: "🟡 Curious", skeptical: "🔴 Skeptical" };
const MAJOR_ICONS = { STEM: "🔬", Business: "💼", Health: "🏥", Humanities: "📚", Education: "🎓", Undeclared: "❓", Other: "✳️" };

export default function FounderDashboard() {
  const { logout, toggleDemo, demoMode, setSchool } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [signups, setSignups] = useState([]);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setSignups(getSignups());
    setInterest(getTestingInterest());
  }

  function handleReset() {
    clearStore();
    seedDemoData();
    refresh();
  }

  const allEntries = [...signups, ...interest];
  const schoolBreakdown = Object.keys(SCHOOLS).map(id => ({
    ...SCHOOLS[id],
    signups: signups.filter(s => s.school === id).length,
    interest: interest.filter(i => i.school === id).length,
  }));
  const majorBreakdown = ["STEM", "Business", "Health", "Humanities", "Education", "Undeclared", "Other"].map(m => ({
    major: m,
    count: allEntries.filter(e => e.major === m).length,
  })).filter(m => m.count > 0);
  const readyCount = interest.filter(i => i.interest === "ready").length;

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNav />

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">Founder Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">Stemara — internal data & demo control</p>
          </div>
          <div className="flex gap-2">
            <Link to="/pitch"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-yellow-400 text-gray-950">
              Pitch Deck
            </Link>
            <Link to="/demo"
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800">
              Demo Mode
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Signups", value: signups.length, color: "#60A5FA" },
            { label: "Interest", value: interest.length, color: "#A78BFA" },
            { label: "Ready", value: readyCount, color: "#34D399" },
            { label: "Schools", value: schoolBreakdown.filter(s => s.signups + s.interest > 0).length, color: "#FBBF24" },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 rounded-2xl p-3 text-center border border-gray-800">
              <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-800 mb-6 bg-gray-900">
          {["overview", "signups", "interest", "schools"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-bold capitalize transition-all ${tab === t ? "bg-yellow-400 text-gray-950" : "text-gray-400 hover:bg-gray-800"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* School Breakdown */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <h3 className="text-sm font-bold text-white mb-4">School Interest Breakdown</h3>
              <div className="space-y-3">
                {schoolBreakdown.map(s => {
                  const total = s.signups + s.interest;
                  const max = Math.max(...schoolBreakdown.map(x => x.signups + x.interest), 1);
                  return (
                    <div key={s.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-black"
                            style={{ backgroundColor: s.colors.primary }}>
                            {s.shortName[0]}
                          </div>
                          <span className="text-sm text-gray-200 font-semibold">{s.shortName}</span>
                        </div>
                        <span className="text-xs text-gray-400">{total} entries</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${(total / max) * 100}%`, backgroundColor: s.colors.primary }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Major Breakdown */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <h3 className="text-sm font-bold text-white mb-4">Major / Track Distribution</h3>
              <div className="flex flex-wrap gap-2">
                {majorBreakdown.map(m => (
                  <div key={m.major} className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-2">
                    <span className="text-sm">{MAJOR_ICONS[m.major]}</span>
                    <span className="text-xs text-gray-200 font-semibold">{m.major}</span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full font-bold">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
              <Link to="/pitch" className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-yellow-400/50 transition-colors block">
                <div className="text-xl mb-2">🎤</div>
                <div className="font-bold text-sm text-white">Pitch Deck</div>
                <div className="text-xs text-gray-400 mt-0.5">School-specific decks</div>
              </Link>
              <Link to="/demo" className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-yellow-400/50 transition-colors block">
                <div className="text-xl mb-2">🎭</div>
                <div className="font-bold text-sm text-white">Demo Mode</div>
                <div className="text-xs text-gray-400 mt-0.5">Preview each school</div>
              </Link>
              <Link to="/directory" className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-yellow-400/50 transition-colors block">
                <div className="text-xl mb-2">🏫</div>
                <div className="font-bold text-sm text-white">School Directory</div>
                <div className="text-xs text-gray-400 mt-0.5">View all school data</div>
              </Link>
              <button onClick={handleReset}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-red-400/50 transition-colors text-left">
                <div className="text-xl mb-2">🔄</div>
                <div className="font-bold text-sm text-white">Reset Demo Data</div>
                <div className="text-xs text-gray-400 mt-0.5">Reload seed entries</div>
              </button>
            </div>
          </div>
        )}

        {/* Signups */}
        {tab === "signups" && (
          <div className="space-y-3">
            {signups.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No signups yet.</div>
            ) : (
              signups.map(s => (
                <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: SCHOOLS[s.school]?.colors?.primary || "#374151" }}>
                        {s.name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-300">{SCHOOL_LABELS[s.school] || s.school}</div>
                      <div className="text-xs text-gray-500">{MAJOR_ICONS[s.major]} {s.major}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Testing Interest */}
        {tab === "interest" && (
          <div className="space-y-3">
            {interest.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No interest submissions yet.</div>
            ) : (
              interest.map(i => (
                <div key={i.id} className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-sm text-white">{i.name}</div>
                      <div className="text-xs text-gray-400 mb-1">{i.email}</div>
                      {i.notes && <div className="text-xs text-gray-500 italic">"{i.notes}"</div>}
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="text-xs font-bold text-gray-300">{SCHOOL_LABELS[i.school] || i.school}</div>
                      <div className="text-xs">{INTEREST_LABELS[i.interest] || i.interest}</div>
                      <div className="text-xs text-gray-500">{MAJOR_ICONS[i.major]} {i.major}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Schools */}
        {tab === "schools" && (
          <div className="space-y-4">
            {Object.values(SCHOOLS).map(s => (
              <div key={s.id} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
                    style={{ backgroundColor: s.colors.primary }}>
                    {s.shortName[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white">{s.shortName}</div>
                    <div className="text-xs text-gray-400">{s.type}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-gray-400">{s.enrollment}</div>
                    <div className="text-xs text-gray-500">{s.modality}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-300 mb-2 font-medium">{s.tagline}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{s.pitch}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setSchool(s.id); navigate("/"); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg text-white hover:opacity-80"
                    style={{ backgroundColor: s.colors.primary }}>
                    View Demo →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
