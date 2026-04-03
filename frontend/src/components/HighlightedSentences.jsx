const riskStyles = {
  high: {
    border: "border-red-700",
    bg: "bg-red-950/40",
    badge: "bg-red-700 text-red-100",
    label: "🔴 High Risk",
  },
  medium: {
    border: "border-yellow-700",
    bg: "bg-yellow-950/40",
    badge: "bg-yellow-600 text-yellow-100",
    label: "🟡 Medium Risk",
  },
  low: {
    border: "border-gray-700",
    bg: "bg-gray-900",
    badge: "bg-gray-700 text-gray-300",
    label: "🟢 Low Risk",
  },
};

const categoryEmoji = {
  "data sharing with third parties": "📤",
  "payment and billing": "💳",
  "account deletion": "🗑️",
  "data retention": "💾",
  "third-party tracking": "👁️",
  "auto-renewal subscription": "🔁",
};

export default function HighlightedSentences({ sentences }) {
  if (!sentences || sentences.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No clauses found for this filter.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sentences.map((s, i) => {
        const style = riskStyles[s.risk] || riskStyles.low;
        return (
          <div
            key={i}
            className={`rounded-xl border ${style.border} ${style.bg} p-4 space-y-2`}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                {style.label}
              </span>
              <span className="text-xs text-gray-400 capitalize">
                {categoryEmoji[s.category] || "⚠️"} {s.category}
                <span className="ml-2 text-gray-600">· {Math.round(s.confidence * 100)}% confidence</span>
              </span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{s.sentence}</p>
          </div>
        );
      })}
    </div>
  );
}
