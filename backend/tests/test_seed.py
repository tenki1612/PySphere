import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.seed import seed_curriculum


@pytest.mark.asyncio
async def test_seed_and_fetch_lessons():
    # 1. Run seed curriculum
    seeded_count = await seed_curriculum()
    assert seeded_count == 60, f"Expected 60 lessons, got {seeded_count}"

    # 2. Fetch through API
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/v1/lessons")
        assert res.status_code == 200
        lessons = res.json()
        assert len(lessons) == 60

        # Verify Day 1 lesson data
        day1 = next((l for l in lessons if l["day_number"] == 1), None)
        assert day1 is not None
        assert "Ngày 01" in day1["title"]
        assert day1["stage"] == 1

        # Fetch Day 1 detailed info
        detail_res = await client.get("/api/v1/lessons/1")
        assert detail_res.status_code == 200
        detail = detail_res.json()
        assert "format_user_profile" in detail["starter_code"]
        assert len(detail["test_cases"]) >= 3

