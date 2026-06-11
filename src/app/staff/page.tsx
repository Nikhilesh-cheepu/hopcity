import type { Metadata } from "next";
import { StaffGate } from "@/components/staff/StaffGate";
import { StaffPortal } from "@/components/staff/StaffPortal";

export const metadata: Metadata = {
  title: "Staff Portal | Hopcity Brew Co.",
  description: "Guest entry and reservation management for Hopcity staff.",
  robots: { index: false, follow: false },
};

export default function StaffPage() {
  return (
    <div className="relative min-h-[100dvh] px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(116,194,116,0.14)_0%,_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(116,194,116,0.08)_0%,_transparent_45%)]" />

      <div className="relative z-10 pt-2">
        <StaffGate>
          <StaffPortal />
        </StaffGate>
      </div>
    </div>
  );
}
