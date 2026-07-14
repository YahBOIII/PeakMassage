-- AlterTable: make userId optional and add guest fields
ALTER TABLE "Appointment" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "Appointment"
  ADD COLUMN "guestName"  TEXT,
  ADD COLUMN "guestEmail" TEXT,
  ADD COLUMN "guestPhone" TEXT;
