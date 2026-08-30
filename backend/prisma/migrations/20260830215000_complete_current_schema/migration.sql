-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'GUEST';

-- AlterTable
-- Defaults make these additions safe for existing technology rows.
ALTER TABLE "technologies"
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Other',
ADD COLUMN "proficiencyLevel" INTEGER NOT NULL DEFAULT 75;

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "description" TEXT,
    "cases" TEXT[],
    "highlights" TEXT[],
    "techStack" JSONB NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);
