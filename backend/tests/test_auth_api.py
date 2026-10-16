import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.models.user import User
from app.core.database import AsyncSessionLocal
from app.core.security import create_access_token


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
        assert reg_data["user"]["role"] == "user"

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
        assert me_data["role"] == "user"
        assert me_data["is_superuser"] is False
        assert me_data["xp"] == 0
        assert me_data["streak_count"] == 0


@pytest.mark.asyncio
async def test_admin_user_role():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Create an admin user directly in DB
        async with AsyncSessionLocal() as session:
            admin = User(
                email="admin@pysphere.dev",
                username="pyadmin",
                hashed_password="somehashvalue",
                is_superuser=True,
            )
            session.add(admin)
            await session.commit()
            await session.refresh(admin)
            admin_id = admin.id

        token = create_access_token(subject=admin_id)
        res = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert res.status_code == 200
        data = res.json()
        assert data["is_superuser"] is True
        assert data["role"] == "admin"
