import * as THREE from 'three';

/**
 * Creates ultra-crisp, high-resolution document textures in memory.
 * Emulates official Indian technical education regulatory documents with seals,
 * watermarks, barcodes, security borders, and tabular criteria.
 */
export function createDocumentTexture(docConfig) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600; // 3:4 aspect ratio standard document
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background: Archival document white with warm ivory tone
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Security micro-pattern borders (double guilloche emulation)
  ctx.strokeStyle = 'rgba(10, 22, 40, 0.14)';
  ctx.lineWidth = 5;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  ctx.strokeStyle = 'rgba(37, 99, 235, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Watermark text angled across document
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 5.5);
  ctx.font = '700 52px sans-serif';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.035)';
  ctx.textAlign = 'center';
  ctx.fillText('PRAGYAN-AICTE AUTHENTICATED DOSSIER', 0, -40);
  ctx.fillText('REGULATORY SCRUTINY COPY • 2026', 0, 50);
  ctx.restore();

  // Top header banner
  ctx.fillStyle = 'rgba(10, 22, 40, 0.04)';
  ctx.fillRect(50, 50, canvas.width - 100, 140);

  // Emblem circular badge
  ctx.fillStyle = '#0a1628';
  ctx.beginPath();
  ctx.arc(130, 120, 42, 0, Math.PI * 2);
  ctx.fill();

  // Emblem inner geometry
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(110, 100, 40, 40);
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(130, 120, 6, 0, Math.PI * 2);
  ctx.fill();

  // Header Title & Authority
  ctx.fillStyle = '#0a1628';
  ctx.font = '800 28px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(docConfig.authorityHeader.toUpperCase(), 195, 105);

  ctx.fillStyle = '#475569';
  ctx.font = '600 18px sans-serif';
  ctx.fillText(docConfig.subHeader, 195, 140);

  // Gold/Blue rule line
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(50, 190);
  ctx.lineTo(canvas.width - 50, 190);
  ctx.stroke();

  // Document Title & Category
  ctx.fillStyle = '#081220';
  ctx.font = '800 36px sans-serif';
  ctx.fillText(docConfig.title, 80, 260);

  // Ref Number and AICTE APH Clause
  ctx.fillStyle = '#1d4ed8';
  ctx.font = '700 20px monospace';
  ctx.fillText(`REF: ${docConfig.docNumber}   |   ${docConfig.clause}`, 80, 305);

  // Light separator
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 335);
  ctx.lineTo(canvas.width - 80, 335);
  ctx.stroke();

  // Data table rows (high contrast, official layout)
  let y = 390;
  docConfig.contentRows.forEach((row, i) => {
    // Zebra background
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.025)';
      ctx.fillRect(80, y - 30, canvas.width - 160, 62);
    }

    ctx.fillStyle = '#334155';
    ctx.font = '600 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(row.label, 100, y + 10);

    ctx.fillStyle = row.highlight ? (row.isError ? '#dc2626' : '#1d4ed8') : '#0a1628';
    ctx.font = row.highlight ? '700 21px monospace' : '600 20px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(row.val, canvas.width - 100, y + 10);

    y += 66;
  });

  // Official Regulatory Rubber Stamp (Circular, angled)
  ctx.save();
  ctx.translate(canvas.width - 240, canvas.height - 300);
  ctx.rotate(-0.08);

  ctx.strokeStyle = docConfig.hasDiscrepancy ? 'rgba(220, 38, 38, 0.85)' : 'rgba(5, 150, 105, 0.85)';
  ctx.lineWidth = 3.5;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 92, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = docConfig.hasDiscrepancy ? 'rgba(220, 38, 38, 0.5)' : 'rgba(5, 150, 105, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 84, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = docConfig.hasDiscrepancy ? '#dc2626' : '#059669';
  ctx.font = '800 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(docConfig.hasDiscrepancy ? 'DEFICIENCY' : 'AICTE PRE-SCRUTINY', 0, -20);
  ctx.fillText(docConfig.hasDiscrepancy ? 'HEARING REQ' : 'VERIFIED COMPLIANT', 0, 12);
  ctx.font = '600 13px monospace';
  ctx.fillText('APH 2026-27', 0, 38);
  ctx.restore();

  // Bottom Cryptographic Audit Strip
  ctx.fillStyle = 'rgba(10, 22, 40, 0.05)';
  ctx.fillRect(50, canvas.height - 130, canvas.width - 100, 80);

  // Barcode mockup
  ctx.fillStyle = '#0a1628';
  for (let b = 0; b < 28; b++) {
    const barW = (b % 4 === 0) ? 6 : (b % 2 === 0 ? 3 : 2);
    ctx.fillRect(80 + (b * 11), canvas.height - 110, barW, 44);
  }

  // Cryptographic checksum
  ctx.fillStyle = '#334155';
  ctx.font = '600 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SHA-256: ${docConfig.hash.substring(0, 52)}...`, 410, canvas.height - 90);
  ctx.fillText(`STATUS: ${docConfig.statusText}  |  DATE: 2026-10-23 10:45 UTC`, 410, canvas.height - 66);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export const DOCUMENT_CONFIGS = [
  {
    id: 0,
    title: 'Land Title & Spatial Contiguity Deed',
    authorityHeader: 'Govt of Madhya Pradesh • Sub-Registrar Office',
    subHeader: 'Institutional Land Registry & Encumbrance Certificate',
    docNumber: 'REG-2022/MP-BPL-88192',
    clause: 'AICTE APH Clause 2.4.1 (Land Norms)',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    statusText: 'AUTHENTICATED • UNENCUMBERED',
    hasDiscrepancy: false,
    contentRows: [
      { label: 'Registered Parcel', val: 'Khasra No. 412/1 & 412/2' },
      { label: 'Total Certified Area', val: '8.24 Acres (33,346 sq.m)', highlight: true },
      { label: 'AICTE Urban Requirement', val: '2.50 Acres (Met: +229% Surplus)' },
      { label: 'Spatial Contiguity', val: 'Single Piece / No Public Road Dissection' },
      { label: 'GIS Geo-Coordinates', val: '23.2599° N, 77.4126° E' },
      { label: 'Titleholder Entity', val: 'Apex Educational Society' },
      { label: 'Bank Mortgage Status', val: 'Nil Encumbrance (Search 30 Years)' },
    ],
  },
  {
    id: 1,
    title: 'State Fire & NBC Disaster Clearance',
    authorityHeader: 'Directorate of Urban Fire Services, MP',
    subHeader: 'National Building Code 2016 (Part 4) Safety Audit',
    docNumber: 'NOC/FIRE/2025/BPL-491',
    clause: 'AICTE APH Clause 4.8.2 (Building Safety)',
    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    statusText: 'AUTHENTICATED • VALID THROUGH 2027',
    hasDiscrepancy: false,
    contentRows: [
      { label: 'Certificate Validity', val: 'Valid through 31-Dec-2027', highlight: true },
      { label: 'Emergency Staircase Width', val: 'Dual Egress @ 2.0m (Min: 1.5m)' },
      { label: 'Dedicated Fire Water Reservoir', val: '100,000 Litres Static Capacity' },
      { label: 'Hydrant Ring Pressure', val: '3.5 bar continuous pump test' },
      { label: 'Municipal Sanctioned Map', val: 'Matched 100% with CAD plot' },
      { label: 'Fire Separation Buffer', val: '6.0m Peripheral Driveway clear' },
      { label: 'Automatic Fire Sprinklers', val: 'Installed in Labs & Seminar Hall' },
    ],
  },
  {
    id: 2,
    title: 'Faculty Cadre & Biometric Pay Matrix',
    authorityHeader: 'AICTE Regional Scrutiny Board • Academic Audit',
    subHeader: 'Student-to-Faculty Ratio & Cadre Norms Evaluation',
    docNumber: 'FAC-AUDIT/2026/Q3',
    clause: 'AICTE APH Clause 7.1.3 & Table 7.1',
    hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    statusText: 'DEFICIENCY IDENTIFIED • HEARING REQ',
    hasDiscrepancy: true,
    contentRows: [
      { label: 'Sanctioned Student Intake', val: '720 UG Students (Total)' },
      { label: 'Total Faculty Deployed', val: '39 Full-Time Faculty' },
      { label: 'Student-to-Faculty Ratio', val: '1:18.46 (Compliant <= 1:20)' },
      { label: 'Mandatory Cadre Ratio', val: '1 : 2 : 6 (Prof : Assoc : Asst)' },
      { label: 'Professor Cadre (CSE Dept)', val: '1 Present / 2 Required (-1)', highlight: true, isError: true },
      { label: 'Biometric Duplicate Check', val: '0 Phantom Faculty Detected' },
      { label: 'Pay Scale Compliance', val: '7th CPC AICTE Scale Verified' },
    ],
  },
  {
    id: 3,
    title: 'Joint Reserve Endowment FDR Escrow',
    authorityHeader: 'State Bank of India • Commercial Banking Branch',
    subHeader: 'Fixed Deposit Receipt in Joint Name with Regional Officer',
    docNumber: 'SBI/FDR/AICTE-ESCROW-99321',
    clause: 'AICTE APH Clause 1.7.4 (Corpus Fund)',
    hash: 'cd2eb0837c9b4c962c22d2ff8b5441b7b45805887f051d39bf133b583baf6860',
    statusText: 'AUTHENTICATED • JOINT LIEN ACTIVE',
    hasDiscrepancy: false,
    contentRows: [
      { label: 'Endowment Principal', val: '₹ 1,00,00,000/- (One Crore)', highlight: true },
      { label: 'Primary Signatory', val: 'President, Apex Educational Society' },
      { label: 'Joint Signatory', val: 'Regional Officer, AICTE Bhopal' },
      { label: 'Tenure / Maturity', val: '10 Years (Maturity: 24-Oct-2036)' },
      { label: 'Lien Covenant', val: 'Irrevocable Lien Marked to AICTE' },
      { label: 'Bank API Handshake', val: 'Direct SHA-256 Ledger Verified' },
      { label: 'Premature Encashment', val: 'Barred without AICTE Council NOC' },
    ],
  },
];
