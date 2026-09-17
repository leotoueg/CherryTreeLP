"""Backend tests for Cherry Tree Agency lead capture endpoints (3-step form).

Schema changes:
- postal_code REMOVED
- city (optional) ADDED
- preferred_date, preferred_time ADDED

Minimizes live POSTs since each successful POST fires the real LeadConnector webhook.
Cleanup fixture deletes any TEST leads from Mongo after the run.
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    env_path = "/app/frontend/.env"
    with open(env_path) as fh:
        for line in fh:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break

BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

TEST_EMAIL = "qa-webhook-test@example.com"
TEST_EMAIL_NO_CITY = "qa-webhook-nocity@example.com"

# Capture backend err log size at module import (BEFORE any POSTs happen)
_BACKEND_ERR_LOG = "/var/log/supervisor/backend.err.log"
try:
    _LOG_START_OFFSET = os.path.getsize(_BACKEND_ERR_LOG)
except OSError:
    _LOG_START_OFFSET = None

VALID_PAYLOAD = {
    "owner_name": "QA Webhook Test",
    "company_name": "TEST_QA Webhook Co.",
    "email": TEST_EMAIL,
    "phone": "(555) 000-0000",
    "service_offered": "Roofing",
    "annual_revenue": "$2M \u2013 $5M",
    "city": "Dallas, TX",
    "website": "https://qa-webhook-test.example",
    "notes": "QA webhook regression test - safe to ignore",
    "preferred_date": "Monday, Jan 26, 2026",
    "preferred_time": "2:00 PM",
}


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "Cherry Tree" in data.get("message", "")


class TestLeads:
    created_id = None

    def test_create_lead_valid_with_city_and_booking(self, client):
        """Single live POST -- exercises webhook forward with full new schema."""
        r = client.post(f"{API}/leads", json=VALID_PAYLOAD)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        assert "created_at" in data
        for k, v in VALID_PAYLOAD.items():
            assert data[k] == v, f"Field {k} mismatch: {data[k]!r} != {v!r}"
        # Ensure removed field isn't echoed
        assert "postal_code" not in data
        TestLeads.created_id = data["id"]

    def test_get_leads_contains_created_newest_first(self, client):
        assert TestLeads.created_id is not None
        r = client.get(f"{API}/leads")
        assert r.status_code == 200
        leads = r.json()
        assert isinstance(leads, list) and len(leads) > 0
        ids = [l["id"] for l in leads]
        assert TestLeads.created_id in ids
        timestamps = [l["created_at"] for l in leads]
        assert timestamps == sorted(timestamps, reverse=True)
        assert leads[0]["id"] == TestLeads.created_id
        assert leads[0]["preferred_time"] == "2:00 PM"
        assert leads[0]["preferred_date"] != ""

    def test_create_lead_city_optional_omitted(self, client):
        """City is optional -- omitting it should still return 200."""
        payload = dict(VALID_PAYLOAD)
        payload["email"] = TEST_EMAIL_NO_CITY
        payload["company_name"] = "TEST_NoCity Co."
        payload.pop("city")
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["city"] == ""
        assert data["email"] == TEST_EMAIL_NO_CITY

    def test_create_lead_city_optional_empty_string(self, client):
        """City empty string should also work."""
        payload = dict(VALID_PAYLOAD)
        payload["email"] = "qa-webhook-emptycity@example.com"
        payload["company_name"] = "TEST_EmptyCity Co."
        payload["city"] = ""
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        assert r.json()["city"] == ""

    def test_create_lead_invalid_email(self, client):
        payload = dict(VALID_PAYLOAD)
        payload["email"] = "not-an-email"
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 422, r.text

    def test_create_lead_missing_email(self, client):
        payload = dict(VALID_PAYLOAD)
        payload.pop("email")
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 422, r.text

    def test_create_lead_missing_phone(self, client):
        payload = dict(VALID_PAYLOAD)
        payload.pop("phone")
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 422, r.text

    def test_webhook_forward_no_error_logged(self, client):
        """Regression: ensure no 'Webhook forward failed' or ObjectId serialization
        error appears in backend.err.log AFTER our POSTs. Webhook fires in a
        background asyncio task, so wait a few seconds before inspecting."""
        if _LOG_START_OFFSET is None:
            pytest.skip(f"{_BACKEND_ERR_LOG} not accessible")

        time.sleep(4)

        with open(_BACKEND_ERR_LOG, "r", errors="ignore") as fh:
            fh.seek(_LOG_START_OFFSET)
            new_content = fh.read()

        assert "Webhook forward failed" not in new_content, (
            "Regression: 'Webhook forward failed' found in NEW log entries:\n"
            + new_content[-2000:]
        )
        assert "Object of type ObjectId is not JSON serializable" not in new_content, (
            "Regression: ObjectId serialization error in NEW log entries:\n"
            + new_content[-2000:]
        )


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_leads():
    yield
    try:
        from pymongo import MongoClient
        from dotenv import dotenv_values
        env = dotenv_values("/app/backend/.env")
        mongo_url = env.get("MONGO_URL", "").strip('"')
        db_name = env.get("DB_NAME", "").strip('"')
        if mongo_url and db_name:
            mc = MongoClient(mongo_url)
            emails = [
                TEST_EMAIL,
                TEST_EMAIL_NO_CITY,
                "qa-webhook-emptycity@example.com",
                "qa-3step-test@example.com",
            ]
            res = mc[db_name]["leads"].delete_many({"email": {"$in": emails}})
            print(f"[cleanup] Deleted {res.deleted_count} test lead(s)")
            mc.close()
    except Exception as e:
        print(f"[cleanup] Failed: {e}")
