import React from 'react';
import {
  FileText,
  SearchCheck,
  Building,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export function WorkflowSection() {
  const steps = [
    {
      number: '01',
      title: 'Submit',
      summary: 'Receive an institution application and its supporting documents.',
      details: 'Ingests land title deeds, municipal fire NOCs, faculty registers, and financial records submitted by technical institutions.',
      icon: FileText,
      tag: 'Application Intake',
    },
    {
      number: '02',
      title: 'Validate',
      summary: 'Check completeness, extract information and identify inconsistencies.',
      details: 'Extracts tabular and text fields via layout-aware OCR; verifies parcel contiguity, required document completeness, and cross-document coherence.',
      icon: SearchCheck,
      tag: 'Preliminary Extraction',
    },
    {
      number: '03',
      title: 'Verify',
      summary: 'Compare records against authorized sources where available.',
      details: 'Validates reference numbers, digital certificates, and municipal registrations against available official channels or simulated repositories.',
      icon: Building,
      tag: 'Authority Cross-Check',
    },
    {
      number: '04',
      title: 'Review',
      summary: 'Present evidence-linked findings to authorized scrutiny officers.',
      details: 'Generates structured compliance findings with page-level citations to assist Regional Scrutiny Committees during formal evaluation.',
      icon: UserCheck,
      tag: 'Human Decision Support',
    },
  ];

  return (
    <section id="workflow" className="workflow-section" aria-labelledby="workflow-title">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block">
          <span className="badge-institutional">Verification Methodology</span>
          <h2 id="workflow-title" className="section-title">
            Pre-Scrutiny Verification Workflow
          </h2>
          <p className="section-subtitle">
            A structured four-step decision-support protocol designed to assist AICTE scrutiny officers
            in validating institutional applications against statutory regulatory norms.
          </p>
        </div>

        {/* 4 Concise Workflow Steps */}
        <div className="workflow-grid-compact">
          {steps.map((step) => {
            const IconComp = step.icon;
            return (
              <div key={step.number} className="workflow-compact-card glass-panel">
                <div className="compact-step-header">
                  <span className="compact-step-num">{step.number}</span>
                  <span className="compact-step-tag">{step.tag}</span>
                </div>

                <div className="compact-icon-box">
                  <IconComp size={22} className="text-blue" />
                </div>

                <h3 className="compact-step-title">{step.title}</h3>
                <p className="compact-step-summary">{step.summary}</p>
                <p className="compact-step-details">{step.details}</p>
              </div>
            );
          })}
        </div>

        {/* Required Mandatory Regulatory Statement */}
        <div className="workflow-regulatory-notice glass-panel">
          <div className="notice-icon-box">
            <AlertCircle size={22} className="text-blue" />
          </div>
          <div className="notice-text-content">
            <strong>REGULATORY NOTICE:</strong> Automated findings are preliminary indicators.
            Statutory scrutiny, required inspections and final regulatory decisions remain with authorized AICTE officials.
          </div>
        </div>
      </div>
    </section>
  );
}
