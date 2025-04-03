import { Card, CardContent, CardTitle } from "../components/ui/card";

const COURSES = [
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
  {
    code: "MATH 241",
    name: "Calculus III",
    textbook: "Calculus for Scientists",
    isbn: "9780538497817",
  },
];

export default function InstitutionHub() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/ed/University_of_Michigan_Logo.png"
          alt="University of Michigan"
          className="w-16 h-16"
        />
        <h1 className="text-3xl font-bold text-blue-900">
          University of Michigan - Institution Hub
        </h1>
      </div>

      {/* Course-Textbook Mapping */}
      <Card>
        <CardContent className="space-y-3">
          <CardTitle>📘 Course Textbook List</CardTitle>
          <ul className="text-sm text-gray-700 space-y-1">
            {COURSES.map((course) => (
              <li key={course.code}>
                <strong>{course.code}</strong>: {course.name} —{" "}
                <em>{course.textbook}</em> (ISBN: {course.isbn})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Textbook Usage Chart */}
      <Card>
        <CardContent>
          <CardTitle>📊 Textbook Access Stats (Not Drawn to Scale)</CardTitle>
          <div className="h-32 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded animate-pulse" />
          <p className="text-xs text-gray-500 mt-2">
            Based on last semester’s digital and physical distribution
          </p>
        </CardContent>
      </Card>

      {/* AI Study Tool Usage */}
      <Card>
        <CardContent>
          <CardTitle>🤖 Study Tool Usage by Department (Not Drawn to Scale)</CardTitle>
          <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600 mt-2">
            <div>
              <div className="h-16 w-16 bg-green-300 rounded-full animate-bounce mx-auto"></div>
              Biology
            </div>
            <div>
              <div className="h-16 w-16 bg-yellow-300 rounded-full animate-bounce mx-auto"></div>
              Psychology
            </div>
            <div>
              <div className="h-16 w-16 bg-red-300 rounded-full animate-bounce mx-auto"></div>
              Mathematics
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
