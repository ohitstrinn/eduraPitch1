import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', path: '/dashboard' },
  { icon: '📄', label: 'Syllabus', path: '/syllabus' },
  { icon: '💬', label: 'Chat', path: '/chat' },
  { icon: '🧠', label: 'Study', path: '/recommendations' },
  { icon: '📚', label: 'More', path: '/student' },
];

export default function StemBottomNav({ school }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeColor = school?.colors.primary || '#003C8A';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-bottom">
      <div className="max-w-2xl mx-auto flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
                isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
              style={isActive ? { color: activeColor } : { color: '#6b7280' }}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full"
                  style={{ background: activeColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
