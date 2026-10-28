import React, { useState, useEffect } from 'react';

export function DocumentIntelligenceIllustration({ reducedMotion = false }) {
  const [activeStep, setActiveStep] = useState(0);

  const verificationStages = [
    { text: "Ingesting Institutional Application...", code: "STAGE 01/04", status: "PROCESSING" },
    { text: "Extracting Layout & Cadastral Bounds...", code: "STAGE 02/04", status: "ANALYZING" },
    { text: "Cross-Checking Issuing Authorities...", code: "STAGE 03/04", status: "VERIFYING" },
    { text: "Synthesizing Evidence-Linked Findings...", code: "STAGE 04/04", status: "COMPLETE" }
  ];

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % verificationStages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const currentStage = verificationStages[activeStep];

  return (
    <div className="doc-intel-canvas" aria-label="2D Document Intelligence Animation">
      {/* Background Ambient Glow & Architectural Grid */}
      <div className="doc-intel-ambient-bg" />

      {/* Layer 1: Background Offset Document (Land & Infrastructure NOC) */}
      <div className="doc-sheet doc-sheet-back">
        <div className="doc-sheet-inner">
          <div className="doc-sheet-header-strip">
            <div className="doc-mini-badge">MUNICIPAL & REVENUE ARCHIVE</div>
            <div className="doc-ref-text">REF: REG-2022/MP-BPL-88192</div>
          </div>
          {/* Cadastral Blueprint Lines */}
          <div className="doc-cadastral-grid">
            <svg viewBox="0 0 200 100" className="doc-blueprint-svg" fill="none">
              <path d="M10 20 L90 20 L110 50 L180 50 L180 85 L10 85 Z" stroke="#356AE6" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
              <rect x="25" y="32" width="55" height="40" rx="3" fill="#EAF1FF" stroke="#356AE6" strokeWidth="1" opacity="0.6" />
              <text x="32" y="55" fill="#356AE6" fontSize="7" fontWeight="700" fontFamily="monospace">PLOT 412/1</text>
              <circle cx="110" cy="50" r="3" fill="#17835D" />
              <text x="118" y="53" fill="#17835D" fontSize="6" fontWeight="600">8.24 ACRES</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Layer 2: Main Primary Document (AICTE Application Dossier) */}
      <div className="doc-sheet doc-sheet-main">
        {/* Animated Scanning Laser Line */}
        {!reducedMotion && (
          <div className="doc-scanning-laser">
            <div className="doc-laser-beam" />
            <div className="doc-laser-glow" />
          </div>
        )}

        {/* Sheet Content */}
        <div className="doc-sheet-inner">
          {/* Document Top Meta */}
          <div className="doc-main-header">
            <div className="doc-emblem-seal">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="4" fill="#142B4A" />
                <path d="M7 12L10 15L17 8" stroke="#8BDCF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="doc-header-text">
              <span className="doc-category-eyebrow">AICTE REGULATION BUREAU · SCRUTINY DOSSIER</span>
              <h4 className="doc-title-line">Application ID: AICTE-2026-NRO-8841</h4>
            </div>
            <div className="doc-barcode-col">
              <div className="doc-barcode-strip" />
              <span className="doc-barcode-num">APH 2026-27</span>
            </div>
          </div>

          <div className="doc-divider-hairline" />

          {/* Section 1: Institution Details */}
          <div className="doc-field-group">
            <div className="doc-field-row">
              <span className="doc-field-label">INSTITUTION:</span>
              <span className="doc-field-val">Apex Institute of Advanced Technology & Research</span>
            </div>
            <div className="doc-field-row">
              <span className="doc-field-label">CATEGORY:</span>
              <span className="doc-field-val">Extension of Approval (EoA) • Autonomous</span>
            </div>
          </div>

          {/* Section 2: Structured Document Data Rows with Connected Verification Nodes */}
          <div className="doc-table-section">
            <div className="doc-table-heading">VALIDATION PARAMETERS & CITATIONS</div>

            {/* Row 1: Land Contiguity */}
            <div className="doc-data-row verified-row">
              <div className="doc-node-anchor">
                <span className="node-pulse node-success" />
                <span className="node-icon">✓</span>
              </div>
              <div className="doc-data-content">
                <div className="doc-param-name">Land Contiguity Norm (Clause 2.4.1)</div>
                <div className="doc-param-meta">Registered Deed #REG-2022/MP-BPL-88192 · Single Parcel</div>
              </div>
              <span className="doc-status-tag tag-verified">Verified</span>
            </div>

            {/* Row 2: Fire Safety NOC */}
            <div className="doc-data-row verified-row">
              <div className="doc-node-anchor">
                <span className="node-pulse node-success" />
                <span className="node-icon">✓</span>
              </div>
              <div className="doc-data-content">
                <div className="doc-param-name">NBC 2016 Fire Safety Clearance</div>
                <div className="doc-param-meta">NOC #NOC/FIRE/2025/BPL-491 · Valid through Dec 2027</div>
              </div>
              <span className="doc-status-tag tag-verified">Valid</span>
            </div>

            {/* Row 3: Faculty Cadre Ratio */}
            <div className="doc-data-row warning-row">
              <div className="doc-node-anchor">
                <span className="node-pulse node-warning" />
                <span className="node-icon">!</span>
              </div>
              <div className="doc-data-content">
                <div className="doc-param-name">Faculty Cadre Distribution (Table 7.1)</div>
                <div className="doc-param-meta">CSE Dept: 1 Prof, 3 Assoc, 15 Asst (Deficit: 1 Prof)</div>
              </div>
              <span className="doc-status-tag tag-warning">Observation</span>
            </div>
          </div>

          {/* Connected SVG lines connecting verification nodes */}
          <svg className="doc-connection-lines-svg" viewBox="0 0 340 180" fill="none">
            <path
              d="M 22 55 L 22 105 L 22 155"
              stroke="#356AE6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className={reducedMotion ? '' : 'animated-stroke-dash'}
              opacity="0.6"
            />
          </svg>

          {/* Bottom Verification Hash Footprint */}
          <div className="doc-footer-meta">
            <span className="doc-hash-text">SHA-256: e8b2...9f4a · Evidence Anchored</span>
            <span className="doc-pages-text">Page 1 of 4 (Interactive Preview)</span>
          </div>
        </div>
      </div>

      {/* Layer 3: Floating Shield-Check Badge (Top Right) */}
      <div className="doc-floating-shield glass-surface">
        <div className="shield-icon-wrapper">
          <svg viewBox="0 0 36 36" width="32" height="32" fill="none">
            <circle cx="18" cy="18" r="16" fill="#EAF1FF" />
            <path
              d="M18 6L28 10V18C28 23.5 23.7 28.5 18 30C12.3 28.5 8 23.5 8 18V10L18 6Z"
              fill="#FFFFFF"
              stroke="#356AE6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M14 18L17 21L23 15"
              stroke="#17835D"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="shield-text">
          <span className="shield-title">Evidence-Anchored</span>
          <span className="shield-sub">Zero Hallucination</span>
        </div>
      </div>

      {/* Layer 4: Floating Verification Telemetry Panel (Bottom Right) */}
      <div className="doc-floating-telemetry glass-surface">
        <div className="telemetry-top">
          <div className="telemetry-activity-dot">
            <span className="pulse-cyan" />
            <span className="telemetry-stage-code">{currentStage.code}</span>
          </div>
          <span className="telemetry-status-pill">{currentStage.status}</span>
        </div>

        <p className="telemetry-activity-text">{currentStage.text}</p>

        {/* Small animated verification checklist */}
        <div className="telemetry-checklist">
          <div className="telemetry-check-item">
            <svg viewBox="0 0 16 16" width="14" height="14" className="check-svg success-color">
              <circle cx="8" cy="8" r="7" fill="#E7F6F0" />
              <path d="M5 8L7 10L11 6" stroke="#17835D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>8.24 Acres Contiguous Land Deed</span>
          </div>
          <div className="telemetry-check-item">
            <svg viewBox="0 0 16 16" width="14" height="14" className="check-svg success-color">
              <circle cx="8" cy="8" r="7" fill="#E7F6F0" />
              <path d="M5 8L7 10L11 6" stroke="#17835D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>State Fire Safety NOC (NBC 2016)</span>
          </div>
          <div className="telemetry-check-item">
            <svg viewBox="0 0 16 16" width="14" height="14" className="check-svg warning-color">
              <circle cx="8" cy="8" r="7" fill="#FEF7EB" />
              <path d="M8 5V9M8 12H8.01" stroke="#D18A24" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Faculty Cadre Ratio (Table 7.1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

