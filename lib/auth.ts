import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@prisma/client";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

function getOwnerEmails(): string[] {
  const value = process.env.OWNER_EMAILS ?? process.env.OWNER_EMAIL ?? "";
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isPasswordValid = await compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      if (getOwnerEmails().includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: Role.OWNER },
        });
        user.role = Role.OWNER;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase() },
          select: { id: true, role: true },
        });

        token.id = dbUser?.id;
        token.role = dbUser?.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role | undefined) ?? Role.CLIENT;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
