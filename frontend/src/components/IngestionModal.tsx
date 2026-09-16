import React, { useState } from 'react';
import { DocumentIngestionRequest, IngestionResponse } from '../types';
import { X, Upload, Sparkles, CheckCircle2, FileText, Mail, FileCheck, AlertCircle } from 'lucide-react';

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: (response: IngestionResponse) => void;
}

const SAMPLE_TEMPLATES = [
  {
    title: 'Nordic Reefer Fuel Escalation Notice',
    doc_type: 'email',
    source: 'EML-NOR-502',
    content: `From: Erik Lindqvist <e.lindqvist@nordictrans.com>
To: Supply Chain Dispatch <dispatch@ourcompany.com>
Subject: Route 303 Reefer Fuel Surcharge Adjustment

Due to cold chain electricity rate adjustments at Savannah terminal, Nordic Transport will be applying a 4.5% seasonal reefer fuel surcharge on Route 303 shipments starting next week. Standard base transit rates remain unaffected.`
  },
  {
    title: 'Newark Marine Terminal Rail Reopening',
    doc_type: 'incident',
    source: 'INC-2026-PORT-CLEAR',
    content: `Incident Resolution Report: Port of Newark Elizabeth Terminal crane repair completed. Gate queues have reduced to normal 1.5-hour dwell times. Secondary accessorial congestion surcharges for Northeast Route 101 are no longer justified for cargo pulled after September 12.`
  },
  {
    title: 'Swift Route 202 Supplementary Dry-Van Invoice',
    doc_type: 'invoice',
    source: 'INV-SWF-4489',
    content: `Invoice Ref: INV-SWF-4489
Carrier: SwiftLogistics Trans
Total: $18,500.00
Route: Route 202 (Chicago -> Detroit 10 Loads)
Base Rate: $17,000.00
Fuel Cap: $1,500.00 (Compliant with CTR-SWF-2025)
Status: APPROVED`
  }
];

export const IngestionModal: React.FC<IngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess
}) => {
  const [docType, setDocType] = useState('email');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<IngestionResponse | null>(null);

  if (!isOpen) return null;

  const handleApplyTemplate = (tpl: typeof SAMPLE_TEMPLATES[0]) => {
    setTitle(tpl.title);
    setDocType(tpl.doc_type);
    setSource(tpl.source);
    setContent(tpl.content);
    setIngestionResult(null);
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    setIngestionResult(null);

    try {
      const payload: DocumentIngestionRequest = {
        doc_type: docType,
        title,
        source: source || `DOC-${Date.now().toString().slice(-4)}`,
        content,
        metadata: { date: new Date().toISOString().split('T')[0] }
      };

      const res = await fetch('http://localhost:8000/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data: IngestionResponse = await res.json();
      setIngestionResult(data);
      onIngestSuccess(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel-glow" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0d121d',
        borderRadius: '16px',
        border: '1px solid var(--border-highlight)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--accent-primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                Ingest Enterprise Document
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Extract entities and link relations directly into the Company Brain
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Templates */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Load Quick Sample:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SAMPLE_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc'
                }}
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleIngest} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Apex Surcharge Addendum"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.84rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Document Type
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.84rem'
                }}
              >
                <option value="email">Email / Communication</option>
                <option value="invoice">Invoice / AP Line Items</option>
                <option value="contract">Contract / SLA Clause</option>
                <option value="incident">Incident / Disruption Report</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Reference / Source Code
            </label>
            <input
              type="text"
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="e.g. EML-NOR-502 or INV-SWF-4489"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Raw Content Body (Unstructured / Semi-Structured Text)
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              placeholder="Paste email text, contract clause, or invoice line items here..."
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          {/* Ingestion Success Feedback */}
          {ingestionResult && (
            <div style={{
              padding: '14px 16px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <CheckCircle2 size={20} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#34d399' }}>
                  Knowledge Graph Updated!
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {ingestionResult.message}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: 'var(--accent-primary-gradient)',
                color: '#fff',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Sparkles size={16} />
              {isSubmitting ? 'Parsing & Linking...' : 'Process & Connect to Graph'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
