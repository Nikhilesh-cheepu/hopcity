import { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-hop-green/15 bg-white/[0.04] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-5 ${
        glow ? "shadow-[0_0_40px_rgba(174,201,176,0.12),0_8px_32px_rgba(0,0,0,0.5)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
