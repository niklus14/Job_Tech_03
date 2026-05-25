import { useState, useEffect } from 'react';
import { Award } from 'lucide-react';

export default function CareerScoreCard() {
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Simulate fetching career readiness score
    const targetScore = 78;
    setScore(targetScore);

    // Animate the score
    const interval = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev < targetScore) return prev + 1;
        clearInterval(interval);
        return targetScore;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="career-score-card glass-card">
      <div className="score-header">
        <h3 className="card-title">Career Readiness</h3>
        <Award size={24} className="score-icon" />
      </div>

      <div className="score-circle-container">
        <svg className="score-circle" viewBox="0 0 100 100">
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
            stroke={getScoreColor()}
            strokeWidth="3"
            strokeDasharray={`${(animatedScore / 100) * 282.7} 282.7`}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50px 50px',
              transition: 'stroke-dasharray 0.5s ease',
            }}
          />
        </svg>
        <div className="score-center">
          <div className="score-number">{animatedScore}%</div>
          <div className="score-label">Ready</div>
        </div>
      </div>

      <div className="score-details">
        <div className="detail-item">
          <span className="detail-label">Your Level:</span>
          <span className="detail-value">Intermediate</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Next Level:</span>
          <span className="detail-value">Advanced</span>
        </div>
      </div>
    </div>
  );
}
