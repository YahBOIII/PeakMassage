import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listAvailableSlots } from "@/lib/scheduling";

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!date || !isIsoDate(date)) {
    return NextResponse.json({ error: "date query param must be YYYY-MM-DD." }, { status: 400 });
  }

  if (!serviceId) {
    return NextResponse.json({ error: "serviceId query param is required." }, { status: 400 });
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { durationMinutes: true, active: true },
  });

  if (!service || !service.active) {
    return NextResponse.json({ error: "Service not found." }, { status: 404 });
  }

  const slots = await listAvailableSlots({
    date,
    durationMinutes: service.durationMinutes,
  });

  return NextResponse.json({ slots });
}
