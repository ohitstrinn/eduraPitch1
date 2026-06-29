import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { saveChatMessage } from "../data/mockStore";

const SCHOOL_STARTERS = {
  unh: [
    "Help me break down my syllabus",
    "I have a bio lab quiz tomorrow",
    "How do I manage midterm week?",
  ],
  snhu: [
    "I'm falling behind on my online course",
    "Help me build a weekly study plan",
    "I work full-time — how do I manage?",
  ],
  mcc: [
    "I'm a first-gen student — where do I start?",
    "Help me with my nursing program schedule",
    "Show me how to use Stemara",
  ],
  ncc: [
    "I need a study plan for my electrician program",
    "Help me balance work and school",
    "What should I study tonight?",
  ],
};

const AI_RESPONSES = {
  syllabus: "Great idea! Upload your syllabus and I'll break it into weekly study checkpoints with built-in review sessions before every exam.",
  study: "Let's build your study plan. Based on your school and major, I'll create a schedule that works around your real life — not an idealized one.",
  schedule: "I can help with that! Share your course list and I'll map out a realistic weekly plan, including buffer days for when things get busy.",
  default: "I'm here to help you study smarter. Tell me what course you're working on and I'll give you a personalized action plan.",
  first: "Welcome! I'm Stemara's AI study assistant. I'm designed specifically for students at your school. What are you working on today?",
  manage: "Balancing everything is hard. Let's start with what's most urgent — what's due in the next 7 days? I'll help you prioritize.",
  behind: "Don't stress — catching up is totally doable. Tell me which course you're behind in and I'll create a catch-up plan.",
  plan: "Here's how I'd suggest structuring your week: 2 deep-focus sessions per course, 1 review session before class, and 1 catch-up buffer day. Want me to map this to your actual schedule?",
};

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes("syllabus") || lower.includes("upload")) return AI_RESPONSES.syllabus;
  if (lower.includes("behind") || lower.includes("catch up")) return AI_RESPONSES.behind;
  if (lower.includes("plan") || lower.includes("study plan")) return AI_RESPONSES.plan;
  if (lower.includes("schedule") || lower.includes("manage") || lower.includes("balance")) return AI_RESPONSES.manage;
  if (lower.includes("first") || lower.includes("start") || lower.includes("begin")) return AI_RESPONSES.first;
  return AI_RESPONSES.default;
}

export default function ChatWidget({ embedded = false }) {
  const { school } = useApp();
  const [messages, setMessages] = useState([
    { role: "ai", text: school ? `Hi! I'm Stemara — your AI study assistant built for ${school.shortName} students. What can I help you with today?` : "Hi! I'm Stemara, your AI study assistant. What are you working on?" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const starters = SCHOOL_STARTERS[school?.id] || SCHOOL_STARTERS.unh;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(m => [...m, { role: "user", text: msg }]);
    setInput("");
    setTyping(true);
    saveChatMessage(school?.id, "user", msg);

    setTimeout(() => {
      const reply = getAIResponse(msg);
      setMessages(m => [...m, { role: "ai", text: reply }]);
      setTyping(false);
      saveChatMessage(school?.id, "ai", reply);
    }, 900 + Math.random() * 600);
  }

  const primary = school?.colors?.primary || "#0F172A";
  const secondary = school?.colors?.secondary || "#F59E0B";

  return (
    <div className={`flex flex-col ${embedded ? "h-full" : "h-[480px]"} bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: primary }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: secondary, color: "#000" }}>S</div>
        <div>
          <div className="text-white font-semibold text-sm">Stemara AI</div>
          <div className="text-white/60 text-xs">Your school-specific study assistant</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/70 text-xs">Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
              }`}
              style={m.role === "user" ? { backgroundColor: primary } : {}}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick starters */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-100 bg-white">
          {starters.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="flex-shrink-0 text-xs py-1.5 px-3 rounded-full border font-medium whitespace-nowrap hover:opacity-80 transition"
              style={{ borderColor: primary, color: primary }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2">
        <input
          type="text"
          placeholder="Ask anything about your studies..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2"
          style={{ "--tw-ring-color": primary + "40" }}
        />
        <button
          onClick={() => sendMessage()}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: primary }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
