import { approveReport } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Report ID is required" });
  }

  const reviewedBy = body.reviewedBy || "system";
  
  const report = await approveReport(id, reviewedBy);
  
  return report;
});
