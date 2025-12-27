import { updateStaff } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Staff ID is required" });
  }

  const staff = await updateStaff(id, body);
  
  if (staff.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return staff;
});
