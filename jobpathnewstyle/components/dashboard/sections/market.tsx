"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Briefcase,
  Users,
  DollarSign,
  BarChart3,
  Filter,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface TrendingSkill {
  name: string;
  demand: number;
  growth: number;
  salaryImpact: string;
  jobs: number;
}

interface TrendingRole {
  name: string;
  openings: number;
  avgSalary: string;
  growth: number;
  status: "hot" | "growing" | "stable" | "declining";
}

export function MarketSection() {
  const [selectedRegion, setSelectedRegion] = useState<"azerbaijan" | "remote" | "global">("azerbaijan");

  const trendingSkills: TrendingSkill[] = [
    { name: "AI/Machine Learning", demand: 95, growth: 45, salaryImpact: "+35%", jobs: 124 },
    { name: "React/Next.js", demand: 92, growth: 28, salaryImpact: "+20%", jobs: 287 },
    { name: "TypeScript", demand: 88, growth: 32, salaryImpact: "+15%", jobs: 312 },
    { name: "Cloud (AWS/Azure)", demand: 85, growth: 25, salaryImpact: "+25%", jobs: 156 },
    { name: "DevOps/CI-CD", demand: 82, growth: 22, salaryImpact: "+20%", jobs: 98 },
    { name: "Python", demand: 80, growth: 18, salaryImpact: "+12%", jobs: 234 },
    { name: "Kubernetes", demand: 78, growth: 35, salaryImpact: "+30%", jobs: 67 },
    { name: "GraphQL", demand: 72, growth: 28, salaryImpact: "+10%", jobs: 89 },
  ];

  const trendingRoles: TrendingRole[] = [
    { name: "AI/ML Engineer", openings: 45, avgSalary: "5,000-8,000 AZN", growth: 65, status: "hot" },
    { name: "Full Stack Developer", openings: 156, avgSalary: "3,500-5,500 AZN", growth: 25, status: "hot" },
    { name: "DevOps Engineer", openings: 67, avgSalary: "4,000-6,000 AZN", growth: 35, status: "growing" },
    { name: "Frontend Developer", openings: 234, avgSalary: "2,500-4,500 AZN", growth: 18, status: "growing" },
    { name: "Backend Developer", openings: 189, avgSalary: "3,000-5,000 AZN", growth: 15, status: "stable" },
    { name: "Mobile Developer", openings: 78, avgSalary: "3,000-4,500 AZN", growth: 8, status: "stable" },
    { name: "QA Engineer", openings: 112, avgSalary: "2,000-3,500 AZN", growth: 5, status: "stable" },
    { name: "WordPress Developer", openings: 45, avgSalary: "1,500-2,500 AZN", growth: -12, status: "declining" },
  ];

  const marketStats = {
    totalJobs: 1247,
    newThisWeek: 89,
    avgSalary: "3,500 AZN",
    salaryGrowth: "+12%",
    topHiringCompanies: 34,
    remoteJobs: 312
  };

  const getStatusBadge = (status: TrendingRole["status"]) => {
    switch (status) {
      case "hot": return <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-medium flex items-center gap-1"><Zap className="w-3 h-3" />İsti</span>;
      case "growing": return <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" />Artır</span>;
      case "stable": return <span className="px-2 py-0.5 rounded-full bg-chart-1/20 text-chart-1 text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Sabit</span>;
      case "declining": return <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs font-medium flex items-center gap-1"><TrendingDown className="w-3 h-3" />Azalır</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Selector & Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent" />
          <div className="flex gap-2">
            {(["azerbaijan", "remote", "global"] as const).map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRegion === region
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {region === "azerbaijan" && "Azərbaycan"}
                {region === "remote" && "Remote"}
                {region === "global" && "Qlobal"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Son yenilənmə: Bu gün, 09:00
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <Briefcase className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">{marketStats.totalJobs.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Ümumi Vakansiya</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-accent">+{marketStats.newThisWeek}</p>
          <p className="text-xs text-muted-foreground">Bu həftə yeni</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <DollarSign className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">{marketStats.avgSalary}</p>
          <p className="text-xs text-muted-foreground">Orta Maaş</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <Activity className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-accent">{marketStats.salaryGrowth}</p>
          <p className="text-xs text-muted-foreground">Maaş Artımı (6 ay)</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <Users className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">{marketStats.topHiringCompanies}</p>
          <p className="text-xs text-muted-foreground">Aktiv Şirkət</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <Globe className="w-5 h-5 text-accent mb-2" />
          <p className="text-2xl font-bold text-foreground">{marketStats.remoteJobs}</p>
          <p className="text-xs text-muted-foreground">Remote İş</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Skills */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Ən Çox Tələb Olunan Skill-lər</h3>
            </div>
          </div>

          <div className="space-y-4">
            {trendingSkills.map((skill, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent">
                      {i + 1}
                    </span>
                    <span className="font-medium text-foreground">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${skill.growth > 20 ? "text-accent" : "text-foreground"}`}>
                      +{skill.growth}%
                    </span>
                    <TrendingUp className={`w-4 h-4 ${skill.growth > 20 ? "text-accent" : "text-muted-foreground"}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{skill.jobs} vakansiya</span>
                  <span className="text-accent">{skill.salaryImpact} maaşa təsir</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${skill.demand}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Roles */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Trending Peşələr</h3>
            </div>
          </div>

          <div className="space-y-4">
            {trendingRoles.map((role, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{role.name}</span>
                    {getStatusBadge(role.status)}
                  </div>
                  <span className="text-sm text-muted-foreground">{role.openings} iş</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{role.avgSalary}</span>
                  <span className={`flex items-center gap-1 ${
                    role.growth > 0 ? "text-accent" : "text-destructive"
                  }`}>
                    {role.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {role.growth > 0 ? "+" : ""}{role.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Balance */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Tələb-Təklif Balansı</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Shortage */}
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <h4 className="font-medium text-foreground">İşçi Çatışmazlığı</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Bu sahələrdə işçi tələbi təklifdən çoxdur - yüksək maaş və iş imkanları.
            </p>
            <div className="space-y-2">
              {["AI/ML Engineer", "DevOps Engineer", "Cloud Architect"].map((role, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Balanced */}
          <div className="p-4 rounded-xl bg-chart-1/5 border border-chart-1/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-chart-1" />
              <h4 className="font-medium text-foreground">Balanslaşdırılmış</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Bu sahələrdə tələb və təklif balanslaşdırılmışdır - sabit bazar.
            </p>
            <div className="space-y-2">
              {["Frontend Developer", "Backend Developer", "Full Stack Developer"].map((role, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Oversaturated */}
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-warning" />
              <h4 className="font-medium text-foreground">Doymuş Bazar</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Bu sahələrdə təklif tələbi üstələyir - rəqabət yüksəkdir.
            </p>
            <div className="space-y-2">
              {["Junior Developer", "WordPress Developer", "Graphic Designer"].map((role, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  {role}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
