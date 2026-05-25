import { useEffect, useState } from 'react';
import { TrendingUp, Activity, Users } from 'lucide-react';

export default function MarketSection({ userTier }) {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketInsights();
  }, []);

  const fetchMarketInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/market/insights');
      if (!response.ok) throw new Error('Failed to fetch market insights');
      const data = await response.json();
      setMarketData(data);
    } catch (err) {
      setError(err.message);
      console.error('Market data error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-market">
      <div className="section-header">
        <h2 className="section-title">Market Pulse & Trends</h2>
        <p className="section-description">
          Real-time insights from the job market based on Telegram job postings
        </p>
      </div>

      {loading ? (
        <div className="loading-state">Loading market data...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : marketData ? (
        <div className="market-content">
          {/* Trend Summary */}
          <div className="trend-card glass-card">
            <div className="trend-header">
              <Activity size={24} />
              <h3>Market Pulse</h3>
            </div>
            <p className="trend-text">{marketData.trend_summary}</p>
          </div>

          {/* Top Roles */}
          <div className="market-section-card glass-card">
            <div className="section-title flex items-center gap-2">
              <Trending size={22} />
              Top In-Demand Roles
            </div>
            <div className="roles-list">
              {marketData.top_roles?.map((role, idx) => (
                <div key={idx} className="role-item">
                  <div className="role-rank">#{idx + 1}</div>
                  <div className="role-name">{role}</div>
                  <div className="role-indicator active">In Demand</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Skills */}
          <div className="market-section-card glass-card">
            <div className="section-title">Most Sought Skills</div>
            <div className="skills-demand-grid">
              {marketData.top_skills?.map((skill, idx) => (
                <div key={idx} className="skill-demand-item">
                  <div className="skill-name">{skill.skill}</div>
                  <div className="demand-bar">
                    <div
                      className="demand-fill"
                      style={{ width: `${skill.demand_growth}%` }}
                    />
                  </div>
                  <div className="demand-value">{skill.demand_growth}% demand</div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Information */}
          <div className="salary-card glass-card">
            <div className="salary-header">
              <h3 className="section-title">Salary Insights</h3>
            </div>
            <div className="salary-display">
              <div className="salary-range">{marketData.salary_range}</div>
              <p className="salary-note">
                Average salary range for junior positions based on current market data
              </p>
            </div>
          </div>

          {/* Market Stats */}
          <div className="market-stats">
            <div className="stat-card glass-card">
              <div className="stat-value">24</div>
              <div className="stat-label">Active Job Postings</div>
              <div className="stat-trend positive">↑ +8 this week</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-value">92%</div>
              <div className="stat-label">Market Fit</div>
              <div className="stat-trend positive">↑ +12%</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-value">18</div>
              <div className="stat-label">Average Open Days</div>
              <div className="stat-trend positive">↓ -3 days</div>
            </div>
          </div>

          {/* Market Insights */}
          {userTier === 'pro' && (
            <div className="insights-card glass-card">
              <h3 className="section-title">Pro: Advanced Market Insights</h3>
              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📊</div>
                  <h4>Detailed Analytics</h4>
                  <p>Track salary trends, skill evolution, and hiring patterns over time</p>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <h4>Competitive Analysis</h4>
                  <p>See how your skills compare to other candidates in the market</p>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">🚀</div>
                  <h4>Growth Predictions</h4>
                  <p>AI-powered projections on emerging roles and technologies</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
