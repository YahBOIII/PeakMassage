import type { Metadata } from "next";
import {
  aboutSummary,
  commonIssues,
  sessionIncludes,
  sessionOptions,
} from "../site-content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Peak Recovery services, session pricing, and the techniques used to support pain relief, mobility, and recovery.",
};

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Services</h1>
        <p className="section-copy">{aboutSummary}</p>
        <div className="grid">
          {sessionOptions.map((service) => (
            <article className="card" key={service.duration}>
              <h2>Recovery Massage</h2>
              <p className="card-subtitle">{service.duration}</p>
              <p className="price">{service.price}</p>
              <p>{service.description}</p>
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
          <article className="card">
            <h2>Common Issues We May Help With</h2>
            <ul className="list">
              {commonIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </article>
        </div>

        <article className="card" style={{ marginTop: "1rem" }}>
          <h2>FAQ</h2>
          <p>Q: Which session length is best for me?</p>
          <p>
            A: The 60-minute session is a great fit for focused work. The
            75-minute session allows more time for deeper bodywork, multiple
            areas, or a more complete recovery plan.
          </p>
          <p>Q: Can treatment plans be personalized?</p>
          <p>
            A: Yes. Every appointment is personalized to your mobility,
            recovery, and pain-relief goals.
          </p>
        </article>
      </div>
    </section>
  );
}
