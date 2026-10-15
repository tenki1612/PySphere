import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_lessons_and_progress_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
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
        assert isinstance(lessons, list)

        # 2. Sync draft code for a lesson
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
        draft_data = draft_res.json()
        assert draft_data["lesson_id"] == 1
        assert "Draft code" in draft_data["draft_code"]

        # 3. Submit solution and gain XP
        sub_payload = {
            "lesson_id": 1,
            "submitted_code": "x = 10\ny = 20\nprint(x + y)",
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

        # 4. Check user profile for updated XP and streak
        me_res = await client.get("/api/v1/auth/me", headers=headers)
        assert me_res.status_code == 200
        me = me_res.json()
        assert me["xp"] == 50
        assert me["streak_count"] >= 1
