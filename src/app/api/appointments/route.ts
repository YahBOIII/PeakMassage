import { NextResponse } from "next/server";

import { createAppointment, getStorageMode, listAppointments } from "@/lib/booking-store";
import {
  findService,
  isBookableTime,
  isValidDate,
  isValidTime,
  listUpcomingSchedule,
} from "@/lib/scheduling";

export const dynamic = "force-dynamic";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  const schedule = listUpcomingSchedule();
  const firstDay = schedule[0];
  const lastDay = schedule[schedule.length - 1];
  const appointments =
    firstDay && lastDay
      ? await listAppointments(firstDay.date, lastDay.date)
      : [];

  return NextResponse.json({
    schedule,
    appointments,
    storageMode: getStorageMode(),
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | {
        fullName?: string;
        email?: string;
        phone?: string;
        serviceSlug?: string;
        appointmentDate?: string;
        appointmentTime?: string;
        notes?: string;
      }
    | null;

  if (!payload) {
    return badRequest("Please submit valid booking details.");
  }

  const fullName = payload.fullName?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const serviceSlug = payload.serviceSlug?.trim() ?? "";
  const appointmentDate = payload.appointmentDate?.trim() ?? "";
  const appointmentTime = payload.appointmentTime?.trim() ?? "";
  const notes = payload.notes?.trim() ?? "";

  if (fullName.length < 2) {
    return badRequest("Please enter your full name.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Please enter a valid email address.");
  }

  if (phone.length < 7) {
    return badRequest("Please enter a valid phone number.");
  }

  if (!findService(serviceSlug)) {
    return badRequest("Please choose a valid service.");
  }

  if (!isValidDate(appointmentDate) || !isValidTime(appointmentTime)) {
    return badRequest("Please choose a valid appointment time.");
  }

  if (!isBookableTime(appointmentDate, appointmentTime)) {
    return badRequest("That appointment time is not available.");
  }

  if (notes.length > 500) {
    return badRequest("Please keep session notes under 500 characters.");
  }

  const result = await createAppointment({
    fullName,
    email: email.toLowerCase(),
    phone,
    serviceSlug,
    appointmentDate,
    appointmentTime,
    notes: notes || null,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "That time was just booked. Please choose another slot." },
      { status: 409 },
    );
  }

  return NextResponse.json(
    {
      message: "Your Peak Recovery Massage appointment has been reserved.",
      storageMode: result.mode,
    },
    { status: 201 },
  );
}
