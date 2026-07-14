import { AppointmentStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: RouteContext<"/api/appointments/[id]/cancel">,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      status: true,
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  const canCancelOwn = appointment.userId === session.user.id;
  const canCancelAny = session.user.role === Role.OWNER;

  if (!canCancelOwn && !canCancelAny) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (appointment.status === AppointmentStatus.CANCELED) {
    return NextResponse.json({ success: true, alreadyCanceled: true });
  }

  let cancelReason: string | null = null;

  try {
    const body = await request.json();
    if (typeof body?.cancelReason === "string" && body.cancelReason.trim()) {
      cancelReason = body.cancelReason.trim().slice(0, 250);
    }
  } catch {
    cancelReason = null;
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointment.id },
    data: {
      status: AppointmentStatus.CANCELED,
      canceledByUserId: session.user.id,
      cancelReason,
    },
    include: {
      service: true,
    },
  });

  return NextResponse.json({ success: true, appointment: updatedAppointment });
}
