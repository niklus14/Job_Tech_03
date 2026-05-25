import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import OverviewSection from './dashboard/sections/Overview';
import ProfileSection from './dashboard/sections/Profile';
import JobsSection from './dashboard/sections/Jobs';
import SkillsSection from './dashboard/sections/Skills';
import CareerSection from './dashboard/sections/Career';
import MarketSection from './dashboard/sections/Market';
import '../styles/dashboard.css';

export default function Dashboard({ onLogout, userTier = 'free', userName = 'User' }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = {
    overview: <OverviewSection userTier={userTier} />,
    profile: <ProfileSection userTier={userTier} />,
    jobs: <JobsSection userTier={userTier} />,
    skills: <SkillsSection userTier={userTier} />,
    career: <CareerSection userTier={userTier} />,
    market: <MarketSection userTier={userTier} />,
  };

  return (
    <div className="dashboard-container">
      {/* Mobile menu toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content area */}
      <div className="dashboard-main">
        {/* Header */}
        <Header
          activeSection={activeSection}
          userTier={userTier}
          userName={userName}
          onLogout={onLogout}
        />

        {/* Section content */}
        <main className="dashboard-content">
          {sections[activeSection]}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
