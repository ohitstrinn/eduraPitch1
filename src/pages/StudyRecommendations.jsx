import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';

const STUDY_TOOLS = [
  { id: 'flashcards', icon: '🃏', title: 'Flashcards', desc: 'AI-generated from your notes', badge: 'Quick' },
  { id: 'quiz', icon: '❓', title: 'Quiz Generator', desc: 'MCQ & true/false practice', badge: 'Adaptive' },
  { id: 'summary', icon: '📝', title: 'Notes Summarizer', desc: 'Upload notes → key insights', badge: 'Smart' },
  { id: 'planner', icon: '📅', title: 'Study Planner', desc: 'Week-by-week schedule builder', badge: 'AI' },
  { id: 'explain', icon: '🗣️', title: 'Explain It Simply', desc: 'Any concept in plain language', badge: 'Fast' },
  { id: 'tutor', icon: '🤖', title: 'AI Tutor Session', desc: 'Live Q&A on your materials', badge: 'Live' },
];

const MOCK_PLAN = [
  { day: 'Mon', tasks: ['Read Chapter 4 (Cell Division)', 'Watch lecture recording'], done: true },
  { day: 'Tue', tasks: ['Flashcards: mitosis vocab (30 cards)', 'Practice problems set 2'], done: true },
  { day: 'Wed', tasks: ['Study group session (7pm)', 'Review lab notes'], done: false },
  { day: 'Thu', tasks: ['Quiz practice: cell biology', 'Write paper outline'], done: false },
  { day: 'Fri', tasks: ['Exam prep: key terms', 'Rest and review'], done: false },
];

export default function StudyRecommendations() {
  const { school } = useSchool();
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState(null);
  const [flashInput, setFlashInput] = useState('');
  const [flashCards, setFlashCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [generating, setGenerating] = useState(false);

  const primaryColor = school?.colors?.primary || '#1b3a6b';
  const lightBg = school?.colors?.light || '#d6e3f7';

  const MOCK_CARDS = [
    { front: 'What is mitosis?', back: 'Cell division producing two genetically identical daughter cells' },
    { front: 'What is meiosis?', back: 'Cell division producing four genetically unique daughter cells (gametes)' },
    { front: 'What is the cell cycle?', back: 'The series of events (G1, S, G2, M phases) that cells go through to grow and divide' },
    { front: 'What is DNA replication?', back: 'The process of copying DNA before cell division, using the template strand' },
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setFlashCards(MOCK_CARDS);
    setCurrentCard(0);
    setFlipped(false);
    setGenerating(false);
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: school?.colors?.bg || '#f8fafc' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <div>
            <h1 className="font-black text-gray-900">AI Study Hub</h1>
            <p className="text-xs text-gray-500">{school ? `Personalized for ${school.shortName}` : 'Your AI study partner'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6">
        {/* Week plan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900">This week's plan</h2>
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: lightBg, color: primaryColor }}
            >
              5 days
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_PLAN.map((day) => (
              <div key={day.day} className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                  style={day.done ? { backgroundColor: primaryColor, color: '#fff' } : { backgroundColor: lightBg, color: primaryColor }}
                >
                  {day.done ? '✓' : day.day}
                </div>
                <div className="flex-1 min-w-0">
                  {!day.done && (
                    <div className="text-xs font-bold text-gray-400 mb-0.5">{day.day}</div>
                  )}
                  {day.tasks.map((t) => (
                    <div key={t} className={`text-sm ${day.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools grid */}
        <h2 className="font-black text-gray-900 mb-4">Study tools</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {STUDY_TOOLS.map((tool) => (
            <motion.button
              key={tool.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              className="bg-white rounded-2xl p-4 text-left shadow-sm border-2 transition-all"
              style={{
                borderColor: activeTool === tool.id ? primaryColor : 'transparent',
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{tool.icon}</span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: lightBg, color: primaryColor }}
                >
                  {tool.badge}
                </span>
              </div>
              <div className="font-bold text-gray-900 text-sm">{tool.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{tool.desc}</div>
            </motion.button>
          ))}
        </div>

        {/* Flashcard tool expanded */}
        {activeTool === 'flashcards' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm mb-6"
          >
            <h3 className="font-black text-gray-900 mb-3">🃏 Flashcard Generator</h3>
            {flashCards.length === 0 ? (
              <div>
                <textarea
                  placeholder="Paste your notes here and we'll create flashcards..."
                  value={flashInput}
                  onChange={(e) => setFlashInput(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none mb-3"
                />
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {generating ? 'Generating flashcards...' : 'Generate flashcards'}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-xs text-gray-500 text-center mb-4">
                  Card {currentCard + 1} of {flashCards.length} · Tap to flip
                </div>
                <motion.div
                  className="h-48 rounded-2xl flex items-center justify-center p-6 cursor-pointer text-center mb-4"
                  style={{ backgroundColor: flipped ? primaryColor : lightBg }}
                  onClick={() => setFlipped(!flipped)}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}>
                    <div
                      className="font-bold text-lg"
                      style={{ color: flipped ? '#fff' : primaryColor }}
                    >
                      {flipped ? flashCards[currentCard].back : flashCards[currentCard].front}
                    </div>
                    <div className="text-xs mt-2" style={{ color: flipped ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>
                      {flipped ? 'Answer' : 'Question — tap to reveal'}
                    </div>
                  </div>
                </motion.div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setCurrentCard((c) => Math.max(0, c - 1)); setFlipped(false); }}
                    disabled={currentCard === 0}
                    className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm text-gray-600 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => { setCurrentCard((c) => Math.min(flashCards.length - 1, c + 1)); setFlipped(false); }}
                    disabled={currentCard === flashCards.length - 1}
                    className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Next →
                  </button>
                </div>
                <button
                  onClick={() => { setFlashCards([]); setFlashInput(''); }}
                  className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Generate new set
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* School-specific recommendations */}
        {school && (
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: lightBg }}
          >
            <div className="font-bold mb-3" style={{ color: primaryColor }}>
              {school.emoji} {school.shortName} study tips
            </div>
            <div className="space-y-2">
              {school.pitchPoints.slice(0, 3).map((point) => (
                <div key={point} className="flex items-start gap-2 text-sm text-gray-700">
                  <span style={{ color: primaryColor }}>→</span>
                  {point}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
