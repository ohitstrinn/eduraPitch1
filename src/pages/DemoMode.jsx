import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { SCHOOL_LIST } from "../data/schools";
import TopNav from "../components/TopNav";

export default function DemoMode() {
  const { setSchool, school, login, toggleDemo } = useApp();
  const navigate = useNavigate();

  function launchSchoolDemo(id) {
    setSchool(id);
    toggleDemo(true);
    login("student", { name: "Demo Student", email: "demo@stemara.app", school: id });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNav />

      <div className="px-5 py-6 max-w-lg mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-yellow-400 text-gray-950 font-bold px-2 py-0.5 rounded-full">DEMO MODE</span>
          </div>
          <h1 className="text-2xl font-black text-white">School Demo Preview</h1>
          <p className="text-sm text-gray-400 mt-1">
            Launch any school's experience. Demo mode shows the full student flow with school-specific theming.
          </p>
        </div>

        <div className="space-y-4">
          {SCHOOL_LIST.map(s => (
            <div key={s.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              {/* School Header */}
              <div className="px-5 py-4 flex items-center gap-4"
                style={{ background: `linear-gradient(135deg, ${s.colors.primary}, ${s.colors.primary}CC)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                  style={{ backgroundColor: s.colors.secondary + "30", border: `2px solid ${s.colors.secondary}` }}>
                  {s.shortName[0]}
                </div>
                <div className="flex-1">
                  <div className="font-black text-white">{s.shortName}</div>
                  <div className="text-xs text-white/70">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60">{s.type}</div>
                  <div className="text-xs text-white/60">{s.enrollment}</div>
                </div>
              </div>

              {/* Details */}
              <div className="px-5 py-4">
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{s.tagline}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {s.valueProps.map(v => (
                    <span key={v} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-medium">
                      {v}
                    </span>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sample Programs</p>
                  <div className="flex flex-wrap gap-1">
                    {s.programs.slice(0, 5).map(p => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-400">
                        {p}
                      </span>
                    ))}
                    <span className="text-xs px-2 py-0.5 rounded-full border border-gray-700 text-gray-500">
                      +{s.programs.length - 5} more
                    </span>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-xl p-3 mb-4 text-xs text-gray-400 leading-relaxed">
                  <span className="text-yellow-400 font-semibold">Pitch angle: </span>
                  {s.pitchAngle} — {s.demoNote}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => launchSchoolDemo(s.id)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: s.colors.primary }}
                  >
                    Launch {s.shortName} Demo →
                  </button>
                  <button
                    onClick={() => { setSchool(s.id); navigate("/pitch"); }}
                    className="px-3 py-2.5 rounded-xl text-sm border border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Pitch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-400 mb-3">
            Demo mode shows the complete student experience — theming, school messaging, study tools, and AI chat.
          </p>
          <button
            onClick={() => navigate("/founder/dashboard")}
            className="text-sm font-bold text-yellow-400 hover:text-yellow-300"
          >
            ← Back to Founder Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
