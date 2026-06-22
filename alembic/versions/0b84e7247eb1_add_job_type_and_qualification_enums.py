"""add job type and qualification enums

Revision ID: 0b84e7247eb1
Revises: 14446a40402c
Create Date: 2026-06-22 12:10:06.438957

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0b84e7247eb1'
down_revision: Union[str, Sequence[str], None] = '14446a40402c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute('TRUNCATE jobs CASCADE')

    jobtype = sa.Enum('junior', 'medior', 'senior', 'internship', 'lead', 'manager', name='jobtype')
    jobtype.create(op.get_bind())
    jobqualification = sa.Enum('not_required', 'BSc', 'MSc', 'PhD', name='jobqualification')
    jobqualification.create(op.get_bind())

    op.execute('ALTER TABLE jobs ALTER COLUMN type TYPE jobtype USING type::jobtype')
    op.execute('ALTER TABLE jobs ALTER COLUMN qualification TYPE jobqualification USING qualification::jobqualification')


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('jobs', 'qualification',
               existing_type=sa.Enum('not_required', 'BSc', 'MSc', 'PhD', name='jobqualification'),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    op.alter_column('jobs', 'type',
               existing_type=sa.Enum('junior', 'medior', 'senior', 'internship', 'lead', 'manager', name='jobtype'),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    op.execute('DROP TYPE jobtype')
    op.execute('DROP TYPE jobqualification')
