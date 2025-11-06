from sqlalchemy.orm import Session
from app.repos.claim_repo import create_claim_if_available, get_claim
from app.repos.drop_repo import get_drop_by_id
from app.repos.user_repo import get_user_by_id
from app.repos.waitlist_repo import get_waitlist_entry

def claim_drop_dto(db: Session, user_id: int, drop_id: int):
    # Varlık kontrolleri
    if not get_user_by_id(db, user_id):
        raise ValueError("User not found")
    if not get_drop_by_id(db, drop_id):
        raise ValueError("Drop not found")
    # İsteğe bağlı: Waitlist'te mi?
    if not get_waitlist_entry(db, user_id, drop_id):
        raise ValueError("User not in waitlist")

    claim = create_claim_if_available(db, user_id, drop_id)
    return {
        "id": claim.id,
        "user_id": claim.user_id,
        "drop_id": claim.drop_id,
        "code": claim.code,
        "claimed_at": claim.claimed_at,
    }



