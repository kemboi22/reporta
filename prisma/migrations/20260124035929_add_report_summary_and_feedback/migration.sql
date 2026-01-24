-- AlterTable
ALTER TABLE "report_templates" ADD COLUMN     "feedbackTemplateId" TEXT,
ADD COLUMN     "summaryConfig" JSONB;

-- AddForeignKey
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_feedbackTemplateId_fkey" FOREIGN KEY ("feedbackTemplateId") REFERENCES "report_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
