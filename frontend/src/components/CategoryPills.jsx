const categoryEmoji = {
  "data sharing with third parties": "📤",
  "payment and billing": "💳",
  "account deletion": "🗑️",
  "data retention": "💾",
  "third-party tracking": "👁️",
  "auto-renewal subscription": "🔁",
};

export default function CategoryPills({ categories }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(({ category, count }) => (
        <div
          key={category}
          className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm"
        >
          <span>{categoryEmoji[category] || "⚠️"}</span>
          <span className="capitalize text-gray-200">{category}</span>
          <span className="bg-gray-700 text-gray-400 text-xs rounded-full px-2 py-0.5 font-mono">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
