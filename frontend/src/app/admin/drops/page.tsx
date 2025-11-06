"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { getUser, isAdmin } from "@/lib/auth";

type Drop = {
  id: number;
  title: string;
  description?: string | null;
  stock: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

export default function AdminDropsPage() {
  const router = useRouter();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    stock: 10,
    starts_at: "",
    ends_at: "",
    is_active: true,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u || !isAdmin(u)) {
      router.push("/drops");
      return;
    }
    load();
  }, [router]);

  async function load() {
    try {
      setDrops(await apiGet<Drop[]>("/api/v1/drops"));
    } catch (e: any) {
      setMsg("Drops yüklenemedi: " + e.message);
    }
  }

  function formatDateTimeForInput(iso: string): string {
    if (!iso) return "";
    return iso.slice(0, 16);
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      stock: 10,
      starts_at: "",
      ends_at: "",
      is_active: true,
    });
    setEditId(null);
  }

  async function createDrop() {
    setMsg("");
    setLoading(true);
    try {
      await apiPost("/api/v1/admin/drops", form);
      resetForm();
      setMsg("Drop oluşturuldu!");
      await load();
    } catch (e: any) {
      setMsg("Hata: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateDrop() {
    if (!editId) return;
    setMsg("");
    setLoading(true);
    try {
      await apiPut(`/api/v1/admin/drops/${editId}`, form);
      resetForm();
      setMsg("Drop güncellendi!");
      await load();
    } catch (e: any) {
      setMsg("Hata: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDrop(id: number) {
    if (!confirm("Bu drop'u silmek istediğinize emin misiniz?")) return;
    setMsg("");
    setLoading(true);
    try {
      await apiDelete(`/api/v1/admin/drops/${id}`);
      setMsg("Drop silindi!");
      await load();
    } catch (e: any) {
      setMsg("Hata: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(d: Drop) {
    setEditId(d.id);
    setForm({
      title: d.title,
      description: d.description ?? "",
      stock: d.stock,
      starts_at: formatDateTimeForInput(d.starts_at),
      ends_at: formatDateTimeForInput(d.ends_at),
      is_active: d.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Admin - Drops Yönetimi</h1>
      <div className="spacer" />

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>
          {editId ? `Drop Güncelle #${editId}` : "Yeni Drop Oluştur"}
        </h2>
        <div style={{ display: "grid", gap: 12, maxWidth: 600 }}>
          <input
            className="input"
            placeholder="Başlık"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="input"
            placeholder="Açıklama"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ resize: "vertical" }}
          />
          <div className="row">
            <input
              className="input"
              type="number"
              placeholder="Stok"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
              style={{ flex: 1 }}
            />
            <label
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                padding: "0 12px",
              }}
            >
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              <span className="muted">Aktif</span>
            </label>
          </div>
          <div className="row">
            <input
              className="input"
              type="datetime-local"
              placeholder="Başlangıç"
              value={form.starts_at}
              onChange={(e) =>
                setForm({ ...form, starts_at: e.target.value })
              }
              style={{ flex: 1 }}
            />
            <input
              className="input"
              type="datetime-local"
              placeholder="Bitiş"
              value={form.ends_at}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
              style={{ flex: 1 }}
            />
          </div>
          <div className="row">
            {!editId ? (
              <button
                className="btn"
                onClick={createDrop}
                disabled={loading || !form.title}
              >
                Oluştur
              </button>
            ) : (
              <>
                <button
                  className="btn"
                  onClick={updateDrop}
                  disabled={loading || !form.title}
                >
                  Güncelle
                </button>
                <button
                  className="btn secondary"
                  onClick={resetForm}
                  disabled={loading}
                >
                  İptal
                </button>
              </>
            )}
          </div>
          {msg && (
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background:
                  msg.includes("Hata") || msg.includes("yüklenemedi")
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(59, 130, 246, 0.1)",
                color: msg.includes("Hata") || msg.includes("yüklenemedi")
                  ? "var(--danger)"
                  : "var(--primary)",
              }}
            >
              {msg}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2>Mevcut Drops ({drops.length})</h2>
        <div className="spacer" />
        {drops.length === 0 ? (
          <div className="card">
            <p className="muted">Henüz drop yok. Yukarıdan yeni bir drop oluşturun.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {drops.map((d) => (
              <div key={d.id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      {d.title}
                    </div>
                    <div className="muted" style={{ marginBottom: 8 }}>
                      {d.description || "Açıklama yok"}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      Stok: {d.stock} |{" "}
                      {d.is_active ? (
                        <span style={{ color: "var(--primary)" }}>Aktif</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>
                          Pasif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <button
                    className="btn secondary"
                    onClick={() => startEdit(d)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => deleteDrop(d.id)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
