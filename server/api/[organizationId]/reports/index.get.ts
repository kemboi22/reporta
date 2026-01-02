import { getReports } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, status, workspaceId, templateId, orderBy } = getQuery(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const where: any = { workspace: { organizationId } };
  
  if (workspaceId) {
    where.workspaceId = workspaceId;
  }
  
  if (templateId) {
    where.templateId = templateId;
  }
  
  if (status) {
    where.status = status;
  }

  const sortOrder = orderBy === "asc" ? "asc" : "desc";

  const reports = await getReports({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where,
    include: {
      workspace: true,
      template: true,
    },
  });

  return reports.sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
});
