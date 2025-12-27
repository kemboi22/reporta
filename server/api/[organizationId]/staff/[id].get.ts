import { getStaffById } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Staff ID is required" });
  }

  const staff = await getStaffById(id);
  
  if (!staff) {
    throw createError({ statusCode: 404, message: "Staff not found" });
  }
  
  if (staff.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return staff;
});
