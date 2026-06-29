import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchool } from '../contexts/SchoolContext';
import { useAuth } from '../contexts/AuthContext';

const SCHOOL_RESPONSES = {
  unh: [
    { triggers: ['syllabus', 'deadline', 'due'], response: 'Based on your BIO 401 syllabus, your next deadline is Lab Report #3 on Oct 12 — that\'s worth 15% of your grade. Want me to help you outline it?' },
    { triggers: ['study', 'plan', 'schedule'], response: 'Your UNH study plan allocates 18 hrs/week across 3 courses. Your highest-priority block is BIO 401 lab prep on Mondays. Want me to adjust the schedule?' },
    { triggers: ['research', 'lab', 'professor'], response: 'Dr. Chen\'s office hours are Tue/Thurs 2–4pm. The Dimond Library has full database access for BIO 401 research papers. Shall I list the top journals for molecular biology?' },
    { triggers: ['grade', 'exam', 'test', 'midterm'], response: 'Your BIO 401 midterm on Oct 19 covers Chapters 7–12. That\'s 25% of your grade. I recommend starting review next Monday — want me to build a 2-week cramless plan?' },
  ],
  snhu: [
    { triggers: ['module', 'assignment', 'submit'], response: 'Your BUS 301 Module 4 quiz closes Oct 11. Set aside 90 mins Sunday to review supply chain fundamentals. Want a quick cheat sheet?' },
    { triggers: ['schedule', 'time', 'busy', 'work'], response: 'Totally manageable. Your plan is 12 hrs/week across 3 courses. If this week is busier, we can compress to 8 hrs without missing deadlines. Tell me what you need to protect.' },
    { triggers: ['discussion', 'post', 'reply'], response: 'SNHU discussion posts need a 200-word initial post + 3 replies. Best to post Tuesday and reply Thursday before the weekend close. Want a template?' },
    { triggers: ['grade', 'case study', 'project'], response: 'Case studies are 30% of BUS 301 — your highest-leverage work. Case Study 2 (Toyota) is due Oct 18. I can help you structure the analysis now.' },
  ],
  mcc: [
    { triggers: ['essay', 'writing', 'draft', 'paper'], response: 'Essay 2 draft is due Oct 10 — 4 days away. The MCC Writing Center has open slots Tuesday 10am–2pm. For now: nail your thesis, body paragraphs second. Want me to help with the argument structure?' },
    { triggers: ['transfer', 'unh', 'psu', 'pathway'], response: 'Your MCC Liberal Arts track transfers to UNH, PSU, and Keene State. You\'ll need a 2.5+ GPA for most programs. You\'re on track. Want the transfer application timeline?' },
    { triggers: ['tutor', 'help', 'support', 'resource'], response: 'MCC offers free tutoring at the Learning Center in Goffstown Hall. Writing Center, math tutoring, and peer tutors are all free with your student ID. Which subject do you need?' },
    { triggers: ['quiz', 'test', 'chapter'], response: 'PSY 101 Chapter 7 quiz is Oct 9. Chapters 7 covers social psychology — focus on conformity, Milgram, and Zimbardo. It\'s a 20-question multiple choice. Want a quick review session?' },
  ],
  ncc: [
    { triggers: ['competency', 'clinical', 'skills', 'check'], response: 'HLT 201 Competency Check #3 is Oct 11 — vital signs documentation. Run through the protocol at least twice before then. The sim lab is open Tuesday. Want the full checklist?' },
    { triggers: ['job', 'career', 'employer', 'hire'], response: 'The NCC Career Center connects students to 150+ local employers in Southern NH. Healthcare is especially active right now. Want me to flag the healthcare job board?' },
    { triggers: ['anatomy', 'bio', 'midterm', 'study'], response: 'BIO 202 midterm is Oct 14 — that\'s 7 days out. Anatomy requires visual memory. Use Stemara Flashcard Frenzy for bones/muscles and spend 30 mins daily on diagrams. Want a specific plan?' },
    { triggers: ['simulation', 'lab', 'practice'], response: 'The NCC simulation lab is open Tues and Thurs until 7pm. For HLT 201, focus on Skill Station 3 (documentation accuracy) — that\'s what your competency check covers.' },
  ],
};

