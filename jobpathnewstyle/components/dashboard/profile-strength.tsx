"use client";

import { Shield, Check, AlertCircle, ChevronRight } from "lucide-react";

export function ProfileStrength() {
  const sections = [
    { name: "Əsas məlumatlar", complete: true, percent: 100 },
    { name: "İş təcrübəsi", complete: true, percent: 100 },
    { name: "Təhsil", complete: true, percent: 100 },
    { name: "Bacarıqlar", complete: false, percent: 75 },
    { name: "Sertifikatlar", complete: false, percent: 40 },
    { name: "Dillər", complete: true, percent: 100 },
    { name: "Haqqında mətn", complete: false, percent: 60 },
  ];

  const totalPercent = Math.round(
    sections.reduce((acc, s) => acc + s.percent, 0) / sections.length
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Profil Gücü</h3>
        </div>
        <span className="text-2xl font-bold text-accent">{totalPercent}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-secondary mb-6 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${totalPercent}%` }}
        />
      </div>

      <div className="space-y-3">
        {sections.map((section, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  section.complete
                    ? "bg-accent/20 text-accent"
                    : "bg-warning/20 text-warning"
                }`}
              >
                {section.complete ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="text-sm text-foreground">{section.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {section.percent}%
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
