import type { Metadata } from "next";
import Link from "next/link";
import { sessionIncludes, sessionOptions } from "../site-content";

export const metadata: Metadata = {
  title: "Book Now",
  description:
    "Book a Peak Recovery session and choose the recovery massage length that best fits your needs.",
};

export default function BookAppointmentPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Book Now</h1>
        <p className="section-copy">
          Choose the session length that fits your goals. Peak Recovery offers
          individualized bodywork designed to reduce pain, improve mobility, and
          support faster recovery.
        </p>
        <div className="grid">
          {sessionOptions.map((option) => (
            <article className="card" key={option.duration}>
              <h2>Recovery Massage</h2>
              <p className="card-subtitle">{option.duration}</p>
              <p className="price">{option.price}</p>
              <p>{option.description}</p>
            </article>
          ))}
          <article className="card">
            <h2>Sessions May Include</h2>
            <ul className="list">
              {sessionIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <article className="card" style={{ marginTop: "1rem" }}>
          <h2>Need help choosing?</h2>
          <p>
            The 60-minute session is ideal for focused work. The 75-minute
            session gives you more time for deeper bodywork, multiple focus
            areas, or a broader recovery session.
          </p>
          <p>
            If you want to review pricing or learn more about the service before
            scheduling, visit the pages below.
          </p>
          <div className="actions">
            <Link className="button" href="/pricing">
              View Pricing
            </Link>
            <Link className="button" href="/contact">
              Contact
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
