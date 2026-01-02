import { getTasks } from "~~/server/services";
import { prisma } from "~~/server/utils/db";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, status, projectId, assigneeId, workspaceId } = getQuery(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  
  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const where: any = {
    workspace: { organizationId },
  };
  
  if (workspaceId) {
    where.workspaceId = workspaceId;
  }
  
  if (projectId) {
    where.projectId = projectId;
  }
  
  if (status) {
    where.status = status;
  }

  if (assigneeId) {
    where.assignees = {
      some: { userId: assigneeId },
    };
  } else if (session?.user?.id) {
    where.assignees = {
      some: { userId: session.user.id },
    };
  }

  const tasks = await getTasks({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where,
    include: {
      assignees: { include: { user: true } },
      comments: true,
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });
  
  return tasks;
});
