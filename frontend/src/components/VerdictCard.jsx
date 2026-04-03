const verdictStyle = {
  high: {
    bg: "bg-red-950/50",
    border: "border-red-700",
    text: "text-red-300",
    headerBg: "bg-red-900/40",
    icon: "⚠️",
  },
  medium: {
    bg: "bg-yellow-950/50",
    border: "border-yellow-700",
    text: "text-yellow-300",
    headerBg: "bg-yellow-900/40",
    icon: "⚠️",
  },
  green: {
    bg: "bg-green-950/50",
    border: "border-green-700",
    text: "text-green-300",
    headerBg: "bg-green-900/40",
    icon: "✅",
  },
};

export default function VerdictCard({ verdict, riskColor }) {
  const style = verdictStyle[riskColor] || verdictStyle.green;
  
  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-6 space-y-3 animate-slide-up`}>
      <div className={`${style.headerBg} px-3 py-2 rounded-lg border ${style.border}`}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Final Verdict
        </p>
        <p className={`text-lg font-bold ${style.text} leading-relaxed flex items-start gap-2`}>
          <span className="text-2xl flex-shrink-0">{style.icon}</span>
          <span>{verdict}</span>
        </p>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Tip: Scroll down to review the specific flagged clauses in detail.</p>
      </div>
    </div>
  );
}
