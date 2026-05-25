import { useState } from 'react';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import Dashboard from './components/Dashboard';
import { Database, CheckCircle, Zap } from 'lucide-react';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tier, setTier] = useState('free');
  const [userName, setUserName] = useState('User');
  const [showPricing, setShowPricing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState('signin');

  const handleOpenAuth = (type) => {
    setAuthModalType(type || 'signin');
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData?.name || 'User');
    setTier(userData?.tier || 'free');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('User');
    setTier('free');
  };

  // Dashboard is shown after login
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} userTier={tier} userName={userName} />;
  }

  // Landing Page
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <Database size={28} />
          JobPath
        </div>
        
        <div className="nav-links">
          <button 
            className="nav-item"
            onClick={() => handleOpenAuth('signin')}
          >
            Sign In
          </button>
          <button 
            className="btn"
            onClick={() => handleOpenAuth('signup')}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="main-content landing">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Career Intelligence Platform</h1>
            <p className="hero-subtitle">
              Analyze your CV, understand market demands, and accelerate your career growth with AI-powered insights
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-large"
                onClick={() => handleOpenAuth('signup')}
              >
                <Zap size={20} />
                Start Free Analysis
              </button>
              <button 
                className="btn btn-outline btn-large"
                onClick={() => setShowPricing(true)}
              >
                View Pricing
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon">📄</div>
              <h3>CV Analysis</h3>
              <p>Upload your CV and get instant feedback on your skills and market fit</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">📊</div>
              <h3>Market Insights</h3>
              <p>Real-time job market data and salary trends from live postings</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">🎯</div>
              <h3>Skill Gap Analysis</h3>
              <p>Identify what skills you need to develop to reach your target role</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">🚀</div>
              <h3>Career Roadmap</h3>
              <p>Get personalized recommendations and learning paths tailored to you</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">💼</div>
              <h3>Job Matching</h3>
              <p>Discover jobs that match your profile and skills</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Recommendations</h3>
              <p>Get AI-powered suggestions for skill development and certifications</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Upload CV</h3>
              <p>Share your resume or CV in PDF format</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Get Analysis</h3>
              <p>Instant AI analysis of your skills and experience</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>View Insights</h3>
              <p>See your market readiness score and skill gaps</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Learn & Grow</h3>
              <p>Follow personalized recommendations to improve</p>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="pricing-preview">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <div className="pricing-cards">
            <div className="pricing-card glass-card">
              <h3>Free</h3>
              <div className="price">$0</div>
              <p className="price-period">Forever</p>
              <ul className="features-list">
                <li><CheckCircle size={18} /> 3 CV analyses per day</li>
                <li><CheckCircle size={18} /> Market insights</li>
                <li><CheckCircle size={18} /> Skill analysis</li>
                <li className="disabled"><CheckCircle size={18} /> AI recommendations</li>
              </ul>
              <button 
                className="btn btn-outline"
                onClick={() => handleOpenAuth('signup')}
              >
                Get Started
              </button>
            </div>

            <div className="pricing-card glass-card featured">
              <div className="featured-badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">₼9.99</div>
              <p className="price-period">per month</p>
              <ul className="features-list">
                <li><CheckCircle size={18} /> Unlimited analyses</li>
                <li><CheckCircle size={18} /> Advanced market insights</li>
                <li><CheckCircle size={18} /> Skill analysis & gaps</li>
                <li><CheckCircle size={18} /> AI recommendations</li>
                <li><CheckCircle size={18} /> Career roadmap</li>
                <li><CheckCircle size={18} /> Priority support</li>
              </ul>
              <button 
                className="btn"
                onClick={() => handleOpenAuth('signup')}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to Accelerate Your Career?</h2>
          <p>Join thousands of professionals using JobPath to advance their careers</p>
          <button 
            className="btn btn-large"
            onClick={() => handleOpenAuth('signup')}
          >
            <Zap size={20} />
            Start Your Free Analysis
          </button>
        </section>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authModalType}
        onSuccess={handleLoginSuccess}
      />

      <PricingModal 
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onSelectPlan={(plan) => {
          console.log('Selected plan:', plan);
          setShowPricing(false);
          handleOpenAuth('signup');
        }}
      />
    </div>
  );
}

export default App;

