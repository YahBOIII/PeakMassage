import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AppointmentsList from "@/app/components/AppointmentsList";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Appointments",
};

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/appointments");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      userId: session.user.id,
    },
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
        <h1 className="page-head">My Appointments</h1>
        <p className="section-copy">View and cancel your upcoming appointments.</p>
        <AppointmentsList initialAppointments={appointments} />
      </div>
    </section>
  );
}
