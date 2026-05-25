"use client";

import { Sun, Briefcase, Zap, RefreshCw } from "lucide-react";

export function DailyDigest() {
  const todayJobs = [
    { title: "Senior Frontend Developer", company: "TechCorp", match: 94 },
    { title: "React Developer", company: "StartupAZ", match: 89 },
    { title: "Full Stack Engineer", company: "DigiBank", match: 85 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">Günlük Xülasə</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Bu gün, 09:00
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Bu gün sənin üçün <span className="text-accent font-semibold">5 yeni uyğun iş</span> var. 
        3-ü çox uyğun, 2-si potensial.
      </p>

      <div className="space-y-3 mb-4">
        {todayJobs.map((job, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-accent">{job.match}%</span>
              <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${job.match}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
          <Briefcase className="w-4 h-4" />
          <span>İşləri Göstər</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Zap className="w-4 h-4" />
          <span>Auto-Apply</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
