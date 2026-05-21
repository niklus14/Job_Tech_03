import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Search, Sparkles, Compass, TrendingUp, 
  BarChart3, Database, Users, Shield, ArrowRight,
  Target, Zap, Globe, X
} from 'lucide-react';

const FEATURES_DATA = [
  {
    id: 1,
    title: "Hybrid AI Resume Analysis",
    shortDesc: "Instant, deep extraction of technical expertise and skills from your resume using hybrid ML algorithms.",
    icon: Brain,
    category: "AI CV Analysis",
    color: '#34d399',
    details: {
      intro: "Stop wondering if your resume passes the initial screening. Our Hybrid AI Resume Analysis goes beyond basic keyword matching to deeply understand your actual experience, projects, and strengths.",
      benefits: [
        { title: "Intelligent Skill Extraction", text: "Automatically identifies and categorizes your primary, secondary, and soft skills with 98% accuracy." },
        { title: "Instant ATS Optimization", text: "Evaluates how compatible your resume format and contents are with modern Applicant Tracking Systems." }
      ],
      howItWorks: "Our dual-engine pipeline combines heuristic structural parsing with specialized NLP transformers to read your resume like a veteran recruiter, but in milliseconds.",
      ctaText: "Upload your CV to see your AI breakdown"
    }
  },
  {
    id: 2,
    title: "SBERT Semantic Matching",
    shortDesc: "Advanced semantic comparison that matches your CV's overall context with real vacancy requirements.",
    icon: Search,
    category: "Semantic Engine",
    color: '#34d399',
    details: {
      intro: "Traditional keyword search misses your potential. Our SBERT semantic matcher measures the deep context and meaning behind your experience.",
      benefits: [
        { title: "Context-Aware Scoring", text: "Matches concepts, not just words." },
        { title: "Reduced False Negatives", text: "Ensures you are not filtered out due to terminology differences." }
      ],
      howItWorks: "We map both job specs and resumes into a multi-dimensional semantic vector space to compute true contextual similarity.",
      ctaText: "Match your profile with the market"
    }
  },
  {
    id: 3,
    title: "Random Forest Skill Prediction",
    shortDesc: "Predict must-have skills and technologies required to land your desired target job.",
    icon: Target,
    category: "Predictive Analytics",
    color: '#60a5fa',
    details: {
      intro: "Stay ahead of industry trends with ML models that predict which exact skills give you a competitive edge.",
      benefits: [
        { title: "Vacancy Skill Mapping", text: "Instantly predicts critical missing skills you need to acquire." },
        { title: "Trend Forecasting", text: "Detects emerging technologies rising in popularity." }
      ],
      howItWorks: "An ensemble of decision trees trained on historical vacancy datasets models skill combinations that maximize employment probability.",
      ctaText: "Discover your predicted skill gap"
    }
  },
  {
    id: 4,
    title: "Beautiful PDF Reports & Sharing",
    shortDesc: "Generate stunning, data-rich PDF reports of your skill profile and share them via secure links.",
    icon: Sparkles,
    category: "Profile Export",
    color: '#60a5fa',
    details: {
      intro: "Stand out to employers and recruiters with an instantly generated, beautifully formatted PDF report.",
      benefits: [
        { title: "Visual Data Representation", text: "Your skills, levels, and market match scores are visualized in an easy-to-read PDF format." },
        { title: "One-Click Shareable Link", text: "Send a live, secure link to recruiters without worrying about file attachments." }
      ],
      howItWorks: "We compile your parsed resume, skill classification, and market match data into a dynamic PDF template ready for export and sharing.",
      ctaText: "Generate your PDF report"
    }
  },
  {
    id: 5,
    title: "AI Career Co-Pilot",
    shortDesc: "A personalized roadmap with weekly milestones tailored to your strengths and target career goals.",
    icon: Compass,
    category: "Career Strategy",
    color: '#a78bfa',
    details: {
      intro: "The AI Career Co-Pilot acts as your 24/7 personal mentor, designing custom milestones.",
      benefits: [
        { title: "Weekly Learning Milestones", text: "Get a highly structured weekly schedule." },
        { title: "Adaptive Coaching", text: "The co-pilot adapts as you progress." }
      ],
      howItWorks: "Integrates your resume data, gap analysis, and market trends to generate a personalized timeline.",
      ctaText: "Generate your custom career path"
    }
  },
  {
    id: 6,
    title: "Interactive Learning Path",
    shortDesc: "Visualize exactly how much completing specific courses boosts your overall employment rate.",
    icon: TrendingUp,
    category: "Interactive Growth",
    color: '#a78bfa',
    details: {
      intro: "Never waste time on courses that don't move the needle.",
      benefits: [
        { title: "Dynamic Employment Index", text: "See your percentage match grow in real-time." },
        { title: "Curated Resource Lists", text: "Direct links to high-quality tutorials and courses." }
      ],
      howItWorks: "Calculates the mathematical delta in similarity scores as target skills are added to your profile.",
      ctaText: "Start your interactive learning path"
    }
  },
  {
    id: 7,
    title: "Real-Time Market Pulse",
    shortDesc: "Track trending jobs, salary insights, and high-demand skills in the local market.",
    icon: BarChart3,
    category: "Market Insights",
    color: '#f472b6',
    details: {
      intro: "Gain deep analytical visibility into the Azerbaijani job market.",
      benefits: [
        { title: "Skill Popularity Trends", text: "Real-time graphs showing month-over-month skill changes." },
        { title: "Vacancy Aggregation", text: "See where jobs are clustered geographically." }
      ],
      howItWorks: "Continuous web-scraping pipelines clean, classify, and index thousands of vacancy listings daily.",
      ctaText: "Explore the live job market"
    }
  },
  {
    id: 8,
    title: "Academic LMS Synchronization",
    shortDesc: "Sync student grades and cohort metrics to map student performance against market expectations.",
    icon: Database,
    category: "Enterprise LMS",
    color: '#f472b6',
    details: {
      intro: "For universities, coding bootcamps, and academies.",
      benefits: [
        { title: "Seamless Integration", text: "Sync with top LMS platforms in a couple of clicks." },
        { title: "Graduate Readiness Tracker", text: "Monitor which students are 100% prepared for placement." }
      ],
      howItWorks: "Robust webhook and REST API pipelines fetch cohort performance data.",
      ctaText: "Connect your institution's LMS"
    }
  },
  {
    id: 9,
    title: "Cohort Gap Analysis",
    shortDesc: "Analyze collective weaknesses in class groups to optimize training curriculums for real jobs.",
    icon: Users,
    category: "Curriculum Optimization",
    color: '#fb923c',
    details: {
      intro: "Bridge the gap between education and employment.",
      benefits: [
        { title: "Aggregated Group Insights", text: "Perfect dashboard for educators to see collective bottlenecks." },
        { title: "Curriculum Fine-Tuning", text: "Update course modules dynamically based on high-demand skills." }
      ],
      howItWorks: "Aggregates individual student skill vectors into a unified cohort centroid.",
      ctaText: "Analyze your cohort gap"
    }
  },
  {
    id: 10,
    title: "Tiered Access & Control",
    shortDesc: "Flexible account levels (Free, Pro, Enterprise) to manage CV limits, LLM requests, and depth.",
    icon: Shield,
    category: "Platform Scaling",
    color: '#fb923c',
    details: {
      intro: "A robust tier management system built to provide value at every scale.",
      benefits: [
        { title: "Flexible Plan Structuring", text: "Easily scale your limits and monthly analyses." },
        { title: "Usage & Tokens Analytics", text: "Track your token consumption and monthly queries." }
      ],
      howItWorks: "Integrated gateway validating user context and database limits dynamically on every request.",
      ctaText: "View plan details"
    }
  }
];

