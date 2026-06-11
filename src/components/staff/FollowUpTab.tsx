"use client";

import { useEffect, useState } from "react";
import { getSpecialOccasionLabel, SPECIAL_OCCASIONS } from "@/data/occasions";
import {
  formatTime,
  reservationVenueLabel,
  type ReservationRecord,
} from "@/lib/reservations";
import {
  formatReminderDateTime,
  isReminderOverdue,
  isReminderToday,
  type ReminderRecord,
} from "@/lib/reminders";
import { buildTemplateMessage } from "@/lib/message-templates";
import { whatsAppUrl } from "@/lib/whatsapp";
import { AddReminderForm } from "./AddReminderForm";
import { GlassCard } from "./GlassCard";
import { WhatsAppActions } from "./WhatsAppActions";
import { WhatsAppIconButton } from "./WhatsAppIconButton";

type Section = "occasions" | "reminders";

export function FollowUpTab({
  from,
  to,
  refreshKey,
}: {
  from: string;
  to: string;
  refreshKey: number;
}) {
  const [section, setSection] = useState<Section>("occasions");

  return (
    <div className="space-y-4">
      <div className="flex rounded-xl border border-hop-green/15 bg-black/40 p-1">
        <SectionButton active={section === "occasions"} onClick={() => setSection("occasions")}>
          Occasions
        </SectionButton>
        <SectionButton active={section === "reminders"} onClick={() => setSection("reminders")}>
          Reminders
        </SectionButton>
      </div>

      {section === "occasions" ? (
        <OccasionList key={`occ-${refreshKey}-${from}-${to}`} from={from} to={to} />
      ) : (
        <ReminderList key={`rem-${refreshKey}`} />
      )}
    </div>
  );
}

function SectionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wide transition ${
        active ? "hop-tab-active" : "text-hop-white/45"
      }`}
    >
      {children}
    </button>
  );
}

function OccasionList({ from, to }: { from: string; to: string }) {
  const [occasionFilter, setOccasionFilter] = useState("all");
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingFor, setAddingFor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ from, to, hasOccasion: "true" });
    if (occasionFilter !== "all") params.set("specialOccasion", occasionFilter);

    fetch(`/api/reservations?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && !data.error) setReservations(data.reservations ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to, occasionFilter]);

  if (loading) {
    return (
      <GlassCard>
        <p className="py-6 text-center text-sm text-hop-white/40 animate-pulse">Loading…</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterChip label="All" active={occasionFilter === "all"} onClick={() => setOccasionFilter("all")} />
        {SPECIAL_OCCASIONS.map((o) => (
          <FilterChip
            key={o.id}
            label={o.label}
            active={occasionFilter === o.id}
            onClick={() => setOccasionFilter(o.id)}
          />
        ))}
      </div>

      {reservations.length === 0 ? (
        <GlassCard>
          <p className="py-6 text-center text-sm text-hop-white/40">
            No special occasions in this period.
          </p>
        </GlassCard>
      ) : (
        <ul className="space-y-3">
          {reservations.map((r) => (
            <li key={r.id}>
              <GlassCard className="!p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-hop-white">{r.guestName}</p>
                    <p className="text-sm text-hop-white/45">{r.mobileNo}</p>
                  </div>
                  <WhatsAppIconButton mobileNo={r.mobileNo} guestName={r.guestName} />
                  <span className="shrink-0 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-amber-200">
                    {getSpecialOccasionLabel(r.specialOccasion, r.specialOccasionLabel)}
                  </span>
                </div>

                <p className="mt-2 text-[0.65rem] text-hop-white/40">
                  {reservationVenueLabel(r.venue)} · {r.visitDate} · {formatTime(r.createdAt)} IST
                </p>

                <div className="mt-3 border-t border-white/5 pt-3">
                  <WhatsAppActions guest={r} />
                </div>

                {addingFor === r.id ? (
                  <AddReminderForm
                    guestName={r.guestName}
                    mobileNo={r.mobileNo}
                    venue={r.venue}
                    reservationId={r.id}
                    specialOccasion={r.specialOccasion}
                    specialOccasionLabel={r.specialOccasionLabel}
                    onSaved={() => setAddingFor(null)}
                    onCancel={() => setAddingFor(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingFor(r.id)}
                    className="mt-2 text-[0.65rem] font-semibold uppercase tracking-wide text-hop-white/40 transition hover:text-[#74c274]"
                  >
                    + Add reminder
                  </button>
                )}
              </GlassCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReminderList() {
  const [reminders, setReminders] = useState<ReminderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch("/api/reminders?status=pending")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setReminders(data.reminders ?? []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function markDone(id: string) {
    await fetch("/api/reminders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "done" }),
    });
    load();
  }

  function sendReminderWa(r: ReminderRecord) {
    const message = buildTemplateMessage("reminder", {
      guestName: r.guestName,
      venue: r.venue ?? "",
      visitDate: r.remindAt.slice(0, 10),
      specialOccasion: r.specialOccasion,
      specialOccasionLabel: r.specialOccasionLabel,
    });
    window.open(whatsAppUrl(r.mobileNo, message), "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <GlassCard>
        <p className="py-6 text-center text-sm text-hop-white/40 animate-pulse">Loading…</p>
      </GlassCard>
    );
  }

  if (reminders.length === 0) {
    return (
      <GlassCard>
        <p className="py-6 text-center text-sm text-hop-white/40">
          No pending reminders. Add one from an occasion guest.
        </p>
      </GlassCard>
    );
  }

  const sorted = [...reminders].sort(
    (a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime(),
  );

  return (
    <ul className="space-y-3">
      {sorted.map((r) => {
        const overdue = isReminderOverdue(r.remindAt);
        const today = isReminderToday(r.remindAt);

        return (
          <li key={r.id}>
            <GlassCard className="!p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-hop-white">{r.guestName}</p>
                  <p className="text-sm text-hop-white/45">{r.mobileNo}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase ${
                    overdue
                      ? "bg-red-500/15 text-red-300"
                      : today
                        ? "bg-amber-500/15 text-amber-200"
                        : "bg-white/5 text-hop-white/45"
                  }`}
                >
                  {overdue ? "Due" : today ? "Today" : "Upcoming"}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#85d985]">{formatReminderDateTime(r.remindAt)}</p>
              {r.note && <p className="mt-1 text-xs text-hop-white/45">{r.note}</p>}
              {r.specialOccasion && r.specialOccasion !== "none" && (
                <p className="mt-1 text-[0.65rem] text-amber-200/80">
                  {getSpecialOccasionLabel(r.specialOccasion, r.specialOccasionLabel)}
                </p>
              )}

              <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
                <button
                  type="button"
                  onClick={() => sendReminderWa(r)}
                  className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#25D366]/35 bg-[#25D366]/10 text-[0.65rem] font-semibold uppercase text-[#25D366]"
                >
                  Send WA
                </button>
                <button
                  type="button"
                  onClick={() => markDone(r.id)}
                  className="min-h-9 flex-1 rounded-lg border border-white/10 text-[0.65rem] font-semibold uppercase text-hop-white/55"
                >
                  Done
                </button>
              </div>
            </GlassCard>
          </li>
        );
      })}
    </ul>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "border border-[#74c274] bg-[#74c274]/20 text-[#85d985]"
          : "border border-white/10 text-hop-white/45"
      }`}
    >
      {label}
    </button>
  );
}
