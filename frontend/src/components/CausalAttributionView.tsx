import React, { useState } from 'react';
import { CausalFactor, RecommendationItem } from '../types';
import {
  TrendingUp, AlertTriangle, ShieldCheck, DollarSign,
  ArrowUpRight, CheckCircle2, FileText, Send, Sparkles, Sliders
} from 'lucide-react';

interface CausalAttributionViewProps {
  causalFactors: CausalFactor[];
  recommendations: RecommendationItem[];
  financialMetrics: Record<string, any>;
  onInspectFactor: (factor: CausalFactor) => void;
}

export const CausalAttributionView: React.FC<CausalAttributionViewProps> = ({
  causalFactors,
  recommendations,
  financialMetrics,
  onInspectFactor
}) => {
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleExecuteAction = (rec: RecommendationItem) => {
    setExecutedActions(prev => ({ ...prev, [rec.id]: true }));
    setActionFeedback(`Action initiated: "${rec.title}". Automated workflow staged.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
      {/* Action Notification Toast */}
      {actionFeedback && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '30px',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '0.86rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          {actionFeedback}
        </div>
      )}

      {/* Top Financial KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Detected Cost Surge
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171' }}>
            +${(financialMetrics.total_cost_impact || 20750).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Concentrated in Northeast Corridor
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Disputable Surcharges
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
            ${(financialMetrics.disputable_amount || 16200).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Violates Contract §4.2 Notice Terms
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              SLA Liquidated Damages
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
            ${(financialMetrics.sla_penalty_recoverable || 4000).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Enforceable under CTR-APX-2025 §7.1
          </div>
        </div>

        <div className="glass-panel-glow" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Projected Monthly Savings
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a5b4fc' }}>
            ${(financialMetrics.projected_monthly_savings || 26700).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Via Swift Rerouting & Rate Enforcement
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Left Column: Causal Attribution Breakdown */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                Causal Root-Cause Attribution
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Mathematically decomposed drivers behind the operational anomaly
              </p>
            </div>
            <span className="badge badge-carrier">
              Relational Model
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {causalFactors.map((factor, idx) => (
              <div
                key={idx}
                onClick={() => onInspectFactor(factor)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                    {factor.factor}
                  </div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#818cf8' }}>
                    {factor.attribution_percentage}%
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '8px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: `${factor.attribution_percentage}%`,
                    height: '100%',
                    borderRadius: '4px',
                    background: idx === 0 ? 'var(--accent-primary-gradient)' : 'var(--accent-cyan-gradient)'
                  }} />
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
                  {factor.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                  <span style={{ color: '#f87171', fontWeight: 600 }}>
                    Financial Drag: +${factor.financial_impact.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {factor.evidence_ids.length} Linked Evidence Sources
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Prioritized Executive Actions */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                Operational Action Recommendations
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Prescriptive next steps with projected ROI
              </p>
            </div>
            <span className="badge badge-shipment">
              Auto-Generated
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendations.map(rec => {
              const isDone = executedActions[rec.id];
              return (
                <div
                  key={rec.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: isDone ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${rec.priority === 'HIGH' ? 'badge-incident' : 'badge-carrier'}`}>
                        {rec.priority} PRIORITY
                      </span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {rec.action_type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#34d399' }}>
                      +${rec.estimated_savings.toLocaleString()} ROI
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {rec.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '12px' }}>
                    {rec.description}
                  </p>

                  {/* Action Steps */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Implementation Checklist:
                    </div>
                    {rec.steps.map((step, sIdx) => (
                      <div key={sIdx} style={{ fontSize: '0.76rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#818cf8' }} />
                        {step}
                      </div>
                    ))}
                  </div>

                  {/* Execution Button */}
                  <button
                    onClick={() => handleExecuteAction(rec)}
                    disabled={isDone}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: isDone ? 'rgba(16, 185, 129, 0.2)' : 'var(--accent-primary-gradient)',
                      color: isDone ? '#34d399' : '#fff',
                      border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 size={15} />
                        Workflow Dispatched
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Trigger Tactical Action
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
