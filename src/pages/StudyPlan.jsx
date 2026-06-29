import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import TopNav from "../components/TopNav";

const COURSES = [
  { id: "bio201", code: "BIO 201", name: "Cell Biology", progress: 42, nextTask: "Lab Report 1", daysLeft: 2, weight: 20, color: "#10B981" },
  { id: "cs101", code: "CS 101", name: "Intro to CS", progress: 68, nextTask: "Chapter 4 Quiz", daysLeft: 3, weight: 30, color: "#3B82F6" },
  { id: "eng110", code: "ENG 110", name: "Composition", progress: 25, nextTask: "Essay Draft", daysLeft: 7, weight: 25, color: "#8B5CF6" },
  { id: "mat150", code: "MAT 150", name: "Pre-Calculus", progress: 55, nextTask: "Problem Set 3", daysLeft: 5, weight: 25, color: "#F59E0B" },
];

const WEEKLY_SCHEDULE = [
  { day: "Mon", sessions: ["BIO 201 – Unit 4 Review", "CS 101 – Practice Problems"] },
  { day: "Tue", sessions: ["ENG 110 – Essay Outline", "BIO Lab Prep"] },
  { day: "Wed", sessions: ["MAT 150 – Chapter 6", "CS 101 – Quiz Prep"] },
  { day: "Thu", sessions: ["BIO 201 – Lab Report", "ENG 110 – Draft Writing"] },
  { day: "Fri", sessions: ["MAT 150 – Review", "Free Block"] },
  { day: "Sat", sessions: ["Catch-up Block (2h)", "BIO 201 Self-test"] },
  { day: "Sun", sessions: ["Weekly Review", "Plan next week"] },
];

const RECS = [
  { icon: "⚡", title: "High priority this week", desc: "BIO 201 Lab Report is due in 2 days. Block 3 hours Thursday evening.", action: "Add to Calendar" },
  { icon: "📖", title: "Spaced repetition", desc: "CS 101 quiz is in 3 days — review flashcards daily for 20 min instead of cramming.", action: "Start Review" },
  { icon: "✍️", title: "Writing momentum", desc: "ENG 110 essay is 7 days out. Start an outline today to avoid last-minute stress.", action: "Start Outline" },
];

export default function StudyPlan() {
  const { school, student } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  const primary = school?.colors?.primary || "#0F172A";
  const secondary = school?.colors?.secondary || "#F59E0B";
  const bg = school?.colors?.bg || "#F8FAFC";

  const totalProgress = Math.round(COURSES.reduce((acc, c) => acc + c.progress, 0) / COURSES.length);

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>
      <TopNav />

      <div className="px-5 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black" style={{ color: primary }}>Study Plan</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {school ? `Personalized for ${school.shortName}` : "Your personalized schedule"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: primary }}>{totalProgress}%</div>
            <div className="text-xs text-gray-400">overall</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6 bg-white">
          {["overview", "schedule", "recs"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold capitalize transition-all ${activeTab === tab ? "text-white" : "text-gray-500 hover:bg-gray-50"}`}
              style={activeTab === tab ? { backgroundColor: primary } : {}}
            >
              {tab === "overview" ? "Courses" : tab === "recs" ? "Tips" : "Schedule"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-3">
            {COURSES.map(course => (
              <div key={course.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: course.color }}>
                      {course.code.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">{course.code}</div>
                      <div className="text-xs text-gray-400">{course.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black" style={{ color: course.color }}>{course.progress}%</div>
                    <div className="text-xs text-gray-400">done</div>
                  </div>
                </div>

                <div className="h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Next: <span className="font-semibold text-gray-700">{course.nextTask}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${course.daysLeft <= 2 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                    {course.daysLeft}d left
                  </span>
                </div>
              </div>
            ))}

            <Link to="/syllabus"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed rounded-2xl text-sm font-semibold"
              style={{ borderColor: primary + "40", color: primary }}>
              + Add Another Course
            </Link>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 text-xs text-gray-500 flex items-center gap-2">
              <span>📅</span>
              <span>Week of {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} — AI-generated schedule</span>
            </div>

            {WEEKLY_SCHEDULE.map((day, i) => {
              const isToday = i === new Date().getDay() - 1;
              return (
                <div key={day.day} className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${isToday ? "border-2" : "border-gray-100"}`}
                  style={isToday ? { borderColor: primary } : {}}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${isToday ? "text-white" : "text-gray-400 bg-gray-100"}`}
                      style={isToday ? { backgroundColor: primary } : {}}>
                      {day.day}
                    </div>
                    {isToday && <span className="text-xs font-bold" style={{ color: primary }}>Today</span>}
                  </div>
                  <div className="space-y-1.5">
                    {day.sessions.map((session, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: primary }} />
                        {session}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "recs" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">AI Study Coach</p>
              <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                You're on track overall, but BIO 201 needs immediate attention.
                {school && ` As a ${school.shortName} student, here's your personalized action plan:`}
              </p>
            </div>

            {RECS.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900 mb-1">{rec.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed mb-3">{rec.desc}</div>
                    <button className="text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                      style={{ backgroundColor: primary }}>
                      {rec.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: secondary + "20" }}>
              <p className="text-sm font-semibold text-gray-800 mb-2">Need more detailed help?</p>
              <Link to="/chat"
                className="inline-block text-sm font-bold px-5 py-2 rounded-lg text-white"
                style={{ backgroundColor: primary }}>
                Ask Stemara AI →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
