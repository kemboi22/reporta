import { deleteLeaveRequest } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Leave Request ID is required",
    });
  }

  const leaveRequest = await deleteLeaveRequest(id);

  if (leaveRequest.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return leaveRequest;
});
