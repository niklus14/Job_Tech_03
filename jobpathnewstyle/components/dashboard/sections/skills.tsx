"use client";

import { useState } from "react";
import { 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  DollarSign,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Circle
} from "lucide-react";

interface SkillGap {
  name: string;
  currentLevel: number;
  requiredLevel: number;
  importance: "critical" | "important" | "nice-to-have";
  learningTime: string;
  salaryImpact: string;
  demandTrend: "rising" | "stable" | "declining";
  resources: { name: string; type: string; duration: string }[];
}

export function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const skillGaps: SkillGap[] = [
    {
      name: "Docker & Kubernetes",
      currentLevel: 30,
      requiredLevel: 75,
      importance: "critical",
      learningTime: "3 ay",
      salaryImpact: "+15-20%",
      demandTrend: "rising",
      resources: [
        { name: "Docker Mastery", type: "Kurs", duration: "20 saat" },
        { name: "K8s for Developers", type: "Kurs", duration: "25 saat" },
        { name: "Hands-on Lab", type: "Praktika", duration: "40 saat" }
      ]
    },
    {
      name: "AWS/Cloud Services",
      currentLevel: 40,
      requiredLevel: 80,
      importance: "critical",
      learningTime: "4 ay",
      salaryImpact: "+20-25%",
      demandTrend: "rising",
      resources: [
        { name: "AWS Solutions Architect", type: "Sertifikat", duration: "60 saat" },
        { name: "Cloud Fundamentals", type: "Kurs", duration: "15 saat" }
      ]
    },
    {
      name: "System Design",
      currentLevel: 45,
      requiredLevel: 70,
      importance: "important",
      learningTime: "2 ay",
      salaryImpact: "+10-15%",
      demandTrend: "rising",
      resources: [
        { name: "System Design Interview", type: "Kitab", duration: "30 saat" },
        { name: "Designing Data-Intensive Apps", type: "Kitab", duration: "40 saat" }
      ]
    },
    {
      name: "GraphQL",
      currentLevel: 50,
      requiredLevel: 75,
      importance: "important",
      learningTime: "1 ay",
      salaryImpact: "+5-10%",
      demandTrend: "stable",
      resources: [
        { name: "GraphQL Complete Guide", type: "Kurs", duration: "12 saat" },
        { name: "Apollo GraphQL", type: "Tutorial", duration: "8 saat" }
      ]
    },
    {
      name: "Testing (Jest/Cypress)",
      currentLevel: 55,
      requiredLevel: 80,
      importance: "nice-to-have",
      learningTime: "1 ay",
      salaryImpact: "+5%",
      demandTrend: "stable",
      resources: [
        { name: "Testing JavaScript", type: "Kurs", duration: "15 saat" },
        { name: "Cypress Deep Dive", type: "Tutorial", duration: "10 saat" }
      ]
    }
  ];

  const getImportanceColor = (importance: SkillGap["importance"]) => {
    switch (importance) {
      case "critical": return "text-destructive bg-destructive/10";
      case "important": return "text-warning bg-warning/10";
      case "nice-to-have": return "text-chart-1 bg-chart-1/10";
    }
  };

  const getImportanceLabel = (importance: SkillGap["importance"]) => {
    switch (importance) {
      case "critical": return "Kritik";
      case "important": return "Vacib";
      case "nice-to-have": return "Faydalı";
    }
  };

  const getTrendIcon = (trend: SkillGap["demandTrend"]) => {
    switch (trend) {
      case "rising": return <TrendingUp className="w-4 h-4 text-accent" />;
      case "stable": return <span className="text-muted-foreground">→</span>;
      case "declining": return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Ümumi Boşluqlar</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{skillGaps.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Kritik Boşluqlar</span>
          </div>
          <p className="text-2xl font-bold text-destructive">
            {skillGaps.filter(s => s.importance === "critical").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-chart-1" />
            <span className="text-sm text-muted-foreground">Təxmini Vaxt</span>
          </div>
          <p className="text-2xl font-bold text-foreground">6-8 ay</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Potensial Artım</span>
          </div>
          <p className="text-2xl font-bold text-accent">+35-45%</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Hədəf Peşə: Senior Full Stack Developer
            </p>
            <p className="text-sm text-muted-foreground">
              Cari skill-ləriniz və bazar tələbi əsasında aşağıdakı boşluqlar müəyyən edilib. 
              Bu skill-ləri əldə etmək sizin işə götürülmə ehtimalınızı və maaşınızı əhəmiyyətli artıracaq.
            </p>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="space-y-4">
        {skillGaps.map((skill, i) => (
          <div 
            key={i}
            className={`bg-card border rounded-xl p-6 transition-all cursor-pointer ${
              selectedSkill === skill.name 
                ? "border-accent" 
                : "border-border hover:border-accent/30"
            }`}
            onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{skill.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getImportanceColor(skill.importance)}`}>
                      {getImportanceLabel(skill.importance)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getTrendIcon(skill.demandTrend)}
                      <span>Tələb</span>
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight 
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  selectedSkill === skill.name ? "rotate-90" : ""
                }`} 
              />
            </div>

            {/* Progress Bars */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cari Səviyyə</span>
                <span className="text-foreground font-medium">{skill.currentLevel}%</span>
              </div>
              <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-muted-foreground/50 rounded-full"
                  style={{ width: `${skill.currentLevel}%` }}
                />
                <div 
                  className="absolute inset-y-0 bg-accent/30 rounded-full"
                  style={{ left: `${skill.currentLevel}%`, width: `${skill.requiredLevel - skill.currentLevel}%` }}
                />
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-accent rounded-full"
                  style={{ left: `${skill.requiredLevel}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="text-accent">Hədəf: {skill.requiredLevel}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-2 rounded-lg bg-secondary/50">
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Öyrənmə müddəti</p>
                <p className="text-sm font-medium text-foreground">{skill.learningTime}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/50">
                <DollarSign className="w-4 h-4 mx-auto mb-1 text-accent" />
                <p className="text-xs text-muted-foreground">Maaş təsiri</p>
                <p className="text-sm font-medium text-accent">{skill.salaryImpact}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/50">
                <BookOpen className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Resurslar</p>
                <p className="text-sm font-medium text-foreground">{skill.resources.length}</p>
              </div>
            </div>

            {/* Expanded Content */}
            {selectedSkill === skill.name && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  Tövsiyə edilən resurslar
                </h4>
                <div className="space-y-3">
                  {skill.resources.map((resource, ri) => (
                    <div 
                      key={ri}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">{resource.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{resource.duration}</p>
                        <button className="text-xs text-accent hover:underline">Başla</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
                  Öyrənmə Planına Əlavə Et
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
