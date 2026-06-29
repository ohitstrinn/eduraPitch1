import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSchool } from '../contexts/SchoolContext';
import { useAuth } from '../contexts/AuthContext';

const PLANS = {
  unh: {
    headline: 'Your UNH Study Plan',
    subtitle: 'Research-track optimized · 14 weeks',
    weeklyHours: 18,
    studyBlocks: [
      { day: 'Mon', subject: 'BIO 401 Lab Prep', hours: 2, type: 'review', priority: 'high' },
      { day: 'Tue', subject: 'CHEM 303 Problem Sets', hours: 2.5, type: 'practice', priority: 'high' },
      { day: 'Wed', subject: 'BIO 401 Reading Ch. 9–10', hours: 2, type: 'reading', priority: 'medium' },
      { day: 'Thu', subject: 'PSYC 401 Data Analysis', hours: 3, type: 'project', priority: 'high' },
      { day: 'Fri', subject: 'CHEM 303 Review', hours: 1.5, type: 'review', priority: 'medium' },
      { day: 'Sat', subject: 'Catch-up / Research prep', hours: 2, type: 'flex', priority: 'low' },
    ],
    resources: [
      { type: 'Library', label: 'UNH Dimond Library — Database access', icon: '📚' },
      { type: 'Office Hours', label: 'Dr. Chen — Tues/Thurs 2–4pm', icon: '👩‍🏫' },
      { type: 'Study Group', label: 'BIO 401 peer group — 6 members', icon: '👥' },
      { type: 'Tool', label: 'Stemara Flashcard Frenzy — CHEM 303', icon: '🃏' },
    ],
    tip: 'Focus your highest-energy hours on lab prep. BIO 401 lab reports determine 30% of your grade.',
  },
  snhu: {
    headline: 'Your SNHU Study Plan',
    subtitle: 'Async-optimized · Module-by-module',
    weeklyHours: 12,
    studyBlocks: [
      { day: 'Mon', subject: 'BUS 301 Module readings', hours: 1.5, type: 'reading', priority: 'high' },
      { day: 'Tue', subject: 'Discussion post drafts', hours: 1, type: 'writing', priority: 'high' },
      { day: 'Wed', subject: 'MKT 210 Case study', hours: 2, type: 'project', priority: 'medium' },
      { day: 'Thu', subject: 'ACC 201 Practice problems', hours: 1.5, type: 'practice', priority: 'high' },
      { day: 'Sat', subject: 'Weekly quiz prep (all courses)', hours: 2, type: 'review', priority: 'high' },
      { day: 'Sun', subject: 'Submit assignments + plan next week', hours: 1.5, type: 'flex', priority: 'medium' },
    ],
    resources: [
      { type: 'Library', label: 'SNHU Online Library — 24/7 access', icon: '📚' },
      { type: 'Tutoring', label: 'SNHU Writing Center — async chat', icon: '✍️' },
      { type: 'Study Group', label: 'Virtual BUS 301 study group', icon: '👥' },
      { type: 'Tool', label: 'Stemara Quiz Quest — ACC 201', icon: '🧪' },
    ],
    tip: 'Set your weekly study window on Sunday. Working students succeed with consistent short blocks, not marathon sessions.',
  },
  mcc: {
    headline: 'Your MCC Study Plan',
    subtitle: 'Transfer-track focused · 15 weeks',
    weeklyHours: 10,
    studyBlocks: [
      { day: 'Mon', subject: 'ENG 101 — Essay drafting', hours: 2, type: 'writing', priority: 'high' },
      { day: 'Tue', subject: 'BIO 110 — Reading + notes', hours: 1.5, type: 'reading', priority: 'medium' },
      { day: 'Wed', subject: 'PSY 101 — Chapter review', hours: 1.5, type: 'review', priority: 'medium' },
      { day: 'Thu', subject: 'ENG 101 — Revision + peer prep', hours: 2, type: 'writing', priority: 'high' },
      { day: 'Sat', subject: 'BIO 110 Lab prep', hours: 1.5, type: 'practice', priority: 'high' },
    ],
    resources: [
      { type: 'Writing Center', label: 'MCC Writing Center — free tutoring', icon: '✍️' },
      { type: 'Library', label: 'MCC Library — print & digital', icon: '📚' },
      { type: 'Transfer', label: 'Transfer Pathway — UNH, PSU routes', icon: '🎓' },
      { type: 'Tool', label: 'Stemara — ENG 101 essay planner', icon: '📝' },
    ],
    tip: 'Essays are 60% of ENG 101. Use the Writing Center at least once per essay — it makes a measurable difference.',
  },
  ncc: {
    headline: 'Your NCC Study Plan',
    subtitle: 'Career-outcome focused · 12 weeks',
    weeklyHours: 14,
    studyBlocks: [
      { day: 'Mon', subject: 'HLT 201 — Protocol review', hours: 2, type: 'review', priority: 'high' },
      { day: 'Tue', subject: 'BIO 202 — Anatomy diagrams', hours: 2.5, type: 'practice', priority: 'high' },
      { day: 'Wed', subject: 'HLT 201 — Skills practice', hours: 2, type: 'practice', priority: 'high' },
      { day: 'Thu', subject: 'COM 101 — Presentation prep', hours: 1.5, type: 'project', priority: 'medium' },
      { day: 'Fri', subject: 'BIO 202 — Lab review', hours: 2, type: 'review', priority: 'high' },
      { day: 'Sun', subject: 'Reflection journal + weekly plan', hours: 1, type: 'writing', priority: 'medium' },
    ],
    resources: [
      { type: 'Simulation Lab', label: 'NCC Simulation Lab — open Tue/Thu', icon: '🏥' },
      { type: 'Career', label: 'NCC Career Center — job connections', icon: '💼' },
      { type: 'Library', label: 'NCC Library — clinical resources', icon: '📚' },
      { type: 'Tool', label: 'Stemara — HLT 201 competency tracker', icon: '✅' },
    ],
    tip: 'Competency checks are pass/fail. Spend 2 focused hours per check on skill simulations — don\'t cram.',
  },
};

