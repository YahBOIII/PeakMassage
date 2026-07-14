"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
};

type Props = {
  isAuthenticated: boolean;
};

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatSlotLabel(slot: string) {
  return new Date(slot).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateLabel(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getBookingStep(params: {
  date: string;
  isCheckingAvailability: boolean;
  slots: string[];
  selectedSlot: string;
}): number {
  const { date, isCheckingAvailability, slots, selectedSlot } = params;
  if (!date || isCheckingAvailability) return 1;
  if (selectedSlot) return 3;
  if (slots.length > 0) return 2;
  return 1;
}

const inputStyle: React.CSSProperties = {
  background: "#0a0d12",
  border: "1px solid #263244",
  borderRadius: "8px",
  color: "#ffffff",
  padding: "0.5rem",
  width: "100%",
};

export default function BookingWidget({ isAuthenticated }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(toDateInputValue(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Guest fields
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) ?? null,
    [serviceId, services],
  );

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      setMessage(null);

      try {
        const response = await fetch("/api/services", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load services.");
        }

        const nextServices = data.services as Service[];
        setServices(nextServices);

        if (nextServices.length > 0) {
          setServiceId(nextServices[0].id);
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load services.");
      } finally {
        setIsLoading(false);
      }
    }

    loadServices().catch(() => undefined);
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      if (!serviceId || !date) {
        setSlots([]);
        return;
      }

      setIsCheckingAvailability(true);
      setMessage(null);
      setSelectedSlot("");

      try {
        const response = await fetch(
          `/api/availability?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`,
          { cache: "no-store" },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load availability.");
        }

        setSlots(data.slots as string[]);
      } catch (error) {
        setSlots([]);
        setMessage(error instanceof Error ? error.message : "Unable to load availability.");
      } finally {
        setIsCheckingAvailability(false);
      }
    }

    loadAvailability().catch(() => undefined);
  }, [date, serviceId]);

  async function bookAppointment() {
    if (!selectedSlot || !serviceId) {
      setMessage("Please select a time slot.");
      return;
    }

    setIsBooking(true);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, startAt: selectedSlot }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create appointment.");
      }

      setBooked(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create appointment.");
    } finally {
      setIsBooking(false);
    }
  }

  async function bookGuestAppointment() {
    if (!selectedSlot || !serviceId) {
      setMessage("Please select a time slot.");
      return;
    }

    if (!guestName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!guestEmail.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!guestPhone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    setIsBooking(true);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim(),
          serviceId,
          startAt: selectedSlot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create appointment.");
      }

      setBooked(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create appointment.");
    } finally {
      setIsBooking(false);
    }
  }

  function startOver() {
    setBooked(false);
    setSelectedSlot("");
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setMessage(null);
    setDate(toDateInputValue(new Date()));
  }

  if (isLoading) {
    return <p className="section-copy">Loading booking options…</p>;
  }

  // ── Confirmation screen ──────────────────────────────────────────────────────
  if (booked) {
    return (
      <article className="card" style={{ maxWidth: 480 }}>
        <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</p>
        <h2 style={{ marginBottom: "0.75rem" }}>You&apos;re booked!</h2>
        {selectedService && selectedSlot ? (
          <p className="section-copy" style={{ marginBottom: "0.5rem" }}>
            <strong>{selectedService.durationMinutes}-minute session</strong> on{" "}
            <strong>{formatDateLabel(date)}</strong> at{" "}
            <strong>{formatSlotLabel(selectedSlot)}</strong>.
          </p>
        ) : null}
        {isAuthenticated ? (
          <p className="section-copy">Your appointment has been confirmed.</p>
        ) : (
          <p className="section-copy">We&apos;ll be in touch to confirm your appointment.</p>
        )}
        <div className="actions" style={{ marginTop: "1.25rem" }}>
          <button className="button" type="button" onClick={startOver}>
            Book Another
          </button>
          {isAuthenticated ? (
            <Link className="button primary" href="/appointments">
              View My Appointments
            </Link>
          ) : null}
        </div>
      </article>
    );
  }

  const step = getBookingStep({ date, isCheckingAvailability, slots, selectedSlot });

  const stepLabelStyle: React.CSSProperties = {
    color: "#93c5fd",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 560 }}>
      {message ? (
        <p className="section-copy" style={{ color: "#f87171" }}>
          {message}
        </p>
      ) : null}

      {/* ── Step 1: Service + Date ─────────────────────────────────────────── */}
      <article className="card">
        <p style={stepLabelStyle}>
          Step 1 — Choose a date
        </p>
        {services.length > 0 ? (
          <>
            <p style={{ color: "#c0c0c0", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Session length</p>
            <div className="actions" style={{ marginBottom: "1rem" }}>
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`button${service.id === serviceId ? " primary" : ""}`}
                  type="button"
                  onClick={() => {
                    setServiceId(service.id);
                    setSelectedSlot("");
                  }}
                >
                  {service.durationMinutes} min
                </button>
              ))}
            </div>
          </>
        ) : null}
        <label htmlFor="booking-date" style={{ display: "block", marginBottom: "0.25rem" }}>
          Date
        </label>
        <input
          id="booking-date"
          type="date"
          value={date}
          min={toDateInputValue(new Date())}
          onChange={(event) => {
            setDate(event.target.value);
            setSelectedSlot("");
          }}
          style={{ ...inputStyle, marginTop: "0.25rem" }}
        />
      </article>

      {/* ── Step 2: Time slot ─────────────────────────────────────────────── */}
      {date ? (
        <article className="card">
          <p style={stepLabelStyle}>
            Step 2 — Pick a time
          </p>
          {selectedService ? (
            <p className="section-copy" style={{ marginBottom: "0.75rem" }}>
              {selectedService.durationMinutes}-minute slots on {formatDateLabel(date)}
            </p>
          ) : null}
          {isCheckingAvailability ? (
            <p className="section-copy">Checking availability…</p>
          ) : slots.length === 0 ? (
            <p className="section-copy">No available slots for this date. Try another day.</p>
          ) : (
            <div className="actions">
              {slots.map((slot) => (
                <button
                  key={slot}
                  className={`button${selectedSlot === slot ? " primary" : ""}`}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                >
                  {formatSlotLabel(slot)}
                </button>
              ))}
            </div>
          )}
        </article>
      ) : null}

      {/* ── Step 3: Details + Confirm ─────────────────────────────────────── */}
      {selectedSlot ? (
        <article className="card">
          <p style={stepLabelStyle}>
            Step 3 — Confirm booking
          </p>
          <p className="section-copy" style={{ marginBottom: "1rem" }}>
            {selectedService?.durationMinutes} min · {formatDateLabel(date)} · {formatSlotLabel(selectedSlot)}
          </p>

          {isAuthenticated ? (
            <div className="actions">
              <button
                className="button primary"
                type="button"
                onClick={bookAppointment}
                disabled={isBooking}
              >
                {isBooking ? "Booking…" : "Confirm Appointment"}
              </button>
              <Link className="button" href="/appointments">
                My Appointments
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label htmlFor="guest-name" style={{ display: "block", marginBottom: "0.25rem" }}>
                    Name
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Jane Smith"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="guest-phone" style={{ display: "block", marginBottom: "0.25rem" }}>
                    Phone Number
                  </label>
                  <input
                    id="guest-phone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="guest-email" style={{ display: "block", marginBottom: "0.25rem" }}>
                    Email
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="jane@example.com"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="actions">
                <button
                  className="button primary"
                  type="button"
                  onClick={bookGuestAppointment}
                  disabled={isBooking}
                >
                  {isBooking ? "Booking…" : "Confirm Appointment"}
                </button>
              </div>
              <p className="section-copy" style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}>
                Already have an account?{" "}
                <Link href="/auth/signin" className="button">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </article>
      ) : null}

      {/* Progress hint */}
      {step < 3 && !booked ? (
        <p style={{ color: "#6b7280", fontSize: "0.825rem" }}>
          {step === 1 ? "Select a session length and date to see available times." : "Choose a time slot to continue."}
        </p>
      ) : null}
    </div>
  );
}

