import React, { useState, useEffect } from 'react';
import {
  checkBackendHealth,
  fetchApplications,
  uploadAndVerifyDocuments,
  fetchRegulatoryRules,
  updateRegulatoryRule,
  fetchAuditTrail,
  recordOfficerScrutinyAction,
  getExportDossierUrl,
  fetchNotifications,
  markNotificationRead,
  dispatchDeficiencyNotice,
  fetchAlerts,
  updateAlertStatus,
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

import {
  PROTOTYPE_METADATA,
  DEMO_APPLICATIONS,
  DEMO_DOCUMENTS,
  DEMO_AUTHORITY_VERIFICATIONS,
  DEMO_COMPLIANCE_CHECKS,
  DEMO_ALERTS,
  DEMO_NOTIFICATIONS,
  DEMO_AUDIT_LOG,
  DEMO_REGULATORY_RULES,
} from '../../data/mockData';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  Building,
  Scale,
  AlertTriangle,
  History,
  Sliders,
  Search,
  FileUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  UserCheck,
  X,
  ChevronLeft,
  Camera,
  Edit2,
  Save,
  Bell,
  Send,
  FileText,
  Mail,
  Smartphone,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';

export function RegulatoryDashboard() {
  // Sidebar Module Navigation (Exactly the 8 required modules in exact order)
  const [activeModule, setActiveModule] = useState('overview');

  // Backend Live Connectivity State
  const [backendConnected, setBackendConnected] = useState(false);

  // Application State
  const [applications, setApplications] = useState(DEMO_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Load from Live Backend on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendConnected(res.connected);
      if (res.connected) {
        fetchApplications().then((apps) => {
          if (apps && apps.length > 0) {
            setApplications(apps);
            setSelectedApp(apps[0]);
          }
        });
        fetchNotifications('ALL').then((notifs) => {
          if (notifs && notifs.length > 0) {
            setNotificationsList(notifs);
          }
        });
        fetchRegulatoryRules().then((rules) => {
          if (rules && rules.length > 0) {
            setRulesList(rules);
          }
        });
        fetchAuditTrail().then((audits) => {
          if (audits && audits.length > 0) {
            setAuditLogList(audits);
          }
        });
        fetchAlerts().then((alerts) => {
          if (alerts && alerts.length > 0) {
            setAlertsList(alerts);
          }
        });
      }
    });
  }, []);

  // Dynamic RBAC Authentication from Global Context
  const { currentUser, loginAsRole, setIsAuthModalOpen, setUnreadNotifCount } = useAuth();
  const currentRole = currentUser?.role || 'OFFICER';

  // Real-Time Notification Center Drawer State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState(DEMO_NOTIFICATIONS);
  const [activeNotifFilter, setActiveNotifFilter] = useState('ALL');

  // Interactive Live Anomaly Simulation for SIH Jury Demo
  const handleSimulateIncomingAlert = () => {
    const newAlert = {
      id: `NOTIF-LIVE-${Date.now().toString().slice(-4)}`,
      targetRole: currentRole === 'INSTITUTION' ? 'INSTITUTION' : 'OFFICER',
      category: 'VIGILANCE',
      priority: 'CRITICAL',
      title: '🚨 Live Vigilance Alert: Concurrent Biometric Collision',
      message: 'Pan-India Sentinel detected concurrent attendance punch for Dr. Amiteshwar Sharma (claimed at Indore & Bhopal concurrently).',
      appId: 'AICTE-2026-NRO-8841',
      institution: 'Apex Institute of Advanced Technology',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      read: false,
      actionType: 'VIGILANCE_REVIEW',
    };
    setNotificationsList((prev) => [newAlert, ...prev]);
    setActionRecordedFeedback('⚡ Live Radar Alert Injected: Real-Time Anomaly Pushed to Drawer!');
    setTimeout(() => setActionRecordedFeedback(null), 3500);
  };

  // Statutory Deficiency Notice Generator Modal State
  const [deficiencyModalOpen, setDeficiencyModalOpen] = useState(false);
  const [deficiencyNoticeTarget, setDeficiencyNoticeTarget] = useState(DEMO_APPLICATIONS[0]);
  const [deficiencyClause, setDeficiencyClause] = useState('APH 2026-27 Chapter VII Clause 7.1.3 & 7.1.4');
  const [deficiencyText, setDeficiencyText] = useState('Cadre ratio short 1 Professor in CSE Department and Dual-Affiliation Vigilance Flag identified.');
  const [deficiencyRectDays, setDeficiencyRectDays] = useState(15);
  const [isDispatchingNotice, setIsDispatchingNotice] = useState(false);
  const [noticeDispatchedFeedback, setNoticeDispatchedFeedback] = useState(null);

  // Reviewer Scrutiny Modal State (Section 12)
  const [scrutinyModalOpen, setScrutinyModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(DEMO_APPLICATIONS[0]);
  const [previewPage, setPreviewPage] = useState(4); // Default to Page 4 where anomaly is cited
  const [activeFindingHighlight, setActiveFindingHighlight] = useState(true);

  // Alerts State (Module 6)
  const [alertsList, setAlertsList] = useState(DEMO_ALERTS);

  // Audit Trail State (Module 7)
  const [auditLogList, setAuditLogList] = useState(DEMO_AUDIT_LOG);

  // Configurable Rules State (Module 8)
  const [rulesList, setRulesList] = useState(DEMO_REGULATORY_RULES);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editThresholdVal, setEditThresholdVal] = useState('');
  const [ruleSavedFeedback, setRuleSavedFeedback] = useState(false);

  // Document Upload State (Module 3)
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadResultFeedback, setUploadResultFeedback] = useState(null);

  // Reviewer Observation input state in scrutiny modal
  const [reviewerObsText, setReviewerObsText] = useState('');
  const [actionRecordedFeedback, setActionRecordedFeedback] = useState(null);

  // Handler for marking notification as read
  const handleMarkNotifRead = async (notifId) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
    await markNotificationRead(notifId);
  };

  // Handler for dispatching formal statutory deficiency notice
  const handleDispatchStatutoryNotice = async () => {
    setIsDispatchingNotice(true);
    const target = deficiencyNoticeTarget || selectedApp;
    
    const payload = {
      appId: target.id,
      institution: target.name,
      clause: deficiencyClause,
      deficiencyText: deficiencyText,
      rectificationDays: deficiencyRectDays,
    };
    
    const res = await dispatchDeficiencyNotice(payload);
    setIsDispatchingNotice(false);
    
    // Add new notification to local list
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      targetRole: 'INSTITUTION',
      category: 'DEFICIENCY',
      priority: 'HIGH',
      title: `Statutory Deficiency Memo #${res.noticeId || 'DEF-8841'} Issued`,
      message: `Formal notice issued regarding ${deficiencyClause}. Rectification undertaking mandatory within ${deficiencyRectDays} days.`,
      appId: target.id,
      institution: target.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      read: false,
      actionType: 'SUBMIT_RECTIFICATION',
    };
    setNotificationsList((prev) => [newNotif, ...prev]);
    
    // Update Application pending issues
    setApplications((prev) =>
      prev.map((a) =>
        a.id === target.id
          ? { ...a, status: 'Review Required', pendingIssues: `Deficiency Memo #${res.noticeId || 'DEF-8841'} Dispatched (15-Day Clock Active)` }
          : a
      )
    );
    
    setNoticeDispatchedFeedback(`Deficiency Memo #${res.noticeId || 'DEF-8841'} successfully dispatched to ${target.name} via AICTE National Portal & SMS!`);
    setTimeout(() => {
      setNoticeDispatchedFeedback(null);
      setDeficiencyModalOpen(false);
    }, 3200);
  };

  // Filtered notifications based on active role & tab
  const roleFilteredNotifs = notificationsList.filter((n) => {
    if (currentRole === 'DIRECTOR') return true;
    if (currentRole === 'INSTITUTION') return n.targetRole === 'INSTITUTION' || n.targetRole === 'ALL';
    return n.targetRole === 'OFFICER' || n.targetRole === 'ALL';
  });

  const tabFilteredNotifs = roleFilteredNotifs.filter((n) => {
    if (activeNotifFilter === 'ALL') return true;
    return n.category === activeNotifFilter;
  });

  const unreadNotifsCount = roleFilteredNotifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (setUnreadNotifCount) {
      setUnreadNotifCount(unreadNotifsCount);
    }
  }, [unreadNotifsCount, setUnreadNotifCount]);

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Verified' && app.status === 'Verified') ||
      (statusFilter === 'Review Required' && app.status === 'Review Required') ||
      (statusFilter === 'Deficient' && app.status === 'Deficient') ||
      (statusFilter === 'Processing' && app.status === 'Processing') ||
      (statusFilter === 'Submitted' && app.status === 'Submitted');

    const matchesCategory =
      categoryFilter === 'ALL' || app.category === categoryFilter;

    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Open Scrutiny Modal for specific application
  const handleOpenScrutiny = (app) => {
    setSelectedApp(app);
    // If Apex Institute, default to Page 4 where Cadre anomaly is located
    if (app.id === 'AICTE-2026-NRO-8841') {
      setPreviewPage(4);
      setActiveFindingHighlight(true);
    } else {
      setPreviewPage(1);
      setActiveFindingHighlight(false);
    }
    setScrutinyModalOpen(true);
  };

  // Reviewer Action handler (Section 12): updates state and appends to audit trail
  const handleReviewerAction = async (actionType, observation) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // 1. Append entry to Audit Trail
    const newAuditEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      appId: selectedApp.id,
      event: actionType,
      ruleOrSource: 'Reviewer Scrutiny Terminal',
      finding: observation || `Reviewer action: ${actionType}`,
      actionTaken: `Recorded: ${actionType}`,
      actorRole: PROTOTYPE_METADATA.userRole,
    };
    setAuditLogList([newAuditEntry, ...auditLogList]);

    // 2. Provide feedback
    setActionRecordedFeedback(`Action recorded: ${actionType} at ${timestamp}`);
    setTimeout(() => setActionRecordedFeedback(null), 3500);

    // Call live backend
    await recordOfficerScrutinyAction({
      appId: selectedApp.id,
      actionType,
      observation,
      actorRole: PROTOTYPE_METADATA.userRole,
    });

    // 3. Update application status if resolved or under review
    if (actionType === 'Resolved Finding') {
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, status: 'Verified', pendingIssues: 'Resolved by Scrutiny Officer' } : a))
      );
      setSelectedApp((prev) => ({ ...prev, status: 'Verified', pendingIssues: 'Resolved by Scrutiny Officer' }));
    } else if (actionType === 'Mark Under Review') {
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? { ...a, status: 'Review Required' } : a))
      );
      setSelectedApp((prev) => ({ ...prev, status: 'Review Required' }));
    }
  };

  // Alert Action Handler (Module 6)
  const handleAlertStatusChange = async (alertId, newStatus) => {
    setAlertsList((prev) =>
      prev.map((alt) => (alt.id === alertId ? { ...alt, status: newStatus } : alt))
    );

    const targetAlert = alertsList.find((a) => a.id === alertId);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const newAuditEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      appId: targetAlert ? targetAlert.appId : 'SYSTEM',
      event: 'Discrepancy Status Updated',
      ruleOrSource: targetAlert ? targetAlert.document : 'Alert Manager',
      finding: `Alert ${alertId} status marked as ${newStatus}`,
      actionTaken: `Status changed to ${newStatus}`,
      actorRole: PROTOTYPE_METADATA.userRole,
    };
    setAuditLogList([newAuditEntry, ...auditLogList]);

    // Persist to live backend
    await updateAlertStatus(alertId, newStatus);
  };

  // Rule Edit Handlers (Module 8)
  const handleStartEditRule = (rule) => {
    setEditingRuleId(rule.id);
    setEditThresholdVal(rule.thresholdValue);
  };

  const handleSaveRule = async (ruleId) => {
    setRulesList((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, thresholdValue: editThresholdVal, lastUpdated: '2026-10-23 (Session)' } : r))
    );
    setEditingRuleId(null);
    setRuleSavedFeedback(true);
    await updateRegulatoryRule(ruleId, editThresholdVal);
    setTimeout(() => setRuleSavedFeedback(false), 4000);
  };

  const handleToggleRuleStatus = async (ruleId) => {
    const target = rulesList.find((r) => r.id === ruleId);
    const newStatus = target?.status === 'Active' ? 'Inactive' : 'Active';
    setRulesList((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, status: newStatus } : r))
    );
    await updateRegulatoryRule(ruleId, undefined, newStatus);
  };

  // Upload Handlers (Module 3)
  const handleSimulateUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const name = file.name;
    setUploadFileName(name);
    setIsProcessingUpload(true);
    setUploadProgress(20);

    try {
      setUploadProgress(50);
      const liveResult = await uploadAndVerifyDocuments([file]);
      setUploadProgress(100);
      setIsProcessingUpload(false);
      setUploadResultFeedback(`Scrutiny Complete: Outcome [${liveResult.overall_recommendation}] - App ID: ${liveResult.application_id}`);

      // Refresh applications, alerts, and audit trail from live backend
      const [updatedApps, updatedAlerts, updatedAudits] = await Promise.all([
        fetchApplications(),
        fetchAlerts(),
        fetchAuditTrail(),
      ]);
      if (updatedApps && updatedApps.length > 0) setApplications(updatedApps);
      if (updatedAlerts && updatedAlerts.length > 0) setAlertsList(updatedAlerts);
      if (updatedAudits && updatedAudits.length > 0) setAuditLogList(updatedAudits);
    } catch (err) {
      console.warn('Live upload failed, running fallback simulation:', err);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessingUpload(false);
            setUploadResultFeedback('Simulated Upload Complete • Preliminary checks extracted 8 fields (Demo Mode)');
            return 100;
          }
          return prev + 25;
        });
      }, 350);
    }
  };

  // Dynamic Role-Specific Navigation Modules
  const institutionModules = [
    { id: 'overview', label: 'My Institution Status', icon: LayoutDashboard },
    { id: 'documents', label: 'My Uploaded Documents', icon: FileCheck2 },
    { id: 'alerts', label: 'Statutory Memos', icon: AlertTriangle, alertBadge: 1 },
    { id: 'compliance', label: 'APH Norms Self-Audit', icon: Scale },
    { id: 'authority', label: 'DigiLocker Verification', icon: Building },
  ];

  const officerModules = [
    { id: 'overview', label: 'Overview Cockpit', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications Queue', icon: FileSpreadsheet, countBadge: applications.length },
    { id: 'documents', label: 'Document Validation', icon: FileCheck2 },
    { id: 'authority', label: 'Authority Verification', icon: Building },
    { id: 'compliance', label: 'Compliance Review', icon: Scale },
    { id: 'alerts', label: 'Alerts & Deficiencies', icon: AlertTriangle, alertBadge: alertsList.length },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  const directorModules = [
    { id: 'overview', label: 'National Bureau Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Pan-India Applications', icon: FileSpreadsheet, countBadge: applications.length },
    { id: 'documents', label: 'Document Forensics', icon: FileCheck2 },
    { id: 'authority', label: 'DPI Verification Matrix', icon: Building },
    { id: 'compliance', label: 'Statutory Compliance Review', icon: Scale },
    { id: 'alerts', label: 'Vigilance & Anomaly Queue', icon: AlertTriangle, alertBadge: alertsList.length },
    { id: 'audit', label: 'Immutable Audit History', icon: History },
    { id: 'rules', label: 'Regulatory Rules Configurator', icon: Sliders },
  ];

  const currentNavModules =
    currentRole === 'INSTITUTION'
      ? institutionModules
      : currentRole === 'DIRECTOR'
      ? directorModules
      : officerModules;

  // Auto-switch to overview if the active module is outside the current role's scope
  useEffect(() => {
    const validIds = currentNavModules.map((m) => m.id);
    if (!validIds.includes(activeModule)) {
      setActiveModule('overview');
    }
  }, [currentRole]);

  // Dynamic Module titles mapping based on role
  const moduleTitles = {
    overview: currentRole === 'INSTITUTION'
      ? 'Apex Institute of Advanced Technology • EoA Scrutiny & Approval Portal'
      : (currentRole === 'DIRECTOR' ? 'National Regulatory Governance Cockpit' : 'Regulatory Overview Dashboard'),
    applications: currentRole === 'DIRECTOR' ? 'Pan-India Technical Institution Applications' : 'Technical Institution Applications Queue',
    documents: currentRole === 'INSTITUTION' ? 'Institution Uploaded Documents & Cadastral Verification' : 'Document Validation & Completeness Review',
    authority: currentRole === 'INSTITUTION' ? 'DigiLocker & Revenue Registry DPI Verification' : 'Issuing-Authority Cross-Verification Matrix',
    compliance: currentRole === 'INSTITUTION' ? 'Institutional APH 2026-27 Norms Self-Audit Matrix' : 'Regulatory Compliance & Ratio Review Matrix',
    alerts: currentRole === 'INSTITUTION' ? 'Statutory Deficiency Memos & Rectification Undertakings' : 'Unresolved Alerts and Deficiency Queue',
    audit: 'Prototype Audit Trail & Activity History',
    rules: 'Configurable Regulatory Verification Rules (Approval Process Handbook)',
  };

  return (
    <section
      id="regulatory-dashboard"
      className="regulatory-dashboard-section"
      aria-labelledby="dashboard-main-heading"
    >
      <div className="container">
        {/* Government Regulation Bureau Header Banner */}
        <div className="dashboard-demo-banner glass-panel">
          <div className="demo-banner-content">
            <span className="badge-institutional badge-saffron">
              Prototype Verification Environment
            </span>
            <span className="demo-banner-text">
              <strong>SIH 2026 PROBLEM STATEMENT 26261:</strong> AI-Powered Application Validation,
              Document Authentication and Regulatory Compliance Verification.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {backendConnected ? (
              <span className="badge-institutional" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
                ● Live FastAPI Engine Connected
              </span>
            ) : (
              <span className="badge-institutional" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde047' }}>
                ○ Offline Demo Mode
              </span>
            )}
            <span className="badge-institutional">
              {currentRole === 'INSTITUTION' ? 'Apex Institute Portal' : 'AICTE Regulation Bureau'}
            </span>
          </div>
        </div>

        {/* Dashboard Frame: Compact Left Sidebar + Main Regulatory Workspace */}
        <div className="dashboard-shell-card glass-panel">
          {/* A. COMPACT LEFT SIDEBAR (DYNAMIC PER ROLE) */}
          <aside className="dashboard-sidebar" aria-label="Regulatory Modules">
            {/* Bureau Branding */}
            <div className="sidebar-brand-box">
              <div className="sidebar-emblem">
                {currentRole === 'INSTITUTION' ? (
                  <Building size={20} className="text-green" />
                ) : (
                  <Building size={20} className="text-blue" />
                )}
              </div>
              <div className="sidebar-brand-text">
                <span className="sidebar-title">PRAGYAN-AICTE</span>
                <span className="sidebar-sub">
                  {currentRole === 'INSTITUTION' ? 'Institutional Self-Check' : 'Regulation Bureau'}
                </span>
              </div>
            </div>

            {/* Role-Specific Navigation Modules */}
            <nav className="sidebar-nav-list" role="tablist" aria-label="Sidebar Modules">
              {currentNavModules.map((mod) => {
                const IconComponent = mod.icon;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    role="tab"
                    aria-selected={activeModule === mod.id}
                    className={`sidebar-nav-item ${activeModule === mod.id ? 'active' : ''}`}
                    onClick={() => setActiveModule(mod.id)}
                  >
                    <IconComponent size={17} />
                    <span>{mod.label}</span>
                    {mod.countBadge !== undefined && (
                      <span className="sidebar-count-badge">{mod.countBadge}</span>
                    )}
                    {mod.alertBadge !== undefined && (
                      <span className="sidebar-alert-badge">{mod.alertBadge}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Dynamic Role-Based Authentication & Persona Indicator */}
            <div
              className="sidebar-officer-card"
              onClick={() => setIsAuthModalOpen(true)}
              style={{ cursor: 'pointer', transition: 'all 0.2s', padding: '10px 12px', borderRadius: '8px' }}
              title="Click to Switch Role Persona or Sign In"
            >
              <div className="officer-role-avatar" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentUser?.avatar || '👔'}
              </div>
              <div className="officer-details">
                <span className="officer-role-title">
                  {currentUser?.name || 'Dr. Rajesh Verma'}
                </span>
                <span className="officer-workspace-tag">
                  {currentUser?.roleLabel || 'AICTE Scrutiny Officer'}
                </span>
              </div>
            </div>
          </aside>

          {/* B. MAIN REGULATORY WORKSPACE AREA */}
          <main className="dashboard-main-area">
            {/* Workspace Top Header Bar */}
            <header className="workspace-header-bar">
              <div className="workspace-title-col">
                <span className="workspace-meta-tag">
                  {currentRole === 'INSTITUTION'
                    ? 'Institutional Self-Check & Rectification Portal • Apex Inst. (AICTE-2026-NRO-8841)'
                    : currentRole === 'DIRECTOR'
                    ? 'National Regulatory Governance Cockpit'
                    : PROTOTYPE_METADATA.workspaceLabel}
                </span>
                <h2 id="dashboard-main-heading" className="workspace-title-text">
                  {moduleTitles[activeModule]}
                </h2>
              </div>

              {/* Actions Header Bar */}
              <div className="workspace-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* 1-Click Role Switcher (RBAC Persona Switcher) */}
                <div
                  className="role-switcher-box"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f1f5f9',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  <UserCheck size={14} className="text-blue" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#475569' }}>Role:</span>
                  <select
                    value={currentRole}
                    onChange={(e) => {
                      const newR = e.target.value;
                      loginAsRole(newR);
                      setActionRecordedFeedback(`RBAC Active: Switched to ${newR === 'OFFICER' ? 'Scrutiny Officer' : (newR === 'INSTITUTION' ? 'College Applicant Portal (Apex Inst.)' : 'Regional Director Governance')}`);
                      setTimeout(() => setActionRecordedFeedback(null), 3000);
                    }}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'transparent',
                      border: 'none',
                      color: '#0f2b48',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                    id="select-role-persona"
                  >
                    <option value="OFFICER">👔 Scrutiny Officer</option>
                    <option value="INSTITUTION">🏛️ College Applicant (Apex Inst.)</option>
                    <option value="DIRECTOR">⚖️ Regional Director / Admin</option>
                  </select>
                </div>

                {/* Open Full Auth Modal Button */}
                <button
                  type="button"
                  className="btn-secondary header-action-btn"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Open Central AICTE Login Gateway"
                >
                  <ShieldCheck size={14} className="text-blue" />
                  <span>SSO Login</span>
                </button>

                {/* Real-Time Notification Bell Button */}
                <button
                  type="button"
                  className="btn-secondary header-action-btn"
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  id="btn-notifications-drawer"
                  title="Open Real-Time Notification Center"
                >
                  <Bell size={15} />
                  <span>Alerts</span>
                  {unreadNotifsCount > 0 && (
                    <span
                      style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        borderRadius: '999px',
                        padding: '1px 6px',
                        lineHeight: '1.2'
                      }}
                    >
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Role-Specific Action Buttons */}
                {currentRole === 'INSTITUTION' ? (
                  <>
                    <button
                      type="button"
                      className="btn-primary header-action-btn"
                      style={{ background: '#047857', borderColor: '#047857' }}
                      onClick={() => setUploadModalOpen(true)}
                      id="btn-inst-upload-undertaking"
                    >
                      <FileUp size={15} />
                      <span>Submit Rectification Undertaking</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary header-action-btn"
                      onClick={() => handleOpenScrutiny(applications[0])}
                      id="btn-inst-view-dossier"
                    >
                      <Eye size={15} />
                      <span>View My EoA Dossier</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-secondary header-action-btn"
                      onClick={() => {
                        setDeficiencyNoticeTarget(selectedApp);
                        setDeficiencyModalOpen(true);
                      }}
                      id="btn-issue-deficiency-notice"
                      title="Draft Formal Statutory Deficiency Memo"
                    >
                      <FileText size={15} />
                      <span>Issue Deficiency Memo</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary header-action-btn"
                      onClick={() => setUploadModalOpen(true)}
                      id="btn-upload-dossier"
                    >
                      <FileUp size={15} />
                      <span>Upload Document</span>
                    </button>
                    <button
                      type="button"
                      className="btn-primary header-action-btn"
                      onClick={() => handleOpenScrutiny(applications[0])}
                      id="btn-featured-scrutiny"
                    >
                      <Eye size={15} />
                      <span>Open Scrutiny View</span>
                    </button>
                  </>
                )}
              </div>
            </header>

            {/* ===============================================================
                MODULE 1: OVERVIEW DASHBOARD (ROLE-ADAPTIVE)
                =============================================================== */}
            {activeModule === 'overview' && currentRole === 'INSTITUTION' && (
              <div className="module-content-pane">
                {/* 1. Official College Banner Card */}
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '18px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                        🏛️
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f2b48' }}>
                            Apex Institute of Advanced Technology & Research
                          </h3>
                          <span className="badge-institutional badge-saffron" style={{ fontSize: '0.68rem' }}>
                            Permanent ID: 1-88419201
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                          Bhopal, Madhya Pradesh • Northern Regional Office (NRO) • AY 2026-27 Extension of Approval (EoA)
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde047', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                        ⚠️ Status: Review Required (Deficiency Clock Active)
                      </span>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleOpenScrutiny(applications[0])}
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        <Eye size={14} />
                        <span>View My AICTE Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Prominent Statutory Deficiency Memo Card with Countdown Clock */}
                <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '2px solid #f59e0b', borderRadius: '12px', padding: '18px 20px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <AlertTriangle size={18} className="text-amber" />
                        <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#92400e' }}>
                          Statutory Deficiency Memo #DEF-8841 Issued by AICTE Scrutiny Committee
                        </h4>
                        <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                          ACTION MANDATORY
                        </span>
                      </div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#78350f', lineHeight: 1.5, maxWidth: '780px' }}>
                        <strong>Finding Clause APH 7.1.3 & 7.1.4:</strong> Cadre ratio short 1 Professor in CSE Department (Observed 1:1:10 vs 1:2:6 statutory norm). Additionally, Dr. Amiteshwar Sharma is flagged for impossible concurrent affiliation at Malwa Institute (192 km away).
                      </p>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.75rem', color: '#92400e' }}>
                        <span><strong>Dispatched To:</strong> principal@apex.edu.in & Registered Mobile SMS</span>
                        <span>•</span>
                        <span><strong>Rectification Deadline:</strong> 15 Calendar Days from 2026-10-23</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <div style={{ background: '#ffffff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fde047', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Cure Undertaking Clock</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#b45309' }}>15 DAYS REMAINING</div>
                      </div>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => setUploadModalOpen(true)}
                        style={{ background: '#b45309', borderColor: '#b45309', padding: '8px 16px', fontSize: '0.8rem' }}
                      >
                        <FileUp size={15} />
                        <span>Upload Rectification Undertaking</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Four Institutional Key Health Metrics */}
                <div className="overview-cards-row">
                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box bg-green">
                      <CheckCircle2 size={20} className="text-green" />
                    </div>
                    <div className="kpi-meta">
                      <span className="kpi-label">DPI Land Registry Status</span>
                      <span className="kpi-number text-green">8.24 Acres</span>
                      <span className="kpi-trend">Verified via DigiLocker • Unencumbered</span>
                    </div>
                  </div>

                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box bg-green">
                      <CheckCircle2 size={20} className="text-green" />
                    </div>
                    <div className="kpi-meta">
                      <span className="kpi-label">Fire & Life Safety NOC</span>
                      <span className="kpi-number text-green">Valid 2027</span>
                      <span className="kpi-trend">Capacity 1,500 Persons • Certified</span>
                    </div>
                  </div>

                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box bg-red">
                      <AlertTriangle size={20} className="text-red" />
                    </div>
                    <div className="kpi-meta">
                      <span className="kpi-label">Cadre Ratio Balance</span>
                      <span className="kpi-number text-red">Deficit: 1</span>
                      <span className="kpi-trend">Short 1 Professor in CSE • Action Pending</span>
                    </div>
                  </div>

                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box">
                      <FileCheck2 size={20} className="text-blue" />
                    </div>
                    <div className="kpi-meta">
                      <span className="kpi-label">Submitted EoA Documents</span>
                      <span className="kpi-number">7 / 8</span>
                      <span className="kpi-trend">7 Auto-Cleared • 1 Undertaking Required</span>
                    </div>
                  </div>
                </div>

                {/* 4. Pre-Flight Self-Check Scanner Banner */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#0f2b48' }}>
                        Instant Pre-Flight Document Self-Check & Validation
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                        Upload revised faculty appointment letters, fire NOC renewals, or resolution affidavits to simulate automated OCR, ELA tampering checks, and APH norm verification prior to formal committee review.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setUploadModalOpen(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FileUp size={14} />
                      <span>Launch Pre-Flight Test Scanner</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* OFFICER / DIRECTOR OVERVIEW DASHBOARD */}
            {activeModule === 'overview' && currentRole !== 'INSTITUTION' && (
              <div className="module-content-pane">
                {/* 4 Summary Cards (With Demo Data Label) */}
                <div className="overview-cards-row">
                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box">
                      <FileSpreadsheet size={20} className="text-blue" />
                    </div>
                    <div className="kpi-meta">
                      <div className="kpi-label-row">
                        <span className="kpi-label">Total Applications</span>
                      </div>
                      <span className="kpi-number">{applications.length}</span>
                      <span className="kpi-trend">Consistent Prototype Dataset</span>
                    </div>
                  </div>

                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box bg-green">
                      <CheckCircle2 size={20} className="text-green" />
                    </div>
                    <div className="kpi-meta">
                      <div className="kpi-label-row">
                        <span className="kpi-label">Verified Documents</span>
                      </div>
                      <span className="kpi-number text-green">18</span>
                      <span className="kpi-trend">Completed Preliminary Checks</span>
                    </div>
                  </div>

                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box bg-amber">
                      <AlertTriangle size={20} className="text-amber" />
                    </div>
                    <div className="kpi-meta">
                      <div className="kpi-label-row">
                        <span className="kpi-label">Applications Requiring Review</span>
                      </div>
                      <span className="kpi-number text-amber">
                        {applications.filter((a) => a.status === 'Review Required').length}
                      </span>
                      <span className="kpi-trend">Discrepancies Flagged for Officer</span>
                    </div>
                  </div>

                  <div className="kpi-card glass-panel">
                    <div className="kpi-icon-box bg-red">
                      <Clock size={20} className="text-red" />
                    </div>
                    <div className="kpi-meta">
                      <div className="kpi-label-row">
                        <span className="kpi-label">Open Deficiencies</span>
                      </div>
                      <span className="kpi-number text-red">
                        {applications.filter((a) => a.status === 'Deficient').length}
                      </span>
                      <span className="kpi-trend">Statutory Requirement Gap</span>
                    </div>
                  </div>
                </div>

                {/* 4 Detail Columns Derived from Same Consistent Dataset */}
                <div className="overview-four-grid">
                  {/* Recent Applications */}
                  <div className="overview-panel glass-panel">
                    <div className="panel-header-sm">
                      <FileSpreadsheet size={15} className="text-blue" />
                      <h4 className="panel-heading">Recent Applications</h4>
                      <span className="demo-chip">Demo</span>
                    </div>
                    <div className="panel-list-sm">
                      {applications.slice(0, 4).map((app) => (
                        <div
                          key={app.id}
                          className="panel-list-item clickable"
                          onClick={() => handleOpenScrutiny(app)}
                        >
                          <div className="item-main-text">
                            <span className="item-title">{app.name}</span>
                            <span className="item-sub">{app.id} • {app.category}</span>
                          </div>
                          <span
                            className={`badge-status ${
                              app.status === 'Verified'
                                ? 'compliant'
                                : app.status === 'Review Required'
                                ? 'warning'
                                : 'deficiency'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Verification */}
                  <div className="overview-panel glass-panel">
                    <div className="panel-header-sm">
                      <Building size={15} className="text-blue" />
                      <h4 className="panel-heading">Pending Verification</h4>
                      <span className="demo-chip">Demo</span>
                    </div>
                    <div className="panel-list-sm">
                      {DEMO_AUTHORITY_VERIFICATIONS.filter((v) => v.status !== 'Verified').map((v) => (
                        <div key={v.id} className="panel-list-item">
                          <div className="item-main-text">
                            <span className="item-title">{v.document}</span>
                            <span className="item-sub">{v.authority}</span>
                          </div>
                          <span className="badge-status warning">{v.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Discrepancies */}
                  <div className="overview-panel glass-panel">
                    <div className="panel-header-sm">
                      <AlertTriangle size={15} className="text-red" />
                      <h4 className="panel-heading">Critical Discrepancies</h4>
                      <span className="demo-chip">Demo</span>
                    </div>
                    <div className="panel-list-sm">
                      {alertsList.map((alt) => (
                        <div key={alt.id} className="panel-list-item">
                          <div className="item-main-text">
                            <span className="item-title">{alt.institution}</span>
                            <span className="item-sub">{alt.reason}</span>
                          </div>
                          <span className="badge-status deficiency">{alt.severity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Audit Activity */}
                  <div className="overview-panel glass-panel">
                    <div className="panel-header-sm">
                      <History size={15} className="text-blue" />
                      <h4 className="panel-heading">Recent Audit Activity</h4>
                      <span className="demo-chip">Demo</span>
                    </div>
                    <div className="panel-list-sm">
                      {auditLogList.slice(0, 4).map((log) => (
                        <div key={log.id} className="panel-list-item">
                          <div className="item-main-text">
                            <span className="item-title">{log.event}</span>
                            <span className="item-sub">{log.appId} • {log.timestamp.slice(11, 19)}</span>
                          </div>
                          <span className="badge-status compliant">{log.actorRole.slice(0, 15)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                MODULE 2: APPLICATIONS MODULE (SECTION 5)
                =============================================================== */}
            {activeModule === 'applications' && (
              <div className="module-content-pane">
                {/* Search & Status Filters */}
                <div className="queue-controls-bar">
                  <div className="queue-search-box">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by Institution, Application ID, or City..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                      aria-label="Search applications"
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} className="clear-search-btn">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="category-select-wrapper">
                    <select
                      className="category-dropdown"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      aria-label="Filter by Application Category"
                    >
                      <option value="ALL">All Application Categories</option>
                      <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                      <option value="Change in Approved Intake">Change in Approved Intake</option>
                      <option value="Introduction of New Course">Introduction of New Course</option>
                      <option value="Closure of Course or Department">Closure of Course or Department</option>
                    </select>
                  </div>

                  {/* Status Filters */}
                  <div className="queue-status-filters" role="tablist">
                    {['ALL', 'Verified', 'Review Required', 'Deficient', 'Processing', 'Submitted'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`status-tab ${statusFilter === st ? 'active' : ''}`}
                        onClick={() => setStatusFilter(st)}
                      >
                        {st === 'ALL' ? `All (${applications.length})` : st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applications Table */}
                <div className="queue-table-card glass-panel">
                  <div className="queue-table-scroll">
                    <table className="queue-table" aria-label="Applications Queue">
                      <thead>
                        <tr>
                          <th scope="col">Application ID</th>
                          <th scope="col">Institution Name</th>
                          <th scope="col">Application Category</th>
                          <th scope="col">Submission Date</th>
                          <th scope="col">Documents</th>
                          <th scope="col">Validation Status</th>
                          <th scope="col">Pending Issues</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApps.map((app) => (
                          <tr
                            key={app.id}
                            className={`queue-table-row ${app.featured ? 'featured-row' : ''}`}
                            onClick={() => handleOpenScrutiny(app)}
                          >
                            <td className="code-cell">
                              <code>{app.id}</code>
                            </td>
                            <td className="inst-cell">
                              <strong>{app.name}</strong>
                              <span className="inst-meta-line">{app.city}</span>
                            </td>
                            <td className="type-cell">
                              <span className="type-main">{app.category}</span>
                            </td>
                            <td className="date-cell">{app.submittedDate}</td>
                            <td className="docs-cell">
                              <span className="docs-ratio-tag">
                                {app.documentsVerified} / {app.documentsSubmitted} Verified
                              </span>
                            </td>
                            <td className="status-cell">
                              <span
                                className={`badge-status ${
                                  app.status === 'Verified'
                                    ? 'compliant'
                                    : app.status === 'Review Required'
                                    ? 'warning'
                                    : app.status === 'Deficient'
                                    ? 'deficiency'
                                    : 'neutral'
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="issues-cell">
                              <span className="issue-text-snippet">{app.pendingIssues}</span>
                            </td>
                            <td className="action-cell">
                              <button
                                type="button"
                                className="btn-secondary queue-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenScrutiny(app);
                                }}
                              >
                                <span>Open Scrutiny</span>
                                <ChevronRight size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                MODULE 3: DOCUMENT VALIDATION MODULE (SECTION 6)
                =============================================================== */}
            {activeModule === 'documents' && (
              <div className="module-content-pane">
                {/* Upload Entry Point Card */}
                <div className="doc-upload-banner glass-panel">
                  <div className="upload-banner-text">
                    <h4 className="upload-title">Document Ingestion & File Validation</h4>
                    <p className="upload-sub">
                      Upload institutional PDF annexures to run simulated layout extraction and cross-check completeness.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setUploadModalOpen(true)}
                  >
                    <FileUp size={16} />
                    <span>Select PDF Document</span>
                  </button>
                </div>

                {/* Document Review Checklist Table */}
                <div className="queue-table-card glass-panel" style={{ marginTop: '20px' }}>
                  <div className="panel-table-header">
                    <span className="table-header-title">Document Extraction & Review Status</span>
                    <span className="demo-chip">Application: AICTE-2026-NRO-8841 (Demo Case)</span>
                  </div>
                  <div className="queue-table-scroll">
                    <table className="queue-table" aria-label="Document Review Checklist">
                      <thead>
                        <tr>
                          <th scope="col">Document Name & Type</th>
                          <th scope="col">Extraction Status</th>
                          <th scope="col">Checklist Status</th>
                          <th scope="col">Missing Fields</th>
                          <th scope="col">Inconsistencies</th>
                          <th scope="col">Evidence Ref</th>
                          <th scope="col">Review Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_DOCUMENTS.map((doc) => (
                          <tr key={doc.id}>
                            <td>
                              <strong>{doc.name}</strong>
                              <span className="inst-meta-line">{doc.type} • {doc.refNumber}</span>
                            </td>
                            <td>
                              <span className="badge-status compliant">{doc.extractionStatus}</span>
                            </td>
                            <td>
                              <span className={`badge-status ${doc.requiredStatus === 'Complete' ? 'compliant' : 'warning'}`}>
                                {doc.requiredStatus}
                              </span>
                            </td>
                            <td>{doc.missingFields}</td>
                            <td>
                              <span className={doc.hasAnomaly ? 'text-danger' : ''}>
                                {doc.inconsistencies}
                              </span>
                            </td>
                            <td>
                              <code>{doc.evidenceRef}</code>
                              <span className="inst-meta-line">{doc.pageNumber}</span>
                            </td>
                            <td>
                              <span
                                className={`badge-status ${
                                  doc.reviewStatus === 'Verified' ? 'compliant' : 'warning'
                                }`}
                              >
                                {doc.reviewStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                MODULE 4: AUTHORITY VERIFICATION MODULE (SECTION 7)
                =============================================================== */}
            {activeModule === 'authority' && (
              <div className="module-content-pane">
                <div className="queue-table-card glass-panel">
                  <div className="panel-table-header">
                    <span className="table-header-title">Issuing-Authority Cross-Verification Matrix</span>
                    <span className="demo-chip">Demo Verification Sources</span>
                  </div>
                  <div className="queue-table-scroll">
                    <table className="queue-table" aria-label="Authority Verification">
                      <thead>
                        <tr>
                          <th scope="col">Document</th>
                          <th scope="col">Issuing Authority</th>
                          <th scope="col">Reference Number</th>
                          <th scope="col">Verification Method</th>
                          <th scope="col">Source</th>
                          <th scope="col">Last Checked</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_AUTHORITY_VERIFICATIONS.map((auth) => (
                          <tr key={auth.id}>
                            <td><strong>{auth.document}</strong></td>
                            <td>{auth.authority}</td>
                            <td><code>{auth.refNumber}</code></td>
                            <td>
                              <span className="method-pill">{auth.method}</span>
                            </td>
                            <td>
                              <span className="demo-source-tag">{auth.source}</span>
                            </td>
                            <td className="date-cell">{auth.lastChecked}</td>
                            <td>
                              <span
                                className={`badge-status ${
                                  auth.status === 'Verified'
                                    ? 'compliant'
                                    : auth.status === 'Mismatch Detected' || auth.status === 'Expired'
                                    ? 'deficiency'
                                    : 'warning'
                                }`}
                              >
                                {auth.status}
                              </span>
                            </td>
                            <td>
                              <span className="action-required-text">{auth.actionRequired}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                MODULE 5: COMPLIANCE REVIEW MODULE (SECTION 8)
                =============================================================== */}
            {activeModule === 'compliance' && (
              <div className="module-content-pane">
                {/* Structured Compliance Matrix */}
                <div className="queue-table-card glass-panel">
                  <div className="panel-table-header">
                    <span className="table-header-title">Codified Regulatory Requirement Check Matrix</span>
                    <span className="demo-chip">Configurable Demo Rules (APH 2026-27)</span>
                  </div>
                  <div className="queue-table-scroll">
                    <table className="queue-table" aria-label="Compliance Matrix">
                      <thead>
                        <tr>
                          <th scope="col">Requirement</th>
                          <th scope="col">Applicable Rule</th>
                          <th scope="col">Submitted Evidence</th>
                          <th scope="col">Observed Value</th>
                          <th scope="col">Expected Value</th>
                          <th scope="col">Result</th>
                          <th scope="col">Evidence Reference</th>
                          <th scope="col">Reviewer Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DEMO_COMPLIANCE_CHECKS.map((cmp) => (
                          <tr key={cmp.id} className={cmp.result === 'Potential Discrepancy' ? 'row-deficient' : ''}>
                            <td><strong>{cmp.requirement}</strong></td>
                            <td><code>{cmp.applicableRule}</code></td>
                            <td>{cmp.submittedEvidence}</td>
                            <td>
                              <span className={cmp.result === 'Potential Discrepancy' ? 'text-danger font-mono' : 'font-mono'}>
                                {cmp.observedValue}
                              </span>
                            </td>
                            <td><span className="font-mono">{cmp.expectedValue}</span></td>
                            <td>
                              <span
                                className={`badge-status ${
                                  cmp.result === 'Evidence Present' ? 'compliant' : 'deficiency'
                                }`}
                              >
                                {cmp.result}
                              </span>
                            </td>
                            <td><code>{cmp.evidenceRef}</code></td>
                            <td>
                              <span className="reviewer-action-note">{cmp.reviewerAction}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Infrastructure Evidence Area (Section 8) */}
                <div className="infra-evidence-box glass-panel" style={{ marginTop: '24px' }}>
                  <div className="infra-evidence-header">
                    <div className="infra-title-group">
                      <Camera size={18} className="text-blue" />
                      <h4 className="infra-title">Infrastructure Evidence & Visual Verification Area</h4>
                    </div>
                    <span className="demo-chip">Computer-Vision Observation: Advisory Indicator Only</span>
                  </div>

                  <p className="infra-disclaimer">
                    <strong>Advisory Note:</strong> Automated image analysis and optical extraction provide
                    preliminary checks for classroom boundaries, lab layouts, and fire exits. Physical infrastructure
                    compliance is subject to inspection committee verification.
                  </p>

                  <div className="infra-cards-grid">
                    <div className="infra-card">
                      <div className="infra-card-badge">CAD Blueprint Match</div>
                      <span className="infra-card-title">Sanctioned Floor Plan 412/1</span>
                      <span className="infra-card-meta">42 Classrooms @ 68 sq.m average • NBC Egress Compliant</span>
                    </div>

                    <div className="infra-card">
                      <div className="infra-card-badge">GIS Cadastre Match</div>
                      <span className="infra-card-title">Satellite Boundary Polygon</span>
                      <span className="infra-card-meta">Single Contiguous 8.24 Acres • Zero Public Thoroughfares</span>
                    </div>

                    <div className="infra-card">
                      <div className="infra-card-badge">Hydrant Pressure Audit</div>
                      <span className="infra-card-title">Fire Ring Pipeline NOC</span>
                      <span className="infra-card-meta">100,000L Dedicated Reservoir • Pressure 3.5 Bar OK</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                MODULE 6: ALERTS AND DEFICIENCIES MODULE (SECTION 9)
                =============================================================== */}
            {activeModule === 'alerts' && (
              <div className="module-content-pane">
                <div className="queue-table-card glass-panel">
                  <div className="panel-table-header">
                    <span className="table-header-title">Unresolved Alerts & Potential Anomalies Queue</span>
                    <span className="demo-chip">{alertsList.length} Active Items</span>
                  </div>
                  <div className="queue-table-scroll">
                    <table className="queue-table" aria-label="Alerts Queue">
                      <thead>
                        <tr>
                          <th scope="col">Severity</th>
                          <th scope="col">Application ID</th>
                          <th scope="col">Institution</th>
                          <th scope="col">Relevant Document</th>
                          <th scope="col">Reason & Finding</th>
                          <th scope="col">Evidence Reference</th>
                          <th scope="col">Current Status</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Reviewer Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alertsList.map((alt) => (
                          <tr key={alt.id} className={alt.status === 'Resolved' ? 'row-resolved' : ''}>
                            <td>
                              <span
                                className={`badge-status ${
                                  alt.severity === 'High Priority'
                                    ? 'deficiency'
                                    : alt.severity === 'Warning'
                                    ? 'warning'
                                    : 'neutral'
                                }`}
                              >
                                {alt.severity}
                              </span>
                            </td>
                            <td><code>{alt.appId}</code></td>
                            <td><strong>{alt.institution}</strong></td>
                            <td>{alt.document}</td>
                            <td>{alt.reason}</td>
                            <td><code>{alt.evidenceRef}</code></td>
                            <td>
                              <span className="badge-status warning">{alt.status}</span>
                            </td>
                            <td className="action-cell" style={{ textAlign: 'right' }}>
                              <div className="alert-action-btn-group">
                                <button
                                  type="button"
                                  className="btn-tiny"
                                  onClick={() => handleAlertStatusChange(alt.id, 'Under Review')}
                                >
                                  Under Review
                                </button>
                                <button
                                  type="button"
                                  className="btn-tiny"
                                  onClick={() => handleAlertStatusChange(alt.id, 'Evidence Requested')}
                                >
                                  Request Evidence
                                </button>
                                <button
                                  type="button"
                                  className="btn-tiny btn-tiny-green"
                                  onClick={() => handleAlertStatusChange(alt.id, 'Resolved')}
                                >
                                  Resolve
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                MODULE 7: AUDIT TRAIL MODULE (SECTION 10)
                =============================================================== */}
            {activeModule === 'audit' && (
              <div className="module-content-pane">
                <div className="queue-table-card glass-panel">
                  <div className="panel-table-header">
                    <span className="table-header-title">Chronological Activity History</span>
                    <span className="demo-chip">Prototype Audit Log (Local Demo State)</span>
                  </div>
                  <div className="queue-table-scroll">
                    <table className="queue-table" aria-label="Audit Log">
                      <thead>
                        <tr>
                          <th scope="col">Timestamp (UTC)</th>
                          <th scope="col">Application ID</th>
                          <th scope="col">Event</th>
                          <th scope="col">Rule or Source Checked</th>
                          <th scope="col">Finding</th>
                          <th scope="col">Action Taken</th>
                          <th scope="col">Actor Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogList.map((log) => (
                          <tr key={log.id}>
                            <td className="date-cell"><code>{log.timestamp}</code></td>
                            <td><code>{log.appId}</code></td>
                            <td>
                              <span className="audit-event-chip">{log.event}</span>
                            </td>
                            <td>{log.ruleOrSource}</td>
                            <td>{log.finding}</td>
                            <td>{log.actionTaken}</td>
                            <td>
                              <span className="actor-badge">{log.actorRole}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                MODULE 8: REGULATORY RULES MODULE (SECTION 11)
                =============================================================== */}
            {activeModule === 'rules' && (
              <div className="module-content-pane">
                {/* Feedback Toast */}
                {ruleSavedFeedback && (
                  <div className="rule-toast-notice">
                    <CheckCircle2 size={16} className="text-green" />
                    <span>Rule threshold saved locally in prototype session. Awaiting validation-engine recalculation.</span>
                  </div>
                )}

                <div className="queue-table-card glass-panel">
                  <div className="panel-table-header">
                    <span className="table-header-title">Configurable Regulatory Rules</span>
                    <span className="demo-chip">Illustrative Sample Rules • Editable for Demo</span>
                  </div>
                  <div className="queue-table-scroll">
                    <table className="queue-table" aria-label="Regulatory Rules">
                      <thead>
                        <tr>
                          <th scope="col">Rule ID</th>
                          <th scope="col">Rule Name</th>
                          <th scope="col">Application Category</th>
                          <th scope="col">Threshold / Condition</th>
                          <th scope="col">Source Reference</th>
                          <th scope="col">Status</th>
                          <th scope="col">Last Updated</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rulesList.map((rule) => {
                          const isEditing = editingRuleId === rule.id;
                          return (
                            <tr key={rule.id}>
                              <td><code>{rule.id}</code></td>
                              <td><strong>{rule.name}</strong></td>
                              <td><span className="category-tag">{rule.category}</span></td>
                              <td>
                                {isEditing ? (
                                  <div className="inline-edit-box">
                                    <input
                                      type="text"
                                      value={editThresholdVal}
                                      onChange={(e) => setEditThresholdVal(e.target.value)}
                                      className="inline-input"
                                    />
                                    <span className="unit-label">{rule.thresholdUnit || rule.unit}</span>
                                    <button
                                      type="button"
                                      className="btn-tiny btn-tiny-green"
                                      onClick={() => handleSaveRule(rule.id)}
                                    >
                                      <Save size={12} /> Save
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="condition-text">{rule.condition || rule.description}</span>
                                    <span className="threshold-pill">
                                      Value: {rule.thresholdValue} {rule.thresholdUnit || rule.unit}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="source-td"><code>{rule.sourceRef || 'AICTE APH 2026-27'}</code></td>
                              <td>
                                <button
                                  type="button"
                                  className={`rule-toggle-btn ${rule.status === 'Active' ? 'active' : 'inactive'}`}
                                  onClick={() => handleToggleRuleStatus(rule.id)}
                                >
                                  {rule.status}
                                </button>
                              </td>
                              <td className="date-cell">{rule.lastUpdated}</td>
                              <td className="action-cell" style={{ textAlign: 'right' }}>
                                {(rule.isEditableThreshold ?? true) && !isEditing && (
                                  <button
                                    type="button"
                                    className="btn-tiny"
                                    onClick={() => handleStartEditRule(rule)}
                                  >
                                    <Edit2 size={12} /> Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===================================================================
          SECTION 12: REVIEWER SCRUTINY EXPERIENCE (SPLIT-SCREEN MODAL)
          =================================================================== */}
      {scrutinyModalOpen && (
        <div
          className="scrutiny-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-case-heading"
        >
          <div className="scrutiny-modal-window-wide glass-panel">
            {/* Modal Header Bar */}
            <div className="modal-header-bar">
              <div className="modal-case-info">
                <div className="modal-case-badge-row">
                  <span className="badge-institutional">AICTE Preliminary Pre-Scrutiny</span>
                  <span className="demo-chip">Decision Support Mode</span>
                  <span
                    className={`badge-status ${
                      selectedApp.status === 'Verified'
                        ? 'compliant'
                        : selectedApp.status === 'Review Required'
                        ? 'warning'
                        : 'deficiency'
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
                <h3 id="modal-case-heading" className="modal-case-name">
                  {selectedApp.name}
                </h3>
                <span className="modal-case-meta">
                  Application ID: <code>{selectedApp.id}</code> | Category: {selectedApp.category} | Region: {selectedApp.region}
                </span>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setScrutinyModalOpen(false)}
                aria-label="Close Reviewer View"
              >
                <X size={20} />
              </button>
            </div>

            {/* Split Screen Container */}
            <div className="reviewer-split-container">
              {/* LEFT PANEL: PDF / Document Preview with Page Navigation & Bounding Rectangle */}
              <div className="reviewer-left-panel">
                <div className="doc-preview-toolbar">
                  <div className="doc-page-controls">
                    <button
                      type="button"
                      className="page-nav-btn"
                      onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                      disabled={previewPage <= 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="page-indicator">Page {previewPage} of 4</span>
                    <button
                      type="button"
                      className="page-nav-btn"
                      onClick={() => setPreviewPage((p) => Math.min(4, p + 1))}
                      disabled={previewPage >= 4}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <span className="toolbar-doc-title">
                    Faculty Cadre Ledger (FAC-AUDIT/2026/Q3)
                  </span>
                </div>

                {/* Simulated Document Sheet Preview */}
                <div className="doc-preview-canvas-box">
                  <div className="doc-sheet-paper">
                    <div className="paper-header-strip">
                      <strong>FACULTY CADRE ROSTER & PAY MATRIX EVALUATION</strong>
                      <span>AFFILIATING UNIVERSITY JOINT AUDIT • ACADEMIC YEAR 2026-27</span>
                    </div>

                    {previewPage === 1 && (
                      <div className="paper-page-content">
                        <h4>1. Institutional Overview & Approved Intake</h4>
                        <p>Total Sanctioned Student Intake: 720 Students (Undergraduate Engineering).</p>
                        <p>Total Faculty Approved by Governing Body: 39 Full-Time Faculty Members.</p>
                        <p>Student-to-Faculty Ratio (SFR): 1 : 18.46 (Threshold: &le; 1 : 20.00 — Compliant).</p>
                      </div>
                    )}

                    {previewPage === 2 && (
                      <div className="paper-page-content">
                        <h4>2. Department-Wise Intake and Sanctioned Posts</h4>
                        <p>Computer Science & Engineering: Sanctioned Intake 240 • Faculty 19</p>
                        <p>Electronics & Communication: Sanctioned Intake 180 • Faculty 9</p>
                        <p>Mechanical Engineering: Sanctioned Intake 180 • Faculty 9</p>
                      </div>
                    )}

                    {previewPage === 3 && (
                      <div className="paper-page-content">
                        <h4>3. Faculty Pay Scale and Biometric Verification</h4>
                        <p>7th Central Pay Commission (CPC) scale implementation verified across rolls.</p>
                        <p>Zero duplicate Aadhaar or PAN registrations detected across Council database.</p>
                      </div>
                    )}

                    {previewPage === 4 && (
                      <div className="paper-page-content">
                        <h4>4. Senior Cadre Distribution (Mandatory Ratio 1:2:6)</h4>
                        <p>AICTE APH Chapter VII Table 7.1 requires: 1 Professor : 2 Associate Prof : 6 Assistant Prof.</p>

                        {/* HIGHLIGHTED ANOMALY RECTANGLE (Section 12) */}
                        <div
                          className={`anomaly-bounding-box ${activeFindingHighlight ? 'highlighted' : ''}`}
                          onClick={() => setActiveFindingHighlight(true)}
                        >
                          <div className="anomaly-box-tag">
                            <AlertTriangle size={13} />
                            <span>Potential Anomaly (Bounding Coordinates: x:72, y:340, w:420, h:65)</span>
                          </div>
                          <table className="mini-cadre-table">
                            <thead>
                              <tr>
                                <th>Department</th>
                                <th>Professor</th>
                                <th>Associate Prof</th>
                                <th>Assistant Prof</th>
                                <th>Observation</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="error-row">
                                <td>Computer Science</td>
                                <td><strong>1 Present</strong> (Required: 2)</td>
                                <td>3 Present</td>
                                <td>15 Present</td>
                                <td><span className="text-danger font-bold">-1 Deficit</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <p style={{ marginTop: '14px', fontSize: '0.75rem', color: '#64748b' }}>
                          Evidence Citation: Row 19, CSE Departmental Master Ledger vs Table 7.1 Cadre Norms.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Scrutiny Findings, Checklist, and Reviewer Actions */}
              <div className="reviewer-right-panel">
                <div className="right-panel-scroll">
                  {/* Action Feedback Banner */}
                  {actionRecordedFeedback && (
                    <div className="action-feedback-toast">
                      <CheckCircle2 size={16} className="text-green" />
                      <span>{actionRecordedFeedback}</span>
                    </div>
                  )}

                  {/* GHOST FACULTY SENTINEL VIGILANCE CARD (SIH Feature 1) */}
                  {(selectedApp.id === 'AICTE-2026-NRO-8841' || selectedApp.pendingIssues?.includes('Ghost') || selectedApp.pendingIssues?.includes('Cadre')) && (
                    <div className="scrutiny-findings-card glass-panel" style={{ border: '2px solid #ef4444', background: '#fff5f5', marginBottom: '14px' }}>
                      <div className="finding-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge-status" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', fontWeight: 700 }}>
                          🚨 GHOST FACULTY VIGILANCE ALERT
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#dc2626' }}>
                          AICTE Pan-India Radar
                        </span>
                      </div>
                      <h4 className="finding-title" style={{ color: '#991b1b', marginTop: '6px' }}>
                        Dual-Affiliation Flagged: Dr. Amiteshwar Sharma (Ph.D, CSE)
                      </h4>
                      <p className="finding-desc" style={{ color: '#7f1d1d', fontSize: '0.8rem', lineHeight: '1.4' }}>
                        <strong>Conflict Detected:</strong> Claimed on rolls as full-time regular Professor, but concurrently registered on active payroll at <strong>Malwa Institute of Engineering</strong> (Indore, MP • App ID: AICTE-2026-WRO-4201).
                      </p>
                      <div style={{ margin: '8px 0', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px', fontSize: '0.75rem', borderLeft: '4px solid #ef4444', color: '#991b1b' }}>
                        <div><strong>Transit Separation:</strong> 192 km distance between Bhopal & Indore campuses.</div>
                        <div style={{ marginTop: '3px' }}><strong>Statutory Breach:</strong> Simultaneous full-time biometric attendance is physically impossible under APH 2026 Chapter 7 Clause 7.1.4.</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button
                          type="button"
                          className="btn-tiny"
                          style={{ background: '#b91c1c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => handleReviewerAction('Flagged Ghost Faculty Vigilance Breach', 'Dr. Amiteshwar Sharma dual-affiliation confirmed across Indore & Bhopal campuses. Recommended for SAC inquiry.')}
                        >
                          Refer to SAC Vigilance Inspection
                        </button>
                        <button
                          type="button"
                          className="btn-tiny"
                          style={{ background: '#fff', color: '#b91c1c', border: '1px solid #ef4444', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => handleReviewerAction('Discounted Ghost Faculty from Cadre', 'Dr. Amiteshwar Sharma removed from valid cadre calculation. Deficit re-computed.')}
                        >
                          Freeze SFR Credit
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Findings Summary Card */}
                  <div className="scrutiny-findings-card glass-panel">
                    <div className="finding-header">
                      <span className="badge-status deficiency">Potential Anomaly Detected</span>
                      <button
                        type="button"
                        className="btn-tiny"
                        onClick={() => {
                          setPreviewPage(4);
                          setActiveFindingHighlight(true);
                        }}
                      >
                        Navigate to Page 4 Citation
                      </button>
                    </div>
                    <h4 className="finding-title">Shortfall of 1 Professor in CSE Department</h4>
                    <p className="finding-desc">
                      Under AICTE APH Chapter VII, Table 7.1, approved intake of 240 in Computer Science
                      requires a cadre ratio of 1:2:6 (2 Professors). Current deployment exhibits 1 Professor.
                    </p>
                    <div className="finding-evidence-ref">
                      <code>Page 4, Table 3 • Ref: FAC-AUDIT/2026/Q3</code>
                    </div>
                  </div>

                  {/* Document Checklist & Cross-Check */}
                  <div className="scrutiny-sub-card glass-panel">
                    <h5 className="sub-card-title">Cross-Document Verification Outcomes</h5>
                    <ul className="scrutiny-checks-list">
                      <li>
                        <CheckCircle2 size={14} className="text-green" />
                        <span>Land Title Deed: 8.24 Acres contiguous (APH Clause 2.4 Met)</span>
                      </li>
                      <li>
                        <CheckCircle2 size={14} className="text-green" />
                        <span>Fire Safety NOC: Valid through Dec-2027 (NBC Part 4 Met)</span>
                      </li>
                      <li>
                        <AlertTriangle size={14} className="text-amber" />
                        <span>Faculty Cadre: Senior Professor deficit flagged for hearing</span>
                      </li>
                      <li>
                        <CheckCircle2 size={14} className="text-green" />
                        <span>Joint Reserve FDR: ₹ 1.00 Cr joint lien marked to AICTE</span>
                      </li>
                    </ul>
                  </div>

                  {/* Reviewer Observation Input */}
                  <div className="reviewer-observation-box glass-panel">
                    <label htmlFor="reviewer-note-input" className="sub-card-title">
                      Record Reviewer Observation:
                    </label>
                    <textarea
                      id="reviewer-note-input"
                      rows={3}
                      placeholder="Enter scrutiny observation, hearing direction, or evidence requisition notes..."
                      value={reviewerObsText}
                      onChange={(e) => setReviewerObsText(e.target.value)}
                      className="reviewer-textarea"
                    />
                  </div>

                  {/* Reviewer Action Buttons (Section 12: No auto approve/reject) */}
                  <div className="reviewer-actions-bar">
                    <span className="actions-bar-label">Available Reviewer Actions:</span>
                    <div className="actions-btn-grid">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleReviewerAction('Mark Under Review', reviewerObsText || 'Marked under scrutiny review')}
                      >
                        Mark Under Review
                      </button>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleReviewerAction('Request Additional Evidence', reviewerObsText || 'Requested recruitment undertaking from institution')}
                      >
                        Request Evidence
                      </button>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleReviewerAction('Record Observation', reviewerObsText || 'Scrutiny observation logged in dossier')}
                      >
                        Record Observation
                      </button>

                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => handleReviewerAction('Resolved Finding', reviewerObsText || 'Deficiency resolved upon confirmation of compliance affidavit')}
                      >
                        Resolve Finding
                      </button>

                      <a
                        href={getExportDossierUrl(selectedApp.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, #0f2b48, #0284c7)',
                          color: '#fff',
                          gridColumn: 'span 2',
                          justifyContent: 'center',
                          marginTop: '6px'
                        }}
                      >
                        <FileSpreadsheet size={15} />
                        <span>Download Official AICTE Dossier (PDF)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODULE 3: UPLOAD MODAL ENTRY POINT
          =================================================================== */}
      {uploadModalOpen && (
        <div
          className="scrutiny-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-modal-title"
        >
          <div className="ingest-modal-window glass-panel">
            <div className="modal-header-bar">
              <h3 id="upload-modal-title" className="modal-case-name">
                Document Upload & Extraction (Demo Mode)
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setUploadModalOpen(false)}
                aria-label="Close Upload Modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ingest-modal-body">
              <p className="ingest-modal-desc">
                Select an institutional PDF file to simulate upload, structural OCR extraction,
                and preliminary checklist validation.
              </p>

              <div className="upload-dropzone-box">
                <FileUp size={36} className="text-blue" />
                <span className="dropzone-title">Select Institutional PDF Document</span>
                <span className="dropzone-sub">Supported formats: PDF/A (Max 25MB)</span>

                <input
                  type="file"
                  id="pdf-file-upload"
                  accept=".pdf"
                  onChange={handleSimulateUpload}
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor="pdf-file-upload"
                  className="btn-primary"
                  style={{ marginTop: '16px', cursor: 'pointer' }}
                >
                  Browse PDF File
                </label>
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="ingest-progress-container">
                  <div className="progress-labels">
                    <span>
                      {isProcessingUpload
                        ? `Extracting layout & fields from ${uploadFileName || 'dossier.pdf'}...`
                        : uploadResultFeedback}
                    </span>
                    <strong>{uploadProgress}%</strong>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          REAL-TIME NOTIFICATION CENTER SLIDE-OVER DRAWER
          =================================================================== */}
      {notificationsOpen && (
        <div
          className="notification-drawer-backdrop"
          onClick={() => setNotificationsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            className="notification-drawer-card glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              background: '#ffffff',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s ease-out',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} className="text-blue" />
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f2b48' }}>
                  {currentRole === 'INSTITUTION'
                    ? 'Apex Institute · Alerts & Memos'
                    : 'AICTE Regulatory Scrutiny Alerts'}
                </h3>
                {unreadNotifsCount > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '999px',
                      padding: '1px 6px',
                    }}
                  >
                    {unreadNotifsCount} New
                  </span>
                )}
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setNotificationsOpen(false)}
                aria-label="Close Notifications"
                style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Persona Notice Strip with Live Simulation & Switch User */}
            <div style={{ padding: '8px 16px', background: '#eff6ff', borderBottom: '1px solid #dbeafe', fontSize: '0.74rem', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} />
                <span>
                  Logged in as: <strong>{currentUser?.name || 'Dr. Rajesh Verma'}</strong> ({currentUser?.roleLabel || currentRole})
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleSimulateIncomingAlert}
                  style={{
                    background: '#fef3c7',
                    border: '1px solid #fde047',
                    color: '#92400e',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Simulate live anomaly push for SIH Demo"
                >
                  ⚡ Simulate Live Alert
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#1d4ed8',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Switch User
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', padding: '10px 16px', background: '#ffffff', borderBottom: '1px solid #f1f5f9', overflowX: 'auto' }}>
              {['ALL', 'VIGILANCE', 'TAMPER', 'EXPIRY', 'DEFICIENCY'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: activeNotifFilter === tab ? '#0f2b48' : '#f1f5f9',
                    color: activeNotifFilter === tab ? '#ffffff' : '#64748b',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveNotifFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
              {tabFilteredNotifs.length === 0 ? (
                <div style={{ padding: '36px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No alerts found under this category.
                </div>
              ) : (
                tabFilteredNotifs.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      padding: '12px',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      background: notif.read ? '#ffffff' : '#f8fafc',
                      borderLeft: `4px solid ${
                        notif.priority === 'CRITICAL'
                          ? '#ef4444'
                          : notif.priority === 'HIGH'
                          ? '#f59e0b'
                          : '#0284c7'
                      }`,
                      borderTop: '1px solid #e2e8f0',
                      borderRight: '1px solid #e2e8f0',
                      borderBottom: '1px solid #e2e8f0',
                      boxShadow: notif.read ? 'none' : '0 2px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: notif.priority === 'CRITICAL' ? '#fee2e2' : notif.priority === 'HIGH' ? '#fef3c7' : '#e0f2fe',
                          color: notif.priority === 'CRITICAL' ? '#991b1b' : notif.priority === 'HIGH' ? '#92400e' : '#0369a1',
                        }}
                      >
                        {notif.category} • {notif.priority}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        {notif.timestamp}
                      </span>
                    </div>

                    <h4 style={{ margin: '4px 0', fontSize: '0.84rem', fontWeight: 700, color: '#0f2b48' }}>
                      {notif.title}
                    </h4>
                    <p style={{ margin: '4px 0 8px 0', fontSize: '0.78rem', color: '#475569', lineHeight: '1.4' }}>
                      {notif.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                      <span><strong>{notif.institution || notif.appId}</strong></span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {!notif.read && (
                          <button
                            type="button"
                            style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              border: '1px solid #cbd5e1',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                            }}
                            onClick={() => handleMarkNotifRead(notif.id)}
                          >
                            Mark Read
                          </button>
                        )}
                        {notif.actionType === 'SUBMIT_RECTIFICATION' ? (
                          <button
                            type="button"
                            style={{
                              background: '#0284c7',
                              color: '#fff',
                              border: 'none',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                            }}
                            onClick={() => {
                              setNotificationsOpen(false);
                              setUploadModalOpen(true);
                            }}
                          >
                            Upload Undertaking
                          </button>
                        ) : (
                          <button
                            type="button"
                            style={{
                              background: '#0f2b48',
                              color: '#fff',
                              border: 'none',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                            }}
                            onClick={() => {
                              setNotificationsOpen(false);
                              const targetApp = applications.find((a) => a.id === notif.appId) || applications[0];
                              handleOpenScrutiny(targetApp);
                            }}
                          >
                            Open Case
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          STATUTORY DEFICIENCY MEMO DISPATCH MODAL
          =================================================================== */}
      {deficiencyModalOpen && (
        <div className="scrutiny-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ingest-modal-window glass-panel" style={{ maxWidth: '640px', width: '90%' }}>
            <div className="modal-header-bar" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} className="text-blue" />
                <h3 className="modal-case-name" style={{ fontSize: '1rem', margin: 0 }}>
                  Dispatch Statutory Deficiency Memo under APH 2026-27
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeficiencyModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ingest-modal-body" style={{ padding: '16px 20px' }}>
              {noticeDispatchedFeedback ? (
                <div style={{ padding: '24px', textAlign: 'center', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <CheckCircle2 size={36} className="text-green" style={{ margin: '0 auto 12px auto' }} />
                  <h4 style={{ color: '#166534', margin: '0 0 8px 0', fontSize: '1rem' }}>Notice Dispatched Successfully</h4>
                  <p style={{ color: '#15803d', fontSize: '0.82rem', margin: 0 }}>
                    {noticeDispatchedFeedback}
                  </p>
                </div>
              ) : (
                <>
                  {/* Government Memo Formal Header Preview */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '0.78rem' }}>
                    <div style={{ textAlign: 'center', fontWeight: 800, color: '#0f2b48', letterSpacing: '0.5px' }}>
                      ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                      REGIONAL SCRUTINY COMMITTEE • STATUTORY DEFICIENCY MEMO
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', borderTop: '1px solid #cbd5e1', paddingTop: '6px' }}>
                      <span><strong>Ref:</strong> AICTE/RO-N/2026/DEF-{(deficiencyNoticeTarget?.id || '8841').split('-').pop()}</span>
                      <span><strong>Date:</strong> 2026-10-23</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <strong>To:</strong> The Principal / Chairman, {deficiencyNoticeTarget?.name || 'Apex Institute'} ({deficiencyNoticeTarget?.city || 'Bhopal'})
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Applicable APH Regulation / Clause
                    </label>
                    <input
                      type="text"
                      className="table-search-input"
                      style={{ width: '100%', padding: '6px 10px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      value={deficiencyClause}
                      onChange={(e) => setDeficiencyClause(e.target.value)}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Specific Non-Compliance / Evidence Finding
                    </label>
                    <textarea
                      rows={3}
                      className="table-search-input"
                      style={{ width: '100%', padding: '8px 10px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                      value={deficiencyText}
                      onChange={(e) => setDeficiencyText(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Statutory Rectification Window
                      </label>
                      <select
                        value={deficiencyRectDays}
                        onChange={(e) => setDeficiencyRectDays(Number(e.target.value))}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      >
                        <option value={15}>15 Calendar Days (Standard Scrutiny Memo)</option>
                        <option value={30}>30 Calendar Days (Infrastructure / Cadre Undertaking)</option>
                        <option value={7}>7 Calendar Days (Urgent Life Safety / Expiry Undertaking)</option>
                      </select>
                    </div>
                    <div style={{ flex: 1, fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '8px', borderRadius: '4px' }}>
                      <strong>Dispatch Channels:</strong> AICTE National Portal, DigiLocker PUSH, Email & Principal Mobile SMS.
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setDeficiencyModalOpen(false)}
                      disabled={isDispatchingNotice}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ background: '#b91c1c', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={handleDispatchStatutoryNotice}
                      disabled={isDispatchingNotice}
                    >
                      <Send size={14} />
                      <span>{isDispatchingNotice ? 'Dispatching Notice...' : 'Dispatch Statutory Notice'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
