"use client";

import {
  buildTemplateMessage,
  MESSAGE_TEMPLATE_LABELS,
  type MessageTemplateKind,
} from "@/lib/message-templates";
import { whatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIconButton";

type GuestMessageContext = {
  guestName: string;
  mobileNo: string;
  venue: string;
  visitDate: string;
  specialOccasion?: string | null;
  specialOccasionLabel?: string | null;
};

export function WhatsAppActions({
  guest,
  kinds = ["followup", "review"],
}: {
  guest: GuestMessageContext;
  kinds?: MessageTemplateKind[];
}) {
  function open(kind: MessageTemplateKind) {
    const message = buildTemplateMessage(kind, guest);
    window.open(whatsAppUrl(guest.mobileNo, message), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap gap-2">
      {kinds.map((kind) => (
        <button
          key={kind}
          type="button"
          onClick={() => open(kind)}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#25D366]/35 bg-[#25D366]/10 px-3 text-[0.65rem] font-semibold uppercase tracking-wide text-[#25D366] transition hover:bg-[#25D366]/20"
        >
          <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
          {MESSAGE_TEMPLATE_LABELS[kind]}
        </button>
      ))}
    </div>
  );
}

