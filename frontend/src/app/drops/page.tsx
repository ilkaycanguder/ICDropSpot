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
  const [page, setPage] = useState(1);
  const pageSize = 12;

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
          <div className='card card--drop'>
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
            {drops
              .slice((page - 1) * pageSize, page * pageSize)
              .map((d) => (
              <div key={d.id} className='card card--drop'>
                <div className='drop-card__meta'>
                  <div>
                    <div className='drop-card__title'>{d.title}</div>
                    <div className='drop-card__muted' style={{ marginTop: 4 }}>
                      {d.description || "Açıklama yok"}
                    </div>
                  </div>
                  <span className='glow-badge'>Stok {d.stock}</span>
                </div>
                <div className='spacer' />
                <div className='row'>
                  <button
                    className='btn ghost'
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

        {/* Pagination */}
        {drops.length > pageSize && (
          <>
            <div className='spacer' />
            <div className='pagination'>
              <button
                className='page-btn'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label='Önceki'
              >
                ◀
              </button>
              {Array.from({ length: Math.ceil(drops.length / pageSize) }, (_, i) => i + 1).map(
                (n) => (
                  <button
                    key={n}
                    className={`page-btn ${n === page ? "active" : ""}`}
                    onClick={() => setPage(n)}
                    aria-current={n === page ? "page" : undefined}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                className='page-btn'
                onClick={() =>
                  setPage((p) => Math.min(Math.ceil(drops.length / pageSize), p + 1))
                }
                disabled={page === Math.ceil(drops.length / pageSize)}
                aria-label='Sonraki'
              >
                ▶
              </button>
            </div>
          </>
        )}
      </div>
      {selectedDrop && (
        <DropModal drop={selectedDrop} onClose={() => setSelectedDrop(null)} />
      )}
    </>
  );
}
