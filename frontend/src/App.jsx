import { useState } from 'react';
import IndividualDashboard from './components/IndividualDashboard';
import MarketDashboard from './components/MarketDashboard';
import CourseDashboard from './components/CourseDashboard';
import OverviewDashboard from './components/OverviewDashboard';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import { Database, User, Globe, Building, Crown, Zap, ShieldAlert } from 'lucide-react';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [tier, setTier] = useState('free');
  const [showPricing, setShowPricing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('signin'); // 'signin' or 'signup'

  const handleOpenAuth = (type) => {
    setAuthModalType(type || 'signin');
    setShowAuthModal(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveTab('individual'); // Automatically redirect to Individual CV page on success!
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('overview'); // Redirect back to overview landing page
    setTier('free');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div 
          className="logo" 
          onClick={() => setActiveTab(isLoggedIn ? 'individual' : 'overview')}
          style={{ cursor: 'pointer' }}
        >
          <Database size={28} />
          JobPath
        </div>
        
        {/* Navigation Tabs (Only shown if logged in) */}
        {isLoggedIn && (
          <div className="nav-links">
            <div 
              className={`nav-item ${activeTab === 'individual' ? 'active' : ''}`}
              onClick={() => setActiveTab('individual')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <User size={18} /> Individual
            </div>
            <div 
              className={`nav-item ${activeTab === 'market' ? 'active' : ''}`}
              onClick={() => setActiveTab('market')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Globe size={18} /> Market Pulse
            </div>
            <div 
              className={`nav-item ${activeTab === 'course' ? 'active' : ''}`}
              onClick={() => setActiveTab('course')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Building size={18} /> Course & Companies
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isLoggedIn ? (
            <>
              {/* Pro toggle for demo */}
              <button
                className={`pro-toggle ${tier === 'pro' ? 'active' : ''}`}
                onClick={() => setTier(tier === 'pro' ? 'free' : 'pro')}
                title="Toggle Pro mode for demo"
              >
                {tier === 'pro' ? <Crown size={16} /> : <Zap size={16} />}
                {tier === 'pro' ? 'Pro ⭐' : 'Free'}
              </button>
              <button 
                className="btn" 
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', border: 'none' }}
                onClick={() => setShowPricing(true)}
              >
                Pricing
              </button>
              <button 
                className="auth-nav-btn-signout"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button 
                className="auth-nav-btn"
                onClick={() => handleOpenAuth('signin')}
              >
                Sign In
              </button>
              <button 
                className="auth-nav-btn primary"
                onClick={() => handleOpenAuth('signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content" style={activeTab === 'overview' ? { padding: '2rem 0 0 0', maxWidth: '100%' } : {}}>
        {activeTab === 'overview' && (
          <OverviewDashboard onOpenAuth={handleOpenAuth} />
        )}
        
        {isLoggedIn && activeTab === 'individual' && (
          <IndividualDashboard 
            tier={tier} 
            onShowPricing={() => setShowPricing(true)} 
          />
        )}
        
        {isLoggedIn && activeTab === 'market' && <MarketDashboard />}
        {isLoggedIn && activeTab === 'course' && <CourseDashboard />}
      </main>

      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)}
        currentTier={tier}
        onSelectPlan={(plan) => { if (plan !== 'enterprise') setTier(plan); }}
      />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLoginSuccess}
        initialType={authModalType}
      />
    </div>
  );
}

export default App;

