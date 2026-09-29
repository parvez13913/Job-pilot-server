/*
  Warnings:

  - Added the required column `resumeId` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CoverLetter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CoverLetter" DROP CONSTRAINT "CoverLetter_userId_fkey";

-- AlterTable
ALTER TABLE "CoverLetter" ADD COLUMN     "resumeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "CoverLetter"("userId");

-- CreateIndex
CREATE INDEX "CoverLetter_resumeId_idx" ON "CoverLetter"("resumeId");

-- CreateIndex
CREATE INDEX "CoverLetter_jobId_idx" ON "CoverLetter"("jobId");

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
