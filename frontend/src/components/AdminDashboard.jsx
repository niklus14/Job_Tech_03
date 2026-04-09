import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:8001';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/cohort-gap`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchCohort();
  }, []);

  if (loading) return <div className="animate-fade-in"><div className="glass-card">Loading admin data...</div></div>;
  if (!data) return <div className="glass-card">Error loading admin data</div>;

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={24} className="text-warning"/> 
            Institution & Policy View
          </h2>
          <p className="text-secondary">Identify systemic gaps between curriculum outputs and active market demand.</p>
        </div>
      </div>

      <div className="grid-3 animate-fade-in">
        {/* Alignment */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} className="text-warning" /> Cohort Alignment
          </h3>
          <div className="metric-value" style={{ color: 'var(--warning)' }}>{data.alignment_score}%</div>
          <div className="metric-label">Curriculum to Market Match</div>
          
          <div className="progress-bar-container" style={{ marginTop: '1.5rem', height: '12px', background: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="progress-bar-fill" style={{ width: `${data.alignment_score}%`, background: 'var(--warning)' }}></div>
          </div>
          
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Cohort: <strong>{data.cohort_id}</strong> is at risk of under-producing in key high-demand areas.
          </p>
        </div>

        {/* Undersupplied */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} className="text-danger" /> Critical Skill Deficits
          </h3>
          <p className="text-secondary" style={{ marginBottom: '1rem' }}>Skills demanded by employers but missing in graduation profiles:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.undersupplied_skills.map((skill, index) => (
              <span key={index} className="pill danger" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>{skill}</span>
            ))}
          </div>
        </div>

        {/* Oversupplied */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} className="text-success" /> Sustained Surplus
          </h3>
          <p className="text-secondary" style={{ marginBottom: '1rem' }}>Skills highly present in curriculum but seeing stable/lowering market urgency:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {data.oversupplied_skills.map((skill, index) => (
              <span key={index} className="pill success" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
