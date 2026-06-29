import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchool } from '../contexts/SchoolContext';
import { useAuth } from '../contexts/AuthContext';

const PARSE_STEPS = [
  { label: 'Reading document structure...', icon: '📄', duration: 800 },
  { label: 'Extracting course schedule...', icon: '📅', duration: 700 },
  { label: 'Identifying assignments & deadlines...', icon: '📝', duration: 900 },
  { label: 'Analyzing grading weights...', icon: '⚖️', duration: 600 },
  { label: 'Building personalized study plan...', icon: '🧠', duration: 1000 },
  { label: 'Done!', icon: '✅', duration: 0 },
];

const MOCK_RESULTS = {
  unh: {
    courseName: 'BIO 401: Molecular Cell Biology',
    instructor: 'Dr. Sarah Chen',
    credits: 4,
    keyDeadlines: [
      { date: 'Oct 12', item: 'Lab Report #3 — CRISPR gene editing analysis', weight: '15%', urgent: true },
      { date: 'Oct 19', item: 'Midterm Exam — Chapters 7–12', weight: '25%', urgent: false },
      { date: 'Nov 2', item: 'Research Proposal Draft', weight: '10%', urgent: false },
      { date: 'Nov 16', item: 'Lab Report #4 — Protein synthesis', weight: '15%', urgent: false },
    ],
    gradeBreakdown: [
      { label: 'Midterm', pct: 25 },
      { label: 'Final', pct: 30 },
      { label: 'Lab Reports', pct: 30 },
      { label: 'Participation', pct: 15 },
    ],
    insights: [
      'Lab reports make up 30% of your grade — prioritize them.',
      'Midterm is 3 weeks out. Start review week 2.',
      'Participation matters — attend all 3 remaining labs.',
    ],
    studyPlan: '14-week plan generated based on your schedule.',
  },
  snhu: {
    courseName: 'BUS 301: Operations Management',
    instructor: 'Prof. James Miller',
    credits: 3,
    keyDeadlines: [
      { date: 'Oct 11', item: 'Module 4 Quiz — Supply chain basics', weight: '5%', urgent: true },
      { date: 'Oct 18', item: 'Case Study 2 — Toyota Production System', weight: '15%', urgent: false },
      { date: 'Nov 1', item: 'Team Project Milestone 2', weight: '20%', urgent: false },
      { date: 'Nov 15', item: 'Final Project Submission', weight: '25%', urgent: false },
    ],
    gradeBreakdown: [
      { label: 'Final Project', pct: 25 },
      { label: 'Case Studies', pct: 30 },
      { label: 'Quizzes', pct: 25 },
      { label: 'Discussion', pct: 20 },
    ],
    insights: [
      'Quizzes are weekly — set a recurring 2-hour study block.',
      'Case studies are your highest-leverage work at 30%.',
      'Discussion posts require 3 replies per week.',
    ],
    studyPlan: 'Async-optimized 8-week module plan generated.',
  },
  mcc: {
    courseName: 'ENG 101: College Writing',
    instructor: 'Prof. Lisa Torres',
    credits: 3,
    keyDeadlines: [
      { date: 'Oct 10', item: 'Essay 2 Draft — Argumentative essay', weight: '10%', urgent: true },
      { date: 'Oct 17', item: 'Peer Review Workshop', weight: '5%', urgent: false },
      { date: 'Oct 24', item: 'Essay 2 Final — Revised submission', weight: '20%', urgent: false },
      { date: 'Nov 7', item: 'Research Paper Outline', weight: '10%', urgent: false },
    ],
    gradeBreakdown: [
      { label: 'Essays', pct: 60 },
      { label: 'Research Paper', pct: 25 },
      { label: 'Participation', pct: 15 },
    ],
    insights: [
      'Essays account for 60% — every draft matters.',
      'Start Essay 2 today. Draft is due in 4 days.',
      'The Writing Center offers free tutoring — use it.',
    ],
    studyPlan: 'Weekly writing schedule aligned to essay deadlines.',
  },
  ncc: {
    courseName: 'HLT 201: Clinical Practice I',
    instructor: 'Prof. Rosa Martinez',
    credits: 4,
    keyDeadlines: [
      { date: 'Oct 11', item: 'Competency Check #3 — Vital signs documentation', weight: '15%', urgent: true },
      { date: 'Oct 18', item: 'Patient Care Reflection Journal', weight: '10%', urgent: false },
      { date: 'Nov 1', item: 'Clinical Simulation Lab', weight: '20%', urgent: false },
      { date: 'Nov 14', item: 'Midterm Skills Assessment', weight: '25%', urgent: false },
    ],
    gradeBreakdown: [
      { label: 'Clinical Skills', pct: 45 },
      { label: 'Midterm Assessment', pct: 25 },
      { label: 'Reflection Journal', pct: 15 },
      { label: 'Attendance', pct: 15 },
    ],
    insights: [
      'Clinical skills are 45% — practice before each lab.',
      'Competency Check is in 4 days. Review protocols now.',
      '100% attendance required for clinical hours.',
    ],
    studyPlan: '12-week competency progression plan generated.',
  },
};

