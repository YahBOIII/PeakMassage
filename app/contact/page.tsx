import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Peak Recovery Massage for appointments, location details, and service questions.",
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Contact</h1>
        <div className="grid">
          <article className="card">
            <h2>Get in Touch</h2>
            <p>Phone: [TBD]</p>
            <p>Email: [TBD]</p>
            <p>Address: [TBD]</p>
          </article>
          <article className="card">
            <h2>Contact Form</h2>
            <p>Contact form placeholder. [TBD]</p>
          </article>
          <article className="card">
            <h2>Google Maps</h2>
            <p>Google Maps embed placeholder. [TBD]</p>
          </article>
        </div>
      </div>
    </section>
  );
}
