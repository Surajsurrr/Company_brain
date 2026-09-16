import React, { useState, useEffect, useRef } from 'react';
import {
  Send, BrainCircuit, Sparkles, User, ShieldCheck, Copy, Check,
  ExternalLink, ThumbsUp, ThumbsDown, ChevronRight, Plus,
  FileText, CornerDownLeft, Paperclip, Clock, Building2,
  Calendar, DollarSign, Truck, Users, Settings, BookOpen, Layers,
  Compass, ArrowUpRight, MessageSquare, Search, X
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

interface Thread {
  id: string;
  title: string;
  category: 'hr' | 'manager' | 'ops' | 'general';
  lastUpdated: string;
  presetPrompt?: string;
}

const PRESET_THREADS: Thread[] = [
  { id: 't1', title: 'Q3 Freight Surcharge Dispute & Audit', category: 'ops', lastUpdated: '10m ago', presetPrompt: 'Why did our freight delivery cost surge in Q3 for Northeast routes?' },
  { id: 't2', title: 'PTO Carryover & Vacation Leave Policy', category: 'hr', lastUpdated: '1h ago', presetPrompt: 'What is our company policy on carryover PTO and what is the deadline to use it?' },
  { id: 't3', title: 'Manager Expense Approval Thresholds', category: 'manager', lastUpdated: 'Yesterday', presetPrompt: 'What are the expense approval thresholds for direct managers vs directors and VPs?' },
  { id: 't4', title: 'Annual Wellness & Ergonomic Reimbursement', category: 'hr', lastUpdated: '2d ago', presetPrompt: 'How much is our annual home office & wellness stipend and how do I submit a claim?' },
  { id: 't5', title: 'Swift Dedicated Van Capacity Overflow', category: 'ops', lastUpdated: '3d ago', presetPrompt: 'What alternative carrier capacity exists to bypass Newark port bottlenecks?' }
];

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string>('t1');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [sampleQueries, setSampleQueries] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchSampleQueries().then(samples => setSampleQueries(samples)).catch(console.error);
    // Initialize with flagship thread
    loadThread(PRESET_THREADS[0]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadThread = async (thread: Thread) => {
    setActiveThreadId(thread.id);
    if (!thread.presetPrompt) {
      setMessages([]);
      return;
    }

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: thread.presetPrompt,
      timestamp: 'Just now'
    };

    setMessages([userMsg]);
    setIsLoading(true);

    try {
      const response = await executeQuery(thread.presetPrompt);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.detailed_answer || response.executive_summary,
        timestamp: 'Just now',
        queryResponse: response
      };
      setMessages([userMsg, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
    showToast(type === 'up' ? 'Marked as helpful' : 'Feedback recorded for model tuning');
  };

  // Dynamic follow-up chips based on last query response
  const getFollowUpSuggestions = (res?: QueryResponse) => {
    if (!res) return [];
    const text = (res.query + ' ' + res.detailed_answer).toLowerCase();
    if (text.includes('pto') || text.includes('vacation')) {
      return [
        'How do I submit this in BambooHR?',
        'Can I roll over more than 5 days with VP exception?',
        'What is our bereavement leave policy?'
      ];
    }
    if (text.includes('expense') || text.includes('approval')) {
      return [
        'What is the daily meal per diem rate?',
        'Can I book business class on international flights?',
        'How does Coupa purchase order routing work?'
      ];
    }
    if (text.includes('cost') || text.includes('surge') || text.includes('apex')) {
      return [
        'Can we deduct $4,000 under Contract Clause 7.1?',
        'What alternative capacity did SwiftLogistics offer?',
        'Draft a dispute email to Apex Freight AP department'
      ];
    }
    return [
      'Show me the exact policy clause in full',
      'Who is the department head responsible for this?',
      'What are the compliance exceptions?'
    ];
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-app)', overflow: 'hidden' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: '#1e2538',
          border: '1px solid var(--border-highlight)',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-elevated)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 9999,
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <Sparkles size={15} color="#818cf8" />
          {toastMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEFT SIDEBAR: Enterprise Context & Threads                                */}
      {/* ========================================================================= */}
      {isSidebarOpen && (
        <aside style={{
          width: '280px',
          minWidth: '280px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          userSelect: 'none'
        }}>
          {/* Org Header */}
          <div style={{
            padding: '16px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)'
              }}>
                <BrainCircuit size={18} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  Atlas Global Corp
                </h2>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Enterprise Brain • v2.4
                </div>
              </div>
            </div>
          </div>

          {/* New Conversation Button */}
          <div style={{ padding: '12px 16px' }}>
            <button
              onClick={() => {
                setActiveThreadId('');
                setMessages([]);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-medium)',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} color="#818cf8" />
                New Inquiry
              </span>
              <kbd style={{ fontSize: '0.66rem', padding: '2px 5px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}>
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Recent Inquiries List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              padding: '8px 8px 6px',
              letterSpacing: '0.05em'
            }}>
              Recent Inquiries
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {PRESET_THREADS.map(thread => {
                const isActive = activeThreadId === thread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => loadThread(thread)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '9px 10px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      background: isActive ? 'var(--bg-card-active)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--border-highlight)' : 'transparent'}`,
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = 'var(--bg-card-hover)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <MessageSquare size={15} color={isActive ? '#818cf8' : '#64748b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 600 : 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {thread.title}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {thread.lastUpdated}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Pinned Enterprise Tools */}
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-faint)',
              padding: '18px 8px 6px',
              letterSpacing: '0.05em'
            }}>
              Company Systems
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { name: 'BambooHR Portal', desc: 'PTO & Org Chart', icon: Users, color: '#34d399' },
                { name: 'Expensify & Coupa', desc: 'Expenses & POs', icon: DollarSign, color: '#fbbf24' },
                { name: 'Navan Corporate Travel', desc: 'Flights & Hotels', icon: Compass, color: '#60a5fa' },
                { name: 'Logistics SLA Tracker', desc: 'Route 101 & Carriers', icon: Truck, color: '#f87171' }
              ].map((tool, idx) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => showToast(`Simulating SSO launch to ${tool.name}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '7px',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconComponent size={14} color={tool.color} />
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>{tool.name}</div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{tool.desc}</div>
                      </div>
                    </div>
                    <ArrowUpRight size={12} color="#64748b" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Profile Footer */}
          <div style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                SP
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                  Suraj Patel
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Lead Ops & Supply Chain
                </div>
              </div>
            </div>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} title="Synced with Enterprise SSO" />
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE: Natural Conversation Stream & Actions                     */}
      {/* ========================================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        {/* Top Workspace Header */}
        <header style={{
          height: '56px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'rgba(8, 10, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                padding: '6px',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.04)'
              }}
              title="Toggle Sidebar"
            >
              <Layers size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>
                {activeThreadId ? PRESET_THREADS.find(t => t.id === activeThreadId)?.title || 'Enterprise Knowledge Inquiry' : 'New Knowledge Inquiry'}
              </span>
              <span className="meta-tag meta-tag-blue">
                REAL-TIME GROUNDED
              </span>
            </div>
          </div>

          {/* Department Quick Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'all', label: 'All Knowledge' },
              { id: 'hr', label: 'HR & People' },
              { id: 'finance', label: 'Finance & Travel' },
              { id: 'ops', label: 'Operations & Logistics' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: activeCategory === cat.id ? 'var(--brand-subtle)' : 'transparent',
                  color: activeCategory === cat.id ? '#818cf8' : 'var(--text-muted)',
                  border: `1px solid ${activeCategory === cat.id ? 'var(--brand-border)' : 'transparent'}`
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </header>

        {/* Message Stream */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 24px 140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Empty State / Welcome */}
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'var(--brand-subtle)',
                  border: '1px solid var(--brand-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Sparkles size={26} color="#818cf8" />
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  Good afternoon, Suraj.
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.5, marginBottom: '24px' }}>
                  Ask any question regarding company policies, approval delegation, vendor contracts, or freight deliveries.
                </p>

                {/* Suggestions Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '10px',
                  width: '100%'
                }}>
                  {sampleQueries.slice(0, 4).map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleSendMessage(s.prompt)}
                      className="linear-card-interactive"
                      style={{ padding: '14px 16px', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span className="meta-tag meta-tag-blue" style={{ fontSize: '0.68rem' }}>
                          {s.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.4 }}>
                        {s.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Render Messages */}
            {messages.map((msg, i) => (
              <div key={msg.id} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* USER MESSAGE */}
                {msg.sender === 'user' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      maxWidth: '75%',
                      background: '#1a2238',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      borderRadius: '14px 14px 2px 14px',
                      padding: '12px 16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{ fontSize: '0.88rem', color: '#f8fafc', lineHeight: 1.55 }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'right', marginTop: '4px' }}>
                        {msg.timestamp}
                      </div>
                    </div>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      SP
                    </div>
                  </div>
                )}

                {/* ASSISTANT BRIEFING CARD */}
                {msg.sender === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'var(--brand-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '4px',
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
                    }}>
                      <BrainCircuit size={16} color="#fff" />
                    </div>

                    <div className="linear-card" style={{ flex: 1, padding: '20px 22px', overflow: 'hidden' }}>
                      {/* Card Header & Verification Pill */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '12px',
                        marginBottom: '14px',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                            Executive Briefing
                          </span>
                          <span className="meta-tag meta-tag-emerald">
                            <ShieldCheck size={12} color="#34d399" />
                            VERIFIED POLICY
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Callout Box for Executive Summary */}
                      {msg.queryResponse?.executive_summary && (
                        <div style={{
                          background: 'rgba(99, 102, 241, 0.08)',
                          borderLeft: '3px solid #6366f1',
                          borderRadius: '0 8px 8px 0',
                          padding: '12px 16px',
                          marginBottom: '16px'
                        }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc', marginBottom: '4px' }}>
                            Key Takeaway
                          </div>
                          <div style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.5, fontWeight: 500 }}>
                            {msg.queryResponse.executive_summary}
                          </div>
                        </div>
                      )}

                      {/* Main Detailed Content with Markdown styling */}
                      <div style={{
                        fontSize: '0.86rem',
                        color: '#cbd5e1',
                        lineHeight: 1.65,
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.text}
                      </div>

                      {/* Verified Documentary Citations */}
                      {msg.queryResponse?.evidence_trail && msg.queryResponse.evidence_trail.length > 0 && (
                        <div style={{
                          marginTop: '18px',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            Documentary References:
                          </span>
                          {msg.queryResponse.evidence_trail.map(ev => (
                            <button
                              key={ev.id}
                              onClick={() => setSelectedEvidence(ev)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '5px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid var(--border-medium)',
                                color: '#93c5fd',
                                fontSize: '0.72rem',
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

                      {/* Action Bar (Copy, External Link, Rating) */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              fontSize: '0.74rem',
                              color: msg.copied ? '#34d399' : 'var(--text-secondary)'
                            }}
                          >
                            {msg.copied ? <Check size={13} /> : <Copy size={13} />}
                            {msg.copied ? 'Copied' : 'Copy Briefing'}
                          </button>

                          <button
                            onClick={() => showToast('Opening internal workflow ticket')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              fontSize: '0.74rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <ExternalLink size={13} />
                            Launch Action
                          </button>
                        </div>

                        {/* Thumbs Feedback */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => handleFeedback(msg.id, 'up')}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              color: msg.feedback === 'up' ? '#34d399' : 'var(--text-muted)'
                            }}
                            title="Helpful"
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'down')}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              color: msg.feedback === 'down' ? '#f43f5e' : 'var(--text-muted)'
                            }}
                            title="Not helpful"
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Contextual Follow-Up Suggestions */}
                      <div style={{ marginTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {getFollowUpSuggestions(msg.queryResponse).map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(suggestion)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.73rem',
                              background: 'rgba(99, 102, 241, 0.06)',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                              color: '#c7d2fe',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                              e.currentTarget.style.borderColor = '#818cf8';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.06)';
                              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                            }}
                          >
                            <span>{suggestion}</span>
                            <CornerDownLeft size={11} color="#818cf8" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Skeleton */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'var(--brand-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <BrainCircuit size={16} color="#fff" />
                </div>
                <div className="linear-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818cf8' }} className="pulse-indicator" />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Cross-referencing enterprise policies, ERP ledger, and operational records...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LINEAR-INSPIRED COMMAND BAR INPUT                                         */}
        {/* ========================================================================= */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px 22px',
          background: 'linear-gradient(to top, rgba(8, 10, 15, 0.98) 70%, transparent 100%)',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 30
        }}>
          <div style={{ width: '100%', maxWidth: '780px' }}>
            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: '12px',
              padding: '6px 8px 6px 14px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'var(--shadow-elevated)',
              transition: 'border-color 0.2s ease'
            }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border-medium)'}
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
                placeholder="Ask Company Brain (e.g. 'Can I carry over 10 PTO days?' or 'Who signs expenses above $5k?')..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.88rem',
                  padding: '8px 0'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => showToast('Context attachment simulated')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    color: 'var(--text-muted)'
                  }}
                  title="Attach file or context"
                >
                  <Paperclip size={16} />
                </button>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputVal.trim()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: inputVal.trim() && !isLoading ? 'var(--brand-gradient)' : 'rgba(255,255,255,0.06)',
                    color: inputVal.trim() && !isLoading ? '#fff' : 'var(--text-faint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: inputVal.trim() ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none',
                    cursor: inputVal.trim() && !isLoading ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 4px 0',
              fontSize: '0.7rem',
              color: 'var(--text-faint)'
            }}>
              <span>Responses are verified against official company handbooks and operational databases.</span>
              <span>Press <b>Enter ↵</b> to send</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VERIFIED DOCUMENT VIEWER MODAL                                            */}
      {/* ========================================================================= */}
      {selectedEvidence && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '24px'
        }}>
          <div className="linear-card" style={{
            width: '100%',
            maxWidth: '620px',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: '#0d111a',
            padding: '24px',
            boxShadow: 'var(--shadow-elevated)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span className="meta-tag meta-tag-blue" style={{ marginBottom: '6px' }}>
                  OFFICIAL ENTERPRISE SOURCE
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  {selectedEvidence.title}
                </h3>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  Reference: {selectedEvidence.source_ref} • Effective Date: {selectedEvidence.date || '2026'}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                style={{ padding: '6px', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              background: '#07090e',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-mono)'
            }}>
              {selectedEvidence.full_content || selectedEvidence.snippet}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedEvidence.source_ref + ' - ' + selectedEvidence.title);
                  showToast('Citation reference copied');
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                Copy Reference
              </button>
              <button
                onClick={() => setSelectedEvidence(null)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  background: 'var(--brand-gradient)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
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
