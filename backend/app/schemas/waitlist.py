from pydantic import BaseModel
from datetime import datetime

class WaitlistJoinIn(BaseModel):
    user_id: int

class WaitlistJoinOut(BaseModel):
    id: int
    user_id: int
    drop_id: int
    joined_at: datetime

    class Config:
        from_attributes = True
