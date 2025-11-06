from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.schemas.drop import DropOut
from app.services.drop_service import list_active_drops_dto

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/drops", response_model=list[DropOut])
def list_drops(db: Session = Depends(get_db)):
    return list_active_drops_dto(db)


