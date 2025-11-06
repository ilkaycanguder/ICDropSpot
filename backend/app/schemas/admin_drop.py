from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AdminDropCreate(BaseModel):
    title: str
    description: Optional[str] = None
    stock: int = Field(ge=0)
    starts_at: datetime
    ends_at: datetime
    is_active: bool = True

class AdminDropUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    stock: Optional[int] = Field(default=None, ge=0)
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    is_active: Optional[bool] = None

class AdminDropOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    stock: int
    starts_at: datetime
    ends_at: datetime
    is_active: bool
    class Config:
        from_attributes = True