const MOCK_CODE_SNIPPETS = [
  `_isHost = true;\n$act.css({ opacity: 1 });\n\nfunction init() {\n  size = fig.size;\n  runHandler();\n}`,
  `const semanticMatch = (cv, job) => {\n  const scores = cv.map(s => s.score);\n  return Math.max(...scores);\n};`,
  `predictSkills(target) {\n  const req = target.requirements;\n  return ML.predict(req);\n}`,
  `async function generatePDF(userId) {\n  const report = await render(PDFTemplate);\n  return createShareableLink(report);\n}`,
  `generateRoadmap(user) {\n  const milestones = [];\n  for (let i = 0; i < 4; i++) {\n    milestones.push(week[i]);\n  }\n}`,
  `function boostEmployment(course) {\n  const rate = course.boostFactor * 100;\n  return rate;\n}`,
  `trackTrendingJobs() {\n  const market = local.fetch();\n  return market.trending;\n}`,
  `function syncCohortMetrics(cohort) {\n  return cohort.grades.average();\n}`,
  `optimizeCurriculum(cohort) {\n  const gaps = cohort.getWeaknesses();\n  return gaps.map(g => g.fix());\n}`,
  `class AccountLevel {\n  constructor(type) {\n    this.limit = type === 'Pro' ? 100 : 10;\n  }\n}`
];

