import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronDown,
  Minimize2,
  Maximize2,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { sendAiChatMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const QUICK_PROMPTS = [
  'How do I upload EoA document?',
  'Explain the 4-Stage Approval Workflow',
  'What is the Cadre Ratio norm (Table 7.1)?',
  'How to respond to a Deficiency Memo?',
  'What is ELA Tamper & Anomaly Detection?',
  'What are the 5 test logins?'
];

export function AiChatbot({ activeModule = 'overview' }) {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am **PRAGYAN AI Assistant**, your official AI regulatory advisor powered by **Google Gemini**.

How can I assist you with your AICTE approval, document submission, or compliance checks today?`,
      source: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await sendAiChatMessage({
        message: text,
        role: currentUser?.role || 'PUBLIC',
        context: {
          activeModule,
          institutionId: currentUser?.institutionId || 'AICTE-2026-NRO-8841',
          userName: currentUser?.name || 'Guest User'
        }
      });

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply || 'I could not process your query. Please try again.',
        source: res.source || 'gemini-3.8-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'An error occurred while contacting the AI Engine. Please check your network connectivity.',
          source: 'error',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'Chat history cleared. How else may I assist you with your AICTE regulatory processes?',
        source: 'gemini-3.8-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Simple Markdown parser for clean bullets, bold, and code snippets
  const renderFormattedText = (raw) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ margin: '8px 0 4px 0', fontSize: '0.86rem', fontWeight: 800, color: '#38bdf8' }}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullets
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        return (
          <div key={idx} style={{ display: 'flex', gap: '6px', margin: '3px 0', fontSize: '0.78rem', lineHeight: 1.45 }}>
            <span style={{ color: '#38bdf8' }}>•</span>
            <div>{renderInline(itemText)}</div>
          </div>
        );
      }
      // Numbered list
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} style={{ display: 'flex', gap: '6px', margin: '3px 0', fontSize: '0.78rem', lineHeight: 1.45 }}>
            <span style={{ color: '#f59e0b', fontWeight: 700, minWidth: '16px' }}>{numMatch[1]}.</span>
            <div>{renderInline(numMatch[2])}</div>
          </div>
        );
      }
      // Regular paragraph
      if (!line.trim()) {
        return <div key={idx} style={{ height: '6px' }} />;
      }
      return (
        <p key={idx} style={{ margin: '4px 0', fontSize: '0.78rem', lineHeight: 1.45 }}>
          {renderInline(line)}
        </p>
      );
    });
  };

  const renderInline = (str) => {
    // Basic bold and code handling
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#ffffff', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} style={{ background: 'rgba(255,255,255,0.12)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'monospace' }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
      className="pragyan-ai-chatbot-root"
    >
      {/* 1. FLOATING CHAT WINDOW */}
      {isOpen && (
        <div
          style={{
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: isMinimized ? '54px' : '560px',
            maxHeight: 'calc(100vh - 100px)',
            background: 'linear-gradient(180deg, #0c1b30 0%, #071322 100%)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '16px',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.65), 0 0 16px rgba(56, 189, 248, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            marginBottom: '12px',
            transition: 'height 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(15, 28, 48, 0.95)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
                }}
              >
                <Bot size={19} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#ffffff' }}>
                    PRAGYAN AI Assistant
                  </span>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                    Gemini Live
                  </span>
                </div>
                <span style={{ fontSize: '0.67rem', color: '#94a3b8' }}>
                  Official AICTE Regulatory Advisory Bot
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={handleClearHistory}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '5px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Clear conversation"
              >
                <Trash2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '5px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '5px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Close chatbot"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Pill */}
              <div
                style={{
                  padding: '6px 14px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
                  fontSize: '0.68rem',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>
                  Context: <strong style={{ color: '#38bdf8' }}>{currentUser ? currentUser.roleLabel : 'Public Visitor'}</strong>
                </span>
                <span style={{ color: '#64748b' }}>SIH-26261</span>
              </div>

              {/* Message Thread */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '86%',
                          padding: '10px 14px',
                          borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: isUser
                            ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                            : 'rgba(255, 255, 255, 0.06)',
                          border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#f8fafc',
                          boxShadow: isUser
                            ? '0 4px 12px rgba(37, 99, 235, 0.3)'
                            : '0 4px 12px rgba(0, 0, 0, 0.25)',
                        }}
                      >
                        {isUser ? (
                          <div style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>{m.text}</div>
                        ) : (
                          <div>{renderFormattedText(m.text)}</div>
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '3px',
                          padding: '0 4px',
                          fontSize: '0.62rem',
                          color: '#64748b',
                        }}
                      >
                        <span>{m.timestamp}</span>
                        {!isUser && m.source && (
                          <>
                            <span>•</span>
                            <span style={{ color: m.source.includes('gemini') ? '#38bdf8' : '#a5b4fc' }}>
                              {m.source.includes('gemini') ? '✨ Gemini AI' : '🏛️ AICTE Knowledge Engine'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isLoading && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px 14px 14px 2px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block', animation: 'bounce 1s infinite 0ms' }} />
                      <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block', animation: 'bounce 1s infinite 200ms' }} />
                      <span className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block', animation: 'bounce 1s infinite 400ms' }} />
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '6px' }}>Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts (Suggested Questions) */}
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(10, 20, 35, 0.7)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                }}
              >
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.67rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                      e.currentTarget.style.borderColor = '#38bdf8';
                      e.currentTarget.style.color = '#38bdf8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.color = '#cbd5e1';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(15, 28, 48, 0.95)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask any question or issue..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: 'rgba(10, 20, 35, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  style={{
                    background: inputMessage.trim() && !isLoading
                      ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.2s',
                    opacity: inputMessage.trim() && !isLoading ? 1 : 0.5,
                  }}
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              </form>

              {/* Statutory Note */}
              <div
                style={{
                  padding: '4px 12px 6px 12px',
                  background: 'rgba(7, 19, 34, 0.95)',
                  fontSize: '0.6rem',
                  color: '#64748b',
                  textAlign: 'center',
                }}
              >
                Advisory assistance only. Regulatory approvals granted exclusively by Competent Authority.
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. NON-STATIC ANIMATED FLOATING LAUNCHER BUTTON */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (isMinimized) setIsMinimized(false);
        }}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.5), 0 0 16px rgba(56, 189, 248, 0.4)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 99, 235, 0.65), 0 0 24px rgba(56, 189, 248, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.5), 0 0 16px rgba(56, 189, 248, 0.4)';
        }}
        aria-label="Open PRAGYAN AI Chatbot"
        title="Ask PRAGYAN AI (Powered by Gemini)"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            {/* Pulsing halo */}
            <span
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid #38bdf8',
                opacity: 0.6,
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
            <Bot size={28} />
            {/* Sparkle badge */}
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #071322',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={10} color="#ffffff" />
            </span>
          </>
        )}
      </button>
    </div>
  );
}

export default AiChatbot;

