import { User } from 'lucide-react';

export default function ProfileStrengthCard() {
  const skills = [
    { name: 'Python', strength: 90 },
    { name: 'Linux', strength: 85 },
    { name: 'Security', strength: 70 },
    { name: 'Networking', strength: 65 },
    { name: 'Databases', strength: 75 },
  ];

  const totalStrength = Math.round(skills.reduce((sum, skill) => sum + skill.strength, 0) / skills.length);

  return (
    <div className="profile-strength-card glass-card">
      <div className="strength-header">
        <h3 className="card-title">Profile Strength</h3>
        <User size={24} className="strength-icon" />
      </div>

      <div className="overall-strength">
        <div className="strength-value">{totalStrength}%</div>
        <div className="strength-label">Overall Profile</div>
      </div>

      <div className="skills-breakdown">
        {skills.map((skill, idx) => (
          <div key={idx} className="skill-item">
            <div className="skill-name">{skill.name}</div>
            <div className="skill-bar">
              <div
                className="skill-fill"
                style={{ width: `${skill.strength}%` }}
              />
            </div>
            <div className="skill-value">{skill.strength}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
