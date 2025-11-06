import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from sqlalchemy.sql import func
from app.models.claim import Claim
from app.models.drop import Drop

def get_claim(db: Session, user_id: int, drop_id: int):
    return db.scalar(select(Claim).where(Claim.user_id == user_id, Claim.drop_id == drop_id))

def create_claim_if_available(db: Session, user_id: int, drop_id: int):
    # Idempotent: varsa mevcut claim'i döndür
    existing = get_claim(db, user_id, drop_id)
    if existing:
        return existing

    # Pencere ve stok için drop'u kilitle
    drop_row = db.execute(
        select(Drop).where(Drop.id == drop_id).with_for_update()
    ).scalar_one_or_none()
    if not drop_row:
        raise ValueError("Drop not found")

    now = db.scalar(select(func.now()))
    if not (drop_row.is_active and drop_row.starts_at <= now <= drop_row.ends_at):
        raise ValueError("Claim window closed")

    if drop_row.stock <= 0:
        raise ValueError("Out of stock")

    # Stok düş ve claim oluştur
    db.execute(
        update(Drop)
        .where(Drop.id == drop_id, Drop.stock > 0)
        .values(stock=Drop.stock - 1)
    )

    claim = Claim(user_id=user_id, drop_id=drop_id, code=uuid.uuid4().hex[:12])
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim


