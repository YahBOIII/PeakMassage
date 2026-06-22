import { BookingForm } from "@/components/booking-form";
import { siteContent } from "@/lib/site-content";
import { bookingServices } from "@/lib/scheduling";

export default function Home() {
  return (
    <main className="bg-slate-950 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.18),_transparent_30%)]" />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-20 pt-6 sm:px-8 lg:px-10">
          <header className="sticky top-4 z-20 rounded-full border border-white/10 bg-slate-950/70 px-5 py-4 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-semibold">{siteContent.businessName}</p>
                <p className="text-sm text-slate-300">{siteContent.tagLine}</p>
              </div>
              <nav className="flex flex-wrap gap-3 text-sm text-slate-200">
                <a href="#services" className="rounded-full px-3 py-2 transition hover:bg-white/10">
                  Services
                </a>
                <a href="#benefits" className="rounded-full px-3 py-2 transition hover:bg-white/10">
                  Why Peak Recovery
                </a>
                <a href="#schedule" className="rounded-full px-3 py-2 transition hover:bg-white/10">
                  Schedule
                </a>
                <a href="#faq" className="rounded-full px-3 py-2 transition hover:bg-white/10">
                  FAQ
                </a>
              </nav>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-16 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">
                Florida-based recovery massage
              </p>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Feel looser, move cleaner, and recover with purpose.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                {siteContent.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#schedule"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                >
                  {siteContent.primaryCta}
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {siteContent.secondaryCta}
                </a>
              </div>

              <ul className="mt-10 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
                {siteContent.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="rounded-3xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_30px_80px_rgba(8,47,73,0.3)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                What clients can expect
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {siteContent.stats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-100">Service area</p>
                <p className="mt-3 text-xl font-semibold text-white">{siteContent.contact.location}</p>
                <p className="mt-2 text-sm leading-6 text-cyan-50">
                  This site is ready for Vercel deployment and built to support a modern online
                  booking experience for a Florida massage business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Services
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Recovery-focused sessions built for real life and training.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Every offering is designed around body awareness, tension relief, and practical
            recovery benefits clients can feel after the appointment ends.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {bookingServices.map((service) => (
            <article
              key={service.slug}
              className="rounded-[2rem] border border-white/10 bg-white/6 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{service.name}</h3>
                  <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                    {service.description}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-cyan-100">
                  {service.price}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-sm text-slate-300">
                <span>{service.durationLabel}</span>
                <a href="#schedule" className="font-semibold text-cyan-200 transition hover:text-white">
                  Book this service
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="benefits" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Why Peak Recovery
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              A clean, premium website experience that supports trust and bookings.
            </h2>
            <p className="text-lg leading-8 text-slate-300">
              This website combines strong service positioning with a clear path to scheduling so
              visitors can understand the brand and take action right away.
            </p>
            <ul className="grid gap-3 text-base text-slate-200">
              {siteContent.audiences.map((audience) => (
                <li
                  key={audience}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4"
                >
                  {audience}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5">
            {siteContent.benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-7"
              >
                <h3 className="text-2xl font-semibold text-white">{benefit.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-300">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {siteContent.process.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[2rem] border border-white/10 bg-white/6 p-8 backdrop-blur"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Step {index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-300">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-8 backdrop-blur lg:p-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {siteContent.testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.author}
                className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-6"
              >
                <p className="text-base leading-7 text-slate-200">“{testimonial.quote}”</p>
                <footer className="mt-5">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="schedule" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <BookingForm />
      </section>

      <section id="faq" className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">FAQ</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Common questions before clients book.
          </h2>
        </div>

        <div className="mt-10 grid gap-5">
          {siteContent.faqs.map((faq) => (
            <article key={faq.question} className="rounded-[2rem] border border-white/10 bg-white/6 p-7">
              <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
              <p className="mt-3 max-w-4xl text-base leading-7 text-slate-300">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-10">
          <div>
            <p className="text-2xl font-semibold text-white">{siteContent.businessName}</p>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              {siteContent.tagLine}
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-300">
            <a href={`tel:${siteContent.contact.phone}`} className="transition hover:text-cyan-200">
              {siteContent.contact.phone}
            </a>
            <a
              href={`mailto:${siteContent.contact.email}`}
              className="transition hover:text-cyan-200"
            >
              {siteContent.contact.email}
            </a>
            <p>{siteContent.contact.location}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
