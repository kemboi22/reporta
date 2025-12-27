export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Attendance ID is required",
    });
  }

  const attendance = await prisma.attendance.findUnique({
    where: { id },
  });

  if (!attendance) {
    throw createError({ statusCode: 404, message: "Attendance not found" });
  }

  if (attendance.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return attendance;
});
