import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { ScrollyHeroExperience } from './components/ScrollyHeroExperience';
import { WorkflowSection } from './components/WorkflowSection';
import { RegulatoryDashboard } from './components/RegulatoryDashboard/RegulatoryDashboard';
import { GovernanceNotice } from './components/GovernanceNotice';
import { Footer } from './components/Footer';
import './App.css';

export function App() {
  // Respect system reduced-motion preference by default, and allow manual toggle
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <AuthProvider>
      <div className={`app-root ${reducedMotion ? 'reduced-motion-mode' : ''}`}>
        {/* GLOBAL ROLE-BASED LOGIN & AUTHENTICATION MODAL */}
        <AuthModal />

        {/* 
          PART 1 & 2: FULL-SCREEN CINEMATIC 3D OPENING & 300vh SCROLL-CONTROLLED 3D CINEMATIC SEQUENCE
          - Stage A: Document Reveal (Full-viewport 3D opening with headline overlay)
          - Stage B: 3D Volumetric Layer Separation
          - Stage C: Intelligent Optical & Cadastral Scanning
          - Stage D: Evidence Verification & Anomaly Pinpoint
          - Stage E: Regulatory Synthesis & Transition into Dashboard
          (Note: The dashboard is NOT visible in the initial viewport)
        */}
        <ScrollyHeroExperience
          reducedMotion={reducedMotion}
          setReducedMotion={setReducedMotion}
        />

        {/* PART 4: 4-STAGE PIPELINE SUMMARY STRIP BRIDGING 3D STORY AND COCKPIT */}
        <WorkflowSection />

        {/* 
          PART 3: THE ACTUAL REGULATORY DASHBOARD APPEARS BELOW IN NORMAL DOCUMENT FLOW
          - Full institutional scrutiny interface with sidebar, queue, filters, and scrutiny modal
        */}
        <RegulatoryDashboard />

        {/* STATUTORY REGULATORY GOVERNANCE STATEMENT */}
        <GovernanceNotice />

        {/* INSTITUTIONAL FOOTER & SIH 2026 RESEARCH NOTICE */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

