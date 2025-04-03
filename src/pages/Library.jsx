import { useState } from "react";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const UNIVERSITY_LIBRARY = [
  {
    courseCode: "PSYCH 101",
    className: "Intro to Psychology",
    textbook: {
      title: "Introduction to Psychology",
      author: "David Myers",
      isbn: "9781319132101",
      format: "Digital + Physical",
    },
  },
  {
    courseCode: "BIO 110",
    className: "General Biology",
    textbook: {
      title: "Biology: Concepts & Connections",
      author: "Campbell",
      isbn: "9780134296012",
      format: "Physical",
    },
  },
  {
    courseCode: "CALC 1",
    className: "Calculus I for Engineers",
    textbook: {
      title: "Calculus for Scientists",
      author: "James Stewart",
      isbn: "9780538497817",
      format: "Digital",
    },
  },
  {
    courseCode: "ENG 125",
    className: "College Writing",
    textbook: {
      title: "They Say / I Say",
      author: "Gerald Graff",
      isbn: "9780393617436",
      format: "Physical",
    },
  },
  {
    courseCode: "HIST 200",
    className: "World History: 1500–Present",
    textbook: {
      title: "A History of the Modern World",
      author: "R.R. Palmer",
      isbn: "9780073196586",
      format: "Digital",
    },
  },
];

export default function Library() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = UNIVERSITY_LIBRARY.filter(
    ({ className, courseCode, textbook }) =>
      className.toLowerCase().includes(search.toLowerCase()) ||
      courseCode.toLowerCase().includes(search.toLowerCase()) ||
      textbook.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🏛️ Campus Library</h1>
      <p className="text-gray-600 text-sm">
        Based on your enrolled classes at University of Michigan.
      </p>

      <div className="space-x-2">
        <input
          type="text"
          placeholder="Search class or book..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-72"
        />
      </div>

      <div className="space-y-4 mt-4">
        {filtered.map(({ courseCode, className, textbook }) => (
          <Card key={textbook.isbn}>
            <CardContent className="space-y-1">
              <CardTitle>
                {courseCode}: {className}
              </CardTitle>
              <p className="text-sm text-gray-600">📖 {textbook.title}</p>
              <p className="text-sm text-gray-600">Author: {textbook.author}</p>
              <p className="text-sm text-gray-600">ISBN: {textbook.isbn}</p>
              <p className="text-sm text-gray-600">Format: {textbook.format}</p>
              <Button
                onClick={() =>
                  navigate(`/book-trading?isbn=${encodeURIComponent(textbook.isbn)}`)
                }
              >
                Start Trade
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
