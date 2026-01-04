import { auth } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/db";
import { z } from "zod";

const updateUserRoleSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
});

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession(event);
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const organizationId = getRouterParam(event, "organizationId");
  const userId = getRouterParam(event, "id");

  if (!organizationId || !userId) {
    throw createError({ statusCode: 400, message: "Missing parameters" });
  }

  const currentOrgUser = session.user.organizations?.find(
    (org: { id: string }) => org.id === organizationId
  );

  if (!currentOrgUser || (currentOrgUser.role !== "ADMIN" && currentOrgUser.role !== "OWNER")) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  const body = await readBody(event);
  const { role } = updateUserRoleSchema.parse(body);

  const organizationUser = await prisma.organizationUser.findFirst({
    where: {
      userId: userId,
      organizationId: organizationId,
    },
  });

  if (!organizationUser) {
    throw createError({ statusCode: 404, message: "User not found in organization" });
  }

  if (organizationUser.role === "OWNER" && role !== "OWNER") {
    throw createError({ statusCode: 400, message: "Cannot change OWNER role" });
  }

  const updatedOrgUser = await prisma.organizationUser.update({
    where: {
      id: organizationUser.id,
    },
    data: {
      role: role,
    },
  });

  return updatedOrgUser;
});
