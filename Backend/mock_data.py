# backend/mock_data.py

MOCK_APPLICATIONS = {
    "APP-2026-ENG-01": {
        "application_id": "APP-2026-ENG-01",
        "institution_name": "Apex Institute of Technology",
        "status": "DEFICIENCY_DETECTED",
        "risk_score": 82.5,
        "tampering_found": True,
        "documents": [
            {
                "id": "doc_1",
                "name": "Fire_Safety_NOC.pdf",
                "type": "FIRE_SAFETY_NOC",
                "authority_status": "VERIFIED_DIGILOCKER",
                "tampered": False,
                "valid_until": "2026-12-31",
                "pdf_url": "/uploads/fire_noc.pdf"
            },
            {
                "id": "doc_2",
                "name": "Affidavit_Intake.pdf",
                "type": "AFFIDAVIT",
                "authority_status": "MANUAL_REVIEW_REQUIRED",
                "tampered": True,
                "pdf_url": "/uploads/affidavit.pdf",
                "alerts": [
                    {
                        "type": "DIGITAL_FORGERY",
                        "severity": "CRITICAL",
                        "message": "Intake '180' shows high ELA compression delta and font mismatch.",
                        "page": 1,
                        "bbox": [120, 310, 205, 340],
                        "heatmap_url": "/uploads/ela_result.jpg"
                    }
                ]
            }
        ],
        "compliance": [
            {
                "rule": "Student-Faculty Ratio (SFR)",
                "norm": "1:20.0",
                "actual": "1:24.2",
                "compliant": False,
                "deficiency": "Deficit: Requires 3 additional faculty members."
            },
            {
                "rule": "Fire Safety Capacity vs Intake",
                "norm": "Intake <= Fire Safety Limit",
                "actual": "Intake: 240, Fire Limit: 100",
                "compliant": False,
                "deficiency": "Life safety violation: Intake exceeds building certified limit."
            }
        ]
    }
}
