export default function MetricCard({ title, value, change, changeType, icon: Icon, delay = 0 }) {
  return (
    <div
      className="metric-card glass-card"
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div className="metric-header">
        <h4 className="metric-title">{title}</h4>
        <div className="metric-icon">
          <Icon size={20} />
        </div>
      </div>

      <div className="metric-value">{value}</div>

      <div className={`metric-change ${changeType}`}>
        <span className="change-text">{change}</span>
      </div>
    </div>
  );
}
