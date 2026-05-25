import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, TrendingUp, AlertCircle } from 'lucide-react';

export default function AnalysisResult({ result, userTier, onNewAnalysis }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recError, setRecError] = useState(null);

  useEffect(() => {
    // Fetch AI recommendations if pro tier
    if (userTier === 'pro') {
      fetchRecommendations();
    }
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoadingRecs(true);
      setRecError(null);
      const response = await fetch('http://localhost:8000/individual/recommend', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setRecError(err.message);
      console.error('Recommendation error:', err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="analysis-result">
      <button className="back-button" onClick={onNewAnalysis}>
        <ArrowLeft size={20} />
        <span>New Analysis</span>
      </button>

      <div className="result-header">
        <h2 className="result-title">CV Analysis Results</h2>
        <p className="result-subtitle">Based on {result.target_category?.replace(/-/g, ' ')} market demands</p>
      </div>

      {/* Top Matches */}
      <div className="result-section">
        <h3 className="section-title">Top Job Matches</h3>
        <div className="matches-grid">
          {result.top_matches?.slice(0, 5).map((match, idx) => (
            <div key={idx} className="match-card glass-card">
              <div className="match-header">
                <div className="match-title">{match.title || 'Job Match'}</div>
                <div className="match-score" style={{ borderColor: getMatchColor(match.match_score || 0) }}>
                  {Math.round(match.match_score || 0)}%
                </div>
              </div>
              <div className="match-skills">
                <span className="label">Key Skills:</span>
                <div className="skill-tags">
                  {match.matched_skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="result-section">
        <h3 className="section-title">Your Skills</h3>
        <div className="skills-display">
          {result.extracted_skills?.map((skill, idx) => (
            <span key={idx} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      {result.missing_skills && result.missing_skills.length > 0 && (
        <div className="result-section alert-section">
          <div className="alert-box">
            <AlertCircle size={20} />
            <div>
              <h4>Skills Gap Identified</h4>
              <p>To improve your market readiness, consider acquiring:</p>
              <div className="missing-skills">
                {result.missing_skills.map((skill, idx) => (
                  <span key={idx} className="skill-chip missing">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations (Pro Only) */}
      {userTier === 'pro' && (
        <div className="result-section">
          <h3 className="section-title flex items-center gap-2">
            <Zap size={20} className="text-accent" />
            AI Recommendations
          </h3>
          {loadingRecs ? (
            <div className="loading-state">Loading AI recommendations...</div>
          ) : recError ? (
            <div className="error-state">Failed to load recommendations</div>
          ) : recommendations ? (
            <div className="recommendations-box glass-card">
              <div className="rec-header">
                <h4>Personalized Learning Path</h4>
              </div>
              <p className="rec-text">{recommendations.explanation}</p>

              {recommendations.recommendations && (
                <div className="recommendations-list">
                  {recommendations.recommendations.map((rec, idx) => (
                    <div key={idx} className="rec-item">
                      <div className="rec-type">{rec.type}</div>
                      <div className="rec-title">{rec.title}</div>
                      <div className="rec-desc">{rec.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Plan Info */}
      {result.plan && (
        <div className="plan-info">
          <div className="plan-detail">
            <span className="label">Current Plan:</span>
            <span className="value">{result.plan.tier === 'pro' ? 'Pro' : 'Free'}</span>
          </div>
          {result.plan.tier === 'free' && (
            <div className="plan-detail">
              <span className="label">Analyses Used:</span>
              <span className="value">
                {result.plan.analyses_today}/{result.plan.analyses_limit}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
