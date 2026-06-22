import { neon } from "@neondatabase/serverless";

import type { AppointmentRecord } from "@/lib/scheduling";

type CreateAppointmentInput = Omit<AppointmentRecord, "createdAt">;

type StorageMode = "database" | "preview";

const previewAppointments: AppointmentRecord[] = [];

function getStorageMode(): StorageMode {
  return process.env.DATABASE_URL ? "database" : "preview";
}

function getSqlClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  return neon(process.env.DATABASE_URL);
}

async function ensureAppointmentsTable() {
  const sql = getSqlClient();

  if (!sql) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id BIGSERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service_slug TEXT NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (appointment_date, appointment_time)
    )
  `;
}

export async function listAppointments(startDate: string, endDate: string) {
  const sql = getSqlClient();

  if (!sql) {
    return previewAppointments
      .filter(
        (appointment) =>
          appointment.appointmentDate >= startDate && appointment.appointmentDate <= endDate,
      )
      .sort((left, right) =>
        `${left.appointmentDate}${left.appointmentTime}`.localeCompare(
          `${right.appointmentDate}${right.appointmentTime}`,
        ),
      );
  }

  await ensureAppointmentsTable();

  const result = await sql<AppointmentRecord[]>`
    SELECT
      full_name AS "fullName",
      email,
      phone,
      service_slug AS "serviceSlug",
      appointment_date::text AS "appointmentDate",
      appointment_time AS "appointmentTime",
      notes,
      created_at::text AS "createdAt"
    FROM appointments
    WHERE appointment_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY appointment_date, appointment_time
  `;

  return result;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const sql = getSqlClient();

  if (!sql) {
    const isTaken = previewAppointments.some(
      (appointment) =>
        appointment.appointmentDate === input.appointmentDate &&
        appointment.appointmentTime === input.appointmentTime,
    );

    if (isTaken) {
      return {
        ok: false as const,
        reason: "slot_taken" as const,
      };
    }

    previewAppointments.push({
      ...input,
      createdAt: new Date().toISOString(),
    });

    return {
      ok: true as const,
      mode: getStorageMode(),
    };
  }

  await ensureAppointmentsTable();

  const result = await sql<{ id: number }[]>`
    INSERT INTO appointments (
      full_name,
      email,
      phone,
      service_slug,
      appointment_date,
      appointment_time,
      notes
    )
    VALUES (
      ${input.fullName},
      ${input.email},
      ${input.phone},
      ${input.serviceSlug},
      ${input.appointmentDate},
      ${input.appointmentTime},
      ${input.notes}
    )
    ON CONFLICT (appointment_date, appointment_time) DO NOTHING
    RETURNING id
  `;

  if (result.length === 0) {
    return {
      ok: false as const,
      reason: "slot_taken" as const,
    };
  }

  return {
    ok: true as const,
    mode: getStorageMode(),
  };
}

export { getStorageMode };
