from pydantic import BaseModel
from datetime import datetime

class ClaimIn(BaseModel):
    user_id: int

class ClaimOut(BaseModel):
    id: int
    user_id: int
    drop_id: int
    code: str
    claimed_at: datetime

    class Config:
        from_attributes = True


