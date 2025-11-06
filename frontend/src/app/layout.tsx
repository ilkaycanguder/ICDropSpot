"use client";
import "./globals.css";
import { ReactNode, useEffect, useState } from "react";
import { getUser, clearUser } from "@/lib/auth";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id:number; email:string } | null>(null);
  useEffect(() => { setUser(getUser()); }, []);

  function logout() { clearUser(); setUser(null); window.location.href = "/auth"; }

  return (
    <html lang="tr">
      <body>
        <header style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
          <div className="container" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <nav className="nav">
              <a href="/drops">Drops</a>
              <a href="/admin/drops">Admin</a>
            </nav>
            <div className="nav">
              {user ? (
                <>
                  <span className="muted">{user.email}</span>
                  <button className="btn secondary" onClick={logout}>Çıkış</button>
                </>
              ) : (
                <a className="btn secondary" href="/auth">Giriş / Kayıt</a>
              )}
            </div>
          </div>
        </header>
        <main>
          <div className="container">{children}</div>
        </main>
      </body>
    </html>
  );
}


