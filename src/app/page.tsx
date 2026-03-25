"use client";

import { useState, useEffect } from "react";

type AnalysisResult = {
  score: number;
  insight: string;
  reality: string;
  recommendation: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data dari API.");
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Gagal nyambung ke AI:", error);
      setResult({
        score: 65,
        insight: "Koneksi ke AI terputus. AI lagi capek kayaknya.",
        reality: "Terkadang hal teknis bikin kita terhambat, tapi yaudah lah ya.",
        recommendation: "Cek koneksi internet, cek terminal, atau coba beberapa saat lagi.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
  };

  const isButtonDisabled = !mounted || !input.trim() || isAnalyzing;

  return (
    <main className="min-h-screen flex flex-col bg-zinc-950 relative selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Gradient Spot */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Container Utama (Pake flex-grow biar footer ke dorong ke bawah) */}
      <div className="w-full max-w-3xl mx-auto px-4 md:px-8 pt-16 pb-8 flex-grow flex flex-col justify-center z-10">
        
        {/* 🔥 HEADER YANG DIPERBAGUS 🔥 */}
        <header className="space-y-6 animate-fade-in text-center flex flex-col items-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-indigo-400 shadow-lg backdrop-blur-sm">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
             <span className="text-xs font-bold tracking-widest uppercase">
               Rate My Life AI Engine
             </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 pb-2">
            Life Analysis
          </h1>
          
          <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
            Dapatkan insight objektif dari AI. Tulis apa adanya, dan bersiap untuk reality check renyah namun jujur. Tanpa filter, tanpa bias.
          </p>
        </header>

        {/* Input Section */}
        {!result && !isAnalyzing && (
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-2xl rounded-2xl p-2 animate-slide-up group ring-2 ring-transparent focus-within:ring-indigo-500/50 focus-within:border-transparent transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
            <div className="p-4 md:p-5 relative z-10">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ceritakan kondisimu saat ini se-jujur mungkin..."
                className="w-full h-40 md:h-48 bg-transparent text-zinc-200 placeholder:text-zinc-600 resize-none outline-none text-base md:text-lg leading-relaxed"
                maxLength={1000}
                spellCheck={false}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 pt-3 border-t border-zinc-800/80 relative z-10">
              <span className="text-xs text-zinc-500 font-medium">
                <span className={input.length > 900 ? "text-red-400" : "text-zinc-400"}>{input.length}</span> / 1000
              </span>
              <button
                onClick={handleAnalyze}
                disabled={!!isButtonDisabled}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-400 hover:to-blue-500 transition-all duration-300 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span>Analyze</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isAnalyzing && (
          <div className="space-y-6 animate-slide-up">
            <div className="saas-card flex flex-col items-center justify-center p-14 rounded-2xl border border-zinc-800 bg-zinc-900/50">
               <div className="relative flex flex-col items-center">
                 <div className="w-12 h-12 mb-6 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                 <div className="h-4 w-48 shimmer rounded-full mb-3 bg-zinc-800"></div>
                 <div className="h-3 w-32 shimmer rounded-full opacity-60 bg-zinc-800"></div>
               </div>
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && !isAnalyzing && (
          <div className="space-y-6 animate-slide-up">
            
            {/* Score Card */}
            <div className="saas-card rounded-[2rem] p-10 md:p-14 flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500 border border-zinc-800 bg-zinc-900/50">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 relative z-10">
                Life Score
              </span>
              
              <div className="flex items-start gap-1 relative z-10 mb-2">
                <div className="absolute inset-0 bg-indigo-500/15 blur-[50px] rounded-full scale-150 pointer-events-none"></div>
                <span className="relative text-8xl md:text-[9rem] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-500 drop-shadow-md">
                  {result.score}
                </span>
                <span className="relative text-2xl text-indigo-500 mt-4 font-bold tracking-tight">/ 100</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="saas-card rounded-xl p-6 group cursor-default border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 shadow-inner">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Analogi AI</h3>
                    <h4 className="text-sm font-semibold text-zinc-100">Insight</h4>
                  </div>
                </div>
                <p className="text-zinc-400 group-hover:text-zinc-300 leading-relaxed text-sm md:text-base transition-colors duration-300">
                  {result.insight}
                </p>
              </div>
              
              <div className="saas-card rounded-xl p-6 group cursor-default border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 shadow-inner">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Fakta Pahit</h3>
                    <h4 className="text-sm font-semibold text-zinc-100">Reality Check</h4>
                  </div>
                </div>
                <p className="text-zinc-400 group-hover:text-zinc-300 leading-relaxed text-sm md:text-base transition-colors duration-300">
                  {result.reality}
                </p>
              </div>

              <div className="saas-card rounded-xl p-6 md:col-span-2 group cursor-default border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 shadow-inner">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Tindakan</h3>
                    <h4 className="text-sm font-semibold text-zinc-100">Saran Berikutnya</h4>
                  </div>
                </div>
                <p className="text-zinc-400 group-hover:text-zinc-300 leading-relaxed text-sm md:text-base transition-colors duration-300">
                  {result.recommendation}
                </p>
              </div>

            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleReset}
                className="group flex items-center gap-2 px-6 py-3 text-zinc-400 hover:text-indigo-400 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/50 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Mulai Ulang
              </button>
            </div>
            
          </div>
        )}

      </div>

      {/* 🔥 NEW: COPYRIGHT FOOTER 🔥 */}
      <footer className="w-full text-center py-6 mt-auto border-t border-zinc-900/50 bg-zinc-950/80 backdrop-blur-sm z-10">
        <p className="text-zinc-600 text-sm font-medium tracking-wide">
          &copy; {new Date().getFullYear()} <span className="text-zinc-400 hover:text-indigo-400 transition-colors duration-300 cursor-pointer">Daffa Al Syaddad</span>. All rights reserved.
        </p>
      </footer>

    </main>
  );
}