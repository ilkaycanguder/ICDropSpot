from fastapi import FastAPI
from app.api.v1.health import router as health_router

app = FastAPI(title="ICDropSpot API")
app.include_router(health_router, prefix="/api/v1")

from app.api.v1.db_health import router as db_router
app.include_router(db_router, prefix="/api/v1")

from app.api.v1.auth import router as auth_router
app.include_router(auth_router, prefix="/api/v1")

from app.api.v1.drops import router as drops_router
app.include_router(drops_router, prefix="/api/v1")

from app.api.v1.users import router as users_router
app.include_router(users_router, prefix="/api/v1")