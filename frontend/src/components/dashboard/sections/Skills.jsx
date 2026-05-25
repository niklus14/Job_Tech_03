import { useState, useEffect } from 'react';
import { Target, TrendingUp, BookOpen } from 'lucide-react';

export default function SkillsSection({ userTier }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading skills from backend
    setLoading(true);
    setTimeout(() => {
      setSkills([
        {
          name: 'Python',
          level: 90,
          category: 'Programming',
          marketDemand: 95,
          status: 'strong',
        },
        {
          name: 'Linux Administration',
          level: 85,
          category: 'System Administration',
          marketDemand: 88,
          status: 'strong',
        },
        {
          name: 'Cybersecurity Fundamentals',
          level: 70,
          category: 'Security',
          marketDemand: 92,
          status: 'developing',
        },
        {
          name: 'Network Security',
          level: 65,
          category: 'Security',
          marketDemand: 85,
          status: 'developing',
        },
        {
          name: 'SQL',
          level: 55,
          category: 'Databases',
          marketDemand: 80,
          status: 'beginner',
        },
        {
          name: 'Cloud Infrastructure (AWS)',
          level: 50,
          category: 'Cloud',
          marketDemand: 90,
          status: 'beginner',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'strong':
        return '#10b981';
      case 'developing':
        return '#f59e0b';
      case 'beginner':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getGapAnalysis = (level, demand) => {
    return Math.max(0, demand - level);
  };

  return (
    <div className="section-skills">
      <div className="section-header">
        <h2 className="section-title">Skill Analysis & Market Demand</h2>
        <p className="section-description">
          See how your skills stack up against current market demands and get insights on what to develop next.
        </p>
      </div>

      {loading ? (
        <div className="loading-state">Loading skill data...</div>
      ) : (
        <div className="skills-content">
          {/* Skills Grid */}
          <div className="skills-grid">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-card glass-card">
                <div className="skill-card-header">
                  <h4 className="skill-name">{skill.name}</h4>
                  <div className="skill-badge" style={{ backgroundColor: getStatusColor(skill.status) }}>
                    {skill.status}
                  </div>
                </div>

                <div className="skill-category">{skill.category}</div>

                {/* Your Level */}
                <div className="skill-level">
                  <div className="level-label">Your Level</div>
                  <div className="level-bar">
                    <div
                      className="level-fill"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: getStatusColor(skill.status),
                      }}
                    />
                  </div>
                  <div className="level-value">{skill.level}%</div>
                </div>

                {/* Market Demand */}
                <div className="market-demand">
                  <div className="demand-label flex items-center gap-1">
                    <TrendingUp size={16} />
                    Market Demand
                  </div>
                  <div className="demand-bar">
                    <div
                      className="demand-fill"
                      style={{ width: `${skill.marketDemand}%` }}
                    />
                  </div>
                  <div className="demand-value">{skill.marketDemand}%</div>
                </div>

                {/* Gap */}
                {getGapAnalysis(skill.level, skill.marketDemand) > 0 && (
                  <div className="gap-info">
                    <span className="gap-label">Gap to Close:</span>
                    <span className="gap-value">
                      +{getGapAnalysis(skill.level, skill.marketDemand)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="summary-section glass-card">
            <h3 className="section-title flex items-center gap-2">
              <Target size={22} />
              Development Recommendations
            </h3>

            <div className="recommendations">
              <div className="rec-category">
                <h4>🎯 Strengthen These Skills</h4>
                <ul>
                  {skills
                    .filter((s) => s.level >= 70 && s.marketDemand >= 80)
                    .map((s, i) => (
                      <li key={i}>{s.name} - Already strong, maintain & deepen knowledge</li>
                    ))}
                </ul>
              </div>

              <div className="rec-category">
                <h4>📈 Priority Development</h4>
                <ul>
                  {skills
                    .filter((s) => s.level < 70 && s.marketDemand >= 85)
                    .map((s, i) => (
                      <li key={i}>
                        {s.name} - High market demand, focus on learning this skill
                      </li>
                    ))}
                </ul>
              </div>

              {userTier === 'pro' && (
                <div className="rec-category">
                  <h4>🚀 Advanced Paths Available</h4>
                  <p>
                    As a Pro member, you have access to curated learning paths and personalized
                    course recommendations based on your profile.
                  </p>
                  <button className="btn btn-primary btn-sm">
                    <BookOpen size={16} />
                    View Learning Paths
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
