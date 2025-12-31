import { getInvitationByToken } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, "token");

  if (!token) {
    throw createError({ statusCode: 400, message: "Token is required" });
  }

  const invitation = await getInvitationByToken(token);

  if (!invitation) {
    throw createError({ statusCode: 404, message: "Invitation not found" });
  }

  if (invitation.status !== "PENDING") {
    throw createError({ statusCode: 400, message: "Invitation is not valid" });
  }

  if (invitation.expiresAt < new Date()) {
    throw createError({ statusCode: 400, message: "Invitation has expired" });
  }

  return invitation;
});
