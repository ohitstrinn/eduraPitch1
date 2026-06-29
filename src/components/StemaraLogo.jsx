export default function StemaraLogo({ className = "h-10", color = "#ffffff", showTagline = false }) {
  return (
    <div className="flex flex-col items-start">
      <svg
        className={className}
        viewBox="0 0 180 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* S mark */}
        <rect x="0" y="4" width="32" height="32" rx="8" fill={color} fillOpacity="0.15" />
        <text x="8" y="27" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="22" fill={color}>S</text>
        {/* Wordmark */}
        <text x="40" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="20" fill={color} letterSpacing="-0.5">temara</text>
      </svg>
      {showTagline && (
        <span style={{ color }} className="text-xs font-medium opacity-70 mt-0.5 pl-0.5">
          AI Study Platform
        </span>
      )}
    </div>
  );
}
