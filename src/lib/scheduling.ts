export type BookingService = {
  slug: string;
  name: string;
  price: string;
  durationLabel: string;
  description: string;
};

export type AppointmentRecord = {
  fullName: string;
  email: string;
  phone: string;
  serviceSlug: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string | null;
  createdAt: string;
};

export type ScheduleSlot = {
  time: string;
  label: string;
};

export type ScheduleDay = {
  date: string;
  label: string;
  slots: ScheduleSlot[];
};

const bookingWindowDays = 21;

const operatingHours: Record<number, { openHour: number; closeHour: number } | null> = {
  0: null,
  1: { openHour: 9, closeHour: 18 },
  2: { openHour: 9, closeHour: 18 },
  3: { openHour: 9, closeHour: 18 },
  4: { openHour: 9, closeHour: 18 },
  5: { openHour: 9, closeHour: 18 },
  6: { openHour: 9, closeHour: 15 },
};

export const bookingServices: BookingService[] = [
  {
    slug: "signature-recovery",
    name: "Signature Recovery Massage",
    price: "$135",
    durationLabel: "60 minutes",
    description: "A balanced full-body session for post-workout recovery, circulation, and tension relief.",
  },
  {
    slug: "deep-tissue-reset",
    name: "Deep Tissue Reset",
    price: "$145",
    durationLabel: "60 minutes",
    description: "Focused pressure for stubborn tightness in the back, hips, glutes, shoulders, and calves.",
  },
  {
    slug: "sports-performance",
    name: "Sports Performance Massage",
    price: "$150",
    durationLabel: "60 minutes",
    description: "Targeted bodywork for athletes who need better mobility, movement quality, and recovery support.",
  },
  {
    slug: "stretch-and-restore",
    name: "Stretch & Restore",
    price: "$125",
    durationLabel: "60 minutes",
    description: "Assisted stretching and lighter tissue work to reduce stiffness and improve everyday range of motion.",
  },
];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function getBookingWindowDays() {
  return bookingWindowDays;
}

export function getDateLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00.000Z`));
}

export function getTimeLabel(time: string) {
  const [hoursText, minutesText] = time.split(":");
  const hours = Number(hoursText);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;

  return `${normalizedHour}:${minutesText} ${suffix}`;
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function createSlot(hour: number): ScheduleSlot {
  const time = `${pad(hour)}:00`;

  return {
    time,
    label: getTimeLabel(time),
  };
}

export function listUpcomingSchedule(days = bookingWindowDays): ScheduleDay[] {
  const schedule: ScheduleDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const hours = operatingHours[date.getDay()];

    if (!hours) {
      continue;
    }

    const slots: ScheduleSlot[] = [];

    for (let hour = hours.openHour; hour < hours.closeHour; hour += 1) {
      slots.push(createSlot(hour));
    }

    const dateKey = toDateKey(date);
    schedule.push({
      date: dateKey,
      label: getDateLabel(dateKey),
      slots,
    });
  }

  return schedule;
}

export function listOpenSchedule(appointments: AppointmentRecord[], days = bookingWindowDays) {
  const bookedSlots = new Set(
    appointments.map((appointment) => `${appointment.appointmentDate}-${appointment.appointmentTime}`),
  );

  return listUpcomingSchedule(days).map((day) => ({
    ...day,
    slots: day.slots.filter((slot) => !bookedSlots.has(`${day.date}-${slot.time}`)),
  }));
}

export function isBookableTime(appointmentDate: string, appointmentTime: string) {
  return listUpcomingSchedule().some(
    (day) =>
      day.date === appointmentDate &&
      day.slots.some((slot) => slot.time === appointmentTime),
  );
}

export function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidTime(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

export function findService(serviceSlug: string) {
  return bookingServices.find((service) => service.slug === serviceSlug);
}
