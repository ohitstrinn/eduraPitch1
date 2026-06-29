import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, ChevronRight, Sparkles, Calendar, BookOpen, AlertCircle, X, Zap } from "lucide-react";
import { useSchool } from "../context/SchoolContext";
import ChatWidget from "../components/ChatWidget";

const MOCK_PARSED = {
  courseName: "BIOL 401: Cell Biology",
  instructor: "Dr. Sarah Mitchell",
  credits: 4,
  semester: "Fall 2025",
  keyTopics: [
    "Cell structure and function",
    "DNA replication and repair",
    "Protein synthesis",
    "Cell division (mitosis & meiosis)",
    "Signal transduction pathways",
    "Cell metabolism and bioenergetics",
  ],
  assessments: [
    { name: "Midterm Exam", weight: "25%", date: "Oct 15, 2025" },
    { name: "Lab Reports (x4)", weight: "30%", date: "Biweekly" },
    { name: "Final Exam", weight: "35%", date: "Dec 12, 2025" },
    { name: "Participation", weight: "10%", date: "Ongoing" },
  ],
  upcomingDates: [
    { label: "Lab Report 1 Due", date: "Sep 26", daysAway: 5 },
    { label: "Midterm Review Session", date: "Oct 13", daysAway: 22 },
    { label: "Midterm Exam", date: "Oct 15", daysAway: 24 },
  ],
  studyRecommendation: "Based on your syllabus, focus 40% of study time on cellular processes and 35% on molecular biology. This course has 4 major deadlines in the next 30 days. Recommend 8-10 hours/week.",
  readinessScore: 73,
};

function ProgressRing({ value, size = 80, color }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
      />
      <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
        {value}%
      </text>
    </svg>
  );
}

export default function SyllabusUpload() {
  const { school } = useSchool();
  const [phase, setPhase] = useState("idle"); // idle | dragging | uploading | parsed
  const [filename, setFilename] = useState("");
  const fileRef = useRef();

  const primaryColor = school?.colors?.primary || "#4F46E5";
  const bgColor = school?.colors?.bg || "#F8FAFC";

  const simulateUpload = (name) => {
    setFilename(name);
    setPhase("uploading");
    setTimeout(() => setPhase("parsed"), 2800);
  };

  const handleFile = (file) => {
    if (file) simulateUpload(file.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setPhase("idle");
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <div className="text-white px-4 sm:px-6 pt-6 pb-8"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}BB)` }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black mb-1">Syllabus Upload</h1>
          <p className="text-white/70 text-sm">
            Upload any course syllabus and get instant AI-powered insights, key dates, and a personalized study plan.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <AnimatePresence mode="wait">

          {/* Idle + Upload area */}
          {(phase === "idle" || phase === "dragging") && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                onDragOver={e => { e.preventDefault(); setPhase("dragging"); }}
                onDragLeave={() => setPhase("idle")}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  phase === "dragging"
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <motion.div
                  animate={phase === "dragging" ? { scale: 1.1 } : { scale: 1 }}
                  className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Upload size={28} style={{ color: primaryColor }} />
                </motion.div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {phase === "dragging" ? "Drop it here!" : "Upload your syllabus"}
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  Drag & drop or click to choose a file. Supports PDF, DOCX, or TXT.
                </p>
                <button
                  className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Upload size={14} /> Choose File
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>

              {/* Demo trigger */}
              <div className="text-center mt-4">
                <button
                  onClick={() => simulateUpload("BIOL_401_Syllabus_Fall2025.pdf")}
                  className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
                >
                  Try a demo syllabus instead →
                </button>
              </div>
            </motion.div>
          )}

          {/* Uploading / Parsing */}
          {phase === "uploading" && (
            <motion.div key="uploading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}15` }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={28} style={{ color: primaryColor }} />
                  </motion.div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Parsing your syllabus...</h3>
                <p className="text-gray-500 text-sm mb-6">AI is extracting key dates, topics, and assessments from <strong>{filename}</strong></p>

                <div className="max-w-xs mx-auto space-y-3">
                  {["Reading document structure", "Extracting course dates", "Identifying assessment weights", "Building study recommendations"].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.5 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.5 + 0.2 }}
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <CheckCircle size={12} style={{ color: primaryColor }} />
                      </motion.div>
                      <span className="text-gray-600">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Parsed results */}
          {phase === "parsed" && (
            <motion.div key="parsed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Success banner */}
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Syllabus parsed successfully</p>
                  <p className="text-xs text-green-600">{filename}</p>
                </div>
                <button onClick={() => setPhase("idle")} className="ml-auto text-green-400 hover:text-green-600">
                  <X size={16} />
                </button>
              </div>

              {/* Course overview */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-black text-gray-900 text-xl">{MOCK_PARSED.courseName}</h2>
                    <p className="text-gray-500 text-sm mt-1">{MOCK_PARSED.instructor} · {MOCK_PARSED.credits} credits · {MOCK_PARSED.semester}</p>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <ProgressRing value={MOCK_PARSED.readinessScore} color={primaryColor} />
                    <p className="text-xs text-gray-500 mt-1">Readiness</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded-xl leading-relaxed">
                  <Sparkles size={12} className="inline mr-1.5" style={{ color: primaryColor }} />
                  {MOCK_PARSED.studyRecommendation}
                </p>
              </div>

              {/* Upcoming dates */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={16} style={{ color: primaryColor }} /> Upcoming Dates
                </h3>
                <div className="space-y-2.5">
                  {MOCK_PARSED.upcomingDates.map(d => (
                    <div key={d.label} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                        d.daysAway <= 7 ? "bg-red-50" : "bg-gray-50"
                      }`}>
                        <span className={`text-xs font-black ${d.daysAway <= 7 ? "text-red-500" : "text-gray-700"}`}>{d.daysAway}d</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{d.label}</p>
                        <p className="text-xs text-gray-400">{d.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key topics */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen size={16} style={{ color: primaryColor }} /> Key Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {MOCK_PARSED.keyTopics.map(t => (
                    <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assessments */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} style={{ color: primaryColor }} /> Assessments
                </h3>
                <div className="space-y-2.5">
                  {MOCK_PARSED.assessments.map(a => (
                    <div key={a.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.date}</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: primaryColor }}>{a.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}AA)` }}
              >
                <Zap size={16} /> Build My Study Plan from This Syllabus
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ChatWidget />
    </div>
  );
}
