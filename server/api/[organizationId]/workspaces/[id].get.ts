import { getWorkspaceById } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Workspace ID is required" });
  }

  const workspace = await getWorkspaceById(id);
  
  if (!workspace) {
    throw createError({ statusCode: 404, message: "Workspace not found" });
  }
  
  if (workspace.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return workspace;
});
