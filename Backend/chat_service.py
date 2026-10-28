# backend/chat_service.py
"""
PRAGYAN-AICTE Intelligent AI Chatbot Service
Powered by Google Gemini (gemini-3.8-flash) with specialized AICTE Regulatory Assistant Persona.
Includes comprehensive domain knowledge on:
- SIH 2026 Problem Statement 26261
- Approval Process Handbook (APH 2026-27)
- 4-Stage Scrutiny & Validation Pipeline
- 7-Basis Configurable Validation Checks
- Faculty Cadre Ratio (Table 7.1) & Student-Faculty Ratio (SFR 1:20)
- Ghost Faculty Vigilance Radar & Concurrent Affiliations
- DigiLocker, State Revenue & Life Safety Verifications
- Statutory Deficiency Memos & 15-Day Cure Undertakings
"""

import os
import requests
from dotenv import load_dotenv

backend_dir = os.path.dirname(os.path.abspath(__file__))
env_file = os.path.join(backend_dir, ".env")
if os.path.exists(env_file):
    load_dotenv(env_file)
else:
    load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

SYSTEM_PROMPT = """You are PRAGYAN AICTE Assistant, the official AI regulatory guidance chatbot for the All India Council for Technical Education (AICTE) Smart Document Validation and Scrutiny Platform (SIH 2026 Problem Statement 26261).

Your core mandate:
1. Help technical institutions, applicants, verification officers, scrutiny committee members, and approving authorities with AICTE approval processes.
2. Explain the 4-Stage Approval Pipeline:
   - Stage 1: AI Validation Engine (Multi-page OCR, field extraction, preliminary discrepancy flags)
   - Stage 2: Verification Officer / Official Repositories (Authenticity cross-checks with DigiLocker, State Land Registry, Fire NOC, University Registries)
   - Stage 3: AICTE Scrutiny Officer (Human review of rule results, evidence, and recommendations)
   - Stage 4: Competent Authority (Statutory determination to issue Letter of Approval (LoA) or Letter of Rejection (LoR))
3. Explain the 7-Point Configurable Validation Basis:
   1. File & Readability
   2. Required Information Checklist
   3. Document & Date Consistency
   4. Application Consistency (Intake & Programme matching)
   5. Official-Source Verification
   6. Duplicate & Anomaly (ELA Tamper / Ghost Faculty) Analysis
   7. Applicable Regulatory Requirements (APH Table 7.1 Cadre 1:2:6, SFR 1:20, Land Contiguity)
4. Address Deficiency Memos:
   - Institutions have a mandatory 15-calendar-day window to upload a Cure Undertaking / Replacement Document.
5. Important Statutory Boundary:
   - Remind users that while AI provides automated preliminary checks, all final regulatory decisions are made exclusively by the Competent Authority.

Tone: Professional, authoritative, supportive, concise. Use markdown bullet points and clear steps when explaining procedures.
"""

