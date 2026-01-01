import { prisma } from "~~/server/utils/db";
import { cacheDel } from "~~/server/utils/redis";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const reportId = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!reportId) {
    throw createError({ statusCode: 400, message: "Report ID is required" });
  }
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthenticated!!" });
  }

  const comment = await prisma.reportComment.create({
    data: {
      reportId,
      userId: session.user.id,
      content: body.content,
    },
    include: {
      user: true,
    },
  });
  await cacheDel(`report:${reportId}`);

  setResponseStatus(event, 201);
  return comment;
});
