from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import event_types, availability, bookings, meetings

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Calendly Clone API",
    description="A scheduling platform API",
    version="1.0.0"
)

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(event_types.router)
app.include_router(availability.router)
app.include_router(bookings.router)
app.include_router(meetings.router)


@app.get("/")
def root():
    return {"message": "Calendly Clone API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