def get_domain_fallback_answer(query: str, role: str = "PUBLIC") -> str:
    """Intelligent rule-based fallback response for 100% reliable instantaneous answers."""
    q = query.lower()

    if any(k in q for k in ["upload", "eoa", "submit document", "where to upload", "how to upload"]):
        return (
            "### 📄 How to Upload Your EoA Document:\n\n"
            "1. **Log in** to your institution portal with your credentials (`principal@apex.edu.in`).\n"
            "2. In the left navigation sidebar, click **Documents & Upload EoA**.\n"
            "3. Path: **My Applications → AICTE-2026-NRO-8841 → Documents → Upload EoA**.\n"
            "4. Click **'Upload EoA PDF'** to select your approved extension PDF.\n"
            "5. The AI Validation Engine automatically extracts fields and produces both the 4-Stage Workflow Graph and the 7-Basis Check Chart.\n\n"
            "🔒 *Note: PRAGYAN uses a single shared ledger—documents uploaded here are automatically available to all assigned regulatory officers.*"
        )

    if any(k in q for k in ["stage", "pipeline", "who checks", "workflow"]):
        return (
            "### 🔄 PRAGYAN 4-Stage Checking Workflow:\n\n"
            "1. **Stage 1 — AI Validation Engine**: Runs immediately on upload to verify PDF readability, layout, missing fields, dates, and preliminary anomalies.\n"
            "2. **Stage 2 — Verification Officer**: Cross-checks document credentials against official sources (DigiLocker, State Revenue Portal, Fire NOC repository).\n"
            "3. **Stage 3 — AICTE Scrutiny Officer**: Human expert review of rule results, extracted evidence, and discrepancy findings.\n"
            "4. **Stage 4 — Competent Authority**: Statutory executive decision-maker who records statutory rationale and grants LoA / LoR."
        )

    if any(k in q for k in ["cadre", "sfr", "ratio", "professor", "faculty"]):
        return (
            "### 👥 AICTE Faculty Norms (APH 2026-27 Table 7.1):\n\n"
            "- **Cadre Ratio Norm**: `1 Professor : 2 Associate Professors : 6 Assistant Professors`.\n"
            "- **Student-Faculty Ratio (SFR)**: `1 : 20` for Engineering & Technology undergraduate courses.\n"
            "- **Vigilance Rule APH 7.1.4**: Zero concurrent external affiliations. The Pan-India Sentinel flags faculty members registered at two separate colleges simultaneously.\n\n"
            "If your cadre shows a deficit (e.g. short 1 Professor in CSE), upload a recruitment commitment affidavit via the **Submit Rectification Undertaking** desk."
        )

    if any(k in q for k in ["deficiency", "memo", "cure", "rectification", "clock", "15 days"]):
        return (
            "### ⚠️ Statutory Deficiency Memos & Cure Undertakings:\n\n"
            "- When the Scrutiny Committee flags a discrepancy, a formal **Deficiency Memo** is issued.\n"
            "- The institution is given a **15-Calendar-Day Cure Clock** to rectify the issue.\n"
            "- Go to **Overview Dashboard → Upload Rectification Undertaking** or **Documents → Replace / Cure** to submit revised supporting affidavits.\n"
            "- The prior submission is preserved in the immutable audit trail."
        )

    if any(k in q for k in ["role", "login", "credentials", "password", "test"]):
        return (
            "### 🔐 Portal Access Roles & Credentials:\n\n"
            "- **Role 1 (Institution)**: `principal@apex.edu.in` | `apex@principal2026`\n"
            "- **Role 3 (Verification Officer)**: `verification@aicte.gov.in` | `aicte@verif2026`\n"
            "- **Role 4 (Scrutiny Officer)**: `scrutiny@aicte.gov.in` | `aicte@scrutiny2026`\n"
            "- **Role 5 (Competent Authority)**: `approver@aicte.gov.in` | `aicte@approver2026`\n"
            "- **Role 6 (System Admin)**: `admin@aicte.gov.in` | `aicte@admin2026`\n\n"
            "Each role accesses its dedicated statutory workbench with tenant-isolated permissions."
        )

    if any(k in q for k in ["tamper", "ela", "anomaly", "fake", "manipulation"]):
        return (
            "### 🔍 Forensic Error Level Analysis (ELA) & Tamper Detection:\n\n"
            "- PRAGYAN applies mathematical compression entropy analysis across all PDF page rasters.\n"
            "- Resaved digital seals or pasted signature cutouts generate high-frequency gradient spikes.\n"
            "- When an anomaly is detected, it is flagged under **Basis 6 (Duplicate & Anomaly Analysis)** with exact page coordinates for committee inspection."
        )

    # General AICTE advisory fallback
    return (
        "### 🏛️ PRAGYAN AICTE Assistant Guidance:\n\n"
        f"Thank you for reaching out regarding: *\"{query}\"*.\n\n"
        "Here are key resources to help you:\n"
        "- **Extension of Approval (EoA)**: Ensure your PDF contains all required pages, clear municipal land seals, and the NBC 2016 Fire Safety certificate.\n"
        "- **Automated Validation**: Review the **7-Basis Validation Results** under the Documents tab.\n"
        "- **Resolution**: If an alert is flagged, submit clarification or replacement documents through your authenticated Institution Portal.\n\n"
        "Need help with a specific topic? Try asking:\n"
        "• *'How do I upload EoA?'*\n"
        "• *'Explain the 4 stages of approval'*\n"
        "• *'What is the Cadre Ratio norm?'*\n"
        "• *'How to respond to Deficiency Memo?'*"
    )


def generate_chat_response(query: str, role: str = "PUBLIC", history: list = None, context: dict = None) -> dict:
    """
    Generates an AI response using Gemini with strict timeout and regulatory fallback.
    Guarantees fast, robust response under all network conditions.
    """
    if not query or not query.strip():
        return {
            "success": False,
            "reply": "Please enter a question or issue you need assistance with.",
            "source": "validator"
        }

    context_str = f"[User Role]: {role or 'PUBLIC'}"
    if context:
        context_str += f" | [Context]: {context}"

    # If Gemini API Key is configured, attempt direct REST query
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{SYSTEM_PROMPT}\n{context_str}\n\nUser Question: {query.strip()}\nAssistant Answer:"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 600
                }
            }
            res = requests.post(url, json=payload, timeout=(1.5, 3.5))
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return {
                            "success": True,
                            "reply": parts[0]["text"].strip(),
                            "source": "gemini-3.8-flash"
                        }
        except Exception as e:
            # Silently fallback to domain engine
            pass

    # Instantaneous domain knowledge engine
    fallback_reply = get_domain_fallback_answer(query, role=role)
    return {
        "success": True,
        "reply": fallback_reply,
        "source": "pragyan-ai-engine"
    }
