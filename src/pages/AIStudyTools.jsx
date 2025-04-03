import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function AIStudyTools() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🤖 AI Study Tools (Coming Soon)</h1>
      <p className="text-sm text-gray-600">
        These tools will help you study smarter — previews below!
      </p>

      {/* Summarizer */}
      <Card>
        <CardContent className="space-y-2">
          <CardTitle>📄 Notes Summarizer</CardTitle>
          <p className="text-sm text-gray-600">
            Upload notes or textbook pages and get concise summaries + key terms.
          </p>
          <Button disabled className="opacity-70 cursor-not-allowed">
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Quiz Generator */}
      <Card>
        <CardContent className="space-y-2">
          <CardTitle>❓ Smart Quiz Generator</CardTitle>
          <p className="text-sm text-gray-600">
            Paste your notes and instantly get MCQs or T/F questions for review.
          </p>
          <Button disabled className="opacity-70 cursor-not-allowed">
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Flashcard Tool */}
      <Card>
        <CardContent className="space-y-2">
          <CardTitle>🧠 Flashcard Creator</CardTitle>
          <p className="text-sm text-gray-600">
            Turn any text into editable flashcards with spaced repetition built-in.
          </p>
          <Button disabled className="opacity-70 cursor-not-allowed">
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Explain Like I'm 5 */}
      <Card>
        <CardContent className="space-y-2">
          <CardTitle>🗣️ Explain Like I’m 5</CardTitle>
          <p className="text-sm text-gray-600">
            Confused by a concept? Get a simple breakdown — like magic.
          </p>
          <Button disabled className="opacity-70 cursor-not-allowed">
            Coming Soon
          </Button>
        </CardContent>
      </Card>

      {/* Study Plan Generator */}
      <Card>
        <CardContent className="space-y-2">
          <CardTitle>📚 Study Plan Builder</CardTitle>
          <p className="text-sm text-gray-600">
            Enter your exam date, and get a personalized week-by-week study guide.
          </p>
          <Button disabled className="opacity-70 cursor-not-allowed">
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
