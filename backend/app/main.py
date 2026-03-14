import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import event_types, availability, bookings, meetings

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Schedulr API",
    description="A scheduling platform API",
    version="1.0.0"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000",
    ).split(",")
    if origin.strip()
]

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(event_types.router)
app.include_router(availability.router)
app.include_router(bookings.router)
app.include_router(meetings.router)

frontend_dist_dir = Path(__file__).resolve().parents[2] / "frontend" / "dist"
frontend_index_file = frontend_dist_dir / "index.html"


@app.get("/")
def root():
    if frontend_index_file.exists():
        return FileResponse(frontend_index_file)
    return {"message": "Schedulr API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    if not frontend_index_file.exists():
        return {"message": "Schedulr API is running", "docs": "/docs"}

    requested_path = (frontend_dist_dir / full_path).resolve()
    if (
        full_path
        and requested_path.is_file()
        and requested_path.is_relative_to(frontend_dist_dir.resolve())
    ):
        return FileResponse(requested_path)

    return FileResponse(frontend_index_file)
