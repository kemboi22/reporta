import { getReportById } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Report ID is required" });
  }

  const report = await getReportById(id);
  
  if (!report) {
    throw createError({ statusCode: 404, message: "Report not found" });
  }
  
  return report;
});
