"""init

Revision ID: 41d5bbe9a10e
Revises: 3cfe63dc951d
Create Date: 2025-11-04 16:18:15.348854

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '41d5bbe9a10e'
down_revision: Union[str, Sequence[str], None] = '3cfe63dc951d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
