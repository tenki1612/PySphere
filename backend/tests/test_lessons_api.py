from datetime import date, datetime, timedelta, timezone
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.lesson import Lesson
from app.models.user import User
from app.core.database import AsyncSessionLocal


@pytest.mark.asyncio
async def test_lessons_and_progress_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Create an initial lesson in DB
        async with AsyncSessionLocal() as session:
            lesson = Lesson(
                id=1,
                stage=1,
                day_number=1,
                slug="day-01-variables",
                title="Ngày 01: Biến số",
                topic="Nền tảng Python",
                description_md="Lý thuyết",
                starter_code="x = 1",
                solution_code="x = 10",
                xp_reward=50,
            )
            session.add(lesson)
            await session.commit()

        # Register user
        reg_res = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "student@pysphere.dev",
                "username": "student1",
                "password": "Password123!",
            },
        )
        token = reg_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Fetch lessons list
        lessons_res = await client.get("/api/v1/lessons")
        assert lessons_res.status_code == 200
        lessons = lessons_res.json()
        assert len(lessons) >= 1
        assert "has_visualizer" in lessons[0]

        # 2. Check that solution_code is HIDDEN for uncompleted lesson
        detail_res = await client.get("/api/v1/lessons/1", headers=headers)
        assert detail_res.status_code == 200
        detail = detail_res.json()
        assert detail["solution_code"] is None, "Solution code must be hidden for uncompleted lesson"
        assert detail["has_visualizer"] is False
        assert detail["visualizer_type"] is None

        # 3. Sync draft code for a lesson
        draft_payload = {
            "lesson_id": 1,
            "draft_code": "print('Draft code saved successfully!')",
        }
        draft_res = await client.post(
            "/api/v1/progress/sync-draft",
            json=draft_payload,
            headers=headers,
        )
        assert draft_res.status_code == 200

        # 4. Submit solution and gain XP
        sub_payload = {
            "lesson_id": 1,
            "submitted_code": "x = 10",
            "status": "PASSED",
            "execution_time_ms": 45,
            "tests_passed": 3,
            "tests_total": 3,
        }
        sub_res = await client.post(
            "/api/v1/submissions",
            json=sub_payload,
            headers=headers,
        )
        assert sub_res.status_code == 201
        sub_data = sub_res.json()
        assert sub_data["status"] == "PASSED"
        assert sub_data["xp_earned"] == 50

        # 5. Check user profile for updated XP and streak
        me_res = await client.get("/api/v1/auth/me", headers=headers)
        assert me_res.status_code == 200
        me = me_res.json()
        assert me["xp"] == 50
        assert me["streak_count"] == 1

        # 6. Now that lesson is completed, solution_code should be unlocked
        completed_detail_res = await client.get("/api/v1/lessons/1", headers=headers)
        assert completed_detail_res.status_code == 200
        assert completed_detail_res.json()["solution_code"] == "x = 10"


@pytest.mark.asyncio
async def test_create_lesson_requires_superuser():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Register regular user
        reg_res = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "hacker@pysphere.dev",
                "username": "hacker",
                "password": "Password123!",
            },
        )
        token = reg_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Attempt to create lesson as regular user
        res = await client.post(
            "/api/v1/lessons",
            json={
                "stage": 1,
                "day_number": 99,
                "slug": "day-99-malicious",
                "title": "Malicious Lesson",
                "topic": "Hacking",
                "description_md": "Bad",
                "starter_code": "pass",
                "solution_code": "pass",
            },
            headers=headers,
        )
        assert res.status_code == 403, f"Expected 403 Forbidden, got {res.status_code}"


@pytest.mark.asyncio
async def test_submit_nonexistent_lesson_returns_404():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reg_res = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "tester@pysphere.dev",
                "username": "tester",
                "password": "Password123!",
            },
        )
        token = reg_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        sub_res = await client.post(
            "/api/v1/submissions",
            json={
                "lesson_id": 99999,
                "submitted_code": "pass",
                "status": "PASSED",
            },
            headers=headers,
        )
        assert sub_res.status_code == 404, f"Expected 404 Not Found, got {sub_res.status_code}"


@pytest.mark.asyncio
async def test_streak_updated_on_repeat_submission_yesterday():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Create lesson
        async with AsyncSessionLocal() as session:
            lesson = Lesson(
                id=2,
                stage=1,
                day_number=2,
                slug="day-02-test",
                title="Lesson 2",
                topic="Basics",
                description_md="Desc",
                starter_code="pass",
                solution_code="pass",
                xp_reward=50,
            )
            session.add(lesson)
            await session.commit()

        # Register user
        reg_res = await client.post(
            "/api/v1/auth/register",
            json={
                "email": "streaker@pysphere.dev",
                "username": "streaker",
                "password": "Password123!",
            },
        )
        token = reg_res.json()["access_token"]
        user_id = reg_res.json()["user"]["id"]
        headers = {"Authorization": f"Bearer {token}"}

        # Simulate user last active yesterday with streak 3
        yesterday = datetime.now(timezone.utc).date() - timedelta(days=1)
        async with AsyncSessionLocal() as session:
            db_user = await session.get(User, user_id)
            db_user.last_active_date = yesterday
            db_user.streak_count = 3
            await session.commit()

        # Submit passed solution on lesson
        sub_res = await client.post(
            "/api/v1/submissions",
            json={
                "lesson_id": 2,
                "submitted_code": "pass",
                "status": "PASSED",
            },
            headers=headers,
        )
        assert sub_res.status_code == 201
        res_data = sub_res.json()
        assert res_data["current_streak"] == 4, f"Expected streak 4, got {res_data['current_streak']}"

