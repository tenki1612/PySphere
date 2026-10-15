import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_register_and_login_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Register new user
        reg_payload = {
            "email": "coder@pysphere.dev",
            "username": "pycoder",
            "password": "Password123!",
        }
        reg_res = await client.post("/api/v1/auth/register", json=reg_payload)
        assert reg_res.status_code == 201, reg_res.text
        reg_data = reg_res.json()
        assert "access_token" in reg_data
        assert reg_data["user"]["username"] == "pycoder"

        # 2. Login with credentials
        login_res = await client.post(
            "/api/v1/auth/login",
            json={"email": "coder@pysphere.dev", "password": "Password123!"},
        )
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]

        # 3. Access current user profile (/me)
        me_res = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["email"] == "coder@pysphere.dev"
        assert me_data["xp"] == 0
        assert me_data["streak_count"] == 0

