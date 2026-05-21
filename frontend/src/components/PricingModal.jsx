import { X, Check, Zap, Crown, Building } from 'lucide-react';

export default function PricingModal({ isOpen, onClose, onSelectPlan, currentTier }) {
  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: <Zap size={24} />,
      color: '#64748b',
      features: [
        { text: '3 CV analyses per day', included: true },
        { text: 'Overall match score', included: true },
        { text: 'Top 3 job matches (title only)', included: true },
        { text: 'Up to 3 missing skills shown', included: true },
        { text: 'Score breakdown (semantic + skill)', included: false },
        { text: 'Course recommendations with links', included: false },
        { text: 'Learning path progression', included: false },
        { text: 'AI Career Advisor', included: false },
        { text: 'Job posting links', included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Individual Pro',
      price: '$10',
      period: '/month',
      icon: <Crown size={24} />,
      color: '#8b5cf6',
      popular: true,
      features: [
        { text: 'Unlimited CV analyses', included: true },
        { text: 'Full score breakdown', included: true },
        { text: 'Top 3 job matches with full details', included: true },
        { text: 'ALL missing skills revealed', included: true },
        { text: 'Semantic + skill match scores', included: true },
        { text: 'Course recommendations with enroll links', included: true },
        { text: 'Learning path with score progression', included: true },
        { text: 'AI Career Advisor (Llama 3.3 70B)', included: true },
        { text: 'Direct job posting links', included: true },
      ]
    },
    {
      id: 'enterprise',
      name: 'Course & Companies',
      price: '$60',
      period: '/month',
      icon: <Building size={24} />,
      color: '#3b82f6',
      features: [
        { text: 'Everything in Individual Pro', included: true },
        { text: 'Unlimited student tracking', included: true },
        { text: 'Live LMS API integration', included: true },
        { text: 'Class-wide skill gap analysis', included: true },
        { text: 'Holberton / custom API sync', included: true },
        { text: 'Combined progress + readiness scores', included: true },
        { text: 'Per-student job match reports', included: true },
        { text: 'Batch student data upload', included: true },
        { text: 'Priority support', included: true },
      ]
    }
  ];

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={e => e.stopPropagation()}>
        <button className="pricing-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Choose Your Plan
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Unlock the full power of JobPath Intelligence
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? 'popular' : ''} ${currentTier === plan.id ? 'current' : ''}`}
            >
              {plan.popular && (
                <div className="pricing-badge">Most Popular</div>
              )}

              <div className="pricing-icon" style={{ color: plan.color }}>
                {plan.icon}
              </div>
              <h3 className="pricing-name">{plan.name}</h3>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-period">{plan.period}</span>
              </div>

              <div className="pricing-features">
                {plan.features.map((f, i) => (
                  <div key={i} className={`pricing-feature ${f.included ? '' : 'disabled'}`}>
                    <Check size={16} style={{ color: f.included ? 'var(--success)' : 'var(--text-secondary)', opacity: f.included ? 1 : 0.3, flexShrink: 0 }} />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              <button
                className={`pricing-btn ${plan.popular ? 'primary' : ''}`}
                onClick={() => { onSelectPlan(plan.id); onClose(); }}
                disabled={currentTier === plan.id}
              >
                {currentTier === plan.id ? 'Current Plan' : plan.id === 'enterprise' ? 'Contact Sales' : plan.price === '$0' ? 'Get Started' : 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
