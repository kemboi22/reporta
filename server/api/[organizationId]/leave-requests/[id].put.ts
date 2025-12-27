import { updateLeaveRequest } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Leave Request ID is required" });
  }

  const leaveRequest = await updateLeaveRequest(id, body);
  
  if (leaveRequest.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return leaveRequest;
});
