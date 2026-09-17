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

  const getBadgeStyle = (type: string) => {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      contract: { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
      invoice: { bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' },
      email: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
      incident: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
      hr_policy: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
      finance_policy: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
      policy: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' }
    };
    return styles[type] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 24px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header & Controls */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '22px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📑</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Documentary Evidence Vault
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px', margin: 0 }}>
            Verifiable source contracts, emails, invoice ledger lines, and operational logs powering Company Brain reasoning.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                borderRadius: '999px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.82rem',
                outline: 'none',
                width: '240px'
              }}
            />
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
            {['all', 'contract', 'invoice', 'email', 'incident', 'policy'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: 'none',
                  cursor: 'pointer',
                  background: filterType === t ? '#0f172a' : 'transparent',
                  color: filterType === t ? '#ffffff' : '#64748b',
                  transition: 'all 0.15s ease'
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '16px'
      }}>
        {filteredItems.map(item => {
          const badge = getBadgeStyle(item.type);
          return (
            <div
              key={item.id}
              onClick={() => onSelectEvidence(item)}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`
                  }}>
                    {item.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                    {item.source_ref}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
                  {item.title}
                </h4>

                <p style={{
                  fontSize: '0.8rem',
                  color: '#475569',
                  lineHeight: 1.5,
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
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                fontSize: '0.74rem'
              }}>
                <span style={{ color: '#94a3b8' }}>
                  {item.date || '2026-08-31'}
                </span>
                <span style={{ color: '#7c3aed', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Inspect File <ExternalLink size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
