from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, UniqueConstraint, String, DateTime, func
from app.models.base import Base

class Claim(Base):
    __tablename__ = "claims"
    __table_args__ = (
        UniqueConstraint("user_id", "drop_id", name="uq_claims_user_drop"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    drop_id: Mapped[int] = mapped_column(ForeignKey("drops.id", ondelete="CASCADE"), nullable=False)
    code: Mapped[str] = mapped_column(String(32), nullable=False)
    claimed_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)



