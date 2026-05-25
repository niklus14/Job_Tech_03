"use client";

import { Sparkles, MapPin, Clock, ArrowRight } from "lucide-react";

export function RecentMatches() {
  const matches = [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Azerbaijan",
      location: "Bakı",
      salary: "3,000 - 4,500 AZN",
      match: 94,
      time: "2 saat əvvəl",
      reason: "React, TypeScript, 4+ il təcrübə",
    },
    {
      title: "React Developer",
      company: "StartupAZ",
      location: "Bakı (Remote)",
      salary: "2,500 - 3,500 AZN",
      match: 89,
      time: "5 saat əvvəl",
      reason: "React, Next.js, Frontend",
    },
    {
      title: "Full Stack Engineer",
      company: "DigiBank",
      location: "Bakı",
      salary: "4,000 - 5,500 AZN",
      match: 85,
      time: "1 gün əvvəl",
      reason: "Node.js, React, PostgreSQL",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Son Uyğun İşlər</h3>
        </div>
        <button className="text-xs text-accent hover:underline">
          Hamısını gör
        </button>
      </div>

      <div className="space-y-4">
        {matches.map((job, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {job.title}
                </h4>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10">
                <span className="text-sm font-semibold text-accent">{job.match}%</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.time}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">Niyə uyğundur:</span> {job.reason}
              </p>
              <span className="text-sm font-medium text-foreground">{job.salary}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
        <span>Bütün İşlərə Bax</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
