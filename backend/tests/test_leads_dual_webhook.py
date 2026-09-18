"""Backend tests for the dual-webhook lead capture + secured admin listing."""
import os
import time
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://growth-system-setup.preview.emergentagent.com").rstrip("/")
ADMIN_KEY = "psb7Kxt5g9s9pKmpjnD-n9Mm-f5BJBXw"
API = f"{BASE_URL}/api"


def _lead(email, with_time=False):
    d = {
        "owner_name": "QA Owner",
        "company_name": "QA Co",
        "email": email,
        "phone": "555-000-1111",
        "service_offered": "Roofing",
        "annual_revenue": "$2M – $5M",
        "city": "Dallas, TX",
        "website": "https://qa.example.com",
        "notes": "backend test",
    }
    if with_time:
        d["preferred_date"] = "Monday, Feb 3, 2026"
        d["preferred_time"] = "10:00 AM"
    return d


def _get_leads(key=ADMIN_KEY):
    return requests.get(f"{API}/leads", headers={"X-Admin-Key": key}, timeout=15)


def test_get_leads_requires_admin_key():
    r = requests.get(f"{API}/leads", timeout=15)
    assert r.status_code == 403


def test_get_leads_wrong_admin_key():
    r = requests.get(f"{API}/leads", headers={"X-Admin-Key": "bad"}, timeout=15)
    assert r.status_code == 403


def test_get_leads_with_admin_key_ok():
    r = _get_leads()
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_partial_lead_creates_form_submitted_stage():
    email = f"TEST_partial_{int(time.time()*1000)}@example.com"
    r = requests.post(f"{API}/leads/partial", json=_lead(email), timeout=15)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["status"] == "captured"
    assert "id" in body

    # Verify via GET
    leads = _get_leads().json()
    matches = [l for l in leads if l["email"] == email]
    assert len(matches) == 1
    assert matches[0]["lead_stage"] == "form_submitted"
    assert matches[0].get("preferred_date", "") == ""
    assert matches[0].get("preferred_time", "") == ""


def test_full_lead_upserts_same_email_to_appointment_requested():
    email = f"TEST_full_{int(time.time()*1000)}@example.com"

    # Partial first
    r1 = requests.post(f"{API}/leads/partial", json=_lead(email), timeout=15)
    assert r1.status_code == 200

    # Then full
    r2 = requests.post(f"{API}/leads", json=_lead(email, with_time=True), timeout=15)
    assert r2.status_code == 200, r2.text
    full = r2.json()
    assert full["lead_stage"] == "appointment_requested"
    assert full["preferred_date"] == "Monday, Feb 3, 2026"
    assert full["preferred_time"] == "10:00 AM"

    # Only ONE record for that email (upsert)
    leads = _get_leads().json()
    matches = [l for l in leads if l["email"] == email]
    assert len(matches) == 1, f"Expected 1 record, got {len(matches)}"
    assert matches[0]["lead_stage"] == "appointment_requested"
    assert matches[0]["preferred_date"] == "Monday, Feb 3, 2026"
    assert matches[0]["preferred_time"] == "10:00 AM"


def test_lead_validation_bad_email():
    r = requests.post(f"{API}/leads/partial", json={**_lead("not-an-email")}, timeout=15)
    assert r.status_code == 422


def test_lead_validation_missing_field():
    payload = _lead(f"TEST_missing_{int(time.time()*1000)}@example.com")
    payload.pop("owner_name")
    r = requests.post(f"{API}/leads", json=payload, timeout=15)
    assert r.status_code == 422
