import { apiGet } from "@/lib/api";

type Drop = {
  id: number; title: string; description?: string | null; stock: number; starts_at: string; ends_at: string;
};

async function getDropById(id: number): Promise<Drop | null> {
  const drops = await apiGet<Drop[]>("/api/v1/drops");
  return drops.find((d) => d.id === id) ?? null;
}

export default async function DropDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const drop = await getDropById(id);
  if (!drop) {
    return <div>Drop bulunamadı.</div>;
  }
  return (
    <div>
      <h1>{drop.title}</h1>
      <p>{drop.description}</p>
      <p>Stock: {drop.stock}</p>
      <p>
        Pencere: {new Date(drop.starts_at).toLocaleString()} - {new Date(drop.ends_at).toLocaleString()}
      </p>
    </div>
  );
}



