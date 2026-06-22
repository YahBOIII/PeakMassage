import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Peak Recovery Massage | Recovery-Focused Massage Therapy",
    template: "%s | Peak Recovery Massage",
  },
  description:
    "Move better, recover faster, and perform at your peak with recovery-focused massage therapy in Florida.",
  keywords: [
    "Massage Therapy in Florida",
    "Sports Massage in Florida",
    "Deep Tissue Massage in Florida",
    "Recovery Massage in Florida",
    "Mobility Therapy in Florida",
  ],
  openGraph: {
    title: "Peak Recovery Massage",
    description:
      "Professional recovery-focused massage therapy for athletes, active adults, and wellness clients.",
    url: siteUrl,
    siteName: "Peak Recovery Massage",
    type: "website",
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/book-appointment", label: "Book Appointment" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container nav-wrap">
            <Link className="brand" href="/">
              Peak Recovery Massage
            </Link>
            <nav>
              <ul className="nav-list">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container footer-grid">
            <section>
              <h3>Peak Recovery Massage</h3>
              <p>By appointment only.</p>
            </section>
            <section>
              <h3>Contact</h3>
              <p>Phone: [TBD]</p>
              <p>Email: [TBD]</p>
              <p>Address: [TBD]</p>
            </section>
            <section>
              <h3>Follow</h3>
              <p>Social Links: [TBD]</p>
            </section>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} Peak Recovery Massage. All Rights Reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
