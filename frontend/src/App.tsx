import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Sparkles, User, ShieldCheck, Copy, Check,
  ExternalLink, ThumbsUp, ThumbsDown, ChevronRight, Plus,
  FileText, CornerDownLeft, Paperclip, ArrowRight,
  Calendar, DollarSign, Truck, Users, BookOpen, Layers,
  X, MessageSquare, Compass, Search
} from 'lucide-react';
import { executeQuery, fetchSampleQueries } from './services/api';
import { QueryResponse, EvidenceItem } from './types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  queryResponse?: QueryResponse;
  feedback?: 'up' | 'down';
  copied?: boolean;
}

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial flagship answer to demonstrate instant capability
    handleSendMessage('What is our company policy on carryover PTO and what is the deadline to use it?');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => inputRef.current?.focus(), 400);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || inputVal).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await executeQuery(text);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.detailed_answer || response.executive_summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queryResponse: response
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: "Could not retrieve records from the enterprise repository. Please ensure the backend is active.",
        timestamp: 'Error'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, copied: true } : m));
    showToast('Briefing copied to clipboard');
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, copied: false } : m));
    }, 2000);
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback: type } : m));
    showToast(type === 'up' ? 'Marked as helpful' : 'Feedback recorded');
  };

  const getFollowUpSuggestions = (res?: QueryResponse) => {
    if (!res) return [];
    const text = (res.query + ' ' + res.detailed_answer).toLowerCase();
    if (text.includes('pto') || text.includes('vacation')) {
      return [
        'How do I submit this in BambooHR?',
        'Can I roll over more than 5 days with VP approval?',
        'What is our bereavement leave policy?'
      ];
    }
    if (text.includes('expense') || text.includes('approval')) {
      return [
        'What is the daily meal per diem rate?',
        'Can I book business class on international flights?',
        'Who approves expenses over $25,000?'
      ];
    }
    if (text.includes('cost') || text.includes('surge') || text.includes('apex')) {
      return [
        'Can we deduct $4,000 under Contract Clause 7.1?',
        'What alternative capacity did SwiftLogistics offer?',
        'Draft a formal billing dispute letter'
      ];
    }
    return [
      'Show me the verified policy clause in full',
      'Who is the department head responsible for this?',
      'What are the compliance exceptions?'
    ];
  };

  const QUICK_PROMPTS = [
    { title: 'PTO Carryover Rules', prompt: 'What is our company policy on carryover PTO and what is the deadline to use it?', category: 'hr' },
    { title: 'Manager Expense Limits', prompt: 'What are the expense approval thresholds for direct managers vs directors and VPs?', category: 'finance' },
    { title: '$750 Wellness Stipend', prompt: 'How much is our annual home office & wellness stipend and how do I submit a claim?', category: 'hr' },
    { title: 'Q3 Delivery Cost Surge', prompt: 'Why did our freight delivery cost surge in Q3 for Northeast routes?', category: 'ops' }
  ];

  const filteredPrompts = QUICK_PROMPTS.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 9999,
          fontSize: '0.84rem',
          fontWeight: 600
        }}>
          <Sparkles size={16} color="#c084fc" />
          {toastMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FOLIO HEADER NAVIGATION                                                   */}
      {/* ========================================================================= */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 60px',
        maxWidth: '1360px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Folio Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          {/* Geometric 8-pointed purple asterisk icon from screenshot */}
          <div style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.04em' }}>
            folio
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'rgba(124, 58, 237, 0.08)',
            color: '#7c3aed',
            marginLeft: '4px'
          }}>
            COMPANY BRAIN
          </span>
        </div>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Features', 'HR & People', 'Finance & Expenses', 'Logistics', 'Enterprise SLA'].map((item, idx) => (
            <span
              key={idx}
              onClick={scrollToChat}
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#7c3aed'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Right CTA */}
        <button onClick={scrollToChat} className="folio-btn-primary" style={{ padding: '10px 20px', fontSize: '0.84rem' }}>
          Launch Brain <ArrowRight size={14} />
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* FOLIO HERO SECTION (Exact layout as screenshot)                            */}
      {/* ========================================================================= */}
      <section style={{
        position: 'relative',
        padding: '30px 20px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Left Floating 3D Accent Graphic (Fluid splash form) */}
        <div className="float-accent-left" style={{
          position: 'absolute',
          left: '4%',
          top: '25%',
          width: '160px',
          height: '160px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.95
        }}>
          <svg viewBox="0 0 200 200" width="160" height="160">
            <defs>
              <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <filter id="fluidGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              d="M45,-55C58,-47,68,-32,72,-16C76,0,74,18,66,32C58,46,44,57,28,64C12,71,-6,74,-24,70C-42,66,-59,55,-69,39C-79,23,-82,2,-77,-17C-72,-36,-59,-53,-43,-60C-27,-67,-13,-64,2,-67C17,-70,32,-63,45,-55Z"
              transform="translate(100 100)"
              fill="url(#fluidGrad)"
              filter="url(#fluidGlow)"
            />
          </svg>
        </div>

        {/* Right Floating 3D Accent Graphic (Curved torus loop) */}
        <div className="float-accent-right" style={{
          position: 'absolute',
          right: '3%',
          top: '18%',
          width: '180px',
          height: '180px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.95
        }}>
          <svg viewBox="0 0 200 200" width="180" height="180">
            <defs>
              <linearGradient id="torusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <filter id="torusGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path
              d="M50,-65C64,-55,75,-39,78,-21C81,-4,76,14,68,30C60,46,49,60,34,68C19,76,0,78,-18,74C-36,70,-53,60,-64,45C-75,30,-80,10,-78,-9C-76,-28,-67,-46,-53,-56C-39,-66,-19,-68,0,-68C19,-68,36,-75,50,-65Z"
              transform="translate(100 100)"
              fill="url(#torusGrad)"
              filter="url(#torusGlow)"
            />
          </svg>
        </div>

        {/* Pill Tag from Screenshot */}
        <div className="folio-tag-pill">
          Folio Company Brain
        </div>

        {/* Main Title from Screenshot */}
        <h1 style={{
          fontSize: '3.4rem',
          fontWeight: 800,
          color: '#0f172a',
          maxWidth: '840px',
          lineHeight: 1.15,
          marginBottom: '18px'
        }}>
          Build a stunning company brain for <br />
          <span style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            AI
          </span>
        </h1>

        {/* Subtitle from Screenshot */}
        <p style={{
          fontSize: '1.05rem',
          color: '#64748b',
          maxWidth: '680px',
          lineHeight: 1.6,
          marginBottom: '32px'
        }}>
          The all-in-one operational intelligence layer for modern companies. Instant verified answers
          on HR policies, manager approval thresholds, and supply chain logistics.
        </p>

        {/* Two Pill CTA Buttons from Screenshot */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <button onClick={scrollToChat} className="folio-btn-secondary">
            Explore features
          </button>
          <button onClick={scrollToChat} className="folio-btn-primary">
            Ask Company Brain →
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* EMBEDDED NEAT & CLEAN CHAT SECTION                                        */}
      {/* ========================================================================= */}
      <section
        ref={chatSectionRef}
        style={{
          maxWidth: '920px',
          width: '100%',
          margin: '0 auto 60px',
          padding: '0 20px',
          zIndex: 10
        }}
      >
        <div className="folio-card" style={{ padding: '24px 28px', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
          {/* Card Top Header: Category Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            paddingBottom: '16px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }} />
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                Active Company Brain Session
              </span>
            </div>

            {/* Department Pills */}
            <div style={{ display: 'flex', gap: '6px', background: '#f8f6fc', padding: '4px', borderRadius: '999px' }}>
              {[
                { id: 'all', label: 'All Knowledge' },
                { id: 'hr', label: '👤 HR & People' },
                { id: 'finance', label: '💼 Manager & Finance' },
                { id: 'ops', label: '🚚 Logistics & Ops' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: activeCategory === cat.id ? '#ffffff' : 'transparent',
                    color: activeCategory === cat.id ? '#7c3aed' : '#64748b',
                    boxShadow: activeCategory === cat.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Suggestion Chips */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
            {filteredPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.prompt)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: '#fbf9fe',
                  border: '1px solid rgba(124, 58, 237, 0.15)',
                  color: '#4b5563',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#7c3aed';
                  e.currentTarget.style.color = '#7c3aed';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.15)';
                  e.currentTarget.style.color = '#4b5563';
                }}
              >
                <span>{p.title}</span>
                <CornerDownLeft size={11} color="#7c3aed" />
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '20px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* User Message */}
                {msg.sender === 'user' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      maxWidth: '80%',
                      background: '#f4eeff',
                      border: '1px solid rgba(124, 58, 237, 0.18)',
                      borderRadius: '16px 16px 4px 16px',
                      padding: '12px 18px',
                      color: '#0f172a',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      boxShadow: '0 2px 6px rgba(124, 58, 237, 0.04)'
                    }}>
                      {msg.text}
                      <div style={{ fontSize: '0.68rem', color: '#8b5cf6', textAlign: 'right', marginTop: '4px' }}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                )}

                {/* Assistant Message */}
                {msg.sender === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Small Folio Icon Avatar */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '4px',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
                      </svg>
                    </div>

                    <div style={{
                      flex: 1,
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '16px',
                      padding: '20px 22px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                    }}>
                      {/* Top Verification Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '12px',
                        marginBottom: '12px',
                        borderBottom: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                            Executive Briefing
                          </span>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: '#ecfdf5',
                            color: '#059669',
                            border: '1px solid #a7f3d0'
                          }}>
                            <ShieldCheck size={12} />
                            VERIFIED POLICY
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Key Takeaway Callout Box */}
                      {msg.queryResponse?.executive_summary && (
                        <div style={{
                          background: '#f8f5ff',
                          borderLeft: '3px solid #7c3aed',
                          borderRadius: '0 8px 8px 0',
                          padding: '12px 16px',
                          marginBottom: '16px'
                        }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#7c3aed', marginBottom: '4px' }}>
                            Key Takeaway
                          </div>
                          <div style={{ fontSize: '0.88rem', color: '#1e1b4b', lineHeight: 1.5, fontWeight: 500 }}>
                            {msg.queryResponse.executive_summary}
                          </div>
                        </div>
                      )}

                      {/* Detailed Content */}
                      <div style={{
                        fontSize: '0.88rem',
                        color: '#334155',
                        lineHeight: 1.65,
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.text}
                      </div>

                      {/* Verified Documentary Citations */}
                      {msg.queryResponse?.evidence_trail && msg.queryResponse.evidence_trail.length > 0 && (
                        <div style={{
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(0,0,0,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                            Documentary Sources:
                          </span>
                          {msg.queryResponse.evidence_trail.map(ev => (
                            <button
                              key={ev.id}
                              onClick={() => setSelectedEvidence(ev)}
                              style={{
                                padding: '3px 9px',
                                borderRadius: '6px',
                                background: '#f5f3ff',
                                border: '1px solid #ddd6fe',
                                color: '#6d28d9',
                                fontSize: '0.74rem',
                                fontFamily: 'var(--font-mono)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <FileText size={11} />
                              {ev.source_ref}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.78rem',
                              color: msg.copied ? '#059669' : '#475569'
                            }}
                          >
                            {msg.copied ? <Check size={13} /> : <Copy size={13} />}
                            {msg.copied ? 'Copied' : 'Copy Briefing'}
                          </button>

                          <button
                            onClick={() => showToast('Dispatched internal workflow')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              fontSize: '0.78rem',
                              color: '#475569'
                            }}
                          >
                            <ExternalLink size={13} />
                            Launch Action
                          </button>
                        </div>

                        {/* Thumbs Up / Down */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleFeedback(msg.id, 'up')}
                            style={{ padding: '6px 8px', borderRadius: '6px', color: msg.feedback === 'up' ? '#059669' : '#94a3b8' }}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'down')}
                            style={{ padding: '6px 8px', borderRadius: '6px', color: msg.feedback === 'down' ? '#e11d48' : '#94a3b8' }}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Interactive Follow-up Pills */}
                      <div style={{ marginTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {getFollowUpSuggestions(msg.queryResponse).map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              background: '#faf8fe',
                              border: '1px solid rgba(124, 58, 237, 0.2)',
                              color: '#6d28d9',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#f3e8ff';
                              e.currentTarget.style.borderColor = '#7c3aed';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#faf8fe';
                              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
                            }}
                          >
                            <span>{sug}</span>
                            <CornerDownLeft size={11} color="#7c3aed" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#fbf9fe', borderRadius: '12px', border: '1px solid rgba(124,58,237,0.1)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed', animation: 'pulseGlow 1.2s infinite' }} />
                <span style={{ fontSize: '0.84rem', color: '#6d28d9', fontWeight: 600 }}>
                  Company Brain is synthesizing policy repositories and ERP records...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Command Input Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '2px solid rgba(124, 58, 237, 0.2)',
            borderRadius: '999px',
            padding: '6px 8px 6px 20px',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.08)',
            transition: 'border-color 0.2s ease'
          }}
          onFocusCapture={e => e.currentTarget.style.borderColor = '#7c3aed'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything about company HR policies, manager expense limits, or logistics..."
              disabled={isLoading}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.92rem',
                color: '#0f172a',
                padding: '8px 0',
                background: 'transparent'
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputVal.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: inputVal.trim() && !isLoading ? '#0f172a' : '#e2e8f0',
                color: inputVal.trim() && !isLoading ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputVal.trim() && !isLoading ? 'pointer' : 'not-allowed',
                boxShadow: inputVal.trim() ? '0 2px 8px rgba(15,23,42,0.2)' : 'none'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VERIFIED DOCUMENT MODAL (Neat & Clean Light Modal)                        */}
      {/* ========================================================================= */}
      {selectedEvidence && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '620px',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: '#f4ecfc',
                  color: '#7c3aed',
                  marginBottom: '8px'
                }}>
                  OFFICIAL ENTERPRISE SOURCE
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedEvidence.title}
                </h3>
                <div style={{ fontSize: '0.76rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  Reference: {selectedEvidence.source_ref} • Effective Date: {selectedEvidence.date || '2026'}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '18px',
              fontSize: '0.84rem',
              color: '#334155',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-mono)'
            }}>
              {selectedEvidence.full_content || selectedEvidence.snippet}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedEvidence.source_ref + ' - ' + selectedEvidence.title);
                  showToast('Citation reference copied');
                }}
                className="folio-btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                Copy Reference
              </button>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="folio-btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.82rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
