import { approveLeaveRequest } from "~~/server/services";

export default defineEventHandler(async (event) => {
  const organizationId = getRouterParam(event, "organizationId");
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const { approvedBy } = body;
  
  if (!id) {
    throw createError({ statusCode: 400, message: "Leave Request ID is required" });
  }

  const leaveRequest = await approveLeaveRequest(id, approvedBy);
  
  if (leaveRequest.organizationId !== organizationId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }
  
  return leaveRequest;
});
