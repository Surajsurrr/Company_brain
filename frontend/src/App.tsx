import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Sparkles, User, ShieldCheck, Copy, Check,
  ThumbsUp, ThumbsDown, Plus, FileText, X, ArrowRight
} from 'lucide-react';
import { executeQuery } from './services/api';
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
      {/* TOP CLEAN NAVIGATION BAR                                                  */}
      {/* ========================================================================= */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 28px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Brand Logo */}
        <div
          onClick={handleStartNewChat}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
            folio
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '999px',
            background: 'rgba(124, 58, 237, 0.08)',
            color: '#7c3aed',
            letterSpacing: '0.04em'
          }}>
            COMPANY BRAIN AI
          </span>
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#059669',
            background: '#ecfdf5',
            padding: '5px 12px',
            borderRadius: '999px',
            border: '1px solid #a7f3d0'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            Connected
          </div>

          <button
            onClick={handleStartNewChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '999px',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#334155',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#7c3aed';
              e.currentTarget.style.color = '#7c3aed';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT CANVAS                                                       */}
      {/* ========================================================================= */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '880px',
        width: '100%',
        margin: '0 auto',
        padding: '0 20px 120px',
        position: 'relative'
      }}>
        {/* CASE 1: EMPTY STATE (ChatGPT / Gemini Hero Welcome) */}
        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '70px 20px 40px',
            textAlign: 'center'
          }}>
            {/* Glowing Brand Emblem */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(124, 58, 237, 0.28)',
              marginBottom: '24px'
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
            </div>

            <h1 style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.035em',
              marginBottom: '12px'
            }}>
              What would you like to know today?
            </h1>

            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              maxWidth: '540px',
              lineHeight: 1.6,
              marginBottom: '36px'
            }}>
              Ask anything about company HR policies, manager expense approval limits,
              carrier contracts, or operational logistics.
            </p>

            {/* Central Gemini-style Prompt Input Box */}
            <div style={{
              width: '100%',
              maxWidth: '680px',
              background: '#ffffff',
              border: '2px solid rgba(124, 58, 237, 0.22)',
              borderRadius: '24px',
              padding: '12px 14px 12px 24px',
              boxShadow: '0 16px 40px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
            onFocusCapture={e => {
              e.currentTarget.style.borderColor = '#7c3aed';
              e.currentTarget.style.boxShadow = '0 20px 48px rgba(124, 58, 237, 0.14), 0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
            onBlurCapture={e => {
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.22)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
            >
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
                placeholder="Ask any question in your own words..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.02rem',
                  color: '#0f172a',
                  background: 'transparent'
                }}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputVal.trim()}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: inputVal.trim() && !isLoading ? '#0f172a' : '#f1f5f9',
                  color: inputVal.trim() && !isLoading ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputVal.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  boxShadow: inputVal.trim() ? '0 4px 14px rgba(15, 23, 42, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowRight size={20} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '20px',
              fontSize: '0.78rem',
              color: '#94a3b8'
            }}>
              <span>Interactive Enterprise AI</span>
              <span>•</span>
              <span>Policy Repositories & Invoices</span>
              <span>•</span>
              <span>Press Enter ↵ to send</span>
            </div>
          </div>
        )}

        {/* CASE 2: CONVERSATION STREAM (When messages exist) */}
        {messages.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingTop: '32px'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* User Message Bubble */}
                {msg.sender === 'user' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      maxWidth: '78%',
                      background: '#f4eeff',
                      border: '1px solid rgba(124, 58, 237, 0.18)',
                      borderRadius: '18px 18px 4px 18px',
                      padding: '14px 20px',
                      color: '#0f172a',
                      fontSize: '0.94rem',
                      lineHeight: 1.55,
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.05)'
                    }}>
                      <div>{msg.text}</div>
                      <div style={{ fontSize: '0.68rem', color: '#8b5cf6', textAlign: 'right', marginTop: '6px' }}>
                        {msg.timestamp}
                      </div>
                    </div>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4f46e5',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <User size={16} />
                    </div>
                  </div>
                )}

                {/* Assistant Message Card */}
                {msg.sender === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Folio Star Avatar */}
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round"/>
                      </svg>
                    </div>

                    <div style={{
                      flex: 1,
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '20px',
                      padding: '22px 24px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
                    }}>
                      {/* Top Briefing Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '12px',
                        marginBottom: '14px',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                            Company Brain
                          </span>
                          {msg.queryResponse?.evidence_trail && msg.queryResponse.evidence_trail.length > 0 && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 9px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: '#ecfdf5',
                              color: '#059669',
                              border: '1px solid #a7f3d0'
                            }}>
                              <ShieldCheck size={12} />
                              VERIFIED SOURCE
                            </span>
                          )}
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
                        fontSize: '0.9rem',
                        color: '#334155',
                        lineHeight: 1.68,
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.text}
                      </div>

                      {/* Documentary Sources Tags */}
                      {msg.queryResponse?.evidence_trail && msg.queryResponse.evidence_trail.length > 0 && (
                        <div style={{
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
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
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background: '#f5f3ff',
                                border: '1px solid #ddd6fe',
                                color: '#6d28d9',
                                fontSize: '0.74rem',
                                fontFamily: 'var(--font-mono)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
                              onMouseLeave={e => e.currentTarget.style.background = '#f5f3ff'}
                            >
                              <FileText size={12} />
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
                        borderTop: '1px solid rgba(0, 0, 0, 0.05)'
                      }}>
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

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleFeedback(msg.id, 'up')}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              background: 'transparent',
                              color: msg.feedback === 'up' ? '#059669' : '#94a3b8'
                            }}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'down')}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              background: 'transparent',
                              color: msg.feedback === 'down' ? '#e11d48' : '#94a3b8'
                            }}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
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
                  Company Brain is synthesizing enterprise records and policies...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM INPUT BAR (Active when chatting)                             */}
      {/* ========================================================================= */}
      {messages.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(252, 251, 254, 1) 70%, rgba(252, 251, 254, 0))',
          padding: '20px 20px 24px',
          zIndex: 40
        }}>
          <div style={{
            maxWidth: '840px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '2px solid rgba(124, 58, 237, 0.22)',
              borderRadius: '999px',
              padding: '6px 8px 6px 20px',
              boxShadow: '0 8px 30px rgba(124, 58, 237, 0.1)',
              transition: 'border-color 0.2s ease'
            }}
            onFocusCapture={e => e.currentTarget.style.borderColor = '#7c3aed'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.22)'}
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
                placeholder="Ask any question about company policies, finances, or operations..."
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
                  boxShadow: inputVal.trim() ? '0 2px 10px rgba(15, 23, 42, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={17} />
              </button>
            </div>

            <div style={{
              textAlign: 'center',
              fontSize: '0.73rem',
              color: '#94a3b8',
              marginTop: '8px'
            }}>
              Company Brain cross-references verified HR handbooks, manager authorizations, and vendor contracts.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VERIFIED DOCUMENT CITATION MODAL                                          */}
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
