import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import BookingWidget from "@/app/components/BookingWidget";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Book Now",
  description:
    "Book a Peak Recovery session and choose the recovery massage length that best fits your needs.",
};

const DYNAMIC_SERVER_USAGE_DIGEST = "DYNAMIC_SERVER_USAGE";

function isDynamicServerError(error: unknown): error is { digest: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    (error as { digest?: string }).digest === DYNAMIC_SERVER_USAGE_DIGEST
  );
}

export default async function BookAppointmentPage() {
  let isAuthenticated = false;

  try {
    const session = await getServerSession(authOptions);
    isAuthenticated = Boolean(session?.user?.id);
  } catch (error) {
    if (!isDynamicServerError(error)) {
      console.error("Failed to load session on book appointment page.", error);
    }
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
