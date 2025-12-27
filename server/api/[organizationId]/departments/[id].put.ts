import { updateDepartment } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Department ID is required" });
  }

  const department = await updateDepartment(id, body);
  
  if (department.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return department;
});
