export const siteContent = {
  businessName: "Peak Recovery Massage",
  shortName: "Peak Recovery",
  tagLine: "Massage therapy built for recovery, performance, and everyday relief.",
  description:
    "Peak Recovery Massage is a Florida-based massage brand focused on helping active adults, athletes, and hardworking professionals move better, recover faster, and feel their best.",
  primaryCta: "Book your session",
  secondaryCta: "Explore services",
  contact: {
    phone: "(555) 555-0198",
    email: "hello@peakrecoverymassage.com",
    location: "Florida, by appointment",
    hours: "Monday-Saturday · 9:00 AM-6:00 PM ET",
  },
  stats: [
    { value: "60 min", label: "Targeted recovery sessions" },
    { value: "6 days", label: "Weekly booking availability" },
    { value: "4 services", label: "Recovery-focused treatment options" },
    { value: "1 goal", label: "Help every client feel and move better" },
  ],
  highlights: [
    "Performance-minded sessions for runners, lifters, golfers, and active professionals",
    "Recovery plans designed around tension relief, mobility gains, and body maintenance",
    "Clear online scheduling flow with instant appointment confirmation",
  ],
  process: [
    {
      title: "Choose the recovery goal",
      description:
        "Select the session that best matches what your body needs right now—deep relief, sports recovery, mobility support, or restorative care.",
    },
    {
      title: "Pick an open Florida appointment",
      description:
        "Review upcoming availability, lock in your session time, and share any areas of concern before you arrive.",
    },
    {
      title: "Walk out moving better",
      description:
        "Every session is designed to reduce tension, improve range of motion, and support consistent recovery between workouts and long workdays.",
    },
  ],
  audiences: [
    "Athletes training through weekly soreness",
    "Desk workers managing neck, shoulder, and low-back tension",
    "Parents and professionals who need reliable recovery time",
    "Anyone ready for bodywork that feels focused and results-driven",
  ],
  benefits: [
    {
      title: "Recovery-first treatments",
      description:
        "Every appointment is shaped around reducing stiffness, restoring movement, and helping you bounce back faster.",
    },
    {
      title: "Straightforward booking",
      description:
        "Clients can choose a service, claim an open time, and receive a confirmation without the usual back-and-forth.",
    },
    {
      title: "Florida-friendly brand presence",
      description:
        "The site is built for a modern local business with clear services, trust-building content, and a booking flow ready for Vercel deployment.",
    },
  ],
  testimonials: [
    {
      quote:
        "The session felt intentional from start to finish. My shoulders finally loosened up and I moved better the next day.",
      author: "Jordan M.",
      role: "Strength training client",
    },
    {
      quote:
        "Peak Recovery gives you the structure of a recovery plan, not just a relaxing hour. Booking online was easy too.",
      author: "Taylor R.",
      role: "Weekend runner",
    },
    {
      quote:
        "Exactly the kind of massage experience busy professionals need—focused work, clear communication, and noticeable relief.",
      author: "Avery K.",
      role: "Office professional",
    },
  ],
  faqs: [
    {
      question: "Do I need to call before booking?",
      answer:
        "No. The website includes a built-in scheduling flow so clients can reserve an open appointment online and add session notes ahead of time.",
    },
    {
      question: "What should I book if I am not sure what I need?",
      answer:
        "Start with the Signature Recovery Massage. It is a versatile session that works well for general tension, maintenance, and post-workout recovery.",
    },
    {
      question: "Are times shown in Florida time?",
      answer:
        "Yes. Appointment availability is presented in Eastern Time to match the primary Florida booking schedule used by the site.",
    },
    {
      question: "Can this booking system be hosted on Vercel?",
      answer:
        "Yes. The project is built with Next.js for Vercel, and the scheduler supports durable booking storage when a database connection is configured.",
    },
  ],
} as const;
