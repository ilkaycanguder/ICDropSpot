from sqlalchemy.orm import Session
from app.repos.waitlist_repo import create_waitlist_entry, get_waitlist_entry, delete_waitlist_entry
from app.repos.drop_repo import get_drop_by_id
from app.repos.user_repo import get_user_by_id

def join_waitlist_dto(db: Session, user_id: int, drop_id: int):
    # Drop var mı kontrol et
    drop = get_drop_by_id(db, drop_id)
    if not drop:
        raise ValueError("Drop not found")
    
    # User var mı kontrol et
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    
    # Idempotent: join işlemi
    entry = create_waitlist_entry(db, user_id, drop_id)
    return {
        "id": entry.id,
        "user_id": entry.user_id,
        "drop_id": entry.drop_id,
        "joined_at": entry.joined_at,
    }

def leave_waitlist_dto(db: Session, user_id: int, drop_id: int):
    drop = get_drop_by_id(db, drop_id)
    if not drop:
        raise ValueError("Drop not found")
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    # Idempotent: kayıt yoksa None döner, biz 204 NO CONTENT döndüreceğiz
    entry = delete_waitlist_entry(db, user_id, drop_id)
    return entry

