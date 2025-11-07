from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.health import router as health_router

app = FastAPI(title="ICDropSpot API")
app.include_router(health_router, prefix="/api/v1")

# CORS (frontend: http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.db_health import router as db_router
app.include_router(db_router, prefix="/api/v1")

from app.api.v1.auth import router as auth_router
app.include_router(auth_router, prefix="/api/v1")

from app.api.v1.admin_drops import router as admin_drops_router
app.include_router(admin_drops_router, prefix="/api/v1")

from app.api.v1.drops import router as drops_router
app.include_router(drops_router, prefix="/api/v1")

from app.api.v1.users import router as users_router
app.include_router(users_router, prefix="/api/v1")