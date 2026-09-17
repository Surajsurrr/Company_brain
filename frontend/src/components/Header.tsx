import React from 'react';
import { BrainCircuit, Database, ShieldAlert, Sparkles, PlusCircle, Briefcase } from 'lucide-react';
import { CompanyProfile } from '../types';

interface HeaderProps {
  stats: any;
  onOpenIngest: () => void;
  activeTab: 'graph' | 'causal' | 'evidence' | 'consultancy';
  setActiveTab: (tab: 'graph' | 'causal' | 'evidence' | 'consultancy') => void;
  currentProfile: CompanyProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onOpenIngest,
  activeTab,
  setActiveTab,
  currentProfile
}) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.92)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Brand & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--accent-primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px -3px rgba(99, 102, 241, 0.6)'
        }}>
          <BrainCircuit size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.22rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
              Company Brain
            </h1>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '6px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.4)'
            }}>
              OPERATIONAL INTELLIGENCE & CONSULTANCY
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {currentProfile ? currentProfile.tagline : "Enterprise GraphRAG & Strategic Advisory Engine"}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('graph')}
          style={{
            padding: '7px 14px',
            borderRadius: '7px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: activeTab === 'graph' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'graph' ? '#fff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Database size={15} />
          Knowledge Graph
        </button>

        <button
          onClick={() => setActiveTab('consultancy')}
          style={{
            padding: '7px 14px',
            borderRadius: '7px',
            fontSize: '0.84rem',
            fontWeight: 700,
            background: activeTab === 'consultancy' ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'transparent',
            color: activeTab === 'consultancy' ? '#fff' : '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: activeTab === 'consultancy' ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
          }}
        >
          <Briefcase size={15} />
          Strategic Advisory & Business Plan
        </button>

        <button
          onClick={() => setActiveTab('causal')}
          style={{
            padding: '7px 14px',
            borderRadius: '7px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: activeTab === 'causal' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'causal' ? '#fff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={15} />
          Causal Attribution
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            padding: '7px 14px',
            borderRadius: '7px',
            fontSize: '0.84rem',
            fontWeight: 600,
            background: activeTab === 'evidence' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'evidence' ? '#fff' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldAlert size={15} />
          Evidence Explorer
        </button>
      </div>

      {/* Actions: Ingest CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onOpenIngest}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-primary-gradient)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '9px',
            fontSize: '0.84rem',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={16} />
          + Ingest Data
        </button>
      </div>
    </header>
  );
};
