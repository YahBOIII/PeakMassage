import { Role } from "@prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AppointmentsList from "@/app/components/AppointmentsList";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Owner Appointments",
};

export default async function OwnerAppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/owner/appointments");
  }

  if (session.user.role !== Role.OWNER) {
    redirect("/appointments");
  }

  const appointments = await prisma.appointment.findMany({
    include: {
      service: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-head">Owner Appointment Management</h1>
        <p className="section-copy">View and cancel appointments across all clients.</p>
        <AppointmentsList initialAppointments={appointments} ownerView />
      </div>
    </section>
  );
}
