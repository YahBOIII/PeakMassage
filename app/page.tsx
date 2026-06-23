import Link from "next/link";
import {
  aboutSummary,
  benefits,
  brandName,
  commonIssues,
  sessionIncludes,
  sessionOptions,
  tagline,
  targetAudience,
} from "./site-content";

const faqs = [
  {
    question: `Who is ${brandName} for?`,
    answer:
      "Peak Recovery is built for athletes, active adults, martial artists, court sport athletes, lifters, runners, rock climbers, and anyone dealing with pain, tightness, or mobility restrictions.",
  },
  {
    question: "What may be included in a session?",
    answer:
      "Sessions are tailored to the individual and may include massage therapy, deep tissue work, assisted stretching, scraping (IASTM), cupping, and mobility-focused bodywork.",
  },
  {
    question: "What can this work help with?",
    answer:
      "Recovery-focused sessions may help address headaches and migraines, sciatica-related discomfort, neck and shoulder pain, low back pain, hip tightness, muscle tension, mobility restrictions, and stress-related tightness.",
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: brandName,
  description: aboutSummary,
  slogan: tagline,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Recovery Massage Sessions",
    itemListElement: sessionOptions.map((option) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `Recovery Massage (${option.duration})`,
        description: option.description,
      },
      price: option.price.replace("$", ""),
      priceCurrency: "USD",
    })),
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
        <p className="eyebrow">{tagline}</p>
        <h1>Reduce pain, improve mobility, and recover with purpose.</h1>
        <p>
          {aboutSummary}
        </p>
        <div className="actions">
          <Link className="button primary" href="/book-appointment">
            Book Now
          </Link>
          <Link className="button" href="/pricing">
            View Pricing
          </Link>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <h2>Recovery Massage Sessions</h2>
        <p className="section-copy">
          Choose the session length that fits your needs. Every appointment is
          tailored to your goals, movement demands, and recovery priorities.
        </p>
        <div className="grid">
          {sessionOptions.map((service) => (
            <article className="card" key={service.duration}>
              <h3>Recovery Massage</h3>
              <p className="card-subtitle">{service.duration}</p>
              <p className="price">{service.price}</p>
              <p>{service.description}</p>
            </article>
          ))}
          <article className="card">
            <h3>Sessions May Include</h3>
            <ul className="list">
              {sessionIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <h2>Built for Real Recovery</h2>
        <div className="grid">
          <article className="card">
            <h3>About {brandName}</h3>
            <p>{aboutSummary}</p>
          </article>
          <article className="card">
            <h3>Who We Help</h3>
            <ul className="tag-list">
              {targetAudience.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>Common Issues We May Help With</h3>
            <ul className="list">
              {commonIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>Benefits</h3>
            <ul className="list">
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container card">
        <h2>Ready to recover smarter?</h2>
        <p>
          Book a recovery-focused session designed around your pain points,
          mobility restrictions, training demands, and day-to-day recovery.
        </p>
        <div className="actions">
          <Link className="button primary" href="/book-appointment">
            Book Now
          </Link>
          <Link className="button" href="/contact">
            Contact Peak Recovery
          </Link>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <article className="faq-item card" key={faq.question}>
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
