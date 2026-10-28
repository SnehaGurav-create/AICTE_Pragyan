import React from 'react';
import { CORE_CAPABILITIES } from '../data/mockData';
import { Network, MapPin, UserCheck, ShieldAlert, Check, ArrowRight } from 'lucide-react';

export function CapabilitiesSection() {
  const iconMap = {
    Network,
    MapPin,
    UserCheck,
    ShieldAlert,
  };

  return (
    <section id="capabilities" className="capabilities-section" aria-labelledby="capabilities-heading">
      <div className="container">
        {/* Header */}
        <div className="section-header-block">
          <span className="badge-institutional">System Capabilities</span>
          <h2 id="capabilities-heading" className="section-title">
            Engineered for Regulatory Scrutiny
          </h2>
          <p className="section-subtitle">
            Beyond standard optical character recognition: an interconnected intelligence matrix
            purpose-built to scrutinize institutional claims against statutory technical education norms.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="capabilities-grid">
          {CORE_CAPABILITIES.map((cap) => {
            const IconComponent = iconMap[cap.icon] || Network;

            return (
              <div key={cap.title} className="capability-card glass-panel">
                <div className="cap-top-row">
                  <div className="cap-icon-box">
                    <IconComponent size={22} className="cap-icon" />
                  </div>
                  <span className="cap-metric-tag">{cap.metric}</span>
                </div>

                <h3 className="cap-card-title">{cap.title}</h3>
                <p className="cap-card-summary">{cap.summary}</p>
                <p className="cap-card-detail">{cap.detail}</p>

                <div className="cap-card-footer">
                  <span className="cap-aph-tag">AICTE APH Validated</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
