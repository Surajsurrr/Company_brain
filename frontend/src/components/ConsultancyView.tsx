import React, { useState, useEffect } from 'react';
import { CompanyProfile, EnterpriseAuditResult, StrategicBusinessPlan } from '../types';
import { runDiagnosticAudit, generateStrategicBusinessPlan } from '../services/api';
import { Sparkles, Copy, Check, RefreshCw, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ConsultancyViewProps {
  companyProfile: CompanyProfile | null;
}

export const ConsultancyView: React.FC<ConsultancyViewProps> = ({ companyProfile }) => {
  const [audit, setAudit] = useState<EnterpriseAuditResult | null>(null);
  const [plan, setPlan] = useState<StrategicBusinessPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadConsultancyData();
  }, [companyProfile?.id]);

  const loadConsultancyData = async () => {
    setLoading(true);
    try {
      const [auditData, planData] = await Promise.all([
        runDiagnosticAudit(),
        generateStrategicBusinessPlan()
      ]);
      setAudit(auditData);
      setPlan(planData);
    } catch (err) {
      console.error("Failed to load strategic consultancy data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPlan = () => {
    if (!plan) return;
    const text = `# ${plan.plan_title}\n\n## Executive Summary\n${plan.executive_summary}\n\n## Current Posture Assessment\n${plan.current_posture_assessment}\n\n## Financial Impact\n- Projected Annual Recovery: $${plan.projected_financial_impact.total_projected_annual_recovery.toLocaleString()}\n- Net ROI: ${plan.projected_financial_impact.net_roi_multiple}x\n- Payback Period: ${plan.projected_financial_impact.payback_period_months} months`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(124, 58, 237, 0.08)',
          color: '#7c3aed',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <RefreshCw size={26} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
          Traversing Enterprise Knowledge Graph & Synthesizing Strategic Plan...
        </div>
        <div style={{ fontSize: '14px', marginTop: '6px', color: '#64748b' }}>
          Correlating contracts, financial invoices, operational incidents, and vendor communications.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '28px 24px 80px', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. TOP HEADER & METRIC SCORECARD */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(124, 58, 237, 0.12)',
          padding: '24px 28px',
          boxShadow: '0 10px 30px rgba(124, 58, 237, 0.04), 0 2px 8px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '18px',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(124, 58, 237, 0.08)',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🏛️
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {plan?.plan_title || "Enterprise Strategic Advisory Hub"}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '13.5px', marginTop: '6px', margin: 0 }}>
              Autonomous diagnostic audit & McKinsey-grade turnaround roadmap powered by dynamic GraphRAG.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCopyPlan}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '8px 16px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
              {copied ? "Plan Copied!" : "Copy Strategic Brief"}
            </button>
            <button
              onClick={loadConsultancyData}
              style={{
                background: '#0f172a',
                border: 'none',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)'
              }}
            >
              <RefreshCw size={14} />
              Re-run Audit
            </button>
          </div>
        </div>

        {/* 4 HIGHLIGHT TILES */}
        {audit && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginTop: '22px'
            }}
          >
            {/* Tile 1 */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 18px'
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Health Score
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: audit.overall_health_score > 70 ? '#059669' : '#d97706', marginTop: '4px' }}>
                {audit.overall_health_score}<span style={{ fontSize: '15px', color: '#94a3b8' }}>/100</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Operational resilience index
              </div>
            </div>

            {/* Tile 2 */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 18px'
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Efficiency Index
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                {audit.efficiency_index}%
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Benchmark baseline across peers
              </div>
            </div>

            {/* Tile 3 */}
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '14px',
              padding: '16px 18px'
            }}>
              <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Annual Financial Leakage
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#b91c1c', marginTop: '4px' }}>
                ${audit.total_financial_leakage.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                Uncontracted fees & SLA penalties
              </div>
            </div>

            {/* Tile 4 */}
            <div style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              borderRadius: '14px',
              padding: '16px 18px'
            }}>
              <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Projected 90-Day ROI
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#6d28d9', marginTop: '4px' }}>
                {plan?.projected_financial_impact.net_roi_multiple}x
              </div>
              <div style={{ fontSize: '12px', color: '#7c3aed', marginTop: '4px' }}>
                Payback in {plan?.projected_financial_impact.payback_period_months} months
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. EXECUTIVE SUMMARY & POSTURE ASSESSMENT */}
      {plan && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '24px 28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>📑</span>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Executive Summary & Situational Posture
            </h3>
          </div>
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.7, margin: '0 0 16px 0' }}>
            {plan.executive_summary}
          </p>
          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(124, 58, 237, 0.05)',
              borderLeft: '4px solid #7c3aed',
              borderRadius: '6px',
              fontSize: '13.5px',
              color: '#4c1d95',
              lineHeight: 1.6
            }}
          >
            <strong>Strategic Assessment:</strong> {plan.current_posture_assessment}
          </div>
        </div>
      )}

      {/* 3. SWOT ANALYSIS MATRIX */}
      {plan && plan.swot_analysis && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '18px' }}>🧭</span>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Enterprise SWOT Analysis
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {Object.entries(plan.swot_analysis).map(([quadrant, points]) => {
              const styles: Record<string, { border: string; bg: string; title: string }> = {
                Strengths: { border: '#bbf7d0', bg: '#f0fdf4', title: '#15803d' },
                Weaknesses: { border: '#fde68a', bg: '#fffbeb', title: '#b45309' },
                Opportunities: { border: '#bfdbfe', bg: '#eff6ff', title: '#1d4ed8' },
                Threats: { border: '#fecaca', bg: '#fef2f2', title: '#b91c1c' }
              };
              const s = styles[quadrant] || styles.Strengths;

              return (
                <div
                  key={quadrant}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: '14px',
                    padding: '18px'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: s.title, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                    {quadrant}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#1e293b', fontSize: '13px', lineHeight: 1.6 }}>
                    {points.map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. 30-60-90 DAY EXECUTION ROADMAP */}
      {plan && plan.execution_roadmap && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '24px 28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🚀</span>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Phased Turnaround Roadmap (30-60-90 Days)
              </h3>
            </div>

            {/* Phase Selector Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
              {plan.execution_roadmap.map((phase, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhaseIndex(idx)}
                  style={{
                    background: activePhaseIndex === idx ? '#0f172a' : 'transparent',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '6px 14px',
                    color: activePhaseIndex === idx ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {phase.target_window}
                </button>
              ))}
            </div>
          </div>

          {/* Active Phase Content */}
          {plan.execution_roadmap[activePhaseIndex] && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {plan.execution_roadmap[activePhaseIndex].phase_name}
                  </h4>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
                    Focus: {plan.execution_roadmap[activePhaseIndex].focus_area}
                  </div>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: '6px' }}>
                  Est. Savings: ${plan.execution_roadmap[activePhaseIndex].projected_savings.toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {plan.execution_roadmap[activePhaseIndex].initiatives.map((init) => (
                  <div
                    key={init.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 18px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                        {init.title}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(124, 58, 237, 0.08)', color: '#7c3aed', fontWeight: 600 }}>
                          👤 {init.owner}
                        </span>
                        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#059669', fontWeight: 600 }}>
                          💰 {init.estimated_impact}
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '6px' }}>
                        Action Plan Items:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px', color: '#334155', fontSize: '13px', lineHeight: 1.5 }}>
                        {init.action_items.map((act, i) => (
                          <li key={i} style={{ marginBottom: '4px' }}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. QUANTIFIED FINANCIAL IMPACT MATRIX */}
      {plan && plan.projected_financial_impact && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            borderRadius: '20px',
            border: '1px solid #bbf7d0',
            padding: '24px 28px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '18px' }}>💰</span>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#15803d', margin: 0 }}>
              Projected ROI & Financial Recovery Deliverable
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Baseline Revenue</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                ${plan.projected_financial_impact.annual_revenue_baseline.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#dc2626', textTransform: 'uppercase', fontWeight: 700 }}>Identified Leakage</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#b91c1c', marginTop: '4px' }}>
                ${plan.projected_financial_impact.total_leakage_identified.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#059669', textTransform: 'uppercase', fontWeight: 700 }}>Projected Annual Recovery</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                ${plan.projected_financial_impact.total_projected_annual_recovery.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Margin Expansion</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                +{plan.projected_financial_impact.net_margin_expansion_bps} bps
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
