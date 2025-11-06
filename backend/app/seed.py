from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.db import engine
from app.models.role import Role
from app.models.user import User
from app.models.user_role import UserRole

def run():
    with Session(engine, future=True) as s:
        # "user" rolünü oluştur (varsayılan rol)
        user_role = s.scalar(select(Role).where(Role.name == "user"))
        if not user_role:
            user_role = Role(name="user")
            s.add(user_role)
            s.commit()
            s.refresh(user_role)
        
        # "admin" rolünü oluştur
        admin = s.scalar(select(Role).where(Role.name == "admin"))
        if not admin:
            admin = Role(name="admin")
            s.add(admin)
            s.commit()
            s.refresh(admin)

        # Admin kullanıcısını oluştur (geçerli domain ile)
        u = s.scalar(select(User).where(User.email == "admin@example.com"))
        if not u:
            u = User(email="admin@example.com", full_name="Admin", is_active=True)
            s.add(u)
            s.commit()
            s.refresh(u)

        # Admin kullanıcısına admin rolünü ata
        link = s.scalar(select(UserRole).where(
            UserRole.user_id == u.id, UserRole.role_id == admin.id))
        if not link:
            s.add(UserRole(user_id=u.id, role_id=admin.id))
            s.commit()

if __name__ == "__main__":
    run()
