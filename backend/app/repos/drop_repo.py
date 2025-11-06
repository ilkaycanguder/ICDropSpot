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
def get_drop_by_id(db: Session, drop_id: int):
    return db.scalar(select(Drop).where(Drop.id == drop_id))

