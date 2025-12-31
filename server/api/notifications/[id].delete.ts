import { deleteNotification } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({ statusCode: 400, message: "Notification ID is required" });
  }

  const headers = event.headers;
  const cookie = headers.get("cookie");
  const session = await auth.api.getSession({
    headers: cookie ? { cookie } : {},
  });

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const notification = await deleteNotification(id);
  return notification;
});
