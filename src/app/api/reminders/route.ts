import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ReminderRecord } from "@/lib/reminders";

function serialize(r: {
  id: string;
  reservationId: string | null;
  guestName: string;
  mobileNo: string;
  venue: string | null;
  specialOccasion: string | null;
  specialOccasionLabel: string | null;
  remindAt: Date;
  note: string | null;
  status: string;
  createdAt: Date;
  completedAt: Date | null;
}): ReminderRecord {
  return {
    id: r.id,
    reservationId: r.reservationId,
    guestName: r.guestName,
    mobileNo: r.mobileNo,
    venue: r.venue,
    specialOccasion: r.specialOccasion,
    specialOccasionLabel: r.specialOccasionLabel,
    remindAt: r.remindAt.toISOString(),
    note: r.note,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    completedAt: r.completedAt?.toISOString() ?? null,
  };
}

export async function GET(request: Request) {
  if (!db?.guestReminder) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "pending";

  try {
    const rows = await db.guestReminder.findMany({
      where: status === "all" ? {} : { status },
      orderBy: [{ remindAt: "asc" }],
      take: 100,
    });

    return NextResponse.json({ reminders: rows.map(serialize) });
  } catch (error) {
    console.error("Reminders fetch error:", error);
    return NextResponse.json({ error: "Failed to load reminders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!db?.guestReminder) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";
    const mobileRaw = typeof body.mobileNo === "string" ? body.mobileNo.replace(/\D/g, "") : "";
    const remindAtStr = typeof body.remindAt === "string" ? body.remindAt : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";
    const reservationId =
      typeof body.reservationId === "string" ? body.reservationId.trim() : null;
    const venue = typeof body.venue === "string" ? body.venue.trim() : null;
    const specialOccasion =
      typeof body.specialOccasion === "string" ? body.specialOccasion.trim() : null;
    const specialOccasionLabel =
      typeof body.specialOccasionLabel === "string" ? body.specialOccasionLabel.trim() : null;

    if (!guestName || !mobileRaw || !remindAtStr) {
      return NextResponse.json({ error: "Guest, mobile and reminder time are required." }, { status: 400 });
    }

    const remindAt = new Date(remindAtStr);
    if (Number.isNaN(remindAt.getTime())) {
      return NextResponse.json({ error: "Invalid reminder time." }, { status: 400 });
    }

    const row = await db.guestReminder.create({
      data: {
        guestName,
        mobileNo: mobileRaw,
        remindAt,
        note: note || null,
        reservationId,
        venue,
        specialOccasion,
        specialOccasionLabel,
      },
    });

    return NextResponse.json({ reminder: serialize(row) }, { status: 201 });
  } catch (error) {
    console.error("Reminder create error:", error);
    return NextResponse.json({ error: "Failed to save reminder." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!db?.guestReminder) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (!id || !status) {
      return NextResponse.json({ error: "Reminder id and status required." }, { status: 400 });
    }

    const row = await db.guestReminder.update({
      where: { id },
      data: {
        status,
        completedAt: status === "done" ? new Date() : null,
      },
    });

    return NextResponse.json({ reminder: serialize(row) });
  } catch (error) {
    console.error("Reminder update error:", error);
    return NextResponse.json({ error: "Failed to update reminder." }, { status: 500 });
  }
}
