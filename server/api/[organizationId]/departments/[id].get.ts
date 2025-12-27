import { getDepartmentById } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Department ID is required" });
  }

  const department = await getDepartmentById(id);
  
  if (!department) {
    throw createError({ statusCode: 404, message: "Department not found" });
  }
  
  if (department.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return department;
});
