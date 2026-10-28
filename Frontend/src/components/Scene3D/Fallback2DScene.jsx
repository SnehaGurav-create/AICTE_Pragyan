import React from 'react';
import { DOCUMENT_CONFIGS } from './generateDocumentTexture';
import { CheckCircle2, AlertTriangle, ShieldCheck, Hash, FileText } from 'lucide-react';

export function Fallback2DScene({ scrollProgress, activePhase, onSelectPhase }) {
  // Phase mapping for 2.5D visual transformation
  const isSeparated = scrollProgress >= 0.2 && scrollProgress < 0.85;
  const isScanning = scrollProgress >= 0.35 && scrollProgress <= 0.85;
  const isDiscrepancy = scrollProgress >= 0.58;
  const isAssembled = scrollProgress >= 0.85;

  return (
    <div className="fallback-2d-scene-container" aria-label="Regulatory Document Verification View">
      {/* 2.5D Document Grid / Stack */}
      <div className={`fallback-stack-wrapper ${isSeparated ? 'exploded' : isAssembled ? 'assembled' : 'stacked'}`}>
        {DOCUMENT_CONFIGS.map((doc, idx) => {
          const isErrorDoc = doc.hasDiscrepancy && isDiscrepancy;
          return (
            <div
              key={doc.id}
              className={`fallback-doc-card glass-panel ${isErrorDoc ? 'has-deficiency' : ''}`}
              style={{
                '--doc-index': idx,
                transform: !isSeparated && !isAssembled 
                  ? `translateY(${idx * 16}px) scale(${1 - idx * 0.03})`
                  : undefined
              }}
            >
              {/* Card Header */}
              <div className="doc-card-header">
                <div className="doc-stamp-icon">
                  {isErrorDoc ? (
                    <AlertTriangle size={18} className="text-red" />
                  ) : (
                    <ShieldCheck size={18} className="text-blue" />
                  )}
                </div>
                <div className="doc-header-titles">
                  <span className="doc-auth-label">{doc.authorityHeader}</span>
                  <h4 className="doc-title-text">{doc.title}</h4>
                </div>
                <span className={`badge-status ${isErrorDoc ? 'deficiency' : 'compliant'}`}>
                  {isErrorDoc ? 'HEARING REQ' : 'VERIFIED'}
                </span>
              </div>

              {/* Document Key Attributes */}
              <div className="doc-card-rows">
                {doc.contentRows.slice(0, 4).map((row, rIdx) => (
                  <div key={rIdx} className="doc-row-item">
                    <span className="row-label">{row.label}</span>
                    <span className={`row-val ${row.isError ? 'row-val-error' : ''}`}>
                      {row.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cryptographic SHA & Clause Footer */}
              <div className="doc-card-footer">
                <div className="doc-sha-tag">
                  <Hash size={12} />
                  <code>{doc.hash.substring(0, 16)}...</code>
                </div>
                <span className="doc-clause-tag">{doc.clause}</span>
              </div>

              {/* Laser Scanline simulation */}
              {isScanning && (
                <div className="fallback-scanline-bar" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
