"use client";

import { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter, 
  Zap, 
  Heart,
  ExternalLink,
  CheckCircle,
  XCircle,
  ChevronDown,
  TrendingUp,
  Building2,
  Sparkles
} from "lucide-react";

type JobStatus = "new" | "applied" | "saved" | "rejected";
type MatchLevel = "perfect" | "good" | "potential";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchPercent: number;
  matchLevel: MatchLevel;
  matchReason: string;
  postedAt: string;
  status: JobStatus;
  skills: string[];
  description: string;
  hiringProbability: number;
}

export function JobsSection() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "perfect" | "good" | "potential">("all");
  const [showAutoApply, setShowAutoApply] = useState(false);

  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Azerbaijan",
      location: "Bakı",
      salary: "3,000 - 4,500 AZN",
      type: "Tam iş günü",
      matchPercent: 94,
      matchLevel: "perfect",
      matchReason: "React, TypeScript təcrübən və 4+ illik iş təcrübən bu vəzifəyə mükəmməl uyğun gəlir.",
      postedAt: "2 saat əvvəl",
      status: "new",
      skills: ["React", "TypeScript", "Next.js", "Node.js"],
      description: "Yüksək performanslı veb tətbiqlər inkişaf etdirmək üçün təcrübəli frontend developer axtarırıq.",
      hiringProbability: 78
    },
    {
      id: "2",
      title: "React Developer",
      company: "StartupAZ",
      location: "Bakı (Hibrid)",
      salary: "2,500 - 3,500 AZN",
      type: "Tam iş günü",
      matchPercent: 89,
      matchLevel: "perfect",
      matchReason: "React və Next.js bacarıqların bu startup üçün ideal profil yaradır.",
      postedAt: "5 saat əvvəl",
      status: "new",
      skills: ["React", "Next.js", "Tailwind CSS"],
      description: "Dinamik startup komandasına qoşulacaq React developer axtarırıq.",
      hiringProbability: 72
    },
    {
      id: "3",
      title: "Full Stack Engineer",
      company: "DigiBank",
      location: "Bakı",
      salary: "4,000 - 5,500 AZN",
      type: "Tam iş günü",
      matchPercent: 85,
      matchLevel: "good",
      matchReason: "Frontend bacarıqların güclüdür, backend təcrübəni artırmaq faydalı olardı.",
      postedAt: "1 gün əvvəl",
      status: "saved",
      skills: ["React", "Node.js", "PostgreSQL", "Docker"],
      description: "Fintech sahəsində təcrübəli full stack mühəndis axtarırıq.",
      hiringProbability: 65
    },
    {
      id: "4",
      title: "UI/UX Developer",
      company: "DesignStudio",
      location: "Bakı (Remote)",
      salary: "2,000 - 3,000 AZN",
      type: "Tam iş günü",
      matchPercent: 75,
      matchLevel: "good",
      matchReason: "Frontend bacarıqların var, lakin UI/UX dizayn təcrübəsi tələb olunur.",
      postedAt: "2 gün əvvəl",
      status: "new",
      skills: ["Figma", "React", "CSS", "Design Systems"],
      description: "Kreativ UI/UX developer axtarırıq.",
      hiringProbability: 55
    },
    {
      id: "5",
      title: "Tech Lead",
      company: "EnterpriseAZ",
      location: "Bakı",
      salary: "5,500 - 7,000 AZN",
      type: "Tam iş günü",
      matchPercent: 68,
      matchLevel: "potential",
      matchReason: "Texniki bacarıqlar var, lakin komanda rəhbərliyi təcrübəsi artırılmalıdır.",
      postedAt: "3 gün əvvəl",
      status: "new",
      skills: ["React", "Node.js", "AWS", "Team Leadership"],
      description: "Böyük texniki komandaya rəhbərlik edəcək Tech Lead axtarırıq.",
      hiringProbability: 45
    },
    {
      id: "6",
      title: "Mobile Developer",
      company: "AppFactory",
      location: "Bakı (Hibrid)",
      salary: "3,000 - 4,000 AZN",
      type: "Tam iş günü",
      matchPercent: 58,
      matchLevel: "potential",
      matchReason: "React Native bilgisi var, lakin native mobil təcrübə məhduddur.",
      postedAt: "4 gün əvvəl",
      status: "rejected",
      skills: ["React Native", "iOS", "Android", "TypeScript"],
      description: "Cross-platform mobil tətbiqlər inkişaf etdirəcək developer axtarırıq.",
      hiringProbability: 35
    }
  ];

  const filteredJobs = selectedFilter === "all" 
    ? jobs 
    : jobs.filter(job => job.matchLevel === selectedFilter);

  const stats = {
    total: jobs.length,
    perfect: jobs.filter(j => j.matchLevel === "perfect").length,
    good: jobs.filter(j => j.matchLevel === "good").length,
    potential: jobs.filter(j => j.matchLevel === "potential").length,
    applied: jobs.filter(j => j.status === "applied").length,
  };

  const getMatchColor = (level: MatchLevel) => {
    switch (level) {
      case "perfect": return "text-accent bg-accent/10";
      case "good": return "text-chart-1 bg-chart-1/10";
      case "potential": return "text-warning bg-warning/10";
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case "new": return null;
      case "applied": return <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">Müraciət edilib</span>;
      case "saved": return <span className="px-2 py-0.5 rounded-full bg-chart-1/20 text-chart-1 text-xs">Saxlanılıb</span>;
      case "rejected": return <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">Rədd edilib</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Ümumi İşlər</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-accent">{stats.perfect}</p>
          <p className="text-sm text-muted-foreground">Mükəmməl Uyğun</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-chart-1">{stats.good}</p>
          <p className="text-sm text-muted-foreground">Yaxşı Uyğun</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-warning">{stats.potential}</p>
          <p className="text-sm text-muted-foreground">Potensial</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{stats.applied}</p>
          <p className="text-sm text-muted-foreground">Müraciət Edilən</p>
        </div>
      </div>

      {/* Auto-Apply Banner */}
      <div className="bg-gradient-to-r from-accent/10 to-chart-1/10 border border-accent/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Auto-Apply Aktivləşdir</h3>
              <p className="text-sm text-muted-foreground">
                Sistem avtomatik olaraq ən uyğun işlərə müraciət edəcək (gündə max 3 müraciət)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAutoApply(!showAutoApply)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              showAutoApply ? "bg-accent" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-foreground transition-transform ${
                showAutoApply ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {showAutoApply && (
          <div className="mt-4 pt-4 border-t border-accent/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Gündəlik Limit</label>
                <select className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm">
                  <option>2 müraciət</option>
                  <option>3 müraciət</option>
                  <option>5 müraciət</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Minimum Uyğunluq</label>
                <select className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm">
                  <option>85% və yuxarı</option>
                  <option>80% və yuxarı</option>
                  <option>75% və yuxarı</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Motivasiya Məktubu</label>
                <select className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm">
                  <option>AI ilə generasiya</option>
                  <option>Standart şablon</option>
                  <option>Əlavə etmə</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtr:</span>
        </div>
        <div className="flex gap-2">
          {(["all", "perfect", "good", "potential"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter === "all" && "Hamısı"}
              {filter === "perfect" && "Mükəmməl"}
              {filter === "good" && "Yaxşı"}
              {filter === "potential" && "Potensial"}
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getMatchColor(job.matchLevel)}`}>
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">{job.matchPercent}%</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {job.type}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.postedAt}
              </span>
            </div>

            {/* Match Reason */}
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">Niyə uyğundur?</p>
                  <p className="text-sm text-muted-foreground">{job.matchReason}</p>
                </div>
              </div>
            </div>

            {/* Hiring Probability */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-muted-foreground">İşə götürülmə ehtimalı:</span>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    job.hiringProbability >= 70 ? "bg-accent" : 
                    job.hiringProbability >= 50 ? "bg-chart-1" : "bg-warning"
                  }`}
                  style={{ width: `${job.hiringProbability}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{job.hiringProbability}%</span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-md bg-secondary text-xs text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {job.status !== "applied" && (
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  <span>Müraciət Et</span>
                </button>
              )}
              {job.status === "applied" && (
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary text-muted-foreground text-sm font-medium cursor-not-allowed">
                  <CheckCircle className="w-4 h-4" />
                  <span>Müraciət Edilib</span>
                </button>
              )}
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
