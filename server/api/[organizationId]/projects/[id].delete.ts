import { deleteProject } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Project ID is required" });
  }

  const project = await deleteProject(id);
  
  return project;
});
