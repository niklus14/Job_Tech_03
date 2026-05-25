"use client";

import { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  Award,
  Briefcase,
  MapPin,
  Info,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";

interface SalaryFactor {
  name: string;
  impact: number;
  description: string;
}

export function SalarySection() {
  const [yearsToAdd, setYearsToAdd] = useState(0);
  const [skillsToAdd, setSkillsToAdd] = useState(0);
  const [certToAdd, setCertToAdd] = useState(0);

  const currentSalary = {
    min: 2800,
    current: 3200,
    max: 4500,
    marketAvg: 3500,
    percentile: 65
  };

  const salaryFactors: SalaryFactor[] = [
    { name: "Təcrübə (4 il)", impact: 800, description: "Hər il əlavə təcrübə üçün +200 AZN" },
    { name: "React/Next.js", impact: 600, description: "Yüksək tələb olunan texnologiya" },
    { name: "TypeScript", impact: 400, description: "Tip təhlükəsizliyi üstünlüyü" },
    { name: "AWS Sertifikatı", impact: 350, description: "Cloud bacarıqları premiumı" },
    { name: "Bakı lokasiyası", impact: 200, description: "Paytaxt bazarı" }
  ];

  const salaryTrends = [
    { period: "Yanvar 2026", min: 2500, avg: 3200, max: 4200 },
    { period: "Aprel 2026", min: 2600, avg: 3300, max: 4300 },
    { period: "İyul 2026", min: 2700, avg: 3400, max: 4400 },
    { period: "Oktyabr 2026", min: 2800, avg: 3500, max: 4500 },
    { period: "Yanvar 2027 (proqnoz)", min: 2900, avg: 3600, max: 4700 },
    { period: "Aprel 2027 (proqnoz)", min: 3000, avg: 3700, max: 4900 }
  ];

  const calculateProjectedSalary = () => {
    let projected = currentSalary.current;
    projected += yearsToAdd * 200; // +200 AZN per year
    projected += skillsToAdd * 150; // +150 AZN per skill
    projected += certToAdd * 350; // +350 AZN per certificate
    return projected;
  };

  const projectedSalary = calculateProjectedSalary();
  const salaryIncrease = projectedSalary - currentSalary.current;
  const percentageIncrease = ((salaryIncrease / currentSalary.current) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Current Salary Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Maaş Proqnozu</h3>
          </div>

          {/* Salary Range Visualization */}
          <div className="relative mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Minimum</span>
              <span>Bazar Ortası</span>
              <span>Maksimum</span>
            </div>
            <div className="relative h-8 rounded-full bg-gradient-to-r from-destructive/20 via-warning/20 to-accent/20 overflow-hidden">
              {/* Current position marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full z-10"
                style={{ left: `${((currentSalary.current - currentSalary.min) / (currentSalary.max - currentSalary.min)) * 100}%` }}
              />
              {/* Market average marker */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-accent/50 rounded-full"
                style={{ left: `${((currentSalary.marketAvg - currentSalary.min) / (currentSalary.max - currentSalary.min)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm font-medium mt-2">
              <span className="text-destructive">{currentSalary.min.toLocaleString()} AZN</span>
              <span className="text-accent">{currentSalary.marketAvg.toLocaleString()} AZN</span>
              <span className="text-accent">{currentSalary.max.toLocaleString()} AZN</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Cari Maaşınız</p>
              <p className="text-xl font-bold text-foreground">{currentSalary.current.toLocaleString()} AZN</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Bazar Ortası</p>
              <p className="text-xl font-bold text-accent">{currentSalary.marketAvg.toLocaleString()} AZN</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Percentil</p>
              <p className="text-xl font-bold text-foreground">{currentSalary.percentile}%</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-1">Potensial Artım</p>
              <p className="text-xl font-bold text-accent">+{(currentSalary.max - currentSalary.current).toLocaleString()} AZN</p>
            </div>
          </div>
        </div>

        {/* Salary Factors */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Maaşa Təsir edən Faktorlar</h3>
          </div>

          <div className="space-y-3">
            {salaryFactors.map((factor, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{factor.name}</span>
                  <span className="text-sm font-semibold text-accent">+{factor.impact} AZN</span>
                </div>
                <p className="text-xs text-muted-foreground">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Calculator */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Maaş Artımı Kalkulyatoru</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Input Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Əlavə Təcrübə (il)</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setYearsToAdd(Math.max(0, yearsToAdd - 1))}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold text-foreground">{yearsToAdd}</span>
                <button 
                  onClick={() => setYearsToAdd(yearsToAdd + 1)}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+200 AZN / il</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Yeni Skill-lər</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSkillsToAdd(Math.max(0, skillsToAdd - 1))}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold text-foreground">{skillsToAdd}</span>
                <button 
                  onClick={() => setSkillsToAdd(skillsToAdd + 1)}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+150 AZN / skill</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Sertifikatlar</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCertToAdd(Math.max(0, certToAdd - 1))}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-semibold text-foreground">{certToAdd}</span>
                <button 
                  onClick={() => setCertToAdd(certToAdd + 1)}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+350 AZN / sertifikat</p>
            </div>
          </div>

          {/* Result */}
          <div className="p-6 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">Proqnozlaşdırılan Maaş</p>
            <p className="text-3xl font-bold text-accent mb-2">{projectedSalary.toLocaleString()} AZN</p>
            {salaryIncrease > 0 && (
              <div className="flex items-center gap-1 text-accent">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+{salaryIncrease.toLocaleString()} AZN ({percentageIncrease}%)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Salary Trends */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Maaş Trendləri (Senior Frontend Developer)</h3>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-destructive/50" /> Min
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-accent" /> Orta
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-chart-1" /> Max
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {salaryTrends.map((trend, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className={`w-40 text-sm ${i >= 4 ? "text-muted-foreground italic" : "text-foreground"}`}>
                {trend.period}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <span className="w-20 text-xs text-right text-muted-foreground">{trend.min.toLocaleString()}</span>
                <div className="flex-1 h-6 bg-secondary rounded-full relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-destructive/30 via-accent/50 to-chart-1/30 rounded-full"
                    style={{ 
                      left: `${((trend.min - 2000) / 3000) * 100}%`,
                      right: `${100 - ((trend.max - 2000) / 3000) * 100}%`
                    }}
                  />
                  <div 
                    className="absolute top-1 bottom-1 w-1 bg-accent rounded-full"
                    style={{ left: `${((trend.avg - 2000) / 3000) * 100}%` }}
                  />
                </div>
                <span className="w-20 text-xs text-chart-1">{trend.max.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/10">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              6 ay ərzində maaş trendi <span className="text-accent font-medium">+8-12%</span> artım göstərir. 
              Bu, texnologiya sektorunun inkişafı və skilled işçilərə tələbin artması ilə əlaqədardır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
