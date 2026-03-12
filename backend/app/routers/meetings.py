from fastapi import APIRouter, Depends, HTTPException, Query
from ..auth import get_current_user
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from ..database import get_db
from ..models import Booking
from ..schemas import BookingResponse

router = APIRouter(prefix="/api/meetings", tags=["Meetings"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=List[BookingResponse])
def list_meetings(
    type: Optional[str] = Query("upcoming", description="upcoming | past | all"),
    db: Session = Depends(get_db)
):
    """List all meetings filtered by upcoming/past."""
    now = datetime.utcnow()
    query = db.query(Booking).filter(Booking.status != "cancelled")

    if type == "upcoming":
        query = query.filter(Booking.start_datetime >= now).order_by(Booking.start_datetime.asc())
    elif type == "past":
        query = query.filter(Booking.start_datetime < now).order_by(Booking.start_datetime.desc())
    else:
        query = query.order_by(Booking.start_datetime.desc())

    return query.all()


@router.get("/all", response_model=List[BookingResponse])
def list_all_meetings(db: Session = Depends(get_db)):
    return db.query(Booking).order_by(Booking.start_datetime.desc()).all()


@router.get("/{meeting_id}", response_model=BookingResponse)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == meeting_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return booking


@router.put("/{meeting_id}/cancel", response_model=BookingResponse)
def cancel_meeting(meeting_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == meeting_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Meeting is already cancelled")

    booking.status = "cancelled"
    db.commit()
    db.refresh(booking)
    return booking
