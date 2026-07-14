import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookedAppointment } from "@/lib/scheduling";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where =
    session.user.role === Role.OWNER
      ? undefined
      : {
          userId: session.user.id,
        };

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      service: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      canceledByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });

  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const serviceId = typeof body.serviceId === "string" ? body.serviceId : "";
    const startAtString = typeof body.startAt === "string" ? body.startAt : "";

    if (!serviceId || !startAtString) {
      return NextResponse.json(
        { error: "serviceId and startAt are required." },
        { status: 400 },
      );
    }

    const startAt = new Date(startAtString);

    if (Number.isNaN(startAt.getTime())) {
      return NextResponse.json({ error: "Invalid startAt." }, { status: 400 });
    }

    const appointment = await createBookedAppointment({
      userId: session.user.id,
      serviceId,
      startAt,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create appointment." }, { status: 500 });
  }
}
