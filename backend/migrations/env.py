import os
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from alembic import context
from app.models.base import Base

import app.models.user
import app.models.role
import app.models.user_role
import app.models.drop

ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
print("RESOLVED ENV_PATH:", ENV_PATH, "exists:", os.path.exists(ENV_PATH))
if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)

config = context.config
target_metadata = Base.metadata

def run_migrations_offline():
    url = os.getenv("DATABASE_URL")
    context.configure(url=url, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

print("ALEMBIC DATABASE_URL?", ("*"*8) if os.getenv("DATABASE_URL") else "EMPTY")

def run_migrations_online():
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = os.getenv("DATABASE_URL")
    connectable = engine_from_config(configuration, prefix="sqlalchemy.", poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
