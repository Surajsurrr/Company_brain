import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Sparkles, User, ShieldCheck, Copy, Check,
  ThumbsUp, ThumbsDown, Plus, FileText, X, ArrowRight,
  Briefcase, ShieldAlert, MessageSquare, PlusCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  executeQuery, fetchCompanyProfile,
  fetchEvidenceItem, fetchEvidenceList
} from './services/api';
import {
  QueryResponse, EvidenceItem, CompanyProfile
} from './types';
import { ConsultancyView } from './components/ConsultancyView';
import { EvidenceExplorer } from './components/EvidenceExplorer';
import { IngestionModal } from './components/IngestionModal';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'consultancy' | 'evidence'>('chat');
  
  const [currentProfile, setCurrentProfile] = useState<CompanyProfile | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [isIngestOpen, setIsIngestOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadInitialData = async () => {
    try {
      const [profile, evidence] = await Promise.all([
        fetchCompanyProfile().catch(() => null),
        fetchEvidenceList().catch(() => [])
      ]);
      if (profile) setCurrentProfile(profile);
      if (evidence) setEvidenceList(evidence);
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleStartNewChat = () => {
    setMessages([]);
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 100);
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
        text: "Could not retrieve records from the enterprise repository. Please ensure the backend server is active.",
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

  // Preset-specific questions
  const getPresetPromptCards = () => {
    if (currentProfile?.id === 'cloudscale_saas') {
      return [
        { title: "Snowflake Compute Overrun", subtitle: "Analyze $36,200/mo unbudgeted credit burn", prompt: "Why is Snowflake cloud compute running 34.5% over budget?" },
        { title: "Kafka Sev-1 Incident", subtitle: "Investigate INC-802 buffer overflow outage", prompt: "What was the root cause of the Sev-1 Kafka buffer overflow incident?" },
        { title: "FinServe SLA Penalty", subtitle: "Review 99.95% uptime breach exposure", prompt: "How much revenue is at risk with FinServe under their enterprise SLA?" },
        { title: "Turnaround Plan", subtitle: "Review 30-60-90 day FinOps & NRR roadmap", prompt: "Summarize our 30-60-90 day strategic plan to reach 83% gross margins." }
      ];
    } else if (currentProfile?.id === 'omniverse_retail') {
      return [
        { title: "Long Beach Port Delay", subtitle: "Audit PO-8841 outerwear stockout risk", prompt: "Why is the winter outerwear shipment delayed at Long Beach port?" },
        { title: "D2C Returns Drain", subtitle: "Analyze $720,000 reverse logistics loss", prompt: "What is driving our 24.8% e-commerce return rate and how do we stop the drain?" },
        { title: "Supplier Liquidated Damages", subtitle: "Enforce contract delay penalty on Pacifex", prompt: "What are the recommended supplier SLA penalties for Pacifex Textiles under PO-8841?" },
        { title: "Margin Recovery Plan", subtitle: "Nearshoring & 30-day return policy", prompt: "What is our turnaround strategy to recover gross margins from 51.2% to 58.5%?" }
      ];
    }
    // Default Apex Logistics
    return [
      { title: "Freight Cost Surge", subtitle: "Deconstruct $142,000 uncontracted surcharge overage", prompt: "Why did Q3 freight costs exceed baseline contract rates?" },
      { title: "Route 101 SLA Delays", subtitle: "Examine Newark hub crane disruption & delays", prompt: "What carrier SLA breaches or delivery delays occurred on Route 101?" },
      { title: "Carrier Rerouting", subtitle: "Evaluate shifting freight to Swift Transport", prompt: "Can we reroute cargo through Swift Transport to avoid Newark congestion?" },
      { title: "PTO Carryover Policy", subtitle: "Employee handbook carryover rules & deadlines", prompt: "What is our company policy on carrying over unused PTO days into next year?" }
    ];
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--folio-bg)',
      color: '#0f172a',
      position: 'relative'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '999px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 9999,
          fontSize: '0.84rem',
          fontWeight: 600
        }}>
          <Sparkles size={15} color="#c084fc" />
          {toastMessage}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR                                                        */}
      {/* ========================================================================= */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 28px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo & Preset Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            onClick={handleStartNewChat}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                  Company Brain
                </span>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  color: '#7c3aed',
                  letterSpacing: '0.04em'
                }}>
                  ENTERPRISE CONSULTANCY AI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.05)',
          padding: '4px',
          borderRadius: '12px',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'chat' ? '#ffffff' : 'transparent',
              color: activeTab === 'chat' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'chat' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={15} />
            Executive Query
          </button>

          <button
            onClick={() => setActiveTab('consultancy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'consultancy' ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'transparent',
              color: activeTab === 'consultancy' ? '#ffffff' : '#7c3aed',
              boxShadow: activeTab === 'consultancy' ? '0 2px 8px rgba(124, 58, 237, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Briefcase size={15} />
            Strategic Advisory & Business Plan
          </button>


          <button
            onClick={() => setActiveTab('evidence')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'evidence' ? '#ffffff' : 'transparent',
              color: activeTab === 'evidence' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'evidence' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldAlert size={15} />
            Evidence Explorer
          </button>
        </div>

        {/* Right Controls: Ingest + New Chat */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsIngestOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
            }}
          >
            <PlusCircle size={15} />
            + Ingest Data
          </button>

          {activeTab === 'chat' && (
            <button
              onClick={handleStartNewChat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              New Chat
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* BODY VIEW DISPATCHER                                                      */}
      {/* ========================================================================= */}

      {/* VIEW 1: STRATEGIC CONSULTANCY & BUSINESS PLAN */}
      {activeTab === 'consultancy' && (
        <main style={{ flex: 1, background: 'var(--folio-bg)' }}>
          <ConsultancyView companyProfile={currentProfile} />
        </main>
      )}


      {/* VIEW 3: EVIDENCE EXPLORER */}
      {activeTab === 'evidence' && (
        <main style={{ flex: 1, height: 'calc(100vh - 65px)', background: 'var(--folio-bg)' }}>
          <EvidenceExplorer
            evidenceList={evidenceList}
            onSelectEvidence={(ev) => setSelectedEvidence(ev)}
          />
        </main>
      )}

      {/* VIEW 4: EXECUTIVE QUERY CHAT INTERFACE */}
      {activeTab === 'chat' && (
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '920px',
          width: '100%',
          margin: '0 auto',
          padding: '0 20px 120px',
          position: 'relative'
        }}>
          {/* EMPTY STATE / PROMPT HERO */}
          {messages.length === 0 && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px 30px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(124, 58, 237, 0.25)',
                marginBottom: '20px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
              </div>

              <h1 style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.035em',
                marginBottom: '10px'
              }}>
                {currentProfile ? `${currentProfile.name} Intelligence Layer` : "Operational Intelligence Layer"}
              </h1>

              <p style={{
                fontSize: '0.98rem',
                color: '#64748b',
                maxWidth: '580px',
                lineHeight: 1.6,
                marginBottom: '32px'
              }}>
                {currentProfile ? currentProfile.description : "Cross-relational reasoning across contracts, financial invoices, operational incidents, and HR policies."}
              </p>

              {/* Central Input Box */}
              <div style={{
                width: '100%',
                maxWidth: '700px',
                background: '#ffffff',
                border: '2px solid rgba(124, 58, 237, 0.22)',
                borderRadius: '24px',
                padding: '12px 14px 12px 24px',
                boxShadow: '0 16px 40px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask anything about ${currentProfile?.name || 'the company'}...`}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    color: '#0f172a',
                    background: 'transparent'
                  }}
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputVal.trim()}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: inputVal.trim() && !isLoading ? '#0f172a' : '#f1f5f9',
                    color: inputVal.trim() && !isLoading ? '#ffffff' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputVal.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    border: 'none'
                  }}
                >
                  <Send size={18} />
                </button>
              </div>

              {/* PRESET PROMPT CARDS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
                width: '100%',
                maxWidth: '700px',
                marginTop: '32px'
              }}>
                {getPresetPromptCards().map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSendMessage(card.prompt)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#7c3aed';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                      {card.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHAT MESSAGES STREAM */}
          {messages.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '32px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Sender Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: msg.sender === 'user' ? '#0f172a' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {msg.sender === 'user' ? 'U' : 'AI'}
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                      {msg.sender === 'user' ? 'You' : 'Company Brain'}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    background: msg.sender === 'user' ? '#f8fafc' : '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                    lineHeight: 1.65,
                    fontSize: '0.94rem',
                    color: '#1e293b',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    {msg.sender === 'assistant' && msg.queryResponse ? (
                      <div>
                        {/* Executive Summary Callout */}
                        <div style={{
                          background: 'rgba(124, 58, 237, 0.06)',
                          borderLeft: '4px solid #7c3aed',
                          padding: '12px 16px',
                          borderRadius: '6px',
                          marginBottom: '16px',
                          fontSize: '0.92rem',
                          color: '#4c1d95',
                          fontWeight: 500
                        }}>
                          <strong>Executive Summary:</strong> {msg.queryResponse.executive_summary}
                        </div>

                        {/* Detailed text */}
                        <div style={{ color: '#1e293b', fontSize: '0.94rem', lineHeight: 1.7 }}>
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '16px 0 8px', color: '#0f172a' }} {...props} />,
                              h2: ({node, ...props}) => <h2 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '14px 0 8px', color: '#0f172a' }} {...props} />,
                              h3: ({node, ...props}) => <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '12px 0 6px', color: '#0f172a' }} {...props} />,
                              p: ({node, ...props}) => <p style={{ margin: '0 0 10px 0', lineHeight: 1.65 }} {...props} />,
                              ul: ({node, ...props}) => <ul style={{ margin: '6px 0 12px 0', paddingLeft: '22px' }} {...props} />,
                              ol: ({node, ...props}) => <ol style={{ margin: '6px 0 12px 0', paddingLeft: '22px' }} {...props} />,
                              li: ({node, ...props}) => <li style={{ marginBottom: '4px' }} {...props} />,
                              strong: ({node, ...props}) => <strong style={{ fontWeight: 700, color: '#0f172a' }} {...props} />,
                              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '3px solid #7c3aed', paddingLeft: '12px', margin: '8px 0', color: '#64748b' }} {...props} />,
                              code: ({node, ...props}) => <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85em', fontFamily: 'monospace' }} {...props} />
                            }}
                          >
                            {msg.queryResponse.detailed_answer}
                          </ReactMarkdown>
                        </div>

                        {/* Causal factors pills */}
                        {msg.queryResponse.causal_factors?.length > 0 && (
                          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                              Root Cause Attribution:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {msg.queryResponse.causal_factors.map((cf, i) => (
                                <div key={i} style={{
                                  background: '#fef2f2',
                                  border: '1px solid #fecaca',
                                  borderRadius: '8px',
                                  padding: '6px 12px',
                                  fontSize: '0.8rem',
                                  color: '#991b1b'
                                }}>
                                  <strong>{cf.attribution_percentage}%:</strong> {cf.factor} (${cf.financial_impact?.toLocaleString()})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Evidence citations */}
                        {msg.queryResponse.evidence_trail?.length > 0 && (
                          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                              Verified Enterprise Evidence:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {msg.queryResponse.evidence_trail.map(ev => (
                                <button
                                  key={ev.id}
                                  onClick={() => setSelectedEvidence(ev)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '5px 10px',
                                    fontSize: '0.78rem',
                                    color: '#0f172a',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <FileText size={13} color="#7c3aed" />
                                  {ev.title} ({ev.source_ref})
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#1e293b', fontSize: '0.94rem', lineHeight: 1.65 }}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 20px',
                  background: '#fbf9fe',
                  borderRadius: '16px',
                  border: '1px solid rgba(124, 58, 237, 0.12)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#7c3aed',
                    animation: 'pulseGlow 1.2s infinite'
                  }} />
                  <span style={{ fontSize: '0.86rem', color: '#6d28d9', fontWeight: 600 }}>
                    Company Brain is traversing knowledge graphs and synthesizing evidence...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>
      )}

      {/* STICKY BOTTOM CHAT INPUT BAR */}
      {activeTab === 'chat' && messages.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(252, 251, 254, 1) 70%, rgba(252, 251, 254, 0))',
          padding: '16px 20px 20px',
          zIndex: 40
        }}>
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '2px solid rgba(124, 58, 237, 0.22)',
              borderRadius: '999px',
              padding: '6px 8px 6px 20px',
              boxShadow: '0 8px 30px rgba(124, 58, 237, 0.1)'
            }}>
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
                placeholder="Ask any question about enterprise policies, finances, or operations..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.94rem',
                  color: '#0f172a',
                  padding: '8px 0',
                  background: 'transparent'
                }}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputVal.trim()}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: inputVal.trim() && !isLoading ? '#0f172a' : '#f1f5f9',
                  color: inputVal.trim() && !isLoading ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputVal.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  border: 'none'
                }}
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED DOCUMENT CITATION MODAL */}
      {selectedEvidence && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '640px',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: '#ffffff',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedEvidence.title}
                </h3>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                  Reference: {selectedEvidence.source_ref} • Date: {selectedEvidence.date || '2026'}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  cursor: 'pointer'
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
              whiteSpace: 'pre-wrap'
            }}>
              {selectedEvidence.full_content || selectedEvidence.snippet}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedEvidence.source_ref} - ${selectedEvidence.title}`);
                  showToast('Citation copied');
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Copy Reference
              </button>
              <button
                onClick={() => setSelectedEvidence(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC INGESTION MODAL */}
      <IngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onIngestSuccess={async (resp) => {
          setIsIngestOpen(false);
          showToast(`Ingested & linked ${resp.extracted_edges?.length || 0} relational edges!`);
          try {
            const updatedEvidence = await fetchEvidenceList();
            setEvidenceList(updatedEvidence);
          } catch (err) {
            console.error("Failed to refresh evidence after ingestion:", err);
          }
        }}
      />
    </div>
  );
}

export default App;