const TYPE_COLORS = {
  reading: { bg: '#EFF6FF', text: '#1D4ED8', label: 'Reading' },
  review: { bg: '#F0FDF4', text: '#166534', label: 'Review' },
  practice: { bg: '#FFF7ED', text: '#9A3412', label: 'Practice' },
  writing: { bg: '#FDF4FF', text: '#7E22CE', label: 'Writing' },
  project: { bg: '#FFF1F2', text: '#9F1239', label: 'Project' },
  flex: { bg: '#F8FAFC', text: '#475569', label: 'Flex' },
};

export default function StudyRecommendations() {
  const navigate = useNavigate();
  const { activeSchool } = useSchool();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('plan');

  const school = activeSchool;
  const plan = PLANS[school?.id] || PLANS.unh;

  const accentStyle = school
    ? { background: `linear-gradient(135deg, ${school.colors.gradientFrom}, ${school.colors.gradientTo})` }
    : { background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="text-white p-6 pb-8" style={accentStyle}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium">
              ← Dashboard
            </button>
            {school && <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full">{school.emoji} {school.shortName}</span>}
          </div>
          <h1 className="text-2xl font-black mb-1">{plan.headline}</h1>
          <p className="text-white/70 text-sm">{plan.subtitle}</p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Hrs/Week', value: plan.weeklyHours },
              { label: 'Study Blocks', value: plan.studyBlocks.length },
              { label: 'Resources', value: plan.resources.length },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="font-black text-xl">{s.value}</div>
                <div className="text-xs text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mt-4 mb-5">
          {[
            { id: 'plan', label: '📅 Weekly Plan' },
            { id: 'resources', label: '📚 Resources' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'plan' && (
          <div className="space-y-4">
            {/* Tip */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-4 border"
              style={{ background: school?.colors.bg || '#eff6ff', borderColor: school?.colors.border || '#bfdbfe' }}>
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: school?.colors.primary || '#1e3a8a' }}>
                    Stemara Insight
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: school?.colors.text || '#1e3a8a' }}>
                    {plan.tip}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Study blocks */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">This Week's Schedule</h3>
              <div className="space-y-3">
                {plan.studyBlocks.map((block, i) => {
                  const tc = TYPE_COLORS[block.type];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 text-center">
                        <div className="text-xs font-bold text-gray-500">{block.day}</div>
                      </div>
                      <div className="flex-1 flex items-center gap-2 p-3 rounded-xl"
                        style={{ background: tc.bg }}>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{block.subject}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                              style={{ background: tc.bg, color: tc.text }}>
                              {tc.label}
                            </span>
                            <span className="text-xs text-gray-400">{block.hours}h</span>
                          </div>
                        </div>
                        {block.priority === 'high' && (
                          <span className="text-xs font-bold text-red-500">🔴</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/chat')}
                className="flex-1 py-3 text-white font-bold rounded-xl text-sm"
                style={accentStyle}>
                Ask Study Chat →
              </button>
              <button onClick={() => navigate('/syllabus')}
                className="px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50">
                Add Course
              </button>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-3">
            {plan.resources.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: school?.colors.bg || '#eff6ff' }}>
                  {r.icon}
                </div>
                <div>
                  <div className="text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block"
                    style={{ background: school?.colors.badgeBg || '#dbeafe', color: school?.colors.badgeText || '#1e3a8a' }}>
                    {r.type}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{r.label}</p>
                </div>
              </motion.div>
            ))}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mt-2">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Ask Stemara Chat about any resource:
              </p>
              <button onClick={() => navigate('/chat')}
                className="w-full py-3 text-white font-bold rounded-xl text-sm"
                style={accentStyle}>
                Open Study Chat →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
