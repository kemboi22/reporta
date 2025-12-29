import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const taskId = getRouterParam(event, "taskId");
  const body = await readBody(event);
  
  if (!taskId) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }

  const checklist = await prisma.taskChecklist.create({
    data: {
      taskId,
      title: body.title,
      isCompleted: false,
      order: 0,
    },
  });
  
  setResponseStatus(event, 201);
  return checklist;
});
