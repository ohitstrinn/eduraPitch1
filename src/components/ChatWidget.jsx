import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { useSchool } from "../context/SchoolContext";

const SCHOOL_GREETINGS = {
  unh: "Hi! I'm your UNH study assistant. I can help with courses, exams, or anything on your syllabus. What are you working on?",
  snhu: "Welcome! I'm your SNHU AI tutor. Whether you're studying at noon or midnight, I'm here. What do you need help with?",
  mcc: "Hey there! I'm your MCC study guide. I can help with coursework, transfer planning, or study tips. What's on your mind?",
  ncc: "Hello! I'm your NCC learning assistant. Ask me anything about your courses, assignments, or study strategies!",
  default: "Hi! I'm Stemara AI, your personal study assistant. I can help with any subject, study planning, or course navigation. What are you working on?",
};

const QUICK_PROMPTS = [
  "Help me understand this concept",
  "Create a study plan for my exam",
  "Summarize my syllabus",
  "Quiz me on my notes",
];

const AI_RESPONSES = [
  "Great question! Let me break that down for you in a clear, step-by-step way...",
  "I can definitely help with that! Here's how I'd approach it based on your course level...",
  "That's a common challenge. Let me give you a framework that works well for this type of problem...",
  "Perfect timing to review this! Here's a concise explanation with an example...",
  "I've seen this come up a lot in this subject area. The key thing to understand is...",
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget({ inline = false, schoolOverride = null }) {
  const { school: ctxSchool } = useSchool();
  const school = schoolOverride || ctxSchool;
  const [open, setOpen] = useState(inline);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const greeting = SCHOOL_GREETINGS[school?.id] || SCHOOL_GREETINGS.default;
  const primaryColor = school?.colors?.primary || "#6366f1";
  const btnClass = school?.colors?.btnClass || "bg-indigo-600 hover:bg-indigo-700 text-white";

  useEffect(() => {
    if ((open || inline) && messages.length === 0) {
      setMessages([{ id: 1, role: "assistant", text: greeting, time: new Date() }]);
    }
  }, [open, inline]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: text.trim(), time: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const schoolSpecific = school
        ? ` This is especially relevant for ${school.shortName} students in your program.`
        : "";
      setMessages(m => [...m, {
        id: Date.now() + 1,
        role: "assistant",
        text: aiText + schoolSpecific,
        time: new Date(),
      }]);
    }, 1200 + Math.random() * 800);
  };

  const ChatBody = (
    <div className={`flex flex-col ${inline ? "h-full" : "h-[420px]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white rounded-t-2xl"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">Stemara AI</p>
            <p className="text-xs opacity-70">
              {school ? `${school.shortName} Study Assistant` : "Study Assistant"} · Always on
            </p>
          </div>
        </div>
        {!inline && (
          <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "bg-indigo-100" : "bg-gray-200"
              }`}>
                {msg.role === "assistant" ? <Bot size={14} className="text-indigo-600" /> : <User size={14} className="text-gray-600" />}
              </div>
              <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-tr-sm"
                  : "bg-white text-gray-800 shadow-sm rounded-tl-sm"
              }`}
                style={msg.role === "user" ? { backgroundColor: primaryColor } : {}}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot size={14} className="text-indigo-600" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-white border-t border-gray-100">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100 rounded-b-2xl">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your studies..."
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl disabled:opacity-40 text-white transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        {ChatBody}
      </div>
    );
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
          >
            {ChatBody}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
