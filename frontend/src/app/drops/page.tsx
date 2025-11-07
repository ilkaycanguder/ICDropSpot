"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

type Drop = {
  id: number;
  title: string;
  description?: string | null;
  stock: number;
  starts_at: string;
  ends_at: string;
};

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

function DropModal({
  drop,
  onClose,
}: {
  drop: Drop | null;
  onClose: () => void;
}) {
  if (!drop) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose} aria-label='Kapat'>
          ×
        </button>
        <h1 style={{ marginTop: 0, marginBottom: 16 }}>{drop.title}</h1>
        {drop.description && (
          <p style={{ marginBottom: 16, lineHeight: 1.6 }}>
            {drop.description}
          </p>
        )}
        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 12,
              background: "var(--muted)",
              borderRadius: 8,
            }}
          >
            <span className='muted'>Stok:</span>
            <span style={{ fontWeight: 600 }}>{drop.stock}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 12,
              background: "var(--muted)",
              borderRadius: 8,
            }}
          >
            <span className='muted'>Başlangıç:</span>
            <span>{formatDateTime(drop.starts_at)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 12,
              background: "var(--muted)",
              borderRadius: 8,
            }}
          >
            <span className='muted'>Bitiş:</span>
            <span>{formatDateTime(drop.ends_at)}</span>
          </div>
        </div>
        <div className='row'>
          <Link className='btn' href={`/claim/${drop.id}`} style={{ flex: 1 }}>
            Claim
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DropsPage() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrop, setSelectedDrop] = useState<Drop | null>(null);

  useEffect(() => {
    document.title = "Drops | ICDropSpot";
    async function load() {
      try {
        const data = await apiGet<Drop[]>("/api/v1/drops");
        setDrops(data);
      } catch (e) {
        console.error("Failed to load drops:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>Drops</h1>
        <div className='spacer' />
        <p className='muted'>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 style={{ marginTop: 0 }}>Drops</h1>
        <div className='spacer' />
        {drops.length === 0 ? (
          <div className='card'>
            <p className='muted'>Henüz drop yok.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {drops.map((d) => (
              <div key={d.id} className='card'>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{d.title}</div>
                    <div className='muted' style={{ marginTop: 4 }}>
                      {d.description || "Açıklama yok"}
                    </div>
                  </div>
                  <span className='muted'>Stok {d.stock}</span>
                </div>
                <div className='spacer' />
                <div className='row'>
                  <button
                    className='btn secondary'
                    onClick={() => setSelectedDrop(d)}
                    style={{ flex: 1 }}
                  >
                    Detay
                  </button>
                  <Link
                    className='btn'
                    href={`/claim/${d.id}`}
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    Claim
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedDrop && (
        <DropModal drop={selectedDrop} onClose={() => setSelectedDrop(null)} />
      )}
    </>
  );
}
