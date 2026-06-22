import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peak Recovery Massage | Florida Massage & Scheduling",
  description:
    "Peak Recovery Massage is a Florida-based massage website with service details, recovery-focused brand content, and a built-in online scheduler.",
  keywords: [
    "Peak Recovery Massage",
    "Florida massage therapy",
    "sports massage",
    "deep tissue massage",
    "massage scheduling website",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
