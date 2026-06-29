import { useApp } from "../context/AppContext";

export default function SchoolBadge({ school: propSchool, size = "sm" }) {
  const { school: ctxSchool } = useApp();
  const s = propSchool || ctxSchool;
  if (!s) return null;

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizes[size]}`}
      style={{ backgroundColor: s.colors.secondary, color: s.colors.text }}
    >
      {s.shortName}
    </span>
  );
}
