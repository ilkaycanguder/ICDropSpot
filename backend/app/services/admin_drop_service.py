from datetime import datetime
from sqlalchemy.orm import Session
from app.repos.drop_repo import create_drop, update_drop, delete_drop, get_drop_by_id

def _validate_window(starts_at: datetime, ends_at: datetime):
    if starts_at >= ends_at:
        raise ValueError("starts_at must be before ends_at")

def create_drop_dto(db: Session, *, title: str, description: str|None, stock: int, starts_at: datetime, ends_at: datetime, is_active: bool=True):
    _validate_window(starts_at, ends_at)
    d = create_drop(db, title=title, description=description, stock=stock, starts_at=starts_at, ends_at=ends_at, is_active=is_active)
    return {
        "id": d.id, "title": d.title, "description": d.description, "stock": d.stock,
        "starts_at": d.starts_at, "ends_at": d.ends_at, "is_active": d.is_active,
    }

def update_drop_dto(db: Session, drop_id: int, *, title: str|None=None, description: str|None=None, stock: int|None=None, starts_at: datetime|None=None, ends_at: datetime|None=None, is_active: bool|None=None):
    if starts_at is not None and ends_at is not None:
        _validate_window(starts_at, ends_at)
    d = update_drop(db, drop_id, title=title, description=description, stock=stock, starts_at=starts_at, ends_at=ends_at, is_active=is_active)
    if not d:
        raise ValueError("Drop not found")
    return {
        "id": d.id, "title": d.title, "description": d.description, "stock": d.stock,
        "starts_at": d.starts_at, "ends_at": d.ends_at, "is_active": d.is_active,
    }

def delete_drop_dto(db: Session, drop_id: int):
    ok = delete_drop(db, drop_id)
    if not ok:
        raise ValueError("Drop not found")


