import { getUnreadCount } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const headers = event.headers;
  const cookie = headers.get("cookie");
  const session = await auth.api.getSession({
    headers: cookie ? { cookie } : {},
  });

  if (!session?.user) {
    return { count: 0 };
  }

  const count = await getUnreadCount(session.user.id);
  return { count };
});
