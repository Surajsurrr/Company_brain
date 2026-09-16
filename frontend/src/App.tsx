import React, { useState, useEffect, useRef } from 'react';
import {
  Send, BrainCircuit, Sparkles, User, ShieldCheck,
  ChevronDown, ChevronUp, FileText, X, Trash2, ArrowRight
} from 'lucide-react';
import { executeQuery, fetchSampleQueries } from './services/api';
import { QueryResponse, EvidenceItem } from './types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  queryResponse?: QueryResponse;
}

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sampleQueries, setSampleQueries] = useState<any[]>([]);
  const [activeRole, setActiveRole] = useState<string>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load sample prompts
  useEffect(() => {
    fetchSampleQueries().then(samples => {
      setSampleQueries(samples);
    }).catch(err => console.error(err));
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || inputVal).trim();
    if (!queryText || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await executeQuery(queryText);
      const assistantMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.detailed_answer || response.executive_summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queryResponse: response
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: "I apologize, but I encountered an error searching the company records. Please ensure the backend service is running or try rephrasing your question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Filter sample prompts by role
  const filteredSamples = sampleQueries.filter(s => {
    if (activeRole === 'all') return true;
    if (activeRole === 'hr') return s.category?.includes('HR');
    if (activeRole === 'manager') return s.category?.includes('Management');
    if (activeRole === 'ops') return s.category?.includes('Operations');
    return true;
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)'
    }}>
      {/* Sleek Top Navigation */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.92)',
        backdropFilter: 'blur(20px)',
        zIndex: 50
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent-primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
          }}>
            <BrainCircuit size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                Company Brain AI
              </h1>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                INTERNAL ASSISTANT
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Ask anything about HR policies, manager expense limits, benefits, or logistics operations
            </p>
          </div>
        </div>

        {/* Clear Chat CTA */}
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            <Trash2 size={14} />
            Reset Chat
          </button>
        )}
      </header>

      {/* Main Chat Feed Container */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 20px',
        width: '100%'
      }}>
        <div style={{ width: '100%', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Welcome Card if no messages */}
          {messages.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                boxShadow: '0 0 25px rgba(99, 102, 241, 0.2)'
              }}>
                <Sparkles size={30} color="#818cf8" />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                How can the Company Brain help you today?
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.5, marginBottom: '28px' }}>
                Our internal AI is directly connected to company handbooks, HR policies, manager approval workflows, and operational ERP systems.
              </p>

              {/* Department Role Selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { id: 'all', label: 'All Questions' },
                  { id: 'hr', label: '👤 Employee & HR' },
                  { id: 'manager', label: '💼 Manager & Finance' },
                  { id: 'ops', label: '🚚 Operations & Supply Chain' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRole(r.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: activeRole === r.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
                      border: '1px solid',
                      borderColor: activeRole === r.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      color: activeRole === r.id ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Prompt Suggestions Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                width: '100%'
              }}>
                {filteredSamples.map(sample => (
                  <div
                    key={sample.id}
                    onClick={() => handleSendMessage(sample.prompt)}
                    className="glass-panel"
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'var(--bg-card)';
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#818cf8', marginBottom: '6px' }}>
                      {sample.badge}
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.4 }}>
                      {sample.title}
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Ask question <ArrowRight size={12} color="#6366f1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message History */}
          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'var(--accent-primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
                }}>
                  <BrainCircuit size={18} color="#fff" />
                </div>
              )}

              <div style={{
                maxWidth: msg.sender === 'user' ? '75%' : '88%',
                borderRadius: '14px',
                padding: '16px 20px',
                background: msg.sender === 'user' ? 'var(--accent-primary-gradient)' : 'var(--bg-card)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                color: msg.sender === 'user' ? '#ffffff' : '#f8fafc'
              }}>
                {/* Message Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                  fontSize: '0.72rem',
                  color: msg.sender === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'
                }}>
                  <span style={{ fontWeight: 600 }}>
                    {msg.sender === 'user' ? 'You' : 'Company Brain'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Content */}
                <div style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>

                {/* Verified Evidence & Sources Bar (For Assistant) */}
                {msg.queryResponse?.evidence_trail && msg.queryResponse.evidence_trail.length > 0 && (
                  <div style={{
                    marginTop: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 600 }}>
                      <ShieldCheck size={14} color="#818cf8" />
                      <span>Verified Against Internal Documents:</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {msg.queryResponse.evidence_trail.map(ev => (
                        <button
                          key={ev.id}
                          onClick={() => setSelectedEvidence(ev)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            color: '#cbd5e1',
                            fontSize: '0.74rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FileText size={12} color="#818cf8" />
                          <span>{ev.title} ({ev.source_ref})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  <User size={18} color="#cbd5e1" />
                </div>
              )}
            </div>
          ))}

          {/* Thinking / Processing Bubble */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'var(--accent-primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <BrainCircuit size={18} color="#fff" />
              </div>
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#818cf8',
                  animation: 'pulseGlow 1s infinite'
                }} />
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Searching Company Brain knowledge graph & policies...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Chat Input Bar */}
      <footer style={{
        padding: '16px 20px 24px',
        background: 'rgba(7, 9, 14, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 40
      }}>
        <div style={{ width: '100%', maxWidth: '820px' }}>
          {/* Input Box */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(16, 23, 38, 0.95)',
            borderRadius: '14px',
            border: '1px solid var(--border-highlight)',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5), var(--shadow-glow)',
            padding: '6px'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any question about company policies, manager limits, or operations..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputVal.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: !inputVal.trim() || isLoading ? 'rgba(255,255,255,0.06)' : 'var(--accent-primary-gradient)',
                color: !inputVal.trim() || isLoading ? 'var(--text-muted)' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !inputVal.trim() || isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <Send size={18} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            padding: '0 4px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}>
            <span>AI responses are grounded in verified company handbooks and operational databases.</span>
            <span>Press Enter ↵ to send</span>
          </div>
        </div>
      </footer>

      {/* Verified Document Modal (when employee clicks a source) */}
      {selectedEvidence && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel-glow" style={{
            width: '100%',
            maxWidth: '560px',
            maxHeight: '80vh',
            overflowY: 'auto',
            background: '#0d121d',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-contract" style={{ marginBottom: '6px' }}>
                  OFFICIAL COMPANY SOURCE
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  {selectedEvidence.title}
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Ref: {selectedEvidence.source_ref}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                style={{ padding: '6px', background: 'transparent', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: '#cbd5e1',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--font-mono)'
            }}>
              {selectedEvidence.full_content || selectedEvidence.snippet}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setSelectedEvidence(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
