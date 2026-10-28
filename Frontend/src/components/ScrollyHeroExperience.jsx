import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DocumentCanvas } from './Scene3D/DocumentCanvas';
import {
  ArrowDown,
  ArrowRight,
  Sliders,
  AlertTriangle,
  ScanLine,
  FileText,
  UserCheck,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

// 6 Contextual Regulatory Stages as specified for SIH Problem Statement 26261
const STAGES = [
  { id: '1', name: 'Application and Document Intake', tag: 'STAGE 1 • INTAKE', range: [0.00, 0.18] },
  { id: '2', name: 'OCR and Information Extraction', tag: 'STAGE 2 • EXTRACTION', range: [0.18, 0.38] },
  { id: '3', name: 'Document Integrity & Anomaly Checks', tag: 'STAGE 3 • INTEGRITY', range: [0.38, 0.58] },
  { id: '4', name: 'Issuing-Authority Verification', tag: 'STAGE 4 • AUTHORITY CHECK', range: [0.58, 0.78] },
  { id: '5', name: 'Regulatory Compliance Assessment', tag: 'STAGE 5 • COMPLIANCE', range: [0.78, 0.90] },
  { id: '6', name: 'Evidence-Linked Scrutiny', tag: 'STAGE 6 • SCRUTINY TRANSITION', range: [0.90, 1.00] },
];

export function ScrollyHeroExperience({ reducedMotion, setReducedMotion }) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const { currentUser, setIsAuthModalOpen, unreadNotifCount } = useAuth();

  // Set up GSAP ScrollTrigger for 3D track
  useEffect(() => {
    if (!containerRef.current) return;

    if (reducedMotion) {
      setScrollProgress(0.45);
      setActiveStageIdx(2);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          if (p < 0.18) {
            setActiveStageIdx(0);
          } else if (p < 0.38) {
            setActiveStageIdx(1);
          } else if (p < 0.58) {
            setActiveStageIdx(2);
          } else if (p < 0.78) {
            setActiveStageIdx(3);
          } else if (p < 0.90) {
            setActiveStageIdx(4);
          } else {
            setActiveStageIdx(5);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleStageJump = (idx) => {
    setActiveStageIdx(idx);
    const targetProgress = [0.05, 0.26, 0.48, 0.68, 0.84, 0.95][idx];
    setScrollProgress(targetProgress);

    if (containerRef.current && !reducedMotion) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      const targetY = currentScroll + containerRect.top + targetProgress * (containerRef.current.offsetHeight - window.innerHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentStage = STAGES[activeStageIdx] || STAGES[0];

  // Opacity of Hero Content: fades out smoothly as user scrolls past 0.05
  const heroOpacity = Math.max(0, Math.min(1, (0.16 - scrollProgress) / 0.10));
  const showHeroOverlay = scrollProgress < 0.17;

  // Visibility of Stage HUD and Telemetry
  const showStageHud = scrollProgress >= 0.16 && scrollProgress < 0.92;

  // Visibility of Evidence HUD (Stage 4 & 5)
  const showEvidenceHud = scrollProgress >= 0.62 && scrollProgress < 0.94;

  return (
    <section
      ref={containerRef}
      id="hero-3d-experience"
      className="pinned-3d-experience"
      aria-label="PRAGYAN-AICTE 3D Document Intelligence Experience"
    >
      <div className="pinned-3d-stage">
        {/* Full-Bleed 3D WebGL Canvas */}
        <div className="pinned-canvas-viewport">
          <DocumentCanvas
            scrollProgress={scrollProgress}
            activePhase={activeStageIdx}
            reducedMotion={reducedMotion}
            onSelectPhase={handleStageJump}
          />
        </div>

        {/* 1. OFFICIAL NAVIGATION BAR */}
        <header className="hero-top-nav">
          <div className="container nav-content-inner">
            {/* Brand Logo & Descriptor */}
            <a href="#hero-3d-experience" className="nav-brand-group" aria-label="PRAGYAN-AICTE">
              <div className="nav-brand-emblem">
                <svg viewBox="0 0 32 32" className="nav-emblem-svg" fill="none">
                  <rect x="4" y="4" width="24" height="24" rx="4" fill="#0A1628" />
                  <path d="M9 16L14 21L23 11" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="16" cy="8" r="1.5" fill="#F59E0B" />
                  <circle cx="24" cy="16" r="1.5" fill="#38BDF8" />
                </svg>
              </div>
              <div className="nav-brand-text">
                <div className="nav-brand-title">
                  <span>PRAGYAN-AICTE</span>
                </div>
                <span className="nav-brand-sub">AICTE | Regulation Bureau</span>
              </div>
            </a>

            {/* Official Navigation Links (Anchor Scrolling) */}
            <nav className="nav-official-links" aria-label="Portal Navigation">
              <a
                href="#hero-3d-experience"
                className="official-nav-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('hero-3d-experience'); }}
              >
                Overview
              </a>
              <a
                href="#workflow"
                className="official-nav-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }}
              >
                Verification Workflow
              </a>
              <a
                href="#regulatory-dashboard"
                className="official-nav-link"
                onClick={(e) => { e.preventDefault(); scrollToSection('regulatory-dashboard'); }}
              >
                Dashboard
              </a>
            </nav>

            {/* Navigation Actions */}
            <div className="nav-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Role Auth / Switcher Button */}
              <button
                type="button"
                className="motion-btn"
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  background: currentUser?.role === 'OFFICER' ? '#eff6ff' : (currentUser?.role === 'INSTITUTION' ? '#ecfdf5' : '#fffbeb'),
                  border: `1px solid ${currentUser?.badgeColor || '#cbd5e1'}`,
                  color: '#0f2b48',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  borderRadius: '6px'
                }}
                title="Switch User Role or Authenticate"
                id="btn-header-auth-switch"
              >
                <span>{currentUser ? currentUser.avatar : '🔑'}</span>
                <span>{currentUser ? `${currentUser.name.split(' ')[0]} (${currentUser.role})` : 'Sign In'}</span>
              </button>

              {/* Notification Bell with Badge */}
              <button
                type="button"
                className="motion-btn"
                onClick={() => {
                  scrollToSection('regulatory-dashboard');
                  setTimeout(() => {
                    const drawerBtn = document.getElementById('btn-notifications-drawer');
                    if (drawerBtn) drawerBtn.click();
                  }, 400);
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 10px',
                  cursor: 'pointer'
                }}
                title={`View ${currentUser?.role || ''} Notifications`}
              >
                <Bell size={15} />
                {unreadNotifCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      borderRadius: '999px',
                      padding: '1px 5px',
                      lineHeight: '1.1'
                    }}
                  >
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                className={`motion-btn ${reducedMotion ? 'active' : ''}`}
                onClick={() => setReducedMotion(!reducedMotion)}
                title={reducedMotion ? 'Motion is reduced (Click to enable)' : 'Click to reduce motion'}
                aria-label="Toggle reduced motion"
              >
                <Sliders size={14} />
                <span>{reducedMotion ? 'Motion: Off' : 'Motion: On'}</span>
              </button>

              <button
                type="button"
                className="btn-primary nav-skip-btn"
                onClick={() => scrollToSection('regulatory-dashboard')}
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* 2. INITIAL HERO VIEW OVERLAY (SECTION 2: OFFICIAL CONTENT) */}
        {showHeroOverlay && (
          <div
            className="hero-opening-overlay"
            style={{
              opacity: heroOpacity,
              transform: `translateY(-${scrollProgress * 120}px)`,
              pointerEvents: heroOpacity > 0.3 ? 'auto' : 'none',
            }}
          >
            <div className="container hero-opening-inner">
              <div className="hero-opening-text-col">
                {/* Official Eyebrow */}
                <div className="hero-tag-strip">
                  <span className="badge-institutional">
                    <span className="pulse-dot-cyan" />
                    AICTE REGULATION BUREAU · SIH 2026
                  </span>
                  <span className="badge-institutional badge-saffron">
                    Problem Statement ID: 26261
                  </span>
                </div>
                <h1 className="hero-main-headline">
                  Verify documents. <br />
                  <span className="hero-gradient-text">Validate compliance.</span> <br />
                  Support better scrutiny.
                </h1>

                {/* Supporting Description */}
                <p className="hero-supporting-text">
                  An AI-powered decision-support platform for preliminary validation of technical
                  institution applications, document authentication, discrepancy detection and regulatory compliance review.
                </p>

                {/* Buttons */}
                <div className="hero-btn-row">
                  <button
                    type="button"
                    className="btn-primary hero-cta-btn"
                    onClick={() => scrollToSection('regulatory-dashboard')}
                    id="btn-open-dashboard"
                  >
                    <span>Open Scrutiny Dashboard</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="btn-secondary hero-cta-btn"
                    onClick={() => scrollToSection('workflow')}
                    id="btn-explore-workflow"
                  >
                    <span>Explore Verification Workflow</span>
                    <ArrowDown size={16} />
                  </button>
                </div>

                {/* Supporting Statement & Scroll Prompt */}
                <div className="hero-supporting-note">
                  <span className="supporting-statement-text">
                    Evidence-linked findings. Traceable verification. Human-led regulatory decisions.
                  </span>
                  <div className="hero-scroll-cue">
                    <div className="scroll-mouse-icon">
                      <div className="scroll-wheel" />
                    </div>
                    <span>Scroll to observe 3D document validation sequence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. STAGE TELEMETRY & PHASE SCRUBBER OVERLAY (CONTEXTUAL STAGE LABELS) */}
        {showStageHud && (
          <div className="stage-telemetry-overlay">
            <div className="container stage-telemetry-inner">
              <div className="telemetry-hud-card glass-panel">
                <div className="telemetry-header-row">
                  <div className="telemetry-badge-group">
                    <span className="badge-institutional">
                      <ScanLine size={13} />
                      {currentStage.tag}
                    </span>
                    <h3 className="telemetry-stage-name">{currentStage.name}</h3>
                  </div>

                  {/* Stage Scrubber Pills */}
                  <div className="stage-scrubber-pills" role="tablist">
                    {STAGES.map((s, idx) => {
                      const isActive = activeStageIdx === idx;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          className={`stage-pill ${isActive ? 'active' : ''}`}
                          onClick={() => handleStageJump(idx)}
                        >
                          <span className="stage-pill-letter">{s.id}</span>
                          <span className="stage-pill-name">{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stage Explanatory Caption */}
                <div className="telemetry-caption-row">
                  {activeStageIdx === 0 && (
                    <p className="telemetry-desc">
                      <strong>Application and Document Intake:</strong> Centralized ingestion of applicant institution files
                      including land deeds, fire NOCs, faculty registers, and bank FDR receipts.
                    </p>
                  )}
                  {activeStageIdx === 1 && (
                    <p className="telemetry-desc">
                      <strong>OCR and Information Extraction:</strong> Deep optical layout analysis extracts coordinates,
                      table structures, sub-registrar stamps, and clauses without structural distortion.
                    </p>
                  )}
                  {activeStageIdx === 2 && (
                    <p className="telemetry-desc text-danger-highlight">
                      <strong>Document Integrity and Anomaly Checks:</strong> Cross-document verification flags potential
                      discrepancies between submitted faculty rolls and cadre requirements.
                    </p>
                  )}
                  {activeStageIdx === 3 && (
                    <p className="telemetry-desc">
                      <strong>Issuing-Authority Verification:</strong> Verifies reference numbers and validity dates against
                      authorized municipal, university, and financial records.
                    </p>
                  )}
                  {activeStageIdx === 4 && (
                    <p className="telemetry-desc">
                      <strong>Regulatory Compliance Assessment:</strong> Codified algorithmic checks evaluate parameters
                      against AICTE Approval Process Handbook (APH 2026-27) clauses.
                    </p>
                  )}
                  {activeStageIdx === 5 && (
                    <p className="telemetry-desc text-success-highlight">
                      <strong>Evidence-Linked Scrutiny:</strong> Compiles verified findings with exact citations for review
                      by authorized AICTE Scrutiny Committees.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. EVIDENCE SUMMARY PANEL HUD (STAGE 4 & 5) */}
        {showEvidenceHud && (
          <div className="evidence-hud-overlay">
            <div className="container">
              <div className="evidence-hud-card glass-panel">
                <div className="evidence-hud-header">
                  <div className="hud-title-group">
                    <span className="badge-institutional badge-saffron">
                      Demo Scrutiny Record
                    </span>
                    <h4 className="hud-inst-name">Apex Institute of Advanced Technology</h4>
                    <span className="hud-case-ref">ID: AICTE-2026-NRO-8841</span>
                  </div>
                  <span className="badge-status deficiency">
                    <AlertTriangle size={13} /> Review Required (Cadre)
                  </span>
                </div>

                <div className="evidence-metrics-grid">
                  <div className="evidence-metric-box">
                    <span className="ev-metric-label">Verified Checks</span>
                    <span className="ev-metric-val text-green">144 Rules Met</span>
                  </div>
                  <div className="evidence-metric-box">
                    <span className="ev-metric-label">Review Required</span>
                    <span className="ev-metric-val text-red">1 Clause (Cadre)</span>
                  </div>
                  <div className="evidence-metric-box">
                    <span className="ev-metric-label">Authority Source</span>
                    <span className="ev-metric-val">Simulated Demo Source</span>
                  </div>
                </div>

                <div className="evidence-citation-box">
                  <FileText size={14} className="text-blue" />
                  <span>Evidence: Faculty Register Page 4 vs AICTE APH Chapter VII Table 7.1</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. BOTTOM PROGRESS BAR */}
        <div className="pinned-bottom-progress-track">
          <div
            className="pinned-bottom-progress-bar"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
