"use client";

import { useEffect, useMemo, useState } from "react";

import { siteContent } from "@/lib/site-content";
import {
  bookingServices,
  getTimeLabel,
  listOpenSchedule,
  type AppointmentRecord,
  type ScheduleDay,
} from "@/lib/scheduling";

type SchedulerResponse = {
  schedule: ScheduleDay[];
  appointments: AppointmentRecord[];
  storageMode: "database" | "preview";
};

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  serviceSlug: bookingServices[0]?.slug ?? "",
  appointmentDate: "",
  appointmentTime: "",
  notes: "",
};

export function BookingForm() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [storageMode, setStorageMode] = useState<"database" | "preview">("preview");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadScheduler() {
      try {
        const response = await fetch("/api/appointments", { cache: "no-store" });
        const data = (await response.json()) as SchedulerResponse;

        setAppointments(data.appointments);
        setSchedule(data.schedule);
        setStorageMode(data.storageMode);
      } catch {
        setStatus({
          type: "error",
          message: "We could not load the appointment calendar. Please refresh and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    void loadScheduler();
  }, []);

  const openSchedule = useMemo(
    () => listOpenSchedule(appointments, schedule.length || undefined),
    [appointments, schedule.length],
  );

  useEffect(() => {
    if (openSchedule.length === 0) {
      return;
    }

    const activeDay =
      openSchedule.find((day) => day.date === form.appointmentDate && day.slots.length > 0) ??
      openSchedule.find((day) => day.slots.length > 0);

    if (!activeDay) {
      return;
    }

    const activeTime =
      activeDay.date === form.appointmentDate &&
      activeDay.slots.some((slot) => slot.time === form.appointmentTime)
        ? form.appointmentTime
        : activeDay.slots[0]?.time ?? "";

    setForm((current) => ({
      ...current,
      appointmentDate: activeDay.date,
      appointmentTime: activeTime,
      serviceSlug: current.serviceSlug || bookingServices[0]?.slug || "",
    }));
  }, [form.appointmentDate, form.appointmentTime, openSchedule]);

  const selectedDay =
    openSchedule.find((day) => day.date === form.appointmentDate) ?? openSchedule[0];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { message?: string; error?: string; storageMode?: "database" | "preview" };

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data.error ?? "We could not reserve that appointment. Please try again.",
        });
        return;
      }

      setStorageMode(data.storageMode ?? storageMode);
      setAppointments((current) => [
        ...current,
        {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          serviceSlug: form.serviceSlug,
          appointmentDate: form.appointmentDate,
          appointmentTime: form.appointmentTime,
          notes: form.notes.trim() || null,
          createdAt: new Date().toISOString(),
        },
      ]);
      setStatus({
        type: "success",
        message:
          data.message ??
          "Your appointment is booked. Watch for a confirmation follow-up from Peak Recovery Massage.",
      });
      setForm((current) => ({
        ...initialForm,
        serviceSlug: current.serviceSlug,
      }));
    } catch {
      setStatus({
        type: "error",
        message: "We could not submit your booking. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6 rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.2)] backdrop-blur">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Online scheduling
          </p>
          <h3 className="text-3xl font-semibold text-white">
            Reserve your next recovery session in minutes.
          </h3>
          <p className="max-w-2xl text-base leading-7 text-slate-200">
            Choose a service, claim an open appointment, and share any focus areas before you
            arrive. All availability is shown in Eastern Time.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {bookingServices.map((service) => {
            const isSelected = form.serviceSlug === service.slug;

            return (
              <button
                key={service.slug}
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    serviceSlug: service.slug,
                  }))
                }
                className={`rounded-3xl border p-5 text-left transition ${
                  isSelected
                    ? "border-cyan-300 bg-cyan-300/12 shadow-[0_16px_40px_rgba(34,211,238,0.18)]"
                    : "border-white/10 bg-slate-950/30 hover:border-cyan-400/40"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{service.name}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{service.description}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-100">
                    {service.price}
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-200">{service.durationLabel}</p>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/30 p-5 text-sm text-slate-200 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-white">Call or text</p>
            <a href={`tel:${siteContent.contact.phone}`} className="mt-2 block hover:text-cyan-200">
              {siteContent.contact.phone}
            </a>
          </div>
          <div>
            <p className="font-semibold text-white">Email</p>
            <a
              href={`mailto:${siteContent.contact.email}`}
              className="mt-2 block break-all hover:text-cyan-200"
            >
              {siteContent.contact.email}
            </a>
          </div>
          <div>
            <p className="font-semibold text-white">Hours</p>
            <p className="mt-2">{siteContent.contact.hours}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-white/10 bg-white p-8 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
              Book now
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Claim an open appointment</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {bookingServices.find((service) => service.slug === form.serviceSlug)?.durationLabel}
          </span>
        </div>

        {storageMode === "preview" ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            Preview mode is active. Add a <code className="font-semibold">DATABASE_URL</code> in
            Vercel for durable booking storage.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full name
            <input
              required
              value={form.fullName}
              onChange={(event) =>
                setForm((current) => ({ ...current, fullName: event.target.value }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500"
              placeholder="Your full name"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500"
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Phone
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500"
                placeholder="(555) 555-0198"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Appointment day
              <select
                required
                value={form.appointmentDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    appointmentDate: event.target.value,
                    appointmentTime:
                      openSchedule.find((day) => day.date === event.target.value)?.slots[0]?.time ??
                      "",
                  }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500"
                disabled={isLoading || openSchedule.length === 0}
              >
                {openSchedule
                  .filter((day) => day.slots.length > 0)
                  .map((day) => (
                    <option key={day.date} value={day.date}>
                      {day.label}
                    </option>
                  ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Appointment time
              <select
                required
                value={form.appointmentTime}
                onChange={(event) =>
                  setForm((current) => ({ ...current, appointmentTime: event.target.value }))
                }
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500"
                disabled={isLoading || !selectedDay}
              >
                {(selectedDay?.slots ?? []).map((slot) => (
                  <option key={slot.time} value={slot.time}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Session notes
            <textarea
              value={form.notes}
              onChange={(event) =>
                setForm((current) => ({ ...current, notes: event.target.value }))
              }
              className="min-h-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500"
              placeholder="Share any sore areas, training notes, or recovery goals."
              maxLength={500}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <p>
            Selected slot:{" "}
            <span className="font-semibold text-slate-950">
              {form.appointmentDate
                ? `${selectedDay?.label ?? form.appointmentDate} · ${getTimeLabel(
                    form.appointmentTime,
                  )}`
                : "Choose a date"}
            </span>
          </p>
          <p className="font-medium text-cyan-800">Florida schedule · Eastern Time</p>
        </div>

        {status.type !== "idle" ? (
          <div
            className={`mt-6 rounded-2xl px-4 py-3 text-sm leading-6 ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-900"
                : "bg-rose-50 text-rose-900"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || isLoading || openSchedule.every((day) => day.slots.length === 0)}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Reserving your appointment..." : "Reserve appointment"}
        </button>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          Need a different time or a custom recovery plan? Reach out at{" "}
          <a href={`mailto:${siteContent.contact.email}`} className="font-medium text-cyan-700">
            {siteContent.contact.email}
          </a>
          .
        </p>
      </form>
    </div>
  );
}
