from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.repos.drop_repo import list_active_drops

def list_active_drops_dto(db: Session):
    drops = list_active_drops(db)
    now = db.scalar(select(func.now()))
    return [
        {
            "id": d.id,
            "title": d.title,
            "description": d.description,
            "stock": d.stock,
            "starts_at": d.starts_at,
            "ends_at": d.ends_at,
            "is_active": d.is_active,
            "is_waitlist_open": bool(d.is_active and now <= d.ends_at),
            "is_claim_open": bool(d.is_active and d.starts_at <= now <= d.ends_at),
        }
        for d in drops
    ]


