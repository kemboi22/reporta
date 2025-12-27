import { getUserNotifications } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const userId = getRouterParam(event, "userId");
  const { skip, take, unreadOnly } = getQuery(event);
  
  if (!userId) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }

  const notifications = await getUserNotifications(userId, {
    skip: skip ? Number(skip) : undefined,
    take: take ? Number(take) : undefined,
    unreadOnly: unreadOnly === "true",
  });
  
  return notifications;
});
