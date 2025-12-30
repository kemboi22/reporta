import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Staff ID is required" });
  }

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      organization: true,
    },
  });
  
  if (!staff) {
    throw createError({ statusCode: 404, message: "Staff not found" });
  }
  
  if (staff.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return staff;
});
