import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';

const MOCK_PARSED = {
  courseName: 'Introduction to Cell Biology',
  courseCode: 'BIOL 401',
  professor: 'Dr. Sarah Chen',
  creditHours: 4,
  semester: 'Spring 2025',
  deadlines: [
    { type: 'Exam', title: 'Midterm Exam', date: 'Mar 3', weight: '25%' },
    { type: 'Paper', title: 'Research Paper Draft', date: 'Mar 17', weight: '15%' },
    { type: 'Project', title: 'Lab Project Presentation', date: 'Apr 7', weight: '20%' },
    { type: 'Exam', title: 'Final Exam', date: 'May 1', weight: '30%' },
  ],
  weeklyTopics: [
    { week: 1, topic: 'Cell Structure & Organelles' },
    { week: 2, topic: 'DNA Replication & Transcription' },
    { week: 3, topic: 'Protein Synthesis' },
    { week: 4, topic: 'Cell Division & Mitosis' },
  ],
  studyRecommendations: [
    'Focus on cell membrane transport mechanisms before Week 3',
    'Review lab protocols every Friday',
    'Form a study group before the midterm',
  ],
};

export default function SyllabusUpload() {
  const { school } = useSchool();
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [step, setStep] = useState('upload'); // 'upload' | 'parsing' | 'done'
  const fileRef = useRef();

  const primaryColor = school?.colors?.primary || '#1b3a6b';
  const lightBg = school?.colors?.light || '#d6e3f7';

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setStep('parsing');
    setParsing(true);

    // Simulate parsing
    setTimeout(() => {
      setParsing(false);
      setParsed(MOCK_PARSED);
      setStep('done');
    }, 2800);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: school?.colors?.bg || '#f8fafc' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
            ←
          </Link>
          <div>
            <h1 className="font-black text-gray-900">Syllabus Upload</h1>
            <p className="text-xs text-gray-500">We'll parse it and build your study plan</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Upload zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="border-3 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all"
                style={{
                  borderColor: dragging ? primaryColor : '#d1d5db',
                  borderWidth: '3px',
                  backgroundColor: dragging ? lightBg : '#fff',
                }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div className="text-5xl mb-4">{dragging ? '📥' : '📄'}</div>
                <h3 className="font-black text-gray-900 text-xl mb-2">
                  {dragging ? 'Drop to upload' : 'Upload your syllabus'}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  PDF, DOCX, or TXT — we'll handle the rest
                </p>
                <button
                  className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  Browse files
                </button>
                <p className="text-xs text-gray-400 mt-4">Or drag and drop</p>
              </div>

              {/* School-specific tips */}
              {school && (
                <div
                  className="mt-6 p-5 rounded-2xl"
                  style={{ backgroundColor: lightBg }}
                >
                  <div className="font-bold text-sm mb-3" style={{ color: primaryColor }}>
                    {school.emoji} Tips for {school.shortName} syllabi
                  </div>
                  <ul className="space-y-1.5">
                    {school.valueProps.slice(0, 3).map((vp) => (
                      <li key={vp} className="text-xs text-gray-700 flex items-start gap-2">
                        <span style={{ color: primaryColor }}>✓</span>
                        {vp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {step === 'parsing' && (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6 animate-bounce">🤖</div>
              <h3 className="font-black text-gray-900 text-2xl mb-2">Parsing your syllabus...</h3>
              <p className="text-gray-500 mb-8">{file?.name}</p>
              <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: primaryColor }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
              </div>
              <div className="mt-6 space-y-2 text-sm text-gray-500">
                {['Identifying course details...', 'Extracting deadlines...', 'Building study plan...'].map((msg, i) => (
                  <motion.p
                    key={msg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.8 }}
                  >
                    {msg}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'done' && parsed && (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Success banner */}
              <div
                className="rounded-2xl p-5 mb-6 flex items-center gap-4"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="text-3xl">✅</div>
                <div>
                  <div className="font-black text-white text-lg">Syllabus parsed!</div>
                  <div className="text-white/70 text-sm">Found {parsed.deadlines.length} deadlines & built your study plan</div>
                </div>
              </div>

              {/* Course info */}
              <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                <div className="font-black text-gray-900 text-lg">{parsed.courseCode}: {parsed.courseName}</div>
                <div className="text-sm text-gray-500 mt-1">{parsed.professor} · {parsed.creditHours} credits · {parsed.semester}</div>
              </div>

              {/* Deadlines */}
              <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Key deadlines</h3>
                <div className="space-y-3">
                  {parsed.deadlines.map((d) => (
                    <div key={d.title} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {d.type === 'Exam' ? '📝' : d.type === 'Paper' ? '📄' : '🎤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">{d.title}</div>
                        <div className="text-xs text-gray-500">{d.date}</div>
                      </div>
                      <div
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: lightBg, color: primaryColor }}
                      >
                        {d.weight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">AI recommendations</h3>
                <div className="space-y-2">
                  {parsed.studyRecommendations.map((rec) => (
                    <div
                      key={rec}
                      className="flex items-start gap-2 p-3 rounded-xl text-sm"
                      style={{ backgroundColor: lightBg }}
                    >
                      <span style={{ color: primaryColor }}>💡</span>
                      <span className="text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/study" className="flex-1">
                  <button
                    className="w-full py-3.5 rounded-2xl text-white font-bold transition-all hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Build study plan
                  </button>
                </Link>
                <button
                  onClick={() => { setStep('upload'); setFile(null); setParsed(null); }}
                  className="px-4 py-3.5 rounded-2xl border-2 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ borderColor: primaryColor }}
                >
                  Upload another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
