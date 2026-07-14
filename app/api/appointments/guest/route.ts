import { NextResponse } from "next/server";
import { sendGuestBookingNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { createGuestBookedAppointment } from "@/lib/scheduling";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[\d\s\-()+]{7,20}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const guestName = typeof body.guestName === "string" ? body.guestName.trim() : "";
    const guestEmail =
      typeof body.guestEmail === "string" ? body.guestEmail.trim().toLowerCase() : "";
    const guestPhone = typeof body.guestPhone === "string" ? body.guestPhone.trim() : "";
    const serviceId = typeof body.serviceId === "string" ? body.serviceId : "";
    const startAtString = typeof body.startAt === "string" ? body.startAt : "";

    if (!guestName || !guestEmail || !guestPhone || !serviceId || !startAtString) {
      return NextResponse.json(
        { error: "Name, email, phone, service, and time are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(guestEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!isValidPhone(guestPhone)) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }

    const startAt = new Date(startAtString);

    if (Number.isNaN(startAt.getTime())) {
      return NextResponse.json({ error: "Invalid start time." }, { status: 400 });
    }

    const appointment = await createGuestBookedAppointment({
      guestName,
      guestEmail,
      guestPhone,
      serviceId,
      startAt,
    });

    const service = await prisma.service.findUnique({ where: { id: serviceId } });

    if (service) {
      sendGuestBookingNotification({
        guestName,
        guestEmail,
        guestPhone,
        serviceName: service.name,
        startAt,
      }).catch((err: unknown) => {
        console.error("Failed to send booking notification email.", err);
      });
    }

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create appointment." }, { status: 500 });
  }
}
