import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSchool } from '../context/SchoolContext';

const QUICK_PROMPTS = [
  'Help me study for my exam',
  'Explain this concept simply',
  'Build a study schedule',
  'What are key terms this week?',
  'Quiz me on cell biology',
];

const AI_RESPONSES = {
  default: [
    "Great question! Based on your course syllabus, I'd suggest focusing on the core concepts first. Let me break this down for you...",
    "I can help with that! For {school} students, I find the best approach is to connect theory to practical examples. Here's what I'd recommend...",
    "Let's tackle this together. Based on what I know about your current courses, here's a personalized study strategy...",
    "Excellent! I've seen many students succeed with this approach: first understand the 'why', then the 'how'. Let me walk you through it...",
  ],
  study: "I'll build a custom study plan for you! Based on your upcoming deadlines, I recommend 30-min focused sessions daily. Start with the hardest material first when your brain is fresh. Want me to break this into daily tasks?",
  explain: "Let me simplify this for you. Think of it like this: [concept] works similar to how everyday things work. The key insight is that... Does this make it clearer? Ask me to go deeper on any part.",
  schedule: "Here's a suggested schedule for this week:\n\n• Mon/Wed: Core concepts review (45 min)\n• Tue/Thu: Practice problems (30 min)\n• Fri: Light review + flashcards (20 min)\n• Sun: Full practice test (60 min)\n\nWant me to adjust this based on your deadlines?",
  quiz: "Quiz time! Let's test your knowledge. Question 1: What is the primary function of mitochondria in a cell?\n\na) Protein synthesis\nb) Energy production (ATP)\nc) DNA replication\nd) Cell division\n\nTake your time — I'll wait for your answer!",
};

function getAIResponse(message, school) {
  const lower = message.toLowerCase();
  if (lower.includes('schedule') || lower.includes('plan')) return AI_RESPONSES.schedule;
  if (lower.includes('explain') || lower.includes('simple')) return AI_RESPONSES.explain;
  if (lower.includes('quiz') || lower.includes('test')) return AI_RESPONSES.quiz;
  if (lower.includes('study')) return AI_RESPONSES.study;
  const responses = AI_RESPONSES.default;
  const r = responses[Math.floor(Math.random() * responses.length)];
  return r.replace('{school}', school?.shortName || 'your school');
}

export default function ChatFeature() {
  const { user } = useAuth();
  const { school } = useSchool();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your Stemara AI tutor${school ? ` for ${school.name}` : ''}. I know your courses, your schedule, and your learning style. What can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  const primaryColor = school?.colors?.primary || '#1b3a6b';
  const lightBg = school?.colors?.light || '#d6e3f7';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: getAIResponse(text, school),
      timestamp: new Date(),
    };
    setTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto" style={{ backgroundColor: school?.colors?.bg || '#f8fafc' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 flex-shrink-0">
        <Link to="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          AI
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-gray-900">Stemara AI Tutor</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Online · {school?.shortName || 'All schools'} mode
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  AI
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm text-white'
                    : 'rounded-tl-sm text-gray-800'
                }`}
                style={
                  msg.role === 'user'
                    ? { backgroundColor: primaryColor }
                    : { backgroundColor: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
                }
              >
                {msg.content}
                <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                AI
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="px-5 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all hover:scale-105 whitespace-nowrap"
                style={{ borderColor: primaryColor, color: primaryColor, backgroundColor: lightBg }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-5 pb-6 pt-2 flex-shrink-0 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
          <input
            type="text"
            placeholder="Ask anything about your courses..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            ↑
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2">
          AI responses are for study support only
        </p>
      </div>
    </div>
  );
}
