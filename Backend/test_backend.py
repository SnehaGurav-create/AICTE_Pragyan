# backend/test_backend.py
"""
Automated Test Suite for AICTE Smart Scrutiny AI Backend (PRAGYAN).
Verifies:
1. System Health Check
2. Applications Queue & Detail Dossier
3. Configurable APH Rules Engine (GET & PUT)
4. Evaluation Benchmarks & Metrics (8 criteria)
5. Officer Action Recording in Immutable Audit Trail
6. Real Multi-File Upload & Scrutiny Ingestion Pipeline
7. Official PDF Scrutiny Dossier Generator
"""

import sys
import io
import os

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("\n=======================================================")
    print("[*] Running PRAGYAN-AICTE Backend Verification Suite")
    print("=======================================================\n")
    passed = 0
    total = 9

    # Test 1: Health
    try:
        res = client.get("/api/v1/health")
        assert res.status_code == 200 and res.json()["status"] == "online"
        print("[PASS] [1/7] Health Check Endpoint (/api/v1/health)")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [1/7] Health Failed: {e}")

    # Test 2: Applications Queue
    try:
        res = client.get("/api/v1/applications")
        assert res.status_code == 200 and len(res.json()) >= 3
        print(f"[PASS] [2/7] Applications Queue Retrieval ({len(res.json())} loaded)")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [2/7] Applications Failed: {e}")

    # Test 3: APH Regulatory Rules
    try:
        res = client.get("/api/v1/rules")
        assert res.status_code == 200 and len(res.json()) >= 5
        
        # Test PUT update
        rule_id = res.json()[0]["id"]
        put_res = client.put(f"/api/v1/rules/{rule_id}", json={"thresholdValue": 18.0})
        assert put_res.status_code == 200
        print("[PASS] [3/7] Dynamic APH Rules Engine (GET & PUT live threshold update)")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [3/7] Rules Failed: {e}")

    # Test 4: SIH Evaluation Benchmarks
    try:
        res = client.get("/api/v1/metrics/evaluation-benchmarks")
        assert res.status_code == 200
        data = res.json()
        assert len(data["benchmarks"]) == 8
        print("[PASS] [4/7] SIH Prototype Evaluation Metrics (All 8 benchmarks active)")
        print(f"       - Extraction Accuracy: {data['benchmarks']['document_extraction_accuracy']['benchmark']}")
        print(f"       - Average Verification Time: {data['benchmarks']['average_verification_time']['benchmark']}")
        print(f"       - Manual Effort Reduction: {data['benchmarks']['reduction_in_manual_effort']['benchmark']}")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [4/7] Evaluation Benchmarks Failed: {e}")

    # Test 5: Scrutiny Action & Audit Logging
    try:
        res = client.post("/api/v1/scrutiny/record-action", json={
            "appId": "AICTE-2026-NRO-8841",
            "actionType": "Resolved Finding",
            "observation": "Cadre ratio deficiency resolved via appointment letter.",
            "actorRole": "Scrutiny Officer"
        })
        assert res.status_code == 200 and res.json()["success"]
        print("[PASS] [5/7] Scrutiny Action Recording into Audit Trail")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [5/7] Action Recording Failed: {e}")

    # Test 6: Live PDF Upload & Verification Pipeline
    try:
        clean_path = os.path.join(os.path.dirname(__file__), "uploads", "Clean_Fire_Safety_NOC.pdf")
        with open(clean_path, "rb") as f:
            files = [("files", ("Clean_Fire_Safety_NOC.pdf", f, "application/pdf"))]
            res = client.post("/api/v1/scrutiny/verify-files", files=files)
            assert res.status_code == 200
            data = res.json()
            assert data["recommendation_badge"] in ["GREEN", "AMBER", "RED"]
            print("[PASS] [6/7] Multi-Document Verification Pipeline")
            print(f"       - Outcome: {data['overall_recommendation']}")
            print(f"       - New Application ID: {data['application_id']}")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [6/7] Verification Pipeline Failed: {e}")

    # Test 7: Scrutiny Dossier PDF Export
    try:
        res = client.get("/api/v1/scrutiny/export-dossier/AICTE-2026-NRO-8841")
        assert res.status_code == 200 and res.headers["content-type"] == "application/pdf"
        assert len(res.content) > 1000
        print("[PASS] [7/8] Official AICTE Scrutiny Dossier PDF Generator")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [7/8] Dossier Export Failed: {e}")

    # Test 8: Ghost Faculty Cross-Institutional De-Duplication Sentinel
    try:
        # Verify National Registry endpoint
        res = client.get("/api/v1/faculty/national-registry")
        assert res.status_code == 200 and res.json()["total_registered_faculty"] >= 3
        
        # Verify Roster Cross-Check detecting Dr. Amiteshwar Sharma
        check_res = client.post("/api/v1/faculty/verify-roster", json={
            "faculty_names": ["Dr. Amiteshwar Sharma", "Dr. Rajesh Tiwari"],
            "app_id": "AICTE-2026-NRO-8841",
            "city": "Bhopal, Madhya Pradesh"
        })
        assert check_res.status_code == 200
        data = check_res.json()
        assert data["has_ghost_faculty"] is True
        assert len(data["conflicts"]) >= 1
        assert "Malwa Institute" in data["conflicts"][0]["primary_institution"]
        print("[PASS] [8/8] Ghost Faculty Sentinel & Pan-India De-Duplication Radar")
        print(f"       - Detected Ghost Faculty: {data['conflicts'][0]['faculty_name']}")
        print(f"       - Primary Conflict College: {data['conflicts'][0]['primary_institution']} ({data['conflicts'][0]['distance_km']} km away)")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [8/8] Ghost Faculty Sentinel Failed: {e}")

    # Test 9: Role-Based Authentication (RBAC) & Role-Filtered Notifications
    try:
        users_res = client.get("/api/v1/auth/users")
        assert users_res.status_code == 200 and len(users_res.json()) >= 3
        
        # Test Officer Login
        officer_login = client.post("/api/v1/auth/login", json={"role": "OFFICER"})
        assert officer_login.status_code == 200
        assert officer_login.json()["user"]["role"] == "OFFICER"
        
        # Test Institution Login
        inst_login = client.post("/api/v1/auth/login", json={"role": "INSTITUTION"})
        assert inst_login.status_code == 200
        assert inst_login.json()["user"]["role"] == "INSTITUTION"
        
        # Test Notification Filtering by Role
        officer_notifs = client.get("/api/v1/notifications?role=OFFICER")
        assert officer_notifs.status_code == 200
        for n in officer_notifs.json():
            assert n["targetRole"] in ["OFFICER", "ALL"]
            
        inst_notifs = client.get("/api/v1/notifications?role=INSTITUTION")
        assert inst_notifs.status_code == 200
        for n in inst_notifs.json():
            assert n["targetRole"] in ["INSTITUTION", "ALL"]
            
        print("[PASS] [9/9] RBAC Authentication & Role-Filtered Notifications")
        print("       - Officer Persona: Dr. Rajesh Verma (Vigilance & Tamper Alerts)")
        print("       - Institution Persona: Prof. Sunita Rao (Statutory Cure Memos & DPI Status)")
        passed += 1
    except Exception as e:
        print(f"[FAIL] [9/9] RBAC Auth Failed: {e}")

    print("\n=======================================================")
    print(f"[*] SUMMARY: {passed}/{total} BACKEND TESTS PASSED")
    if passed == total:
        print("[SUCCESS] ALL BACKEND ENGINES AND APIS ARE FULLY OPERATIONAL!")
    print("=======================================================\n")

if __name__ == "__main__":
    run_tests()
