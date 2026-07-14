"use client";

import { useState } from "react";

type Appointment = {
  id: string;
  startAt: string | Date;
  endAt: string | Date;
  status: "BOOKED" | "CANCELED";
  cancelReason: string | null;
  service: {
    id: string;
    name: string;
    durationMinutes: number;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type Props = {
  initialAppointments: Appointment[];
  ownerView?: boolean;
};

function formatDateTime(dateValue: string | Date) {
  return new Date(dateValue).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AppointmentsList({ initialAppointments, ownerView = false }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function cancelAppointment(id: string) {
    setBusyId(id);
    setError(null);

    try {
      const response = await fetch(`/api/appointments/${id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to cancel appointment.");
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "CANCELED",
              }
            : appointment,
        ),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to cancel appointment.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {error ? <p className="section-copy">{error}</p> : null}
      {appointments.length === 0 ? <p className="section-copy">No appointments yet.</p> : null}
      <div className="grid">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="card">
            <h2>{appointment.service.name}</h2>
            <p className="card-subtitle">{appointment.service.durationMinutes} minutes</p>
            <p>{formatDateTime(appointment.startAt)}</p>
            <p>Status: {appointment.status}</p>
            {ownerView ? (
              <p>
                Client: {appointment.user.name ?? "Unnamed"} ({appointment.user.email})
              </p>
            ) : null}
            {appointment.cancelReason ? <p>Reason: {appointment.cancelReason}</p> : null}
            {appointment.status === "BOOKED" ? (
              <div className="actions" style={{ marginTop: "0.75rem" }}>
                <button
                  className="button"
                  type="button"
                  onClick={() => cancelAppointment(appointment.id)}
                  disabled={busyId === appointment.id}
                >
                  {busyId === appointment.id ? "Canceling..." : "Cancel"}
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}
