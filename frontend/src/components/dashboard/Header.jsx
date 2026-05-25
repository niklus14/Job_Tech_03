import { Bell, Search, Crown, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Header({ activeSection, userTier, userName, onLogout }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sectionTitles = {
    overview: 'Dashboard',
    profile: 'CV & Profile',
    jobs: 'Job Matches',
    skills: 'Skill Analysis',
    career: 'Career Path',
    market: 'Market Insights',
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="header-title">{sectionTitles[activeSection]}</h1>
        {userTier === 'pro' && (
          <div className="tier-badge pro">
            <Crown size={16} />
            <span>Pro Plan</span>
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Search */}
        <div className={`search-box ${searchFocused ? 'focused' : ''}`}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="search-input"
          />
        </div>

        {/* Notifications */}
        <button className="header-icon-btn">
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        {/* User menu */}
        <div className="user-menu-container">
          <button
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {userName.charAt(0).toUpperCase()}
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div className="user-info">
                  <div className="user-name">{userName}</div>
                  <div className="user-tier">{userTier === 'pro' ? 'Pro' : 'Free'} Plan</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item logout"
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
