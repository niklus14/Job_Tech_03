import { useState, useEffect } from 'react';
import { useEffect as useEffectHook } from 'react';
import { Briefcase, MapPin, DollarSign, TrendingUp } from 'lucide-react';

export default function JobsSection({ userTier }) {
  const [studentProfile, setStudentProfile] = useState(null);
  const [readinessScore, setReadinessScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Junior Data Analyst');

  useEffect(() => {
    fetchJobMatches();
  }, [selectedRole]);

  const fetchJobMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a student profile for analysis
      const profile = {
        id: 'student_123',
        target_role: selectedRole,
        current_skills: ['Python', 'Basic SQL'],
      };

      const response = await fetch('http://localhost:8000/student/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Failed to fetch job matches');
      const data = await response.json();
      setReadinessScore(data);
    } catch (err) {
      setError(err.message);
      console.error('Job match error:', err);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    'Junior Data Analyst',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Security Engineer',
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="section-jobs">
      <div className="jobs-header">
        <h2 className="section-title">Job Matches & Readiness</h2>
        <div className="role-selector">
          <label>Select Target Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="select-input"
            disabled={loading}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Analyzing job matches...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : readinessScore ? (
        <div className="jobs-content">
          {/* Readiness Score */}
          <div className="readiness-card glass-card">
            <div className="score-display">
              <div className="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={getScoreColor(readinessScore.score)}
                    strokeWidth="3"
                    strokeDasharray={`${(readinessScore.score / 100) * 282.7} 282.7`}
                    strokeLinecap="round"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50px 50px',
                    }}
                  />
                </svg>
                <div className="score-text">
                  <div className="score-number">{readinessScore.score}%</div>
                  <div className="score-label">Job Ready</div>
                </div>
              </div>

              <div className="score-info">
                <h3>{readinessScore.role}</h3>
                <p className="explanation">{readinessScore.explanation}</p>
              </div>
            </div>
          </div>

          {/* Missing Skills */}
          {readinessScore.missing_skills && readinessScore.missing_skills.length > 0 && (
            <div className="skills-section glass-card">
              <h4 className="section-title">Skills You Need to Develop</h4>
              <div className="skills-list">
                {readinessScore.missing_skills.map((skill, idx) => (
                  <div key={idx} className="skill-need-item">
                    <div className="skill-name">{skill}</div>
                    <div className="skill-priority">
                      <TrendingUp size={16} />
                      <span>High Priority</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {readinessScore.recommendations && readinessScore.recommendations.length > 0 && (
            <div className="recommendations-section">
              <h4 className="section-title">Recommended Learning Path</h4>
              <div className="recommendations-list">
                {readinessScore.recommendations.map((rec, idx) => (
                  <div key={idx} className="rec-item glass-card">
                    <div className="rec-header">
                      <div className="rec-type-badge">{rec.type}</div>
                      <h5>{rec.title}</h5>
                    </div>
                    <p>{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
