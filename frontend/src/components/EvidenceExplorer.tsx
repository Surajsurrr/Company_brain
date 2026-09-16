import React, { useState } from 'react';
import { EvidenceItem } from '../types';
import { Search, FileText, Filter, Calendar, ExternalLink, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';

interface EvidenceExplorerProps {
  evidenceList: EvidenceItem[];
  onSelectEvidence: (item: EvidenceItem) => void;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({
  evidenceList,
  onSelectEvidence
}) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = evidenceList.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      item.title.toLowerCase().includes(q) ||
      item.source_ref.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
            Documentary Evidence Vault
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Verifiable source contracts, emails, invoice ledger lines, and operational logs powering Company Brain reasoning
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search evidence text, refs..."
              style={{
                padding: '8px 14px',
                paddingLeft: '34px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.82rem'
              }}
            />
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 10 }} />
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            {['all', 'contract', 'invoice', 'email', 'incident'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: filterType === t ? 'var(--accent-primary)' : 'transparent',
                  color: filterType === t ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {t === 'all' ? 'All Docs' : t + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px'
      }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => onSelectEvidence(item)}
            className="glass-panel"
            style={{
              padding: '18px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0px)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className={`badge badge-${item.type}`}>
                  {item.type.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {item.source_ref}
                </span>
              </div>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
                {item.title}
              </h4>

              <p style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '14px'
              }}>
                {item.snippet}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.72rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {item.date || '2026-08-31'}
              </span>
              <span style={{ color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Inspect File <ExternalLink size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
