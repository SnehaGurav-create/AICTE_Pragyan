import React from 'react';
import { ShieldCheck, Scale, Lock, Eye, AlertCircle } from 'lucide-react';

export function GovernanceNotice() {
  return (
    <section id="governance" className="governance-section" aria-labelledby="governance-heading">
      <div className="container">
        <div className="governance-box glass-panel">
          <div className="governance-header-row">
            <div className="governance-icon-badge">
              <Scale size={24} className="text-blue" />
            </div>
            <div>
              <span className="badge-institutional">Regulatory Framework & Mandate</span>
              <h2 id="governance-heading" className="governance-title">
                Human-in-the-Loop Regulatory Mandate
              </h2>
            </div>
          </div>

          <div className="governance-statement-card">
            <div className="statement-quote-bar" />
            <p className="statement-lead">
              <strong>Statutory Decision Determinism:</strong> PRAGYAN operates exclusively as an
              intelligent pre-scrutiny assistant and evidentiary cross-referencing engine. In strict
              accordance with the <strong>All India Council for Technical Education Act, 1987</strong>,
              all final regulatory determinism, Extension of Approval (EoA) sanctions, deficiency judgments,
              and punitive orders remain the exclusive prerogative of authorized AICTE Scrutiny Committees,
              Regional Officers, Hearing Committees, and the Appellate Authority.
            </p>
          </div>

          <div className="governance-pillars-grid">
            <div className="pillar-item">
              <div className="pillar-icon-box">
                <ShieldCheck size={20} className="text-green" />
              </div>
              <h4 className="pillar-title">Zero-Hallucination Triangulation</h4>
              <p className="pillar-desc">
                Every extracted finding is hard-anchored to a verifiable coordinate, page index, and
                cryptographic SHA-256 hash. The system is barred from heuristic extrapolation.
              </p>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon-box">
                <Eye size={20} className="text-blue" />
              </div>
              <h4 className="pillar-title">Explainable Scrutiny (XAI)</h4>
              <p className="pillar-desc">
                No opaque scoring models. Scrutiny findings provide transparent, side-by-side citations
                comparing submitted applicant documents directly against Approval Process Handbook clauses.
              </p>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon-box">
                <Lock size={20} className="text-blue" />
              </div>
              <h4 className="pillar-title">Sovereign Data Isolation</h4>
              <p className="pillar-desc">
                All institutional dossiers, biometric matrices, and land title records are processed in
                sandboxed jurisdictional enclaves adhering to Government of India data localization guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
