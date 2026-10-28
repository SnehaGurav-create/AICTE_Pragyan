import React, { useState } from 'react';
import { MOCK_SCRUTINY_CASE } from '../data/mockData';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Building,
  UserCheck,
  FileCheck2,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

export function ScrutinyCockpit() {
  const [activeTab, setActiveTab] = useState('dossier');
  const [selectedDocId, setSelectedDocId] = useState(MOCK_SCRUTINY_CASE.documents[0].id);
  const [ruleFilter, setRuleFilter] = useState('ALL');
  const [copiedHearingNote, setCopiedHearingNote] = useState(false);

  const selectedDoc = MOCK_SCRUTINY_CASE.documents.find((d) => d.id === selectedDocId) || MOCK_SCRUTINY_CASE.documents[0];

  const handleCopyHearingNote = () => {
    const text = `AICTE PRE-SCRUTINY COMMITTEE HEARING BRIEFING NOTE
Application ID: ${MOCK_SCRUTINY_CASE.institution.applicationId}
Institution: ${MOCK_SCRUTINY_CASE.institution.name}
Overall Compliance Score: ${MOCK_SCRUTINY_CASE.institution.overallScore}%
Critical Deficiency Flagged:
- Faculty Cadre Deficit in CSE Department (APH Clause 7.1.3)
- Required Cadre Ratio: 1:2:6 | Present: 1 Professor, 3 Associate, 15 Assistant (Shortfall: 1 Professor)
Recommendation: Convene Scrutiny Hearing for 90-day regularisation undertaking.`;
    navigator.clipboard?.writeText(text);
    setCopiedHearingNote(true);
    setTimeout(() => setCopiedHearingNote(false), 2400);
  };

  const filteredRules = MOCK_SCRUTINY_CASE.rulesMatrix.filter((r) => {
    if (ruleFilter === 'COMPLIANT') return r.status === 'PASSED';
    if (ruleFilter === 'DEFICIENT') return r.status === 'NEEDS_HEARING';
    return true;
  });

  return (
    <section id="scrutiny-cockpit" className="cockpit-section" aria-labelledby="cockpit-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block">
          <span className="badge-institutional">Interactive Product Preview</span>
          <h2 id="cockpit-heading" className="section-title">
            The AICTE Scrutiny Cockpit
          </h2>
          <p className="section-subtitle">
            An authorized officer interface transforming multi-hundred-page institutional dossiers into an
            evidence-linked, explainable decision matrix.
          </p>
        </div>

        {/* Prominent Demo Notice Banner */}
        <div className="demo-notice-bar glass-panel">
          <div className="demo-notice-content">
            <Info size={18} className="text-blue" />
            <div className="demo-notice-text">
              <strong>DEMO BENCHMARK DATA:</strong> Real-world synthetic technical institution case for design
              and usability evaluation. Not connected to live AICTE internal servers.
            </div>
          </div>
          <span className="badge-institutional badge-saffron">
            Synthetic Benchmark Suite
          </span>
        </div>

        {/* Cockpit Card Container */}
        <div className="cockpit-main-card glass-panel">
          {/* Institutional Metadata Header */}
          <div className="cockpit-case-header">
            <div className="case-title-group">
              <div className="case-institution-row">
                <Building size={20} className="case-icon" />
                <h3 className="case-institution-name">{MOCK_SCRUTINY_CASE.institution.name}</h3>
                <span className="badge-status compliant">ACTIVE DOSSIER</span>
              </div>
              <div className="case-meta-row">
                <span className="meta-tag">
                  <strong>App ID:</strong> {MOCK_SCRUTINY_CASE.institution.applicationId}
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-tag">
                  <strong>Type:</strong> {MOCK_SCRUTINY_CASE.institution.applicationType}
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-tag">
                  <strong>Jurisdiction:</strong> {MOCK_SCRUTINY_CASE.institution.region}
                </span>
              </div>
            </div>

            {/* Scorecard Widget */}
            <div className="case-score-widget">
              <div className="score-number-group">
                <span className="score-number">{MOCK_SCRUTINY_CASE.institution.overallScore}%</span>
                <span className="score-label">APH Compliance</span>
              </div>
              <div className="score-breakdown-tags">
                <span className="badge-status compliant">
                  <CheckCircle2 size={12} /> 144 Pass
                </span>
                <span className="badge-status deficiency">
                  <AlertTriangle size={12} /> 1 Hearing
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="cockpit-tabs-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'dossier'}
              className={`cockpit-tab-btn ${activeTab === 'dossier' ? 'active' : ''}`}
              onClick={() => setActiveTab('dossier')}
            >
              <FileText size={16} />
              <span>Document Cross-Check Dossier</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'rules'}
              className={`cockpit-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              <Layers size={16} />
              <span>APH 2026-27 Rule Matrix ({MOCK_SCRUTINY_CASE.rulesMatrix.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'hearing'}
              className={`cockpit-tab-btn ${activeTab === 'hearing' ? 'active' : ''}`}
              onClick={() => setActiveTab('hearing')}
            >
              <UserCheck size={16} />
              <span>Scrutiny Committee Hearing Briefing</span>
            </button>
          </div>

          {/* TAB 1: Document Cross-Check Dossier */}
          {activeTab === 'dossier' && (
            <div className="cockpit-tab-content">
              {/* Document Selector Pills */}
              <div className="doc-selector-strip" role="tablist" aria-label="Select Document">
                {MOCK_SCRUTINY_CASE.documents.map((doc) => {
                  const isSelected = doc.id === selectedDocId;
                  const isDeficient = doc.status === 'DEFICIENCY_FLAGGED';

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`doc-selector-btn ${isSelected ? 'active' : ''} ${isDeficient ? 'has-deficiency' : ''}`}
                      onClick={() => setSelectedDocId(doc.id)}
                    >
                      <div className="doc-btn-icon">
                        {isDeficient ? (
                          <AlertTriangle size={15} className="text-red" />
                        ) : (
                          <FileCheck2 size={15} className="text-blue" />
                        )}
                      </div>
                      <div className="doc-btn-text">
                        <span className="doc-btn-title">{doc.title}</span>
                        <span className="doc-btn-status">
                          {isDeficient ? 'Deficiency Flagged' : 'Verified Compliant'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Split Document Inspection Grid */}
              <div className="dossier-split-grid">
                {/* Left: Document Source Evidence Viewer */}
                <div className="dossier-left-panel glass-panel">
                  <div className="panel-title-bar">
                    <span className="panel-label">Source Document Evidence</span>
                    <span className="badge-institutional">{selectedDoc.authority}</span>
                  </div>

                  <div className="document-mock-sheet">
                    <div className="mock-sheet-header">
                      <span className="sheet-ref">DOC NO: {selectedDoc.docNumber}</span>
                      <span className={`badge-status ${selectedDoc.status === 'DEFICIENCY_FLAGGED' ? 'deficiency' : 'compliant'}`}>
                        {selectedDoc.status === 'DEFICIENCY_FLAGGED' ? 'DEFICIENCY FLAGGED' : 'VERIFIED COMPLIANT'}
                      </span>
                    </div>

                    <h4 className="sheet-title">{selectedDoc.title}</h4>
                    <p className="sheet-narrative">{selectedDoc.details}</p>

                    {/* Bounding box highlight callout */}
                    {selectedDoc.deficiency && (
                      <div className="bounding-box-callout">
                        <div className="callout-header">
                          <AlertTriangle size={15} className="text-red" />
                          <span>AICTE APH Clause 7.1 Deficiency Detected</span>
                        </div>
                        <p className="callout-body">{selectedDoc.deficiency.description}</p>
                      </div>
                    )}

                    {/* Extracted Key Fact Checkpoints */}
                    <div className="extracted-facts-table">
                      <span className="table-caption">Codified Parameters Extracted by PRAGYAN</span>
                      <div className="facts-list">
                        {selectedDoc.keyExtractedData.map((fact, idx) => (
                          <div key={idx} className="fact-row">
                            <span className="fact-label">{fact.label}</span>
                            <span className={`fact-val ${!fact.match ? 'fact-val-alert' : ''}`}>
                              {fact.value}
                            </span>
                            {fact.alert && <span className="fact-warning-tag">{fact.alert}</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mock-sheet-footer">
                      <code>SHA-256: {selectedDoc.hash}</code>
                    </div>
                  </div>
                </div>

                {/* Right: AICTE Regulatory Triangulation */}
                <div className="dossier-right-panel glass-panel">
                  <div className="panel-title-bar">
                    <span className="panel-label">Regulatory Cross-Validation</span>
                    <span className="badge-institutional">APH Clause Check</span>
                  </div>

                  <div className="validation-breakdown">
                    <div className="validation-item">
                      <span className="val-label">Target Regulatory Rule:</span>
                      <span className="val-code">{selectedDoc.aphClause}</span>
                    </div>

                    <div className="validation-item">
                      <span className="val-label">Document Status:</span>
                      <span className={`badge-status ${selectedDoc.status === 'DEFICIENCY_FLAGGED' ? 'deficiency' : 'compliant'}`}>
                        {selectedDoc.status === 'DEFICIENCY_FLAGGED' ? 'REFERRED TO EXPERT COMMITTEE' : 'SYSTEM CONFIRMED'}
                      </span>
                    </div>

                    <div className="validation-item">
                      <span className="val-label">Cross-Document Matches:</span>
                      <p className="val-desc">
                        Triangulated with Municipal Master Plan, GIS satellite cadastral boundary, and
                        Council database with zero hallucination.
                      </p>
                    </div>

                    <div className="validation-recommendation-box">
                      <h5 className="rec-title">Committee Actionable Recommendation</h5>
                      <p className="rec-body">
                        {selectedDoc.status === 'DEFICIENCY_FLAGGED'
                          ? 'Place application before Regional Scrutiny Committee for hearing regarding Computer Science Professor cadre deficit. Candidate institution may submit recruitment undertaking within 90 days as per Chapter VII Section 3.'
                          : 'All statutory parameters are fully compliant with AICTE Approval Process Handbook (APH 2026-27). Clear for standard Extension of Approval.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APH Rule Matrix */}
          {activeTab === 'rules' && (
            <div className="cockpit-tab-content">
              {/* Filter controls */}
              <div className="rules-filter-bar">
                <div className="filter-buttons-group">
                  <button
                    type="button"
                    className={`filter-btn ${ruleFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setRuleFilter('ALL')}
                  >
                    All Rules ({MOCK_SCRUTINY_CASE.rulesMatrix.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${ruleFilter === 'COMPLIANT' ? 'active' : ''}`}
                    onClick={() => setRuleFilter('COMPLIANT')}
                  >
                    Passed (4)
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${ruleFilter === 'DEFICIENT' ? 'active' : ''}`}
                    onClick={() => setRuleFilter('DEFICIENT')}
                  >
                    Needs Hearing (1)
                  </button>
                </div>
              </div>

              {/* Rules Table */}
              <div className="rules-table-wrapper">
                <table className="rules-table">
                  <thead>
                    <tr>
                      <th scope="col">Clause</th>
                      <th scope="col">Regulatory Parameter</th>
                      <th scope="col">Mandatory Requirement</th>
                      <th scope="col">Audit Status</th>
                      <th scope="col">Evidence Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRules.map((rule) => {
                      const isPass = rule.status === 'PASSED';
                      return (
                        <tr key={rule.clause} className={isPass ? '' : 'row-deficient'}>
                          <td className="clause-cell">
                            <code>{rule.clause}</code>
                          </td>
                          <td className="param-cell">
                            <strong>{rule.title}</strong>
                          </td>
                          <td className="req-cell">{rule.requirement}</td>
                          <td className="status-cell">
                            <span className={`badge-status ${isPass ? 'compliant' : 'deficiency'}`}>
                              {isPass ? 'PASSED' : 'NEEDS HEARING'}
                            </span>
                          </td>
                          <td className="evidence-cell">{rule.evidence}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Scrutiny Committee Hearing Note */}
          {activeTab === 'hearing' && (
            <div className="cockpit-tab-content">
              <div className="hearing-note-container glass-panel">
                <div className="hearing-header-row">
                  <div>
                    <h4 className="hearing-title">AICTE Regional Scrutiny Committee Briefing</h4>
                    <span className="hearing-subtitle">
                      Generated under Section 10 of AICTE Act, 1987 for Scrutiny Sub-Committee #03
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCopyHearingNote}
                  >
                    {copiedHearingNote ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                    <span>{copiedHearingNote ? 'Copied to Clipboard' : 'Copy Hearing Agenda'}</span>
                  </button>
                </div>

                <div className="hearing-dossier-paper">
                  <div className="paper-header">
                    <strong>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</strong>
                    <span>NORTHERN REGIONAL OFFICE, BHOPAL</span>
                    <span className="paper-case-id">CASE REF: {MOCK_SCRUTINY_CASE.institution.applicationId}</span>
                  </div>

                  <hr className="paper-divider" />

                  <div className="paper-section">
                    <p><strong>1. INSTITUTION DETAILS:</strong></p>
                    <p>{MOCK_SCRUTINY_CASE.institution.name} ({MOCK_SCRUTINY_CASE.institution.code})</p>
                    <p>Application Type: {MOCK_SCRUTINY_CASE.institution.applicationType}</p>
                  </div>

                  <div className="paper-section">
                    <p><strong>2. SCRUTINY SUMMARY:</strong></p>
                    <p>Total Documents Ingested: 48 | Cross-references verified: 312 | Overall Compliance: 94.8%</p>
                    <p>Land, Fire Safety, and Financial Solvency requirements are 100% compliant with zero encumbrance.</p>
                  </div>

                  <div className="paper-section highlight-deficiency-box">
                    <p><strong>3. ITEM FOR EXPERT COMMITTEE DELIBERATION:</strong></p>
                    <p><strong>Deficiency:</strong> Faculty Cadre Ratio Shortfall in Computer Science & Engineering (APH Table 7.1).</p>
                    <p><strong>Facts:</strong> Required Cadre Ratio is 1:2:6. Current staff exhibits 1 Professor, 3 Associate Professors, and 15 Assistant Professors (Deficit: 1 Cadre Professor).</p>
                    <p><strong>Committee Action:</strong> Grant hearing to Institution Chairman/Principal to furnish advertisement proof or candidate interview schedule within 90 days.</p>
                  </div>

                  <div className="paper-footer">
                    <span>Generated by PRAGYAN-AICTE Scrutiny Assistant</span>
                    <span>Signatures: Scrutiny Committee Members 1, 2 & Chairman</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
