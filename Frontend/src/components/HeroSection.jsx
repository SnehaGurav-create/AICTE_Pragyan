import React from 'react';
import { ArrowRight, Layers, FileCheck, CheckCircle2, ShieldCheck, Compass, Sparkles, Building2 } from 'lucide-react';

export function HeroSection({ onExploreClick, onHowItWorksClick }) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-content-wrapper">
          {/* Institutional Badge Strip */}
          <div className="hero-badge-row">
            <span className="badge-institutional">
              <span className="pulse-indicator"></span>
              PRAGYAN • AICTE Scrutiny Engine
            </span>
            <span className="badge-institutional badge-saffron">
              SIH 2026 Design Playground
            </span>
            <span className="badge-institutional">
              APH 2026-27 Codified
            </span>
          </div>

          {/* Headline & Editorial Lead */}
          <h1 id="hero-title" className="hero-headline">
            Trust every document. <br />
            <span className="hero-headline-accent">Verify every detail.</span>
          </h1>

          <p className="hero-description">
            Intelligent pre-scrutiny, document authentication and evidence-linked regulatory
            compliance assistance for technical institution approvals.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions-row">
            <button
              type="button"
              className="btn-primary hero-btn"
              onClick={onExploreClick}
              id="btn-explore-platform"
            >
              <span>Explore the Platform</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="btn-secondary hero-btn"
              onClick={onHowItWorksClick}
              id="btn-see-how-it-works"
            >
              <Layers size={17} />
              <span>See How It Works</span>
            </button>
          </div>

          {/* Live Trust Metric Highlights */}
          <div className="hero-metrics-grid">
            <div className="hero-metric-card">
              <div className="metric-icon-box">
                <ShieldCheck size={20} className="metric-icon" />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">140+</span>
                <span className="metric-label">APH Norm Clauses Codified</span>
              </div>
            </div>

            <div className="hero-metric-card">
              <div className="metric-icon-box">
                <Building2 size={20} className="metric-icon" />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">4-Stage</span>
                <span className="metric-label">Multi-Document Scrutiny</span>
              </div>
            </div>

            <div className="hero-metric-card">
              <div className="metric-icon-box">
                <FileCheck size={20} className="metric-icon" />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">SHA-256</span>
                <span className="metric-label">Evidence-Anchored Audit Trail</span>
              </div>
            </div>

            <div className="hero-metric-card">
              <div className="metric-icon-box">
                <CheckCircle2 size={20} className="metric-icon" />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">100%</span>
                <span className="metric-label">Human Regulatory Authority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
