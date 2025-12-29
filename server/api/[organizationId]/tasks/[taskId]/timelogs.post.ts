import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const taskId = getRouterParam(event, "taskId");
  const body = await readBody(event);
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  
  if (!taskId) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }

  const userId = session?.user?.id || "default-user";

  const timeLog = await prisma.timeLog.create({
    data: {
      taskId,
      userId,
      description: body.description,
      startTime: body.startTime ? new Date(body.startTime) : new Date(),
      endTime: body.endTime ? new Date(body.endTime) : undefined,
      duration: body.duration,
    },
  });
  
  setResponseStatus(event, 201);
  return timeLog;
});
