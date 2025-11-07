"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function ClaimPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dropId = Number(params.id);
  const [userId, setUserId] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    document.title = "Claim | ICDropSpot";
    const u = getUser();
    if (!u) {
      router.push("/auth");
      return;
    }
    setUserId(u.id);
  }, [router]);

  async function join() {
    setError("");
    setResult("");
    try {
      if (!userId) return;
      await apiPost(`/api/v1/drops/${dropId}/join`, { user_id: userId });
      setJoined(true);
      setResult("Waitlist'e katıldınız. Claim hakkı açıldı.");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function claim() {
    setError("");
    setResult("");
    try {
      if (!userId) return;
      const c = await apiPost<{ code: string }>(
        `/api/v1/drops/${dropId}/claim`,
        { user_id: userId }
      );
      setResult(`Claim code: ${c.code}`);
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes(" 404")) {
        setError("Claim hakkı bulunamadı. Lütfen önce waitlist'e katılın.");
        setJoined(false);
      } else {
        setError(msg);
      }
    }
  }

  async function leave() {
    setError("");
    setResult("");
    try {
      if (!userId) return;
      await apiPost(`/api/v1/drops/${dropId}/leave`, { user_id: userId });
      setJoined(false);
      setResult("Waitlist'ten ayrıldınız. Claim hakkı kapandı.");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h1>Claim</h1>
      <div className='row'>
        <button
          className='btn secondary'
          onClick={join}
          disabled={userId == null || joined}
        >
          Waitlist'e Katıl
        </button>
        <button
          className='btn secondary'
          onClick={leave}
          disabled={userId == null || !joined}
        >
          Waitlist'ten Ayrıl
        </button>
        <button
          className='btn'
          onClick={claim}
          disabled={userId == null || !joined}
        >
          Claim
        </button>
      </div>
      {result && <p style={{ color: "green" }}>{result}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
