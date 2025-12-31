import { markAllAsRead } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const headers = event.headers;
  const cookie = headers.get("cookie");
  const session = await auth.api.getSession({
    headers: cookie ? { cookie } : {},
  });

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const result = await markAllAsRead(session.user.id);
  return result;
});
