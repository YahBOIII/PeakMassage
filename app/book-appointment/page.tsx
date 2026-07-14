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
  let isAuthenticated = false;

  try {
    const session = await getServerSession(authOptions);
    isAuthenticated = Boolean(session?.user?.id);
  } catch {
    isAuthenticated = false;
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Book Now</h1>
        <p className="section-copy">
          Choose your session length, pick a date, and reserve an available time block.
        </p>
        <BookingWidget isAuthenticated={isAuthenticated} />
      </div>
    </section>
  );
}
