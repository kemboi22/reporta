import { getTasks } from "~~/server/services";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const { skip, take, status, projectId, assigneeId, workspaceId } = getQuery(event);
  
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
  }

  const tasks = await getTasks({
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    where,
    include: {
      assignees: { include: { user: true } },
      comments: true,
    },
    orderBy: { createdAt: "desc" },
  });
  
  return tasks;
});
