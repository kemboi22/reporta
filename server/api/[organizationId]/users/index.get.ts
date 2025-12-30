import { getUsers } from "~~/server/services";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");

  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const users = await getUsers({
    where: {
      organizationUsers: {
        some: {
          organizationId,
        },
      },
    },
  });

  const usersWithStaff = await Promise.all(
    users.map(async (user) => {
      const staff = await prisma.staff.findFirst({
        where: {
          userId: user.id,
          organizationId,
        },
        include: {
          department: true,
        },
      });

      return {
        ...user,
        staff: staff || null,
      };
    })
  );

  return usersWithStaff;
});
