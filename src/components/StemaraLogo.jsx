import { useApp } from "../context/AppContext";

export default function StemaraLogo({ size = "md", white = false }) {
  const { school } = useApp();
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  return (
    <div className={`font-black tracking-tight ${sizes[size]} ${white ? "text-white" : ""}`}
      style={!white ? { color: school?.colors?.primary || "#0F172A" } : {}}>
      Stemara
      <span className="inline-block w-2 h-2 rounded-full ml-1 mb-1 align-middle"
        style={{ backgroundColor: school?.colors?.secondary || "#F59E0B" }} />
    </div>
  );
}
