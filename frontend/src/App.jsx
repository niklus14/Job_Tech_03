import { useState } from 'react';
import IndividualDashboard from './components/IndividualDashboard';
import MarketDashboard from './components/MarketDashboard';
import CourseDashboard from './components/CourseDashboard';
import PricingModal from './components/PricingModal';
import { Database, User, Globe, Building, Crown, Zap } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('individual');
  const [tier, setTier] = useState('free');
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <Database size={28} />
          JobPath
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'individual' && (
          <IndividualDashboard 
            tier={tier} 
            onShowPricing={() => setShowPricing(true)} 
          />
        )}
        {activeTab === 'market' && <MarketDashboard />}
        {activeTab === 'course' && <CourseDashboard />}
      </main>

      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)}
        currentTier={tier}
        onSelectPlan={(plan) => { if (plan !== 'enterprise') setTier(plan); }}
      />
    </div>
  );
}

export default App;
