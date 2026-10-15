from datetime import date, datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.lesson import Lesson
from app.models.progress import UserProgress
from app.models.submission import Submission
from app.models.user import User
from app.schemas.submission import (
    SubmissionCreate,
    SubmissionResponse,
    SubmissionResultResponse,
)

router = APIRouter()


@router.post("", response_model=SubmissionResultResponse, status_code=status.HTTP_201_CREATED)
async def submit_code(
    payload: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Save code submission and handle gamification (XP & Streak)."""
    # 1. Fetch lesson - return 404 if not found
    lesson_res = await db.execute(select(Lesson).where(Lesson.id == payload.lesson_id))
    lesson = lesson_res.scalar_one_or_none()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson with ID {payload.lesson_id} not found",
        )

    # 2. Record submission record
    submission = Submission(
        user_id=current_user.id,
        lesson_id=payload.lesson_id,
        submitted_code=payload.submitted_code,
        status=payload.status,
        execution_time_ms=payload.execution_time_ms,
        tests_passed=payload.tests_passed,
        tests_total=payload.tests_total,
        error_message=payload.error_message,
    )
    db.add(submission)

    # 3. Handle Progress and Gamification if PASSED
    xp_earned = 0
    is_first_completion = False

    if payload.status == "PASSED":
        prog_res = await db.execute(
            select(UserProgress).where(
                UserProgress.user_id == current_user.id,
                UserProgress.lesson_id == payload.lesson_id,
            )
        )
        progress = prog_res.scalar_one_or_none()

        if not progress:
            progress = UserProgress(
                user_id=current_user.id,
                lesson_id=payload.lesson_id,
                is_completed=True,
                completed_at=datetime.now(timezone.utc),
            )
            db.add(progress)
            is_first_completion = True
        elif not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = datetime.now(timezone.utc)
            is_first_completion = True

        # Award XP on first completion
        if is_first_completion:
            xp_earned = lesson.xp_reward or 50
            current_user.xp += xp_earned

        # Update streak on ANY passed submission on a new day (UTC based)
        today = datetime.now(timezone.utc).date()
        if current_user.last_active_date is None:
            current_user.streak_count = 1
            current_user.last_active_date = today
        elif current_user.last_active_date == today:
            pass  # Already active today, streak maintained
        elif current_user.last_active_date == today - timedelta(days=1):
            current_user.streak_count += 1
            current_user.last_active_date = today
        else:
            # Missed more than 1 day, reset streak to 1
            current_user.streak_count = 1
            current_user.last_active_date = today

    await db.commit()
    await db.refresh(submission)
    await db.refresh(current_user)

    return SubmissionResultResponse(
        submission_id=submission.id,
        status=submission.status,
        xp_earned=xp_earned,
        current_streak=current_user.streak_count,
        total_xp=current_user.xp,
        is_first_completion=is_first_completion,
    )


@router.get("/history", response_model=List[SubmissionResponse])
async def get_submission_history(
    lesson_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve history of submissions by current learner."""
    query = (
        select(Submission)
        .where(Submission.user_id == current_user.id)
        .order_by(Submission.created_at.desc())
    )
    if lesson_id:
        query = query.where(Submission.lesson_id == lesson_id)

    result = await db.execute(query)
    submissions = result.scalars().all()
    return [SubmissionResponse.model_validate(s) for s in submissions]

