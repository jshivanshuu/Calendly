from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class EventType(Base):
    __tablename__ = "event_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=30)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    color = Column(String(20), default="#006BFF")
    location = Column(String(300), default="Video Call")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="event_type", cascade="all, delete-orphan")


class Availability(Base):
    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(String(5), nullable=False)   # "09:00"
    end_time = Column(String(5), nullable=False)     # "17:00"
    timezone = Column(String(50), default="America/New_York")
    is_active = Column(Boolean, default=True)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    event_type_id = Column(Integer, ForeignKey("event_types.id"))
    invitee_name = Column(String(200), nullable=False)
    invitee_email = Column(String(200), nullable=False)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(20), default="confirmed")  # confirmed | cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    event_type = relationship("EventType", back_populates="bookings")
