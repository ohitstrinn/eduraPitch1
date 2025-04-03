import { useState } from "react";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const STUDENT_CLASSES = [
  {
    code: "BIO 101",
    name: "Intro to Biology",
    textbook: "Biology: Concepts & Connections",
    isbn: "9780134296012",
  },
  {
    code: "PSY 210",
    name: "Developmental Psychology",
    textbook: "Introduction to Psychology",
    isbn: "9781319132101",
  },
];

export default function StudentHub() {
  const [uploads, setUploads] = useState({});
  const [pollVotes, setPollVotes] = useState({});

  const handleSyllabusUpload = (e, code) => {
    const fileName = e.target.files[0]?.name || "Uploaded";
    setUploads((prev) => ({ ...prev, [code]: fileName }));
  };

  const vote = (isbn, voteType) => {
    setPollVotes((prev) => ({
      ...prev,
      [isbn]: voteType,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🎓 Student Hub</h1>

      {/* Class List with Syllabus Upload */}
      <Card>
        <CardContent className="space-y-3">
          <CardTitle>📚 Your Classes & Syllabi</CardTitle>
          <ul className="space-y-3 text-sm">
            {STUDENT_CLASSES.map((cls) => (
              <li key={cls.code}>
                <strong>{cls.code}</strong>: {cls.name}
                <br />
                <label className="block mt-1">
                  Upload Syllabus:{" "}
                  <input
                    type="file"
                    onChange={(e) => handleSyllabusUpload(e, cls.code)}
                    className="mt-1"
                  />
                </label>
                {uploads[cls.code] && (
                  <p className="text-green-600 text-xs">
                    Uploaded: {uploads[cls.code]}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Course Textbooks */}
      <Card>
        <CardContent className="space-y-2">
          <CardTitle>📘 Course Textbook List</CardTitle>
          <ul className="text-sm text-gray-700 space-y-1">
            {STUDENT_CLASSES.map((course) => (
              <li key={course.code}>
                <strong>{course.code}</strong>: {course.name} —{" "}
                <em>{course.textbook}</em> (ISBN: {course.isbn})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Textbook Polls */}
      <Card>
        <CardContent className="space-y-2">
          <CardTitle>🗳️ Student Polls: Was This Textbook Helpful?</CardTitle>
          {STUDENT_CLASSES.map((course) => (
            <div key={course.isbn} className="text-sm">
              <p>
                <strong>{course.textbook}</strong> — ISBN: {course.isbn}
              </p>
              <div className="space-x-2 mt-1">
                <Button
                  className={pollVotes[course.isbn] === "yes" ? "bg-green-600" : ""}
                  onClick={() => vote(course.isbn, "yes")}
                >
                  ✅ Yes
                </Button>
                <Button
                  className={pollVotes[course.isbn] === "no" ? "bg-red-600" : ""}
                  onClick={() => vote(course.isbn, "no")}
                >
                  ❌ No
                </Button>
              </div>
              {pollVotes[course.isbn] && (
                <p className="text-xs text-gray-500 mt-1">
                  You voted: {pollVotes[course.isbn]}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Textbook Access Stats */}
      <Card>
        <CardContent>
          <CardTitle>📊 Textbook Access Stats (Not Drawn to Scale)</CardTitle>
          <div className="h-4 bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 rounded animate-pulse w-3/4 mt-2" />
          <p className="text-xs text-gray-500 mt-1">Based on your usage this semester</p>
        </CardContent>
      </Card>
    </div>
  );
}
