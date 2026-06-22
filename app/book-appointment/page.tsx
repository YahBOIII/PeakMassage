import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book a recovery-focused massage session through our mobile-friendly scheduling experience.",
};

export default function BookAppointmentPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Book Appointment</h1>
        <article className="card">
          <p>
            A Vercel-hosted booking system is planned for this page with service
            selection, calendar availability, appointment confirmation, and
            email notifications.
          </p>
          <p>
            Suggested implementation stack: Next.js, PostgreSQL, Prisma,
            NextAuth, Resend, and Stripe.
          </p>
          <p>
            Booking Link: <strong>[TBD]</strong>
          </p>
        </article>
      </div>
    </section>
  );
}
