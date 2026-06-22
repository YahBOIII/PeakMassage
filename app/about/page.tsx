import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Mason Centers, the mission, and the performance-focused philosophy behind Peak Recovery Massage.",
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">About Mason Centers</h1>
        <div className="grid">
          <article className="card">
            <h2>Bio</h2>
            <p>
              Mason Centers leads Peak Recovery Massage with a focus on helping
              clients train, recover, and live with better mobility.
            </p>
          </article>
          <article className="card">
            <h2>Mission</h2>
            <p>
              Help people move better, recover faster, and perform at their peak
              through evidence-based therapeutic care.
            </p>
          </article>
          <article className="card">
            <h2>Philosophy</h2>
            <p>
              Every session is individualized and designed around long-term
              performance, pain management, and physical longevity.
            </p>
          </article>
          <article className="card">
            <h2>Certifications & Experience</h2>
            <p>[TBD]</p>
          </article>
        </div>
      </div>
    </section>
  );
}
