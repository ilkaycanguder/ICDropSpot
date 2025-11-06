from sqlalchemy.orm import Session
from app.repos.user_repo import get_by_email, create_user

def signup_or_get_user(db: Session, email: str, full_name: str|None, is_active: bool=True):
    existing = get_by_email(db, email)
    if existing:
        # Idempotent davranış: var ise onu döndür
        return {
            "id": existing.id,
            "email": existing.email,
            "full_name": existing.full_name,
            "is_active": existing.is_active,
            "roles": [r.name for r in (existing.roles or [])],
        }
    u = create_user(db, email, full_name, is_active)
    return {
        "id": u.id,
        "email": u.email,
        "full_name": u.full_name,
        "is_active": u.is_active,
        "roles": [r.name for r in (u.roles or [])],
    }


