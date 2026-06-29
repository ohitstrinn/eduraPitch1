import { useState } from "react";
import { useApp } from "../context/AppContext";
import { SCHOOL_LIST } from "../data/schools";
import TopNav from "../components/TopNav";

export default function SchoolDirectory() {
  const { setSchool } = useApp();
  const [selected, setSelected] = useState(SCHOOL_LIST[0].id);

  const s = SCHOOL_LIST.find(x => x.id === selected);

  return (
    <div className="min-h-screen bg-gray-950">
      <TopNav />

      <div className="px-5 py-6 max-w-lg mx-auto">
        <div className="mb-5">
          <h1 className="text-xl font-black text-white">School Directory</h1>
          <p className="text-sm text-gray-400 mt-1">Data profiles for all Stemara target schools.</p>
        </div>

        {/* School Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {SCHOOL_LIST.map(sc => (
            <button
              key={sc.id}
              onClick={() => { setSelected(sc.id); setSchool(sc.id); }}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={selected === sc.id ? { backgroundColor: sc.colors.primary, color: "white" } : { backgroundColor: "#1F2937", color: "#9CA3AF" }}
            >
              {sc.shortName}
            </button>
          ))}
        </div>

        {s && (
          <div className="space-y-4">
            {/* Header Card */}
            <div className="rounded-2xl overflow-hidden">
              <div className="px-5 py-5 text-white"
                style={{ background: `linear-gradient(135deg, ${s.colors.primary}, ${s.colors.primary}CC)` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-black">{s.name}</h2>
                    <p className="text-white/70 text-sm mt-0.5">{s.shortName} · {s.location}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg"
                    style={{ backgroundColor: s.colors.secondary + "30", color: s.colors.secondary, border: `2px solid ${s.colors.secondary}` }}>
                    {s.shortName[0]}
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{s.tagline}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Type", value: s.type },
                { label: "Location", value: s.location },
                { label: "Enrollment", value: s.enrollment },
                { label: "Modality", value: s.modality },
              ].map(item => (
                <div key={item.label} className="bg-gray-900 rounded-xl p-3 border border-gray-800">
                  <div className="text-xs text-gray-500 mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Brand Colors */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Brand Colors</h3>
              <div className="flex gap-3">
                {[
                  { label: "Primary", color: s.colors.primary },
                  { label: "Secondary", color: s.colors.secondary },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: c.color }} />
                    <div>
                      <div className="text-xs font-semibold text-white">{c.label}</div>
                      <div className="text-xs text-gray-400 font-mono">{c.color}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Stemara Pitch</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{s.pitch}</p>
            </div>

            {/* Value Props */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Value Propositions</h3>
              <div className="space-y-2">
                {s.valueProps.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: s.colors.primary, color: "white" }}>✓</span>
                    <span className="text-sm text-gray-300">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Programs */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Programs / Tracks</h3>
              <div className="flex flex-wrap gap-1.5">
                {s.programs.map(p => (
                  <span key={p} className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Pitch Points */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Pitch Angle: {s.pitchAngle}</h3>
              <div className="space-y-2">
                {s.pitchPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="font-bold mt-0.5" style={{ color: s.colors.secondary }}>→</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messaging Note */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: s.colors.primary + "20", borderColor: s.colors.primary + "40", border: "1px solid" }}>
              <p className="text-xs text-gray-300 leading-relaxed">
                <span className="font-bold" style={{ color: s.colors.secondary }}>Demo note: </span>
                {s.demoNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
