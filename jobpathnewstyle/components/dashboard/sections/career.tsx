"use client";

import { 
  Map, 
  Target, 
  CheckCircle, 
  Circle, 
  Clock, 
  Award, 
  Briefcase,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface MilestoneStep {
  title: string;
  description: string;
  duration: string;
  status: "completed" | "current" | "upcoming";
  items: string[];
}

interface Milestone {
  title: string;
  targetDate: string;
  expectedSalary: string;
  expectedRole: string;
  progress: number;
  steps: MilestoneStep[];
}

export function CareerSection() {
  const currentRole = "Senior Frontend Developer";
  const targetRole = "Tech Lead / Engineering Manager";
  const estimatedTime = "18-24 ay";

  const milestones: Milestone[] = [
    {
      title: "Faza 1: Texniki Dərinləşmə",
      targetDate: "Sentyabr 2026",
      expectedSalary: "4,000-5,000 AZN",
      expectedRole: "Senior Full Stack Developer",
      progress: 60,
      steps: [
        {
          title: "Backend Bacarıqlarını Gücləndir",
          description: "Node.js, PostgreSQL və API dizayn bacarıqlarını inkişaf etdir",
          duration: "3 ay",
          status: "completed",
          items: ["Node.js Advanced", "PostgreSQL Optimization", "REST & GraphQL API Design"]
        },
        {
          title: "DevOps Əsasları",
          description: "Docker, CI/CD və cloud əsaslarını öyrən",
          duration: "2 ay",
          status: "current",
          items: ["Docker & Containers", "GitHub Actions", "AWS Fundamentals"]
        },
        {
          title: "System Design",
          description: "Böyük miqyaslı sistemlərin dizaynını öyrən",
          duration: "2 ay",
          status: "upcoming",
          items: ["Scalability Patterns", "Microservices", "Database Sharding"]
        }
      ]
    },
    {
      title: "Faza 2: Liderlik Bacarıqları",
      targetDate: "Mart 2027",
      expectedSalary: "5,500-7,000 AZN",
      expectedRole: "Tech Lead",
      progress: 0,
      steps: [
        {
          title: "Komanda Rəhbərliyi",
          description: "Kiçik komandaya rəhbərlik təcrübəsi qazan",
          duration: "4 ay",
          status: "upcoming",
          items: ["1-on-1 Meetings", "Code Review Leadership", "Mentoring"]
        },
        {
          title: "Layihə İdarəetməsi",
          description: "Agile metodologiyalar və layihə planlaması",
          duration: "2 ay",
          status: "upcoming",
          items: ["Scrum Master", "Sprint Planning", "Stakeholder Management"]
        },
        {
          title: "Texniki Qərarlar",
          description: "Arxitektura qərarları və texniki strategiya",
          duration: "3 ay",
          status: "upcoming",
          items: ["Architecture Decisions", "Tech Stack Selection", "Technical Debt Management"]
        }
      ]
    },
    {
      title: "Faza 3: Strateji Təfəkkür",
      targetDate: "Sentyabr 2027",
      expectedSalary: "7,000-9,000 AZN",
      expectedRole: "Engineering Manager",
      progress: 0,
      steps: [
        {
          title: "Biznes Anlayışı",
          description: "Texniki qərarların biznesə təsirini anla",
          duration: "3 ay",
          status: "upcoming",
          items: ["Product Strategy", "ROI Analysis", "Business Metrics"]
        },
        {
          title: "Komanda Quruculuğu",
          description: "İşə qəbul, inkişaf və mədəniyyət yaratma",
          duration: "4 ay",
          status: "upcoming",
          items: ["Hiring & Interviewing", "Performance Reviews", "Team Culture"]
        }
      ]
    }
  ];

  const getStatusIcon = (status: MilestoneStep["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-accent" />;
      case "current": return <div className="w-5 h-5 rounded-full border-2 border-accent bg-accent/20 animate-pulse" />;
      case "upcoming": return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-chart-1/10 border border-accent/20 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Map className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Karyera Yol Xəritəsi</h2>
              <p className="text-sm text-muted-foreground">Fərdi inkişaf planınız</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Təxmini müddət</p>
            <p className="text-lg font-semibold text-accent">{estimatedTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 p-4 rounded-lg bg-background/50">
            <p className="text-xs text-muted-foreground mb-1">Cari Vəzifə</p>
            <p className="font-medium text-foreground">{currentRole}</p>
          </div>
          <div className="flex items-center">
            <ChevronRight className="w-5 h-5 text-accent" />
            <ChevronRight className="w-5 h-5 text-accent -ml-2" />
            <ChevronRight className="w-5 h-5 text-accent -ml-2" />
          </div>
          <div className="flex-1 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-xs text-accent mb-1">Hədəf Vəzifə</p>
            <p className="font-medium text-foreground">{targetRole}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {milestones.map((milestone, mi) => (
          <div key={mi} className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Milestone Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      {mi + 1}/{milestones.length}
                    </span>
                    <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {milestone.targetDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {milestone.expectedRole}
                    </span>
                    <span className="flex items-center gap-1 text-accent">
                      <TrendingUp className="w-4 h-4" />
                      {milestone.expectedSalary}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{milestone.progress}%</p>
                  <p className="text-xs text-muted-foreground">tamamlanıb</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="p-6">
              <div className="space-y-4">
                {milestone.steps.map((step, si) => (
                  <div key={si} className="relative">
                    {/* Connection Line */}
                    {si < milestone.steps.length - 1 && (
                      <div className="absolute left-2.5 top-10 bottom-0 w-px bg-border" />
                    )}
                    
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className={`font-medium ${
                              step.status === "completed" ? "text-muted-foreground" :
                              step.status === "current" ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {step.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {step.items.map((item, ii) => (
                            <span 
                              key={ii}
                              className={`px-2 py-1 rounded-md text-xs ${
                                step.status === "completed" 
                                  ? "bg-accent/10 text-accent" 
                                  : step.status === "current"
                                  ? "bg-secondary text-foreground"
                                  : "bg-secondary/50 text-muted-foreground"
                              }`}
                            >
                              {step.status === "completed" && <CheckCircle className="w-3 h-3 inline mr-1" />}
                              {item}
                            </span>
                          ))}
                        </div>

                        {step.status === "current" && (
                          <button className="mt-3 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
                            Davam et
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Gözlənilən Nəticələr</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/30 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold text-foreground">+120%</p>
            <p className="text-sm text-muted-foreground">Maaş artımı</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 text-center">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-chart-1" />
            <p className="text-2xl font-bold text-foreground">3x</p>
            <p className="text-sm text-muted-foreground">Daha çox iş imkanı</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold text-foreground">95%</p>
            <p className="text-sm text-muted-foreground">Hədəfə çatma ehtimalı</p>
          </div>
        </div>
      </div>
    </div>
  );
}
