import { prisma } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const taskId = getRouterParam(event, "taskId");
  const body = await readBody(event);

  if (!taskId) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthenticated!!" });
  }

  const comment = await prisma.taskComment.create({
    data: {
      taskId,
      userId: session.user.id,
      content: body.content,
    },
  });

  setResponseStatus(event, 201);
  return comment;
});
