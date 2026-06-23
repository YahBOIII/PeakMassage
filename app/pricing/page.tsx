import type { Metadata } from "next";
import Link from "next/link";
import { sessionIncludes, sessionOptions } from "../site-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "View Peak Recovery pricing for 60-minute and 75-minute recovery massage sessions.",
};

export default function PricingPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Pricing</h1>
        <p className="section-copy">
          Transparent pricing for recovery-focused bodywork. Every session is
          tailored to your goals and may include a blend of hands-on recovery
          techniques.
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
        <div className="actions" style={{ marginTop: "1rem" }}>
          <Link className="button primary" href="/book-appointment">
            Book Now
          </Link>
          <Link className="button" href="/services">
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
