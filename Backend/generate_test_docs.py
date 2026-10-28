# backend/generate_test_docs.py
"""
Generates realistic synthetic AICTE documents for testing:
1. Valid Fire Safety NOC (Issued by State Fire Services)
2. Valid Land & Intake Affidavit (Stamp Paper Undertaking)
3. Tampered Fire Safety NOC (With Photoshop metadata and altered numbers)
4. Conflicting Application (Claims 300 intake against 80 fire safety limit)
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

styles = getSampleStyleSheet()

# Custom Styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontSize=16,
    alignment=1, # Center
    spaceAfter=12,
    textColor=colors.HexColor('#0f2b48')
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontSize=10,
    alignment=1,
    spaceAfter=15,
    textColor=colors.HexColor('#555555')
)

body_style = ParagraphStyle(
    'DocBody',
    parent=styles['Normal'],
    fontSize=11,
    leading=16,
    spaceAfter=10
)

def build_pdf(filename, title, subtitle, paragraphs, table_data=None, metadata=None):
    filepath = os.path.join(UPLOAD_DIR, filename)
    doc = SimpleDocTemplate(filepath, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    story = []

    story.append(Paragraph(title, title_style))
    if subtitle:
        story.append(Paragraph(subtitle, subtitle_style))
    story.append(Spacer(1, 10))

    for p in paragraphs:
        story.append(Paragraph(p, body_style))
        story.append(Spacer(1, 8))

    if table_data:
        t = Table(table_data, colWidths=[200, 300])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f0f4f8')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0f2b48')),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#cccccc')),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(Spacer(1, 10))
        story.append(t)

    doc.build(story)
    
    # Optional metadata manipulation for testing forensic checks
    if metadata:
        import pymupdf as fitz
        pdf_doc = fitz.open(filepath)
        pdf_doc.set_metadata(metadata)
        temp_path = filepath + "_temp.pdf"
        pdf_doc.save(temp_path)
        pdf_doc.close()
        os.replace(temp_path, filepath)

    print(f"Generated: {filepath}")
    return filepath

def generate_all():
    # 1. Clean Fire Safety NOC
    build_pdf(
        filename="Clean_Fire_Safety_NOC.pdf",
        title="DIRECTORATE OF FIRE AND EMERGENCY SERVICES",
        subtitle="GOVERNMENT OF MAHARASHTRA | CERTIFICATE OF FIRE SAFETY COMPLIANCE",
        paragraphs=[
            "<b>Reference No:</b> FES/NOC/2026/8941",
            "This is to certify that the institutional building premises of <b>Apex Institute of Technology</b> located at Survey No. 42/1, Sector 9, Pune, has been inspected by the competent fire prevention officers.",
            "The fire-fighting infrastructure, emergency evacuation routes, and water storage systems were verified to be in strict accordance with the National Building Code (NBC) Part 4.",
            "<b>Certificate Status:</b> APPROVED",
            "<b>Permitted Maximum Occupancy Capacity:</b> 1200 Persons",
            "<b>Valid Until:</b> 31-December-2027",
            "Issued under the seal of Chief Fire Officer, Zone 3."
        ],
        table_data=[
            ["Inspection Date", "15-January-2026"],
            ["Max Safe Occupancy", "1200 Students & Staff"],
            ["Validity Period", "31-12-2027 (ACTIVE)"],
            ["Issuing Authority", "State Fire Service Directorate"]
        ],
        metadata={"producer": "Government Printing Office / LibreOffice 7.4", "creator": "FES Portal"}
    )

    # 2. Clean Land & Faculty Affidavit
    build_pdf(
        filename="Clean_Affidavit_Intake.pdf",
        title="NON-JUDICIAL STAMP PAPER - GOVERNMENT OF INDIA",
        subtitle="AFFIDAVIT FOR EXTENSION OF APPROVAL (EOA) 2026-2027",
        paragraphs=[
            "I, Dr. R. K. Sharma, Chairman of the Apex Educational Society, do hereby solemnly affirm and state as under:",
            "1. That the institution <b>Apex Institute of Technology</b> has valid ownership and title of institutional land measuring <b>5.0 Acres</b> registered under Sale Deed No. 1042/Pune.",
            "2. That the institution operates the Undergraduate Engineering Program with a verified full-time faculty strength of <b>12 Faculty Members</b> for an annual intake of <b>120 Students</b>.",
            "3. That the calculated Student-to-Faculty Ratio (SFR) stands compliant at 1:10 (APH norm is 1:20).",
            "4. That all institutional records submitted to the AICTE portal are authentic, complete, and unmanipulated."
        ],
        table_data=[
            ["Institution AICTE ID", "1-948201941"],
            ["Total Approved Intake", "120 Students"],
            ["Regular Faculty Count", "12 Full-Time Faculty"],
            ["Land Area Owned", "5.0 Acres (Clear Title)"]
        ],
        metadata={"producer": "Adobe Acrobat Pro 2023", "creator": "e-Courts Notary"}
    )

    # 3. Tampered Fire NOC (Photoshop metadata & altered occupancy)
    build_pdf(
        filename="Tampered_Fire_NOC.pdf",
        title="DIRECTORATE OF FIRE AND EMERGENCY SERVICES",
        subtitle="STATE FIRE SERVICE HEADQUARTERS - SAFETY CLEARANCE",
        paragraphs=[
            "<b>Reference No:</b> FES/NOC/2026/TAMPERED-SAMPLE",
            "This document certifies inspection for <b>Shiva Technical Campus</b>.",
            "<b>Altered Intake Number:</b> 300 Students",
            "<b>Certificate Status:</b> Expired / Altered",
            "<b>Valid Until:</b> 10-January-2024 (EXPIRED)",
            "<b>Notice:</b> Digital scrutiny reveals compression anomalies and graphic modification in the declared capacity block."
        ],
        table_data=[
            ["Inspection Date", "10-January-2023"],
            ["Max Safe Occupancy", "300 Persons (FLAGGED: MODIFIED)"],
            ["Validity Period", "10-01-2024 (EXPIRED)"]
        ],
        metadata={"producer": "Adobe Photoshop 2024 (Windows)", "creator": "Adobe Photoshop"}
    )

    # 4. Cross-Document Contradiction File
    build_pdf(
        filename="Conflicting_Affidavit_HighIntake.pdf",
        title="INSTITUTIONAL UNDERTAKING - EXTENSION OF INTAKE",
        subtitle="AFFIDAVIT SUBMITTED TO AICTE NORTHERN REGION",
        paragraphs=[
            "The institution <b>Horizon College of Technology</b> hereby requests an expansion of student intake to <b>360 Students</b>.",
            "The verified teaching faculty available on rolls is <b>10 Faculty Members</b>.",
            "The registered land area as per revenue records is <b>1.0 Acres</b>.",
            "<i>Note: Fire NOC caps occupancy at 80, but application claims 360 intake.</i>"
        ],
        table_data=[
            ["Requested Intake", "360 Students"],
            ["Faculty Count", "10 Faculty (SFR Deficit)"],
            ["Declared Land Area", "1.0 Acres (Below Metro Norm 1.5)"]
        ],
        metadata={"producer": "Sejda PDF Editor Free", "creator": "Sejda Web"}
    )

    # 5. Ghost Faculty Roster (Dual-Affiliation Vigilance Case)
    build_pdf(
        filename="Ghost_Faculty_Roster.pdf",
        title="APEX INSTITUTE OF ADVANCED TECHNOLOGY & RESEARCH",
        subtitle="AFFILIATED TO STATE TECHNOLOGICAL UNIVERSITY | FACULTY ROSTER AY 2026-27",
        paragraphs=[
            "<b>Department of Computer Science & Engineering - Faculty Roll Ledger</b>",
            "The following list represents the verified full-time regular faculty members currently on rolls and receiving monthly biometric salary disbursement under AICTE Approval Process Handbook guidelines.",
            "<b>Chief Academic Supervisor:</b> Dr. Amiteshwar Sharma (Ph.D., IIT Bombay)",
            "<b>Cadre Breakdown:</b> 1 Professor, 3 Associate Professors, 10 Assistant Professors (Total 14 Faculty)",
            "<i>Notice: Dual-institutional registration is strictly monitored under AICTE Pan-India Vigilance.</i>"
        ],
        table_data=[
            ["Faculty Name", "Cadre & Specialization"],
            ["Dr. Amiteshwar Sharma", "Professor & HOD (Distributed Systems) - Ph.D."],
            ["Dr. R. K. Sharma", "Professor (Structural Systems) - Ph.D."],
            ["Prof. Sneha Verma", "Associate Professor (AI & Machine Learning)"],
            ["Prof. Rajesh Tiwari", "Assistant Professor (Cyber Security)"]
        ],
        metadata={"producer": "Government Printing Office / LibreOffice 7.4", "creator": "AICTE Faculty Portal"}
    )

if __name__ == "__main__":
    generate_all()
