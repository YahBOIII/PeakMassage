import type { Metadata } from "next";
import {
  aboutSummary,
  benefits,
  brandName,
  commonIssues,
  sessionIncludes,
  targetAudience,
} from "../site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Peak Recovery helps people reduce pain, improve mobility, and recover with individualized bodywork.",
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">About {brandName}</h1>
        <p className="section-copy">{aboutSummary}</p>
        <div className="grid">
          <article className="card">
            <h2>Our Approach</h2>
            <p>
              Peak Recovery is built around individualized sessions that support
              pain relief, mobility, recovery, and better day-to-day movement.
            </p>
          </article>
          <article className="card">
            <h2>Mission</h2>
            <p>
              Help people reduce pain, improve mobility, and recover from the
              demands of work, training, and everyday life.
            </p>
          </article>
          <article className="card">
            <h2>Sessions May Include</h2>
            <ul className="list">
              {sessionIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>Who We Help</h2>
            <ul className="tag-list">
              {targetAudience.map((audience) => (
                <li key={audience}>{audience}</li>
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
          <article className="card">
            <h2>Benefits</h2>
            <ul className="list">
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
