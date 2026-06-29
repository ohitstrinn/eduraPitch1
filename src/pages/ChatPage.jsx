import { useSchool } from "../context/SchoolContext";
import ChatWidget from "../components/ChatWidget";
import { Brain, Sparkles, BookOpen, Target } from "lucide-react";

const SUGGESTED = [
  { icon: <Brain size={18} />, title: "Explain a concept", prompt: "Can you explain photosynthesis in simple terms?" },
  { icon: <Target size={18} />, title: "Quiz me", prompt: "Quiz me on the key topics from my BIOL 401 syllabus." },
  { icon: <BookOpen size={18} />, title: "Study strategy", prompt: "What's the best way to study for a multiple choice biology exam?" },
  { icon: <Sparkles size={18} />, title: "Help with homework", prompt: "Help me understand this chemistry problem step by step." },
];

export default function ChatPage() {
  const { school } = useSchool();
  const primaryColor = school?.colors?.primary || "#4F46E5";
  const bgColor = school?.colors?.bg || "#F8FAFC";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor }}>
      {/* Header */}
      <div className="text-white px-4 sm:px-6 pt-6 pb-6"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}BB)` }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black mb-1">AI Tutor</h1>
          <p className="text-white/70 text-sm">
            Ask anything — explanations, practice problems, study strategies, concept breakdowns.
            {school ? ` Optimized for ${school.shortName} students.` : ""}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Suggestion chips */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Suggested prompts</p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED.map(s => (
              <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-3 hover:border-gray-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1.5" style={{ color: primaryColor }}>
                  {s.icon}
                  <span className="text-xs font-semibold text-gray-700">{s.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-tight line-clamp-2">{s.prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inline chat — takes remaining space */}
        <div className="flex-1 min-h-[400px] rounded-2xl overflow-hidden">
          <ChatWidget inline />
        </div>
      </div>
    </div>
  );
}
