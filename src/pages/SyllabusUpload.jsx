import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";

const SAMPLE_SYLLABUS = `BIO 201: Cell Biology
Professor: Dr. Sarah Kim
Credits: 4 | MWF 9:00-9:50am

SCHEDULE:
Week 1-2: Cell Structure & Function
Week 3-4: Membrane Transport
Week 5-6: Cellular Respiration
Week 7: MIDTERM EXAM (Oct 15)
Week 8-9: DNA Replication
Week 10-11: Gene Expression
Week 12-13: Cell Division
Week 14: FINAL EXAM PREP
Finals Week: FINAL EXAM

GRADING:
Midterm: 30% | Final: 35%
Lab Reports (4): 20% | Quizzes (5): 15%`;

const PARSED_RESULT = {
  course: "BIO 201: Cell Biology",
  instructor: "Dr. Sarah Kim",
  credits: 4,
  examDates: [
    { name: "Midterm Exam", date: "Oct 15", weight: "30%", weeksAway: 3 },
    { name: "Final Exam", date: "Finals Week", weight: "35%", weeksAway: 12 },
  ],
  assessments: [
    { name: "Lab Reports", count: 4, weight: "20%" },
    { name: "Quizzes", count: 5, weight: "15%" },
  ],
  units: [
    { week: "1-2", topic: "Cell Structure & Function" },
    { week: "3-4", topic: "Membrane Transport" },
    { week: "5-6", topic: "Cellular Respiration" },
    { week: "8-9", topic: "DNA Replication" },
    { week: "10-11", topic: "Gene Expression" },
    { week: "12-13", topic: "Cell Division" },
  ],
  studyPlan: [
    { action: "Start weekly review sessions", when: "This week", priority: "high" },
    { action: "Lab Report 1 prep", when: "Next 2 weeks", priority: "high" },
    { action: "Midterm study block (5 days before)", when: "Oct 10-14", priority: "critical" },
    { action: "Quiz prep for Unit 1", when: "End of Week 2", priority: "medium" },
  ],
};

export default function SyllabusUpload() {
  const { school } = useApp();
  const navigate = useNavigate();
  const [stage, setStage] = useState("upload"); // upload | pasting | parsing | parsed
  const [pastedText, setPastedText] = useState("");
  const [usedSample, setUsedSample] = useState(false);

  const primary = school?.colors?.primary || "#0F172A";
  const secondary = school?.colors?.secondary || "#F59E0B";
  const bg = school?.colors?.bg || "#F8FAFC";

  function handleParse() {
    setStage("parsing");
    setTimeout(() => setStage("parsed"), 2000);
  }

  function useSample() {
    setPastedText(SAMPLE_SYLLABUS);
    setUsedSample(true);
    setStage("pasting");
  }

  const priorityColors = {
    critical: "#EF4444",
    high: "#F59E0B",
    medium: "#10B981",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <TopNav />

      <div className="px-5 py-6 max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black" style={{ color: primary }}>Syllabus Upload</h1>
          <p className="text-sm text-gray-500 mt-1">
            Paste your syllabus and Stemara will build your entire study plan.
          </p>
        </div>

        {stage === "upload" && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:opacity-80 transition"
              style={{ borderColor: primary + "40", backgroundColor: primary + "08" }}
              onClick={() => setStage("pasting")}
            >
              <div className="text-4xl mb-3">📄</div>
              <p className="font-bold text-gray-800 mb-1">Paste your syllabus</p>
              <p className="text-sm text-gray-500">Copy-paste from PDF, Canvas, Blackboard, or any LMS</p>
              <div className="mt-4">
                <span className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: primary }}>
                  Start Pasting →
                </span>
              </div>
            </div>

            <button
              onClick={useSample}
              className="w-full py-3 rounded-xl border-2 text-sm font-semibold transition hover:opacity-80"
              style={{ borderColor: secondary, color: primary }}
            >
              Try with Sample Syllabus (BIO 201)
            </button>

            <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
              <span className="text-xl">💡</span>
              <div className="text-xs text-gray-500 leading-relaxed">
                Stemara reads any syllabus format. Works with Canvas, Blackboard, Google Classroom, or raw text.
                {school && ` Optimized for ${school.shortName} course structures.`}
              </div>
            </div>
          </div>
        )}

        {stage === "pasting" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Paste your syllabus text
              </label>
              <textarea
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Paste your full syllabus here..."
                rows={12}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none bg-white font-mono leading-relaxed"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStage("upload")}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Back
              </button>
              <button
                onClick={handleParse}
                disabled={!pastedText.trim()}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                style={{ backgroundColor: primary }}
              >
                Parse Syllabus →
              </button>
            </div>
          </div>
        )}

        {stage === "parsing" && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse"
              style={{ backgroundColor: primary }}>
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Parsing your syllabus…</h2>
            <p className="text-sm text-gray-500 mb-6">
              Finding exam dates, assignments, and building your study roadmap.
            </p>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              {["Reading course structure...", "Identifying key dates...", "Building study plan..."].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-green-500 font-bold">✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "parsed" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: primary }}>
                  BIO
                </div>
                <div>
                  <div className="font-bold text-gray-900">{PARSED_RESULT.course}</div>
                  <div className="text-xs text-gray-400">{PARSED_RESULT.instructor} • {PARSED_RESULT.credits} credits</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold">✓ Parsed</span>
                {usedSample && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">Sample</span>}
              </div>
            </div>

            {/* Exams */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Key Dates</h3>
              <div className="space-y-2">
                {PARSED_RESULT.examDates.map(exam => (
                  <div key={exam.name} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{exam.name}</div>
                      <div className="text-xs text-gray-400">{exam.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: primary }}>{exam.weight}</div>
                      <div className="text-xs text-gray-400">{exam.weeksAway}w away</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Plan */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Study Plan</h3>
              <div className="space-y-2">
                {PARSED_RESULT.studyPlan.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: priorityColors[item.priority] || "#9CA3AF" }} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{item.action}</div>
                      <div className="text-xs text-gray-400">{item.when}</div>
                    </div>
                    <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: (priorityColors[item.priority] || "#9CA3AF") + "20",
                        color: priorityColors[item.priority] || "#9CA3AF"
                      }}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/study")}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm"
              style={{ backgroundColor: primary }}
            >
              Open Full Study Plan →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
