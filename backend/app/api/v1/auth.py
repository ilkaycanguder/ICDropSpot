from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.schemas.user import UserOut, UserCreate
from app.services.auth_service import signup_or_get_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/auth/signup", response_model=UserOut)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    return signup_or_get_user(db, payload.email, payload.full_name, payload.is_active)


