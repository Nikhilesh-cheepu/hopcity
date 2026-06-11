import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const CLEAR_PASSWORD =
  process.env.CLEAR_DATA_PASSWORD ?? "hopcitybrew.co/clear";

export async function POST(request: Request) {
  if (!db?.reservation) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";
    const confirm = typeof body.confirm === "string" ? body.confirm.trim() : "";

    if (password !== CLEAR_PASSWORD) {
      return NextResponse.json({ error: "Invalid clear password." }, { status: 401 });
    }

    if (confirm !== "DELETE") {
      return NextResponse.json({ error: 'Type DELETE to confirm.' }, { status: 400 });
    }

    const [reservations, waitlist] = await Promise.all([
      db.reservation.deleteMany(),
      db.waitlistSignup.deleteMany(),
    ]);

    return NextResponse.json({
      ok: true,
      deleted: {
        reservations: reservations.count,
        waitlist: waitlist.count,
      },
    });
  } catch (error) {
    console.error("Clear data error:", error);
    return NextResponse.json({ error: "Failed to clear data." }, { status: 500 });
  }
}
