import pytest
from app.core.database import init_db


@pytest.fixture(autouse=True)
async def setup_test_db():
    """Ensure database tables are created before running tests."""
    await init_db()
    yield
