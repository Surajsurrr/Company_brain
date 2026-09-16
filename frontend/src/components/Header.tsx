import React from 'react';
import { BrainCircuit, Database, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';

interface HeaderProps {
  stats: any;
  onOpenIngest: () => void;
  activeTab: 'graph' | 'causal' | 'evidence';
  setActiveTab: (tab: 'graph' | 'causal' | 'evidence') => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, onOpenIngest, activeTab, setActiveTab }) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.88)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40
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
              ENTERPRISE RELATIONAL AI
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Logistics & Supply Chain Operational Intelligence Layer
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
            padding: '7px 16px',
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
          onClick={() => setActiveTab('causal')}
          style={{
            padding: '7px 16px',
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
          Causal Attribution & Actions
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            padding: '7px 16px',
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

      {/* Stats & Ingest CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {stats && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.total_nodes || 18}</span> Nodes
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.total_edges || 24}</span> Relational Edges
            </div>
          </div>
        )}

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
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}
        >
          <PlusCircle size={16} />
          + Ingest Document
        </button>
      </div>
    </header>
  );
};
