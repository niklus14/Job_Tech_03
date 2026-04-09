import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  Upload, FileText, Target, Briefcase, Sparkles,
  ChevronRight, ExternalLink, AlertTriangle, CheckCircle,
  Lightbulb, Clock, MapPin, Building, Lock, Crown,
  BookOpen, TrendingUp, ArrowRight, Zap
} from 'lucide-react';

const API_URL = 'https://eren14-newteam.hf.space';

function ScoreGauge({ score, label, size = 160 }) {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const getColor = (s) => {
    if (s >= 70) return '#10b981';
    if (s >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="score-gauge">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="score-gauge-track" cx={center} cy={center} r={radius} />
        <circle
          className="score-gauge-fill"
          cx={center} cy={center} r={radius}
          stroke={getColor(score)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-gauge-text">
        <div className="score-gauge-value" style={{ color: getColor(score), fontSize: size > 120 ? '2rem' : '1.25rem' }}>
          {score}%
        </div>
        <div className="score-gauge-label">{label}</div>
      </div>
    </div>
  );
}

function BlurOverlay({ children, isLocked, onUpgrade, label = "Pro Feature" }) {
  if (!isLocked) return children;
  return (
    <div className="blur-wrapper">
      <div className="blur-content">{children}</div>
      <div className="blur-overlay">
        <Lock size={24} />
        <span className="blur-label">{label}</span>
        <button className="upgrade-cta" onClick={onUpgrade}>
          <Crown size={16} /> Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

export default function IndividualDashboard({ tier = 'free', onShowPricing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [sampleCvs, setSampleCvs] = useState([]);
  const fileInputRef = useRef(null);
  const isPro = tier === 'pro';

  useEffect(() => {
    axios.get(`${API_URL}/individual/sample-cvs`)
      .then(res => setSampleCvs(res.data.samples || []))
      .catch(() => {});
  }, []);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setSelectedFile(files[0]); setAnalysis(null); setRecommendations(null);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) { setSelectedFile(file); setAnalysis(null); setRecommendations(null); }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true); setAnalysis(null); setRecommendations(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tier', tier);
      const res = await axios.post(`${API_URL}/individual/upload-cv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
    } catch (err) {
      if (err.response?.status === 429) {
        alert('Free tier limit reached (3/day). Upgrade to Pro for unlimited!');
      } else {
        console.error('Analysis error:', err);
        alert('Error analyzing CV.');
      }
    }
    setLoading(false);
  };

  const handleAnalyzeSample = async (filename) => {
    setLoading(true); setAnalysis(null); setRecommendations(null);
    setSelectedFile({ name: filename, isSample: true });
    try {
      const formData = new FormData();
      formData.append('filename', filename);
      formData.append('tier', tier);
      const res = await axios.post(`${API_URL}/individual/analyze-sample`, formData);
      setAnalysis(res.data);
    } catch (err) {
      if (err.response?.status === 429) {
        alert('Free tier limit reached (3/day). Upgrade to Pro for unlimited!');
      } else {
        console.error('Sample analysis error:', err);
      }
    }
    setLoading(false);
  };

  const handleGetRecommendations = async () => {
    if (!analysis) return;
    setLoadingRecs(true);
    try {
      const res = await axios.post(`${API_URL}/individual/recommend`);
      setRecommendations(res.data);
    } catch (err) { console.error('Recommendation error:', err); }
    setLoadingRecs(false);
  };

  const getScoreClass = (pct) => pct >= 70 ? 'high' : pct >= 40 ? 'medium' : 'low';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', paddingBottom: 0 }}>
            <Target size={24} style={{ color: 'var(--accent-primary)' }} />
            Individual Career Intelligence
            {!isPro && (
              <span className="tier-badge free">Free</span>
            )}
            {isPro && (
              <span className="tier-badge pro">⭐ Pro</span>
            )}
          </h2>
          <p className="text-secondary">Upload your CV and discover your job market fit in Azerbaijan • Cybersecurity</p>
        </div>
        {analysis?.plan && !isPro && (
          <div className="usage-badge">
            {analysis.plan.analyses_today} / {analysis.plan.analyses_limit} free today
          </div>
        )}
      </div>

      {/* Upload zone */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Left: Cybersecurity info + samples */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Briefcase size={18} style={{ color: 'var(--accent-secondary)' }} />
            Target Field: Cybersecurity
          </h3>

          {/* Field selector icons */}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* ── Active: Cybersecurity ── */}
            <div style={{
              flex: '1 1 0', minWidth: 90, padding: '0.75rem 0.5rem', borderRadius: '10px',
              border: '2px solid var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)',
              textAlign: 'center', cursor: 'default',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>🛡️</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cybersecurity</div>
            </div>

            {/* ── Decorative: ML ── */}
            <button type="button" onClick={() => {}} style={{
              flex: '1 1 0', minWidth: 90, padding: '0.75rem 0.5rem', borderRadius: '10px',
              border: '2px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)',
              textAlign: 'center', cursor: 'pointer', opacity: 0.7,
              transition: 'all 0.2s', color: 'inherit', fontFamily: 'inherit',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>🤖</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>ML</div>
            </button>

            {/* ── Decorative: Fullstack ── */}
            <button type="button" onClick={() => {}} style={{
              flex: '1 1 0', minWidth: 90, padding: '0.75rem 0.5rem', borderRadius: '10px',
              border: '2px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)',
              textAlign: 'center', cursor: 'pointer', opacity: 0.7,
              transition: 'all 0.2s', color: 'inherit', fontFamily: 'inherit',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>💻</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Fullstack</div>
            </button>

            {/* ── Decorative: Data Analysis ── */}
            <button type="button" onClick={() => {}} style={{
              flex: '1 1 0', minWidth: 90, padding: '0.75rem 0.5rem', borderRadius: '10px',
              border: '2px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)',
              textAlign: 'center', cursor: 'pointer', opacity: 0.7,
              transition: 'all 0.2s', color: 'inherit', fontFamily: 'inherit',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>📊</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Data Analysis</div>
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.85rem' }}>
            Matched against real Azerbaijan job postings
          </div>

          {sampleCvs.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Or try a sample CV:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sampleCvs.map((cv, i) => (
                  <button key={i} className="btn-outline btn-sm" onClick={() => handleAnalyzeSample(cv.filename)} disabled={loading}>
                    <FileText size={14} /> {cv.filename}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Upload Zone */}
        <div
          className={`upload-zone ${isDragging ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} style={{ display: 'none' }} />
          <div className="upload-zone-icon">
            {selectedFile ? <CheckCircle size={48} style={{ color: 'var(--success)' }} /> : <Upload size={48} />}
          </div>
          {selectedFile ? (
            <>
              <h3 style={{ color: 'var(--success)' }}>{selectedFile.name}</h3>
              <p>Click to change file or drag a new one</p>
            </>
          ) : (
            <>
              <h3>Drop your CV here</h3>
              <p>or click to browse • PDF files only</p>
            </>
          )}
          {selectedFile && !selectedFile.isSample && (
            <button className="btn" onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} disabled={loading}
              style={{ marginTop: '1.5rem', position: 'relative', zIndex: 2 }}>
              {loading ? <><span className="spinner"></span> Analyzing...</> : <><Sparkles size={18} /> Analyze My CV</>}
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && !analysis && (
        <div className="glass-card animate-pulse" style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></span>
          <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Running Hybrid AI Analysis (Local ML + Llama 3.3 70B)...
          </h3>
        </div>
      )}

      {/* ─── ANALYSIS RESULTS ─── */}
      {analysis && (
        <div className="animate-scale-in">
          {/* Score Gauges Row */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            {/* Overall Score (always visible) */}
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Target size={18} style={{ color: 'var(--accent-primary)' }} /> Overall Fit
              </h3>
              <ScoreGauge score={Math.round(analysis.overall_score)} label="Final Score" />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Refined by Llama 3.3 70B
              </p>
            </div>

            {/* Semantic Score (pro only) */}
            <BlurOverlay isLocked={!isPro} onUpgrade={onShowPricing} label="Semantic Score">
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Zap size={18} style={{ color: '#8b5cf6' }} /> Semantic Score
                </h3>
                <ScoreGauge
                  score={Math.round(analysis.top_matches[0]?.scores?.semantic || 0)}
                  label="CV-Job Similarity" size={140}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  SBERT embedding match
                </p>
              </div>
            </BlurOverlay>

            {/* Skill Match Score (pro only) */}
            <BlurOverlay isLocked={!isPro} onUpgrade={onShowPricing} label="Skill Match Score">
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} style={{ color: 'var(--success)' }} /> Skill Match
                </h3>
                <ScoreGauge
                  score={Math.round(analysis.top_matches[0]?.scores?.skill_match || 0)}
                  label="Skills Matched" size={140}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  RF model prediction match
                </p>
              </div>
            </BlurOverlay>
          </div>

          {/* Your Skills (pro only) */}
          {isPro && analysis.extracted_skills.length > 0 && (
            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--success)' }} /> Your Extracted Skills
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {analysis.extracted_skills.length} skills detected in your CV using spaCy NLP
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {analysis.extracted_skills.map((skill, i) => (
                  <span key={i} className="pill success">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Top Job Matches */}
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} style={{ color: 'var(--accent-secondary)' }} /> Top Job Matches
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Best cybersecurity positions in the Azerbaijan job market for your profile
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analysis.top_matches.map((job, i) => (
                <div key={i} className="job-match-card animate-slide-in" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="job-match-header">
                    <div>
                      <div className="job-match-title">{job.title}</div>
                      {isPro && (
                        <div className="job-match-company">
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Building size={14} /> {job.company}
                          </span>
                          <span style={{ margin: '0 0.5rem', color: 'var(--glass-border)' }}>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={14} /> {job.location}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`job-match-score ${getScoreClass(job.match_percentage)}`}>
                      {Math.round(job.match_percentage)}%
                    </div>
                  </div>

                  {/* Skills comparison */}
                  <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ✓ Matched Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {job.matched_skills.slice(0, isPro ? 20 : 4).map((s, j) => (
                          <span key={j} className="pill success" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ✗ Missing Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {job.missing_skills.slice(0, isPro ? 20 : 3).map((s, j) => (
                          <span key={j} className="pill danger" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>{s}</span>
                        ))}
                        {!isPro && job.missing_skills.length > 3 && (
                          <span className="pill" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', cursor: 'pointer', background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
                            onClick={onShowPricing}>
                            <Lock size={10} /> +more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pro: Required skills info */}
                  {isPro && job.required_skills && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Required ({job.required_skills.length}): </span>
                      {job.required_skills.join(', ')}
                    </div>
                  )}

                  {isPro && job.url && (
                    <a href={job.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontSize: '0.8rem', marginTop: '0.75rem', textDecoration: 'none' }}>
                      View Job Posting <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── COURSE RECOMMENDATIONS (PRO) ─── */}
          {analysis.top_matches[0]?.courses && analysis.top_matches[0].courses.length > 0 && (
            <BlurOverlay isLocked={!isPro} onUpgrade={onShowPricing} label="Course Recommendations">
              <div className="glass-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} style={{ color: '#8b5cf6' }} /> Course Recommendations
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Learn these skills to boost your match score for the top job
                </p>
                <div className="course-grid">
                  {analysis.top_matches[0].courses.map((course, i) => (
                    <div key={i} className="course-card">
                      <div className="course-skill">{course.skill}</div>
                      <div className="course-name">{course.course_name}</div>
                      <div className="course-platform">
                        <span className={`platform-badge ${course.platform.toLowerCase().replace(/\s/g, '')}`}>
                          {course.platform}
                        </span>
                      </div>
                      <a href={course.link} target="_blank" rel="noopener noreferrer" className="course-link">
                        Enroll Now <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </BlurOverlay>
          )}

          {/* ─── LEARNING PATH (PRO) ─── */}
          {analysis.top_matches[0]?.learning_path && analysis.top_matches[0].learning_path.length > 0 && (
            <BlurOverlay isLocked={!isPro} onUpgrade={onShowPricing} label="Learning Path">
              <div className="glass-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} style={{ color: 'var(--success)' }} /> Learning Path
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Learn each skill to progressively boost your match score
                </p>
                <div className="learning-path">
                  {/* Starting score */}
                  <div className="path-start">
                    <div className="path-score-circle start">
                      {Math.round(analysis.overall_score)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current</div>
                  </div>

                  {analysis.top_matches[0].learning_path.map((step, i) => (
                    <div key={i} className="path-step">
                      <div className="path-connector">
                        <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <div className="path-skill-card">
                        <div className="path-skill-name">{step.skill}</div>
                        <div className="path-impact">+{step.increase}%</div>
                      </div>
                      <div className="path-connector">
                        <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <div className={`path-score-circle ${step.after_learning_score >= 70 ? 'high' : step.after_learning_score >= 50 ? 'medium' : ''}`}>
                        {Math.round(step.after_learning_score)}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final projected score */}
                <div style={{
                  marginTop: '1.5rem', textAlign: 'center', padding: '1rem',
                  background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                    Projected Score After Full Path
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
                    {Math.round(analysis.top_matches[0].learning_path[analysis.top_matches[0].learning_path.length - 1].after_learning_score)}%
                  </div>
                </div>
              </div>
            </BlurOverlay>
          )}

          {/* ─── AI CAREER ADVISOR (PRO) ─── */}
          <BlurOverlay isLocked={!isPro} onUpgrade={onShowPricing} label="AI Career Advisor">
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightbulb size={18} style={{ color: 'var(--warning)' }} /> AI Career Advisor
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Get personalized strategy powered by Llama 3.3 70B
                </p>
              </div>
              {isPro && (
                <button className="btn" onClick={handleGetRecommendations} disabled={loadingRecs}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                  {loadingRecs ? <><span className="spinner"></span> Generating...</> : <><Sparkles size={18} /> Get AI Career Strategy</>}
                </button>
              )}
            </div>
          </BlurOverlay>

          {/* AI Recommendations output */}
          {recommendations && (
            <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-secondary)' }} /> AI Improvement Plan
                </h3>
                <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '10px', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>{recommendations.improvement_plan}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'var(--accent-secondary)' }}>
                    <Clock size={16} />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Estimated timeline: {recommendations.estimated_time}</span>
                  </div>
                </div>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Skills to Acquire</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recommendations.skill_gaps.map((rec, i) => (
                    <div key={i} className="rec-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{rec.skill}</strong>
                        <span className={`importance-badge ${rec.importance}`}>{rec.importance}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{rec.reason}</p>
                      {rec.resources?.length > 0 && (
                        <div style={{ fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Resources: </span>
                          {rec.resources.map((r, j) => (
                            <span key={j}>
                              <span style={{ color: 'var(--accent-primary)' }}>{r}</span>
                              {j < rec.resources.length - 1 && <span style={{ color: 'var(--glass-border)' }}> • </span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!analysis && !loading && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={56} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Upload your CV to get started
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            We'll analyze your skills against real cybersecurity job postings in Azerbaijan
          </p>
        </div>
      )}
    </div>
  );
}
