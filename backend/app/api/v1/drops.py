from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.schemas.drop import DropOut
from app.schemas.waitlist import WaitlistJoinIn, WaitlistJoinOut
from app.services.drop_service import list_active_drops_dto
from app.services.waitlist_service import join_waitlist_dto

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

@router.post("/drops/{drop_id}/join", response_model=WaitlistJoinOut, status_code=status.HTTP_201_CREATED)
def join_waitlist(drop_id: int, payload: WaitlistJoinIn, db: Session = Depends(get_db)):
    try:
        return join_waitlist_dto(db, payload.user_id, drop_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


