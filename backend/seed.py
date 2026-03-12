"""
Run this script to seed the database with sample data.
Usage: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from app.database import SessionLocal, engine, Base
from app.models import EventType, Availability, Booking, User
from app.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    print("🌱 Seeding database...")

    # Clear existing data
    db.query(Booking).delete()
    db.query(Availability).delete()
    db.query(EventType).delete()
    db.commit()

    # ── Event Types ──────────────────────────────────────────────────────────
    event_types = [
        EventType(
            name="15 Minute Meeting",
            duration_minutes=15,
            slug="15min",
            description="A quick sync to touch base, ask questions, or get updates.",
            color="#006BFF",
            location="Google Meet",
            is_active=True
        ),
        EventType(
            name="30 Minute Meeting",
            duration_minutes=30,
            slug="30min",
            description="A standard meeting for discussions, reviews, and planning.",
            color="#8B5CF6",
            location="Zoom",
            is_active=True
        ),
        EventType(
            name="60 Minute Meeting",
            duration_minutes=60,
            slug="60min",
            description="An in-depth session for detailed conversations and strategy.",
            color="#10B981",
            location="Microsoft Teams",
            is_active=True
        ),
    ]
    db.add_all(event_types)
    db.commit()
    for e in event_types:
        db.refresh(e)
    print(f"  ✅ Created {len(event_types)} event types")

    # ── Availability (Mon-Fri 9AM-5PM) ────────────────────────────────────────
    availability = []
    for day in range(5):  # 0=Monday to 4=Friday
        availability.append(Availability(
            day_of_week=day,
            start_time="09:00",
            end_time="17:00",
            timezone="America/New_York",
            is_active=True
        ))
    db.add_all(availability)
    db.commit()
    print(f"  ✅ Created availability for Mon-Fri 9AM-5PM")

    # ── Admin user ───────────────────────────────────────────────────────
    existing_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not existing_user:
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("password123"),
        )
        db.add(admin)
        db.commit()
        print("  ✅ Created default admin user (admin@example.com / password123)")
    else:
        print("  ✅ Admin user already exists")

    # ── Sample Bookings ───────────────────────────────────────────────────────
    now = datetime.utcnow()

    # Helper to get next weekday
    def next_weekday(d, weekday):
        days_ahead = weekday - d.weekday()
        if days_ahead <= 0:
            days_ahead += 7
        return d + timedelta(days=days_ahead)

    # Upcoming meetings
    next_mon = next_weekday(now, 0)
    next_tue = next_weekday(now, 1)
    next_wed = next_weekday(now, 2)

    upcoming = [
        Booking(
            event_type_id=event_types[0].id,
            invitee_name="Alice Johnson",
            invitee_email="alice@example.com",
            start_datetime=next_mon.replace(hour=10, minute=0, second=0, microsecond=0),
            end_datetime=next_mon.replace(hour=10, minute=15, second=0, microsecond=0),
            notes="Quick onboarding call",
            status="confirmed"
        ),
        Booking(
            event_type_id=event_types[1].id,
            invitee_name="Bob Smith",
            invitee_email="bob@example.com",
            start_datetime=next_tue.replace(hour=14, minute=0, second=0, microsecond=0),
            end_datetime=next_tue.replace(hour=14, minute=30, second=0, microsecond=0),
            notes="Product roadmap review",
            status="confirmed"
        ),
        Booking(
            event_type_id=event_types[2].id,
            invitee_name="Carol Davis",
            invitee_email="carol@example.com",
            start_datetime=next_wed.replace(hour=11, minute=0, second=0, microsecond=0),
            end_datetime=next_wed.replace(hour=12, minute=0, second=0, microsecond=0),
            notes="Strategy planning session",
            status="confirmed"
        ),
    ]

    # Past meetings
    past_dates = [now - timedelta(days=7), now - timedelta(days=3)]
    past = [
        Booking(
            event_type_id=event_types[1].id,
            invitee_name="David Lee",
            invitee_email="david@example.com",
            start_datetime=past_dates[0].replace(hour=9, minute=0, second=0, microsecond=0),
            end_datetime=past_dates[0].replace(hour=9, minute=30, second=0, microsecond=0),
            notes="Initial consultation",
            status="confirmed"
        ),
        Booking(
            event_type_id=event_types[0].id,
            invitee_name="Emma Wilson",
            invitee_email="emma@example.com",
            start_datetime=past_dates[1].replace(hour=15, minute=0, second=0, microsecond=0),
            end_datetime=past_dates[1].replace(hour=15, minute=15, second=0, microsecond=0),
            notes="Follow-up",
            status="confirmed"
        ),
    ]

    db.add_all(upcoming + past)
    db.commit()
    print(f"  ✅ Created {len(upcoming)} upcoming and {len(past)} past meetings")
    print("\n🎉 Database seeded successfully!")
    print("\nDefault user context:")
    print("  - Admin panel: http://localhost:5173")
    print("  - Public booking: http://localhost:5173/book/30min")

db.close()

if __name__ == "__main__":
    seed()
