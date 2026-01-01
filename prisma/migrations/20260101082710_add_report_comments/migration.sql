-- DropIndex
DROP INDEX "staff_userId_key";

-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "status" SET DEFAULT 'SUBMITTED';

-- CreateTable
CREATE TABLE "report_comments" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "report_comments" ADD CONSTRAINT "report_comments_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_comments" ADD CONSTRAINT "report_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
