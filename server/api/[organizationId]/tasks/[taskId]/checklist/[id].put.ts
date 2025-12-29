import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const taskId = getRouterParam(event, "taskId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Checklist item ID is required" });
  }

  const checklist = await prisma.taskChecklist.update({
    where: { id },
    data: body,
  });
  
  return checklist;
});
