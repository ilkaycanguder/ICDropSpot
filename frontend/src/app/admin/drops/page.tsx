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
    document.title = "Admin - Drops | ICDropSpot";
    const u = getUser();
    if (!u || !isAdmin(u)) {
      router.push("/drops");
      return;
    }
    load();
  }, [router]);

  async function load() {
    try {
      setDrops(await apiGet<Drop[]>("/api/v1/admin/drops"));
    } catch (e: any) {
      setMsg("Drops yüklenemedi: " + e.message);
    }
  }

  function formatDateTimeForInput(iso: string): string {
    if (!iso) return "";
    return iso.slice(0, 16);
  }

  function formatDateTime(iso: string): string {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      setMsg("✅ Drop başarıyla oluşturuldu!");
      await load();
    } catch (e: any) {
      setMsg("❌ Hata: " + e.message);
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
      setMsg("✅ Drop başarıyla güncellendi!");
      await load();
    } catch (e: any) {
      setMsg("❌ Hata: " + e.message);
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
      setMsg("✅ Drop başarıyla silindi!");
      await load();
    } catch (e: any) {
      setMsg("❌ Hata: " + e.message);
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

  const stats = {
    total: drops.length,
    active: drops.filter((d) => d.is_active).length,
    totalStock: drops.reduce((sum, d) => sum + d.stock, 0),
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 0 }}>
          Admin Panel - Drops Yönetimi
        </h1>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {editId ? `Düzenleniyor: #${editId}` : "Yeni Drop Oluştur"}
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          className='card'
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))",
            borderColor: "rgba(59, 130, 246, 0.3)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Toplam Drop
          </div>
          <div
            style={{ fontSize: 32, fontWeight: 700, color: "var(--primary)" }}
          >
            {stats.total}
          </div>
        </div>
        <div
          className='card'
          style={{
            background:
              "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))",
            borderColor: "rgba(34, 197, 94, 0.3)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Aktif Drop
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#22c55e" }}>
            {stats.active}
          </div>
        </div>
        <div
          className='card'
          style={{
            background:
              "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05))",
            borderColor: "rgba(168, 85, 247, 0.3)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Toplam Stok
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#a855f7" }}>
            {stats.totalStock}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className='card' style={{ marginBottom: 32 }}>
        <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 18 }}>
          {editId ? `Drop Düzenle #${editId}` : "Yeni Drop Oluştur"}
        </h2>
        <div style={{ display: "grid", gap: 16, maxWidth: 700 }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Başlık *
            </label>
            <input
              className='input'
              placeholder='Drop başlığı'
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Açıklama
            </label>
            <textarea
              className='input'
              placeholder='Drop açıklaması'
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              style={{ resize: "vertical", width: "100%" }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 120px",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  color: "var(--text-muted)",
                }}
              >
                Stok *
              </label>
              <input
                className='input'
                type='number'
                placeholder='Stok miktarı'
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                min='1'
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  color: "var(--text-muted)",
                }}
              >
                Başlangıç Tarihi
              </label>
              <input
                className='input'
                type='datetime-local'
                value={form.starts_at}
                onChange={(e) =>
                  setForm({ ...form, starts_at: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "10px 12px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  cursor: "pointer",
                  width: "100%",
                  height: "fit-content",
                }}
              >
                <input
                  type='checkbox'
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: 13 }}>Aktif</span>
              </label>
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Bitiş Tarihi
            </label>
            <input
              className='input'
              type='datetime-local'
              value={form.ends_at}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {!editId ? (
              <button
                className='btn'
                onClick={createDrop}
                disabled={loading || !form.title}
                style={{ minWidth: 120 }}
              >
                {loading ? "Oluşturuluyor..." : "Oluştur"}
              </button>
            ) : (
              <>
                <button
                  className='btn'
                  onClick={updateDrop}
                  disabled={loading || !form.title}
                  style={{ minWidth: 120 }}
                >
                  {loading ? "Güncelleniyor..." : "Güncelle"}
                </button>
                <button
                  className='btn secondary'
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
                  msg.includes("❌") || msg.includes("yüklenemedi")
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(34, 197, 94, 0.1)",
                color:
                  msg.includes("❌") || msg.includes("yüklenemedi")
                    ? "var(--danger)"
                    : "#22c55e",
                border: `1px solid ${
                  msg.includes("❌") || msg.includes("yüklenemedi")
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(34, 197, 94, 0.3)"
                }`,
              }}
            >
              {msg}
            </div>
          )}
        </div>
      </div>

      {/* Tablo Görünümü */}
      <div>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Mevcut Drops</h2>
        {drops.length === 0 ? (
          <div className='card' style={{ textAlign: "center", padding: 48 }}>
            <p className='muted' style={{ fontSize: 16, margin: 0 }}>
              Henüz drop yok. Yukarıdan yeni bir drop oluşturun.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    Başlık
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    Açıklama
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    Stok
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    Başlangıç
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    Bitiş
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    Durum
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {drops.map((d, idx) => (
                  <tr
                    key={d.id}
                    style={{
                      borderBottom:
                        idx < drops.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--muted)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "var(--text-muted)",
                      }}
                    >
                      #{d.id}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                      {d.title}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "var(--text-muted)",
                        maxWidth: 300,
                      }}
                    >
                      {d.description || "-"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      {d.stock}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      {formatDateTime(d.starts_at)}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      {formatDateTime(d.ends_at)}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 12,
                          background: d.is_active
                            ? "rgba(34, 197, 94, 0.15)"
                            : "rgba(107, 114, 128, 0.15)",
                          color: d.is_active ? "#22c55e" : "var(--text-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {d.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className='btn secondary'
                          onClick={() => startEdit(d)}
                          disabled={loading}
                          style={{ fontSize: 12, padding: "6px 12px" }}
                        >
                          Düzenle
                        </button>
                        <button
                          className='btn danger'
                          onClick={() => deleteDrop(d.id)}
                          disabled={loading}
                          style={{ fontSize: 12, padding: "6px 12px" }}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
