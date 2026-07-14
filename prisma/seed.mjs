import { hash } from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const defaultServices = [
  {
    name: "Recovery Massage",
    durationMinutes: 60,
  },
  {
    name: "Recovery Massage",
    durationMinutes: 75,
  },
];

const defaultBusinessHours = [
  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
  { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
];

async function main() {
  for (const service of defaultServices) {
    await prisma.service.upsert({
      where: {
        name_durationMinutes: {
          name: service.name,
          durationMinutes: service.durationMinutes,
        },
      },
      update: {
        name: service.name,
        durationMinutes: service.durationMinutes,
        active: true,
      },
      create: {
        ...service,
        active: true,
      },
    });
  }

  for (const businessHour of defaultBusinessHours) {
    await prisma.businessHour.upsert({
      where: {
        dayOfWeek_startTime_endTime: {
          dayOfWeek: businessHour.dayOfWeek,
          startTime: businessHour.startTime,
          endTime: businessHour.endTime,
        },
      },
      update: {
        active: true,
      },
      create: {
        ...businessHour,
        active: true,
      },
    });
  }

  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  const ownerName = process.env.OWNER_NAME ?? "Peak Recovery Owner";

  if (ownerEmail && ownerPassword) {
    const passwordHash = await hash(ownerPassword, 12);

    await prisma.user.upsert({
      where: {
        email: ownerEmail,
      },
      update: {
        role: Role.OWNER,
        name: ownerName,
        passwordHash,
      },
      create: {
        email: ownerEmail,
        name: ownerName,
        passwordHash,
        role: Role.OWNER,
      },
    });
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
