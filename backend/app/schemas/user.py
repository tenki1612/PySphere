from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, computed_field


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    xp: int
    streak_count: int
    last_active_date: Optional[date] = None
    created_at: datetime

    @computed_field
    @property
    def role(self) -> str:
        return "admin" if self.is_superuser else "user"

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
