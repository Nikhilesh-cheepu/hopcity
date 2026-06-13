import { NextResponse } from "next/server";
import { formatOtherOccasionLabel, SPECIAL_OCCASIONS } from "@/data/occasions";
import {
  BOOKING_SOURCES,
  ENTRY_TYPES,
  formatOtherBookingSource,
  VENUES,
} from "@/data/venues";
import { db } from "@/lib/db";
import { normalizeIndianMobile } from "@/lib/mobile";
import {
  parseDateRange,
  parseVisitDate,
  type ReservationRecord,
} from "@/lib/reservations";

function serialize(r: {
  id: string;
  staffType: string;
  entryType: string;
  bookingSource?: string | null;
  specialOccasion?: string | null;
  specialOccasionLabel?: string | null;
  guestName: string;
  mobileNo: string;
  partySize: number;
  venue: string;
  visitDate: Date;
  createdAt: Date;
}): ReservationRecord {
  return {
    id: r.id,
    staffType: r.staffType,
    entryType: r.entryType,
    bookingSource: r.bookingSource ?? "direct",
    specialOccasion: r.specialOccasion ?? "none",
    specialOccasionLabel: r.specialOccasionLabel ?? null,
    guestName: r.guestName,
    mobileNo: r.mobileNo,
    partySize: r.partySize,
    venue: r.venue,
    visitDate: r.visitDate.toISOString().slice(0, 10),
    createdAt: r.createdAt.toISOString(),
  };
}

function resolveDateFilter(searchParams: URLSearchParams) {
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  if (from && to) {
    return parseDateRange(from, to);
  }
  if (date) {
    const d = parseVisitDate(date);
    return { gte: d, lte: d };
  }
  return null;
}

