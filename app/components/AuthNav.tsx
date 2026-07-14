"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    return (
      <li>
        <Link href="/auth/signin">Sign In</Link>
      </li>
    );
  }

  return (
    <>
      <li>
        <Link href="/appointments">My Appointments</Link>
      </li>
      {session.user.role === "OWNER" ? (
        <li>
          <Link href="/owner/appointments">Owner</Link>
        </li>
      ) : null}
      <li>
        <button
          className="button"
          style={{ padding: "0.3rem 0.85rem", fontSize: "0.85rem" }}
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </button>
      </li>
    </>
  );
}