export default function SyllabusUpload() {
  const navigate = useNavigate();
  const { activeSchool } = useSchool();
  const { user } = useAuth();
  const fileRef = useRef();
  const [phase, setPhase] = useState('upload'); // upload | parsing | results
  const [parseStep, setParseStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const school = activeSchool;
  const result = MOCK_RESULTS[school?.id] || MOCK_RESULTS.unh;

  const accentStyle = school
    ? { background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  const startParsing = async (name) => {
    setFileName(name);
    setPhase('parsing');
    setParseStep(0);
    for (let i = 0; i < PARSE_STEPS.length - 1; i++) {
      await new Promise(r => setTimeout(r, PARSE_STEPS[i].duration));
      setParseStep(i + 1);
    }
    setPhase('results');
  };

  const handleFile = (file) => {
    if (!file) return;
    startParsing(file.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="text-white p-6 pb-8" style={accentStyle}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium">
              ← Dashboard
            </button>
            {school && <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{school.emoji} {school.shortName}</span>}
          </div>
          <h1 className="text-2xl font-black mb-1">Syllabus Upload</h1>
          <p className="text-white/70 text-sm">Drop your syllabus and get a full study plan in seconds.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-2">
        <AnimatePresence mode="wait">
          {phase === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`mt-6 rounded-2xl border-2 border-dashed transition-all p-12 text-center cursor-pointer ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
                }`}
                style={dragOver && school ? { borderColor: school.colors.primary, background: school.colors.bg } : {}}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt"
                  onChange={e => handleFile(e.target.files[0])} />
                <div className="text-5xl mb-4">📄</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Drop your syllabus here</h3>
                <p className="text-gray-500 text-sm mb-4">PDF, Word, or plain text · Any format works</p>
                <button
                  className="px-6 py-3 text-white font-bold rounded-xl text-sm"
                  style={accentStyle}
                >
                  Browse Files
                </button>
              </div>

              {/* Try a demo */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Try with a demo syllabus:</p>
                <div className="space-y-2">
                  {Object.values(MOCK_RESULTS).map((r, i) => (
                    <button
                      key={i}
                      onClick={() => startParsing(`${r.courseName}.pdf`)}
                      className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">📄</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{r.courseName}</div>
                        <div className="text-xs text-gray-400">{r.instructor} · {r.credits} credits</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'parsing' && (
            <motion.div key="parsing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-6 bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-4 animate-spin">⚙️</div>
              <h3 className="font-bold text-gray-900 text-lg mb-6">Analyzing your syllabus...</h3>
              <div className="space-y-3 text-left max-w-sm mx-auto">
                {PARSE_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={parseStep >= i ? { opacity: 1, x: 0 } : { opacity: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <span className={`text-lg ${parseStep >= i ? '' : 'grayscale opacity-30'}`}>{step.icon}</span>
                    <span className={`text-sm ${parseStep >= i ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                    {parseStep > i && <span className="ml-auto text-green-500 text-xs">✓</span>}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-6">Parsing: {fileName}</p>
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-4">
              {/* Course header */}
              <div className="rounded-2xl p-5 text-white" style={accentStyle}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-bold">Syllabus parsed!</span>
                </div>
                <h2 className="text-xl font-black">{result.courseName}</h2>
                <p className="text-white/70 text-sm">{result.instructor} · {result.credits} credits</p>
                <p className="text-white/80 text-xs mt-2">{result.studyPlan}</p>
              </div>

              {/* Key Insights */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-3">🔑 Key Insights</h3>
                <div className="space-y-2">
                  {result.insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold text-sm mt-0.5">→</span>
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deadlines */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-3">📅 Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {result.keyDeadlines.map((d, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${d.urgent ? '' : 'bg-gray-50'}`}
                      style={d.urgent ? { background: school?.colors.bg || '#EBF1FF' } : {}}>
                      <div className="text-center min-w-[48px]">
                        <div className="text-xs text-gray-500">{d.date.split(' ')[0]}</div>
                        <div className="font-black text-lg text-gray-900">{d.date.split(' ')[1]}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{d.item}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: school?.colors.badgeBg || '#dbeafe', color: school?.colors.badgeText || '#1e3a8a' }}>
                          {d.weight} of grade
                        </span>
                      </div>
                      {d.urgent && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Soon!</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-3">⚖️ Grade Breakdown</h3>
                <div className="space-y-2">
                  {result.gradeBreakdown.map((g, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 w-32">{g.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${g.pct}%` }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(to right, ${school?.colors.gradientFrom || '#003C8A'}, ${school?.colors.gradientTo || '#1A5CB0'})` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-8">{g.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/recommendations')}
                  className="flex-1 py-3 text-white font-bold rounded-xl text-sm"
                  style={accentStyle}
                >
                  View Study Plan →
                </button>
                <button
                  onClick={() => setPhase('upload')}
                  className="px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50"
                >
                  Upload Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
