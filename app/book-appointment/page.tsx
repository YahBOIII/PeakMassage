import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import BookingWidget from "@/app/components/BookingWidget";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Book Now",
  description:
    "Book a Peak Recovery session and choose the recovery massage length that best fits your needs.",
};

export default async function BookAppointmentPage() {
  const session = await getServerSession(authOptions);

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Book Now</h1>
        <p className="section-copy">
          Choose your session length, pick a date, and reserve an available time block.
        </p>
        <BookingWidget isAuthenticated={Boolean(session?.user?.id)} />
      </div>
    </section>
  );
}
