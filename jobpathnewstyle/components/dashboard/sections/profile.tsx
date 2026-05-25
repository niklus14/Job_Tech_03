"use client";

import { useState } from "react";
import { 
  Upload, 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Code,
  Pencil,
  Trash2,
  Plus,
  CheckCircle,
  Loader2,
  Sparkles
} from "lucide-react";

type UploadStatus = "idle" | "uploading" | "analyzing" | "complete";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface Skill {
  name: string;
  category: "technical" | "soft" | "language" | "tool";
  level: number;
}

export function ProfileSection() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");

  const [experiences] = useState<Experience[]>([
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Azerbaijan",
      location: "Bakı",
      startDate: "2021-06",
      endDate: "İndi",
      description: "React, Next.js və TypeScript ilə enterprise tətbiqlər inkişaf etdirmək. Komanda rəhbərliyi və code review."
    },
    {
      id: "2",
      title: "Frontend Developer",
      company: "StartupAZ",
      location: "Bakı",
      startDate: "2019-03",
      endDate: "2021-05",
      description: "Veb tətbiqlər üçün responsive interfeyslər yaratmaq. React, Redux, SCSS."
    }
  ]);

  const [educations] = useState<Education[]>([
    {
      id: "1",
      degree: "Kompüter Elmləri, Bakalavr",
      school: "Bakı Dövlət Universiteti",
      year: "2015-2019"
    }
  ]);

  const [skills] = useState<Skill[]>([
    { name: "React", category: "technical", level: 95 },
    { name: "TypeScript", category: "technical", level: 90 },
    { name: "Next.js", category: "technical", level: 88 },
    { name: "Node.js", category: "technical", level: 75 },
    { name: "PostgreSQL", category: "technical", level: 70 },
    { name: "Git", category: "tool", level: 85 },
    { name: "Figma", category: "tool", level: 70 },
    { name: "Komanda işi", category: "soft", level: 90 },
    { name: "Problem həlli", category: "soft", level: 85 },
    { name: "Azərbaycan dili", category: "language", level: 100 },
    { name: "İngilis dili", category: "language", level: 80 },
    { name: "Rus dili", category: "language", level: 60 },
  ]);

  const analysisSteps = [
    "CV faylı oxunur...",
    "Şəxsi məlumatlar çıxarılır...",
    "İş təcrübəsi analiz edilir...",
    "Bacarıqlar kateqorizasiya olunur...",
    "Təhsil məlumatları parse edilir...",
    "AI ilə skill səviyyələri qiymətləndirilir...",
    "Profil tamamlanır..."
  ];

  const handleUpload = () => {
    setUploadStatus("uploading");
    
    setTimeout(() => {
      setUploadStatus("analyzing");
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setAnalysisStep(step);
        if (step >= analysisSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadStatus("complete");
          }, 500);
        }
      }, 800);
    }, 1000);
  };

  const getSkillsByCategory = (category: Skill["category"]) => 
    skills.filter(s => s.category === category);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {uploadStatus !== "complete" && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">CV Yüklə</h3>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Fayl Yüklə
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "manual"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Əl ilə Doldur
            </button>
          </div>

          {activeTab === "upload" && uploadStatus === "idle" && (
            <div
              onClick={handleUpload}
              className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <p className="text-foreground font-medium mb-2">
                CV faylınızı buraya sürükləyin və ya klikləyin
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, DOC, DOCX formatları dəstəklənir (maksimum 5MB)
              </p>
            </div>
          )}

          {(uploadStatus === "uploading" || uploadStatus === "analyzing") && (
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-secondary flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    AI Analiz Prosesi
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((analysisStep / (analysisSteps.length - 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden mb-4">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${(analysisStep / (analysisSteps.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {analysisSteps.map((step, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-sm transition-all ${
                        i < analysisStep
                          ? "text-accent"
                          : i === analysisStep
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {i < analysisStep ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : i === analysisStep ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-current" />
                      )}
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "manual" && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aşağıdakı bölmələri əl ilə dolduraraq profilinizi yarada bilərsiniz.
            </p>
          )}
        </div>
      )}

      {/* Profile Sections */}
      {(uploadStatus === "complete" || activeTab === "manual") && (
        <>
          {/* Personal Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Şəxsi Məlumatlar</h3>
              </div>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Ad Soyad</label>
                <p className="text-foreground font-medium">Elvin Nuriyev</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">E-poçt</label>
                <p className="text-foreground font-medium">elvin@example.com</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Telefon</label>
                <p className="text-foreground font-medium">+994 50 123 45 67</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Yer</label>
                <p className="text-foreground font-medium">Bakı, Azərbaycan</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">İş Təcrübəsi</h3>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                <Plus className="w-4 h-4" />
                Əlavə et
              </button>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-lg bg-secondary/30 group">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-accent mb-2">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Təhsil</h3>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                <Plus className="w-4 h-4" />
                Əlavə et
              </button>
            </div>

            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="p-4 rounded-lg bg-secondary/30 group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.school}</p>
                      <p className="text-xs text-accent">{edu.year}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Bacarıqlar</h3>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                <Plus className="w-4 h-4" />
                Əlavə et
              </button>
            </div>

            <div className="space-y-6">
              {/* Technical Skills */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Texniki Bacarıqlar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getSkillsByCategory("technical").map((skill, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-accent">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Soft Bacarıqlar</h4>
                <div className="flex flex-wrap gap-2">
                  {getSkillsByCategory("soft").map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-chart-1/10 text-chart-1 text-sm font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Dillər
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {getSkillsByCategory("language").map((skill, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {skill.level >= 90 ? "Ana dili" : skill.level >= 70 ? "Yaxşı" : "Orta"}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-chart-2 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Alətlər</h4>
                <div className="flex flex-wrap gap-2">
                  {getSkillsByCategory("tool").map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-secondary text-foreground text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Sertifikatlar</h3>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                <Plus className="w-4 h-4" />
                Əlavə et
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-secondary/30 group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">AWS Certified Developer</h4>
                    <p className="text-sm text-muted-foreground">Amazon Web Services</p>
                    <p className="text-xs text-accent">2023</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">React Advanced Patterns</h4>
                    <p className="text-sm text-muted-foreground">Frontend Masters</p>
                    <p className="text-xs text-accent">2022</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
