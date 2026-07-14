import { Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getOwnerEmails(): string[] {
  const value = process.env.OWNER_EMAILS ?? process.env.OWNER_EMAIL ?? "";
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const role = getOwnerEmails().includes(email) ? Role.OWNER : Role.CLIENT;

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
