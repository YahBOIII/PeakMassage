import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore recovery-focused massage and mobility services with transparent pricing and athlete-centered benefits.",
};

const services = [
  {
    name: "Peak Recovery Massage",
    durationPricing: [
      "60 Minutes — $95",
      "90 Minutes — $135",
    ],
    benefits: [
      "Reduces muscle tension",
      "Improves circulation",
      "Accelerates recovery",
    ],
  },
  {
    name: "Sports Massage",
    durationPricing: [
      "60 Minutes — $100",
      "90 Minutes — $145",
    ],
    benefits: [
      "Boosts mobility",
      "Supports flexibility",
      "Improves recovery between training sessions",
    ],
  },
  {
    name: "Deep Tissue Massage",
    durationPricing: [
      "60 Minutes — $100",
      "90 Minutes — $145",
    ],
    benefits: [
      "Targets chronic tension",
      "Addresses muscular dysfunction",
      "Supports restricted movement improvement",
    ],
  },
  {
    name: "Mobility & Stretch Therapy",
    durationPricing: [
      "45 Minutes — $75",
      "60 Minutes — $95",
    ],
    benefits: [
      "Improves range of motion",
      "Enhances movement quality",
      "Supports injury prevention",
    ],
  },
];

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Services</h1>
        <div className="grid">
          {services.map((service) => (
            <article className="card" key={service.name}>
              <h2>{service.name}</h2>
              <ul>
                {service.durationPricing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>Benefits</h3>
              <ul>
                {service.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article className="card" style={{ marginTop: "1rem" }}>
          <h2>FAQ</h2>
          <p>Q: Which service is best for recovery after intense training?</p>
          <p>
            A: Peak Recovery Massage or Sports Massage are ideal for
            post-training recovery depending on your specific goals.
          </p>
          <p>Q: Can treatment plans be personalized?</p>
          <p>
            A: Yes. Every appointment is personalized to your mobility,
            performance, and pain-relief goals.
          </p>
        </article>
      </div>
    </section>
  );
}
