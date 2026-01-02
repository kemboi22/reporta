import { checkIn } from "~~/server/services";
import { auth } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const body = await readBody(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  if (!session?.user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const staff = await prisma.staff.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
    },
  });

  if (!staff) {
    throw createError({ statusCode: 404, message: "Staff record not found for this user" });
  }

  const attendance = await checkIn({
    ...body,
    staffId: staff.id,
    organizationId,
  });

  setResponseStatus(event, 201);
  return attendance;
});
