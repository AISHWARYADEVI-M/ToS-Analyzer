const colorMap = {
  red: {
    bg: "bg-red-950",
    border: "border-red-700",
    badge: "bg-red-600",
    text: "text-red-300",
    icon: "🔴",
  },
  yellow: {
    bg: "bg-yellow-950",
    border: "border-yellow-700",
    badge: "bg-yellow-500",
    text: "text-yellow-300",
    icon: "🟡",
  },
  green: {
    bg: "bg-green-950",
    border: "border-green-800",
    badge: "bg-green-600",
    text: "text-green-300",
    icon: "🟢",
  },
};

export default function RiskBadge({ risk, total }) {
  const c = colorMap[risk.color] || colorMap.green;
  return (
    <div className={`rounded-2xl border ${c.bg} ${c.border} p-6 flex items-center justify-between`}>
      <div className="space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Overall Risk</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{c.icon}</span>
          <span className={`text-2xl font-bold ${c.text}`}>{risk.label}</span>
        </div>
        <p className="text-xs text-gray-500">{total} sentences analyzed</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400 mb-1">Risk Score</p>
        <div className={`text-4xl font-black ${c.text}`}>{risk.score}</div>
        <p className="text-xs text-gray-500">out of 100</p>
      </div>
    </div>
  );
}
