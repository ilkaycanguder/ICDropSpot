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
      <h1>Drops</h1>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {drops.map((d) => (
          <li key={d.id} style={{ padding: 12, border: "1px solid #eee", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{d.title}</div>
                <div style={{ color: "#666" }}>{d.description}</div>
                <div style={{ fontSize: 12, color: "#999" }}>Stock: {d.stock}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href={`/drops/${d.id}`}>Detay</Link>
                <Link href={`/claim/${d.id}`}>Claim</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


