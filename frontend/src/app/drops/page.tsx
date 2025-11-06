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

export default async function DropsPage() {
  const drops = await apiGet<Drop[]>("/api/v1/drops");
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Drops</h1>
      <div className="spacer" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {drops.map((d) => (
          <div key={d.id} className="card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{d.title}</div>
                <div className="muted">{d.description}</div>
              </div>
              <span className="muted">Stock {d.stock}</span>
            </div>
            <div className="spacer" />
            <div className="row">
              <Link className="btn secondary" href={`/drops/${d.id}`}>Detay</Link>
              <Link className="btn" href={`/claim/${d.id}`}>Claim</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


