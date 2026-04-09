import { useState } from 'react';
import axios from 'axios';
import { Target, Search, BookOpen, Award, Code, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:8001';

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState('stu_01');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loadingExpl, setLoadingExpl] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Fetch mock student basic details
      const targetRole = studentId === 'stu_01' ? 'Junior Data Analyst' : 'Frontend Developer';
      
      const res = await axios.post(`${API_URL}/student/analyze`, {
        id: studentId,
        name: studentId === 'stu_01' ? 'Aysel Mammadova' : 'Tural Aliyev',
        current_skills: [],
        target_role: targetRole,
        completed_courses: []
      });
      setData(res.data);
      setExplanation(null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleExplain = async () => {
    if (!data) return;
    setLoadingExpl(true);
    try {
      const res = await axios.post(`${API_URL}/explain/recommendation`, data);
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error(err);
    }
    setLoadingExpl(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2>Student Intelligence Profile</h2>
          <p className="text-secondary">Analyze skill gaps and find your personalized path to employment.</p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <select 
            className="input-field" 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)}
            style={{ width: '250px' }}
          >
            <option value="stu_01">Aysel (Target: Junior Data Analyst)</option>
            <option value="stu_02">Tural (Target: Frontend Developer)</option>
          </select>
          <button className="btn" onClick={handleAnalyze} disabled={loading}>
            <Search size={18} /> {loading ? 'Analyzing...' : 'Analyze Profile'}
          </button>
        </div>
      </div>

      {data ? (
        <div className="grid-3 animate-fade-in">
          {/* Output Score */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} className="text-accent-primary" /> Readiness Score
            </h3>
            <div className="metric-value">{data.score}%</div>
            <div className="metric-label">For {data.role}</div>
            
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${data.score}%` }}></div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Based on matched technical skills, project portfolio, and market trends.</p>
            </div>
            
            <button className="btn" style={{marginTop: '1.5rem', width: '100%', justifyContent: 'center'}} onClick={handleExplain} disabled={loadingExpl}>
              <Award size={18} /> {loadingExpl ? 'Generating...' : 'Get AI Explanation'}
            </button>
          </div>

          {/* Missing Skills */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} className="text-warning" /> Skill Gaps
            </h3>
            <p className="text-secondary" style={{ marginBottom: '1rem' }}>Identified missing market-demanded skills for {data.role}:</p>
            <div>
              {data.missing_skills.map((skill, index) => (
                <span key={index} className="pill danger">{skill}</span>
              ))}
            </div>

            {explanation && (
              <div className="animate-fade-in" style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '4px' }}>
                <p style={{ fontSize: '0.875rem' }}><strong>AI Explainer:</strong> {explanation}</p>
              </div>
            )}
          </div>

          {/* Recommended Path */}
          <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} className="text-success" /> Recommended Path
            </h3>
            <p className="text-secondary" style={{ marginBottom: '1rem' }}>Personalized action items to improve your readiness score:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.recommendations.map((rec, index) => (
                <div key={index} style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    {rec.type === 'course' ? <BookOpen size={16} className="text-accent-secondary"/> : <Code size={16} className="text-accent-primary"/>}
                    <strong>{rec.title}</strong>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Search size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-secondary)' }}>Select a profile and run analysis to view intelligence</h3>
        </div>
      )}
    </div>
  );
}
