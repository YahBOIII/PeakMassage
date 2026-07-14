"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const callbackUrl = "/book-appointment";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Sign In</h1>
        <article className="card" style={{ maxWidth: "500px" }}>
          <form onSubmit={handleSubmit}>
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

            {error ? <p className="section-copy">{error}</p> : null}

            <div className="actions">
              <button type="submit" className="button primary" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
              <Link className="button" href="/auth/signup">
                Create account
              </Link>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}
