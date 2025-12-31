import { createInvitation } from "~~/server/services";
import { auth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const body = await readBody(event);

  if (!organizationId) {
    throw createError({ statusCode: 400, message: "Organization ID is required" });
  }

  const { email, role, departmentId, department, position, employmentType } = body;

  if (!email) {
    throw createError({ statusCode: 400, message: "Email is required" });
  }

  const headers = event.headers;
  const cookie = headers.get("cookie");
  const session = await auth.api.getSession({
    headers: cookie ? { cookie } : {},
  });

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const invitation = await createInvitation({
    organizationId,
    email: email.toLowerCase(),
    role: role || "MEMBER",
    departmentId,
    invitedBy: session.user.id,
    department,
    position,
    employmentType,
  });

  setResponseStatus(event, 201);
  return invitation;
});
