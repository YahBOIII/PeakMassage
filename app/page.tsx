import Link from "next/link";

const services = [
  {
    name: "Peak Recovery Massage",
    details: "60 Minutes — $95 | 90 Minutes — $135",
    description:
      "Focused recovery treatment designed to reduce muscle tension, improve circulation, and accelerate recovery.",
  },
  {
    name: "Sports Massage",
    details: "60 Minutes — $100 | 90 Minutes — $145",
    description:
      "Performance-oriented treatment for athletes seeking improved mobility, flexibility, and recovery.",
  },
  {
    name: "Deep Tissue Massage",
    details: "60 Minutes — $100 | 90 Minutes — $145",
    description:
      "Targeted pressure to address chronic tension, muscular dysfunction, and restricted movement.",
  },
  {
    name: "Mobility & Stretch Therapy",
    details: "45 Minutes — $75 | 60 Minutes — $95",
    description:
      "Assisted stretching and mobility work designed to improve range of motion and movement quality.",
  },
];

const faqs = [
  {
    question: "Who is Peak Recovery Massage for?",
    answer:
      "Athletes, active adults, professionals, older adults, and anyone seeking pain reduction or mobility support.",
  },
  {
    question: "Do you accept walk-ins?",
    answer: "No. Services are provided by appointment only.",
  },
  {
    question: "What should I expect from my first session?",
    answer:
      "A consultation, tailored treatment plan, and focused therapy aligned to your recovery and performance goals.",
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Peak Recovery Massage",
  description:
    "Premium massage therapy and recovery-focused wellness services in Florida.",
  telephone: "[TBD]",
  email: "[TBD]",
  address: {
    "@type": "PostalAddress",
    streetAddress: "[TBD]",
    addressLocality: "[TBD]",
    addressRegion: "FL",
    postalCode: "[TBD]",
    addressCountry: "US",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Move Better. Recover Faster. Perform at Your Peak.</h1>
          <p>
            Professional recovery-focused massage therapy designed for athletes,
            active adults, and anyone looking to reduce pain, improve mobility,
            and optimize performance.
          </p>
          <div className="actions">
            <Link className="button primary" href="/book-appointment">
              Book Appointment
            </Link>
            <Link className="button" href="/services">
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Services Overview</h2>
          <div className="grid">
            {services.map((service) => (
              <article className="card" key={service.name}>
                <h3>{service.name}</h3>
                <p>{service.details}</p>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid">
          <article className="card">
            <h2>About Mason Centers</h2>
            <p>
              Mason Centers is dedicated to helping clients achieve optimal
              physical performance, recovery, and wellness through personalized
              massage therapy and mobility-focused treatment plans.
            </p>
            <p>
              Peak Recovery Massage was founded with a mission to help people
              move better, recover faster, and live pain-free through
              evidence-based therapeutic care.
            </p>
          </article>
          <article className="card">
            <h2>Benefits</h2>
            <ul>
              <li>Reduced pain and muscular tension</li>
              <li>Improved flexibility and mobility</li>
              <li>Faster workout and injury recovery</li>
              <li>Better movement quality and longevity</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Testimonials</h2>
          <div className="grid">
            <article className="card">Review 1: [TBD]</article>
            <article className="card">Review 2: [TBD]</article>
            <article className="card">Review 3: [TBD]</article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container card">
          <h2>Ready to Recover Smarter?</h2>
          <p>
            Book your appointment and start a targeted recovery plan built for
            your goals.
          </p>
          <div className="actions">
            <Link className="button primary" href="/book-appointment">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq) => (
            <article className="faq-item" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
