"use client";
import { useState } from "react";
import { apiPost } from "@/lib/api";

export default function ClaimPage({ params }: { params: { id: string } }) {
  const dropId = Number(params.id);
  const [userId, setUserId] = useState(1);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function join() {
    setError(""); setResult("");
    try {
      await apiPost(`/api/v1/drops/${dropId}/join`, { user_id: userId });
      setResult("Waitlist joined.");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function claim() {
    setError(""); setResult("");
    try {
      const c = await apiPost<{ code: string }>(`/api/v1/drops/${dropId}/claim`, { user_id: userId });
      setResult(`Claim code: ${c.code}`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h1>Claim</h1>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>User ID:</label>
        <input type="number" value={userId} onChange={(e) => setUserId(Number(e.target.value))} />
        <button onClick={join}>Join Waitlist</button>
        <button onClick={claim}>Claim</button>
      </div>
      {result && <p style={{ color: "green" }}>{result}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}


