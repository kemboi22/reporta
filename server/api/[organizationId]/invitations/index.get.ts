import { getPendingInvitations } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");

  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const invitations = await getPendingInvitations(organizationId);
  return invitations;
});
