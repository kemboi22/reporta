import { markAllAsRead } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const userId = getRouterParam(event, "userId");
  
  if (!userId) {
    throw createError({ statusCode: 400, message: "User ID is required" });
  }

  const result = await markAllAsRead(userId);
  
  return result;
});
