from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, date as date_type, time as time_type
from typing import List

from ..database import get_db
from ..models import EventType, Availability, Booking
from ..schemas import BookingCreate, BookingResponse, AvailableSlotsResponse, TimeSlot

router = APIRouter(prefix="/api/public", tags=["Public Booking"])


@router.get("/{slug}")
def get_public_event(slug: str, db: Session = Depends(get_db)):
    """Get event type info for public booking page."""
    event = db.query(EventType).filter(
        EventType.slug == slug,
        EventType.is_active == True
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")
    return {
        "id": event.id,
        "name": event.name,
        "duration_minutes": event.duration_minutes,
        "slug": event.slug,
        "description": event.description,
        "color": event.color,
        "location": event.location,
    }


@router.get("/{slug}/slots", response_model=AvailableSlotsResponse)
def get_available_slots(
    slug: str,
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    """Get available time slots for a given event type and date."""
    # Parse date
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Don't allow past dates
    if date_obj < date_type.today():
        return AvailableSlotsResponse(date=date, slots=[])

    # Get event type
    event = db.query(EventType).filter(
        EventType.slug == slug,
        EventType.is_active == True
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")

    # day_of_week: 0=Monday, 6=Sunday (Python's weekday())
    day_of_week = date_obj.weekday()

    # Get availability for this day
    avail = db.query(Availability).filter(
        Availability.day_of_week == day_of_week,
        Availability.is_active == True
    ).first()

    if not avail:
        return AvailableSlotsResponse(date=date, slots=[])

    # Parse start and end times
    s_h, s_m = map(int, avail.start_time.split(":"))
    e_h, e_m = map(int, avail.end_time.split(":"))
    duration = event.duration_minutes

    # Generate all possible slots
    slots: List[TimeSlot] = []
    current_minutes = s_h * 60 + s_m
    end_minutes = e_h * 60 + e_m

    while current_minutes + duration <= end_minutes:
        slot_start_h = current_minutes // 60
        slot_start_m = current_minutes % 60
        slot_end_minutes = current_minutes + duration
        slot_end_h = slot_end_minutes // 60
        slot_end_m = slot_end_minutes % 60

        start_dt = datetime.combine(date_obj, time_type(slot_start_h, slot_start_m))
        slots.append(TimeSlot(
            start=f"{slot_start_h:02d}:{slot_start_m:02d}",
            end=f"{slot_end_h:02d}:{slot_end_m:02d}",
            start_datetime=start_dt.isoformat()
        ))
        current_minutes += duration

    # Get confirmed bookings for this date
    day_start = datetime.combine(date_obj, time_type(0, 0, 0))
    day_end = datetime.combine(date_obj, time_type(23, 59, 59))

    existing = db.query(Booking).filter(
        Booking.event_type_id == event.id,
        Booking.start_datetime >= day_start,
        Booking.start_datetime <= day_end,
        Booking.status == "confirmed"
    ).all()

    # Filter out booked slots
    available = []
    now = datetime.utcnow()
    for slot in slots:
        slot_start = datetime.fromisoformat(slot.start_datetime)
        slot_end = slot_start + timedelta(minutes=duration)

        # Skip past slots (for today)
        if slot_start <= now:
            continue

        is_booked = any(
            b.start_datetime < slot_end and b.end_datetime > slot_start
            for b in existing
        )
        if not is_booked:
            available.append(slot)

    return AvailableSlotsResponse(date=date, slots=available)


@router.post("/{slug}/book", response_model=BookingResponse, status_code=201)
def create_booking(slug: str, payload: BookingCreate, db: Session = Depends(get_db)):
    """Create a new booking."""
    event = db.query(EventType).filter(
        EventType.slug == slug,
        EventType.is_active == True
    ).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")

    start_dt = payload.start_datetime
    end_dt = start_dt + timedelta(minutes=event.duration_minutes)

    # Check for conflicts
    conflict = db.query(Booking).filter(
        Booking.event_type_id == event.id,
        Booking.status == "confirmed",
        Booking.start_datetime < end_dt,
        Booking.end_datetime > start_dt
    ).first()

    if conflict:
        raise HTTPException(status_code=409, detail="This time slot is already booked. Please choose another.")

    booking = Booking(
        event_type_id=event.id,
        invitee_name=payload.invitee_name,
        invitee_email=payload.invitee_email,
        start_datetime=start_dt,
        end_datetime=end_dt,
        notes=payload.notes,
        status="confirmed"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking
