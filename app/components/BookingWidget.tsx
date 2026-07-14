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

export default function BookingWidget({ isAuthenticated }: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(toDateInputValue(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("error");

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
        setMessageType("error");
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
        setMessageType("error");
      } finally {
        setIsCheckingAvailability(false);
      }
    }

    loadAvailability().catch(() => undefined);
  }, [date, serviceId]);

  async function bookAppointment() {
    if (!selectedSlot || !serviceId) {
      setMessage("Please select a time slot.");
      setMessageType("error");
      return;
    }

    setIsBooking(true);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          startAt: selectedSlot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create appointment.");
      }

      setMessage("Appointment booked successfully.");
      setMessageType("success");
      setSelectedSlot("");

      const availabilityResponse = await fetch(
        `/api/availability?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`,
        { cache: "no-store" },
      );
      const availabilityData = await availabilityResponse.json();

      if (availabilityResponse.ok) {
        setSlots(availabilityData.slots as string[]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create appointment.");
      setMessageType("error");
    } finally {
      setIsBooking(false);
    }
  }

  async function bookGuestAppointment() {
    if (!selectedSlot || !serviceId) {
      setMessage("Please select a time slot.");
      setMessageType("error");
      return;
    }

    if (!guestName.trim()) {
      setMessage("Please enter your first name.");
      setMessageType("error");
      return;
    }

    if (!guestEmail.trim()) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    if (!guestPhone.trim()) {
      setMessage("Please enter your phone number.");
      setMessageType("error");
      return;
    }

    setIsBooking(true);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      setMessage("Appointment booked! We will be in touch to confirm.");
      setMessageType("success");
      setSelectedSlot("");
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");

      const availabilityResponse = await fetch(
        `/api/availability?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`,
        { cache: "no-store" },
      );
      const availabilityData = await availabilityResponse.json();

      if (availabilityResponse.ok) {
        setSlots(availabilityData.slots as string[]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create appointment.");
      setMessageType("error");
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return <p className="section-copy">Loading booking options...</p>;
  }

  return (
    <>
      {message ? (
        <p className="section-copy" style={{ color: messageType === "success" ? "#4caf50" : undefined }}>
          {message}
        </p>
      ) : null}
      {services.length > 0 ? (
        <article className="card" style={{ marginBottom: "1rem" }}>
          <h2>Select Service</h2>
          <div className="actions" style={{ marginBottom: "1rem" }}>
            {services.map((service) => (
              <button
                key={service.id}
                className={`button${service.id === serviceId ? " primary" : ""}`}
                type="button"
                onClick={() => setServiceId(service.id)}
              >
                {service.durationMinutes} Minutes
              </button>
            ))}
          </div>
          <label htmlFor="booking-date">Date</label>
          <input
            id="booking-date"
            type="date"
            value={date}
            min={toDateInputValue(new Date())}
            onChange={(event) => setDate(event.target.value)}
            style={{
              background: "#0a0d12",
              border: "1px solid #263244",
              borderRadius: "8px",
              color: "#ffffff",
              marginTop: "0.5rem",
              padding: "0.5rem",
            }}
          />
        </article>
      ) : null}

      <article className="card">
        <h2>Available Time Blocks</h2>
        {selectedService ? (
          <p className="section-copy">{selectedService.durationMinutes}-minute appointments shown in 15-minute starts.</p>
        ) : null}
        {isCheckingAvailability ? <p className="section-copy">Checking availability...</p> : null}
        {!isCheckingAvailability && slots.length === 0 ? (
          <p className="section-copy">No available slots for this date.</p>
        ) : null}
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

        {isAuthenticated ? (
          <div className="actions" style={{ marginTop: "1rem" }}>
            <button
              className="button primary"
              type="button"
              onClick={bookAppointment}
              disabled={!selectedSlot || isBooking}
            >
              {isBooking ? "Booking..." : "Book Appointment"}
            </button>
            <Link className="button" href="/appointments">
              View My Appointments
            </Link>
          </div>
        ) : (
          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Your Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "400px" }}>
              <div>
                <label htmlFor="guest-name" style={{ display: "block", marginBottom: "0.25rem" }}>
                  First Name
                </label>
                <input
                  id="guest-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Jane"
                  style={{
                    background: "#0a0d12",
                    border: "1px solid #263244",
                    borderRadius: "8px",
                    color: "#ffffff",
                    padding: "0.5rem",
                    width: "100%",
                  }}
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
                  style={{
                    background: "#0a0d12",
                    border: "1px solid #263244",
                    borderRadius: "8px",
                    color: "#ffffff",
                    padding: "0.5rem",
                    width: "100%",
                  }}
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
                  style={{
                    background: "#0a0d12",
                    border: "1px solid #263244",
                    borderRadius: "8px",
                    color: "#ffffff",
                    padding: "0.5rem",
                    width: "100%",
                  }}
                />
              </div>
            </div>
            <div className="actions" style={{ marginTop: "1rem" }}>
              <button
                className="button primary"
                type="button"
                onClick={bookGuestAppointment}
                disabled={!selectedSlot || isBooking}
              >
                {isBooking ? "Booking..." : "Book Appointment"}
              </button>
            </div>
            <p className="section-copy" style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}>
              Already have an account?{" "}
              <Link href="/auth/signin" className="button">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </article>
    </>
  );
}

