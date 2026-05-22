import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, MapPin, Briefcase, ChevronUp } from 'lucide-react';

import { API_URL } from '../apiConfig';

export default function MarketDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await axios.get(`${API_URL}/market/insights`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchMarket();
  }, []);

  if (loading) return <div className="animate-fade-in"><div className="glass-card">Loading market data...</div></div>;
  if (!data) return <div className="glass-card">Error loading market data</div>;

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={24} className="text-accent-primary"/> 
            Azerbaijan Labor Market Insights
          </h2>
          <p className="text-secondary">Live tracking of high-demand digital skills and roles.</p>
        </div>
      </div>

      <div className="grid-3 animate-fade-in">
        {/* Trend Summary */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} className="text-success" /> Market Trend Alert
          </h3>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.6', marginTop: '1rem' }}>
            {data.trend_summary}
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
            <div>
              <div className="metric-label">Growth Sector</div>
              <div className="metric-value text-accent-secondary" style={{ fontSize: '2rem' }}>+45%</div>
            </div>
            <div>
              <div className="metric-label">Remote Share</div>
              <div className="metric-value text-accent-primary" style={{ fontSize: '2rem' }}>28%</div>
            </div>
            <div>
              <div className="metric-label">Avg Range (Junior)</div>
              <div className="metric-value" style={{ fontSize: '2rem' }}>{data.salary_range || '₼ 1K - 2K'}</div>
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} className="text-accent-primary" /> Top Surging Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {data.top_skills.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ fontWeight: '600' }}>{item.skill}</span>
                <span className="pill success" style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                  <ChevronUp size={14} /> {item.demand_growth}% vs Yr
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Roles Demand List */}
        <div className="glass-card" style={{ gridColumn: 'span 3' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="var(--accent-secondary)" /> Most Recruited Roles (Last 30 Days)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            {data.top_roles.map((role, index) => (
              <div key={index} style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', flex: '1 1 calc(25% - 1rem)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s' }} className="hover-lift">
                <Users size={32} style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }} />
                <h4 style={{ margin: 0 }}>{role}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
