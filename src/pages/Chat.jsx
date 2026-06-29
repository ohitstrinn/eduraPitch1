import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";
import ChatWidget from "../components/ChatWidget";

export default function Chat() {
  const { school } = useApp();
  const primary = school?.colors?.primary || "#0F172A";
  const bg = school?.colors?.bg || "#F8FAFC";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bg }}>
      <TopNav />

      <div className="px-4 py-4 max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl font-black" style={{ color: primary }}>AI Study Assistant</h1>
          <p className="text-sm text-gray-500">
            {school
              ? `Tuned for ${school.name} students.`
              : "School-specific study support."}
          </p>
        </div>

        <div className="flex-1" style={{ minHeight: "500px" }}>
          <ChatWidget embedded />
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Stemara AI is optimized for academic support.
            {school && ` Responses are tuned for ${school.shortName} programs.`}
          </p>
        </div>
      </div>
    </div>
  );
}
