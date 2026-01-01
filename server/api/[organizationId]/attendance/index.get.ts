import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, staffId, startDate, endDate, status } = getQuery(event);

  if (!organizationId) {
    throw createError({
      statusCode: 400,
      message: "Organization ID is required",
    });
  }

  const where: any = { organizationId };

  if (staffId) {
    where.staffId = staffId;
  }

  if (status) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.checkIn = {};
    if (startDate) where.checkIn.gte = new Date(startDate as string);
    if (endDate) where.checkIn.lte = new Date(endDate as string);
  }

  const attendance = await prisma.attendance.findMany({
    where: {
      ...where,
    },
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    include: {
      staff: true,
      device: true,
    },
    orderBy: { checkIn: "desc" },
  });

  return attendance;
});
