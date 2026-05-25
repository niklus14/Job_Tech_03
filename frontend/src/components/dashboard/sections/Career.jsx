import { TrendingUp, AlertCircle, Award } from 'lucide-react';

export default function CareerSection({ userTier }) {
  const careerPath = [
    {
      level: 1,
      title: 'Junior Developer',
      description: 'Entry-level position with guidance',
      skills: ['Core Language', 'Version Control', 'Basic Frameworks'],
      timeline: '0-1 year',
      salary: '₼1,500 - 2,500',
      status: 'current',
    },
    {
      level: 2,
      title: 'Mid-Level Developer',
      description: 'Independent contributor',
      skills: ['Advanced Concepts', 'System Design', 'Leadership'],
      timeline: '1-3 years',
      salary: '₼2,500 - 4,500',
      status: 'next',
    },
    {
      level: 3,
      title: 'Senior Developer',
      description: 'Technical leader & mentor',
      skills: ['Architecture', 'Mentoring', 'Strategy'],
      timeline: '3-5 years',
      salary: '₼4,500 - 7,000',
      status: 'future',
    },
    {
      level: 4,
      title: 'Lead/Principal Engineer',
      description: 'Strategic decision maker',
      skills: ['Vision', 'Innovation', 'Teams Management'],
      timeline: '5+ years',
      salary: '₼7,000+',
      status: 'future',
    },
  ];

  return (
    <div className="section-career">
      <div className="section-header">
        <h2 className="section-title">Your Career Path</h2>
        <p className="section-description">
          Projected growth trajectory based on your current skills and market trends
        </p>
      </div>

      <div className="career-timeline">
        {careerPath.map((stage, idx) => (
          <div
            key={idx}
            className={`career-stage glass-card ${stage.status}`}
          >
            <div className="stage-header">
              <div className="stage-number">{stage.level}</div>
              <div className="stage-info">
                <h3 className="stage-title">{stage.title}</h3>
                <p className="stage-desc">{stage.description}</p>
              </div>
            </div>

            <div className="stage-details">
              <div className="detail-item">
                <span className="label">Timeline:</span>
                <span className="value">{stage.timeline}</span>
              </div>
              <div className="detail-item">
                <span className="label">Salary Range:</span>
                <span className="value salary">{stage.salary}</span>
              </div>
            </div>

            <div className="stage-skills">
              <span className="label">Key Skills:</span>
              <div className="skill-tags">
                {stage.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {stage.status === 'current' && (
              <div className="status-badge current">
                <Award size={16} />
                You are here
              </div>
            )}
            {stage.status === 'next' && (
              <div className="status-badge next">
                <TrendingUp size={16} />
                Next Step
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Growth Factors */}
      <div className="growth-section glass-card">
        <h3 className="section-title flex items-center gap-2">
          <TrendingUp size={22} />
          What Accelerates Growth
        </h3>
        <div className="growth-factors">
          <div className="factor-item">
            <div className="factor-icon">📚</div>
            <div className="factor-content">
              <h4>Continuous Learning</h4>
              <p>Master new technologies and frameworks relevant to your domain</p>
            </div>
          </div>
          <div className="factor-item">
            <div className="factor-icon">🏗️</div>
            <div className="factor-content">
              <h4>Real Projects</h4>
              <p>Build portfolio projects that showcase your abilities</p>
            </div>
          </div>
          <div className="factor-item">
            <div className="factor-icon">🤝</div>
            <div className="factor-content">
              <h4>Networking</h4>
              <p>Connect with industry professionals and mentors</p>
            </div>
          </div>
          <div className="factor-item">
            <div className="factor-icon">🎖️</div>
            <div className="factor-content">
              <h4>Certifications</h4>
              <p>Earn relevant industry-recognized credentials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
