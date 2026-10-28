import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Scale,
  Building,
  UserCheck,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  AlertTriangle,
  RefreshCw,
  Eye
} from 'lucide-react';

export function EoAValidationReport({
  currentRole = 'INSTITUTION',
  applicationId = 'AICTE-2026-NRO-8841',
  institutionName = 'Apex Institute of Advanced Technology & Research (Bhopal)',
  onOpenClarificationModal,
  onPerformSimulatedVerification,
}) {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'basis7' | 'dossier'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);
  const [uploadedFileName, setUploadedFileName] = useState('Apex_Inst_EoA_2026-27_Final_Sanctioned.pdf');
  const [fileDetails, setFileDetails] = useState({
    name: 'Apex_Inst_EoA_2026-27_Final_Sanctioned.pdf',
    size: '3.42 MB',
    pages: 24,
    sha256: '8f4c2e...b91a',
    uploadedAt: 'Today, 03:14 AM UTC',
    format: 'PDF/A-1b Standard Compliant',
    readabilityScore: '98.6% (Clean OCR Stream)'
  });

  const [expandedCheck, setExpandedCheck] = useState('4'); // expand check 4 (mismatch) by default

  // Simulated File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);
    setUploadedFileName(file.name);

    setTimeout(() => setUploadProgress(55), 400);
    setTimeout(() => setUploadProgress(85), 800);
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        pages: 24,
        sha256: '9a7d3f...c28e',
        uploadedAt: 'Just now',
        format: 'PDF/A Compliant',
        readabilityScore: '99.1% OCR extracted'
      });
    }, 1200);
  };

  // The 7 Validation Basis checks from the user's specification image
  const checks7Basis = [
    {
      id: '1',
      title: '1. File and readability',
      question: 'Is the file supported, readable and processable?',
      status: 'Passed',
      statusType: 'passed',
      percentage: 100,
      finding: 'The PDF was opened and its text was extracted with zero page corruption.',
      ruleRef: 'APH_DOC_VALID_01',
      evidence: 'OCR Confidence 98.6% across 24 pages. Stream structure valid.',
    },
    {
      id: '2',
      title: '2. Required information',
      question: 'Are the required fields present according to the applicable checklist?',
      status: 'Passed',
      statusType: 'passed',
      percentage: 100,
      finding: 'All 14 mandatory fields for Extension of Approval (EoA) detected.',
      ruleRef: 'APH_REQ_CHECKLIST_26',
      evidence: 'Trust Name, Society Reg, Head of Institution, Cadre Table present.',
    },
    {
      id: '3',
      title: '3. Document and date consistency',
      question: 'Do the extracted dates and identifiers satisfy configured rules?',
      status: 'Passed',
      statusType: 'passed',
      percentage: 100,
      finding: 'Extracted dates satisfy configured timeline rules for AY 2026-27.',
      ruleRef: 'DATE_CONSISTENCY_03',
      evidence: 'Issued date: 15-Jan-2026; Effective: Academic Session 2026-2027.',
    },
    {
      id: '4',
      title: '4. Application consistency',
      question: 'Do the institution ID, academic year, programmes or intake match the submitted application and authorized records?',
      status: 'Mismatch detected',
      statusType: 'mismatch',
      percentage: 40,
      finding: 'One extracted programme detail needs comparison with the application record.',
      ruleRef: 'APP_INTAKE_MATCH_04',
      evidence: 'B.Tech CSE claimed intake: 180 seats vs Affiliating University NOC on record: 120 seats.',
      alertBadge: 'Critical Field Discrepancy'
    },
    {
      id: '5',
      title: '5. Official-source verification',
      question: 'Does an authorized source confirm the document and its relevant details?',
      status: 'Verification pending',
      statusType: 'pending',
      percentage: 50,
      finding: 'No confirmation has yet been received from an authorized source.',
      ruleRef: 'ISSUER_AUTH_DPI_05',
      evidence: 'DigiLocker PUSH query dispatched; awaiting Affiliating University Registrar confirmation.',
    },
    {
      id: '6',
      title: '6. Duplicate and anomaly analysis',
      question: 'Are there duplicate files, suspicious alterations or other indicators requiring investigation?',
      status: 'Potential anomaly flagged',
      statusType: 'processing',
      percentage: 65,
      finding: 'The result reflects actual checks performed: Concurrent faculty collision flagged in Annexure 4.',
      ruleRef: 'GHOST_FACULTY_SENTINEL_06',
      evidence: 'Dr. Amiteshwar Sharma biometric punch collision detected at Indore (192 km away).',
    },
    {
      id: '7',
      title: '7. Applicable regulatory requirements',
      question: 'Does the evidence satisfy the configured requirements for this application category and academic year?',
      status: 'Compliance review required',
      statusType: 'review',
      percentage: 70,
      finding: 'SFR compliant at 1:18.5; CSE Cadre ratio short 1 Professor under APH Clause 7.1.',
      ruleRef: 'APH_REG_COMPLIANCE_07',
      evidence: 'Observed cadre ratio 1:1:10 vs required statutory norm 1:2:6.',
    },
  ];

  // 4-Stage Regulatory Workflow Stages
  const stages = [
    {
      num: '01',
      title: 'AI Validation Engine',
      type: 'Automatic Background Processing',
      owner: 'SVC-AI-ENGINE',
      status: 'COMPLETED',
      statusLabel: 'Checks Passed & Flags Raised',
      description: 'Checks readability, extracts text, identifies missing fields, compares records, and flags overlap/manipulation.',
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      num: '02',
      title: 'Verification Officer',
      type: 'Authenticity Verification',
      owner: 'Er. Vikram Anand (Official Authority Desk)',
      status: 'PENDING',
      statusLabel: 'Verification Pending',
      description: 'Verifies EoA against DigiLocker, State GIS cadastre, and Affiliating University portal. Simulated source demo.',
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      num: '03',
      title: 'AICTE Scrutiny Officer',
      type: 'Human Scrutiny & Vigilance',
      owner: 'Dr. Rajesh Verma (Regional Committee)',
      status: 'QUEUED',
      statusLabel: 'Dossier Review Queued',
      description: 'Reviews rule results, investigates programme mismatch & ghost faculty collision, requests clarification or EVC inspection.',
      color: '#3b82f6',
      bg: '#eff6ff',
    },
    {
      num: '04',
      title: 'Competent Authority',
      type: 'Statutory Determination',
      owner: 'Shri K. M. Subramanian, IAS (Approving Officer)',
      status: 'GATED',
      statusLabel: 'Decision Gate Reserved',
      description: 'Makes the final regulatory decision (Grant LoA / LoR) with mandatory legal rationale. AI never decides.',
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
  ];

  return (
    <div className="eoa-workflow-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Breadcrumbs Trail */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#64748b',
          background: '#ffffff',
          padding: '10px 16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <span style={{ fontWeight: 600, color: '#0f2b48' }}>Institution Dashboard</span>
        <span>›</span>
        <span>My Applications</span>
        <span>›</span>
        <span style={{ fontWeight: 700, color: '#0284c7' }}>{applicationId} ({institutionName.split(' ')[0]})</span>
        <span>›</span>
        <span>Documents</span>
        <span>›</span>
        <span style={{ fontWeight: 700, color: '#10b981' }}>Upload EoA</span>
      </div>

      {/* 2. INSTITUTION UPLOAD INTERFACE (Proposed Interface from Specification) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px' }}>
                Application Category
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                Extension of Approval (EoA) • AY 2026-27
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f2b48' }}>
              EoA Document Ingestion Desk
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Upload the PDF associated with the selected application. Also provide any other supporting documents required by the selected application category.
            </p>
          </div>

          {/* Upload Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label
              htmlFor="eoa-pdf-upload-input"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s',
              }}
            >
              <UploadCloud size={18} />
              <span>{isUploading ? 'Validating EoA PDF...' : 'Upload EoA PDF'}</span>
            </label>
            <input
              id="eoa-pdf-upload-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Upload Progress Bar if active */}
        {isUploading && (
          <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#0284c7', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Loader2 size={14} className="spin-animate" />
                <span>Running automated pre-scrutiny pipeline (readability, text extraction & 7-basis checks)...</span>
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div style={{ height: '6px', background: '#cbd5e1', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${uploadProgress}%`, background: '#0284c7', transition: 'width 0.3s' }} />
            </div>
          </div>
        )}

        {/* File Record & Single Shared Ledger Notice */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f2b48' }}>
                  {fileDetails.name}
                </span>
                <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  Active Application Record
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                {fileDetails.size} • {fileDetails.pages} Pages • SHA-256: <code>{fileDetails.sha256}</code> • {fileDetails.readabilityScore}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#475569', background: '#ffffff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            🔒 <strong>Shared Application Ledger:</strong> Saved against <code>{applicationId}</code>. Automatically available to Verification, Scrutiny & Approving Officers without separate re-uploads.
          </div>
        </div>
      </div>

      {/* 3. WHAT THE INSTITUTION SEES AFTER UPLOAD: THE VALIDATION FINDINGS REPORT */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Header matching exact user specification */}
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800, color: '#b45309' }}>
                Official Automated Findings Report
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.35rem', fontWeight: 800, color: '#0f2b48' }}>
                EoA Document Validation
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Example application: EoA supporting document (Apex Institute of Advanced Technology • {applicationId})
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde047',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <AlertCircle size={15} />
                <span>Review required</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Cards: File readability, Application consistency, Official verification, Anomaly analysis */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Card 1: File readability */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#166534' }}>
                  File readability
                </span>
                <span style={{ background: '#16a34a', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  Passed
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#15803d', lineHeight: 1.45 }}>
                The PDF was opened and its text was extracted. Zero corruption detected in byte stream.
              </p>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.68rem', color: '#166534', fontFamily: 'monospace' }}>
              RULE: APH_DOC_VALID_01 • 98.6%
            </div>
          </div>

          {/* Card 2: Application consistency */}
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#991b1b' }}>
                  Application consistency
                </span>
                <span style={{ background: '#dc2626', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  Mismatch
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#b91c1c', lineHeight: 1.45 }}>
                One extracted programme detail needs comparison with the application record (CSE 180 vs 120 NOC).
              </p>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.68rem', color: '#991b1b', fontFamily: 'monospace' }}>
              RULE: APP_INTAKE_MATCH_04 • Page 4
            </div>
          </div>

          {/* Card 3: Official verification */}
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#92400e' }}>
                  Official verification
                </span>
                <span style={{ background: '#d97706', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  Pending
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#b45309', lineHeight: 1.45 }}>
                No confirmation has yet been received from an authorized source (DigiLocker / State API).
              </p>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.68rem', color: '#92400e', fontFamily: 'monospace' }}>
              GATEWAY: DIGILOCKER_DPI_API
            </div>
          </div>

          {/* Card 4: Anomaly analysis */}
          <div
            style={{
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#3730a3' }}>
                  Anomaly analysis
                </span>
                <span style={{ background: '#4f46e5', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  Processing
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#4338ca', lineHeight: 1.45 }}>
                The result must reflect the actual checks performed, with evidence for any alert (Radar active).
              </p>
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.68rem', color: '#3730a3', fontFamily: 'monospace' }}>
              SENTINEL: BIOMETRIC_COLLISION_06
            </div>
          </div>
        </div>

        {/* 4. Next Action Explanation Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '1.5px solid #fde047',
            borderRadius: '10px',
            padding: '18px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertTriangle size={18} color="#d97706" />
              <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#92400e' }}>
                Next action: Review the programme mismatch and complete the required verification.
              </h4>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#78350f', lineHeight: 1.5 }}>
              <strong>Which field needs attention:</strong> <code>B.Tech Computer Science & Engineering — Sanctioned Intake</code>. The extracted application claims an enhanced intake of 180 seats, but the Affiliating University NOC currently on record permits 120 seats.
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400e', lineHeight: 1.45 }}>
              <strong>How the institution can respond:</strong> You can upload an amended Affiliating University intake concurrence resolution or file a statutory clarification undertaking before Scrutiny Officer examination.
            </p>
          </div>

          {currentRole === 'INSTITUTION' && onOpenClarificationModal && (
            <button
              type="button"
              onClick={onOpenClarificationModal}
              style={{
                background: '#d97706',
                color: '#ffffff',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)',
                alignSelf: 'center',
              }}
            >
              <span>Submit Programme Clarification</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* 5. VISUAL GRAPH SECTION: "it should display in graph" */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          {/* Tab Selector between 4-Stage Pipeline Graph & 7-Point Validation Basis Graph */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Visual Regulatory Graph View
              </span>
              <h4 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f2b48' }}>
                Multi-Stage Pipeline & 7-Basis Validation Graph
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '8px', background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('pipeline')}
                style={{
                  background: activeTab === 'pipeline' ? '#ffffff' : 'transparent',
                  color: activeTab === 'pipeline' ? '#0f2b48' : '#64748b',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'pipeline' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                1. 4-Stage Workflow Graph
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('basis7')}
                style={{
                  background: activeTab === 'basis7' ? '#ffffff' : 'transparent',
                  color: activeTab === 'basis7' ? '#0f2b48' : '#64748b',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'basis7' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                2. 7-Basis Validation Chart
              </button>
            </div>
          </div>

          {/* GRAPH TAB 1: 4-STAGE PIPELINE FLOW GRAPH */}
          {activeTab === 'pipeline' && (
            <div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '14px' }}>
                The document flows through four distinct checking and scrutiny stages before any final regulatory determination:
              </div>

              {/* Graphical Step Nodes connected by glowing SVG lines */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '14px',
                  position: 'relative',
                }}
              >
                {stages.map((st, idx) => (
                  <div
                    key={st.num}
                    style={{
                      background: '#ffffff',
                      border: `1.5px solid ${st.status === 'COMPLETED' ? '#10b981' : st.status === 'PENDING' ? '#f59e0b' : '#cbd5e1'}`,
                      borderRadius: '10px',
                      padding: '16px',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                  >
                    {/* Step Number & Connector */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: st.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        {st.num}
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: st.bg,
                          color: st.color,
                          border: `1px solid ${st.color}`,
                        }}
                      >
                        {st.status}
                      </span>
                    </div>

                    <h5 style={{ margin: '0 0 2px 0', fontSize: '0.88rem', fontWeight: 800, color: '#0f2b48' }}>
                      {st.title}
                    </h5>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: st.color, marginBottom: '6px' }}>
                      {st.type}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                      {st.description}
                    </p>
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', fontSize: '0.68rem', color: '#475569' }}>
                      <strong>Owner:</strong> {st.owner}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GRAPH TAB 2: 7-POINT CONFIGURABLE VALIDATION BASIS GRAPH */}
          {activeTab === 'basis7' && (
            <div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '14px' }}>
                Configurable validation engine results evaluated across the 7 statutory dimensions (APH 2026-27):
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {checks7Basis.map((check) => {
                  const isExpanded = expandedCheck === check.id;

                  return (
                    <div
                      key={check.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          gap: '12px',
                        }}
                        onClick={() => setExpandedCheck(isExpanded ? null : check.id)}
                      >
                        {/* Title & Progress Bar */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f2b48' }}>
                              {check.title}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background:
                                  check.statusType === 'passed' ? '#dcfce7' :
                                  check.statusType === 'mismatch' ? '#fee2e2' :
                                  check.statusType === 'pending' ? '#fef3c7' : '#ede9fe',
                                color:
                                  check.statusType === 'passed' ? '#15803d' :
                                  check.statusType === 'mismatch' ? '#b91c1c' :
                                  check.statusType === 'pending' ? '#92400e' : '#6d28d9',
                              }}
                            >
                              {check.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '6px' }}>
                            {check.question}
                          </div>

                          {/* Horizontal Graphic Bar */}
                          <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${check.percentage}%`,
                                background:
                                  check.statusType === 'passed' ? '#10b981' :
                                  check.statusType === 'mismatch' ? '#ef4444' :
                                  check.statusType === 'pending' ? '#f59e0b' : '#6366f1',
                                transition: 'width 0.4s ease',
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ color: '#94a3b8' }}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {/* Expandable Evidence & Rule Finding */}
                      {isExpanded && (
                        <div
                          style={{
                            marginTop: '12px',
                            paddingTop: '10px',
                            borderTop: '1px dashed #e2e8f0',
                            fontSize: '0.75rem',
                            color: '#334155',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <div>
                            <strong>Finding:</strong> {check.finding}
                          </div>
                          <div>
                            <strong>Audit Evidence:</strong> {check.evidence}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
                            RULE ENFORCEMENT ID: {check.ruleRef}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EoAValidationReport;

