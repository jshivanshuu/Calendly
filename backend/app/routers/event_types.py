from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import EventType
from ..schemas import EventTypeCreate, EventTypeUpdate, EventTypeResponse

router = APIRouter(prefix="/api/event-types", tags=["Event Types"])


@router.get("/", response_model=List[EventTypeResponse])
def list_event_types(db: Session = Depends(get_db)):
    return db.query(EventType).filter(EventType.is_active == True).order_by(EventType.created_at.desc()).all()


@router.post("/", response_model=EventTypeResponse, status_code=201)
def create_event_type(payload: EventTypeCreate, db: Session = Depends(get_db)):
    existing = db.query(EventType).filter(EventType.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already in use. Choose a different one.")

    event = EventType(**payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.get("/{event_id}", response_model=EventTypeResponse)
def get_event_type(event_id: int, db: Session = Depends(get_db)):
    event = db.query(EventType).filter(EventType.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")
    return event


@router.put("/{event_id}", response_model=EventTypeResponse)
def update_event_type(event_id: int, payload: EventTypeUpdate, db: Session = Depends(get_db)):
    event = db.query(EventType).filter(EventType.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=204)
def delete_event_type(event_id: int, db: Session = Depends(get_db)):
    event = db.query(EventType).filter(EventType.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event type not found")

    # Soft delete
    event.is_active = False
    db.commit()
    return None
