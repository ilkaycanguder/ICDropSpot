from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole

def list_users(db: Session):
    return db.execute(select(User)).scalars().all()

def get_by_email(db: Session, email: str):
    return db.scalar(select(User).where(User.email == email))

def create_user(db: Session, email: str, full_name: str|None, is_active: bool=True):
    u = User(email=email, full_name=full_name, is_active=is_active)
    db.add(u)
    db.flush()  # User'ı DB'ye kaydet ama henüz commit etme
    
    # Varsayılan "user" rolünü ata
    user_role = db.scalar(select(Role).where(Role.name == "user"))
    if user_role:
        user_role_link = UserRole(user_id=u.id, role_id=user_role.id)
        db.add(user_role_link)
    
    db.commit()
    db.refresh(u)
    return u
