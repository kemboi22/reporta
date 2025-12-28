import { getProjectById } from "~~/server/services";
import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, message: "Project ID is required" });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      workspace: true,
      department: true,
      tasks: {
        include: {
          assignees: { include: { user: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      members: { include: { user: true } },
      documents: true,
      milestones: {
        orderBy: { dueDate: 'asc' },
      },
    },
  });

  if (!project) {
    throw createError({ statusCode: 404, message: "Project not found" });
  }

  return project;
});
