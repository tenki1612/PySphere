import pytest
from app.core.database import engine, Base


@pytest.fixture(autouse=True)
async def setup_test_db():
    """Ensure database tables are fresh and clean before each test."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
