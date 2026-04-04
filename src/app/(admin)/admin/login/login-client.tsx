"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function LoginClient() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-[#E50914] font-bold text-4xl tracking-tight">M</span>
          <p className="mt-2 text-[#808080] text-sm">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-md p-8 space-y-5"
        >
          <h1 className="text-white font-bold text-xl">Sign In</h1>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[#808080] text-xs font-bold uppercase tracking-widest">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={loading}
              className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[#808080] text-xs font-bold uppercase tracking-widest">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={loading}
              className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.15)] rounded-sm px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-[#E50914] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-3 rounded-sm font-bold text-sm transition-colors",
              loading
                ? "bg-[#a00] text-white/60 cursor-not-allowed"
                : "bg-[#E50914] hover:bg-[#f40d1a] text-white"
            )}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
