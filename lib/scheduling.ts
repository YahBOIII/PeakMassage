import "server-only";
import { AppointmentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SLOT_INTERVAL_MINUTES = 15;

function parseMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map((part) => Number.parseInt(part, 10));

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error("Invalid business hour format");
  }

  return hours * 60 + minutes;
}

function toUtcDate(date: string, minutesFromStartOfDay: number): Date {
  const [year, month, day] = date.split("-").map((part) => Number.parseInt(part, 10));

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      Math.floor(minutesFromStartOfDay / 60),
      minutesFromStartOfDay % 60,
      0,
      0,
    ),
  );
}

function getDayBounds(date: string) {
  const startOfDay = toUtcDate(date, 0);
  const endOfDay = toUtcDate(date, 24 * 60);
  return { startOfDay, endOfDay };
}

function overlaps(startAt: Date, endAt: Date, otherStartAt: Date, otherEndAt: Date) {
  return startAt < otherEndAt && endAt > otherStartAt;
}

function isWithinActiveBusinessHours(
  startAt: Date,
  endAt: Date,
  businessHours: { startTime: string; endTime: string }[],
) {
  const startMinutes = startAt.getUTCHours() * 60 + startAt.getUTCMinutes();
  const endMinutes = endAt.getUTCHours() * 60 + endAt.getUTCMinutes();

  return businessHours.some((window) => {
    const windowStart = parseMinutes(window.startTime);
    const windowEnd = parseMinutes(window.endTime);
    return startMinutes >= windowStart && endMinutes <= windowEnd;
  });
}

export async function listAvailableSlots(params: { date: string; durationMinutes: number }) {
  const { date, durationMinutes } = params;
  const { startOfDay, endOfDay } = getDayBounds(date);
  const dayOfWeek = startOfDay.getUTCDay();

  const [businessHours, appointments] = await Promise.all([
    prisma.businessHour.findMany({
      where: {
        dayOfWeek,
        active: true,
      },
      select: {
        startTime: true,
        endTime: true,
      },
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.BOOKED,
        startAt: {
          lt: endOfDay,
        },
        endAt: {
          gt: startOfDay,
        },
      },
      select: {
        startAt: true,
        endAt: true,
      },
    }),
  ]);

  if (businessHours.length === 0) {
    return [];
  }

  const now = new Date();
  const slots: string[] = [];

  for (const window of businessHours) {
    const windowStart = parseMinutes(window.startTime);
    const windowEnd = parseMinutes(window.endTime);

    for (
      let startMinutes = windowStart;
      startMinutes + durationMinutes <= windowEnd;
      startMinutes += SLOT_INTERVAL_MINUTES
    ) {
      const slotStart = toUtcDate(date, startMinutes);
      const slotEnd = toUtcDate(date, startMinutes + durationMinutes);

      if (slotStart < now) {
        continue;
      }

      const conflicts = appointments.some((appointment) =>
        overlaps(slotStart, slotEnd, appointment.startAt, appointment.endAt),
      );

      if (!conflicts) {
        slots.push(slotStart.toISOString());
      }
    }
  }

  return slots;
}

export async function createGuestBookedAppointment(params: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceId: string;
  startAt: Date;
}) {
  const { guestName, guestEmail, guestPhone, serviceId, startAt } = params;

  if (startAt <= new Date()) {
    throw new Error("Please select a future time slot.");
  }

  return prisma.$transaction(
    async (tx) => {
      const service = await tx.service.findUnique({
        where: { id: serviceId },
      });

      if (!service || !service.active) {
        throw new Error("Selected service is not available.");
      }

      const endAt = new Date(startAt.getTime() + service.durationMinutes * 60 * 1000);
      const dayOfWeek = startAt.getUTCDay();

      const businessHours = await tx.businessHour.findMany({
        where: {
          dayOfWeek,
          active: true,
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      if (!isWithinActiveBusinessHours(startAt, endAt, businessHours)) {
        throw new Error("Selected slot is outside business hours.");
      }

      const conflictingAppointment = await tx.appointment.findFirst({
        where: {
          status: AppointmentStatus.BOOKED,
          startAt: {
            lt: endAt,
          },
          endAt: {
            gt: startAt,
          },
        },
        select: {
          id: true,
        },
      });

      if (conflictingAppointment) {
        throw new Error("Selected slot is no longer available.");
      }

      return tx.appointment.create({
        data: {
          guestName,
          guestEmail,
          guestPhone,
          serviceId,
          startAt,
          endAt,
          status: AppointmentStatus.BOOKED,
        },
        include: {
          service: true,
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}

export async function createBookedAppointment(params: {
  userId: string;
  serviceId: string;
  startAt: Date;
}) {
  const { userId, serviceId, startAt } = params;

  if (startAt <= new Date()) {
    throw new Error("Please select a future time slot.");
  }

  return prisma.$transaction(
    async (tx) => {
      const service = await tx.service.findUnique({
        where: { id: serviceId },
      });

      if (!service || !service.active) {
        throw new Error("Selected service is not available.");
      }

      const endAt = new Date(startAt.getTime() + service.durationMinutes * 60 * 1000);
      const dayOfWeek = startAt.getUTCDay();

      const businessHours = await tx.businessHour.findMany({
        where: {
          dayOfWeek,
          active: true,
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      if (!isWithinActiveBusinessHours(startAt, endAt, businessHours)) {
        throw new Error("Selected slot is outside business hours.");
      }

      const conflictingAppointment = await tx.appointment.findFirst({
        where: {
          status: AppointmentStatus.BOOKED,
          startAt: {
            lt: endAt,
          },
          endAt: {
            gt: startAt,
          },
        },
        select: {
          id: true,
        },
      });

      if (conflictingAppointment) {
        throw new Error("Selected slot is no longer available.");
      }

      return tx.appointment.create({
        data: {
          userId,
          serviceId,
          startAt,
          endAt,
          status: AppointmentStatus.BOOKED,
        },
        include: {
          service: true,
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}
