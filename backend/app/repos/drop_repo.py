from sqlalchemy.orm import Session
from sqlalchemy import select, update, delete, insert
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

def list_all_drops(db: Session):
    """List all drops (for admin panel)"""
    stmt = select(Drop).order_by(Drop.id.desc())
    return db.execute(stmt).scalars().all()

def get_drop_by_id(db: Session, drop_id: int):
    return db.scalar(select(Drop).where(Drop.id == drop_id))

def create_drop(db: Session, *, title: str, description: str|None, stock: int, starts_at, ends_at, is_active: bool=True):
    drop = Drop(title=title, description=description, stock=stock, starts_at=starts_at, ends_at=ends_at, is_active=is_active)
    db.add(drop)
    db.commit()
    db.refresh(drop)
    return drop

def update_drop(db: Session, drop_id: int, *, title: str|None=None, description: str|None=None, stock: int|None=None, starts_at=None, ends_at=None, is_active: bool|None=None):
    drop = get_drop_by_id(db, drop_id)
    if not drop:
        return None
    if title is not None: drop.title = title
    if description is not None: drop.description = description
    if stock is not None: drop.stock = stock
    if starts_at is not None: drop.starts_at = starts_at
    if ends_at is not None: drop.ends_at = ends_at
    if is_active is not None: drop.is_active = is_active
    db.commit()
    db.refresh(drop)
    return drop

def delete_drop(db: Session, drop_id: int):
    drop = get_drop_by_id(db, drop_id)
    if not drop:
        return False
    db.delete(drop)
    db.commit()
    return True

