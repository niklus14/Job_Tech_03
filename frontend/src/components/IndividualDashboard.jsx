import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import {
  Upload, FileText, Target, Briefcase, Sparkles,
  ChevronRight, ExternalLink, AlertTriangle, CheckCircle,
  Lightbulb, Clock, MapPin, Building, Lock, Crown,
  BookOpen, TrendingUp, ArrowRight, Zap
} from 'lucide-react';
import { jobCategories } from '../data/jobMeta';
import { API_URL } from '../apiConfig';

function ScoreGauge({ score, label, size = 160 }) {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return '#10b981';
    if (s >= 45) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="score-gauge">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="score-gauge-track" cx={size / 2} cy={size / 2} r={radius} />
        <circle
          className="score-gauge-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
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

function BlurOverlay({ children, isLocked, onUpgrade, label = 'Pro Feature' }) {
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
  const [history, setHistory] = useState([]);
  const [sampleCvs, setSampleCvs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['cybersecurity']);
  const [shareLink, setShareLink] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const fileInputRef = useRef(null);
  const isPro = tier === 'pro';

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get(`${API_URL}/individual/sample-cvs`);
        setSampleCvs(res.data.samples || []);
      } catch (err) {
        console.warn('Sample CVs unavailable', err);
      }
    };
    fetchSamples();
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setSelectedFile(files[0]);
      setAnalysis(null);
      setShareLink('');
      setCopyMessage('');
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setAnalysis(null);
      setShareLink('');
      setCopyMessage('');
    }
  };

  const handleToggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId];
      return next.length === 0 ? ['cybersecurity'] : next;
    });
    setAnalysis(null);
    setShareLink('');
    setCopyMessage('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setAnalysis(null);
    setShareLink('');
    setCopyMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tier', tier);
    try {
      formData.append('target_category', selectedCategories.join(','));
      const res = await axios.post(`${API_URL}/individual/upload-cv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const latest = { ...res.data, analyzed_at: new Date().toISOString() };
      setAnalysis(latest);
      setHistory((prev) => [latest, ...prev].slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSample = (filename) => {
    setLoading(true);
    setAnalysis(null);
    setSelectedFile({ name: filename, isSample: true });
    setShareLink('');
    setCopyMessage('');
    (async () => {
      const formData = new FormData();
      formData.append('filename', filename);
      formData.append('tier', tier);
      formData.append('target_category', selectedCategories.join(','));
      try {
        const res = await axios.post(`${API_URL}/individual/analyze-sample`, formData);
        const latest = { ...res.data, analyzed_at: new Date().toISOString() };
        setAnalysis(latest);
        setHistory((prev) => [latest, ...prev].slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleCopyLink = async () => {
    if (!analysis) return;
    const link = `${window.location.origin}${window.location.pathname}?report=${encodeURIComponent(analysis.filename)}`;
    setShareLink(link);
    try {
      await navigator.clipboard.writeText(link);
      setCopyMessage('Share link copied to clipboard!');
    } catch {
      setCopyMessage('Copy failed. Use this link manually.');
    }
  };

  const getScoreClass = (pct) => (pct >= 70 ? 'high' : pct >= 40 ? 'medium' : 'low');

  const selectedCategoryObjects = jobCategories.filter((category) => selectedCategories.includes(category.id));
  const resultCategoryLabel = jobCategories.find((category) => category.id === analysis?.target_category)?.label || analysis?.target_category || 'Selected fields';

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', paddingBottom: 0 }}>
            <Target size={24} style={{ color: 'var(--accent-primary)' }} />
            Individual Career Intelligence
            <span className={`tier-badge ${isPro ? 'pro' : 'free'}`}>{isPro ? '⭐ Pro' : 'Free'}</span>
          </h2>
          <p className="text-secondary">Upload a PDF CV, choose your target career fields, and get instant skill match analytics.</p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          {jobCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`category-chip ${selectedCategories.includes(category.id) ? 'active' : ''}`}
              onClick={() => handleToggleCategory(category.id)}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
        <div className="text-secondary" style={{ fontSize: '0.9rem' }}>
          Selected fields: {selectedCategoryObjects.map((category) => category.label).join(', ')}.
          The analysis adapts to the job categories you care about.
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Briefcase size={18} style={{ color: 'var(--accent-secondary)' }} /> Selected Target Fields
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', marginTop: '1rem' }}>
            {selectedCategoryObjects.map((category) => (
              <div key={category.id} className="pill" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(59, 130, 246, 0.15)' }}>
                <span>{category.emoji}</span>
                {category.label}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Focus your CV analysis on the categories that match your career goals. You may select 1 to 9 fields.
          </div>
          {sampleCvs.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Try a sample analysis:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {sampleCvs.map((cv, i) => (
                  <button key={i} className="btn-outline btn-sm" onClick={() => handleAnalyzeSample(cv.filename)} disabled={loading}>
                    <FileText size={14} /> {cv.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className={`upload-zone ${isDragging ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} style={{ display: 'none' }} />
          <div className="upload-zone-icon">
            {selectedFile ? <CheckCircle size={48} style={{ color: 'var(--success)' }} /> : <Upload size={48} />}
          </div>
          {selectedFile ? (
            <>
              <h3 style={{ color: 'var(--success)' }}>{selectedFile.name}</h3>
              <p>Click to change file or drag a new one</p>
              <button className="btn" onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} disabled={loading} style={{ marginTop: '1.5rem', position: 'relative', zIndex: 2 }}>
                {loading ? <><span className="spinner"></span> Analyzing...</> : <><Sparkles size={18} /> Analyze My CV</>}
              </button>
            </>
          ) : (
            <>
              <h3>Drop your CV here</h3>
              <p>or click to browse • PDF files only</p>
            </>
          )}
        </div>
      </div>

      {loading && !analysis && (
        <div className="glass-card animate-pulse" style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></span>
          <h3 style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Generating your multi-category fit profile...
          </h3>
        </div>
      )}

      {analysis && (
        <div className="animate-scale-in">
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} style={{ color: 'var(--accent-primary)' }} /> Overall Job Fit
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <div className="metric-value" style={{ fontSize: '3rem' }}>{Math.round(analysis.overall_score)}</div>
                <div>
                  <div className="metric-label">Fit score</div>
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
                    Based on your CV and the latest Telegram-derived job postings.
                  </div>
                  <div style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Target fields: {resultCategoryLabel}
                  </div>
                </div>
              </div>
              <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {analysis.summary || 'Your CV has been matched to active roles in the market using available skills and job descriptions.'}
              </p>
            </div>

            <div className="glass-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--success)' }} /> Extracted Skills
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Skills found in your CV that are being matched against live job requirements.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {analysis.extracted_skills.map((skill, index) => (
                  <span key={index} className="pill accent">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={18} style={{ color: 'var(--accent-secondary)' }} /> Top Job Matches
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Live Telegram job postings matched with your CV.
                </p>
              </div>
              <div className="pill" style={{ background: 'rgba(59, 130, 246, 0.08)', color: 'var(--accent-primary)' }}>
                {analysis.top_matches.length} matched roles
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {analysis.top_matches.map((job, i) => (
                <div key={i} className="job-match-card animate-slide-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="job-match-header">
                    <div>
                      <div className="job-match-title">{job.title}</div>
                      <div className="job-match-company">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Building size={14} /> {job.company}</span>
                        <span style={{ margin: '0 0.5rem', color: 'var(--glass-border)' }}>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {job.location}</span>
                      </div>
                    </div>
                    <div className={`job-match-score ${getScoreClass(job.match_percentage)}`}>{job.match_percentage}%</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>Matched Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {job.matched_skills.map((skill, j) => (
                          <span key={j} className="pill success">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>Missing Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {job.missing_skills.map((skill, j) => (
                          <span key={j} className="pill danger">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
                    {job.url && (
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="course-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        View job posting <ExternalLink size={12} />
                      </a>
                    )}
                    {job.hr_emails && job.hr_emails.length > 0 && (
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        HR contacts: {job.hr_emails.join(', ')}
                      </div>
                    )}
                    {job.salary && job.salary.raw && (
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Salary: {job.salary.raw} {job.salary.currency}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {analysis.plan && (
            <div className="glass-card" style={{ borderLeft: '4px solid var(--warning)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--warning)' }} /> Next Steps
              </h3>
              <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
                Your plan allows {analysis.plan.analyses_today}/{analysis.plan.analyses_limit} free CV reviews today.
              </p>
            </div>
          )}
        </div>
      )}

      {!analysis && !loading && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={56} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Upload your CV to get started</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            We'll generate your multi-role skill map, missing skills, top jobs, and 30/60/90 plan.
          </p>
        </div>
      )}
    </div>
  );
}
