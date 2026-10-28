import React, { useState, useEffect } from 'react';
import { Sliders, Bell, Menu, X, ArrowUpRight, Lock, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar({ activeSection = 'overview', onNavigate, onNavigateToLogin, reducedMotion, setReducedMotion }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, setIsAuthModalOpen, unreadNotifCount, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', target: '#hero-section' },
    { id: 'workflow', label: '4-Stage Pipeline', target: '#workflow' },
    { id: 'governance', label: 'Statutory Mandate', target: '#governance' },
  ];

  const handleNavClick = (item) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(item.id, item.module);
    }
    const element = document.querySelector(item.target);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <header className={`navbar-sticky-header ${scrolled ? 'navbar-elevated' : ''}`}>
      <div className="container navbar-inner-row">
        {/* Left: Brand Identity with Custom Geometric Document-Check Logo */}
        <a
          href="#hero-section"
          className="navbar-brand-link"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick({ id: 'overview', target: '#hero-section' });
          }}
          aria-label="PRAGYAN-AICTE Homepage"
        >
          <div className="navbar-logo-symbol" aria-hidden="true">
            {/* Custom geometric document-check logo in pure SVG */}
            <svg viewBox="0 0 36 36" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="30" height="30" rx="7" fill="#142B4A" />
              <path
                d="M10 10H22M10 16H26M10 22H18"
                stroke="#8BDCF0"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx="23" cy="23" r="8" fill="#356AE6" />
              <path
                d="M19.5 23L22 25.5L26.5 20.5"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="navbar-brand-meta">
            <div className="navbar-brand-title">
              <span className="brand-main-text">PRAGYAN</span>
              <span className="brand-separator">-</span>
              <span className="brand-aicte-text">AICTE</span>
            </div>
            <span className="navbar-brand-descriptor">Regulation Bureau · Smart Scrutiny</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav-links" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link-btn ${isActive ? 'nav-link-active' : ''}`}
                onClick={() => handleNavClick(item)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{item.label}</span>
                {isActive && <span className="nav-active-indicator" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="navbar-actions-group">
          {currentUser ? (
            <>
              {/* Persona Role Indicator & Switcher Modal Button */}
              <button
                type="button"
                className="navbar-role-pill"
                onClick={() => setIsAuthModalOpen(true)}
                title="Switch User Role or View Assigned Permissions"
                id="navbar-btn-role-switch"
                aria-label="User role profile"
              >
                <span className="role-avatar-icon">{currentUser.avatar || '👔'}</span>
                <span className="role-name-text">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'Officer'}
                </span>
                <span className="role-tag-badge" style={{ background: currentUser.badgeColor || '#0284c7' }}>
                  {currentUser.role === 'INSTITUTION' ? 'Institution' :
                   currentUser.role === 'VERIFICATION_OFFICER' ? 'Verification' :
                   currentUser.role === 'SCRUTINY_OFFICER' || currentUser.role === 'OFFICER' ? 'Scrutiny' :
                   currentUser.role === 'COMPETENT_AUTHORITY' || currentUser.role === 'DIRECTOR' ? 'Approver' :
                   currentUser.role === 'ADMIN' ? 'Admin' : 'Officer'}
                </span>
              </button>

              {/* Sign Out Button */}
              <button
                type="button"
                className="navbar-icon-btn"
                onClick={logout}
                title="Sign Out to Login Gateway"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                aria-label="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onNavigateToLogin ? onNavigateToLogin() : setIsAuthModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Lock size={14} />
              <span>Sign In to Portal</span>
            </button>
          )}

          {/* Real-time Notification Bell */}
          <button
            type="button"
            className="navbar-icon-btn"
            onClick={() => {
              const el = document.getElementById('regulatory-dashboard');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => {
                const drawerBtn = document.getElementById('btn-notifications-drawer');
                if (drawerBtn) drawerBtn.click();
              }, 400);
            }}
            title="Open Notification Feed"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadNotifCount > 0 && (
              <span className="navbar-badge-count">{unreadNotifCount}</span>
            )}
          </button>

          {/* Motion Toggle Button */}
          <button
            type="button"
            className={`navbar-icon-btn motion-btn ${reducedMotion ? 'motion-reduced-active' : ''}`}
            onClick={() => setReducedMotion(!reducedMotion)}
            title={reducedMotion ? 'Motion is reduced (Click to enable animations)' : 'Click to reduce motion'}
            aria-label={reducedMotion ? 'Enable animations' : 'Reduce animations'}
          >
            <Sliders size={15} />
            <span className="motion-btn-text">{reducedMotion ? 'Motion: Off' : 'Motion: On'}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <div className="container mobile-drawer-content">
            <div className="mobile-nav-list" role="menu">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item)}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={15} className="mobile-nav-arrow" />
                  </button>
                );
              })}
            </div>

            <div className="mobile-drawer-bottom">
              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById('regulatory-dashboard');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Launch Scrutiny Cockpit</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
