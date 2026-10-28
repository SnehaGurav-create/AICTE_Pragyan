import React from 'react';
import { ArrowUp, Building2, ShieldCheck, Scale } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrapper" aria-label="Portal Footer">
      <div className="container">
        {/* Main Footer Row */}
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand-badge">
              <span className="footer-brand-title">PRAGYAN-AICTE</span>
              <span className="footer-brand-pill">Regulation Bureau</span>
            </div>
            <p className="footer-brand-desc">
              AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification.
              Developed for the Smart India Hackathon 2026 under Problem Statement ID 26261 (Theme: Smart Automation).
            </p>
            <div className="footer-meta-tags">
              <span className="footer-tag">AICTE Act 1987 Aligned</span>
              <span className="footer-tag">Decision Support System</span>
              <span className="footer-tag">SIH 2026 Prototype</span>
            </div>
          </div>

          <div className="footer-nav-col">
            <h5 className="footer-col-title">Navigation</h5>
            <ul className="footer-links-list">
              <li><a href="#hero-3d-experience">Home</a></li>
              <li><a href="#workflow">Application Validation</a></li>
              <li><a href="#regulatory-dashboard">Document Verification</a></li>
              <li><a href="#regulatory-dashboard">Compliance Review</a></li>
              <li><a href="#regulatory-dashboard">Dashboard</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h5 className="footer-col-title">Statutory Framework</h5>
            <ul className="footer-links-list">
              <li><span>AICTE Act No. 52 of 1987</span></li>
              <li><span>Approval Process Handbook (APH)</span></li>
              <li><span>National Building Code (NBC 2016)</span></li>
              <li><span>7th CPC Faculty Cadre Norms</span></li>
            </ul>
          </div>

          <div className="footer-action-col">
            <button
              type="button"
              className="btn-secondary back-to-top-btn"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <ArrowUp size={15} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="footer-bottom-bar">
          <p className="disclaimer-text">
            <strong>DISCLAIMER & STATUTORY NOTICE:</strong> This application is a standalone academic research prototype
            developed for Smart India Hackathon (SIH 2026) Problem Statement 26261. It does not represent an official Government
            of India or live AICTE regulatory portal. All application records, institution names, and reference numbers demonstrated
            are synthetic demo data. In accordance with the AICTE Act 1987, AI outputs provide preliminary decision support only;
            competent AICTE authorities retain sole statutory determinism for all regulatory decisions.
          </p>
          <div className="copyright-row">
            <span>PRAGYAN-AICTE • SIH 2026 Innovation Prototype (Problem Statement ID: 26261)</span>
            <span>All India Council for Technical Education (Regulation Bureau)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