const hexToRgb = (hex) => {
  if (!hex || hex.length < 7) return '52, 211, 153';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export default function OverviewDashboard({ onOpenAuth }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const rafRef = useRef(null);

  const progressRef = useRef(0);       // 0..1 scroll progress
  const targetProgressRef = useRef(0);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const targetMouseXRef = useRef(0);
  const targetMouseYRef = useRef(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    // ── Scroll handler ──────────────────────────────────────────
    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const wrapperTop = -rect.top;
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, wrapperTop / scrollable));
      targetProgressRef.current = p;
    };

    // ── Mouse handler ───────────────────────────────────────────
    const onMouseMove = (e) => {
      const rect = stage.getBoundingClientRect();
      targetMouseXRef.current = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseYRef.current = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onMouseLeave = () => {
      targetMouseXRef.current = 0;
      targetMouseYRef.current = 0;
    };

    // ── Animation loop ──────────────────────────────────────────
    const N = FEATURES_DATA.length; // 10

    const tick = () => {
      progressRef.current += (targetProgressRef.current - progressRef.current) * 0.07;
      mouseXRef.current += (targetMouseXRef.current - mouseXRef.current) * 0.08;
      mouseYRef.current += (targetMouseYRef.current - mouseYRef.current) * 0.08;

      const p = progressRef.current;

      // ── Spiral staircase helix ──
      // Cards orbit the spine (Y-axis) AND step up/down — exactly like a spiral staircase.
      // The central purple spine = the staircase column.
      const RADIUS    = 580;   // distance from spine to card
      const angleStep = 360 / N;   // 36° between each card
      const STEP_Y    = 110;   // vertical distance between each stair step (px)

      // Smooth active float index
      const activeFloat   = p * (N - 1);
      const carouselAngle = activeFloat * angleStep;

      const activeIdx = Math.max(0, Math.min(N - 1, Math.round(activeFloat)));
      if (activeIdx !== activeIndexRef.current) {
        activeIndexRef.current = activeIdx;
        setActiveIndex(activeIdx);
      }

      const mx = mouseXRef.current;
      const my = mouseYRef.current;

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        // Angle of this card relative to the front of the carousel
        const effectiveAngle = i * angleStep - carouselAngle;
        const rad    = effectiveAngle * Math.PI / 180;
        const cosVal = Math.cos(rad); // 1 = front, -1 = back

        // ── Helix Y position ──
        // Each card is STEP_Y pixels below the next (like a stair step).
        // Active card is always at eye level (y=0). Others step above/below.
        const helixY = (i - activeFloat) * STEP_Y;

        // Mouse parallax — only on front card
        const frontness   = Math.max(0, cosVal);
        const tiltX       = -my * 9 * frontness;
        const tiltY_mouse =  mx * 9 * frontness;

        // Visibility: front = opaque, side = dim, back = hidden by backface-visibility
        const opacity = Math.max(0.08, cosVal * 0.58 + 0.44);
        const scale   = 0.80 + frontness * 0.20;

        const zIndex        = Math.round((cosVal + 1) * 50 + 1);
        const pointerEvents = cosVal > 0.78 ? 'auto' : 'none';

        // ── Transform: spiral staircase ──
        // rotateY → position on circle around spine
        // translateZ → push out from spine (RADIUS)
        // translateY → stair step height (in world Y, unaffected by rotateY)
        card.style.transform = [
          `rotateX(${tiltX}deg)`,
          `rotateY(${effectiveAngle + tiltY_mouse}deg)`,
          `translateZ(${RADIUS}px)`,
          `translateY(${helixY}px)`,
          `scale(${scale})`
        ].join(' ');

        card.style.opacity       = String(opacity);
        card.style.filter        = 'none';
        card.style.zIndex        = String(zIndex);
        card.style.pointerEvents = pointerEvents;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    stage.addEventListener('mousemove', onMouseMove);
    stage.addEventListener('mouseleave', onMouseLeave);
    rafRef.current = requestAnimationFrame(tick);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      stage.removeEventListener('mousemove', onMouseMove);
      stage.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="overview-container">
      {/* Hero */}
      <div className="overview-hero">
        <h1>Discover the Future of Hiring</h1>
        <p>
          JobPath bridges the gap between candidates, educators, and the modern market using
          state-of-the-art hybrid machine learning, deep NLP semantic models, and real-time analytical dashboards.
        </p>
        <div className="scroll-indicator">
          <span>Scroll down to explore features</span>
          <div className="scroll-indicator-mouse">
            <div className="scroll-indicator-wheel"></div>
          </div>
        </div>
      </div>

      {/* ── Sticky scroll wrapper ── */}
      <div className="carousel-sticky-wrapper" ref={wrapperRef}>
        {/* Nebula particles */}
        <div className="nebula-dust-container">
          {Array.from({ length: 30 }).map((_, idx) => (
            <div
              key={idx}
              className={`nebula-particle p-${idx + 1}`}
              style={{
                '--delay': `${(idx * 0.45).toFixed(2)}s`,
                '--left': `${(idx * 3.3).toFixed(1)}%`,
                '--scale': `${(0.4 + (idx % 4) * 0.2).toFixed(1)}`,
                '--speed': `${(10 + (idx % 3) * 5)}s`
              }}
            />
          ))}
        </div>

        {/* Sticky stage */}
        <div className="carousel-sticky-container" ref={stageRef}>



          {/* ── 3D CARD STAGE ── */}
          <div className="at-card-stage">
            {/* CPU Background Image */}
            <div className="carousel-center-cpu-bg">
              <img src="/cpu-bg.png" alt="CPU Circuit" />
            </div>

            {/* Cards deck */}
            <div className="at-cards-deck">
              {FEATURES_DATA.map((feat, index) => {
                const IconComponent = feat.icon;
                const themeColor = feat.color;
                return (
                  <div
                    key={feat.id}
                    className={`at-card card-theme-${feat.id}`}
                    ref={el => cardsRef.current[index] = el}
                    onClick={() => index === activeIndex && setSelectedFeature(feat)}
                    style={{ '--theme-color': themeColor }}
                  >
                    {/* Artistic overlay */}
                    <div className="card-artistic-overlay" />
                    {/* Code backdrop */}
                    <div className="card-code-backdrop">
                      <pre>{MOCK_CODE_SNIPPETS[index]}</pre>
                    </div>

                    <div className="card-content-wrap">
                      <div className="card-number-badge">
                        {String(feat.id).padStart(2, '0')} · FEATURE
                      </div>
                      <div className="card-icon-wrapper" style={{
                        background: `rgba(${hexToRgb(themeColor)}, 0.08)`,
                        borderColor: `rgba(${hexToRgb(themeColor)}, 0.2)`,
                        color: themeColor
                      }}>
                        <IconComponent size={20} />
                      </div>
                      <h3>{feat.title}</h3>
                      <p className="card-description">{feat.shortDesc}</p>
                      <span className="card-tag-badge" style={{
                        color: themeColor,
                        borderColor: `rgba(${hexToRgb(themeColor)}, 0.3)`
                      }}>
                        {feat.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active card label */}
            <div className="at-progress-label">
              {String(activeIndex + 1).padStart(2, '0')} / {String(FEATURES_DATA.length).padStart(2, '0')}
            </div>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="overview-cta-section">
        <div className="overview-cta-content">
          <h2>Ready to Supercharge Your Career?</h2>
          <p>
            Join thousands of professionals, bootcamps, and top companies using JobPath to build,
            map, and hire elite technical talent. Get started today in under two minutes.
          </p>
          <div className="overview-cta-buttons">
            <button className="btn" onClick={() => onOpenAuth('signup')}>
              Get Started for Free <ArrowRight size={16} />
            </button>
            <button className="btn-outline" onClick={() => onOpenAuth('signin')}>
              Sign In to Your Portal
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedFeature && (
        <div className="modal-overlay" onClick={() => setSelectedFeature(null)}>
          <div className="detail-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedFeature(null)}>
              <X size={18} />
            </button>
            <div className="detail-modal-header">
              <div className="detail-modal-icon-container">
                {React.createElement(selectedFeature.icon, { size: 32 })}
              </div>
              <div className="detail-modal-title">
                <span className="badge">{selectedFeature.category}</span>
                <h2>{selectedFeature.title}</h2>
              </div>
            </div>
            <div className="detail-modal-body">
              <div className="detail-section-title"><Globe size={18} /><span>Overview</span></div>
              <p>{selectedFeature.details.intro}</p>
              <div className="detail-section-title"><Target size={18} /><span>Key Practical Benefits</span></div>
              <div className="detail-highlights">
                {selectedFeature.details.benefits.map((b, i) => (
                  <div key={i} className="detail-highlight-card">
                    <h4>{b.title}</h4>
                    <p>{b.text}</p>
                  </div>
                ))}
              </div>
              <div className="detail-section-title"><Zap size={18} /><span>How It Works</span></div>
              <p>{selectedFeature.details.howItWorks}</p>
              <div className="detail-modal-cta">
                <h3>Unlock Full Capabilities</h3>
                <p>Register an account to analyze your documents and map your custom career progression.</p>
                <button className="btn" onClick={() => { setSelectedFeature(null); onOpenAuth('signup'); }}>
                  {selectedFeature.details.ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}