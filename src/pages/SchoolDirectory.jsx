import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, BookOpen, ExternalLink, ChevronDown, ChevronUp, Building, Layers, Star } from "lucide-react";
import { SCHOOLS, SCHOOL_LIST } from "../data/schools";
import { useSchool } from "../context/SchoolContext";
import ChatWidget from "../components/ChatWidget";

function ProgramBadge({ program, color }) {
  return (
    <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: `${color}15`, color }}>
      {program}
    </span>
  );
}

function SchoolProfile({ school, expanded, onToggle }) {
  const isSelected = school.id === useSchool().school?.id;

  return (
    <motion.div
      layout
      className={`bg-white rounded-2xl border-2 overflow-hidden transition-colors ${isSelected ? "" : "border-gray-100"}`}
      style={isSelected ? { borderColor: school.colors.primary } : {}}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${school.colors.primary}, ${school.colors.primary}BB)` }}>
          {school.shortName.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-900">{school.name}</p>
            {isSelected && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: school.colors.primary }}>
                Your School
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{school.type} · {school.location}</p>
        </div>
        <div className="flex-shrink-0">
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </button>

      {/* Quick stats */}
      <div className="flex border-t border-gray-50 divide-x divide-gray-50">
        {[
          { label: "Students", value: school.stats.students },
          { label: "Programs", value: school.stats.programs },
          { label: "Retention", value: school.stats.retention },
        ].map(stat => (
          <div key={stat.label} className="flex-1 py-3 text-center">
            <p className="text-sm font-black" style={{ color: school.colors.primary }}>{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-5 border-t border-gray-50">
              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Location</p>
                    <p className="text-gray-500">{school.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Layers size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Modality</p>
                    <p className="text-gray-500">{school.modality}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Founded</p>
                    <p className="text-gray-500">{school.founded}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Enrollment</p>
                    <p className="text-gray-500">{school.enrollment}</p>
                  </div>
                </div>
              </div>

              {/* Value props for Stemara */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">How Stemara helps {school.shortName} students</p>
                <div className="space-y-2">
                  {school.valueProps.map((vp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: school.colors.primary }} />
                      <p className="text-sm text-gray-600 leading-relaxed">{vp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Programs */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                  <BookOpen size={12} /> Programs & Schools
                </p>
                <div className="flex flex-wrap gap-2">
                  {school.programs.map(p => <ProgramBadge key={p} program={p} color={school.colors.primary} />)}
                </div>
              </div>

              {/* Pitch excerpt */}
              <div className="p-3 rounded-xl text-sm"
                style={{ backgroundColor: `${school.colors.primary}10`, borderLeft: `3px solid ${school.colors.primary}` }}>
                <p className="text-gray-700 leading-relaxed italic">{school.pitch}</p>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white hover:opacity-90 transition-all"
                  style={{ backgroundColor: school.colors.primary }}>
                  View {school.shortName} Experience →
                </button>
                <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: `${school.colors.primary}40` }}>
                  <ExternalLink size={13} /> Website
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SchoolDirectory() {
  const { school: selectedSchool, selectSchool } = useSchool();
  const [expanded, setExpanded] = useState(selectedSchool?.id || null);

  const toggle = (id) => setExpanded(e => e === id ? null : id);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 sm:px-6 pt-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black mb-1">School Directory</h1>
          <p className="text-white/60 text-sm">
            Explore how Stemara supports each NH institution — programs, positioning, and personalized features.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* School selector row */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SCHOOL_LIST.map(s => (
            <button
              key={s.id}
              onClick={() => { selectSchool(s.id); setExpanded(s.id); }}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedSchool?.id === s.id ? "text-white shadow-md" : "bg-white border border-gray-200 text-gray-600"
              }`}
              style={selectedSchool?.id === s.id ? { backgroundColor: s.colors.primary } : {}}
            >
              {s.shortName}
            </button>
          ))}
        </div>

        {/* School profiles */}
        {SCHOOL_LIST.map(school => (
          <SchoolProfile
            key={school.id}
            school={school}
            expanded={expanded === school.id}
            onToggle={() => toggle(school.id)}
          />
        ))}
      </div>

      <ChatWidget />
    </div>
  );
}
