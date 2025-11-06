from sqlalchemy.orm import Session
from app.repos.drop_repo import list_active_drops

def list_active_drops_dto(db: Session):
    drops = list_active_drops(db)
    return [
        {
            "id": d.id,
            "title": d.title,
            "description": d.description,
            "stock": d.stock,
            "starts_at": d.starts_at,
            "ends_at": d.ends_at,
        }
        for d in drops
    ]


