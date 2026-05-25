"use client";

import { Gauge, Sparkles, ArrowRight } from "lucide-react";

export function CareerScoreCard() {
  const score = 78;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const improvements = [
    "2 sertifikat əlavə et",
    "Portfel layihəsi yarat",
    "Haqqında mətnini tamamla",
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Career Score</h3>
        </div>

        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-accent transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{score}</span>
            </div>
          </div>

          {/* Improvements */}
          <div className="flex-1 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Yüksəltmək üçün:
            </p>
            {improvements.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
          <span>Profili Optimallaşdır</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
