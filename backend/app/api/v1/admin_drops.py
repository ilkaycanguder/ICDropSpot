from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.schemas.admin_drop import AdminDropCreate, AdminDropUpdate, AdminDropOut
from app.services.admin_drop_service import create_drop_dto, update_drop_dto, delete_drop_dto

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/admin/drops", response_model=AdminDropOut, status_code=status.HTTP_201_CREATED)
def admin_create_drop(payload: AdminDropCreate, db: Session = Depends(get_db)):
    try:
        return create_drop_dto(db, **payload.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/admin/drops/{drop_id}", response_model=AdminDropOut)
def admin_update_drop(drop_id: int, payload: AdminDropUpdate, db: Session = Depends(get_db)):
    try:
        return update_drop_dto(db, drop_id, **{k:v for k,v in payload.model_dump().items() if v is not None})
    except ValueError as e:
        msg = str(e)
        raise HTTPException(status_code=404 if msg == "Drop not found" else 400, detail=msg)

@router.delete("/admin/drops/{drop_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_drop(drop_id: int, db: Session = Depends(get_db)):
    try:
        delete_drop_dto(db, drop_id)
        return
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


