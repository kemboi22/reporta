import { markAsRead } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Notification ID is required",
    });
  }

  const notification = await markAsRead(id);

  return notification;
});
