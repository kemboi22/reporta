import { getTemplates } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, workspaceId, isActive } = getQuery(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const where: any = { workspace: { organizationId } };
  
  if (workspaceId) {
    where.workspaceId = workspaceId;
  }
  
  if (isActive !== undefined) {
    where.isActive = isActive === "true";
  }

  const templates = await getTemplates({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where,
  });
  
  return templates;
});
