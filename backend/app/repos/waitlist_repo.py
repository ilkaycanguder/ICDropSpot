from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from app.models.waitlist import Waitlist

def get_waitlist_entry(db: Session, user_id: int, drop_id: int):
    return db.scalar(
        select(Waitlist).where(
            Waitlist.user_id == user_id,
            Waitlist.drop_id == drop_id
        )
    )

def create_waitlist_entry(db: Session, user_id: int, drop_id: int):
    # Idempotent: eğer varsa hata vermeden mevcut kaydı döndür
    existing = get_waitlist_entry(db, user_id, drop_id)
    if existing:
        return existing
    
    entry = Waitlist(user_id=user_id, drop_id=drop_id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

def delete_waitlist_entry(db: Session, user_id: int, drop_id: int):
    existing = get_waitlist_entry(db, user_id, drop_id)
    if not existing:
        return None
    db.execute(
        delete(Waitlist).where(
            Waitlist.user_id == user_id,
            Waitlist.drop_id == drop_id
        )
    )
    db.commit()
    return existing

