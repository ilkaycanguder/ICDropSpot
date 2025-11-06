from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DropOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    stock: int
    starts_at: datetime
    ends_at: datetime

    class Config:
        from_attributes = True


