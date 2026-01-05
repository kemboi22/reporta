import { updateStaff } from "~~/server/services";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!organizationId) {
    throw createError({
      statusCode: 400,
      message: "Organization ID is required",
    });
  }
  if (!id) {
    throw createError({ statusCode: 400, message: "Staff ID is required" });
  }

  const currentStaff = await prisma.staff.findUnique({
    where: { id },
    select: { userId: true, email: true },
  });

  if (!currentStaff) {
    throw createError({ statusCode: 404, message: "Staff not found" });
  }

  const staff = await updateStaff(id, organizationId, body);

  if (staff.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  if (currentStaff.userId && (body.email || body.firstName || body.lastName)) {
    const userData: any = {};
    if (body.email) userData.email = body.email;
    if (body.firstName || body.lastName) {
      userData.name = `${body.firstName || staff.firstName} ${body.lastName || staff.lastName}`;
    }
    if (Object.keys(userData).length > 0) {
      await prisma.user.update({
        where: { id: currentStaff.userId },
        data: userData,
      });
    }
  }

  const updatedStaff = await prisma.staff.findUnique({
    where: { id: staff.id },
    include: {
      user: true,
      department: true,
    },
  });

  return updatedStaff;
});