const GENERAL_RESPONSES = [
  { triggers: ['hello', 'hi', 'hey', 'start'], response: 'Hey! I\'m Stemara\'s study assistant. I can help you with your courses, deadlines, study plans, and resources. What do you need help with today?' },
  { triggers: ['what', 'who', 'stemara', 'about'], response: 'Stemara is your school-specific adaptive study platform. I help you parse syllabi, build study plans, and stay on top of deadlines — personalized to your school and major. Ask me anything about your courses!' },
  { triggers: ['help', 'can you', 'do you'], response: 'I can help with: 📄 Syllabus questions · 📅 Deadlines & scheduling · 🧠 Study strategies · 📚 Campus resources · 💬 Any course-specific question. What would you like to tackle?' },
];

function getResponse(input, school) {
  const lower = input.toLowerCase();
  const schoolResponses = SCHOOL_RESPONSES[school?.id] || [];
  const allResponses = [...GENERAL_RESPONSES, ...schoolResponses];

  for (const item of allResponses) {
    if (item.triggers.some(t => lower.includes(t))) {
      return item.response;
    }
  }

  return `That\'s a great question about "${input}". Based on your ${school?.shortName || 'school'} profile, I'd recommend checking with your professor or using the campus library resources. Is there a specific course I can help with?`;
}

const SUGGESTED_PROMPTS = {
  unh: ['What\'s due this week?', 'Help me prep for BIO 401 lab', 'Explain Organic Chemistry basics', 'Office hours for Dr. Chen?'],
  snhu: ['What\'s due this week?', 'Help with my discussion post', 'How many hours should I study today?', 'Case study structure tips'],
  mcc: ['What\'s due this week?', 'Help me start my essay', 'How do I transfer to UNH?', 'Where is the Writing Center?'],
  ncc: ['What\'s due this week?', 'Prep for competency check', 'BIO 202 study tips', 'Career center info'],
};

export default function ChatPage() {
  const navigate = useNavigate();
  const { activeSchool } = useSchool();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm your Stemara study assistant${activeSchool ? ` for ${activeSchool.shortName}` : ''}. Ask me about your courses, deadlines, or study strategies.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef(null);

  const school = activeSchool;
  const suggested = SUGGESTED_PROMPTS[school?.id] || SUGGESTED_PROMPTS.unh;

  const accentStyle = school
    ? { background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      text: userMsg,
      timestamp: new Date(),
    }]);

    setTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const response = getResponse(userMsg, school);
    setTyping(false);
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'assistant',
      text: response,
      timestamp: new Date(),
    }]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white px-4 pt-6 pb-4" style={accentStyle}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm hover:bg-white/30 transition-colors">
              ←
            </button>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
                <span className="font-bold">Stemara Chat</span>
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              </div>
              <p className="text-white/70 text-xs">
                {school ? `${school.shortName} Study Assistant` : 'Study Assistant'}
              </p>
            </div>
          </div>
          {school && <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{school.emoji}</span>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl w-full mx-auto">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1"
                  style={{ background: school?.colors.bg || '#eff6ff' }}>
                  🤖
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'text-white rounded-br-sm' : 'bg-white text-gray-900 shadow-sm rounded-bl-sm border border-gray-100'
                }`}
                style={msg.role === 'user' ? accentStyle : {}}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex justify-start items-end"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0"
                style={{ background: school?.colors.bg || '#eff6ff' }}>
                🤖
              </div>
              <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gray-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEnd} />
      </div>

      {/* Suggested prompts (shown only at start) */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 max-w-2xl w-full mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggested.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="flex-shrink-0 text-xs px-3 py-2 rounded-xl border font-medium transition-all hover:shadow-sm"
                style={{ borderColor: school?.colors.border || '#bfdbfe', color: school?.colors.primary || '#1e3a8a', background: school?.colors.bg || '#eff6ff' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about your courses, deadlines, or study strategies..."
            rows={1}
            className="flex-1 resize-none text-sm text-gray-900 px-3 py-2 focus:outline-none bg-transparent"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all"
            style={accentStyle}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
