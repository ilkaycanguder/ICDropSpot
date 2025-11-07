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
  const [msgType, setMsgType] = useState<"error" | "success" | "">("");

  useEffect(() => {
    document.title = "Giriş / Kayıt | ICDropSpot";
    const u = getUser();
    if (u) router.push("/drops");
  }, [router]);

  function isValidEmail(v: string): boolean {
    // Basit email doğrulama (HTML input type=email ile birlikte)
    return /.+@.+\..+/.test(v);
  }

  async function signup() {
    setLoading(true);
    setMsg("");
    setMsgType("");
    try {
      if (!isValidEmail(email)) {
        setMsg("Lütfen geçerli bir e-posta giriniz.");
        setMsgType("error");
        return;
      }
      const u = await apiPost<{
        id: number;
        email: string;
        full_name?: string;
        roles?: string[];
      }>("/api/v1/auth/signup", { email, full_name: name });
      saveUser(u);
      setMsg("Giriş başarılı, yönlendiriliyor...");
      setMsgType("success");
      setTimeout(() => router.push("/drops"), 500);
    } catch (e: any) {
      const m = String(e?.message || "");
      if (m.includes("/api/v1/auth/signup") && m.includes(" 422")) {
        setMsg("Lütfen geçerli bir e-posta giriniz.");
      } else {
        setMsg(m);
      }
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <div className='card card--drop auth-card' style={{ maxWidth: 520, margin: "48px auto", padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Giriş / Kayıt</h1>
        <p className='muted'>E-posta ile hızlıca kayıt ol veya giriş yap.</p>
        <div className='spacer' />
        <div className='row'>
          <input
            className='input'
            placeholder='E-posta'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        <div className='spacer' />
        <div className='row'>
          <input
            className='input'
            placeholder='Ad Soyad (opsiyonel)'
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        <div className='spacer' />
        <div className='row'>
          <button className='btn' onClick={signup} disabled={loading || !email}>
            Devam
          </button>
        </div>
        {msg && <div className='spacer' />}
        {msg && (
          <div className={`auth-msg ${msgType}`}>{msg}</div>
        )}
      </div>
    </div>
  );
}
