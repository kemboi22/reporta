import { getDocuments } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, workspaceId, projectId, category, tags } = getQuery(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const where: any = { workspace: { organizationId } };
  
  if (workspaceId) {
    where.workspaceId = workspaceId;
  }
  
  if (projectId) {
    where.projectId = projectId;
  }
  
  if (category) {
    where.category = category;
  }
  
  if (tags) {
    where.tags = {
      hasSome: (tags as string).split(","),
    };
  }

  const documents = await getDocuments({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where,
    orderBy: { createdAt: "desc" },
  });
  
  return documents;
});
