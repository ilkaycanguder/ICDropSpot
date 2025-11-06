"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { getUser, saveUser } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = getUser();
    if (u) router.push("/drops");
  }, [router]);

  async function signup() {
    setLoading(true); setMsg("");
    try {
      const u = await apiPost<{ id:number; email:string; full_name?:string }>("/api/v1/auth/signup", { email, full_name: name });
      saveUser(u); setMsg("Giriş başarılı, yönlendiriliyor...");
      setTimeout(() => router.push("/drops"), 500);
    } catch (e: any) {
      setMsg(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 480, margin: "40px auto" }}>
        <h1 style={{ marginTop: 0 }}>Giriş / Kayıt</h1>
        <p className="muted">E-posta ile hızlıca kayıt ol veya giriş yap.</p>
        <div className="spacer" />
        <div className="row">
          <input className="input" placeholder="E-posta" value={email} onChange={(e)=>setEmail(e.target.value)} style={{ flex:1 }} />
        </div>
        <div className="spacer" />
        <div className="row">
          <input className="input" placeholder="Ad Soyad (opsiyonel)" value={name} onChange={(e)=>setName(e.target.value)} style={{ flex:1 }} />
        </div>
        <div className="spacer" />
        <div className="row">
          <button className="btn" onClick={signup} disabled={loading || !email}>Devam</button>
        </div>
        {msg && (<div className="spacer" />) }
        {msg && (<div className="muted">{msg}</div>) }
      </div>
    </div>
  );
}


