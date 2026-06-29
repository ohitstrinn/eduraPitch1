import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Brain, BookOpen, Users, Star, ChevronDown, Zap, Shield, Target } from "lucide-react";
import { SCHOOL_LIST } from "../data/schools";
import { useSchool } from "../context/SchoolContext";
import { useAuth } from "../context/AuthContext";
import PreSignupModal from "../components/PreSignupModal";
import StemaraLogo from "../components/StemaraLogo";

function SchoolCard({ school, selected, onSelect }) {
  return (
    <motion.button
      layout
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(school.id)}
      className={`relative p-5 rounded-2xl border-2 text-left transition-all cursor-pointer w-full ${
        selected ? "border-opacity-100 ring-2 ring-offset-2" : "border-white/30 hover:border-white/60 bg-white/10"
      }`}
      style={selected ? {
        borderColor: school.colors.secondary,
        backgroundColor: `${school.colors.primary}20`,
        ringColor: school.colors.secondary,
      } : {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderColor: "rgba(255,255,255,0.2)"
      }}
    >
      {selected && (
        <motion.div
          layoutId="selectedBadge"
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: school.colors.secondary }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      )}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-3"
        style={{ backgroundColor: selected ? school.colors.primary : "rgba(255,255,255,0.2)" }}
      >
        {school.shortName.slice(0, 2)}
      </div>
      <p className="font-bold text-white text-sm">{school.shortName}</p>
      <p className="text-white/60 text-xs mt-0.5 leading-tight">{school.type}</p>
      {selected && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-white/80 text-xs mt-2 leading-relaxed"
        >
          {school.tagline}
        </motion.p>
      )}
    </motion.button>
  );
}

const FEATURES = [
  { icon: <Brain size={20} />, title: "AI Syllabus Parsing", desc: "Upload any syllabus and get instant study insights, key dates, and topic breakdowns." },
  { icon: <Target size={20} />, title: "Adaptive Study Plans", desc: "Personalized weekly plans based on your courses, exam dates, and learning style." },
  { icon: <BookOpen size={20} />, title: "Smart Recommendations", desc: "AI-powered resource suggestions tailored to your major and specific school programs." },
  { icon: <Zap size={20} />, title: "Instant AI Tutor", desc: "Get answers, explanations, and guided practice on any concept, 24/7." },
  { icon: <Users size={20} />, title: "School-Specific Tools", desc: "Built for your institution — UNH, SNHU, MCC, or NCC. Not a one-size-fits-all tool." },
  { icon: <Shield size={20} />, title: "Progress Tracking", desc: "Visual dashboards showing your study hours, quiz scores, and readiness levels." },
];

export default function Landing() {
  const [showModal, setShowModal] = useState(false);
  const [hoveredSchool, setHoveredSchool] = useState(null);
  const { selectSchool, school: selectedSchool } = useSchool();
  const { user } = useAuth();
  const navigate = useNavigate();

  const displaySchool = hoveredSchool || selectedSchool;
  const bgColor = displaySchool?.colors?.primary || "#1a1a2e";
  const accentColor = displaySchool?.colors?.secondary || "#6366f1";

  const handleSchoolSelect = (id) => {
    selectSchool(id);
  };

  const handleCTA = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor, transition: "background-color 0.6s ease" }}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${accentColor} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${accentColor} 0%, transparent 40%)`
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-12">
            <StemaraLogo className="h-14" color="#ffffff" showTagline />
          </motion.div>

          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-yellow-300" />
              <span className="text-white/80 text-sm font-medium">AI-powered learning for NH students</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={displaySchool?.id || "default"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6"
              >
                {displaySchool
                  ? displaySchool.tagline
                  : "Study smarter at your school."}
              </motion.h1>
            </AnimatePresence>

            <motion.p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Stemara is an AI study platform built for the exact schools, programs, and students in New Hampshire. Not generic. Yours.
            </motion.p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleCTA}
                className="group flex items-center gap-2 text-base font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: accentColor, color: "#fff" }}
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-base font-medium px-7 py-3.5 rounded-xl border-2 border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all"
              >
                Join the Waitlist
              </button>
            </div>
          </motion.div>

          {/* School Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-center text-white/50 text-sm font-medium mb-5 uppercase tracking-wider">
              Select your school to see your personalized experience
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {SCHOOL_LIST.map(school => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  selected={selectedSchool?.id === school.id}
                  onSelect={handleSchoolSelect}
                />
              ))}
            </div>

            {/* School CTA */}
            <AnimatePresence>
              {selectedSchool && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 p-5 rounded-2xl border border-white/20 max-w-2xl mx-auto text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <p className="text-white font-semibold mb-1">{selectedSchool.pitch.slice(0, 120)}...</p>
                  <button
                    onClick={handleCTA}
                    className="mt-3 text-sm font-semibold px-5 py-2 rounded-lg text-white hover:opacity-90 transition-all"
                    style={{ backgroundColor: selectedSchool.colors.secondary }}
                  >
                    {selectedSchool.ctaText} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-white/30">
            <ChevronDown size={24} />
          </motion.div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Every feature built for students like you
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Stemara isn't a generic study app. Every feature is tuned to the real academic environment of NH colleges.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-1.5">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />)}
          </div>
          <blockquote className="text-xl sm:text-2xl font-medium text-white/90 mb-4 italic">
            "Stemara helped me actually understand my syllabus on the first day of class. It saved me hours every week."
          </blockquote>
          <p className="text-white/50 text-sm">— Early beta student, University of New Hampshire</p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to study smarter?</h2>
          <p className="text-white/60 mb-8">Join students across NH who are getting more done in less time.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCTA}
              className="flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-xl text-white shadow-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: accentColor }}
            >
              Create Free Account <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="font-medium px-8 py-3.5 rounded-xl border-2 border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all"
            >
              Join the Waitlist
            </button>
          </div>
          <p className="mt-5 text-white/30 text-sm">No credit card required · Free to start · School-specific experience</p>
        </div>
      </div>

      {/* Founder link */}
      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-white/20 text-xs">
          Are you a founder?{" "}
          <button onClick={() => navigate("/founder/login")} className="underline hover:text-white/40 transition-colors">
            Access founder dashboard
          </button>
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <PreSignupModal
            onClose={() => setShowModal(false)}
            onSignup={() => navigate("/signup")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
