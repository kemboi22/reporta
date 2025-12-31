import { acceptInvitation } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, "token");

  if (!token) {
    throw createError({ statusCode: 400, message: "Token is required" });
  }

  const headers = event.headers;
  const cookie = headers.get("cookie");
  const session = await auth.api.getSession({
    headers: cookie ? { cookie } : {},
  });

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  try {
    const invitation = await acceptInvitation(token, session.user.id);
    return invitation;
  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message || "Failed to accept invitation" });
  }
});
