from fastapi import FastAPI, APIRouter, Header, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import requests


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Outbound LeadConnector webhooks: form submit fires after step 2, appointment request after step 3
LEAD_WEBHOOK_URL = os.environ.get('LEAD_WEBHOOK_URL', '').strip()
APPOINTMENT_WEBHOOK_URL = os.environ.get('APPOINTMENT_WEBHOOK_URL', '').strip()
ADMIN_API_KEY = os.environ.get('ADMIN_API_KEY', '').strip()

# Create the main app without a prefix
app = FastAPI(title="Cherry Tree Agency API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class LeadCreate(BaseModel):
    owner_name: str
    company_name: str
    email: EmailStr
    phone: str
    service_offered: str
    annual_revenue: str
    city: Optional[str] = ""
    website: Optional[str] = ""
    notes: Optional[str] = ""
    preferred_date: Optional[str] = ""
    preferred_time: Optional[str] = ""


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_name: str
    company_name: str
    email: str
    phone: str
    service_offered: str
    annual_revenue: str
    city: str = ""
    website: str = ""
    notes: str = ""
    preferred_date: str = ""
    preferred_time: str = ""
    lead_stage: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Helpers ----------
def _forward_to_webhook(url: str, payload: dict):
    """Fire-and-forget forward of a lead to the given webhook URL."""
    if not url:
        return
    try:
        requests.post(url, json=payload, timeout=8)
    except Exception as exc:  # noqa: BLE001
        logging.getLogger(__name__).warning("Webhook forward failed: %s", exc)


async def _upsert_lead(payload: dict):
    """Insert or update a lead matched by email so partial + final submits stay one record."""
    existing = await db.leads.find_one({"email": payload["email"]}, {"_id": 0, "id": 1, "created_at": 1})
    if existing:
        payload["id"] = existing["id"]
        payload["created_at"] = existing["created_at"]
    payload["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads.update_one({"email": payload["email"]}, {"$set": payload}, upsert=True)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Cherry Tree Agency API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


@api_router.post("/leads/partial")
async def create_partial_lead(input: LeadCreate):
    """Fired when the visitor completes step 2 (before picking a call time)."""
    lead = Lead(**input.model_dump(), lead_stage="form_submitted")
    payload = lead.model_dump()
    payload['created_at'] = payload['created_at'].isoformat()

    await _upsert_lead(payload)

    if LEAD_WEBHOOK_URL:
        asyncio.create_task(asyncio.to_thread(_forward_to_webhook, LEAD_WEBHOOK_URL, payload))

    return {"status": "captured", "id": payload["id"]}


@api_router.post("/leads", response_model=Lead)
async def create_lead(input: LeadCreate):
    """Fired when the visitor confirms a day & time (step 3)."""
    lead = Lead(**input.model_dump(), lead_stage="appointment_requested")
    payload = lead.model_dump()
    payload['created_at'] = payload['created_at'].isoformat()

    await _upsert_lead(payload)

    if APPOINTMENT_WEBHOOK_URL:
        asyncio.create_task(asyncio.to_thread(_forward_to_webhook, APPOINTMENT_WEBHOOK_URL, payload))

    return lead


@api_router.get("/leads", response_model=List[Lead])
async def get_leads(x_admin_key: str = Header(default="")):
    if not ADMIN_API_KEY or x_admin_key != ADMIN_API_KEY:
        raise HTTPException(status_code=403, detail="Forbidden")
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for lead in leads:
        if isinstance(lead['created_at'], str):
            lead['created_at'] = datetime.fromisoformat(lead['created_at'])
    return leads


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
