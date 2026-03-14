---
title: Schedulr Backend
emoji: API
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# Schedulr Backend

FastAPI backend for the Schedulr project, packaged for deployment on Hugging Face Spaces with the Docker SDK.

## What this setup does

- Runs the API with `uvicorn` on port `7860`, which is the default external port for Docker Spaces.
- Uses SQLite by default.
- Automatically stores the SQLite database in `/data/calendly_clone.db` when the Space has persistent storage enabled.
- Falls back to `./calendly_clone.db` outside Hugging Face, so local development still works as before.

## Deploy to Hugging Face

1. Create a new Space on Hugging Face.
2. Choose `Docker` as the Space SDK.
3. Upload the contents of this `backend/` folder as the root of the Space repository.
4. In the Space settings, add this runtime variable if your frontend is hosted elsewhere:
   - `ALLOWED_ORIGINS=https://your-frontend-domain`
   - If you have multiple origins, separate them with commas.
5. Optional but recommended: enable persistent storage in the Space settings so SQLite data survives restarts.
6. Let the Space build and start.

## Important notes

- If persistent storage is not enabled, data will reset when the Space restarts.
- `seed.py` clears and recreates sample data, so only run it when you explicitly want to reset the database.
- Health check: `/health`
- Swagger docs: `/docs`

## Local run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
