from sqlalchemy.orm import Session
from app.repos.user_repo import list_users, create_user, get_by_email

def list_users_dto(db: Session):
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "is_active": u.is_active,
            "roles": [r.name for r in (u.roles or [])],
        } for u in list_users(db)
    ]

def create_user_dto(db: Session, email: str, full_name: str|None, is_active: bool):
    if get_by_email(db, email):  # basit uniqueness
        raise ValueError("email already exists")
    u = create_user(db, email, full_name, is_active)
    # Rolleri yeniden yükle (lazy loading için)
    db.refresh(u, ["roles"])
    return {
        "id": u.id, "email": u.email, "full_name": u.full_name,
        "is_active": u.is_active, "roles": [r.name for r in (u.roles or [])]
    }
