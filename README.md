# Schedulr

A full-stack scheduling and booking web application with a polished scheduler-style experience.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Python 3.10+ + FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy 2 |
| HTTP Client | Axios |

---

## Project Structure

```
calendly-clone/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + CORS + routes
│   │   ├── database.py      # DB connection (SQLAlchemy)
│   │   ├── models.py        # ORM models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   └── routers/
│   │       ├── event_types.py
│   │       ├── availability.py
│   │       ├── bookings.py  # Public booking + time slots
│   │       └── meetings.py
│   ├── seed.py              # Seed database with sample data
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api/index.js     # All API calls
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── EventTypeCard.jsx
    │   │   ├── Calendar.jsx
    │   │   └── TimeSlots.jsx
    │   └── pages/
    │       ├── Dashboard.jsx         # Event Types management
    │       ├── Availability.jsx      # Availability settings
    │       ├── Meetings.jsx          # Upcoming/past meetings
    │       ├── PublicBooking.jsx     # Public booking page
    │       └── BookingConfirmation.jsx
    ├── package.json
    └── .env.example
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- SQLite (built-in with Python)

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env if needed (defaults to SQLite):
# DATABASE_URL=sqlite:///./calendly_clone.db

# Run the server (tables are auto-created on startup)
uvicorn app.main:app --reload --port 8000

# Seed sample data (in another terminal, with venv active)
python seed.py
```

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# .env already has: VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Usage

### Admin Panel
- **http://localhost:5173** — Event Types (create, edit, delete)
- **http://localhost:5173/availability** — Set weekly availability (days + hours)
- **http://localhost:5173/meetings** — View upcoming/past meetings, cancel meetings

### Public Booking
- **http://localhost:5173/book/30min** — Book a 30-minute meeting
- **http://localhost:5173/book/15min** — Book a 15-minute meeting
- **http://localhost:5173/book/60min** — Book a 60-minute meeting

---

## API Endpoints

### Event Types
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/event-types/` | List all event types |
| POST | `/api/event-types/` | Create event type |
| PUT | `/api/event-types/{id}` | Update event type |
| DELETE | `/api/event-types/{id}` | Soft-delete event type |

### Availability
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/availability/` | Get all availability settings |
| PUT | `/api/availability/bulk` | Bulk upsert availability |
| PUT | `/api/availability/{id}` | Update single day |

### Public Booking
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/public/{slug}` | Get event type info |
| GET | `/api/public/{slug}/slots?date=YYYY-MM-DD` | Get available time slots |
| POST | `/api/public/{slug}/book` | Create a booking |

### Meetings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/meetings/?type=upcoming` | List upcoming meetings |
| GET | `/api/meetings/?type=past` | List past meetings |
| PUT | `/api/meetings/{id}/cancel` | Cancel a meeting |

---

## Database Schema

```sql
-- event_types
id, name, duration_minutes, slug (unique), description, 
color, location, is_active, created_at

-- availability
id, day_of_week (0=Mon, 6=Sun), start_time ("09:00"), 
end_time ("17:00"), timezone, is_active

-- bookings
id, event_type_id (FK), invitee_name, invitee_email, 
start_datetime, end_datetime, notes, status (confirmed|cancelled), created_at
```

---

## Assumptions

1. **No authentication** — A default admin user is always assumed to be logged in for the admin panel.
2. **Single user** — One set of availability and event types (no multi-user).
3. **Timezone display** — Availability timezone is shown to invitees; times are stored in local time.
4. **Double-booking prevention** — The API rejects bookings that overlap with an existing confirmed booking for the same event type.
5. **Past slots hidden** — Slots in the past (including today's already-passed times) are not shown.
6. **Soft delete** — Deleting an event type sets `is_active=false`; existing bookings are preserved.

---

## Deployment

### Backend (Render / Railway)
1. Set env var: `DATABASE_URL=sqlite:///./calendly_clone.db` (or use a hosted DB like Postgres)
2. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel / Netlify)
1. Set env var: `VITE_API_URL=https://your-backend.render.com`
2. Build command: `npm run build`
3. Output directory: `dist`

---

## Features Implemented

- ✅ Event Types CRUD (create, edit, delete, list)
- ✅ Unique public booking URL per event type (`/book/:slug`)
- ✅ Availability settings (per day, time range, timezone)
- ✅ Public booking page with a 3-panel booking layout
- ✅ Month calendar view with unavailable days greyed out
- ✅ Available time slots generation
- ✅ Double-booking prevention
- ✅ Booking confirmation page
- ✅ Meetings page (upcoming / past tabs)
- ✅ Cancel meeting
- ✅ Seeded sample data
- ✅ Responsive layout
- ✅ Clean scheduling-focused UI
