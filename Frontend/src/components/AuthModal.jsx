import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Building,
  UserCheck,
  Scale,
  Lock,
  Mail,
  Key,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Bell,
  Sparkles,
} from 'lucide-react';

export function AuthModal() {
  const {
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginAsRole,
    loginWithCredentials,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'credentials'
  const [email, setEmail] = useState('officer@aicte.gov.in');
  const [password, setPassword] = useState('aicte@officer2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await loginWithCredentials(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg('Invalid institutional credentials. Please try demo accounts.');
    }
  };

  const handleQuickRole = async (roleKey) => {
    setIsSubmitting(true);
    await loginAsRole(roleKey);
    setIsSubmitting(false);
  };

  return (
    <div className="scrutiny-modal-backdrop" role="dialog" aria-modal="true" style={{ zIndex: 9999 }}>
      <div
        className="ingest-modal-window glass-panel"
        style={{
          maxWidth: '680px',
          width: '94%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(10, 22, 40, 0.45)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          background: '#ffffff',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0A1628 0%, #0F2B48 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={26} color="#38BDF8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 700,
                    color: '#F59E0B',
                  }}
                >
                  GOVERNMENT OF INDIA • AICTE
                </span>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38BDF8',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  SSO v2.6
                </span>
              </div>
              <h3 style={{ margin: '3px 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Regulatory Access & Role Authentication
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Active Session Banner */}
          {currentUser && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>{currentUser.avatar}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                    Currently Authenticated as: {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#15803d' }}>
                    {currentUser.roleLabel} • {currentUser.organization}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  border: '1px solid #fca5a5',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '12px',
              marginBottom: '20px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('quick')}
              style={{
                background: activeTab === 'quick' ? '#0f2b48' : '#f1f5f9',
                color: activeTab === 'quick' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <Sparkles size={15} />
              <span>1-Click Role Login (SIH Demo Mode)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              style={{
                background: activeTab === 'credentials' ? '#0f2b48' : '#f1f5f9',
                color: activeTab === 'credentials' ? '#ffffff' : '#475569',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <Key size={15} />
              <span>Standard Password Login</span>
            </button>
          </div>

          {/* TAB 1: 1-CLICK ROLE LOGIN */}
          {activeTab === 'quick' && (
            <div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Select a user persona below to instantly experience the role-specific workspace, tailored permissions, and filtered real-time notification radar:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Role 1: Scrutiny Officer */}
                <div
                  onClick={() => handleQuickRole('OFFICER')}
                  style={{
                    border: currentUser?.role === 'OFFICER' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    background: currentUser?.role === 'OFFICER' ? '#eff6ff' : '#ffffff',
                    padding: '16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                  className="role-card-hover"
                >
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        flexShrink: 0,
                      }}
                    >
                      👔
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f2b48' }}>
                          Dr. Siddhi Patil
                        </span>
                        <span
                          style={{
                            background: '#3b82f6',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                          }}
                        >
                          SCRUTINY OFFICER
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                        Senior Technical Scrutiny Officer • Northern Regional Office (NRO)
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
                        <strong>Permissions:</strong> Tamper/ELA forensic checks, ghost faculty radar, cross-document correlation, and official scrutiny dossier PDF export.
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          🚨 3 Critical Fraud/Vigilance Alerts
                        </span>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          📑 Full Scrutiny Cockpit
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <span>{currentUser?.role === 'OFFICER' ? 'Active' : 'Login'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Role 2: College Principal / Applicant */}
                <div
                  onClick={() => handleQuickRole('INSTITUTION')}
                  style={{
                    border: currentUser?.role === 'INSTITUTION' ? '2px solid #10b981' : '1px solid #e2e8f0',
                    background: currentUser?.role === 'INSTITUTION' ? '#ecfdf5' : '#ffffff',
                    padding: '16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                  className="role-card-hover"
                >
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        background: '#d1fae5',
                        color: '#047857',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        flexShrink: 0,
                      }}
                    >
                      🏛️
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f2b48' }}>
                          Prof. Sanmit Patil
                        </span>
                        <span
                          style={{
                            background: '#10b981',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                          }}
                        >
                          COLLEGE APPLICANT
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                        Principal & Chairman • Apex Institute of Advanced Technology (Bhopal)
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
                        <strong>Permissions:</strong> View institutional approval status, review extracted facts, receive statutory show-cause memos, and upload cure undertakings.
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          ⏳ Memo #DEF-8841 (15-Day Cure Clock)
                        </span>
                        <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          ✅ DigiLocker DPI Land Cleared
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{
                      background: '#10b981',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <span>{currentUser?.role === 'INSTITUTION' ? 'Active' : 'Login'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Role 3: Regional Director / Admin */}
                <div
                  onClick={() => handleQuickRole('DIRECTOR')}
                  style={{
                    border: currentUser?.role === 'DIRECTOR' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                    background: currentUser?.role === 'DIRECTOR' ? '#fffbeb' : '#ffffff',
                    padding: '16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                  className="role-card-hover"
                >
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        background: '#fef3c7',
                        color: '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        flexShrink: 0,
                      }}
                    >
                      ⚖️
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f2b48' }}>
                          Ms. Sneha Gurav, IAS
                        </span>
                        <span
                          style={{
                            background: '#f59e0b',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '999px',
                          }}
                        >
                          REGIONAL DIRECTOR
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                        Regional Director & Member Secretary • AICTE National Headquarters
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
                        <strong>Permissions:</strong> Pan-India governance oversight, Approval Process Handbook (APH) dynamic rule modification, and physical inspection committee sign-offs.
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          🌐 All National Alerts (5 Feed Items)
                        </span>
                        <span style={{ background: '#f3e8ff', color: '#7e22ce', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          ⚙️ Dynamic APH Rule Engine
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{
                      background: '#f59e0b',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <span>{currentUser?.role === 'DIRECTOR' ? 'Active' : 'Login'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL CREDENTIALS LOGIN */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleManualSubmit}>
              {errorMsg && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Institutional Government ID / Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                    placeholder="e.g. officer@aicte.gov.in"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Secure Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                    placeholder="••••••••••••"
                  />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                  Demo passwords: <code>aicte@officer2026</code> (Officer) or <code>apex@principal2026</code> (College)
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAuthModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Lock size={14} />
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In with SSO'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
