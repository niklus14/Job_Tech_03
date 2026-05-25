"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Play,
  CheckCircle,
  Circle,
  Clock,
  Sparkles,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Briefcase,
  Code,
  Users,
  Brain
} from "lucide-react";

type QuestionCategory = "technical" | "behavioral" | "situational" | "culture";

interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  tips: string[];
  sampleAnswer?: string;
  completed: boolean;
  userScore?: number;
}

interface MockInterview {
  id: string;
  role: string;
  company: string;
  duration: string;
  questions: number;
  difficulty: string;
  completed: boolean;
  score?: number;
}

export function InterviewSection() {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | "all">("all");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<"text" | "voice" | "video">("text");

  const questions: InterviewQuestion[] = [
    {
      id: "1",
      category: "technical",
      question: "React-də Virtual DOM nədir və necə işləyir?",
      difficulty: "medium",
      tips: [
        "Real DOM ilə fərqini izah edin",
        "Diffing alqoritmi haqqında danışın",
        "Performans üstünlükləri qeyd edin"
      ],
      sampleAnswer: "Virtual DOM, real DOM-un yüngül JavaScript təsvirdir. React əvvəlcə dəyişiklikləri Virtual DOM-da edir, sonra diffing alqoritmi ilə real DOM ilə müqayisə edib yalnız dəyişən hissələri yeniləyir. Bu, performansı əhəmiyyətli dərəcədə artırır.",
      completed: true,
      userScore: 85
    },
    {
      id: "2",
      category: "technical",
      question: "TypeScript-də Generic-lər nə üçün istifadə olunur?",
      difficulty: "medium",
      tips: [
        "Tip təhlükəsizliyi izah edin",
        "Yenidən istifadə oluna bilən kod nümunəsi verin",
        "any-dən fərqini göstərin"
      ],
      completed: true,
      userScore: 78
    },
    {
      id: "3",
      category: "technical",
      question: "REST API və GraphQL arasındakı fərqlər nələrdir?",
      difficulty: "hard",
      tips: [
        "Data fetching fərqlərini izah edin",
        "Over-fetching/under-fetching konseptləri",
        "İstifadə hallarını müqayisə edin"
      ],
      completed: false
    },
    {
      id: "4",
      category: "behavioral",
      question: "Çətin bir komanda üzvü ilə necə işləmisiniz?",
      difficulty: "medium",
      tips: [
        "STAR metodundan istifadə edin",
        "Konkret nümunə verin",
        "Nəticəyə fokuslanın"
      ],
      completed: false
    },
    {
      id: "5",
      category: "behavioral",
      question: "Deadline-a yetişə bilmədiyiniz bir vəziyyəti təsvir edin.",
      difficulty: "medium",
      tips: [
        "Səbəbi obyektiv izah edin",
        "Nə öyrəndiyinizi vurğulayın",
        "Gələcək üçün strategiyanızı paylaşın"
      ],
      completed: false
    },
    {
      id: "6",
      category: "situational",
      question: "Texniki borcla necə mübarizə aparardınız?",
      difficulty: "hard",
      tips: [
        "Prioritetləşdirmə strategiyası",
        "Stakeholder-lərlə ünsiyyət",
        "Tədricən yeniləmə yanaşması"
      ],
      completed: false
    },
    {
      id: "7",
      category: "situational",
      question: "Yeni texnologiyanı komandaya necə təqdim edərdiniz?",
      difficulty: "medium",
      tips: [
        "Araşdırma və POC",
        "Üstünlükləri sübut edin",
        "Tədricən tətbiq planı"
      ],
      completed: false
    },
    {
      id: "8",
      category: "culture",
      question: "İdeal iş mühitinizi təsvir edin.",
      difficulty: "easy",
      tips: [
        "Şirkətin mədəniyyətini araşdırın",
        "Konkret olun",
        "Uyğunluğunuzu göstərin"
      ],
      completed: false
    }
  ];

  const mockInterviews: MockInterview[] = [
    {
      id: "1",
      role: "Senior Frontend Developer",
      company: "TechCorp",
      duration: "45 dəq",
      questions: 8,
      difficulty: "Orta-Çətin",
      completed: true,
      score: 82
    },
    {
      id: "2",
      role: "React Developer",
      company: "StartupAZ",
      duration: "30 dəq",
      questions: 6,
      difficulty: "Orta",
      completed: true,
      score: 76
    },
    {
      id: "3",
      role: "Full Stack Engineer",
      company: "DigiBank",
      duration: "60 dəq",
      questions: 10,
      difficulty: "Çətin",
      completed: false
    }
  ];

  const categories = [
    { id: "all" as const, label: "Hamısı", icon: MessageSquare },
    { id: "technical" as const, label: "Texniki", icon: Code },
    { id: "behavioral" as const, label: "Davranış", icon: Users },
    { id: "situational" as const, label: "Situasiya", icon: Brain },
    { id: "culture" as const, label: "Mədəniyyət", icon: Briefcase },
  ];

  const filteredQuestions = selectedCategory === "all" 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const getCategoryColor = (category: QuestionCategory) => {
    switch (category) {
      case "technical": return "bg-accent/10 text-accent";
      case "behavioral": return "bg-chart-1/10 text-chart-1";
      case "situational": return "bg-warning/10 text-warning";
      case "culture": return "bg-chart-5/10 text-chart-5";
    }
  };

  const getDifficultyColor = (difficulty: InterviewQuestion["difficulty"]) => {
    switch (difficulty) {
      case "easy": return "text-accent";
      case "medium": return "text-warning";
      case "hard": return "text-destructive";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{questions.filter(q => q.completed).length}/{questions.length}</p>
          <p className="text-sm text-muted-foreground">Tamamlanan suallar</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-accent">81%</p>
          <p className="text-sm text-muted-foreground">Orta qiymət</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{mockInterviews.filter(m => m.completed).length}</p>
          <p className="text-sm text-muted-foreground">Mock müsahibə</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">4.2 saat</p>
          <p className="text-sm text-muted-foreground">Ümumi təcrübə vaxtı</p>
        </div>
      </div>

      {/* Mock Interviews */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Mock Müsahibələr</h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
            <Play className="w-4 h-4" />
            Yeni Müsahibə
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockInterviews.map((interview) => (
            <div 
              key={interview.id}
              className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                interview.completed 
                  ? "bg-secondary/30 border-border hover:border-accent/30" 
                  : "bg-accent/5 border-accent/20 hover:bg-accent/10"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{interview.role}</h4>
                  <p className="text-sm text-muted-foreground">{interview.company}</p>
                </div>
                {interview.completed && interview.score && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10">
                    <Star className="w-3 h-3 text-accent" />
                    <span className="text-sm font-semibold text-accent">{interview.score}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {interview.duration}
                </span>
                <span>{interview.questions} sual</span>
                <span>{interview.difficulty}</span>
              </div>
              <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                interview.completed
                  ? "bg-secondary text-foreground hover:bg-secondary/80"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              }`}>
                {interview.completed ? "Yenidən Başla" : "Başla"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Mode Selector */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Təcrübə Rejimi</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPracticeMode("text")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                practiceMode === "text"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Mətn
            </button>
            <button
              onClick={() => setPracticeMode("voice")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                practiceMode === "voice"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mic className="w-4 h-4" />
              Səsli
            </button>
            <button
              onClick={() => setPracticeMode("video")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                practiceMode === "video"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Video className="w-4 h-4" />
              Video (Pro)
            </button>
          </div>
        </div>

        {practiceMode === "voice" && (
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-sm text-muted-foreground">
              Səsli rejimdə cavablarınızı səsli verə bilərsiniz. AI sistemi nitqinizi analiz edərək məzmun, struktur və ifadə tərzi üçün feedback verəcək.
            </p>
          </div>
        )}

        {practiceMode === "video" && (
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-sm text-muted-foreground">
              Video rejimdə bədən dili, göz təması və üz ifadələriniz də analiz olunacaq. Bu xüsusiyyət Pro planında mövcuddur.
            </p>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div 
            key={q.id}
            className={`bg-card border rounded-xl overflow-hidden transition-colors ${
              expandedQuestion === q.id ? "border-accent" : "border-border hover:border-accent/30"
            }`}
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {q.completed ? (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(q.category)}`}>
                        {q.category === "technical" && "Texniki"}
                        {q.category === "behavioral" && "Davranış"}
                        {q.category === "situational" && "Situasiya"}
                        {q.category === "culture" && "Mədəniyyət"}
                      </span>
                      <span className={`text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty === "easy" && "Asan"}
                        {q.difficulty === "medium" && "Orta"}
                        {q.difficulty === "hard" && "Çətin"}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground">{q.question}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {q.completed && q.userScore && (
                    <span className="text-sm font-semibold text-accent">{q.userScore}%</span>
                  )}
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedQuestion === q.id ? "rotate-90" : ""
                  }`} />
                </div>
              </div>
            </div>

            {expandedQuestion === q.id && (
              <div className="px-4 pb-4 pt-0 border-t border-border">
                <div className="pt-4 space-y-4">
                  {/* Tips */}
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Tövsiyələr:</h5>
                    <ul className="space-y-1">
                      {q.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Answer */}
                  {q.sampleAnswer && (
                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                      <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Nümunə Cavab:
                      </h5>
                      <p className="text-sm text-muted-foreground">{q.sampleAnswer}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
                      {practiceMode === "text" && <MessageSquare className="w-4 h-4" />}
                      {practiceMode === "voice" && <Mic className="w-4 h-4" />}
                      {practiceMode === "video" && <Video className="w-4 h-4" />}
                      <span>Cavab Ver</span>
                    </button>
                    {q.completed && (
                      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Previous Score Feedback */}
                  {q.completed && q.userScore && (
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Son nəticəniz: {q.userScore}%</span>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                            <ThumbsUp className="w-4 h-4 text-accent" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                            <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Yaxşı strukturlaşdırılmış cavab. Daha çox konkret nümunə əlavə etməyə çalışın.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
