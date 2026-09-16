import React, { useState } from 'react';
import { QueryResponse, EvidenceItem } from '../types';
import {
  Send, Sparkles, AlertTriangle, ArrowRight, CheckCircle2,
  TrendingUp, ShieldAlert, FileText, ChevronRight, CornerDownRight
} from 'lucide-react';

interface ChatInterfaceProps {
  onRunQuery: (query: string) => void;
  isLoading: boolean;
  queryResult: QueryResponse | null;
  onOpenEvidence: (evidence: EvidenceItem) => void;
  onViewSubgraph: () => void;
  sampleQueries: any[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onRunQuery,
  isLoading,
  queryResult,
  onOpenEvidence,
  onViewSubgraph,
  sampleQueries
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onRunQuery(inputVal.trim());
  };

  const handleSelectSample = (prompt: string) => {
    setInputVal(prompt);
    onRunQuery(prompt);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)'
    }}>
      {/* Search / Executive Input Bar */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ask Company Brain (e.g. 'Why did delivery cost surge in Q3?')..."
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingLeft: '40px',
                borderRadius: '10px',
                background: 'rgba(16, 23, 38, 0.9)',
                border: '1px solid var(--border-highlight)',
                color: '#fff',
                fontSize: '0.88rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)'
              }}
            />
            <Sparkles size={18} color="#818cf8" style={{ position: 'absolute', left: 14, top: 14 }} />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            style={{
              padding: '0 18px',
              borderRadius: '10px',
              background: isLoading ? 'rgba(99, 102, 241, 0.5)' : 'var(--accent-primary-gradient)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Send size={18} />
          </button>
        </form>

        {/* Suggested Queries Chips */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {sampleQueries.map(sq => (
            <button
              key={sq.id}
              onClick={() => handleSelectSample(sq.prompt)}
              style={{
                flexShrink: 0,
                fontSize: '0.74rem',
                fontWeight: 600,
                padding: '5px 11px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{sq.title}</span>
              <ChevronRight size={12} color="#6366f1" />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {isLoading && (
          <div style={{ padding: '30px 10px', textAlign: 'center' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              Traversing Knowledge Graph...
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Cross-referencing ERP invoices, contracts, and carrier correspondence
            </div>
          </div>
        )}

        {!isLoading && !queryResult && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <TrendingUp size={28} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Ask Any Operational Question
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              The Company Brain connects ERP transactions, carrier contracts, and emails into a live relational graph. Select a suggested prompt above or type your own question.
            </p>
          </div>
        )}

        {!isLoading && queryResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Active Question Banner */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#818cf8' }}>
                  Investigative Query
                </span>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>
                  "{queryResult.query}"
                </div>
              </div>
              <button
                onClick={onViewSubgraph}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Inspect Graph
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Step-by-Step Reasoning Stepper */}
            {queryResult.reasoning_steps && queryResult.reasoning_steps.length > 0 && (
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Multi-Hop Reasoning Trace ({queryResult.reasoning_steps.length} Steps)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {queryResult.reasoning_steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        {step.step_num}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0' }}>
                          {step.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Summary Card */}
            <div className="glass-panel-glow" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="#818cf8" />
                <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#fff' }}>
                  Executive Root-Cause Summary
                </h4>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                {queryResult.executive_summary}
              </p>
            </div>

            {/* Detailed Answer Section */}
            <div className="glass-panel" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px' }}>
                Full Operational Analysis & Evidence Synthesis
              </h4>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                {queryResult.detailed_answer}
              </div>
            </div>

            {/* Evidence Badges */}
            {queryResult.evidence_trail && queryResult.evidence_trail.length > 0 && (
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Verifiable Evidence Trail ({queryResult.evidence_trail.length} Sources)
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#6366f1' }}>Click to view original doc</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {queryResult.evidence_trail.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => onOpenEvidence(ev)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} color="#60a5fa" />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                            {ev.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Ref: {ev.source_ref} | Relevance: {Math.round(ev.relevance_score * 100)}%
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#94a3b8" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
