import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DocumentCanvas } from './Scene3D/DocumentCanvas';
import { SCENE_PHASES } from '../data/mockData';
import {
  Layers,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  ScanLine,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollyExperience({ reducedMotion }) {
  const containerRef = useRef(null);
  const storyPinRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // Set up GSAP ScrollTrigger
  useEffect(() => {
    if (!containerRef.current || !storyPinRef.current) return;

    // If user prefers reduced motion, disable scroll scrubbing pinning and use static controls
    if (reducedMotion) {
      setScrollProgress(0.45); // default to separated exploratory view
      setActivePhaseIndex(1);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6, // smooth interpolation without scroll hijacking
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          // Calculate current phase index based on progress
          if (p < 0.20) {
            setActivePhaseIndex(0);
          } else if (p < 0.40) {
            setActivePhaseIndex(1);
          } else if (p < 0.65) {
            setActivePhaseIndex(2);
          } else if (p < 0.85) {
            setActivePhaseIndex(3);
          } else {
            setActivePhaseIndex(4);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Handle phase jump button click
  const handleSelectPhase = (index) => {
    setActivePhaseIndex(index);
    const targetProgress = [0.05, 0.28, 0.52, 0.74, 0.94][index];
    setScrollProgress(targetProgress);

    if (containerRef.current && !reducedMotion) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const targetY = scrollTop + containerRect.top + (targetProgress * (containerRef.current.offsetHeight - window.innerHeight));
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const currentPhase = SCENE_PHASES[activePhaseIndex] || SCENE_PHASES[0];

  return (
    <section
      ref={containerRef}
      id="inspection-scene"
      className="scrolly-container"
      aria-label="Interactive 3D Document Scrutiny Journey"
    >
      {/* Sticky Full-Viewport Stage */}
      <div ref={storyPinRef} className="scrolly-sticky-stage">
        {/* Top Control Bar & Phase Badges */}
        <div className="container scrolly-header-container">
          <div className="scrolly-header-card glass-panel">
            <div className="scrolly-title-col">
              <span className="badge-institutional">
                <ScanLine size={13} />
                Stage {activePhaseIndex + 1} of 5
              </span>
              <h2 className="scrolly-main-title">{currentPhase.title}</h2>
            </div>

            {/* Interactive Step Scrubber Tabs */}
            <div className="phase-tabs-row" role="tablist" aria-label="Inspection Phases">
              {SCENE_PHASES.map((p, idx) => {
                const isActive = activePhaseIndex === idx;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`phase-tab-pill ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelectPhase(idx)}
                  >
                    <span className="tab-num">0{idx + 1}</span>
                    <span className="tab-name">{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="scrolly-canvas-viewport">
          <DocumentCanvas
            scrollProgress={scrollProgress}
            activePhase={activePhaseIndex}
            reducedMotion={reducedMotion}
            onSelectPhase={handleSelectPhase}
          />
        </div>

        {/* Floating Context Briefing Card Overlay */}
        <div className="container scrolly-context-overlay">
          <div className="context-card glass-panel">
            <div className="context-card-tagline">
              <span className="context-pulse-dot" />
              <span>{currentPhase.tagline}</span>
            </div>

            <p className="context-card-desc">{currentPhase.description}</p>

            {/* Phase-specific telemetry info */}
            <div className="context-telemetry-row">
              {activePhaseIndex === 0 && (
                <div className="telemetry-pill">
                  <Layers size={13} />
                  <span>4 Official Document Types Enclosed</span>
                </div>
              )}
              {activePhaseIndex === 1 && (
                <div className="telemetry-pill text-blue">
                  <Sparkles size={13} />
                  <span>Spatial, Safety, HR & Financial Layers Dissected</span>
                </div>
              )}
              {activePhaseIndex === 2 && (
                <div className="telemetry-pill text-blue">
                  <ScanLine size={13} />
                  <span>Scanning Ring Active • Sub-Millimeter Optical OCR</span>
                </div>
              )}
              {activePhaseIndex === 3 && (
                <div className="telemetry-pill text-red">
                  <AlertTriangle size={13} />
                  <span>Deficiency Tagged: Cadre Ratio (CSE Dept) Shortfall</span>
                </div>
              )}
              {activePhaseIndex === 4 && (
                <div className="telemetry-pill text-green">
                  <FileCheck2 size={13} />
                  <span>Assembled Dossier: 94.8% APH Compliance Ready</span>
                </div>
              )}

              {/* Scroll prompt guide */}
              <div className="scroll-hint-wrapper">
                <span>{scrollProgress < 0.9 ? 'Scroll to advance inspection' : 'Inspection complete'}</span>
                {scrollProgress < 0.9 && <ArrowDown size={14} className="bounce-arrow" />}
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Progress Bar along bottom */}
        <div className="scrolly-bottom-progress-track">
          <div
            className="scrolly-bottom-progress-bar"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
