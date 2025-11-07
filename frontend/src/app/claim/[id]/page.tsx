"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
  addToWaitlist,
  removeFromWaitlist,
  isWaitlisted,
} from "@/lib/waitlist";

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
    setJoined(isWaitlisted(u.id, dropId));
  }, [router, dropId]);

  async function toggleWaitlist() {
    setError("");
    setResult("");
    try {
      if (!userId) return;
      if (!joined) {
        await apiPost(`/api/v1/drops/${dropId}/join`, { user_id: userId });
        addToWaitlist(userId, dropId);
        setJoined(true);
        setResult("Waitlist'e katıldınız. Claim hakkı açıldı.");
      } else {
        await apiPost(`/api/v1/drops/${dropId}/leave`, { user_id: userId });
        removeFromWaitlist(userId, dropId);
        setJoined(false);
        setResult("Waitlist'ten ayrıldınız. Claim hakkı kapandı.");
      }
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function claim() {
    setError("");
    setResult("");
    try {
      if (!userId) return;
      if (!joined) {
        setError("Claim için önce waitlist'e katılmalısınız.");
        return;
      }
      const c = await apiPost<{ code: string }>(
        `/api/v1/drops/${dropId}/claim`,
        { user_id: userId }
      );
      setResult(`Claim code: ${c.code}`);
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes(" 404")) {
        setError("Claim hakkı bulunamadı. Lütfen önce waitlist'e katılın.");
        if (userId) removeFromWaitlist(userId, dropId);
        setJoined(false);
      } else {
        setError(msg);
      }
    }
  }

  return (
    <div>
      <h1>Claim</h1>
      <div className='row'>
        <button
          className='btn'
          onClick={toggleWaitlist}
          disabled={userId == null}
        >
          {joined ? "Waitlist'ten Ayrıl" : "Waitlist'e Katıl"}
        </button>
        <button
          className='btn ghost'
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
