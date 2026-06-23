import type { Metadata } from "next";
import Link from "next/link";
import { brandName, commonIssues, targetAudience } from "../site-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Peak Recovery for service questions and next steps before booking your recovery session.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Contact</h1>
        <p className="section-copy">
          Have questions before you book? {brandName} works with athletes,
          active adults, and anyone dealing with pain, tightness, or mobility
          restrictions.
        </p>
        <div className="grid">
          <article className="card">
            <h2>Who We Help</h2>
            <ul className="tag-list">
              {targetAudience.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>What We May Help With</h2>
            <ul className="list">
              {commonIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>Ready to Book?</h2>
            <p>
              Explore session pricing, choose the appointment length that fits
              your needs, and book a recovery-focused session built around your
              goals.
            </p>
            <div className="actions" style={{ marginTop: "1rem" }}>
              <Link className="button primary" href="/book-appointment">
                Book Now
              </Link>
              <Link className="button" href="/pricing">
                View Pricing
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
