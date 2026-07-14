"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to create account.");
      return;
    }

    router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/book-appointment")}`);
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Create Account</h1>
        <article className="card" style={{ maxWidth: "500px" }}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={{
                width: "100%",
                margin: "0.5rem 0 1rem",
                padding: "0.6rem",
                background: "#0a0d12",
                border: "1px solid #263244",
                color: "#fff",
                borderRadius: "8px",
              }}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{
                width: "100%",
                margin: "0.5rem 0 1rem",
                padding: "0.6rem",
                background: "#0a0d12",
                border: "1px solid #263244",
                color: "#fff",
                borderRadius: "8px",
              }}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{
                width: "100%",
                margin: "0.5rem 0 1rem",
                padding: "0.6rem",
                background: "#0a0d12",
                border: "1px solid #263244",
                color: "#fff",
                borderRadius: "8px",
              }}
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              style={{
                width: "100%",
                margin: "0.5rem 0 1rem",
                padding: "0.6rem",
                background: "#0a0d12",
                border: "1px solid #263244",
                color: "#fff",
                borderRadius: "8px",
              }}
            />

            {error ? <p className="section-copy">{error}</p> : null}

            <div className="actions">
              <button type="submit" className="button primary" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
              <Link className="button" href="/auth/signin">
                Back to sign in
              </Link>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}
