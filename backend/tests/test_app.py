from datetime import timedelta
from time import sleep
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.main import app
from app.core.db import engine

client = TestClient(app)


def _insert_active_drop(title: str = "Test Drop", stock: int = 2) -> int:
    # aktif pencere: now()-5m .. now()+1h
    with engine.begin() as conn:
        res = conn.execute(text(
            """
            insert into drops (title, description, stock, starts_at, ends_at, is_active)
            values (:t, :d, :s, now() - interval '5 minutes', now() + interval '60 minutes', true)
            returning id
            """
        ), {"t": title, "d": None, "s": stock})
        return res.scalar_one()


def _cleanup_drop(drop_id: int):
    with engine.begin() as conn:
        conn.execute(text("delete from claims where drop_id=:i"), {"i": drop_id})
        conn.execute(text("delete from waitlists where drop_id=:i"), {"i": drop_id})
        conn.execute(text("delete from drops where id=:i"), {"i": drop_id})


def test_signup_idempotent():
    payload = {"email": "testuser@example.com", "full_name": "Test U"}
    r1 = client.post("/api/v1/auth/signup", json=payload)
    assert r1.status_code in (200, 201)
    r2 = client.post("/api/v1/auth/signup", json=payload)
    assert r2.status_code in (200, 201)
    assert r1.json()["email"] == r2.json()["email"]


def test_drops_join_leave_claim_idempotent_and_conflicts():
    # prepare user
    u = client.post("/api/v1/auth/signup", json={"email": "flow@example.com", "full_name": "Flow"}).json()
    user_id = u["id"]

    # prepare drop
    drop_id = _insert_active_drop(stock=1)
    try:
        # GET /drops should list it
        r = client.get("/api/v1/drops")
        assert r.status_code == 200
        assert any(d["id"] == drop_id for d in r.json())

        # join waitlist (idempotent)
        r1 = client.post(f"/api/v1/drops/{drop_id}/join", json={"user_id": user_id})
        assert r1.status_code == 201
        r2 = client.post(f"/api/v1/drops/{drop_id}/join", json={"user_id": user_id})
        assert r2.status_code == 201
        assert r1.json()["id"] == r2.json()["id"]

        # claim (stock=1): first ok, second same user idempotent -> same code
        c1 = client.post(f"/api/v1/drops/{drop_id}/claim", json={"user_id": user_id})
        assert c1.status_code == 201
        c2 = client.post(f"/api/v1/drops/{drop_id}/claim", json={"user_id": user_id})
        assert c2.status_code == 201
        assert c1.json()["code"] == c2.json()["code"]

        # another user can't claim (out of stock)
        u2 = client.post("/api/v1/auth/signup", json={"email": "flow2@example.com", "full_name": "Flow 2"}).json()
        # join waitlist for second user
        client.post(f"/api/v1/drops/{drop_id}/join", json={"user_id": u2["id"]})
        c_other = client.post(f"/api/v1/drops/{drop_id}/claim", json={"user_id": u2["id"]})
        assert c_other.status_code == 409

        # leave is idempotent (returns 204 both times)
        l1 = client.post(f"/api/v1/drops/{drop_id}/leave", json={"user_id": user_id})
        assert l1.status_code == 204
        l2 = client.post(f"/api/v1/drops/{drop_id}/leave", json={"user_id": user_id})
        assert l2.status_code == 204
    finally:
        _cleanup_drop(drop_id)


