import React from 'react';
import { ArrowRight, ArrowDown, CheckCircle2, ShieldCheck, FileCheck, Building2, Lock } from 'lucide-react';
import { DocumentIntelligenceIllustration } from './DocumentIntelligenceIllustration';
import { AnimatedCounter } from './AnimatedCounter';

export function HeroSection({ onOpenDashboard, onExploreWorkflow, reducedMotion = false }) {
  return (
    <section id="hero-section" className="hero-section-2d" aria-labelledby="hero-main-title">
      <div className="container hero-container-grid">
        {/* Left Column: Editorial & Brand Positioning */}
        <div className="hero-editorial-col">
          {/* Official Bureau Eyebrow */}
          <div className="hero-eyebrow-badge">
            <span className="pulse-dot-cyan" />
            <span className="eyebrow-text">AICTE · REGULATION BUREAU · SIH 2026</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 id="hero-main-title" className="hero-editorial-headline">
            Bring clarity to <br />
            <span className="headline-highlight">every application.</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="hero-supporting-lead">
            Intelligent document validation, verification and regulatory compliance assistance for technical institution approvals.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-primary hero-btn-main"
              onClick={onOpenDashboard}
              id="btn-open-scrutiny-dashboard"
              aria-label="Sign In to Role Portal"
            >
              <Lock size={16} className="btn-icon" />
              <span>Sign In to Role Portal</span>
              <ArrowRight size={17} className="btn-icon" />
            </button>

            <button
              type="button"
              className="btn-secondary hero-btn-secondary"
              onClick={onExploreWorkflow}
              id="btn-explore-workflow-link"
              aria-label="Explore the Workflow"
            >
              <span>Explore the Workflow</span>
              <ArrowDown size={16} className="btn-icon" />
            </button>
          </div>

          {/* Three Concise Principles */}
          <div className="hero-principles-row" role="list" aria-label="Core Scrutiny Principles">
            <div className="principle-item" role="listitem">
              <div className="principle-icon-dot">
                <CheckCircle2 size={15} className="principle-check" />
              </div>
              <span className="principle-label">Evidence-linked findings</span>
            </div>

            <div className="principle-item" role="listitem">
              <div className="principle-icon-dot">
                <ShieldCheck size={15} className="principle-check" />
              </div>
              <span className="principle-label">Traceable verification</span>
            </div>

            <div className="principle-item" role="listitem">
              <div className="principle-icon-dot">
                <FileCheck size={15} className="principle-check" />
              </div>
              <span className="principle-label">Human-led decisions</span>
            </div>
          </div>

          {/* Live Trust Metric Cards with Animated Counters */}
          <div className="hero-metrics-grid" role="region" aria-label="Key Scrutiny Metrics">
            <div className="hero-metric-card kpi-animate-card" style={{ animationDelay: '0ms' }}>
              <div className="metric-icon-box">
                <ShieldCheck size={18} />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">
                  <AnimatedCounter value="140+" delay={0} duration={850} reducedMotion={reducedMotion} />
                </span>
                <span className="metric-label">APH Norm Clauses</span>
              </div>
            </div>

            <div className="hero-metric-card kpi-animate-card" style={{ animationDelay: '90ms' }}>
              <div className="metric-icon-box">
                <Building2 size={18} />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">
                  <AnimatedCounter value="4-Stage" delay={90} duration={750} reducedMotion={reducedMotion} />
                </span>
                <span className="metric-label">Scrutiny Protocol</span>
              </div>
            </div>

            <div className="hero-metric-card kpi-animate-card" style={{ animationDelay: '180ms' }}>
              <div className="metric-icon-box">
                <FileCheck size={18} />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">SHA-256</span>
                <span className="metric-label">Audit Trail Anchors</span>
              </div>
            </div>

            <div className="hero-metric-card kpi-animate-card" style={{ animationDelay: '270ms' }}>
              <div className="metric-icon-box">
                <CheckCircle2 size={18} />
              </div>
              <div className="metric-text-group">
                <span className="metric-val">
                  <AnimatedCounter value="100%" delay={270} duration={950} reducedMotion={reducedMotion} />
                </span>
                <span className="metric-label">Human Authority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 2D Document-Intelligence Motion Illustration */}
        <div className="hero-illustration-col" aria-hidden="true">
          <DocumentIntelligenceIllustration reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
}
