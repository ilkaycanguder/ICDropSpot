from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.schemas.user import UserCreate, UserOut
from app.services.user_service import list_users_dto, create_user_dto

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return list_users_dto(db)

@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        return create_user_dto(db, payload.email, payload.full_name, payload.is_active)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
