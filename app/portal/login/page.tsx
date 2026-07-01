"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Fetch role to redirect correctly
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "admin") {
        router.push("/portal/admin");
      } else {
        router.push("/portal/client");
      }
    }
  };

  const inputClasses =
    "w-full bg-[#0a0a0a] border border-[#1e1e1e] px-4 py-3 text-silver text-sm font-sans placeholder:text-[#6b6965] focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1e1e1e 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Gold glow top-left */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#c9a84c]/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo / firm name */}
        <div className="mb-10 text-center">
          <div className="mb-2 font-serif text-3xl font-normal text-white">
            Kaushik &amp; Company
          </div>
          <div className="text-xs uppercase tracking-widest text-silver-dim">
            Client Portal
          </div>
          <div className="mx-auto mt-4 h-[1px] w-12 bg-[#c9a84c]" />
        </div>

        {/* Form card */}
        <div className="border border-[#1e1e1e] bg-[#111111]/80 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="font-serif text-xl font-normal text-silver">
              Sign in to your account
            </h1>
            <p className="mt-1 text-xs text-silver-dim">
              Enter your email and password to access the portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest text-silver-dim">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest text-silver-dim">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-red-900/40 bg-red-950/20 px-4 py-3 text-xs text-red-400"
              >
                {error}
              </motion.div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="mt-2 w-full border border-[#1e1e1e] bg-[#0a0a0a] py-3 text-sm uppercase tracking-widest text-silver transition-all duration-300 hover:border-[#c9a84c] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-silver-dim transition-colors hover:text-silver"
          >
            ← Back to kaushikandcompany.com
          </a>
        </div>
      </motion.div>
    </div>
  );
}
