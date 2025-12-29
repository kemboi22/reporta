import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const taskId = getRouterParam(event, "taskId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Time log ID is required" });
  }

  const timeLog = await prisma.timeLog.update({
    where: { id },
    data: body,
  });
  
  return timeLog;
});
