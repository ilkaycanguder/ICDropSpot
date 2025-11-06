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

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/auth"); return; }
    setUserId(u.id);
  }, [router]);

  async function join() {
    setError(""); setResult("");
    try {
      if (!userId) return;
      await apiPost(`/api/v1/drops/${dropId}/join`, { user_id: userId });
      setResult("Waitlist joined.");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function claim() {
    setError(""); setResult("");
    try {
      if (!userId) return;
      const c = await apiPost<{ code: string }>(`/api/v1/drops/${dropId}/claim`, { user_id: userId });
      setResult(`Claim code: ${c.code}`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h1>Claim</h1>
      <div className="row">
        <button className="btn secondary" onClick={join} disabled={userId==null}>Waitlist Join</button>
        <button className="btn" onClick={claim} disabled={userId==null}>Claim</button>
      </div>
      {result && <p style={{ color: "green" }}>{result}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}

"use client";
<<<<<<< HEAD
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

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/auth"); return; }
    setUserId(u.id);
  }, [router]);

  async function join() {
    setError(""); setResult("");
    try {
      if (!userId) return;
=======
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
>>>>>>> origin/main
      await apiPost(`/api/v1/drops/${dropId}/join`, { user_id: userId });
      setResult("Waitlist joined.");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function claim() {
    setError(""); setResult("");
    try {
<<<<<<< HEAD
      if (!userId) return;
=======
>>>>>>> origin/main
      const c = await apiPost<{ code: string }>(`/api/v1/drops/${dropId}/claim`, { user_id: userId });
      setResult(`Claim code: ${c.code}`);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h1>Claim</h1>
<<<<<<< HEAD
      <div className="row">
        <button className="btn secondary" onClick={join} disabled={userId==null}>Waitlist Join</button>
        <button className="btn" onClick={claim} disabled={userId==null}>Claim</button>
=======
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>User ID:</label>
        <input type="number" value={userId} onChange={(e) => setUserId(Number(e.target.value))} />
        <button onClick={join}>Join Waitlist</button>
        <button onClick={claim}>Claim</button>
>>>>>>> origin/main
      </div>
      {result && <p style={{ color: "green" }}>{result}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}


