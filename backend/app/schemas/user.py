from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    is_active: bool
    roles: List[str] = []
    class Config: from_attributes = True
