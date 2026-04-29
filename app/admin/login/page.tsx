"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      router.push("/admin/dashboard");
    } catch (err: any) {
      const message = err.message || "Login gagal";
      if (message.includes("Invalid login credentials")) {
        setError("Email atau password salah.");
      } else if (message.includes("URL is required") || message.includes("URL option")) {
        setError("Supabase belum dikonfigurasi. Silakan isi .env.local terlebih dahulu.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute -top-[20%] -left-[10%] w-1/2 h-[80%] bg-[radial-gradient(ellipse,rgba(26,54,54,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-1/2 h-[80%] bg-[radial-gradient(ellipse,rgba(115,92,0,0.07)_0%,transparent_70%)] pointer-events-none" />

      <div className="bg-surface-container-lowest rounded-xl p-12 w-full max-w-[420px] shadow-[0_32px_64px_rgba(27,28,26,0.08)] relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <a
            href="/"
            className="block font-display font-extrabold text-[1.2rem] text-primary mb-6"
          >
            Kelas<span className="text-secondary">Binet</span>
          </a>
          <span className="block text-center font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
            Admin Panel
          </span>
          <h1 className="font-display text-[1.5rem] font-semibold text-primary mt-1">
            Masuk ke Dashboard
          </h1>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-5">
            <label
              className="block font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase text-on-surface-variant mb-2"
              htmlFor="email"
            >
              Email Admin
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-sm font-body text-[0.9rem] text-on-surface outline-none transition-colors duration-200 focus:bg-primary-fixed round-lg"
            />
          </div>

          {/* Password */}
          <div className="mb-7">
            <label
              className="block font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase text-on-surface-variant mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-sm font-body text-[0.9rem] text-on-surface outline-none transition-colors duration-200 focus:bg-primary-fixed round-lg"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-md py-3.5 px-4 mb-5 font-display text-[0.85rem] text-error">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full justify-center font-display text-[0.875rem] font-bold tracking-wider 
              bg-gradient-to-br from-primary to-primary-container text-on-primary 
              border-none rounded-sm px-8 py-3.5 cursor-pointer transition-all duration-250 
              inline-flex items-center gap-2 
              hover:from-primary-container hover:to-primary hover:tracking-[0.07em] hover:-translate-y-px hover:shadow-[0_12px_32px_rgba(3,33,33,0.25)] rounded-lg
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
            `}
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard →"}
          </button>
        </form>

        <div className="text-center mt-6">
          <a
            href="/"
            className="font-display text-[0.8rem] text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            ← Kembali ke halaman utama
          </a>
        </div>

      </div>
    </div>
  );
}
