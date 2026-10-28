import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Building,
  UserCheck,
  FileSearch,
  Scale,
  Settings,
  Cpu
} from 'lucide-react';

const DEMO_PERSONAS = [
  {
    role: 'INSTITUTION',
    title: 'Role 1: Institution User (College Principal)',
    name: 'Prof. Sunita Rao',
    org: 'Apex Institute of Advanced Tech (Bhopal)',
    portalName: 'Institution Self-Service & Cure Desk',
    username: 'principal@apex.edu.in',
    password: 'apex@principal2026',
    icon: Building,
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    description: 'Submits application, uploads docs, responds to deficiencies & tracks status for own college.'
  },
  {
    role: 'VERIFICATION_OFFICER',
    title: 'Role 3: Verification Officer',
    name: 'Er. Vikram Anand',
    org: 'AICTE National Verification Cell / DigiLocker Desk',
    portalName: 'Authority & Issuer Verification Desk',
    username: 'verification@aicte.gov.in',
    password: 'aicte@verif2026',
    icon: UserCheck,
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    description: 'Verifies certificates against DigiLocker, state portals & QR codes. Simulated demo responses.'
  },
  {
    role: 'SCRUTINY_OFFICER',
    title: 'Role 4: AICTE Scrutiny Officer',
    name: 'Dr. Rajesh Verma',
    org: 'Northern Regional Office (NRO), Kanpur / Bhopal',
    portalName: 'Regional Scrutiny & Dossier Evaluation Desk',
    username: 'scrutiny@aicte.gov.in',
    password: 'aicte@scrutiny2026',
    icon: FileSearch,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    description: 'Evaluates dossiers, investigates ghost faculty radar, recommends approval or issues deficiency notice.'
  },
  {
    role: 'COMPETENT_AUTHORITY',
    title: 'Role 5: Competent Authority / Approving Officer',
    name: 'Shri K. M. Subramanian, IAS',
    org: 'AICTE Central Bureau, New Delhi',
    portalName: 'Statutory Approval & LoA/LoR Chamber',
    username: 'approver@aicte.gov.in',
    password: 'aicte@approver2026',
    icon: Scale,
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    description: 'Exclusive statutory authority to grant LoA / LoR or return case. Mandatory legal rationale required.'
  },
  {
    role: 'ADMIN',
    title: 'Role 6: System Administrator',
    name: 'Ms. Neha Sharma',
    org: 'AICTE e-Governance Division, New Delhi',
    portalName: 'Platform Health & Governance Console',
    username: 'admin@aicte.gov.in',
    password: 'aicte@admin2026',
    icon: Settings,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    description: 'Configures rules, monitors AI worker service & audit logs. No regulatory decision authority.'
  }
];

export function RoleLoginPage({ onExplorePublic, onBackToLanding }) {
  const handleBack = onBackToLanding || onExplorePublic;
  const { loginWithCredentials, loginAsRole } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'personas'

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await loginWithCredentials(username, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Authentication failed. Please check your institutional email and password.');
    }
  };

  const handleSelectPersona = (persona) => {
    setUsername(persona.username);
    setPassword(persona.password);
    setErrorMsg(null);
  };

  const handleDirectPersonaLogin = async (persona) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setUsername(persona.username);
    setPassword(persona.password);
    const result = await loginWithCredentials(persona.username, persona.password);
    setIsSubmitting(false);
    if (!result.success) {
      // Fallback to role-based login
      await loginAsRole(persona.role);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #091322 0%, #0F2338 50%, #07172B 100%)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top AICTE Emblem Masthead */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 22, 40, 0.75)',
          backdropFilter: 'blur(12px)',
          padding: '14px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Geometric document-check logo */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #142B4A 0%, #1e40af 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.35)',
              }}
            >
              <ShieldCheck size={26} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Government of India • Ministry of Education
                </span>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  SSO v2.6
                </span>
              </div>
              <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                PRAGYAN-AICTE Central Regulatory & Institutional Access Gateway
              </h1>
            </div>
          </div>

          {handleBack && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span>Back to Main Homepage</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Main Login Workspace */}
      <main
        style={{
          flex: 1,
          maxWidth: '520px',
          width: '100%',
          margin: '0 auto',
          padding: '36px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Left Column: Formal Credentials Login Card */}
        <div
          style={{
            background: 'rgba(15, 28, 48, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ marginBottom: '22px' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Secure Institutional Authentication
            </span>
            <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
              Sign In to Your Role Portal
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Enter your official credentials. The system will authenticate your assigned permissions and load your dedicated portal.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleManualLogin}>
            {/* Username / Email field */}
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  marginBottom: '6px',
                  letterSpacing: '0.01em',
                }}
              >
                Institutional User ID / Official Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  style={{ position: 'absolute', left: '13px', top: '13px', color: '#64748b' }}
                />
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="e.g. principal@apex.edu.in or scrutiny@aicte.gov.in"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '9px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(10, 20, 35, 0.8)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#e2e8f0',
                    letterSpacing: '0.01em',
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  style={{ position: 'absolute', left: '13px', top: '13px', color: '#64748b' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '9px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: 'rgba(10, 20, 35, 0.8)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                transition: 'transform 0.15s, opacity 0.2s',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <Lock size={16} />
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In to Designated Portal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Very small test credentials quick-reference */}
          <div
            style={{
              marginTop: '16px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.67rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Test Credentials Reference
              </span>
              <span style={{ fontSize: '0.62rem', color: '#38bdf8', opacity: 0.8 }}>Click row to fill</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {[
                { label: 'Role 1 (Institution)', u: 'principal@apex.edu.in', p: 'apex@principal2026' },
                { label: 'Role 3 (Verification Officer)', u: 'verification@aicte.gov.in', p: 'aicte@verif2026' },
                { label: 'Role 4 (Scrutiny Officer)', u: 'scrutiny@aicte.gov.in', p: 'aicte@scrutiny2026' },
                { label: 'Role 5 (Competent Authority)', u: 'approver@aicte.gov.in', p: 'aicte@approver2026' },
                { label: 'Role 6 (System Admin)', u: 'admin@aicte.gov.in', p: 'aicte@admin2026' },
              ].map((c) => (
                <div
                  key={c.u}
                  onClick={() => { setUsername(c.u); setPassword(c.p); setErrorMsg(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.66rem',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  title="Click to populate login form"
                >
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{c.label}</span>
                  <span style={{ color: '#64748b', fontFamily: 'monospace' }}>
                    <code style={{ color: '#38bdf8' }}>{c.u}</code> &bull; <code style={{ color: '#94a3b8' }}>{c.p}</code>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Background Autonomous Service Callout */}
          <div
            style={{
              marginTop: '22px',
              padding: '12px 14px',
              borderRadius: '9px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px dashed rgba(99, 102, 241, 0.3)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <Cpu size={18} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.72rem', color: '#c7d2fe', lineHeight: 1.45 }}>
              <strong style={{ color: '#ffffff' }}>Role 2 — AI Validation Engine:</strong> Autonomous system background service worker (<code style={{ color: '#a5b4fc' }}>SVC-AI-ENGINE</code>). Non-human login; automatically executes OCR, CAD layout checks, and biometric overlap flags directly into officer scrutiny queues.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 22, 40, 0.85)',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: '#64748b',
        }}
      >
        <span>PRAGYAN — AICTE Smart Document Validation Platform • National Regulatory RBAC Separation Architecture</span>
      </footer>
    </div>
  );
}
export default RoleLoginPage;

