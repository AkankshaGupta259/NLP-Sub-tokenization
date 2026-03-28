"use client";

import { useState, useEffect } from "react";

export default function AdvancedDashboard() {
  const [inputText, setInputText] = useState("Uncharacteristically, the artificial intelligence misunderstood the Hinglish prompt completely.");
  const [compareResults, setCompareResults] = useState<any>(null);
  const [reports, setReports] = useState<any>({ performance: [], robustness: [], fairness: [] });
  const [loading, setLoading] = useState(false);

  // Soft, professional color palette for token highlighting
  const tokenStyles = [
    "bg-sky-100 text-sky-900 border border-sky-200",
    "bg-indigo-100 text-indigo-900 border border-indigo-200",
    "bg-rose-100 text-rose-900 border border-rose-200",
    "bg-amber-100 text-amber-900 border border-amber-200",
    "bg-emerald-100 text-emerald-900 border border-emerald-200",
    "bg-slate-100 text-slate-900 border border-slate-200"
  ];

  // Fetch static report data on load
  useEffect(() => {
    fetch("http://localhost:8000/api/reports")
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Failed to load reports:", err));
  }, []);

  const handleTokenize = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/tokenize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setCompareResults(data);
    } catch (error) {
      console.error("API Error:", error);
      alert("Ensure FastAPI is running on port 8000");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Minimalist Professional Header */}
        <header className="border-b border-slate-200 pb-8 pt-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
            SUB-WORD TOKENIZATION PROJECT
          </h1>
          <p className="text-slate-500 text-lg">
            At a Glance Evaluation Result Dashboard
          </p>
        </header>

        {/* --- REPORT METRICS SECTION --- */}
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Performance Table */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 tracking-wide">
                BPE Performance Metrics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="p-3">Vocab Size</th>
                      <th className="p-3">Compression</th>
                      <th className="p-3">Tokens/Word</th>
                      <th className="p-3">Time (s)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.performance.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium text-slate-700">{row["Vocab Size"]}</td>
                        <td className="p-3 text-slate-600">{row["Compression Ratio"]}x</td>
                        <td className="p-3 text-slate-600">{row["Avg Tokens/Word"]}</td>
                        <td className="p-3 text-slate-600">{row["Time (s)"]}s</td>
                      </tr>
                    ))}
                    {reports.performance.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-slate-400">Awaiting data generation...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Fairness Table */}
            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 tracking-wide">
                 Linguistic Fairness Audit
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="p-3">Language / Dataset</th>
                      <th className="p-3">Tokens/Word</th>
                      <th className="p-3">OOV Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports.fairness.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-medium text-slate-700">{row["Language / Group"]}</td>
                        <td className={`p-3 font-medium ${row["Tokens per Word"] > 2.0 ? "text-slate-600" : "text-slate-500"}`}>
                          {row["Tokens per Word"]}
                        </td>
                        <td className="p-3 text-slate-600">{(row["OOV Rate"] * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                    {reports.fairness.length === 0 && (
                      <tr><td colSpan={3} className="p-4 text-center text-slate-400">Awaiting data generation...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Robustness Table (Full Width) */}
          <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 tracking-wide">
              Robustness Under Noisy Conditions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="p-3">Condition</th>
                    <th className="p-3">Text Sample</th>
                    <th className="p-3">Token Count</th>
                    <th className="p-3">Tokens/Word</th>
                    <th className="p-3">OOV Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.robustness.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-700">{row["Condition"]}</td>
                      <td className="p-3 text-slate-500 italic max-w-sm truncate" title={row["Text Sample"]}>"{row["Text Sample"]}"</td>
                      <td className="p-3 text-slate-600">{row["Token Count"]}</td>
                      <td className="p-3 text-slate-600">{row["Tokens/Word"]}</td>
                      <td className="p-3 text-slate-600">{(row["OOV Rate"] * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                  {reports.robustness.length === 0 && (
                    <tr><td colSpan={5} className="p-4 text-center text-slate-400">Awaiting data generation...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* --- EXPLAINABILITY DASHBOARD --- */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <header className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-2"> Multi-Model Alignment Visualizer</h2>
            <p className="text-slate-500">
              Input text to analyze sub-word token boundaries across different vocabulary sizes.
            </p>
          </header>
          
          <div className="flex flex-col gap-4 mb-10">
            {/* Replaced <input> with <textarea> for multiline support */}
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-400 outline-none text-base text-slate-700 transition-shadow resize-y leading-relaxed"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste a long paragraph here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleTokenize}
                disabled={loading}
                className="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? "Analyzing..." : "Compare Tokenizers"}
              </button>
            </div>
          </div>

          {compareResults && (
            <div className="space-y-8">
              {Object.keys(compareResults).sort((a,b) => Number(a) - Number(b)).map((size) => {
                const data = compareResults[size];
                return (
                  <div key={size} className="p-6 border border-slate-100 bg-slate-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                      <h3 className="font-medium text-slate-800">{size} Vocabulary Model</h3>
                      <div className="flex gap-4 text-sm text-slate-500">
                        <span>Tokens: {data.tokens.length}</span>
                        <span className="text-slate-300">|</span>
                        <span>OOV: {(data.oov_rate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 font-mono text-sm">
                      {data.tokens.map((token: string, idx: number) => (
                        <div key={idx} className={`${tokenStyles[idx % tokenStyles.length]} px-2.5 py-1.5 rounded flex items-center`}>
                          {token.replace("</w>", "")}
                          {token.includes("</w>") && <span className="opacity-40 ml-1">_</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* --- SALIENCY CASE STUDY --- */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-8">Token Saliency and Downstream Impact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Scenario A */}
            <div className="p-6 rounded-lg bg-emerald-50/50 border border-emerald-100">
              <h3 className="text-base font-semibold text-emerald-900 mb-4">Semantic Preservation (Larger Vocab)</h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Target Word: <code className="bg-white px-2 py-1 border border-slate-200 rounded text-slate-800">unfriendliness</code>
                </p>
                <div className="flex gap-2 font-mono text-sm flex-wrap">
                  <span className="bg-sky-100 text-sky-900 border border-sky-200 px-2 py-1 rounded">un</span>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1 rounded">friend</span>
                  <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 px-2 py-1 rounded">li</span>
                  <span className="bg-rose-100 text-rose-900 border border-rose-200 px-2 py-1 rounded">ness</span>
                </div>
                <div className="pt-2 text-sm text-emerald-800 leading-relaxed">
                  <span className="font-medium">Impact:</span> A downstream sentiment model easily isolates the negation ("un") and core noun ("friend"), correctly predicting a negative sentiment.
                </div>
              </div>
            </div>

            {/* Scenario B */}
            <div className="p-6 rounded-lg bg-rose-50/50 border border-rose-100">
              <h3 className="text-base font-semibold text-rose-900 mb-4">Semantic Fragmentation (Small Vocab)</h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Target Word: <code className="bg-white px-2 py-1 border border-slate-200 rounded text-slate-800">unfriendliness</code>
                </p>
                <div className="flex gap-2 font-mono text-sm flex-wrap">
                  <span className="bg-sky-100 text-sky-900 border border-sky-200 px-2 py-1 rounded">unf</span>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-1 rounded">rie</span>
                  <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 px-2 py-1 rounded">ndl</span>
                  <span className="bg-rose-100 text-rose-900 border border-rose-200 px-2 py-1 rounded">ine</span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-1 rounded">ss</span>
                </div>
                <div className="pt-2 text-sm text-rose-800 leading-relaxed">
                  <span className="font-medium">Impact:</span> Morphological roots are destroyed. The model fails to recognize "unf" or "rie", losing the semantic meaning entirely and outputting a neutral/confused prediction.
                </div>
              </div>
            </div>
            
          </div>
        </section>

      </div>
    </main>
  );
}