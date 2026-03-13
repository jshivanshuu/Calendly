from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Availability
from ..schemas import AvailabilityCreate, AvailabilityUpdate, AvailabilityResponse

router = APIRouter(prefix="/api/availability", tags=["Availability"])

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


@router.get("/", response_model=List[AvailabilityResponse])
def get_availability(db: Session = Depends(get_db)):
    return db.query(Availability).order_by(Availability.day_of_week).all()


@router.put("/bulk", response_model=List[AvailabilityResponse])
def upsert_availability(payload: List[AvailabilityCreate], db: Session = Depends(get_db)):
    """Bulk upsert - replace all availability settings."""
    # Delete all existing
    db.query(Availability).delete()
    db.commit()

    results = []
    for avail_data in payload:
        avail = Availability(**avail_data.model_dump())
        db.add(avail)
        results.append(avail)

    db.commit()
    for r in results:
        db.refresh(r)
    return results


@router.put("/{avail_id}", response_model=AvailabilityResponse)
def update_availability(avail_id: int, payload: AvailabilityUpdate, db: Session = Depends(get_db)):
    avail = db.query(Availability).filter(Availability.id == avail_id).first()
    if not avail:
        raise HTTPException(status_code=404, detail="Availability not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(avail, field, value)

    db.commit()
    db.refresh(avail)
    return avail
