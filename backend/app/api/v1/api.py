from fastapi import APIRouter
from app.api.v1.endpoints import auth, lessons, progress, submissions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["Lessons & Curriculum"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress & State"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["Submissions & Gamification"])
