import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSchool } from '../context/SchoolContext';
import { SCHOOL_LIST } from '../data/schools';

export default function SchoolDirectory() {
  const { school } = useSchool();

  const primaryColor = school?.colors?.primary || '#1b3a6b';
  const lightBg = school?.colors?.light || '#d6e3f7';

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-4xl mb-4">🏫</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No school selected</h2>
        <p className="text-gray-500 text-sm mb-6">Go back to the landing page and select your school.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl text-white font-bold"
          style={{ backgroundColor: '#1b3a6b' }}
        >
          Select a school
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: school.colors.bg }}>
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8"
        style={{ background: `linear-gradient(135deg, ${school.colors.primary}, ${school.colors.dark || school.colors.primary})` }}
      >
        <Link to="/dashboard" className="text-white/60 text-sm mb-4 block">← Back</Link>
        <div className="text-5xl mb-3">{school.emoji}</div>
        <h1 className="text-3xl font-black text-white">{school.name}</h1>
        <p className="text-white/70 text-sm mt-1">{school.location} · {school.type}</p>
        <p className="text-white/90 italic text-sm mt-3">"{school.tagline}"</p>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Students', value: school.studentCount },
            { label: 'Founded', value: school.founded },
            { label: 'Modality', value: school.modality.split(' + ')[0] },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="font-black text-gray-900 text-lg">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Stemara for this school */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="font-black text-gray-900 mb-3">Why Stemara for {school.shortName}</div>
          <p className="text-sm text-gray-600 mb-4">{school.pitch}</p>
          <div className="space-y-2">
            {school.valueProps.map((vp) => (
              <div
                key={vp}
                className="flex items-start gap-2 p-3 rounded-xl text-sm"
                style={{ backgroundColor: lightBg }}
              >
                <span style={{ color: primaryColor }}>✓</span>
                <span className="text-gray-700">{vp}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Programs */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="font-black text-gray-900 mb-3">Programs available</div>
          <div className="flex flex-wrap gap-2">
            {school.programs.map((prog) => (
              <span
                key={prog}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: lightBg, color: primaryColor }}
              >
                {prog}
              </span>
            ))}
          </div>
        </div>

        {/* Sample courses */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="font-black text-gray-900 mb-3">Sample courses</div>
          <div className="space-y-3">
            {school.sampleCourses.map((course) => (
              <div key={course.code} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  📘
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900">{course.code}: {course.name}</div>
                  <div className="text-xs text-gray-500">{course.professor} · {course.credits} credits</div>
                </div>
                <Link to="/syllabus">
                  <button
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: lightBg, color: primaryColor }}
                  >
                    Upload
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Switch school */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="font-black text-gray-900 mb-3">Other schools on Stemara</div>
          <div className="grid grid-cols-2 gap-2">
            {SCHOOL_LIST.filter((s) => s.id !== school.id).map((s) => (
              <Link key={s.id} to={`/?school=${s.id}`}>
                <div
                  className="p-3 rounded-xl border-2 border-gray-100 text-sm font-semibold text-gray-700 hover:border-gray-200 transition-colors flex items-center gap-2"
                >
                  <span>{s.emoji}</span>
                  <span>{s.shortName}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
