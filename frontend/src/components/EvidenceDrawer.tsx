import React, { useState } from 'react';
import { EvidenceItem } from '../types';
import { X, Copy, Check, ExternalLink, ShieldCheck, FileText, Calendar, Hash } from 'lucide-react';

interface EvidenceDrawerProps {
  evidence: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ evidence, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!evidence) return null;

  const handleCopyCitation = () => {
    const citation = `[Source: ${evidence.source_ref}] ${evidence.title} (${evidence.date || '2026'}) - "${evidence.snippet}"`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '520px',
      background: 'rgba(10, 14, 23, 0.96)',
      backdropFilter: 'blur(24px)',
      borderLeft: '1px solid var(--border-highlight)',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        background: 'rgba(16, 23, 38, 0.7)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className={`badge badge-${evidence.type}`}>
              {evidence.type.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
              {Math.round(evidence.relevance_score * 100)}% Match
            </span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
            {evidence.title}
          </h3>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Drawer Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Source Reference & Metadata Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Reference ID
            </span>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#93c5fd', fontFamily: 'var(--font-mono)' }}>
              {evidence.source_ref}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Document Date
            </span>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#cbd5e1' }}>
              {evidence.date || '2026-08-31'}
            </div>
          </div>
        </div>

        {/* Evidence Snippet Callout */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderLeft: '4px solid #6366f1',
          borderTop: '1px solid rgba(99, 102, 241, 0.2)',
          borderRight: '1px solid rgba(99, 102, 241, 0.2)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc', marginBottom: '6px' }}>
            Key Grounded Evidence Extract
          </div>
          <p style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.55, fontStyle: 'italic' }}>
            "{evidence.snippet}"
          </p>
        </div>

        {/* Full Document View */}
        <div>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Complete Document Body
          </div>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: '#cbd5e1',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-mono)',
            overflowX: 'auto'
          }}>
            {evidence.full_content || evidence.snippet}
          </pre>
        </div>

        {/* Structured Properties */}
        {evidence.metadata && Object.keys(evidence.metadata).length > 0 && (
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Extracted Semantic Attributes
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {Object.entries(evidence.metadata).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(16, 23, 38, 0.8)',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={handleCopyCitation}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
            color: copied ? '#34d399' : '#fff',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Citation Copied!' : 'Copy Grounded Citation'}
        </button>

        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'var(--accent-primary)',
            color: '#fff',
            fontSize: '0.82rem',
            fontWeight: 600
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
