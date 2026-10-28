import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleLoginPage } from './components/RoleLoginPage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WorkflowSection } from './components/WorkflowSection';
import { RegulatoryDashboard } from './components/RegulatoryDashboard/RegulatoryDashboard';
import { GovernanceNotice } from './components/GovernanceNotice';
import { Footer } from './components/Footer';
import { AiChatbot } from './components/AiChatbot';
import { LogOut, ChevronDown, X, Mail, Shield, Building } from 'lucide-react';
import './App.css';

function MainApp() {
  const { currentUser, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [dashboardActiveModule, setDashboardActiveModule] = useState('overview');
  // showLogin defaults to false: MAIN LANDING PAGE displays initially on running!
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // =========================================================================
  // SCENARIO 1: NOT LOGGED IN
  // When running the app, the MAIN LANDING PAGE displays first (NOT login page).
  // The roles dashboard is strictly NOT rendered on this landing page!
  // =========================================================================
  if (!currentUser) {
    if (showLogin) {
      // Dedicated Institutional Role Login Gateway
      return (
        <>
          <RoleLoginPage
            onBackToLanding={() => setShowLogin(false)}
            onExplorePublic={() => setShowLogin(false)}
          />
          <AiChatbot activeModule="login" />
        </>
      );
    }

    // MAIN LANDING PAGE (DEFAULT ON LAUNCH)
    return (
      <div className={`app-root ${reducedMotion ? 'reduced-motion-mode' : ''}`}>
        <Navbar
          activeSection="overview"
          onNavigate={(id) => {
            const el = document.getElementById(id === 'overview' ? 'hero-section' : id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onNavigateToLogin={() => setShowLogin(true)}
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
        />

        <HeroSection
          onOpenDashboard={() => setShowLogin(true)}
          onExploreWorkflow={() => {
            const el = document.getElementById('workflow');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          reducedMotion={reducedMotion}
        />

        <WorkflowSection />
        <GovernanceNotice />
        <Footer />
        <AiChatbot activeModule="landing" />
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 2: LOGGED IN AS A SPECIFIC ROLE
  // Landing page is NOT shown. User sees ONLY their role's dashboard & portal!
  // Role switcher section removed: only role details, portal title, and Logout.
  // =========================================================================
  return (
    <div className={`app-root ${reducedMotion ? 'reduced-motion-mode' : ''}`}>
      {/* DEDICATED ROLE PORTAL TOPBAR */}
      <header
        style={{
          background: '#0a1628',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Left: Brand & Particular Role Portal Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: currentUser.badgeColor || '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {currentUser.avatar}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#f59e0b',
                  }}
                >
                  AICTE REGULATORY BUREAU • PRAGYAN
                </span>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {currentUser.role === 'INSTITUTION' ? 'ROLE 1 • INSTITUTION PORTAL' :
                   currentUser.role === 'VERIFICATION_OFFICER' ? 'ROLE 3 • VERIFICATION DESK' :
                   currentUser.role === 'SCRUTINY_OFFICER' || currentUser.role === 'OFFICER' ? 'ROLE 4 • REGIONAL SCRUTINY DIRECTORATE' :
                   currentUser.role === 'COMPETENT_AUTHORITY' || currentUser.role === 'DIRECTOR' ? 'ROLE 5 • STATUTORY APPROVAL CHAMBER' :
                   'ROLE 6 • SYSTEM GOVERNANCE CONSOLE'}
                </span>
              </div>
              <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                {currentUser.role === 'INSTITUTION' ? 'Apex Institute Applicant Portal (AICTE-2026-NRO-8841)' :
                 currentUser.role === 'VERIFICATION_OFFICER' ? 'National Verification Cell & Authority Desk' :
                 currentUser.role === 'SCRUTINY_OFFICER' || currentUser.role === 'OFFICER' ? 'Regional Technical Scrutiny & Dossier Evaluation Directorate' :
                 currentUser.role === 'COMPETENT_AUTHORITY' || currentUser.role === 'DIRECTOR' ? 'Statutory Approval Chamber • Competent Authority Portal' :
                 'AICTE Platform Health & Rules Governance Console'}
              </h1>
            </div>
          </div>

          {/* Right: Authenticated User Profile (Clickable) & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
                background: profileOpen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: profileOpen ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s',
              }}
              title="Click to view officer profile details"
              role="button"
              tabIndex={0}
            >
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {currentUser.designation} • {currentUser.organization ? currentUser.organization.split(',')[0] : ''}
                </span>
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: profileOpen ? '#38bdf8' : '#94a3b8',
                  transform: profileOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => {
                logout();
                setShowLogin(false);
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              title="Sign Out to Main Landing Page"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>

            {/* Small Profile Information Popover */}
            {profileOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '320px',
                  background: '#0d1d33',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '12px',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.55)',
                  padding: '16px',
                  zIndex: 250,
                  color: '#ffffff',
                }}
              >
                {/* Popover Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: currentUser.badgeColor || '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                      }}
                    >
                      {currentUser.avatar || '👤'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff' }}>
                        {currentUser.name}
                      </div>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        {currentUser.roleLabel || currentUser.role}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    title="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Profile Details List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Mail size={13} style={{ color: '#38bdf8', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <span style={{ color: '#94a3b8', fontSize: '0.67rem', display: 'block' }}>Official Email</span>
                      <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{currentUser.username}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Shield size={13} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <span style={{ color: '#94a3b8', fontSize: '0.67rem', display: 'block' }}>Account / Officer ID</span>
                      <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                        {currentUser.id || currentUser.institutionId || 'USR-2026'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Building size={13} style={{ color: '#f59e0b', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <span style={{ color: '#94a3b8', fontSize: '0.67rem', display: 'block' }}>Designation & Bureau</span>
                      <span style={{ color: '#e2e8f0' }}>{currentUser.designation}</span>
                      <div style={{ color: '#94a3b8', fontSize: '0.69rem', marginTop: '1px' }}>
                        {currentUser.organization}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '4px',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#10b981',
                          display: 'inline-block',
                        }}
                      ></span>
                      Session Active
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
                      RBAC Tier: {currentUser.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* DEDICATED ROLE DASHBOARD (FULL VIEW - NO LANDING PAGE ELEMENTS) */}
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        <RegulatoryDashboard
          activeModule={dashboardActiveModule}
          onModuleChange={setDashboardActiveModule}
          reducedMotion={reducedMotion}
        />
      </main>

      {/* Floating AI Chatbot Assistant (Bottom Right) */}
      <AiChatbot activeModule={dashboardActiveModule} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
