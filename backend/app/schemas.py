from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── EventType ────────────────────────────────────────────────────────────────

class EventTypeCreate(BaseModel):
    name: str
    duration_minutes: int
    slug: str
    description: Optional[str] = None
    color: Optional[str] = "#006BFF"
    location: Optional[str] = "Video Call"


class EventTypeUpdate(BaseModel):
    name: Optional[str] = None
    duration_minutes: Optional[int] = None
    description: Optional[str] = None
    color: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None


class EventTypeResponse(BaseModel):
    id: int
    name: str
    duration_minutes: int
    slug: str
    description: Optional[str]
    color: str
    location: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Availability ─────────────────────────────────────────────────────────────

class AvailabilityCreate(BaseModel):
    day_of_week: int
    start_time: str
    end_time: str
    timezone: Optional[str] = "America/New_York"
    is_active: Optional[bool] = True


class AvailabilityUpdate(BaseModel):
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    timezone: Optional[str] = None
    is_active: Optional[bool] = None


class AvailabilityResponse(BaseModel):
    id: int
    day_of_week: int
    start_time: str
    end_time: str
    timezone: str
    is_active: bool

    model_config = {"from_attributes": True}


# ─── Booking ──────────────────────────────────────────────────────────────────

class BookingCreate(BaseModel):
    invitee_name: str
    invitee_email: EmailStr
    start_datetime: datetime
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    event_type_id: int
    invitee_name: str
    invitee_email: str
    start_datetime: datetime
    end_datetime: datetime
    notes: Optional[str]
    status: str
    created_at: datetime
    event_type: EventTypeResponse

    model_config = {"from_attributes": True}


# ─── Slots ────────────────────────────────────────────────────────────────────

class TimeSlot(BaseModel):
    start: str          # "09:00"
    end: str            # "09:30"
    start_datetime: str  # ISO string


class AvailableSlotsResponse(BaseModel):
    date: str
    slots: List[TimeSlot]
