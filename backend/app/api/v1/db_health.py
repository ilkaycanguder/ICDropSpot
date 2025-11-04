from fastapi import APIRouter
from app.core.db import db_health_check
router = APIRouter()

@router.get("/db-health")
def db_health():
    return {"db": "ok" if db_health_check() else "down"}
