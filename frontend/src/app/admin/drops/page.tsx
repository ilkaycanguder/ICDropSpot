"use client";
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type Drop = { id: number; title: string; description?: string|null; stock: number; starts_at: string; ends_at: string; is_active: boolean };

export default function AdminDropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [form, setForm] = useState({ title: "", description: "", stock: 10, starts_at: "", ends_at: "", is_active: true });
  const [editId, setEditId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string>("");

  async function load() {
    try { setDrops(await apiGet<Drop[]>("/api/v1/drops")); } catch {}
  }
  useEffect(() => { load(); }, []);

  async function createDrop() {
    setMsg("");
    try {
      await apiPost("/api/v1/admin/drops", form);
      setForm({ title: "", description: "", stock: 10, starts_at: "", ends_at: "", is_active: true });
      setMsg("Created");
      await load();
    } catch (e: any) { setMsg(e.message); }
  }

  async function updateDrop() {
    if (!editId) return;
    setMsg("");
    try {
      await apiPut(`/api/v1/admin/drops/${editId}`, form);
      setEditId(null); setMsg("Updated"); await load();
    } catch (e: any) { setMsg(e.message); }
  }

  async function deleteDrop(id: number) {
    setMsg("");
    try { await apiDelete(`/api/v1/admin/drops/${id}`); setMsg("Deleted"); await load(); } catch (e: any) { setMsg(e.message); }
  }

  return (
    <div>
      <h1>Admin - Drops</h1>
      <section style={{ marginBottom: 24 }}>
        <h2>{editId ? `Güncelle #${editId}` : "Yeni Drop"}</h2>
        <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
          <input placeholder="title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} />
          <input placeholder="description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} />
          <input type="number" placeholder="stock" value={form.stock} onChange={(e)=>setForm({...form, stock: Number(e.target.value)})} />
          <input type="datetime-local" placeholder="starts_at" value={form.starts_at} onChange={(e)=>setForm({...form, starts_at: e.target.value})} />
          <input type="datetime-local" placeholder="ends_at" value={form.ends_at} onChange={(e)=>setForm({...form, ends_at: e.target.value})} />
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form, is_active: e.target.checked})} /> active
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {!editId && <button onClick={createDrop}>Oluştur</button>}
            {editId && <button onClick={updateDrop}>Güncelle</button>}
          </div>
          {msg && <div>{msg}</div>}
        </div>
      </section>
      <section>
        <h2>Aktif Drops</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {drops.map(d => (
            <li key={d.id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.title}</div>
                  <div style={{ color: "#666" }}>{d.description}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setEditId(d.id); setForm({ title: d.title, description: d.description ?? "", stock: d.stock, starts_at: d.starts_at.slice(0,16), ends_at: d.ends_at.slice(0,16), is_active: d.is_active }); }}>Düzenle</button>
                  <button onClick={() => deleteDrop(d.id)}>Sil</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


