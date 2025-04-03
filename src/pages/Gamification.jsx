import { motion } from "framer-motion";

const games = [
  { title: "Flashcard Frenzy", emoji: "🃏" },
  { title: "Quiz Quest", emoji: "❓" },
  { title: "Drag & Drop Dash", emoji: "🧩" },
  { title: "Fill in the Blank Battle", emoji: "✍️" },
  { title: "Match Madness", emoji: "🔗" },
];

export default function Gamification() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🎮 Gamification Hub</h1>
      <p className="text-gray-600 mb-4">
        Practice using AI-generated games! Tap a game to launch it (simulated).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {games.map((game, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{game.emoji} {game.title}</h2>
            <p className="text-sm text-gray-500">Powered by AI Study Tools</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
