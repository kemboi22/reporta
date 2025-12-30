import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Report ID is required" });
  }

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      template: true,
      workspace: true,
    },
  });
  
  if (!report) {
    throw createError({ statusCode: 404, message: "Report not found" });
  }
  
  return report;
});
