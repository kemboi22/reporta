import { prisma } from "../../utils/db";
import { getDashboardData } from "../../services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");

  if (!organizationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Organization ID is required",
    });
  }

  const { auth } = await import("../../utils/auth");
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const organizationUser = await prisma.organizationUser.findFirst({
    where: {
      userId: session.user.id,
      organizationId,
    },
  });

  if (!organizationUser) {
    throw createError({
      statusCode: 403,
      statusMessage: "You don't have access to this organization",
    });
  }

  const userId = session.user.id;
  const userRole = organizationUser.role;

  const data = await getDashboardData(organizationId, userId, userRole);

  return {
    success: true,
    data,
  };
});
