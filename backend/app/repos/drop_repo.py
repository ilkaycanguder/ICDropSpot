from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql import func
from app.models.drop import Drop

def list_active_drops(db: Session):
    now = func.now()
    stmt = (
        select(Drop)
        .where(Drop.is_active == True)
        .where(Drop.starts_at <= now)
        .where(Drop.ends_at >= now)
    )
    return db.execute(stmt).scalars().all()