export async function GET(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const venue = searchParams.get("venue");
  const bookingSource = searchParams.get("bookingSource");
  const specialOccasion = searchParams.get("specialOccasion");
  const hasOccasion = searchParams.get("hasOccasion") === "true";
  const dateFilter = resolveDateFilter(searchParams);

  if (!dateFilter) {
    return NextResponse.json(
      { error: "Provide date or from+to query params." },
      { status: 400 },
    );
  }

  try {
    const rows = await db.reservation.findMany({
      where: {
        visitDate: dateFilter,
        ...(venue && venue !== "all" ? { venue } : {}),
        ...(bookingSource && bookingSource !== "all"
          ? bookingSource === "other"
            ? { bookingSource: { startsWith: "other:" } }
            : { bookingSource }
          : {}),
        ...(hasOccasion ? { specialOccasion: { not: "none" } } : {}),
        ...(specialOccasion && specialOccasion !== "all"
          ? { specialOccasion }
          : {}),
      },
      orderBy: [{ visitDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ reservations: rows.map(serialize) });
  } catch (error) {
    console.error("Reservations fetch error:", error);
    return NextResponse.json({ error: "Failed to load reservations." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const staffType = typeof body.staffType === "string" ? body.staffType.trim() : "";
    const entryType = typeof body.entryType === "string" ? body.entryType.trim() : "walkin";
    const bookingSourceRaw =
      typeof body.bookingSource === "string" ? body.bookingSource.trim() : "direct";
    const bookingSourceOther =
      typeof body.bookingSourceOther === "string" ? body.bookingSourceOther.trim() : "";
    const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";
    const mobileNormalized = normalizeIndianMobile(
      typeof body.mobileNo === "string" ? body.mobileNo : "",
    );
    const partySize = Number(body.partySize);
    const venue = typeof body.venue === "string" ? body.venue.trim() : "";
    const visitDateStr = typeof body.visitDate === "string" ? body.visitDate : "";
    const hasOccasionInput = body.hasSpecialOccasion === true;
    const specialOccasionRaw =
      typeof body.specialOccasion === "string" ? body.specialOccasion.trim() : "none";
    const specialOccasionOther =
      typeof body.specialOccasionOther === "string" ? body.specialOccasionOther.trim() : "";

    if (!staffType || !guestName || !venue || !visitDateStr) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    if (!ENTRY_TYPES.some((e) => e.id === entryType)) {
      return NextResponse.json({ error: "Invalid entry type." }, { status: 400 });
    }

    let bookingSource = entryType === "walkin" ? "direct" : bookingSourceRaw;

    if (entryType === "reserved") {
      if (bookingSource === "other") {
        if (!bookingSourceOther || bookingSourceOther.length > 40) {
          return NextResponse.json(
            { error: "Please enter where the reservation is from (max 40 characters)." },
            { status: 400 },
          );
        }
        bookingSource = formatOtherBookingSource(bookingSourceOther);
      } else if (!BOOKING_SOURCES.some((s) => s.id === bookingSource && s.id !== "direct")) {
        return NextResponse.json({ error: "Invalid booking source." }, { status: 400 });
      }
    }

    if (!mobileNormalized) {
      return NextResponse.json(
        { error: "Enter a valid Indian mobile (+91 or 10 digits)." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 50) {
      return NextResponse.json(
        { error: "Party size must be between 1 and 50." },
        { status: 400 },
      );
    }

    if (!VENUES.some((v) => v.id === venue)) {
      return NextResponse.json({ error: "Invalid venue selected." }, { status: 400 });
    }

    let specialOccasion = "none";
    let specialOccasionLabel: string | null = null;

    if (hasOccasionInput) {
      if (specialOccasionRaw === "other") {
        if (!specialOccasionOther || specialOccasionOther.length > 40) {
          return NextResponse.json(
            { error: "Please describe the occasion (max 40 characters)." },
            { status: 400 },
          );
        }
        specialOccasion = "other";
        specialOccasionLabel = formatOtherOccasionLabel(specialOccasionOther);
      } else if (SPECIAL_OCCASIONS.some((o) => o.id === specialOccasionRaw)) {
        specialOccasion = specialOccasionRaw;
      } else {
        return NextResponse.json({ error: "Invalid special occasion." }, { status: 400 });
      }
    }

    const row = await db.reservation.create({
      data: {
        staffType,
        entryType,
        bookingSource,
        specialOccasion,
        specialOccasionLabel,
        guestName,
        mobileNo: mobileNormalized,
        partySize,
        venue,
        visitDate: parseVisitDate(visitDateStr),
      },
    });

    return NextResponse.json({ reservation: serialize(row) }, { status: 201 });
  } catch (error) {
    console.error("Reservation create error:", error);
    return NextResponse.json({ error: "Failed to save entry." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const hasOccasionInput = body.hasSpecialOccasion === true;
    const clearOccasion = body.hasSpecialOccasion === false;
    const specialOccasionRaw =
      typeof body.specialOccasion === "string" ? body.specialOccasion.trim() : "none";
    const specialOccasionOther =
      typeof body.specialOccasionOther === "string" ? body.specialOccasionOther.trim() : "";

    if (!id) {
      return NextResponse.json({ error: "Reservation id required." }, { status: 400 });
    }

    let specialOccasion = "none";
    let specialOccasionLabel: string | null = null;

    if (hasOccasionInput) {
      if (specialOccasionRaw === "other") {
        if (!specialOccasionOther || specialOccasionOther.length > 40) {
          return NextResponse.json(
            { error: "Please describe the occasion (max 40 characters)." },
            { status: 400 },
          );
        }
        specialOccasion = "other";
        specialOccasionLabel = formatOtherOccasionLabel(specialOccasionOther);
      } else if (SPECIAL_OCCASIONS.some((o) => o.id === specialOccasionRaw)) {
        specialOccasion = specialOccasionRaw;
      } else {
        return NextResponse.json({ error: "Invalid special occasion." }, { status: 400 });
      }
    } else if (!clearOccasion) {
      return NextResponse.json({ error: "Invalid occasion update." }, { status: 400 });
    }

    const row = await db.reservation.update({
      where: { id },
      data: clearOccasion
        ? { specialOccasion: "none", specialOccasionLabel: null }
        : { specialOccasion, specialOccasionLabel },
    });

    return NextResponse.json({ reservation: serialize(row) });
  } catch (error) {
    console.error("Reservation update error:", error);
    return NextResponse.json({ error: "Failed to update entry." }, { status: 500 });
  }
}
