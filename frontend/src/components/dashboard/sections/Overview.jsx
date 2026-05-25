import { useEffect, useState } from 'react';
import { Briefcase, Target, TrendingUp, Award } from 'lucide-react';
import MetricCard from './components/MetricCard';
import CareerScoreCard from './components/CareerScoreCard';
import ProfileStrengthCard from './components/ProfileStrengthCard';

export default function OverviewSection({ userTier }) {
  const [marketInsights, setMarketInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketInsights();
  }, []);

  const fetchMarketInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/market/insights');
      if (!response.ok) throw new Error('Failed to fetch market insights');
      const data = await response.json();
      setMarketInsights(data);
    } catch (err) {
      setError(err.message);
      console.error('Market insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-overview">
      {/* Career Score & Daily Digest */}
      <div className="overview-grid-top">
        <CareerScoreCard />
        <div className="daily-digest-card glass-card">
          <h3 className="card-title">Market Pulse</h3>
          {loading ? (
            <div className="loading-state">Loading market data...</div>
          ) : error ? (
            <div className="error-state">Failed to load market insights</div>
          ) : marketInsights ? (
            <div className="digest-content">
              <p className="digest-text">{marketInsights.trend_summary}</p>
              <div className="salary-info">
                <span className="label">Estimated Salary Range:</span>
                <span className="value">{marketInsights.salary_range}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Metric cards */}
      <div className="overview-metrics">
        <MetricCard
          title="Matching Jobs"
          value="24"
          change="+8 this week"
          changeType="positive"
          icon={Briefcase}
        />
        <MetricCard
          title="Hire Probability"
          value="78%"
          change="+5% last month"
          changeType="positive"
          icon={Target}
        />
        <MetricCard
          title="Market Fit"
          value="92%"
          change="+12%"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Interview Ready"
          value="12"
          change="+3 this month"
          changeType="positive"
          icon={Award}
        />
      </div>

      {/* Bottom row */}
      <div className="overview-grid-bottom">
        <ProfileStrengthCard />
        <div className="recent-activity-card glass-card">
          <h3 className="card-title">Top Job Roles</h3>
          {marketInsights && marketInsights.top_roles ? (
            <div className="roles-list">
              {marketInsights.top_roles.slice(0, 5).map((role, idx) => (
                <div key={idx} className="role-item">
                  <div className="role-name">{role}</div>
                  <div className="role-badge">In Demand</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading-state">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}
