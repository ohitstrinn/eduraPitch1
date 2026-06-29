import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { SCHOOL_LIST } from "../data/schools";
import PreSignupModal from "../components/PreSignupModal";
import StemaraLogo from "../components/StemaraLogo";

const SCHOOL_ICONS = {
  unh: "🔵",
  snhu: "🟣",
  mcc: "🔴",
  ncc: "🟢",
};

export default function Landing() {
  const { setSchool, school } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedForModal, setSelectedForModal] = useState(null);

  function handleSchoolSelect(id) {
    setSchool(id);
  }

  function handleJoinTest(schoolId) {
    if (schoolId) setSchool(schoolId);
    setSelectedForModal(schoolId);
    setShowModal(true);
  }

  function handleModalSuccess() {
    setShowModal(false);
    navigate("/login");
  }

  const featuredSchool = school || SCHOOL_LIST[0];
  const primary = featuredSchool.colors.primary;
  const secondary = featuredSchool.colors.secondary;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, ${primary}CC 100%)` }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full border-2 border-white translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full border-2 border-white -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative px-6 pt-10 pb-16 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <StemaraLogo size="lg" white />
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-white/80 border border-white/30 px-4 py-1.5 rounded-full hover:bg-white/10"
            >
              Sign In
            </button>
          </div>

          <div className="mb-4">
            <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">
              AI Study Support
            </span>
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Learn smarter.<br />
            <span style={{ color: secondary }}>Built for your school.</span>
          </h1>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            Stemara parses your syllabus, builds your study plan, and gives you an AI co-pilot — personalized for your specific school, major, and goals.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handleJoinTest(school?.id)}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-center shadow-lg"
              style={{ backgroundColor: secondary, color: primary }}
            >
              Join Early Access
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-white/40 text-white hover:bg-white/10"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* School Selector */}
      <div className="px-6 py-10 max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-1">Select Your School</h2>
          <p className="text-sm text-gray-500">Stemara adapts to your institution — different schools, different needs.</p>
        </div>

        <div className="space-y-3">
          {SCHOOL_LIST.map(s => (
            <button
              key={s.id}
              onClick={() => handleSchoolSelect(s.id)}
              className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                school?.id === s.id ? "shadow-md" : "border-gray-100 hover:border-gray-200"
              }`}
              style={school?.id === s.id ? {
                borderColor: s.colors.primary,
                backgroundColor: s.colors.bg,
              } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm"
                    style={{ backgroundColor: s.colors.primary }}>
                    {s.shortName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900">{s.shortName}</div>
                    <div className="text-xs text-gray-500">{s.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {school?.id === s.id && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: s.colors.primary }}>
                      Selected
                    </span>
                  )}
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {school?.id === s.id && (
                <div className="mt-3 text-xs text-gray-600 leading-relaxed border-t pt-3"
                  style={{ borderColor: s.colors.primary + "30" }}>
                  {s.tagline}
                </div>
              )}
            </button>
          ))}
        </div>

        {school && (
          <button
            onClick={() => handleJoinTest(school.id)}
            className="w-full mt-6 py-3.5 rounded-xl font-bold text-white text-sm shadow-lg"
            style={{ backgroundColor: school.colors.primary }}
          >
            Join {school.shortName} Early Access →
          </button>
        )}
      </div>

      {/* Value Props */}
      <div className="px-6 py-8 bg-gray-50 max-w-md mx-auto">
        <h2 className="text-lg font-black text-gray-900 mb-5">What Stemara does for you</h2>
        <div className="space-y-4">
          {[
            { icon: "📄", title: "Syllabus Parsing", desc: "Drop in your syllabus and get a full study schedule in seconds." },
            { icon: "🤖", title: "AI Study Assistant", desc: "Chat with an AI tutor that knows your school's programs and your course load." },
            { icon: "🎯", title: "Personalized Plans", desc: "Study plans built around your major, schedule, and goals — not a template." },
            { icon: "📊", title: "Progress Tracking", desc: "Stay on track with visual progress across all your courses." },
          ].map(item => (
            <div key={item.title} className="flex gap-4 items-start">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="font-bold text-sm text-gray-900">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder CTA */}
      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="rounded-2xl p-5 text-center"
          style={{ backgroundColor: featuredSchool.colors.bg, borderColor: featuredSchool.colors.primary + "30" }}>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">For College Administrators</p>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Want to see Stemara for your institution? Schedule a founder demo.
          </p>
          <button
            onClick={() => navigate("/founder")}
            className="text-sm font-bold px-5 py-2 rounded-lg text-white"
            style={{ backgroundColor: primary }}
          >
            Founder / Admin Access →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 text-center text-xs text-gray-400 border-t border-gray-100">
        <span className="font-semibold text-gray-600">Stemara</span> — AI-powered study support for NH colleges.
        <br />Built with students, for students.
      </div>

      {showModal && (
        <PreSignupModal
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
