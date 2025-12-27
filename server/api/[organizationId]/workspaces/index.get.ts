import { getWorkspaces } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, include } = getQuery(event);
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const workspaces = await getWorkspaces({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where: { organizationId },
    include: include ? JSON.parse(include as string) : undefined,
  });
  
  return workspaces;
});
