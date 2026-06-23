import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { brandName, sessionOptions, tagline } from "./site-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} | ${tagline}`,
    template: `%s | ${brandName}`,
  },
  description:
    "Reduce pain, improve mobility, and recover from the demands of work, training, and everyday life with recovery-focused bodywork.",
  keywords: [
    "Recovery Massage",
    "Massage Therapy",
    "Deep Tissue Work",
    "Assisted Stretching",
    "Cupping",
    "Mobility-Focused Bodywork",
  ],
  openGraph: {
    title: brandName,
    description:
      "Recovery-focused bodywork for athletes, active adults, and anyone dealing with pain, tightness, or mobility restrictions.",
    url: siteUrl,
    siteName: brandName,
    type: "website",
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/book-appointment", label: "Book Now" },
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
              <span className="brand-name">{brandName}</span>
              <span className="brand-tagline">{tagline}</span>
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
              <h3>{brandName}</h3>
              <p>{tagline}</p>
              <p>Individualized sessions for pain relief, mobility, and recovery.</p>
            </section>
            <section>
              <h3>Session Options</h3>
              <ul className="footer-list">
                {sessionOptions.map((option) => (
                  <li key={option.duration}>
                    Recovery Massage ({option.duration}) — {option.price}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Explore</h3>
              <ul className="footer-list">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} {brandName}. All Rights Reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
