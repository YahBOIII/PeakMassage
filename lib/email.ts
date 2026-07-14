import "server-only";
import nodemailer from "nodemailer";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

function getNotificationEmail(): string {
  return (
    process.env.NOTIFICATION_EMAIL ??
    process.env.OWNER_EMAIL ??
    ""
  );
}

export async function sendGuestBookingNotification(params: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceName: string;
  startAt: Date;
}) {
  const notificationEmail = getNotificationEmail();

  if (!notificationEmail || !process.env.SMTP_HOST) {
    return;
  }

  const { guestName, guestEmail, guestPhone, serviceName, startAt } = params;

  const formattedDate = startAt.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });

  const transport = createTransport();

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? notificationEmail,
    to: notificationEmail,
    subject: `New Appointment: ${guestName} – ${serviceName}`,
    text: [
      "A new appointment has been booked.",
      "",
      `Name:    ${guestName}`,
      `Email:   ${guestEmail}`,
      `Phone:   ${guestPhone}`,
      `Service: ${serviceName}`,
      `Time:    ${formattedDate}`,
    ].join("\n"),
    html: `
      <p>A new appointment has been booked.</p>
      <table cellpadding="4" style="border-collapse:collapse">
        <tr><th align="left">Name</th><td>${guestName}</td></tr>
        <tr><th align="left">Email</th><td>${guestEmail}</td></tr>
        <tr><th align="left">Phone</th><td>${guestPhone}</td></tr>
        <tr><th align="left">Service</th><td>${serviceName}</td></tr>
        <tr><th align="left">Time</th><td>${formattedDate}</td></tr>
      </table>
    `,
  });
}
