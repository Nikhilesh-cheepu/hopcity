"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  isStaffAuthenticated,
  setStaffAuthenticated,
  STAFF_PASSWORD,
} from "@/lib/staff-auth";
import { GlassCard } from "./GlassCard";

const inputClass =
  "min-h-12 w-full rounded-xl border border-hop-green/20 bg-black/50 px-4 py-3 text-base text-hop-white placeholder:text-hop-white/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] outline-none transition focus:border-hop-green/60 focus:shadow-[0_0_20px_rgba(116,194,116,0.15)]";

export function StaffGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(isStaffAuthenticated());
    setReady(true);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === STAFF_PASSWORD) {
      setStaffAuthenticated();
      setAuthed(true);
      setError("");
      return;
    }
    setError("Incorrect staff password.");
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-sm py-16 text-center text-sm text-hop-white/40">
        Loading…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto w-full max-w-sm pt-8">
        <header className="mb-6 text-center">
          <p className="hop-text-brand text-[0.65rem] font-semibold uppercase tracking-[0.28em]">
            Staff Portal
          </p>
          <h1 className="mt-1 text-xl font-bold text-hop-white">Staff Access</h1>
          <p className="mt-2 text-sm text-hop-white/45">Enter staff password to continue.</p>
        </header>

        <GlassCard glow>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="staffPassword" className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#74c274]">
                Staff Password
              </label>
              <input
                id="staffPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              className="hop-btn-primary min-h-12 w-full rounded-xl py-3 text-base font-bold transition active:scale-[0.98]"
            >
              Enter Portal
            </button>

            {error && <p className="text-center text-sm text-red-400">{error}</p>}
          </form>
        </GlassCard>
      </div>
    );
  }

  return <>{children}</>;
}
