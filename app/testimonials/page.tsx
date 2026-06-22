import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read client success stories and feedback from Peak Recovery Massage clients.",
};

export default function TestimonialsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Testimonials</h1>
        <div className="grid">
          <article className="card">
            <h2>Review 1</h2>
            <p>[TBD]</p>
          </article>
          <article className="card">
            <h2>Review 2</h2>
            <p>[TBD]</p>
          </article>
          <article className="card">
            <h2>Review 3</h2>
            <p>[TBD]</p>
          </article>
        </div>
      </div>
    </section>
  );
}
