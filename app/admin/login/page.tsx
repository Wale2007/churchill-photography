"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      
      if (data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="w-full max-w-md bg-brand-white p-8 md:p-12 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] glass-panel relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-cream border border-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold mx-auto mb-4">
            <Lock size={20} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-charcoal">Admin Access</h1>
          <p className="text-brand-dark-gray text-xs font-light tracking-wide mt-2">
            Enter the studio access key to open the administration console.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-widest font-semibold text-brand-dark-gray block mb-2">Studio Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-brand-gray/50 border border-transparent rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all font-mono tracking-widest text-center"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark-gray/60 hover:text-brand-gold transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-gold text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-hover hover:shadow-brand-gold/40 transition-all disabled:opacity-50"
          >
            {loading ? "Authorizing..." : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
