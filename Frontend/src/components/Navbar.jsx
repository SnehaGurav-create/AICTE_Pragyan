import React, { useState } from 'react';
import { Shield, Sparkles, Sliders, Menu, X, ArrowUpRight, Compass } from 'lucide-react';

export function Navbar({ reducedMotion, setReducedMotion }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '3D Scene', href: '#inspection-scene' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Scrutiny Cockpit', href: '#scrutiny-cockpit' },
    { label: 'Governance', href: '#governance' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar-container" aria-label="Main Navigation">
          {/* Brand Identity */}
          <a href="#" className="brand-group" aria-label="PRAGYAN-AICTE Home">
            <div className="brand-emblem-box">
              <svg viewBox="0 0 40 40" className="brand-emblem-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Institutional Heraldic Geometry */}
                <circle cx="20" cy="20" r="18" stroke="#0A1628" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.3" />
                <rect x="8" y="8" width="24" height="24" rx="4" fill="#0A1628" />
                <path d="M14 20L18 24L26 15" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="11" r="1.5" fill="#F59E0B" />
                <circle cx="29" cy="20" r="1.5" fill="#38BDF8" />
                <circle cx="11" cy="20" r="1.5" fill="#38BDF8" />
                <circle cx="20" cy="29" r="1.5" fill="#10B981" />
              </svg>
            </div>
            <div className="brand-meta">
              <div className="brand-title-row">
                <span className="brand-name">PRAGYAN</span>
                <span className="brand-badge">AICTE</span>
              </div>
              <span className="brand-tagline">Regulatory Pre-Scrutiny Intelligence</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="nav-desktop-links" role="menubar">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions & Utilities */}
          <div className="nav-actions">
            {/* Reduced motion button */}
            <button
              type="button"
              className={`motion-toggle-btn ${reducedMotion ? 'active' : ''}`}
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-label={reducedMotion ? 'Enable smooth animations' : 'Reduce animations'}
              title={reducedMotion ? 'Motion is reduced (Click to enable normal motion)' : 'Click to reduce motion'}
            >
              <Sliders size={15} />
              <span className="motion-label">{reducedMotion ? 'Motion: Off' : 'Motion: On'}</span>
            </button>

            {/* Launch Demo CTA */}
            <a
              href="#scrutiny-cockpit"
              className="btn-primary nav-cta-btn"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#scrutiny-cockpit');
              }}
            >
              <span>Explore Cockpit</span>
              <ArrowUpRight size={15} />
            </a>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="container mobile-drawer-inner">
            <div className="mobile-links-list">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="mobile-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mobile-drawer-footer">
              <a
                href="#scrutiny-cockpit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#scrutiny-cockpit');
                }}
              >
                <span>Launch Scrutiny Cockpit</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
