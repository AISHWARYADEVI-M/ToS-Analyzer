import { useState, useRef } from "react";
import RiskBadge from "./components/RiskBadge";
import VerdictCard from "./components/VerdictCard";
import CategoryPills from "./components/CategoryPills";
import HighlightedSentences from "./components/HighlightedSentences";

const TABS = ["URL", "Paste Text", "Upload PDF"];

export default function App() {
  const [tab, setTab] = useState("URL");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const fileInputRef = useRef();

  const canSubmit = () => {
    if (tab === "URL") return url.trim().length > 0;
    if (tab === "Paste Text") return text.trim().length > 50;
    if (tab === "Upload PDF") return pdfFile !== null;
  };

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300000); // 5 min timeout
    
    try {
      let res;
      if (tab === "Upload PDF") {
        const form = new FormData();
        form.append("file", pdfFile);
        res = await fetch("http://localhost:8000/analyze/pdf", {
          method: "POST",
          body: form,
          signal: controller.signal,
        });
      } else {
        res = await fetch("http://localhost:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tab === "URL" ? { url } : { text }),
          signal: controller.signal,
        });
      }
      clearTimeout(timeout);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Network error" }));
        throw new Error(err.detail || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      if (e.name === "AbortError") {
        setError("Request timed out. The backend server may be starting up. Please try again.");
      } else {
        setError(e.message || "An error occurred. Make sure the backend is running at http://localhost:8000");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const filteredSentences = result?.flagged_sentences?.filter(
    (s) => filter === "all" || s.risk === filter
  );

  const resetAll = () => {
    setResult(null);
    setError("");
    setUrl("");
    setText("");
    setPdfFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">🔍</span>
        <div>
          <h1 className="text-lg font-bold tracking-tight">ToS Red Flag Analyzer</h1>
          <p className="text-xs text-gray-400">Exposing the fine print you never read</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); resetAll(); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {t === "URL" ? "🔗 URL" : t === "Paste Text" ? "📝 Paste Text" : "📄 Upload PDF"}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="space-y-3">
          {tab === "URL" && (
            <>
              <label className="text-sm font-medium text-gray-300">Terms of Service URL</label>
              <div className="flex gap-3">
                <input
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="https://www.instagram.com/legal/terms/"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canSubmit() && analyze()}
                />
                <button
                  onClick={analyze}
                  disabled={loading || !canSubmit()}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>
            </>
          )}

          {tab === "Paste Text" && (
            <>
              <label className="text-sm font-medium text-gray-300">Paste Terms of Service text</label>
              <textarea
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                placeholder="Paste the full Terms of Service text here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{text.length} characters</span>
                <button
                  onClick={analyze}
                  disabled={loading || !canSubmit()}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>
            </>
          )}

          {tab === "Upload PDF" && (
            <>
              <label className="text-sm font-medium text-gray-300">Upload a PDF</label>
              <div
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
                  pdfFile
                    ? "border-indigo-500 bg-indigo-950/30"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setPdfFile(e.target.files[0] || null)}
                />
                {pdfFile ? (
                  <div className="space-y-1">
                    <p className="text-2xl">📄</p>
                    <p className="text-sm font-medium text-indigo-300">{pdfFile.name}</p>
                    <p className="text-xs text-gray-500">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                      className="text-xs text-red-400 hover:text-red-300 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-gray-400">
                    <p className="text-3xl">📂</p>
                    <p className="text-sm">Click to upload a PDF</p>
                    <p className="text-xs text-gray-600">ToS document, privacy policy, etc.</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={analyze}
                  disabled={loading || !canSubmit()}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition"
                >
                  {loading ? "Analyzing…" : "Analyze"}
                </button>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-950/50 border border-red-700 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-red-400">⚠️ Error</p>
              <p className="text-sm text-red-300">{error}</p>
              {error.includes("timed out") && (
                <p className="text-xs text-red-400 mt-2">
                  💡 Tip: First run takes a few minutes while the AI model (1.6GB) downloads. Please wait or try again.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16 text-gray-400">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Reading the fine print so you don't have to…</p>
              <p className="text-xs text-gray-500">This may take a few minutes on the first run while the AI model loads</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            <RiskBadge risk={result.overall_risk} total={result.total_sentences_analyzed} />

            {result.verdict && (
              <VerdictCard verdict={result.verdict} riskColor={result.overall_risk.color} />
            )}

            {result.categories.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Risk Categories Found
                </h2>
                <CategoryPills categories={result.categories} />
              </div>
            )}

            {result.flagged_sentences.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Flagged Clauses ({result.flagged_sentences.length})
                  </h2>
                  <div className="flex gap-2 text-xs">
                    {["all", "high", "medium"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full capitalize font-medium transition ${
                          filter === f
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <HighlightedSentences sentences={filteredSentences} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}