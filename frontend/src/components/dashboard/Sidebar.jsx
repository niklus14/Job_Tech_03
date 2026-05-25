import {
  LayoutDashboard,
  User,
  Briefcase,
  Target,
  Map,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
}) {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'CV & Profile', icon: User },
    { id: 'jobs', label: 'Job Matches', icon: Briefcase },
    { id: 'skills', label: 'Skill Analysis', icon: Target },
    { id: 'career', label: 'Career Path', icon: Map },
    { id: 'market', label: 'Market Insights', icon: TrendingUp },
  ];

  const handleNavClick = (sectionId) => {
    onSectionChange(sectionId);
    onMobileClose();
  };

  return (
    <>
      <aside
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Sparkles size={24} />
          </div>
          {!collapsed && <span className="logo-text">JobPath</span>}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse button */}
        <button
          className="sidebar-toggle"
          onClick={() => onCollapsedChange(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
    </>
  );
}
